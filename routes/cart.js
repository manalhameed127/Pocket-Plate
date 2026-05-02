const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/cart/add
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { menuItem, restaurant, name, price, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [], totalAmount: 0 });
    }
    const existingItem = cart.items.find(
      item => item.menuItem.toString() === menuItem
    );
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ menuItem, restaurant, name, price, quantity: quantity || 1 });
    }
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
    await cart.save();
    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/cart
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(200).json({ cart: { items: [], totalAmount: 0 } });
    return res.status(200).json({ cart });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cart
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user.id });
    return res.status(200).json({ message: "Cart cleared" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;