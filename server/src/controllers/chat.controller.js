import Message from "../models/Message.model.js";
import Conversation from "../models/conversation.model.js";
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
 * - Conversation creation / validation
 * - Redis caching
 * - Order lookup
 * - RAG knowledge lookup
 * - Ticket escalation
 * - AI response
 * - Real-time socket emit (conversation room)
 * ==========================================================
 */

export const sendMessage = async (req, res) => {
  try {
    const { message, businessId, conversationId } = req.body;

    if (!message || !businessId) {
      return res
        .status(400)
        .json({ message: "Message and Business ID required" });
    }

    /**
     * ==========================================================
     * 1️⃣ ENSURE CONVERSATION EXISTS
     * If conversationId provided → validate
     * If not → create new conversation
     * ==========================================================
     */

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        businessId,
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
    } else {
      conversation = await Conversation.create({
        businessId,
        customerId: "anonymous", // Replace later with session/user id
      });
    }

    const cacheKey = `chat:${conversation._id}:${message}`;

    /**
     * ==========================================================
     * 2️⃣ CHECK REDIS CACHE (Cost Optimization Layer)
     * If same question asked before → avoid AI cost
     * ==========================================================
     */
    try {
      const cachedReply = await redis.get(cacheKey);
      if (cachedReply) {
        return res.json({
          conversationId: conversation._id,
          userMessage: { sender: "user", content: message },
          aiMessage: { sender: "ai", content: cachedReply },
        });
      }
    } catch {}

    /**
     * ==========================================================
     * 3️⃣ SAVE USER MESSAGE
     * Every incoming message must be stored
     * ==========================================================
     */
    const userMsg = await Message.create({
      conversation: conversation._id,
      sender: "user",
      content: message,
    });

    await incrementMetric(businessId, "totalMessages");

    /**
     * ==========================================================
     * 4️⃣ ORDER DETECTION (Structured DB Query)
     * If question contains order number → skip AI & RAG
     * ==========================================================
     */
    const orderMatch = message.match(/order\s*#?(\w+)/i);

    if (orderMatch) {
      const orderNumber = orderMatch[1];

      const order = await Order.findOne({
        business: businessId,
        orderNumber,
      });

      if (order) {
        const reply = `Your order #${order.orderNumber} is currently ${order.status}.Tracking number: ${order.trackingNumber || "Not available yet"}.`;

        const aiMsg = await Message.create({
          conversation: conversation._id,
          sender: "ai",
          content: reply,
        });

        await incrementMetric(businessId, "totalOrderLookups");
        await incrementMetric(businessId, "totalAIResponses");

        // Cache structured reply too
        try {
          await redis.set(cacheKey, reply, "EX", 3600);
        } catch {}

        // Emit to conversation room (NOT business room)
        const io = getIO();
        io.to(conversation._id.toString()).emit("new-message", userMsg);
        io.to(conversation._id.toString()).emit("new-message", aiMsg);

        return res.status(200).json({
          conversationId: conversation._id,
          userMessage: userMsg,
          aiMessage: aiMsg,
        });
      }
    }

    /**
     * ==========================================================
     * 5️⃣ RAG KNOWLEDGE LOOKUP
     * For policy / FAQ type questions
     * ==========================================================
     */
    const queryEmbedding = await createEmbedding(message);
    const context = await findRelevantKnowledge(businessId, queryEmbedding);

    /**
     * ==========================================================
     * 6️⃣ ESCALATION LOGIC
     * If no knowledge found → create support ticket
     * ==========================================================
     */
    if (!context) {
      await Ticket.create({
        business: businessId,
        customerMessage: message,
      });

      await incrementMetric(businessId, "totalTicketsCreated");
    }

    /**
     * ==========================================================
     * 7️⃣ GENERATE AI RESPONSE
     * ==========================================================
     */
    const aiReply = await getAIReply(message, context);

    const aiMsg = await Message.create({
      conversation: conversation._id,
      sender: "ai",
      content: aiReply,
    });

    await incrementMetric(businessId, "totalAIResponses");

    /**
     * ==========================================================
     * 8️⃣ CACHE AI RESPONSE
     * ==========================================================
     */
    try {
      await redis.set(cacheKey, aiReply, "EX", 3600);
    } catch {}

    /**
     * ==========================================================
     * 9️⃣ REAL-TIME SOCKET UPDATE
     * Emit to conversation room
     * ==========================================================
     */
    const io = getIO();
    io.to(conversation._id.toString()).emit("new-message", userMsg);
    io.to(conversation._id.toString()).emit("new-message", aiMsg);

    res.status(201).json({
      conversationId: conversation._id,
      userMessage: userMsg,
      aiMessage: aiMsg,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ message: "Chat failed" });
  }
};

/**
 * ==========================================================
 * Async AI Processing (Queue-based)
 * This does NOT run AI directly.
 * It pushes job to BullMQ worker.
 * ==========================================================
 */
export const sendMessageAsync = async (req, res) => {
  try {
    const { message, businessId, conversationId } = req.body;

    if (!message || !businessId) {
      return res
        .status(400)
        .json({ message: "Message and Business ID required" });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        businessId,
      });

      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
    } else {
      conversation = await Conversation.create({
        businessId,
        customerId: "anonymous",
      });
    }

    const normalized = message.trim().toLowerCase();
    const cacheKey = `chat:${conversation._id}:${normalized}`;

    // Check Redis cache first
    try {
      const cachedReply = await redis.get(cacheKey);
      if (cachedReply) {
        return res.json({
          conversationId: conversation._id,
          userMessage: { sender: "user", content: message },
          aiMessage: { sender: "ai", content: cachedReply },
        });
      }
    } catch {}

    // Save user message
    const userMsg = await Message.create({
      conversation: conversation._id,
      sender: "user",
      content: message,
    });

    await incrementMetric(businessId, "totalMessages");

    // Add job to queue
    await aiQueue.add("process-message", {
      message,
      businessId,
      conversationId: conversation._id,
      cacheKey,
    });

    return res.status(202).json({
      conversationId: conversation._id,
      message: "Message queued successfully",
      userMessage: userMsg,
    });
  } catch (error) {
    console.error("Async Chat error:", error);
    res.status(500).json({ message: "Async chat failed" });
  }
};

/**
 * ==========================================================
 * GET CHAT HISTORY (Conversation-based)
 * ==========================================================
 */
export const getChatHistory = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch history" });
  }
};

export const getConversations = async (req, res) => {
  try {
    const { businessId } = req.params;
    console.log("Fetching conversations for:", businessId); // add this

    const conversations = await Conversation.find({
      businessId: businessId,
    }).sort({ updatedAt: -1 });

    console.log("Found:", conversations.length); // add this
    res.json(conversations);
  } catch (error) {
    console.error("Fetch conversations error:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
};