import axios from 'axios';

import { Subject } from 'rxjs'; // essentially adds a custom event listener within your js app kinda like socket.io LMAO
import { io } from "socket.io-client";

// if you ever face an error simply just delete the .data

// Base URL for Kong API Gateway
const KONG_BASE_URL = import.meta.env.VITE_KONG_BASE_URL || 'http://localhost:8000';
console.log(import.meta.env.VITE_KONG_BASE_URL);
// Axios instance for Kong API Gateway
const api = axios.create({
    baseURL: KONG_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Socket.IO client setup
const SOCKET_IO_URL = import.meta.env.VITE_SOCKET_IO_URL || 'http://localhost:3300'; 
const socket = io(SOCKET_IO_URL);

// Log connection status
socket.on("connect", () => {
    console.log("✅ Connected to Socket.IO server");
});

socket.on("connect_error", (error) => {
    console.error("❌ Socket.IO connection error:", error);
});
// Export the socket instance JIC
export const socketInstance = socket;

// Notification Stream
const notificationSubject = new Subject<any>();
export const listenForNotifications = () => {
    socket.on("notification", (data) => {
        // console.log(data)
        notificationSubject.next(data); // Emit the notification data
    });
};
// Adds a listener for react hooks to listen to realtime change
export const getNotifications = () => notificationSubject.asObservable();

// Queue Updates Stream
const queueUpdateSubject = new Subject<any>();
export const ioQueueUpdates = (callback: any) => {
    socket.on("QAdded", (data: any) => {
        console.log("Queue item added:", data);
        callback({ action: "added", data });
    });

    socket.on("Qdeleted", (data: any) => {
        console.log("Queue item deleted:", data);
        callback({ action: "deleted", data });
    });
};
export const getQueueUpdates = () => queueUpdateSubject.asObservable();

// All Queue Updates Stream
const queueAllSubject = new Subject<any>();
export const ioAllQueue = (callback: any) => {
    socket.on("receivedAllQueue", (data: any) => {
        console.log("All queue items:", data);
        callback(data);
    });
};
export const allQueueUpdates = () => queueAllSubject.asObservable();
    

// Order Food Service (Routed through Kong)
export const orderFood = {
    healthCheck: async () => {
        const response = await api.get('/order-food');
        return response.data;
    },

    getAllOrders: async () => {
        const response = await api.get('/order-food/order/all');
        return response.data;
    },

    getOrdersByFilter: async (userId: string, orderId: string, restaurant: string ) => {
        let attach = ''
        if (userId != ''){
            attach = attach.concat(`uid=${userId}&`)
        }
        if (orderId != ''){
            attach = attach.concat(`oid=${orderId}&`)
        }
        if (restaurant !=''){
            attach = attach.concat(`restaurant=${restaurant}7`)
        }
        
        attach = attach.slice(0, -1)

        const response = await api.get(`/order-food/order/graborder?${attach}`);

        // const response = await api.get(`/order-food/order/graborder?uid=${userId}&restaurant=${restaurant}&oid=${orderId}`);

        return response.data;
    },
    cancelOrder: async (orderId: string, restaurant: string) => {
        const response = await api.put(`/order-food/order/cancel/${orderId}/${restaurant}`);
        return response.data;
    },

    addOrder: async (orderData: any) => {
        const response = await api.post('/order-food/order/addorder', orderData);
        return response;
    }
};

export const Credits = {
    getUserCredits: async (userId: string) => {
        const response = await api.get(`/order-food/order/credits/${userId}`);
        return response.data;
    },
}

export const Queue = {
    getRestaurantQueue: async (restaurant: string) => {
        const response = await api.get(`/queue/${restaurant}`);
        return response.data;
    },

    getAllQueue: async () => {
        const response = await api.get(`/queue/all`);
        return response.data;
    }
}

export const Payment = {
    healthCheck: async () => {
        const response = await api.get('/order-food');
        return response.data;
    },
    createCheckout: async (data: any) => {
        const response = await api.post('/payment/create-checkout-session', data)
        return response
    },
    sessionStatus: async (sessionId: string) => {
        const response = await api.get(`/payment/session-status?session_id=${sessionId}`)
        return response
    }
    
}


// Complete Order Service (Routed through Kong)
export const completeOrder = {
    healthCheck: async () => {
        const response = await api.get('/complete-order');
        return response.data;
    },
    completeOrder: async (orderId: string, orderData: any) => {
        const response = await api.post(`/complete-order/${orderId}/completed`, orderData);
        return response.data;
    },
    cancelOrder: async (orderId: string, orderData: any) => {
        const response = await api.post(`/complete-order/${orderId}/cancelled`, orderData);
        return response.data;
    },
};


// Recommend Food Service (Routed through Kong)
export const recommendFood = {
    healthCheck: async () => {
        const response = await api.get('/reccomend-food');
        return response.data;
    },
    getChatGPTRecommendations: async (userId: string) => {
        const response = await api.post(`/reccomend-food/chatgpt/${userId}`);
        return response.data;
    },
};

// these die die have to have .data
export const Menu = {
    getAllMenuItems: async () => {
        const response = await api.get('/menu/all');
        return response.data;
    },
    getMenuByRestaurant: async (restaurant: string) =>  {
        const response = await api.get(`/menu/${restaurant}`);
        return response.data;      
    }
    
}


export default api;