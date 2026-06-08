const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  preferences: {
    cuisines: [String],
    dietaryRestrictions: [String]
  },
  budget: { type: Number, default: 0 },
  isEndOfMonthMode: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);