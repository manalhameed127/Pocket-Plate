const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://Pocketplate:idkwhattowrite127@cluster0.u8yviuh.mongodb.net/?appName=Cluster0");
    console.log("MongoDB Connected ✔");
  } catch (error) {
    console.log("MongoDB connection failed ❌", error);
  }
};

module.exports = connectDB;
