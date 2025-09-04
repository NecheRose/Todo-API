import mongoose from "mongoose";


const activitySchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true, index: true },
action: { type: String, enum: ['create', 'update', 'complete', 'reopen', 'delete', 'restore'], required: true },
diff: { type: Object }, // Stores what changed (before/after snapshot)
}, { timestamps: true });


export default mongoose.model('Activity', activitySchema);