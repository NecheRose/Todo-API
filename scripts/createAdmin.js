import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/userSchema.js";
import dotenv from "dotenv";

dotenv.config(); 


// Node.js script to create the admin
async function createAdmin() {
  try {
    // Collect arguments
    const [, , username, email, password] = process.argv;

    if (!username || !email || !password) {
      console.log("Please provide username, email, and password");
      console.log("Example: node scripts/createAdmin.js 'Rose Kalu' rose@example.com StrongPass123");
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL)
  
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin with email '${email}' already exists.`);
      return;
    }

    // Password hashing    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      plan: "monthly",
      isVerified: true   // Skip email verification
    });

    // Save admin
    await newAdmin.save();

    console.log("admin created successfully!");
  } catch (error) {
    console.error("Error creating admin:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed");
    process.exit(0);
  }
}

createAdmin();

