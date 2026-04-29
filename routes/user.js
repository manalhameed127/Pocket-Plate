const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
    return res.status(200).json({ message: "Profile updated", user: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/preferences", authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.user.id, { preferences: req.body }, { new: true }).select("-password");
    return res.status(200).json({ message: "Preferences updated", user: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/orders/history", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;