import jwt from "jsonwebtoken";


// Generate access token and refresh token
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

// set accesss token and refresh token in cookies
export const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,   //prevent Cross-site scripting attack attacks(XSS)
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAMESITE === "strict", 
    path: "/",       // ensures cookie is removed from the root path
    maxAge: 30 * 60 * 1000  // 30 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAMESITE === "strict",
    path: "/", 
    maxAge:  7 * 24 * 60 * 60 * 1000  // 7 days 
  });
};

// Clear cookies
export const clearCookie = (res) => {
  res.clearCookie("accessToken", { 
    httpOnly: true, 
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAMESITE || "strict",
  });

  res.clearCookie("refreshToken", { 
    httpOnly: true, 
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: process.env.COOKIE_SAMESITE || "strict",
  });
};



