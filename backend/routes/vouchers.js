const express = require("express");
const router = express.Router();
const Voucher = require("../models/voucher");
const authMiddleware = require("../middleware/authMiddleware");

// GET /api/vouchers
router.get("/", authMiddleware, async (req, res) => {
  try {
    const vouchers = await Voucher.find({ isActive: true });
    return res.status(200).json({ vouchers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/vouchers/student
router.get("/student", authMiddleware, async (req, res) => {
  try {
    const vouchers = await Voucher.find({ isActive: true, type: "student" });
    return res.status(200).json({ vouchers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/discounts/card-based
router.get("/card-based", authMiddleware, async (req, res) => {
  try {
    const vouchers = await Voucher.find({ isActive: true, type: "card" });
    return res.status(200).json({ vouchers });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
