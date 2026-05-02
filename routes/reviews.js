const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/reviews
router.get("/", authMiddleware, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("restaurant", "name");
    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { restaurant, rating, comment } = req.body;
    const review = await Review.create({
      user: req.user.id,
      restaurant,
      rating,
      comment
    });
    return res.status(201).json({ message: "Review added", review });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;