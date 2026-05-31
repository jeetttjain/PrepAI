import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "mongo-sanitize";
import hpp from "hpp";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import cheatsheetRoutes from "./routes/cheatsheetRoutes.js";

connectDB();

const app = express();

// ─────────────────────────────────────────────
// 1. SECURITY HEADERS — Helmet sets 14+ headers
//    including X-Frame-Options, CSP, HSTS, etc.
// ─────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // needed for some image loading
}));

// ─────────────────────────────────────────────
// 2. STRICT CORS — Only allow your frontend origin
// ─────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman in dev)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ─────────────────────────────────────────────
// 3. BODY PARSING — Limit payload size to prevent
//    denial-of-service via oversized bodies
// ─────────────────────────────────────────────
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─────────────────────────────────────────────
// 4. NoSQL INJECTION PREVENTION — mongo-sanitize
//    strips $ and . from user-supplied data so
//    operators like { $gt: "" } cannot be injected
// ─────────────────────────────────────────────
app.use((req, _res, next) => {
  if (req.body) {
    req.body = mongoSanitize(req.body);
  }
  if (req.params) {
    const sanitizedParams = mongoSanitize(req.params);
    for (const key in req.params) {
      delete req.params[key];
    }
    Object.assign(req.params, sanitizedParams);
  }
  if (req.query) {
    const sanitizedQuery = mongoSanitize(req.query);
    for (const key in req.query) {
      delete req.query[key];
    }
    Object.assign(req.query, sanitizedQuery);
  }
  next();
});

// ─────────────────────────────────────────────
// 5. HTTP PARAMETER POLLUTION PREVENTION
//    Prevents array-based query string attacks
// ─────────────────────────────────────────────
app.use(hpp());

// ─────────────────────────────────────────────
// 6. RATE LIMITING
//    - Global: 200 req / 15 min per IP
//    - Auth endpoints: 10 attempts / 15 min per IP
//      (blocks brute-force login attacks)
// ─────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again in 15 minutes.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login/register attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
  skipSuccessfulRequests: true, // Only count failed attempts
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 AI calls per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "AI rate limit exceeded. Please wait before generating more content.",
  },
});

app.use(globalLimiter);

// ─────────────────────────────────────────────
// 7. REQUEST LOGGING (production-safe)
//    Never log sensitive fields like passwords
// ─────────────────────────────────────────────
app.use((req, _res, next) => {
  const safe = { method: req.method, url: req.url, ip: req.ip };
  if (process.env.NODE_ENV !== "production") {
    console.log(`[${new Date().toISOString()}]`, safe);
  }
  next();
});

// ─────────────────────────────────────────────
// 8. ROUTES — Protected by rate limiters above
// ─────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/ai", aiLimiter, aiRoutes);
app.use("/api/cheatsheet", aiLimiter, cheatsheetRoutes);

// Health check — never reveals stack info
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", service: "PrepAI API" });
});

// ─────────────────────────────────────────────
// 9. 404 HANDLER — Don't reveal route structure
// ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Resource not found" });
});

// ─────────────────────────────────────────────
// 10. GLOBAL ERROR HANDLER — Never leak stack traces
// ─────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production"
      ? "An error occurred. Please try again."
      : err.message;

  if (process.env.NODE_ENV !== "production") {
    console.error("[ERROR]", err.stack);
  }

  res.status(statusCode).json({ success: false, message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PrepAI API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});