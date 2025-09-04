import { Router } from "express";
import { createTasks, bulkCompleteTasks, updateTasks, deleteTasks, getTasks, getOneTask, restoreTasks, getTasksByCategory, getTasksByStatus} from "../controllers/barrel.js";

const taskRouter = Router();


authRouter
      // Authentication
      .post('/create', createTasks)
      .get('/', getTasks)
      .post('/bulk/complete', bulkCompleteTasks)
      .get('/:id', getOneTask)
      .patch('/:id', updateTasks)
      .delete('/:id', deleteTasks)
      .delete('/:id/restore', restoreTasks)
      .get('/category/:catId', getTasksByCategory) // Get task by category
      .get('/status/:statusId', getTasksByStatus)  // Get task by status (Complete, Incomplete)
      

      
      
export default taskRouter;
      