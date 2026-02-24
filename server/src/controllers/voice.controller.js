import twilio from "twilio";
import Business from "../models/Business.model.js";

import { getAIReply } from "../services/ai/ai.service.js";
import { createEmbedding } from "../services/ai/embedding.service.js";
import { findRelevantKnowledge } from "../services/ai/rag.service.js";
import redis from "../config/redis.js";

/**
 * ============================================
 * CONFIG
 * ============================================
 */
const BASE_URL =
  "https://subepiglottic-nonrousing-elbert.ngrok-free.dev";

/**
 * ============================================
 * 1️⃣ Handle Incoming Call
 * ============================================
 */
export const handleIncomingCall = async (req, res) => {
  console.log("📞 Incoming call webhook hit");

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(
    "Hello! Welcome to AI Customer Support. Please tell me how I can help you."
  );

  twiml.gather({
    input: "speech",
    action: `${BASE_URL}/api/voice/process`,
    method: "POST",
    speechTimeout: "auto",
  });

  res.type("text/xml");
  res.send(twiml.toString());
};

/**
 * ============================================
 * 2️⃣ Process Caller Speech
 * ============================================
 */
export const processSpeech = async (req, res) => {
  try {
    console.log("🎤 processSpeech hit");

    const userSpeech = req.body.SpeechResult;
    const callSid = req.body.CallSid;

    const twilioNumber =
      req.body.Direction === "outbound-api"
        ? req.body.From
        : req.body.To;

    const memoryKey = `voice:call:${callSid}`;

    console.log("Caller said:", userSpeech);
    console.log("Twilio number:", twilioNumber);

    const twiml = new twilio.twiml.VoiceResponse();

    // 🔁 If speech not detected
    if (!userSpeech) {
      twiml.say("Sorry, I did not catch that. Please try again.");

      twiml.gather({
        input: "speech",
        action: `${BASE_URL}/api/voice/process`,
        method: "POST",
        speechTimeout: "auto",
      });

      return res.type("text/xml").send(twiml.toString());
    }

    /**
     * 1️⃣ Find Business
     */
    const business = await Business.findOne({ twilioNumber });

    if (!business) {
      twiml.say("This business is not configured properly.");
      return res.type("text/xml").send(twiml.toString());
    }

    /**
     * 2️⃣ Load Conversation Memory
     */
    let history = await redis.get(memoryKey);
    history = history ? JSON.parse(history) : [];

    // Add current user message
    history.push({
      role: "user",
      content: userSpeech,
    });

    /**
     * 3️⃣ RAG
     */
    const queryEmbedding = await createEmbedding(userSpeech);

    const context = await findRelevantKnowledge(
      business._id,
      queryEmbedding
    );

    /**
     * 4️⃣ AI
     * Pass:
     * - current userSpeech
     * - context
     * - previous history (excluding latest message)
     */
    const previousHistory = history.slice(0, -1);

    const aiResult = await getAIReply(
      userSpeech,
      context,
      previousHistory
    );

    let answer = aiResult.answer;
    const confidence = aiResult.confidence ?? 0.5;

    if (confidence < 0.6) {
      answer +=
        " I am not completely sure. A human agent will assist you soon.";
    }

    /**
     * 5️⃣ Save Updated History
     */
    history.push({
      role: "assistant",
      content: answer,
    });

    await redis.set(memoryKey, JSON.stringify(history));
    await redis.expire(memoryKey, 1800); // 30 minutes TTL

    /**
     * 6️⃣ Respond + Gather Again
     */
    twiml.say(answer);

    twiml.gather({
      input: "speech",
      action: `${BASE_URL}/api/voice/process`,
      method: "POST",
      speechTimeout: "auto",
    });

    res.type("text/xml");
    res.send(twiml.toString());

  } catch (error) {
    console.error("❌ Voice processing error:", error);

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say("Sorry, something went wrong. Please try again later.");

    res.type("text/xml");
    res.send(twiml.toString());
  }
};