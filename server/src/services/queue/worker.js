import { Worker } from "bullmq";
import Redis from "ioredis";
import redis from "../../config/redis.js";

import Message from "../../models/Message.model.js";
import Ticket from "../../models/Ticket.model.js";
import Order from "../../models/Order.model.js";

import { getAIReply } from "../ai/ai.service.js";
import { createEmbedding } from "../ai/embedding.service.js";
import { findRelevantKnowledge } from "../ai/rag.service.js";
import { incrementMetric } from "../analytics.service.js";

import dotenv from "dotenv";
dotenv.config();

import connectDB from "../../config/db.js";
await connectDB();

const publisher = new Redis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

const emitToRoom = async (room, event, data) => {
  try {
    await publisher.publish(
      "socket:events",
      JSON.stringify({ room, event, data })
    );
    console.log(`DEBUG: Published [${event}] to room [${room}]`);
  } catch (err) {
    console.error("Failed to publish socket event:", err);
  }
};

console.log("Worker file loaded");

const worker = new Worker(
  "ai-processing",
  async (job) => {
    console.log("JOB RECEIVED:", job.data);
    console.log("DEBUG: Worker started processing job");

    const { type } = job.data;
    console.log("STEP 1: Job data parsed");

    // ============================================
    // 1️⃣ CHAT FLOW
    // ============================================
    if (!type || type === "chat") {
      console.log("DEBUG: Entered CHAT FLOW");

      const { message, businessId, conversationId, cacheKey, orderId } = job.data;

      /**
       * ORDER DETECTION
       */
      let orderNumber = null;

      if (orderId) {
        orderNumber = orderId;
        console.log("DEBUG: Order ID from widget:", orderNumber);
      } else {
        const orderMatch = message.match(/order\s*#?([\w-]+)/i);
        orderNumber = orderMatch?.[1] || null;
        console.log("DEBUG: Order match from regex:", orderNumber);
      }

      if (orderNumber) {
        const order = await Order.findOne({ business: businessId, orderNumber });
        console.log("DEBUG: Order lookup result:", order);

        if (order) {
          const reply = `Your order #${order.orderNumber} is currently ${order.status}.\nTracking number: ${order.trackingNumber || "Not available yet"}.`;

          const aiMsg = await Message.create({
            conversation: conversationId,
            sender: "ai",
            content: reply,
          });

          await incrementMetric(businessId, "totalOrderLookups");
          await incrementMetric(businessId, "totalAIResponses");
          await redis.set(cacheKey, reply, "EX", 3600);
          await emitToRoom(conversationId.toString(), "new-message", aiMsg);

          return;
        }
      }

      /**
       * RAG KNOWLEDGE LOOKUP
       */
      console.log("DEBUG: Generating embedding");
      const queryEmbedding = await createEmbedding(message);
      console.log("DEBUG: Embedding generated");

      const context = await findRelevantKnowledge(businessId, queryEmbedding);
      console.log("DEBUG: RAG context lookup result:", context);

      /**
       * AI GENERATION
       */
      const aiResult = await getAIReply(message, context);
      let finalAiReply = aiResult.answer;
      console.log("DEBUG: AI reply prepared:", finalAiReply);

      const confidence = aiResult.confidence ?? 0.5;
      console.log("DEBUG: AI confidence:", confidence);

      /**
       * CONFIDENCE-BASED ESCALATION
       * ✅ Now stores conversationId, aiResponse, and confidenceScore
       */
      if (confidence < 0.6) {
        console.log("DEBUG: Low confidence detected → creating ticket");

        await Ticket.create({
          business: businessId,
          conversation: conversationId,       // ✅ link to conversation
          customerMessage: message,
          aiResponse: finalAiReply,           // ✅ what AI said
          confidenceScore: confidence,        // ✅ why it was escalated
        });

        await incrementMetric(businessId, "totalTicketsCreated");

        finalAiReply +=
          "\n\nI've also opened a support ticket so a human agent can assist you if needed.";
      }

      /**
       * SAVE AI MESSAGE
       */
      console.log("DEBUG: Saving AI message to MongoDB");

      const aiMsg = await Message.create({
        conversation: conversationId,
        sender: "ai",
        content: finalAiReply,
      });

      console.log("DEBUG: AI message saved:", aiMsg._id);

      await incrementMetric(businessId, "totalAIResponses");
      await redis.set(cacheKey, finalAiReply, "EX", 3600);
      console.log("DEBUG: AI response cached in Redis");

      await emitToRoom(conversationId.toString(), "new-message", aiMsg);

      return;
    }

    // ============================================
    // 2️⃣ VOICE FLOW
    // ============================================
    if (type === "voice") {
      console.log("DEBUG: Entered VOICE FLOW");

      const { message, context, history } = job.data;
      const aiResult = await getAIReply(message, context, history);

      console.log("DEBUG: Voice AI result returned");
      return aiResult;
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

console.log("AI Worker started");