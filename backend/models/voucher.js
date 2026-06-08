const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: String,
  type: { type: String, enum: ["percentage", "fixed", "student", "card", "general"], required: true },
  discount: { type: Number, min: 0 },
  discountPercent: { type: Number, min: 0 },
  maxDiscount: { type: Number, min: 0 },
  minOrderAmount: { type: Number, default: 0 },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  category: { type: String, default: "general" },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,
  expiryDate: Date,
  usageLimit: Number,
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Voucher", voucherSchema);
