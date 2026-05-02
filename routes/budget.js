const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/budget - set budget
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { budget } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { budget },
      { new: true }
    ).select("-password");
    return res.status(200).json({ message: "Budget set", user: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/restaurants?budget=X - budget filter
router.get("/restaurants", authMiddleware, async (req, res) => {
  try {
    const { budget } = req.query;
    const restaurants = await Restaurant.find({
      priceRange: budget <= 500 ? "$" : budget <= 1000 ? "$$" : "$$$"
    });
    return res.status(200).json({ restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/budget/endofmonth - end of month mode
router.put("/endofmonth", authMiddleware, async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { isEndOfMonthMode: true },
      { new: true }
    ).select("-password");
    return res.status(200).json({ message: "End of month mode activated", user: updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;