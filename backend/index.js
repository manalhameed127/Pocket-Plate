const path = require("path");
require("dotenv").config();
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/group", require("./routes/group"));
app.use("/api/restaurants", require("./routes/restaurant"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/promotions", require("./routes/promotions"));
app.use("/api/vouchers", require("./routes/vouchers"));
app.use("/api/budget", require("./routes/budget"));
app.use("/api/cart", require("./routes/cart"));
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

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_group", (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  socket.on("update_order", (data) => {
    io.to(data.groupId).emit("order_updated", data);
    console.log("Order updated in group:", data.groupId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Set PORT to another value or stop the process using it.`);
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
