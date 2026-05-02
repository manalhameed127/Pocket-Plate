const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Voucher = require("../models/Voucher");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/orders/place
router.post("/place", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    const order = await Order.create({
      user: req.user.id,
      items: cart.items,
      totalAmount: cart.totalAmount,
      paymentMethod: req.body.paymentMethod || "cash"
    });
    await Cart.findOneAndDelete({ user: req.user.id });
    return res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/orders/payment
router.post("/payment", authMiddleware, async (req, res) => {
  try {
    const { orderId, voucherCode } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });
    let discount = 0;
    if (voucherCode) {
      const voucher = await Voucher.findOne({ code: voucherCode, isActive: true });
      if (voucher) {
        discount = (order.totalAmount * voucher.discountPercent) / 100;
        order.voucherApplied = voucher._id;
        order.discount = discount;
      }
    }
    order.status = "confirmed";
    await order.save();
    return res.status(200).json({
      message: "Payment successful",
      totalAmount: order.totalAmount,
      discount,
      finalAmount: order.totalAmount - discount
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/orders/cross-combo
router.post("/cross-combo", authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    const totalAmount = items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
    const order = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      paymentMethod: req.body.paymentMethod || "cash"
    });
    return res.status(201).json({ message: "Cross-combo order placed", order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;