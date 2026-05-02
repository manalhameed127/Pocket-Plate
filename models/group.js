const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      email: String
    }
  ],
  budget: { type: Number, default: 0 },
  shares: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amount: { type: Number, default: 0 }
    }
  ],
  status: { type: String, enum: ["active", "closed"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);

