require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();


const express = require("express");
const connectDB = require("./db");

const app = express();

// middleware
app.use(express.json());

// connect DB
connectDB();

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});