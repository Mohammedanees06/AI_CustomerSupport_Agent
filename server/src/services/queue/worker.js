import { Worker } from "bullmq";
import redis from "../../config/redis.js";

import Message from "../../models/Message.model.js";
import Ticket from "../../models/Ticket.model.js";
import Order from "../../models/Order.model.js";

import { getAIReply } from "../ai/ai.service.js";
import { createEmbedding } from "../ai/embedding.service.js";
import { findRelevantKnowledge } from "../ai/rag.service.js";
import { incrementMetric } from "../analytics.service.js";

import { getIO } from "../../config/socket.js";
import dotenv from "dotenv";
dotenv.config();
/**
 * ============================================================
 * AI WORKER
 * ============================================================
 * Runs in background.
 * Handles:
 * - Order detection
 * - RAG knowledge lookup
 * - Confidence-based escalation
 * - Ticket creation
 * - Analytics tracking
 * - Real-time socket updates
 * ============================================================
 */

console.log("Worker file loaded");
const worker = new Worker(
  "ai-processing",
  async (job) => {

    const { type } = job.data;

    // ============================================
    // 1️⃣ CHAT FLOW 
    // ============================================
    if (!type || type === "chat") {

      const { message, businessId } = job.data;

      // SAVE USER MESSAGE
      const userMsg = await Message.create({
        business: businessId,
        sender: "user",
        content: message
      });

      await incrementMetric(businessId, "totalMessages");

      const io = getIO();
      io.to(businessId.toString()).emit("new-message", userMsg);

      // ORDER DETECTION
      const orderMatch = message.match(/order\s*#?(\w+)/i);

      if (orderMatch) {
        const orderNumber = orderMatch[1];

        const order = await Order.findOne({
          business: businessId,
          orderNumber
        });

        if (order) {
          const reply = `Your order #${order.orderNumber} is currently ${order.status}.
Tracking number: ${order.trackingNumber || "Not available yet"}.`;

          const aiMsg = await Message.create({
            business: businessId,
            sender: "ai",
            content: reply
          });

          await incrementMetric(businessId, "totalOrderLookups");
          await incrementMetric(businessId, "totalAIResponses");

          io.to(businessId.toString()).emit("new-message", aiMsg);

          return;
        }
      }

      // RAG
      const queryEmbedding = await createEmbedding(message);
      const context = await findRelevantKnowledge(businessId, queryEmbedding);

      // AI
      const aiResult = await getAIReply(message, context);

      let finalAiReply = aiResult.answer;
      const confidence = aiResult.confidence ?? 0.5;

      if (confidence < 0.6) {
        await Ticket.create({
          business: businessId,
          customerMessage: message
        });

        await incrementMetric(businessId, "totalTicketsCreated");

        finalAiReply +=
          "\n\nI've also opened a support ticket so a human agent can assist you if needed.";
      }

      const aiMsg = await Message.create({
        business: businessId,
        sender: "ai",
        content: finalAiReply
      });

      await incrementMetric(businessId, "totalAIResponses");

      io.to(businessId.toString()).emit("new-message", aiMsg);

      return;
    }

    // ============================================
    // 2️⃣ VOICE FLOW 
    // ============================================
    if (type === "voice") {

      const { message, context, history } = job.data;

      const aiResult = await getAIReply(
        message,
        context,
        history
      );

      return aiResult; // IMPORTANT for waitUntilFinished
    }

  },
  {
    connection: redis,
    concurrency: 5
  }
  
);
console.log(" AI Worker started");