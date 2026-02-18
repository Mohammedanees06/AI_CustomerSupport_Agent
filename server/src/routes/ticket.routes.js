import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createTicket, getTickets } from "../controllers/ticket.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/:businessId", authMiddleware, getTickets);

export default router;
