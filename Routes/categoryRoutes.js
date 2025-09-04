import { Router } from "express";
import { createCategory, updateCategory, deleteCategory} from "../controllers/users/barrel.js";

const categoryRouter = Router();


authRouter
      // Authentication
      .post('/create', createCategory)
      .patch('/:id/update', updateCategory)
      .delete('/:id/delete', deleteCategory)
      
      

export default categoryRouter;
      