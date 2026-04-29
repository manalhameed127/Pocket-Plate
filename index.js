require("dotenv").config();
const express = require("express");
const connectDB = require("./db");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});