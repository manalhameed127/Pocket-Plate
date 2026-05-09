const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 }
  }],
  individualTotal: { type: Number, default: 0 },
  share: { type: Number, default: 0 }
});

const groupOrderSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [memberSchema],
  totalBudget: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["open", "confirmed", "delivered", "cancelled"],
    default: "open"
  },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" }
}, { timestamps: true });

module.exports = mongoose.model("GroupOrder", groupOrderSchema);