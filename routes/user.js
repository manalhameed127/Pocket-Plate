const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/users/profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    ).select("-password");
    return res.status(200).json({ message: "Profile updated", user: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/users/preferences
router.put("/preferences", authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { preferences: req.body },
      { new: true }
    ).select("-password");
    return res.status(200).json({ message: "Preferences updated", user: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;