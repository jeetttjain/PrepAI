import express from "express";
import multer from "multer";

import {
  generateInterview,
  analyzeResume,
} from "../controllers/aiController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.post(
  "/generate-interview",
  generateInterview
);

router.post(
  "/analyze-resume",
  upload.single("resume"),
  analyzeResume
);

export default router;