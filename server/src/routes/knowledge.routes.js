import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  uploadKnowledge,
  scrapeWebsite,
  uploadFAQ,
  clearKnowledge,
} from "../controllers/knowledge.controller.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// PDF or text upload
router.post("/upload", authMiddleware, upload.single("file"), uploadKnowledge);

// Website scraping
router.post("/scrape", authMiddleware, scrapeWebsite);

// Bulk FAQ upload
router.post("/faq", authMiddleware, uploadFAQ);

// Clear all knowledge for a business
router.delete("/:businessId", authMiddleware, clearKnowledge);

export default router;