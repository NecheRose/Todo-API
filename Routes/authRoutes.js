import { Router } from "express";
import { registerUser, verifyEmail, resendVerificationLink, loginUser, logoutUser, passwordResetRequest, passwordReset, refreshAccessToken} from "../controllers/barrel.js";
import { userRateLimiter } from "../middlewares/rateLimiter.js";

const authRouter = Router();


authRouter
      // Authentication
      .post('/register', userRateLimiter, registerUser)
      .post('/login', userRateLimiter, loginUser)
      .post('/logout', logoutUser)
      .post('/refresh-token', refreshAccessToken) 

      // Email Verification
      .get('/verify-email', verifyEmail) 
      .post('/resend-verification', userRateLimiter, resendVerificationLink)

      // Password Reset 
      .post('/forgot-password', userRateLimiter, passwordResetRequest)
      .post('/reset-password', passwordReset)




export default authRouter;
      