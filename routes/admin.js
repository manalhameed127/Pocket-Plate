const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getAllUsers, updateUser, deleteUser, getAllRestaurants, updateRestaurant, deleteRestaurant, createRestaurant, updateOffer, getMetrics } = require("../controllers/admincontroller");

// Metrics
router.get("/metrics", protect, getMetrics);
// Offers
router.put("/offers/:id", protect, updateOffer);
// Restaurant integration
router.post("/integration", protect, createRestaurant);
// User management
router.get("/users", protect, getAllUsers);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

// Restaurant management
router.get("/restaurants", protect, getAllRestaurants);
router.put("/restaurants/:id", protect, updateRestaurant);
router.delete("/restaurants/:id", protect, deleteRestaurant);

module.exports = router;