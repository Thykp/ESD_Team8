require('dotenv').config();
const axios = require("axios");

async function getOrder(RecieptNo) {

    try {

        const response = await axios.get(`https://personal-3mms7vqv.outsystemscloud.com/OrderMicroservice/rest/OrderService/order?RecieptNo=${RecieptNo}`);

        return response.data;
        
    } catch (error) {
        console.error("Error getting order history:", error.response ? error.response.data : error.message);
        throw error;
    }
    
}

async function getOrderHistory(userId) {

    try {

        const response = await axios.get(`https://personal-3mms7vqv.outsystemscloud.com/OrderMicroservice/rest/OrderService/orderhistory?userId=${userId}`);

        return response.data;
        
    } catch (error) {
        console.error("Error getting order history:", error.response ? error.response.data : error.message);
        throw error;
    }
    
}

async function makeOrder(userId, orderDetails) {
    try {
        const response = await axios.post(
            `https://personal-3mms7vqv.outsystemscloud.com/OrderMicroservice/rest/OrderService/order?userId=${userId}`, 
            orderDetails,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error making order:", error.response ? error.response.data : error.message);
        throw error;
    }
}

async function cancelOrder(RecieptNo) {

    try {

        const response = await axios.put(`https://personal-3mms7vqv.outsystemscloud.com/OrderMicroservice/rest/OrderService/order/cancel?RecieptNo=${RecieptNo}`);

        return response.data;
        
    } catch (error) {
        console.error("Error getting order history:", error.response ? error.response.data : error.message);
        throw error;
    }
    
}

async function completeOrder(RecieptNo) {

    try {

        const response = await axios.put(`https://personal-3mms7vqv.outsystemscloud.com/OrderMicroservice/rest/OrderService/order/complete?RecieptNo=${RecieptNo}`);

        return response.data;
        
    } catch (error) {
        console.error("Error getting order history:", error.response ? error.response.data : error.message);
        throw error;
    }
    
}

module.exports = {
    getOrder,
    getOrderHistory,
    makeOrder,
    cancelOrder,
    completeOrder
};






