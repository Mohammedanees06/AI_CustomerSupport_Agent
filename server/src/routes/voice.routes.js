import express from "express";
import {
  handleIncomingCall,
  processSpeech,
  callCustomer,
} from "../controllers/voice.controller.js";

const router = express.Router();

router.post("/call", handleIncomingCall);
router.post("/process", processSpeech);
router.post("/call-customer", callCustomer); 

export default router;