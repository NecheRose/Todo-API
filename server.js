import express from "express";
import dotenv from "dotenv";
import { authRouter, categoryRouter, taskRouter, userRouter, paymentRouter } from "./Routes/barrel.js";
import { connectDB } from "./lib/mongodb.js";
import { connectRedis } from "./lib/redis.js";
import cookieParser from "cookie-parser";
import { startOverdueTaskJob } from "./services/taskService.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000

// Connect databases
connectDB();      
connectRedis(); 

// start cron jobs
startOverdueTaskJob(); 

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/users', userRouter);
app.use('/api/payments', paymentRouter);


app.get ('/', (req, res) => {
  res.send("Server is working on port 3000")
})

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));