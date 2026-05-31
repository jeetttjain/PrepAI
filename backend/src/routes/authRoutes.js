import express from "express";
import { body, validationResult } from "express-validator";
import {
  registerUser,
  loginUser,
} from "../controllers/authController.js";

const router = express.Router();

// ─── Validation middleware ────────────────────
const validateRegister = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ max: 100 }).withMessage("Name too long")
    .escape(),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please enter a valid email address (e.g. you@example.com)")
    .isLength({ max: 255 }).withMessage("Email is too long"),

  body("phone")
    .trim()
    .notEmpty().withMessage("Phone number is required")
    .custom((value) => {
      const clean = value.replace(/[\s\-().]/g, "");
      if (!/^\+?[0-9]{7,15}$/.test(clean)) {
        throw new Error("Please enter a valid phone number (7 to 15 digits, e.g. +91 98765 43210)");
      }
      return true;
    }),

  body("password")
    .isLength({ min: 6, max: 128 }).withMessage("Password must be at least 6 characters"),
];

const validateLogin = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email or phone is required")
    .isLength({ max: 255 }).withMessage("Input too long"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ max: 128 }).withMessage("Password too long"),
];

// ─── Validation error responder ───────────────
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ─── Routes ───────────────────────────────────
router.post("/register", validateRegister, handleValidation, registerUser);
router.post("/login",    validateLogin,    handleValidation, loginUser);

export default router;