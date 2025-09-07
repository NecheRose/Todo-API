import { Router } from "express";
import { createTasks, updateTasks, deleteTasks, getTasks, getOneTask, restoreTasks, getTasksByStatus, toggleTaskStatus } from "../controllers/barrel.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"

const taskRouter = Router();


taskRouter
      .post('/create', authMiddleware, createTasks)
      .get('/', authMiddleware, getTasks)
      .post('/:id/status', authMiddleware, toggleTaskStatus)
      .get('/:id', authMiddleware, getOneTask)
      .patch('/:id', authMiddleware, updateTasks)
      .delete('/:id', authMiddleware, deleteTasks)
      .post('/:id/restore', authMiddleware, restoreTasks)
      .get('/', authMiddleware, getTasksByStatus)  // Get task by status (Complete, Incomplete)
      

      
      
export default taskRouter;