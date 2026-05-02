const jwt = require("jsonwebtoken");
const BlacklistedToken = require("../models/BlacklistedToken");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔴 CHECK BLACKLIST (THIS is what makes logout work)
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ error: "Token expired (logged out)" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallbacksecret"
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = protect;