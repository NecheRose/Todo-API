import express from "express";
import dotenv from "dotenv";
import { adminRouter, authRouter, categoryRouter, taskRouter, userRouter } from "./Routes/barrel.js";
import { connectDB } from "./lib/mongodb.js";
import cookieParser from "cookie-parser";
import { reminderTaskJob } from "./services/taskService.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000

// Connect database
connectDB();      

// start cron job
reminderTaskJob()


// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/admin', adminRouter);
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);


// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));