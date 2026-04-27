const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  name: String,
  price: Number,
  quantity: { type: Number, default: 1 }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "delivered", "cancelled"],
    default: "pending"
  },
  paymentMethod: { type: String, enum: ["cash", "card", "voucher"] },
  voucherApplied: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
  discount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);