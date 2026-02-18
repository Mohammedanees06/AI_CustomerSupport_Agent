import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import cors from "cors";
import passport from "passport";
import "./config/passport.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chat.routes.js";
import businessRoutes from "./routes/business.routes.js";
import { initSocket } from "./config/socket.js";
import "./config/redis.js";
import knowledgeRoutes from "./routes/knowledge.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import orderRoutes from "./routes/order.routes.js";



connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

// app.use routes should generally come before starting the server
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);


// 1. Assign the result of app.listen to 'server'
const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);


initSocket(server);