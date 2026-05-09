const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Voucher = require("../models/voucher");

const calculateDiscount = (voucher, subtotal) => {
  if (!voucher) return 0;
  if (voucher.minOrderAmount && subtotal < voucher.minOrderAmount) return 0;

  const rawDiscount = voucher.type === "percentage"
    ? subtotal * (voucher.discount / 100)
    : voucher.discount;

  return Math.min(rawDiscount, voucher.maxDiscount || rawDiscount, subtotal);
};

const createOrder = async (req, res) => {
  try {
    const { items = [], paymentMethod = "cash", voucherCode } = req.body;
    if (!items.length) return res.status(400).json({ error: "Order items are required" });

    const menuItemIds = items.map((item) => item.menuItem || item.menuItemId);
    const menuItems = await MenuItem.find({ _id: { $in: menuItemIds }, isAvailable: true }).lean();
    const menuMap = new Map(menuItems.map((item) => [item._id.toString(), item]));

    const orderItems = items.map((item) => {
      const menuItemId = String(item.menuItem || item.menuItemId);
      const menuItem = menuMap.get(menuItemId);
      if (!menuItem) throw new Error(`Menu item not available: ${menuItemId}`);

      const quantity = Math.max(1, Number(item.quantity) || 1);
      return {
        menuItem: menuItem._id,
        restaurant: menuItem.restaurant,
        name: menuItem.name,
        price: menuItem.price,
        quantity
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const voucher = voucherCode
      ? await Voucher.findOne({
        code: voucherCode.toUpperCase(),
        isActive: true,
        $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }]
      })
      : null;
    const discount = calculateDiscount(voucher, subtotal);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount: subtotal - discount,
      paymentMethod,
      voucherApplied: voucher?._id,
      discount
    });

    res.status(201).json({ message: "Order placed", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.restaurant", "name")
      .populate("items.menuItem", "name image category")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
      .populate("items.restaurant", "name")
      .populate("items.menuItem", "name image category");
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, status: { $in: ["pending", "confirmed"] } },
      { status: "cancelled" },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found or cannot be cancelled" });
    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};
