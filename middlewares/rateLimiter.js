import rateLimit from "express-rate-limit";


// Rate limiter 
export const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per window
  message: { message: "Too many attempts, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,

  //  Use userId if logged in, otherwise fallback to IP
  keyGenerator: (req, res) => {
    if (req.user && req.user.id) {
      return req.user.id; // Tie rate limiting to authenticated user
    }
    return req.ip; // Fallback for unauthenticated users
  },
});
