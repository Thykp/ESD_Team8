import "https://deno.land/std@0.128.0/dotenv/load.ts";

// Import the Supabase client from esm.sh
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

//Import Socket.io from CDN
// import { io } from "https://esm.sh/socket.io-client@4.7.2";
// if got error 
import { io } from "https://esm.sh/socket.io-client@4.7.2";

import { Hono } from "@hono/hono";

// intialise suppbase cred
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_KEY");
const supabase = createClient(supabaseUrl, supabaseKey);

//connecting to socket.io via docker else if not abalible on localhost port 3300
const socket = io(Deno.env.get("SOCKET_IO_URL") || "http://localhost:3300", {
    reconnection: true, // Enable automatic reconnection
});

//Create API framework
const app = new Hono();

// Basically get the Qstatus
async function qstatus() {
    const holder = {};
    try {
        const { data, error } = await supabase.rpc('get_all_tables');

        if (error) {
            throw new Error(`Supabase error: ${error.message}`); // Handle query errors <button class="citation-flag" data-index="2"><button class="citation-flag" data-index="4">
        }

        // Step 2: Fetch Supabase data for each key
        for (let entry of data) {
            var key = entry['name']
            const { data: tableData, error } = await supabase
                .from(key)
                .select("*");
            if (error) throw new Error(`Supabase error [${key}]: ${error.message}`);
            holder[key] = tableData;
        }

        socket.emit("allQueue", {data: holder, type: 'queue'});
        // Make sure the data has been successfully sent
        console.log('Queue Data Succesfully Sent 🚀🚀🚀🚀')

        return holder
    } catch (error) {
        // Return error response
        console.error("Request failed:", error);
        // return c.json({ error: error.message }, 500);
    }
}


//Check service is alive 
app.get("/", (c) => {
    return c.text('alive (AW yeah 😎😎)');
});

// Manually gets the data from the file upon being called (get all the queue )
app.get("/qStatus", async (c) => {

    try {
        // if smth is async ya need to add the await so it actually waits and not immdiiately runs
        let allq = await qstatus()

        // Return success response
        return c.json({data: allq, type: "queue"}, 200);
    } catch (error) {
        // Return error response
        console.error("Request failed:", error);
        return c.json({ error: error.message }, 500);
    }
});


app.post("/dump", async (c) => {
    const { food, restaurant, id, action } = await c.req.json();
    // if data is recceived from the 
    if (action == "add") {

        // Insert data into Supabase
        const { data: insertedData, error } = await supabase
            .from(restaurant.toLowerCase())
            .insert([
                {
                    food: food,
                    user_id: id,
                },
            ])
            .select();

        if (error) {
            return c.json({ error: error.message }, 500);
        }

        // Sends dagta to Socket.IO clients
        socket.emit("addQueue", { restaurant, data: insertedData, type: 'queue'});

        // Comfirms that the queue has been added => order comfirmation basically
        return c.json({ message: `Added (➕) Queue to ${restaurant}`, data: insertedData });
    }

    console.log(action)
    // if data is received from the client => order is doner => gotta delete the order from db
    if (action == "delete") {
        // Delete data from Supabase
        const { data: deletedData, error } = await supabase
            .from(restaurant.toLowerCase())
            .delete()
            .eq("id", id)
            .select();

        if (error) {
            return c.json({ error: error.message }, 500);
        }

        // Notify Socket.IO clients
        socket.emit("deleteQueue", { restaurant, data: deletedData, type: 'queue'});
        return c.json({ message: `Deleted (➖) Queue from ${restaurant}` , data: deletedData });
    }

    // Send all queue
    qstatus()

    return c.json({ error: "Invalid action" }, 400);
});

//Send data of all queue every 20000ms or 0.33 of a min
// just like with jn you gotta put async otherwise it won't wait for the function LOL
setInterval(async () => {
    qstatus()
}, 20000);

// receive comfirmation from socket.io that add order has received
socket.on("receivedAllQueue", (a) => {
    console.log("📩 Sever has Received Added Data:", a);
});

// receive comfirmation from socket.io that add order has received
socket.on("QAdded", (a) => {
    console.log("📩 Sever has Received Added Data:", a);
});

// receive comfirmation from socket.io delete order has been received
socket.on("Qdeleted", (d) => {
    console.log("📩 Sever has Received Deleted Data:", d);
});

// changed from 8008 -> 5000 in order to serve in docker properly 
Deno.serve({ hostname: "0.0.0.0", port: 8008 }, app.fetch);