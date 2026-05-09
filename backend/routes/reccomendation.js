const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  recommendMealCombos,
  optimizeCrossRestaurantCombo,
  getPersonalizedRecommendations
} = require("../controllers/reccomendationcontroller");

router.post("/meal-combos", recommendMealCombos);
router.post("/cross-restaurant-combos", optimizeCrossRestaurantCombo);
router.get("/me", protect, getPersonalizedRecommendations);

module.exports = router;
