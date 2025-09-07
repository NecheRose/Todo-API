import jwt from "jsonwebtoken"
import User from "../models/userSchema.js"
import {generateAccessToken} from "../utils/tokenManagement.js";



// Authorization middleware
export const authMiddleware = async (req, res, next) => {
  try {
    let accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // Check header if cookie missing
    if (!accessToken && req.headers.authorization?.startsWith("Bearer ")) {
      accessToken = req.headers.authorization.split(" ")[1];
    }

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: "No tokens provided" });
    }

    // Try verifying access token
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      // Access token expired → try refresh token
      if (err.name === "TokenExpiredError") {
        if (!refreshToken) {
          return res.status(401).json({ message: "Refresh token missing" });
        }

        let refreshDecoded;
        try {
          refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch {
          return res.status(403).json({ message: "Invalid or expired refresh token" });
        }

        // Issue new access token
        const newAccessToken = generateAccessToken(refreshDecoded.userId);

        // Set cookie & attach to request
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.COOKIE_SECURE === "true",
          sameSite: process.env.COOKIE_SAMESITE === "none",
          maxAge: process.env.ACCESS_TOKEN_EXPIRY
        });
 
        // Verify new access token
        decoded = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET);
      } else {
        return res.status(403).json({ message: "Invalid access token" });
      }
    }

    // Fetch user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("AuthMiddleware Error:", err);
    return res.status(500).json({ message: "Authentication error", error: err.message });
  }
};