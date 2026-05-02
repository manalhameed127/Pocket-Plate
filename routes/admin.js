const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getAllUsers, updateUser, deleteUser, getAllRestaurants, updateRestaurant, deleteRestaurant } = require("../controllers/admincontroller");

// User management
router.get("/users", protect, getAllUsers);
router.put("/users/:id", protect, updateUser);
router.delete("/users/:id", protect, deleteUser);

// Restaurant management
router.get("/restaurants", protect, getAllRestaurants);
router.put("/restaurants/:id", protect, updateRestaurant);
router.delete("/restaurants/:id", protect, deleteRestaurant);

module.exports = router;