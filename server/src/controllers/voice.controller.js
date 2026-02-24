import twilio from "twilio";
import Business from "../models/Business.model.js";

import { getAIReply } from "../services/ai/ai.service.js";
import { createEmbedding } from "../services/ai/embedding.service.js";
import { findRelevantKnowledge } from "../services/ai/rag.service.js";
import mongoose from "mongoose";

/**
 * =====================================================
 * 1️⃣ Handles incoming phone call
 * =====================================================
 */
export const handleIncomingCall = async (req, res) => {
  console.log("handleIncomingCall hit!");
  console.log("Body:", req.body);

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(
    "Hello! Welcome to AI Customer Support. Please tell me how I can help you."
  );

  twiml.gather({
    input: "speech",
    action:
      "https://subepiglottic-nonrousing-elbert.ngrok-free.dev/api/voice/process",
    method: "POST",
    speechTimeout: "auto",
  });

  res.type("text/xml");
  res.send(twiml.toString());
};


/**
 * =====================================================
 * 2️⃣ Processes caller speech
 * =====================================================
 */
export const processSpeech = async (req, res) => {
  try {
    const userSpeech = req.body.SpeechResult;
    const twilioNumber =
  req.body.Direction === "outbound-api"
    ? req.body.From
    : req.body.To; //Twilio number

    console.log("Caller said:", userSpeech);
    console.log("Twilio number:", twilioNumber);

    const twiml = new twilio.twiml.VoiceResponse();

    if (!userSpeech) {
      twiml.say("Sorry, I did not catch that. Please try again.");
      return res.type("text/xml").send(twiml.toString());
    }

    // Find business using Twilio number
   const business = await Business.findOne({
  twilioNumber
});
console.log("Mongo connection DB name:", mongoose.connection.name);

const allBusinesses = await Business.find();
console.log("Businesses in THIS DB:", allBusinesses);
const collections = await mongoose.connection.db.listCollections().toArray();
console.log("Collections in server DB:", collections);
    if (!business) {
      twiml.say("This business is not configured properly.");
      return res.type("text/xml").send(twiml.toString());
    }

    //  RAG: Create embedding
    const queryEmbedding = await createEmbedding(userSpeech);

    const context = await findRelevantKnowledge(
      business._id,
      queryEmbedding
    );

    // AI with confidence
    const aiResult = await getAIReply(userSpeech, context);

    let answer = aiResult.answer;
    const confidence = aiResult.confidence ?? 0.5;

    //  Confidence-based fallback
    if (confidence < 0.6) {
      answer +=
        " I am not completely sure. A human agent will assist you soon.";
    }

    twiml.say(answer);

    res.type("text/xml");
    res.send(twiml.toString());

  } catch (error) {
    console.error("Voice processing error:", error);

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say("Sorry, something went wrong. Please try again later.");

    res.type("text/xml");
    res.send(twiml.toString());
  }
};