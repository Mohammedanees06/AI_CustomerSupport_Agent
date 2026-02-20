import twilio from "twilio";
import { getAIReply } from "../services/ai/ai.service.js";

/**
 * 1️⃣ Handles incoming phone call
 */
export const handleIncomingCall = async (req, res) => {
  console.log("✅ handleIncomingCall hit!");
  console.log("Body:", req.body);
  
  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(
    "Hello! Welcome to AI Customer Support. Please tell me how I can help you.",
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
 * 2️⃣ Processes the speech from caller
 */
export const processSpeech = async (req, res) => {
  const userSpeech = req.body.SpeechResult;

  console.log("Caller said:", userSpeech);

  const aiResult = await getAIReply(userSpeech, null);
  const answer = aiResult.answer;

  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(answer);

  res.type("text/xml");
  res.send(twiml.toString());
};
