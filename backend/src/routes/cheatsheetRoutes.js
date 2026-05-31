import express from "express";

import {
  generateCheatsheet,
} from "../controllers/cheatsheetController.js";

const router =
  express.Router();

router.post(
  "/generate",
  generateCheatsheet
);

export default router;