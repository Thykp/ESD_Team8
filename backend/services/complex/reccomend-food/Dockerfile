# Use the official Golang image
FROM golang:1.24-alpine AS builder

# Install required dependencies
RUN apk add --no-cache git ca-certificates

# Set working directory
WORKDIR /app

# Copy only Go module files first (to cache dependencies)
COPY go.mod go.sum ./

# Debug: Show module files
RUN cat go.mod && cat go.sum

# Ensure module download works
RUN go mod tidy && go mod download

# Copy the application source code
COPY . .

# Build the Go application
RUN go build -o reccomend-food .

# Use a minimal image for the final container
FROM alpine:latest

# Install CA certificates for TLS
RUN apk --no-cache add ca-certificates

# Set working directory
WORKDIR /root/

# Copy the built application from the builder stage
COPY --from=builder /app/reccomend-food .

# Expose the port
EXPOSE 8080

# Run the application
CMD ["./reccomend-food"]
