import { Hono } from "hono";

import { createClient } from '@supabase/supabase-js';
import client from 'prom-client';

// Intialise supabase cred
const supabaseUrl = Bun.env.SUPABASE_URL;
const supabaseKey = Bun.env.SUPABASE_KEY;

// Default system metrics (CPU, memory, etc.)
client.collectDefaultMetrics();

// Custom counter
const requestCounter = new client.Counter({
  name: 'order_requests_total',
  help: 'Total HTTP requests to the order service',
  labelNames: ['method', 'path'],
});

// Error Handling
if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing required environment variables: SUPABASE_URL or SUPABASE_KEY");
}

//Show it is running 
console.log('index.ts Serving at Port 6369 👀🤔🤧😤🔥☺️🤥💀')

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Intiliase Hono Instance
const app = new Hono()

//Check service is alive 
app.get("/", (c) => {
    return c.text('alive (AW yeah 😎😎)');
});


// get order based on all
app.get("/orders", async (ctx) => {
    // Extract optional query parameters
    const uid = ctx.req.query('uid'); // Query parameter for user ID
    const oid = ctx.req.query('oid'); // Query parameter for order ID
    const restaurant = ctx.req.query('restaurant') // Query parameter for Restraunt

    // Start building the query
    let query = supabase.from('orders').select('*');

    // Add filters conditionally

    // Filter by user ID if provided
    if (uid) {
        query = query.eq('user_id', uid);
    }

    // Filter by order ID if provided
    if (oid) {
        query = query.eq('order_id', oid); 
    }

    // Filter by Restraunts if provided
    if (restaurant) {
        query = query.eq('restaurant', restaurant); 
    }

    // Execute the query
    const { data, error } = await query;

    // Handle errors
    if (error) {
        return ctx.json({ message: 'Error fetching orders', error }, 500);
    }

    // Return the results
    return ctx.json(data);
});


// Update order status to whatever you want
app.put("/update/:oid/:status", async (ctx) => {
    const oid = ctx.req.param('oid')
    const status = ctx.req.param('status')
    // const body = await ctx.req.json();

    // if (Object.keys(body).length === 0) {
    //     return ctx.json({ message: 'No fields provided for update' }, 400);
    // }

    // Update only the fields provided in the request body
    const { data, error } = await supabase
        .from('orders') // Specify the table name
        .update({"status" : status})  // Update the status
        .eq('order_id', oid)  // Match the record by ID
        .select();     // Return the updated record

    if (error) {
        return ctx.json({ message: 'Error updating post', error }, 500);
    }

    return ctx.json(data[0]); // Return the updated post
})

// Add New Order to it 
app.post("/add", async (ctx) => {
    const body = await ctx.req.json();

    if (Object.keys(body).length === 0) {
        return ctx.json({ message: 'No fields provided for addition' }, 400);
    }

    // Update only the fields provided in the request body
    const { data, error } = await supabase
        .from('orders') // Specify the table name
        .insert( body ) // insert table 
        .select();     // Return the new table record

    if (error) {
        return ctx.json({ message: 'Error adding post', error }, 500);
    }

    return ctx.json(data[0]); // Return the updated post
})


// sum cute console stuff to show when request are being made
Bun.serve({
    fetch: async (request) => {
        const url = new URL(request.url);
        console.log(`Incoming request: ${request.method} ${url.pathname}`);
    
        // Count request (skip /metrics to avoid recursion)
        if (url.pathname !== "/metrics") {
          requestCounter.labels({ method: request.method, path: url.pathname }).inc();
        }
    
        // Serve metrics manually
        if (url.pathname === "/metrics") {
          const metrics = await client.register.metrics();
          return new Response(metrics, {
            headers: {
              "Content-Type": client.register.contentType,
            },
          });
        }
    
        try {
            return await app.fetch(request); // Pass the request to Hono
        } catch (error) {
            console.error('Error handling request:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    },
    port: 6369,
});