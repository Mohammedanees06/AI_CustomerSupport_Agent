/**
 * Auth Routes
 * Base path: /api/auth
 */

import express from "express";
import passport from "passport";

import { login, register, getCurrentUser } from "../controllers/auth.controller.js";
import { googleCallback } from "../controllers/googleAuthController.js";
import auth from "../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================
   PUBLIC ROUTES
========================= */

router.post("/register", register);
router.post("/login", login);

/* =========================
   GOOGLE AUTH ROUTES
========================= */

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

/* =========================
   PRIVATE ROUTES
========================= */

router.get("/me", auth, getCurrentUser);

export default router;