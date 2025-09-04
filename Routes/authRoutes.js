import { Router } from "express";
import { registerUser, verifyEmail, resendVerificationLink, loginUser, logoutUser, passwordResetRequest, passwordReset, refreshAccessToken} from "../controllers/users/barrel.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const authRouter = Router();


authRouter
      // Authentication
      .post('/register', registerUser)
      .post('/login', rateLimiter, loginUser)
      .post('/logout', logoutUser)
      .post('/refresh-token', refreshAccessToken) 

      // Email Verification
      .get('/verify-email', verifyEmail) 
      .post('/resend-verification', resendVerificationLink)

      // Password Reset 
      .post('/forgot-password', passwordResetRequest)
      .post('/reset-password', rateLimiter, passwordReset)

      // register/login with Goggle (optional)
      .get('/google', registerWithGoggle)
      .get('/google/callback', verifyAccount)


      


export default authRouter;
      