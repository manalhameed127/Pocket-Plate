const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const BlacklistedToken = require("../models/BlacklistedToken");
// REGISTER CONTROLLER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed
    });

    return res.status(201).json({ message: "User registered" });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email already registered" });
    }
    return res.status(500).json({ error: error.message });
  }
};

// LOGIN CONTROLLER
const loginUser = async (req, res) => {
  try {
    console.log("🔥 LOGIN HIT");

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "fallbacksecret",
      { expiresIn: "7d" }
    );

    console.log("TOKEN GENERATED:", token);

    return res.json({
      message: "Login successful",
      token
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// LOGOUT CONTROLLER
const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    // decode token to get expiry
    const decoded = jwt.decode(token);

    await BlacklistedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000)
    });

    return res.json({ message: "Logged out successfully" });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logoutUser
};