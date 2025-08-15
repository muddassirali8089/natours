import rateLimit from "express-rate-limit";

// General rate limiter (100 requests/hour)
export const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many requests from this IP, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});

// Login-specific rate limiter (5 requests/hour)
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many login attempts, please try again after an hour",
  standardHeaders: true,
  legacyHeaders: false,
});
