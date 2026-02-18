import rateLimit from "express-rate-limit";

/**
 * Rate limit per business
 * 
 * We use businessId as unique key.
 */

export const businessRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // max 100 requests per minute
  keyGenerator: (req) => {
    return req.body.businessId || req.ip;
  },
  message: {
    message: "Too many requests. Please try again later."
  }
});
