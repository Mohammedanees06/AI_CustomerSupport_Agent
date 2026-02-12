import express from "express";
import {
  createBusiness,
  getMyBusiness
} from "../controllers/business.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create a business (one-time)
router.post("/", authMiddleware, createBusiness);

// Get logged-in user's business
router.get("/my", authMiddleware, getMyBusiness);

export default router;
