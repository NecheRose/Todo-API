import User from "../models/userSchema.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { sendMail, verifyAccountEmail, successfulVerificationEmail, passwordResetEmail, successfulPasswordReset } from "../services/emailService.js";
import { generateAccessToken, generateRefreshToken, setCookies, clearCookie } from "../utils/tokenManagement.js";



// User registration 
export const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword, role} = req.body;

  // Basic input checks
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All input fields are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      profile: { username, email }, // sync profile with basic info
      isVerified: false,
      verificationToken,
      verificationTokenExpires: tokenExpiry,
      lastVerificationSentAt: new Date(),
    });

    await newUser.save();

    // Send verification email
    await sendMail(verifyAccountEmail(email, verificationToken));

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Something went wrong. Please try again.", error: error.message });
  }
};


// Verify Email
export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.query;

  try {
    const user = await User.findOne({ verificationToken });

    // If token not linked to any user
    if (!user) {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    if (user.verificationTokenExpires && user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({ message: "Verification token has expired" });
    }

    // Verify user
    user.isVerified = true;
    user.verificationToken = undefined; 
    user.verificationTokenExpires = undefined;

    await user.save();

    // Send success email
    await sendMail(successfulVerificationEmail(user.email, user.username));

    return res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("Error verifying email", err);
    return res.status(500).json({ message: "Email verification failed", error: err.message });
  }
};

// Resend verification link 
export const resendVerificationLink = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    // Prevent spam 
    if (user.lastVerificationSentAt && Date.now() < user.lastVerificationSentAt.getTime() + 30 * 60 * 1000) {
      return res.status(429).json({ 
        message: "Please wait for 30 minutes before requesting another verification email." 
      });
    }

    // Generate new token 
    const newVerificationToken = crypto.randomBytes(32).toString("hex");

    user.verificationToken = newVerificationToken;
    user.verificationTokenExpires = Date.now() + 30 * 60 * 1000; // 30 min
    user.lastVerificationSentAt = new Date();

    await user.save();

    // Send email
    await sendMail(verifyAccountEmail(email, newVerificationToken));

    return res.status(200).json({ message: "Verification email resent successfully. Please check your inbox." });
  } catch (err) {
    console.error("Error resending verification email:", err);
    return res.status(500).json({ message: "Error resending verification email.", error: err.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found!" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    // Query database with incoming password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid login credentials!" });
    }

    // generate access token and refresh token
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Set cookies
    setCookies(res, accessToken, refreshToken);

    return res.status(200).json({ message: "Successfully logged into your account." });
  } catch (err) {
    console.error("Login failed:", err)
    res.status(500).json({ message: "Failed to login:", error: err.message });
  }
};

//refresh accesstoken while still logged in
export const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(decoded.userId);
    const newRefreshToken = generateRefreshToken(decoded.userId);

    // Set cookies
    setCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error("Error refreshing access token:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// User logout
export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token found in cookies" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.warn("Invalid refresh token during logout:", err.message);
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Clear cookies
    clearCookie(res);

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Error Logging Out", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Password reset request
export const passwordResetRequest = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found, please register first" });
    }

    // Generate secure token & hash token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    // Save user
    await user.save();

    const username = user.username;

    // Send password reset link to user email
    await sendMail(passwordResetEmail(email, username, resetToken));

    return res.status(200).json({ message: "Password reset request sent successfully" });
  } catch (err) {
    console.error("Password reset request error:", err);
    return res.status(500).json({ message: "Error sending password request", error: err.message });
  }
};

// Password reset
export const passwordReset = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Query database with incoming token
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    // Send confirmation email
    await sendMail(successfulPasswordReset(user.email, user.username));

    return res.status(200).json({
      message: "Password reset successfully, proceed to login with your new password",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(500).json({ message: "Password reset failed", error: err.message });
  }
};




