import express from "express";
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from './lib/db.js';
import path from 'path';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app, server } from "./lib/socket.js";

//const app = express();
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();


app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ limit: '15mb', extended: true }));

app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    })
}



server.listen(PORT, ()=>{
    console.log(`server listen at: http://localhost:${PORT}`);
    connectDB();
});

