import express from "express";
import { getQueueStats } from "../controllers/monitor.controller.js";

const router = express.Router();

router.get("/queue", getQueueStats);

export default router;
