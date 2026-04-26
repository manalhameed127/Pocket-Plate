const User = require("./models/User");
const express = require("express");
const connectDB = require("./db");

connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.post("/add-user", async (req, res) => {
  const newUser = new User(req.body);
  await newUser.save();
  res.send("User saved ✔");
});