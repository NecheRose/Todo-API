import { Router } from "express";
import {getAllUsers, getUserById} from "../controllers/barrel.js";
import {adminOnly} from "../middlewares/adminMiddleware.js";
import {authMiddleware} from "../middlewares/authMiddleware.js";

const adminRouter = Router();

adminRouter
    .get("/users", authMiddleware, adminOnly, getAllUsers)
    .get("/users/:id", authMiddleware, adminOnly, getUserById)
    
    
export default adminRouter;