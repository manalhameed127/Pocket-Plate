const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  cuisine: [String],
  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  priceRange: { type: String, enum: ["$", "$$", "$$$"] },
  hours: {
    open: String,
    close: String
  },
  isNewlyOpened: { type: Boolean, default: false },
  image: String
}, { timestamps: true });

module.exports = mongoose.model("Restaurant", restaurantSchema);