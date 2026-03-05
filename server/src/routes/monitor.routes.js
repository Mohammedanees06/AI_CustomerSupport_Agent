import express from "express";
import { getQueueStats } from "../controllers/monitor.controller.js";
import { getAnalytics } from "../controllers/analytics.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/queue", getQueueStats);
router.get("/analytics/:businessId", authMiddleware, getAnalytics); 

export default router;