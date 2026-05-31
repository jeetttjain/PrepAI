import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect routes — verifies JWT and attaches user to req.user.
 * Rejects requests with missing, expired, or tampered tokens.
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token with strong secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch fresh user (detect deleted/banned accounts immediately)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Account not found or has been deactivated.",
        });
      }

      next();
    } catch (err) {
      // Do NOT reveal why the token failed
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please log in again.",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }
};

/**
 * Admin-only gate — use after protect().
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access denied. Admin privileges required.",
  });
};
