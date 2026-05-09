const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantReviews,
  createRestaurantReview
} = require("../controllers/restaurantcontroller");

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, createRestaurant);
router.put("/:id", protect, updateRestaurant);
router.delete("/:id", protect, deleteRestaurant);
router.post("/:id/menu", protect, addMenuItem);
router.put("/:id/menu/:itemId", protect, updateMenuItem);
router.delete("/:id/menu/:itemId", protect, deleteMenuItem);
router.get("/:id/reviews", getRestaurantReviews);
router.post("/:id/reviews", protect, createRestaurantReview);

module.exports = router;
