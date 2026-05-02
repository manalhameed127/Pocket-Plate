const User = require("../models/User");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update a user
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const Restaurant = require("../models/Restaurant");
// GET all restaurants
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT update a restaurant
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// DELETE a restaurant
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);

    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// POST create/integrate a new restaurant
const createRestaurant = async (req, res) => {
  try {
    const { name, description, location, cuisine, priceRange, hours, image } = req.body;

    if (!name) return res.status(400).json({ error: "Restaurant name is required" });

    const restaurant = new Restaurant({
      name,
      description,
      location,
      cuisine,
      priceRange,
      hours,
      image
    });

    await restaurant.save();
    res.status(201).json({ message: "Restaurant integrated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
const Offer = require("../models/offer");

// PUT update an offer
const updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!offer) return res.status(404).json({ error: "Offer not found" });

    res.status(200).json({ message: "Offer updated successfully", offer });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
const Order = require("../models/Order");

// GET system metrics
const getMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalRestaurants = await Restaurant.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalOffers = await Offer.countDocuments();

    res.status(200).json({
      totalUsers,
      totalRestaurants,
      totalOrders,
      totalOffers
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { getAllUsers, updateUser, deleteUser, getAllRestaurants, updateRestaurant, deleteRestaurant, createRestaurant, updateOffer, getMetrics };