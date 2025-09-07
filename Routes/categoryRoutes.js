import { Router } from "express";
import { seedCategories, getCategories, createCategory, updateCategory, deleteCategory} from "../controllers/barrel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const categoryRouter = Router();


categoryRouter
      .get('/', authMiddleware, getCategories)
      .post('/seed-categories', authMiddleware, adminOnly, seedCategories)
      .post('/create', authMiddleware, createCategory)
      .patch('/:id/update', authMiddleware, updateCategory)
      .delete('/:id/delete', authMiddleware, deleteCategory)
      
      

export default categoryRouter;
      





