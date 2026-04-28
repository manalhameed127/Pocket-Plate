require("dotenv").config();
const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");
const MenuItem = require("./models/MenuItem");
const Voucher = require("./models/Voucher");
const Promotion = require("./models/Promotion");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected ✔");
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Voucher.deleteMany();
    await Promotion.deleteMany();
    console.log("Old data cleared ✔");

    // Seed Restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: "Burger Barn",
        description: "Best burgers in town",
        location: { address: "12 Main St", city: "Lahore" },
        cuisine: ["Fast Food", "American"],
        rating: 4.2,
        priceRange: "$",
        hours: { open: "10:00", close: "23:00" },
        isNewlyOpened: false
      },
      {
        name: "Pizza Palace",
        description: "Authentic Italian pizzas",
        location: { address: "45 Food Street", city: "Lahore" },
        cuisine: ["Italian", "Pizza"],
        rating: 4.5,
        priceRange: "$$",
        hours: { open: "11:00", close: "00:00" },
        isNewlyOpened: false
      },
      {
        name: "Desi Dhaba",
        description: "Traditional Pakistani cuisine",
        location: { address: "78 Liberty Market", city: "Lahore" },
        cuisine: ["Pakistani", "Desi"],
        rating: 4.7,
        priceRange: "$",
        hours: { open: "12:00", close: "22:00" },
        isNewlyOpened: true
      }
    ]);
    console.log("Restaurants seeded ✔");

    // Seed Menu Items
    await MenuItem.insertMany([
      {
        restaurant: restaurants[0]._id,
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce and tomato",
        price: 500,
        category: "Burgers",
        isAvailable: true
      },
      {
        restaurant: restaurants[0]._id,
        name: "Fries",
        description: "Crispy golden fries",
        price: 200,
        category: "Sides",
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: "Margherita Pizza",
        description: "Classic tomato and mozzarella",
        price: 1200,
        category: "Pizza",
        isAvailable: true
      },
      {
        restaurant: restaurants[1]._id,
        name: "Pepperoni Pizza",
        description: "Loaded with pepperoni",
        price: 1500,
        category: "Pizza",
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: "Chicken Karahi",
        description: "Spicy chicken karahi",
        price: 800,
        category: "Main Course",
        isAvailable: true
      },
      {
        restaurant: restaurants[2]._id,
        name: "Naan",
        description: "Fresh tandoor naan",
        price: 50,
        category: "Bread",
        isAvailable: true
      }
    ]);
    console.log("Menu items seeded ✔");

    // Seed Vouchers
    await Voucher.insertMany([
      {
        code: "STUDENT10",
        type: "student",
        discountPercent: 10,
        minOrderAmount: 500,
        expiryDate: new Date("2026-12-31"),
        isActive: true,
        usageLimit: 100
      },
      {
        code: "WELCOME20",
        type: "general",
        discountPercent: 20,
        minOrderAmount: 300,
        expiryDate: new Date("2026-12-31"),
        isActive: true,
        usageLimit: 50
      }
    ]);
    console.log("Vouchers seeded ✔");

    // Seed Promotions
    await Promotion.insertMany([
      {
        title: "Weekend Special",
        description: "20% off on all orders this weekend",
        discountPercent: 20,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        isActive: true,
        type: "weekly"
      },
      {
        title: "Daily Deal",
        description: "Free fries with every burger today",
        discountPercent: 0,
        startDate: new Date("2026-01-01"),
        endDate: new Date("2026-12-31"),
        isActive: true,
        type: "daily"
      }
    ]);
    console.log("Promotions seeded ✔");

    console.log("✅ Database seeded successfully!");
    process.exit(0);

  } catch (error) {
    console.log("Seeding failed ❌", error.message);
    process.exit(1);
  }
};

seedData();