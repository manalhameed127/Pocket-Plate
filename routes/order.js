const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
} = require("../controllers/ordercontroller");

router.post("/", protect, createOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, updateOrderStatus);
router.put("/:id/cancel", protect, cancelOrder);

module.exports = router;
