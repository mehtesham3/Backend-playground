import rateLimit from "express-rate-limit";

// Limit: 5 requests per minute per IP
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again after a minute.",
});
export default loginLimiter;