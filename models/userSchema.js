import mongoose from "mongoose";

// Sub-schema for profile 
const profileSchema = new mongoose.Schema({
  username: { type: String, trim: true }, // mirror root
  email: { type: String },                // mirror root 
  image: { type: String, default: null },   // profile picture
}, { _id: false });

const userSchema = new mongoose.Schema({
  // Basic information
  username: { type: String, trim: true, minlength: 3, maxlength: 30 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  // Subscription/plan 
  plan: { type: String, enum: ["free", "monthly", "yearly"], default: "free" }, // Payment integration

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
