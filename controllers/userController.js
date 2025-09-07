import User from "../models/userSchema.js";
import Category from "../models/categorySchema.js";
import Task from "../models/taskSchema.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";



// View profile
export const viewProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password -lastVerificationSentAt -passwordChangedAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
};

// Update profile 
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {username} = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If username provided
    if (username) {
      user.username = username;
      user.profile.username = username; // sync profile
    }

    // If image uploaded, push to cloudinary
    if (req.file) {
      // Convert buffer to base64
      const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(fileStr, {
        folder: "todo-api/avatars",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });

      user.profile.image = result.secure_url;
    }
    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        image: user.profile.image || null,
      }
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = Date.now();
    
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    return res.status(500).json({ message: "Error changing password", error: err.message });
  }
};

// Delete account & all related data
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; 

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found or already deleted" });
    }

    await Promise.all([
      Category.deleteMany({ user: userId }),
      Task.deleteMany({ user: userId }),
    ]);

     // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: "Account and all related data deleted successfully" });
  } catch (err) {
    console.error("Error deleting account:", err);
    return res.status(500).json({ message: "Error deleting account", error: err.message });
  }
};
