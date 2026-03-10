import express from "express";
import adminMiddleware from "../middlewares/admin.middleware.js";
import {
  getAllBusinesses,
  getPlatformAnalytics,
  suspendBusiness,
  activateBusiness,
} from "../controllers/admin.controller.js";

const router = express.Router();

// All admin routes protected by adminMiddleware
router.get("/businesses", adminMiddleware, getAllBusinesses);
router.get("/analytics", adminMiddleware, getPlatformAnalytics);
router.patch("/business/:id/suspend", adminMiddleware, suspendBusiness);
router.patch("/business/:id/activate", adminMiddleware, activateBusiness);

export default router;