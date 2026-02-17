import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadKnowledge } from "../controllers/knowledge.controller.js";

const router = express.Router();

router.post("/upload", authMiddleware, uploadKnowledge);

export default router;
