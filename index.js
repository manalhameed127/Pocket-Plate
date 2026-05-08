require("dns").setDefaultResultOrder("ipv4first");
require("dotenv").config();


const express = require("express");
const connectDB = require("./db");

const app = express();

// middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// connect DB
connectDB();

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/group", require("./routes/group"));
app.use("/api/restaurants", require("./routes/restaurant"));
app.use("/api/orders", require("./routes/order"));
app.use("/api/reccomendations", require("./routes/reccomendation"));
app.use("/api/recommendations", require("./routes/reccomendation"));
app.get("/api/debug/routes", (req, res) => {
  res.json({
    app: "PocketPlate Backend",
    authRegister: "POST /api/auth/register",
    authLogin: "POST /api/auth/login",
    recommendations: [
      "POST /api/recommendations/meal-combos",
      "POST /api/recommendations/cross-restaurant-combos",
      "GET /api/recommendations/me"
    ]
  });
});
// test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
