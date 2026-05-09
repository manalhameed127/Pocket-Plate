console.log("🔥 AUTH ROUTES LOADED");
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  registerUser,
  loginUser, logoutUser
} = require("../controllers/authController");
console.log("logoutUser:", logoutUser);

console.log("protect:", protect);
// ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

module.exports = router;