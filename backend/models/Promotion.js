const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  discountPercent: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  type: {
    type: String,
    enum: ["daily", "weekly", "special"],
    default: "daily"
  }
}, { timestamps: true });

module.exports = mongoose.model("Promotion", promotionSchema);