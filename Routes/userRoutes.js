import { Router } from "express";
import { viewProfile, updateProfile, changePassword, deleteAccount } from "../controllers/barrel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {upload} from "../middlewares/multer.js";


const userRouter = Router();

userRouter
      .get('/profile', authMiddleware, viewProfile)
      .patch('/update-profile', authMiddleware, upload.single('image'), updateProfile)
      .post('/change-password', authMiddleware, changePassword)
      .delete('/delete-account', authMiddleware, deleteAccount) 



export default userRouter;      