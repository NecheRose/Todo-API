import { Router } from "express";
import { viewProfile, updateProfile, changePassword, upgradePlan, deleteAccount } from "../controllers/barrel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";


const userRouter = Router();

userRouter
      .get('/profile', authMiddleware, viewProfile)
      .patch('/update-profile', authMiddleware, updateProfile)
      .post('/change-password', authMiddleware, changePassword)
      .post('/upgrade-plan', authMiddleware, upgradePlan)
      .delete('/delete-account', authMiddleware, deleteAccount) 



export default userRouter;
      