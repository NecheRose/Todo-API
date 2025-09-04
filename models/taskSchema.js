import mongoose from "mongoose";



const taskSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
title: { type: String, required: true },
description: { type: String },
category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
labels: [{ type: String, index: true }], // keywords for searching/filtering (like ["urgent", "home"])
priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal', index: true }, 
status: { type: String, enum: ['not_started', 'in_progress', 'completed', 'overdue'], default: 'not_started', index: true },
startDate: { type: Date },
dueDate: { type: Date, index: true },
reminderAt: { type: Date },
archived: { type: Boolean, default: false },// Soft archive without deleting (for organizing completed/old tasks) 
deletedAt: { type: Date },
}, { timestamps: true });


const Task =  mongoose.model("Task", taskSchema);

export default Task;