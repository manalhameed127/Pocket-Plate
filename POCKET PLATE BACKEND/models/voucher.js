const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["student", "card", "general"],
    required: true
  },
  discountPercent: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 1 },
  usedCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Voucher", voucherSchema);