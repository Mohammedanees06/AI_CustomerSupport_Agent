/**
 * Auth Routes
 * Base path: /api/auth
 */

import express from "express";
import passport from "passport";

import { login, register } from "../controllers/auth.controller.js";
import { googleCallback } from "../controllers/googleAuthController.js";

import auth from "../middlewares/auth.middleware.js";







const router = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

// Email + Password
router.post("/register", register);
router.post("/login", login);

/* =========================
   GOOGLE AUTH ROUTES
========================= */

// Step 1: Redirect to Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);




export default router;
