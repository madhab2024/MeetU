import express, { urlencoded } from "express";
import {createServer} from "node:http";
import {Server} from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import {conectToSocket} from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";

const app = express();

// CORS configuration for Express routes
// For production, replace '*' with your frontend URL (e.g., 'https://yourdomain.com')
app.use(cors({
    origin: "*", // Allow all origins in development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));
dotenv.config();
app.use(express.json({limit:"40kb"}))
app.use(express.urlencoded({limit:"40kb", extended:true}));
app.set("port", (process.env.PORT || 8000))



app.use('/api/v1/users', userRoutes)


const server = createServer(app);
const io = conectToSocket(server);
async function start() {
    try {
        const connectionDb = await mongoose.connect("mongodb+srv://madhab2005:madhab@cluster0.yh4vxmu.mongodb.net/");
        console.log(`MONGO DB CONNECTED ON ${connectionDb.connection.host}`);
        server.listen(app.get('port'), ()=>{
            console.log("listening on Port 8000")
        })
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
}

start();