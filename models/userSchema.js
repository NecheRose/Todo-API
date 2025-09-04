import mongoose from "mongoose";

// Sub-schema for profile 
const profileSchema = new mongoose.Schema({
  fullName: { type: String, trim: true, minlength: 3, maxlength: 30 },
  avatarUrl: { type: String, default: null },
  email: { type: String }, // mirror from main email
}, { _id: false });


const userSchema =  new mongoose.Schema({
  // Basic information
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, deafult: null },
  googleId: { type: String, index: true },
  
  // Subscription/plan
  plan: { type: String, enum: ['free', 'monthly', 'yearly'], default: 'free' }, 

  // Profile details (synced at signup, editable later)
  profile: { type: profileSchema, default: {} },

  // Verification 
  isVerified: { type: Boolean, default: false }, 
  verificationToken: { type: String, default: null }, 
  verificationTokenExpires: Date,
  lastVerificationSentAt: Date, 

  // Security
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date
}, { timestamps: true }); 

const User = mongoose.model("User", userSchema);

export default User;

