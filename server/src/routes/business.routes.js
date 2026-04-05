import express from "express";
import { createBusiness, getMyBusiness, updateBusiness, deleteBusiness } from "../controllers/business.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBusiness);
router.get("/my", authMiddleware, getMyBusiness);
router.patch("/my", authMiddleware, updateBusiness);
router.delete("/my", authMiddleware, deleteBusiness);

export default router;