import Message from "../models/Message.model.js";
import Ticket from "../models/Ticket.model.js";
import Order from "../models/Order.model.js";

import { getIO } from "../config/socket.js";
import redis from "../config/redis.js";

import { getAIReply } from "../services/ai/ai.service.js";
import { createEmbedding } from "../services/ai/embedding.service.js";
import { findRelevantKnowledge } from "../services/ai/rag.service.js";
import { incrementMetric } from "../services/analytics.service.js";
import { aiQueue } from "../services/queue/ai.queue.js";



/**
 * ==========================================================
 * SEND MESSAGE CONTROLLER
 * Handles:
 * - Redis caching
 * - Order lookup
 * - RAG knowledge lookup
 * - Ticket escalation
 * - AI response
 * - Real-time socket emit
 * ==========================================================
 */

export const sendMessage = async (req, res) => {
  try {
    const { message, businessId } = req.body;

    if (!message || !businessId) {
      return res
        .status(400)
        .json({ message: "Message and Business ID required" });
    }

    const cacheKey = `chat:${businessId}:${message}`;

    // CHECK REDIS CACHE (Cost Optimization Layer)
    // If same question asked before → avoid AI cost
    try {
      const cachedReply = await redis.get(cacheKey);
      if (cachedReply) {
        return res.json({
          userMessage: { sender: "user", content: message },
          aiMessage: { sender: "ai", content: cachedReply },
        });
      }
    } catch {}

    //  SAVE USER MESSAGE. Every incoming message must be stored
    const userMsg = await Message.create({
      business: businessId,
      sender: "user",
      content: message,
    });

    await incrementMetric(businessId, "totalMessages");

    //  ORDER DETECTION (Structured DB Query)
    // If question contains order number → skip AI & RAG
    const orderMatch = message.match(/order\s*#?(\w+)/i);

    if (orderMatch) {
      const orderNumber = orderMatch[1];

      const order = await Order.findOne({
        business: businessId,
        orderNumber,
      });

      if (order) {
        const reply = `Your order #${order.orderNumber} is currently ${order.status}.
        Tracking number: ${order.trackingNumber || "Not available yet"}.`;

        const aiMsg = await Message.create({
          business: businessId,
          sender: "ai",
          content: reply,
        });

        await incrementMetric(businessId, "totalOrderLookups");
        await incrementMetric(businessId, "totalAIResponses");

        // Cache structured reply too
        try {
          await redis.set(cacheKey, reply, "EX", 3600);
        } catch {}

        // Emit socket
        try {
          const io = getIO();
          io.to(businessId.toString()).emit("new-message", userMsg);
          io.to(businessId.toString()).emit("new-message", aiMsg);
        } catch {}

        return res.status(200).json({
          userMessage: userMsg,
          aiMessage: aiMsg,
        });
      }
    }

    //  RAG KNOWLEDGE LOOKUPFor policy / FAQ type questions
    const queryEmbedding = await createEmbedding(message);
    const context = await findRelevantKnowledge(businessId, queryEmbedding);

    // ESCALATION LOGIC, If no knowledge found → create support ticket

    if (!context) {
      await Ticket.create({
        business: businessId,
        customerMessage: message,
      });

      await incrementMetric(businessId, "totalTicketsCreated");
    }

    // GENERATE AI RESPONSE
    const aiReply = await getAIReply(message, context);

    const aiMsg = await Message.create({
      business: businessId,
      sender: "ai",
      content: aiReply,
    });

    await incrementMetric(businessId, "totalAIResponses");

    // CACHE AI RESPONSE
    try {
      await redis.set(cacheKey, aiReply, "EX", 3600);
    } catch {}

    // REAL-TIME SOCKET UPDATE
    try {
      const io = getIO();
      io.to(businessId.toString()).emit("new-message", userMsg);
      io.to(businessId.toString()).emit("new-message", aiMsg);
    } catch {}

    res.status(201).json({
      userMessage: userMsg,
      aiMessage: aiMsg,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Chat failed" });
  }
};

/**
 * Async AI Processing (Queue-based)
 * This does NOT run AI directly.
 * It pushes job to BullMQ worker.
 */
export const sendMessageAsync = async (req, res) => {
  try {
    const { message, businessId } = req.body;

    if (!message || !businessId) {
      return res
        .status(400)
        .json({ message: "Message and Business ID required" });
    }

    const cacheKey = `chat:${businessId}:${message}`;

    // Check Redis cache first
    try {
      const cachedReply = await redis.get(cacheKey);
      if (cachedReply) {
        return res.json({
          userMessage: { sender: "user", content: message },
          aiMessage: { sender: "ai", content: cachedReply },
        });
      }
    } catch {}

    // Save user message
    const userMsg = await Message.create({
      business: businessId,
      sender: "user",
      content: message,
    });

    await incrementMetric(businessId, "totalMessages");

    // Add job to queue
    await aiQueue.add("process-message", {
      message,
      businessId,
      cacheKey
    });

    return res.status(202).json({
      message: "Message queued successfully",
      userMessage: userMsg
    });

  } catch (error) {
    console.error("Async Chat error:", error);
    res.status(500).json({ message: "Async chat failed" });
  }
};

/**GET CHAT HISTORY  */
export const getChatHistory = async (req, res) => {
  try {
    const { businessId } = req.params;

    const messages = await Message.find({ business: businessId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};
