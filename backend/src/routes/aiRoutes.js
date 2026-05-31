import express from "express";

import {
  generateInterview,
} from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/generate-interview",
  generateInterview
);

export default router;