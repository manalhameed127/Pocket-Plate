const express = require("express");
const router = express.Router();
const Restaurant = require("../models/Restaurant");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/restaurants - browse all
router.get("/", authMiddleware, async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    return res.status(200).json({ restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/restaurants/:id - restaurant detail + menu
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    const MenuItem = require("../models/MenuItem");
    const menu = await MenuItem.find({ restaurant: req.params.id });
    return res.status(200).json({ restaurant, menu });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/restaurants/new - newly opened
router.get("/filter/new", authMiddleware, async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ isNewlyOpened: true });
    return res.status(200).json({ restaurants });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;