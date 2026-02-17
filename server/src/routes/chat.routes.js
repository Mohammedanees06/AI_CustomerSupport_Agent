import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/message", authMiddleware, sendMessage);
router.get("/history/:businessId", authMiddleware, getChatHistory);

export default router;
