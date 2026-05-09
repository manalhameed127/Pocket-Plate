const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Review = require("../models/review");

const getRestaurants = async (req, res) => {
  try {
    const filter = {};
    if (req.query.city) filter["location.city"] = new RegExp(req.query.city, "i");
    if (req.query.cuisine) filter.cuisine = { $regex: req.query.cuisine, $options: "i" };

    const restaurants = await Restaurant.find(filter).sort({ rating: -1, createdAt: -1 });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).lean();
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const [menu, reviews] = await Promise.all([
      MenuItem.find({ restaurant: restaurant._id, isAvailable: true }).sort({ category: 1, price: 1 }).lean(),
      Review.find({ restaurant: restaurant._id }).populate("user", "name").sort({ createdAt: -1 }).limit(20).lean()
    ]);

    res.status(200).json({ ...restaurant, menu, reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const { menu = [], ...restaurantData } = req.body;
    const restaurant = await Restaurant.create(restaurantData);

    if (Array.isArray(menu) && menu.length) {
      await MenuItem.insertMany(menu.map((item) => ({ ...item, restaurant: restaurant._id })));
    }

    const items = await MenuItem.find({ restaurant: restaurant._id });
    res.status(201).json({ message: "Restaurant created", restaurant, menu: items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
    res.status(200).json({ message: "Restaurant updated", restaurant });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    await Promise.all([
      MenuItem.deleteMany({ restaurant: restaurant._id }),
      Review.deleteMany({ restaurant: restaurant._id })
    ]);

    res.status(200).json({ message: "Restaurant deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const item = await MenuItem.create({ ...req.body, restaurant: restaurant._id });
    res.status(201).json({ message: "Menu item added", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.itemId, restaurant: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    res.status(200).json({ message: "Menu item updated", item });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOneAndDelete({ _id: req.params.itemId, restaurant: req.params.id });
    if (!item) return res.status(404).json({ error: "Menu item not found" });
    res.status(200).json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const refreshRestaurantRating = async (restaurantId) => {
  const stats = await Review.aggregate([
    { $match: { restaurant: restaurantId } },
    { $group: { _id: "$restaurant", rating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
  ]);

  const rating = stats[0]?.rating || 0;
  const totalReviews = stats[0]?.totalReviews || 0;
  await Restaurant.findByIdAndUpdate(restaurantId, {
    rating: Number(rating.toFixed(1)),
    totalReviews
  });
};

const getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRestaurantReview = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });

    const review = await Review.create({
      user: req.user.id,
      restaurant: restaurant._id,
      order: req.body.order,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await refreshRestaurantRating(restaurant._id);
    res.status(201).json({ message: "Review submitted", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getRestaurantReviews,
  createRestaurantReview
};
