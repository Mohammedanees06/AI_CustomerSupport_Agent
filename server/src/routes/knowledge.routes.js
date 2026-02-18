import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { uploadKnowledge } from "../controllers/knowledge.controller.js";
import multer from "multer";

const router = express.Router();

//  Configure Multer (store file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Accept file upload
router.post("/upload", authMiddleware,
  upload.single("file"),   // THIS enables file upload
  uploadKnowledge
);

export default router;
