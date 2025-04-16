## Instructions
```bash
go run main.go
```

<h1>How to Use</h1>

<h2>Order Completed</h2>

>POST Request
>http://127.0.0.1:7070/order_id/cancelled #Store Cancel Order 
>http://127.0.0.1:7070/order_id/completed #Store Complete Order


<h3>Example</h3>

<h4>URL</h4>
http://127.0.0.1:7070/909fff87-e51c-4ecf-aa18-0dba89e0c54f/cancelled

<h4>Expected Payload</h4>

//Gawd damn i really streamlined it a lot LOL
```json
{
    "restaurant" : "Nasi_Lemak_Ayam_Taliwang",
    "total" : 7,
    "user_id" : "Ewan",

    "reason": "Lack of Ingredient", //Cancelled Order
    //OR
    "reason": "Thank you for Choosing us!" //Completed order
}
```

<h4>Console Output</h4>

```bash
Notification published to RabbitMQ successfully.
Queue data processed successfully.
Order Status Updated successfully.
```

<h4>What it sends to Order MicroService</h4>

http://order:6369/update/909fff87-e51c-4ecf-aa18-0dba89e0c54f/cancelled


<h4>What it sends to Queue MicroService</h4>

```json
{
    "restaurant" : "Nasi_Lemak_Ayam_Taliwang",
    "order_id" : "909fff87-e51c-4ecf-aa18-0dba89e0c54f"
}
```

<h4>What it send to RabbitMQ</h4>

```json
{
    "message": "We regret to inform you that your order c9ba07bb-7b45-40e3-9643-2a276d331e26 from Nasi_Lemak_Ayam_Taliwang has been unfortunately cancelled due to Lack of Ingredient. As compensation, we have added 7.000000 to your total credits, which you can use on your next purchase!",
    "order_id": "c9ba07bb-7b45-40e3-9643-2a276d331e26",
    "type": "notification",
    "user_id": "Kendrick"
}
```

<h4>How it Works</h4> 
- Sends a Delete Order to Update Queue Microservice DB
- Sends a Notification to RabbitMQ
- Sends a PUT Request to Order MS to update order Status


### Debugging 
```bash
go mod download #gets all the required modules
```