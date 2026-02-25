import twilio from "twilio";
import Business from "../models/Business.model.js";
import { createEmbedding } from "../services/ai/embedding.service.js";
import { findRelevantKnowledge } from "../services/ai/rag.service.js";
import redis from "../config/redis.js";

import { Queue, QueueEvents } from "bullmq";

// CONFIG
const BASE_URL =
  "https://subepiglottic-nonrousing-elbert.ngrok-free.dev";

// IMPORTANT: Queue name MUST match worker
const aiQueue = new Queue("ai-processing", { connection: redis });
const queueEvents = new QueueEvents("ai-processing", { connection: redis });

/**
 * 1️⃣ Handle Incoming Call
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
 * 2️⃣ Process Caller Speech
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

    const twiml = new twilio.twiml.VoiceResponse();

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
     * 2️⃣ Load Memory
     */
    let history = await redis.get(memoryKey);
    history = history ? JSON.parse(history) : [];

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

    const previousHistory = history.slice(0, -1);

    /**
     * 4️⃣ PUSH TO QUEUE (VOICE JOB)
     */
    const job = await aiQueue.add("voice-job", {
      type: "voice",
      message: userSpeech,
      context,
      history: previousHistory,
    });

    const aiResult = await job.waitUntilFinished(queueEvents);

    let answer = aiResult.answer;
    const confidence = aiResult.confidence ?? 0.5;

    if (confidence < 0.6) {
      answer +=
        " I am not completely sure. A human agent will assist you soon.";
    }

    /**
     * 5️⃣ Save Memory
     */
    history.push({
      role: "assistant",
      content: answer,
    });

    await redis.set(memoryKey, JSON.stringify(history));
    await redis.expire(memoryKey, 1800);

    /**
     * 6️⃣ Respond
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