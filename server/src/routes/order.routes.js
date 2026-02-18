import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createOrder, getOrderByNumber } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/:businessId/:orderNumber", authMiddleware, getOrderByNumber);

export default router;
