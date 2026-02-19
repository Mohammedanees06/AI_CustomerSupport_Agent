import express from "express";
import { handleIncomingCall, processSpeech } from "../controllers/voice.controller.js";

const router = express.Router();

router.post("/call", handleIncomingCall);
router.post("/process", processSpeech);

export default router;
