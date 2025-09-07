import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  priority: { type: String, enum: ['low', 'normal', 'high', 'urgent'], default: 'normal', index: true }, 
  status: { type: String, enum: ['incomplete', 'completed'], default: 'incomplete', index: true }, 
  startDate: { type: Date }, // optional
  dueDate: { type: Date, index: true },
  reminderBefore: { type: Number, default: 60 }, // reminder in minutes before due date
  reminderAt: { type: Date }, // exact reminder timestamp
  deletedAt: { type: Date, default: null }
}, { timestamps: true });


const Task =  mongoose.model("Task", taskSchema);

export default Task;