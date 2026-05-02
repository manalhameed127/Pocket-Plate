const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/profilecontroller");

router.get("/profile", authMiddleware, userController.getProfile);

module.exports = router;