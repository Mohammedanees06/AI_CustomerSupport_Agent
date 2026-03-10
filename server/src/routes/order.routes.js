import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createOrder, getOrderByNumber, getOrders, updateOrder, deleteOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/business/:businessId", authMiddleware, getOrders);
router.post("/", authMiddleware, createOrder);
router.get("/:businessId/:orderNumber", getOrderByNumber);
router.patch("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;