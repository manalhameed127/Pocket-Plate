const Group = require("../models/group");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

// POST create group + add members
const createGroup = async (req, res) => {
  try {
    const { name, memberEmails } = req.body;

    if (!name) return res.status(400).json({ error: "Group name is required" });

    // find members by email
    let members = [];
    if (memberEmails && memberEmails.length > 0) {
      for (const email of memberEmails) {
        const user = await User.findOne({ email }).select("_id name email");
        if (user) {
          members.push({ user: user._id, name: user.name, email: user.email });
        }
      }
    }

    const group = new Group({
      name,
      createdBy: req.user.id,
      members
    });

    await group.save();
    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// POST set group budget
const setGroupBudget = async (req, res) => {
  try {
    const { groupId, budget } = req.body;

    if (!groupId || !budget) return res.status(400).json({ error: "Group ID and budget are required" });

    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only group creator can set budget" });
    }

    group.budget = budget;
    await group.save();

    res.status(200).json({ message: "Group budget set successfully", group });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// PUT customize individual share
const updateMemberShare = async (req, res) => {
  try {
    const { groupId, amount } = req.body;
    const { userId } = req.params;

    if (!groupId || !amount) return res.status(400).json({ error: "Group ID and amount are required" });

    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Only group creator can update shares" });
    }

    // check if share already exists for this user
    const existingShare = group.shares.find(s => s.user.toString() === userId);

    if (existingShare) {
      existingShare.amount = amount;
    } else {
      group.shares.push({ user: userId, amount });
    }

    await group.save();

    res.status(200).json({ message: "Member share updated successfully", group });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// GET group recommendations based on budget
const getGroupRecommendations = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId) return res.status(400).json({ error: "Group ID is required" });

    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ error: "Group not found" });

    const memberCount = group.members.length || 1;
    const totalBudget = group.budget;
    const perPersonBudget = totalBudget / memberCount;

    // find restaurants based on price range
    let priceRange;
    if (perPersonBudget < 500) priceRange = "$";
    else if (perPersonBudget < 1500) priceRange = "$$";
    else priceRange = "$$$";

    const restaurants = await Restaurant.find({ priceRange });

    res.status(200).json({
      groupName: group.name,
      totalBudget,
      memberCount,
      perPersonBudget,
      recommendedPriceRange: priceRange,
      restaurants
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
// GET bill split calculation
const calculateBillSplit = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId) return res.status(400).json({ error: "Group ID is required" });

    const group = await Group.findById(groupId);

    if (!group) return res.status(404).json({ error: "Group not found" });

    const memberCount = group.members.length || 1;
    const totalBudget = group.budget;
    const equalShare = totalBudget / memberCount;

    // build split summary
    const splitSummary = group.members.map(member => {
      const customShare = group.shares.find(s => s.user.toString() === member.user.toString());
      return {
        name: member.name,
        email: member.email,
        amountOwed: customShare ? customShare.amount : equalShare
      };
    });

    const totalAllocated = splitSummary.reduce((sum, m) => sum + m.amountOwed, 0);

    res.status(200).json({
      groupName: group.name,
      totalBudget,
      memberCount,
      equalSharePerPerson: equalShare,
      splitSummary,
      totalAllocated
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { createGroup, setGroupBudget, updateMemberShare, getGroupRecommendations, calculateBillSplit };