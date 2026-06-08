const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { createGroup, setGroupBudget, updateMemberShare, getGroupRecommendations, calculateBillSplit } = require("../controllers/groupcontroller");


router.post("/create", protect, createGroup);
router.post("/budget", protect, setGroupBudget);
router.put("/share/:userId", protect, updateMemberShare);
router.get("/recommendations", protect, getGroupRecommendations);
router.get("/billsplit", protect, calculateBillSplit);
module.exports = router;






