package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/streadway/amqp" // RabbitMQ client library
)

// Helper function to connect to RabbitMQ
func connectToRabbitMQ() (*amqp.Connection, error) {

	rabbitMQURL := os.Getenv("RABBITMQ_URL")
    if rabbitMQURL == "" {
        // Provide a default value if the environment variable is not set
        rabbitMQURL = "amqp://guest:guest@rabbitmq:5672"
    }
    conn, err := amqp.Dial(rabbitMQURL)
    if err != nil {
        return nil, fmt.Errorf("failed to connect to RabbitMQ: %v", err)
    }
    return conn, nil

}

// Helper function to publish a message to RabbitMQ
func publishToQueue(conn *amqp.Connection, queueName string, message []byte) error {

    // Open a channel
    ch, err := conn.Channel()
    if err != nil {
        return fmt.Errorf("failed to open a channel: %v", err)
    }
    defer ch.Close()

    // Assert the queue (ensures the queue exists, creates it if necessary)
    _, err = ch.QueueDeclare(
        queueName, // Queue name
        true,      // Durable: Survives broker restarts
        false,     // Auto-delete: Deleted when no consumers
        false,     // Exclusive: Used by only one connection
        false,     // No-wait: Non-blocking
        nil,       // Arguments: Optional configuration
    )
    if err != nil {
        return fmt.Errorf("failed to assert queue: %v", err)
    }

    // Publish the message directly to the queue using the default exchange
    err = ch.Publish(
        "",         // Exchange: Use the default exchange
        queueName,  // Routing key: Matches the queue name
        false,      // Mandatory: Return undeliverable messages
        false,      // Immediate: Fail if no consumer is available
        amqp.Publishing{
            ContentType: "application/json",
            Body:        message,
        },
    )
	fmt.Println("lgtm")
    if err != nil {
        return fmt.Errorf("failed to publish a message: %v", err)
    }

    return nil

}

func main() {

	// intialise your gin instance
	server := gin.Default() // := declare and assign a value

	server.GET("/", func(ctx *gin.Context) { // ctx here is your context
		// this is what shows on webpages
		ctx.JSON(200, gin.H{ // gin.H is the response body
			"message": "Hello! Complete-Order is running! 🚀",
		})
	})

	// takes in a post req of the json where the user has completed his order and
	// from the frontend and updates the notifcation + queue + outsystems accordingly
	server.POST("/:oid/:action", func(ctx *gin.Context) {
		// The id in the param refers to USER ID etc kendrick/subrah
		oid := ctx.Param("oid")
		action := ctx.Param("action")

		// Make sure the Request body is Readable
		body, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "failed to read request body"})
			return
		}
		defer ctx.Request.Body.Close() // Ensure the body is closed after reading

		var payloadData map[string]interface{}
		if err := json.Unmarshal(body, &payloadData); err != nil {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "invalid JSON payload"})
			return
		}

		// WaitGroup to synchronize Goroutines
		var wg sync.WaitGroup

		// Channel to collect errors from Goroutines
		errChan := make(chan error, 4)

		// Goroutine 1: Update Order's Status
		wg.Add(1)
		go func(oid string, action string) {
			defer wg.Done()
			// Create URL
			orderURL := os.Getenv("ORDER_URL")
			if orderURL == "" {
				orderURL = fmt.Sprintf("http://order:6369/update/%s/%s", oid, action)
			}

			fmt.Println("Calling OrderAPI:", orderURL)

			// Empty string represented as a byte slice
			emptyBody := []byte("")

			// Create a new PUT request
			req, err := http.NewRequest("PUT", orderURL, bytes.NewBuffer(emptyBody))
			if err != nil {
				errChan <- fmt.Errorf("failed to create PUT request: %v", err)
				return
			}

			// Send to Client
			client := &http.Client{}
			resp, err := client.Do(req)
			if err != nil {
				errChan <- fmt.Errorf("failed to send data to OrderAPI: %v", err)
				return
			}
			defer resp.Body.Close()

			// Check if Ok
			if resp.StatusCode != http.StatusOK {
				errChan <- fmt.Errorf("OrderAPI returned status: %s", resp.Status)
				return
			}

			fmt.Println("Order Status Updated successfully.")
		}(oid, action)

		// Goroutine 2: Delete from Queue
		wg.Add(1)
		go func(payloadData interface{}, oid string) {
			defer wg.Done()

			// need to assert type
			queueDataMap, ok := payloadData.(map[string]interface{})
			if !ok {
				errChan <- fmt.Errorf("invalid type for payloadData: expected map[string]interface{}")
				return
			}

			toQueueMap := map[string]interface{}{
				"restaurant": queueDataMap["restaurant"],
				"order_id":   oid,
			}

			toQueue, err := json.Marshal(toQueueMap)
			if err != nil {
				errChan <- fmt.Errorf("failed to marshal queue data: %v", err)
				return
			}

			queueURL := os.Getenv("QUEUE_URL")
			if queueURL == "" {
				queueURL = "http://queue:8008/delete"
			}

			fmt.Println("Calling QueueAPI:", queueURL)
			resp, err := http.Post(queueURL, "application/json", bytes.NewBuffer(toQueue))
			if err != nil {
				errChan <- fmt.Errorf("failed to send data to QueueAPI: %v", err)
				return
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusOK {
				errChan <- fmt.Errorf("QueueAPI returned status: %s", resp.Status)
				return
			}

			fmt.Println("Queue data processed successfully.")
		}(payloadData, oid)

		// Goroutine 3: Publish to RabbitMQ
		wg.Add(1)
		go func(payloadData interface{}, oid string, action string) {

			MQDataMap, ok := payloadData.(map[string]interface{})
			if !ok {
				errChan <- fmt.Errorf("invalid type for payloadData: expected map[string]interface{}")
				return
			}
			defer wg.Done()

			conn, err := connectToRabbitMQ()
			if err != nil {
				errChan <- fmt.Errorf("failed to connect to RabbitMQ: %v", err)
				return
			}
			defer conn.Close()

			// Your message formmatting
			var message string

			if action == "cancelled" {
				message = fmt.Sprintf("We regret to inform you that your order %s from %s has been unfortunately been cancelled due to %s. As compensation we have added %s to total credits which you can use on your next purchase! ", oid, MQDataMap["restaurant"], MQDataMap["message"], MQDataMap["total"]) // probably works otherwise change thge %s to %f
			} else if action == "completed" {
				message = fmt.Sprintf("Your order of %s from %s has been successfully completed and is ready for pickup! %s", oid, MQDataMap["restaurant"], MQDataMap["message"])
			} else {
				message = ""
			}

			// Throw Error if message is empty (failsafe)
			if message == "" {
				errChan <- fmt.Errorf("failed to create to message")
				return
			}

			rabbitMQData := map[string]interface{}{
				"message":  message,
				"type":     "notification",
				"user_id":  MQDataMap["user_id"], //ie Kendrick
				"order_id": oid,                  // ie 18
			}

			toRabbitMQ, err := json.Marshal(rabbitMQData)
			if err != nil {
				errChan <- fmt.Errorf("failed to marshal RabbitMQ data: %v", err)
				return
			}

			if err := publishToQueue(conn, "notifications", toRabbitMQ); err != nil {
				errChan <- fmt.Errorf("failed to publish to RabbitMQ: %v", err)
				return
			}

			fmt.Println("Notification published to RabbitMQ successfully.")
		}(payloadData, oid, action)

		// Goroutine 4: Update Credits (Oustsystems)
		wg.Add(1)
		go func(payloadData interface{}, action string) {
			defer wg.Done()

			// Only proceed if the action is cancelled
			if action != "cancelled" {
				fmt.Println("Goroutine 4: Action is", action, ". Exiting early.")
				return
			}

			OutsysDataMap, ok := payloadData.(map[string]interface{})
			if !ok {
				errChan <- fmt.Errorf("invalid type for payloadData: expected map[string]interface{}")
				return
			}

			// fmt.Println(OutsysDataMap["user_id"])
			// fmt.Println(OutsysDataMap["total"])

			outsysURL := fmt.Sprintf("https://personal-3mms7vqv.outsystemscloud.com/CreditMicroservice/rest/RESTAPI1/credit?userid=%s&credit=%f", OutsysDataMap["user_id"], OutsysDataMap["total"])
			fmt.Println("Calling Outsystems:", outsysURL)

			// fmt.Println(outsysURL)

			req, err := http.NewRequest("POST", outsysURL, nil)
			if err != nil {
				errChan <- fmt.Errorf("failed to create POST request: %v", err)
				return
			}

			client := &http.Client{Timeout: 10 * time.Second}
			resp, err := client.Do(req)
			if err != nil {
				errChan <- fmt.Errorf("failed to send POST request: %v", err)
				return
			}
			defer resp.Body.Close()

			if resp.StatusCode != http.StatusOK {
				errChan <- fmt.Errorf("OutSystems returned status: %s", resp.Status)
				return
			}

			fmt.Println("OutSystems updated successfully.")
		}(payloadData, action)

		// Wait for all Goroutines to finish
		go func() {
			wg.Wait()
			close(errChan)
		}()

		// Collect errors from Goroutines
		for err := range errChan {
			log.Println("Error:", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		// Return success response
		ctx.JSON(http.StatusOK, gin.H{
			"message": "Complete Order processing completed successfully.",
		})
	})

	log.Println("Starting server on :7070")
	if err := server.Run(":7070"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}
