const express = require("express");
const router = express.Router();
const Promotion = require("../models/Promotion");
const Voucher = require("../models/voucher");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/promotions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const promotions = await Promotion.find({ isActive: true });
    return res.status(200).json({ promotions });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/offers/daily
router.get("/daily", authMiddleware, async (req, res) => {
  try {
    const offers = await Promotion.find({ isActive: true, type: "daily" });
    return res.status(200).json({ offers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/updates/daily
router.get("/updates/daily", authMiddleware, async (req, res) => {
  try {
    const offers = await Promotion.find({ isActive: true, type: "daily" });
    const vouchers = await Voucher.find({ isActive: true });
    return res.status(200).json({ offers, vouchers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
