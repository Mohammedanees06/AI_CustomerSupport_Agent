import twilio from "twilio";
import Business from "../models/Business.model.js";
import Order from "../models/Order.model.js";
import { createEmbedding } from "../services/ai/embedding.service.js";
import { findRelevantKnowledge } from "../services/ai/rag.service.js";
import redis from "../config/redis.js";
import { Queue, QueueEvents } from "bullmq";

const BASE_URL = "https://subepiglottic-nonrousing-elbert.ngrok-free.dev";

const aiQueue = new Queue("ai-processing", { connection: redis });
const queueEvents = new QueueEvents("ai-processing", { connection: redis });

export const handleIncomingCall = async (req, res) => {
  console.log("📞 Incoming call webhook hit");
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say("Hello! Welcome to AI Customer Support. Please tell me how I can help you.");
  twiml.gather({
    input: "speech",
    action: `${BASE_URL}/api/voice/process`,
    method: "POST",
    speechTimeout: "auto",
  });
  res.type("text/xml");
  res.send(twiml.toString());
};

export const processSpeech = async (req, res) => {
  try {
    console.log("🎤 processSpeech hit");
    const userSpeech = req.body.SpeechResult;
    const callSid = req.body.CallSid;
    const twilioNumber =
      req.body.Direction === "outbound-api" ? req.body.From : req.body.To;

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

    const business = await Business.findOne({ twilioNumber });
    if (!business) {
      twiml.say("This business is not configured properly.");
      return res.type("text/xml").send(twiml.toString());
    }

    let history = await redis.get(memoryKey);
    history = history ? JSON.parse(history) : [];
    history.push({ role: "user", content: userSpeech });

    const queryEmbedding = await createEmbedding(userSpeech);
    const context = await findRelevantKnowledge(business._id, queryEmbedding);
    const previousHistory = history.slice(0, -1);

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
      answer += " I am not completely sure. A human agent will assist you soon.";
    }

    history.push({ role: "assistant", content: answer });
    await redis.set(memoryKey, JSON.stringify(history));
    await redis.expire(memoryKey, 1800);

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

export const callCustomer = async (req, res) => {
  try {
    const { businessId, phoneNumber, orderId } = req.body;

    if (!businessId || !phoneNumber) {
      return res.status(400).json({ message: "businessId and phoneNumber required" });
    }

    // ✅ Normalize phone — add +91 if no country code provided
    const normalizedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`;

    const business = await Business.findById(businessId);
    if (!business || !business.twilioNumber) {
      return res.status(400).json({ message: "Business not configured for voice" });
    }

    let greetingContext = "";
    if (orderId) {
      const order = await Order.findOne({ business: businessId, orderNumber: orderId });
      if (order) {
        greetingContext = `order:${orderId}:${order.status}:${order.trackingNumber || "no-tracking"}`;
      }
    }

    if (greetingContext) {
      await redis.set(`voice:pending:${normalizedPhone}`, greetingContext, "EX", 300);
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const call = await client.calls.create({
      to: normalizedPhone, // ✅ normalized with country code
      from: business.twilioNumber,
      url: `${BASE_URL}/api/voice/call`,
    });

    console.log("📞 Outbound call initiated:", call.sid);
    res.json({ message: "Call initiated successfully", callSid: call.sid });
  } catch (err) {
    console.error("❌ Call customer error:", err.message);
    res.status(500).json({ message: "Failed to initiate call" });
  }
};