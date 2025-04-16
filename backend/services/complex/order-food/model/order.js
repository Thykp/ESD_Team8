require('dotenv').config();
const axios = require("axios");
const amqp = require("amqplib");

// Uses env variable from docker if available, otherwise use localhost with guest credentials
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";

async function SendRabbitMQ(message) {
    let connection = null
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue("notifications");
        console.log("✅ Connected to RabbitMQ");

        const success = channel.sendToQueue('notifications', Buffer.from(JSON.stringify(message)));
        if (success) {
            console.log(`Message successfully sent to the 'notifications' queue: ${message}`);
        } else {
            console.error(`Failed to send message to the 'notifications' queue`);
        }

        return message

    } catch (error) {
        // Error Handling
        console.error("❌ Error occurred while connecting to RabbitMQ or publishing the message:", error.message);
    } 
    // finally {
    //     // Close the connection to free resources
    //     if (connection) {
    //         try {
    //             await connection.close();
    //             console.log("✅ RabbitMQ connection closed");
    //         } catch (closeError) {
    //             console.error("❌ Error occurred while closing RabbitMQ connection:", closeError.message);
    //         }
    //     }
    // }
}

async function getAllOrders() {

    try {

        const response = await axios.get(`http://order:6369/orders`);

        return response.data;

    } catch (error) {
        console.error("Error getting all orders:", error.response ? error.response.data : error.message);
        throw error;
    }

}

async function getOrder(uid, oid, restaurant) {
    try {
        const response = await axios.get(`http://order:6369/orders?oid=${oid}&uid=${uid}&restaurant=${restaurant}`)

        return response.data
    }
    catch (error) {
        console.error("Error getting Order history:", error.response ? error.response.data : error.message);
        throw error;
    }
}


async function cancelOrder(oid) {

    try {

        const response = await axios.put(`http://order:6369/update/${oid}/cancelled`);

        return response.data;

    } catch (error) {
        console.error("Error updating status:", error.response ? error.response.data : error.message);
        throw error;
    }

}

async function cancelQ(oid, restaurant) {

    try {

        const content = {
            restaurant: restaurant,
            order_id: oid
        }

        const response = await axios.post(`http://queue:8008/delete`, content);

        return response.data;

    } catch (error) {
        console.error("Error updating status:", error.response ? error.response.data : error.message);
        throw error;
    }

}

async function addQ(qContent) {

    try {

        const response = await axios.post(`http://queue:8008/add`, qContent);

        return response.data;

    } catch (error) {
        console.error("Error updating status:", error.response ? error.response.data : error.message);
        throw error;
    }

}

async function addOrder(orderContent) {

    const storage = []
    try {

        for (content of orderContent){
            let response = await axios.post(`http://order:6369/add`, content);
            storage.push(response.data)
        }

        return storage;

    } catch (error) {
        console.error("Error updating status:", error.response ? error.response.data : error.message);
        throw error;
    }

}

async function getCredits(uid) {

    try {

        const response = await axios.get(`https://personal-3mms7vqv.outsystemscloud.com/CreditMicroservice/rest/RESTAPI1/credit?UserId=${uid}`);

        return response.data;

    } catch (error) {
        console.error("Error updating status:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function useCredits(creditsContent) {

    const { uid, credit } = creditsContent

    try {

        const response = await axios.put(`https://personal-3mms7vqv.outsystemscloud.com/CreditMicroservice/rest/RESTAPI1/credit?userid=${uid}&credit=${credit}`);

        return response.data;

    } catch (error) {
        console.error("Error updating status:", error.response ? error.response.data : error.message);
        throw error;
    }

}

module.exports = {
    getAllOrders,
    getOrder,
    cancelOrder,
    addOrder,
    useCredits,
    getCredits,
    cancelQ,
    addQ,
    SendRabbitMQ
};






