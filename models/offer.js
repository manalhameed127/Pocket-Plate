const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  discount: { type: Number, required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);