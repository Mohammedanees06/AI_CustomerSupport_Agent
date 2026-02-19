import rateLimit from "express-rate-limit";

export const businessRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  keyGenerator: (req) => req.body.businessId, //  only businessId
  message: {
    message: "Too many requests. Please try again later."
  }
});
