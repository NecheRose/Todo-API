import mongoose from 'mongoose';


const categorySchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
name: { type: String, required: true },
slug: { type: String, index: true },
}, { timestamps: true });


export default mongoose.model('Category', categorySchema);