import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createTicket,
  getTickets,
  updateTicket,
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/:businessId", authMiddleware, getTickets);
router.patch("/:ticketId", authMiddleware, updateTicket); 

export default router;