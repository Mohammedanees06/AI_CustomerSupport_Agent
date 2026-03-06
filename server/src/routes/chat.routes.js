import express from "express";
import { sendMessage, getChatHistory,sendMessageAsync, getConversations, createConversation,agentReply } from "../controllers/chat.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { businessRateLimiter } from "../middlewares/rateLimit.middleware.js";



const router = express.Router();

router.post("/message", authMiddleware, sendMessage);
router.get("/history/:conversationId", authMiddleware, getChatHistory);
// router.post("/message-async", authMiddleware,businessRateLimiter, sendMessageAsync);
router.get("/conversations/:businessId", getConversations);
// router.post("/conversation", createConversation);


router.post("/message-async", businessRateLimiter, sendMessageAsync);
router.post("/conversation", createConversation);
router.post("/agent-reply", authMiddleware, agentReply);

export default router;
