import Message from "../models/Message.model.js";
import { getIO } from "../config/socket.js";
import redis from "../config/redis.js";
import { getAIReply } from "../services/ai/ai.service.js";
import { createEmbedding } from "../services/ai/embedding.service.js";
import { findRelevantKnowledge } from "../services/ai/rag.service.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, businessId } = req.body;

    console.log("\n=== NEW CHAT REQUEST ===");
    console.log("📩 Message:", message);
    console.log("🏢 Business ID:", businessId);

    // 1️⃣ VALIDATION
    if (!message || !businessId) {
      return res
        .status(400)
        .json({ message: "Message and Business ID are required" });
    }

    // Create a unique cache key (business + question)
    const cacheKey = `chat:${businessId}:${message}`;

    // Check if reply already exists in Redis
    const cachedReply = await redis.get(cacheKey);

    if (cachedReply) {
      console.log("✅ Reply served from Redis (CACHED)");

      return res.status(200).json({
        userMessage: {
          sender: "user",
          content: message,
        },
        aiMessage: {
          sender: "ai",
          content: cachedReply,
        },
      });
    }

    console.log("💾 No cache found, generating new response...");

    // Save user message
    const userMsg = await Message.create({
      business: businessId,
      sender: "user",
      content: message,
    });
    console.log("✅ User message saved to DB");

    // 🔹 Create embedding for user question
    console.log("🔄 Creating embedding...");
    const queryEmbedding = await createEmbedding(message);
    console.log(`✅ Embedding created (${queryEmbedding.length} dimensions)`);

    // 🔹 Find relevant business knowledge
    console.log("🔍 Searching knowledge base...");
    const context = await findRelevantKnowledge(businessId, queryEmbedding);
    
    console.log("📚 Context type:", typeof context);
    console.log("📚 Context length:", context?.length || 0);
    console.log("📚 Context preview:", context?.substring(0, 200) || "NULL/EMPTY");

    // 🔹 Ask Gemini with context (RAG)
    console.log("🤖 Calling Gemini API...");
    const aiReply = await getAIReply(message, context);
    console.log("✅ AI Reply received:", aiReply.substring(0, 100) + "...");

    // Save AI message
    const aiMsg = await Message.create({
      business: businessId,
      sender: "ai",
      content: aiReply,
    });
    console.log("✅ AI message saved to DB");

    // Cache the response
    await redis.set(cacheKey, aiReply, "EX", 60 * 60);
    console.log("✅ Response cached in Redis");

    // Emit socket events
    try {
      const io = getIO();
      const roomName = businessId.toString();

      io.to(roomName).emit("new-message", userMsg);
      io.to(roomName).emit("new-message", aiMsg);
      console.log("✅ Socket events emitted");
    } catch (socketError) {
      console.error("⚠️ Socket emit failed:", socketError.message);
    }

    console.log("=== REQUEST COMPLETE ===\n");

    res.status(201).json({
      userMessage: userMsg,
      aiMessage: aiMsg,
    });
  } catch (error) {
    console.error("❌ Chat error:", error);
    res.status(500).json({ message: "Chat failed", error: error.message });
  }
};

// ================== GET CHAT HISTORY ==================
export const getChatHistory = async (req, res) => {
  try {
    const { businessId } = req.params;

    if (!businessId) {
      return res.status(400).json({ message: "Business ID is required" });
    }

    const messages = await Message.find({ business: businessId }).sort({
      createdAt: 1,
    });

    res.json(messages);
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ message: "Failed to fetch history" });
  }
};