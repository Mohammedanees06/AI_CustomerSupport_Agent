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
import monitorRoutes from "./routes/monitor.routes.js";
import voiceRoutes from "./routes/voice.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import adminRoutes from "./routes/admin.routes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();

// ✅ Updated CORS — allows dashboard, Twilio, and widget requests from any customer site
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);                        // curl, mobile, server-to-server
    if (origin === process.env.CLIENT_URL) return callback(null, true); // your React dashboard
    if (origin === "https://api.twilio.com") return callback(null, true); // Twilio voice
    return callback(null, true);                                     // widget on any customer website
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// ✅ Serve embeddable widget — must be before API routes
app.get("/widget.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Access-Control-Allow-Origin", "*");
  const filePath = path.join(__dirname, "widget.js");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Widget file error:", err);
      return res.status(404).send("Not found");
    }
    res.send(data);
  });
});
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/monitor", monitorRoutes);
app.use("/api/voice", voiceRoutes);
app.use("/api/admin", adminRoutes);


const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

// app.get("/flush-cache", async (req, res) => {
//   const redis = (await import("./config/redis.js")).default;
//   await redis.flushall();
//   res.json({ message: "Cache cleared" });
// });

initSocket(server);

