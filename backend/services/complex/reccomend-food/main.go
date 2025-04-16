package main

import (
    "bytes"
    "encoding/base64"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"

    "github.com/gin-gonic/gin"
)

func fetchAPIData(apiURL string) ([]byte, error) {
    resp, err := http.Get(apiURL)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    body, readErr := ioutil.ReadAll(resp.Body)
    if readErr != nil {
        return nil, readErr
    }

    return body, nil
}

// Helper function to check if a string is base64-encoded
func isBase64(data []byte) bool {
    _, err := base64.StdEncoding.DecodeString(string(data))
    return err == nil
}

// Decode base64 if necessary
func decodeBase64IfNeeded(data []byte) ([]byte, error) {
    if isBase64(data) {
        decoded, err := base64.StdEncoding.DecodeString(string(data))
        if err != nil {
            return nil, fmt.Errorf("failed to decode base64: %w", err)
        }
        return decoded, nil
    }
    return data, nil
}

// Parse dynamic data and ensure it's plain JSON
func parseDynamicData(Data []byte) (interface{}, error) {
    // Decode base64 if necessary
    decodedData, err := decodeBase64IfNeeded(Data)
    if err != nil {
        return nil, err
    }

    // Try parsing as a map
    var asMap map[string]interface{}
    if err := json.Unmarshal(decodedData, &asMap); err == nil {
        return asMap, nil
    }

    // Try parsing as an array
    var asArray []interface{}
    if err := json.Unmarshal(decodedData, &asArray); err == nil {
        return asArray, nil
    }

    // If neither works, return an error
    return nil, fmt.Errorf("failed to parse JSON: unknown structure")
}

func main() {
    router := gin.Default()

    router.GET("/", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "Hello, World! Gin server is running 🚀",
        })
    })

    router.POST("/chatgpt/:id", func(c *gin.Context) {
        id := c.Param("id")
        if id == "" {
            c.JSON(http.StatusBadRequest, gin.H{"error": "Missing ID parameter"})
            return
        }

		// NO TYPE ASSERTION 
		// Create channels to receive results from Goroutines
		orderHistoryChan := make(chan interface{})
		menuChan := make(chan interface{})
		recommendationChan := make(chan interface{})
        errorChan := make(chan error, 3) // Buffered channel to collect errors

        // Fetch order history in a Goroutine
        go func(id string) {
            data, err := fetchAPIData(fmt.Sprintf("http://order:6369/orders?uid=%s", id))
            if err != nil {
                errorChan <- err
                return
            }

			// Parse the JSON dynamically
			parsedData, parseErr := parseDynamicData(data)
			if parseErr != nil {
				errorChan <- fmt.Errorf("failed to parse order history data: %w", parseErr)
				return
			}
		
			orderHistoryChan <- parsedData

        }(id)

        // Fetch menu data in a Goroutine
        go func() {
            data, err := fetchAPIData("http://menu:5001/all")
            if err != nil {
                errorChan <- err
                return
            }

			// Parse the JSON dynamically
			parsedData, parseErr := parseDynamicData(data)
			if parseErr != nil {
				errorChan <- fmt.Errorf("failed to parse order history data: %w", parseErr)
				return
			}

			menuChan <- parsedData
        }()

        // Fetch recommendation data in a Goroutine
        go func(id string) {
            data, err := fetchAPIData(fmt.Sprintf("http://reccomendation:4000/recommendation/%s", id))
            if err != nil {
                errorChan <- err
                return
            }

			// Parse the JSON dynamically
			parsedData, parseErr := parseDynamicData(data)
			if parseErr != nil {
				errorChan <- fmt.Errorf("failed to parse order history data: %w", parseErr)
				return
			}

			recommendationChan <- parsedData
        }(id)

        // Collect results or handle errors
        var orderHistoryData, menuData, recommendationData interface{}
        for range 3 {
			// select here "listens" ie checks for each of the cases => if any of them return true it runs (like mutiple if statements)
            select {
				case err := <-errorChan:
					c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Failed to fetch data: %v", err)})
					return
				case orderHistoryData = <-orderHistoryChan:
				case menuData = <-menuChan:
				case recommendationData = <-recommendationChan:
            }
        }

        // Prepare request data
        requestData := map[string]interface{}{
            "foodHistory":    orderHistoryData,
            "menulisting":    menuData,
            "recommendation": recommendationData,
        }

        requestBody, err := json.Marshal(requestData)
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request body"})
            return
        }

        // Call the FastAPI endpoint
        apiURL := "http://chatgpt:3000/reccomend"
        fmt.Println("Calling FastAPI:", apiURL)

        resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(requestBody))
        if err != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
            return
        }
        defer resp.Body.Close()

        body, readErr := ioutil.ReadAll(resp.Body)
        if readErr != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response"})
            return
        }

        var responseData map[string]interface{}
        jsonErr := json.Unmarshal(body, &responseData)
        if jsonErr != nil {
            c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid JSON response"})
            return
        }

        c.JSON(http.StatusOK, responseData)
    })

    router.Run(":8080")
}
