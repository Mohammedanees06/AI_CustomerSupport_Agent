import { getAIReply } from "../services/ai/ai.service.js";

import dotenv from "dotenv";
dotenv.config();


(async () => {
  const reply = await getAIReply("Say hello in one sentence");
  console.log("FINAL REPLY:", reply);
})();
