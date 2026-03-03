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
 * AI WORKER (Conversation-Isolated Version)
 * ============================================================
 * - Does NOT save user message (controller already did)
 * - Saves AI message under conversation
 * - Emits to conversation room
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

      const { message, businessId, conversationId, cacheKey } = job.data;

      const io = getIO();

      /**
       * ============================================
       * ORDER DETECTION
       * ============================================
       */
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
            conversation: conversationId,
            sender: "ai",
            content: reply
          });

          await incrementMetric(businessId, "totalOrderLookups");
          await incrementMetric(businessId, "totalAIResponses");

          await redis.set(cacheKey, reply, "EX", 3600);

          io.to(conversationId.toString()).emit("new-message", aiMsg);

          return;
        }
      }

      /**
       * ============================================
       * RAG KNOWLEDGE LOOKUP
       * ============================================
       */
      const queryEmbedding = await createEmbedding(message);
      const context = await findRelevantKnowledge(businessId, queryEmbedding);

      /**
       * ============================================
       * AI GENERATION
       * ============================================
       */
      const aiResult = await getAIReply(message, context);

      let finalAiReply = aiResult.answer;
      const confidence = aiResult.confidence ?? 0.5;

      /**
       * ============================================
       * CONFIDENCE-BASED ESCALATION
       * ============================================
       */
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
        conversation: conversationId,
        sender: "ai",
        content: finalAiReply
      });

      await incrementMetric(businessId, "totalAIResponses");

      await redis.set(cacheKey, finalAiReply, "EX", 3600);

      io.to(conversationId.toString()).emit("new-message", aiMsg);

      return;
    }

    // ============================================
    // 2️⃣ VOICE FLOW (unchanged)
    // ============================================
    if (type === "voice") {

      const { message, context, history } = job.data;

      const aiResult = await getAIReply(
        message,
        context,
        history
      );

      return aiResult;
    }
  },
  {
    connection: redis,
    concurrency: 5
  }
);

console.log("AI Worker started");