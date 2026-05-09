const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const User = require("../models/User");
const Order = require("../models/Order");

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const cleanJson = (text) => {
  if (!text) return null;

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start === -1 || end === -1) return null;
  return JSON.parse(raw.slice(start, end + 1));
};

const askGroq = async ({ system, prompt }) => {
  if (!process.env.GROQ_API_KEY) return null;
  if (typeof fetch !== "function") {
    throw new Error("This Node.js version does not provide fetch. Use Node 18+.");
  }

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: DEFAULT_MODEL,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${detail}`);
  }

  const data = await response.json();
  return cleanJson(data.choices?.[0]?.message?.content);
};

const loadMenuContext = async ({ restaurantIds, maxItems = 80 }) => {
  const restaurantFilter = restaurantIds?.length ? { _id: { $in: restaurantIds } } : {};
  const itemFilter = {
    isAvailable: true,
    ...(restaurantIds?.length ? { restaurant: { $in: restaurantIds } } : {})
  };

  const [restaurants, menuItems] = await Promise.all([
    Restaurant.find(restaurantFilter).lean(),
    MenuItem.find(itemFilter).populate("restaurant", "name cuisine rating priceRange location").limit(maxItems).lean()
  ]);

  return { restaurants, menuItems };
};

const itemPayload = (item) => ({
  id: item._id.toString(),
  name: item.name,
  description: item.description || "",
  price: item.price,
  category: item.category || "item",
  restaurantId: item.restaurant?._id?.toString() || item.restaurant?.toString(),
  restaurantName: item.restaurant?.name || "Unknown restaurant",
  cuisine: item.restaurant?.cuisine || [],
  rating: item.restaurant?.rating || 0
});

const hydrateAiCombos = (combos = [], menuItems = []) => {
  const itemMap = new Map(menuItems.map((item) => [item._id.toString(), itemPayload(item)]));

  return combos.map((combo) => {
    const ids = combo.itemIds || combo.items?.map((item) => item.id || item._id).filter(Boolean) || [];
    const items = ids.map((id) => itemMap.get(String(id))).filter(Boolean);

    return {
      ...combo,
      items,
      totalPrice: combo.totalPrice || items.reduce((sum, item) => sum + item.price, 0)
    };
  });
};

const makeLocalMealCombos = (items, budget, people) => {
  const sorted = [...items].sort((a, b) => a.price - b.price);
  const combos = [];

  for (const main of sorted) {
    const remaining = budget - main.price;
    if (remaining < 0) continue;

    const sides = sorted
      .filter((item) => item._id.toString() !== main._id.toString() && item.price <= remaining)
      .slice(0, Math.max(0, people - 1));
    const comboItems = [main, ...sides];
    const total = comboItems.reduce((sum, item) => sum + item.price, 0);

    if (total <= budget) {
      combos.push({
        title: `${main.name} value combo`,
        totalPrice: total,
        savingsTip: total < budget ? `Leaves Rs.${budget - total} in your budget.` : "Uses the full budget well.",
        items: comboItems.map(itemPayload),
        reason: "Picked from available menu items by price fit and variety."
      });
    }

    if (combos.length >= 5) break;
  }

  return combos;
};

const makeLocalCrossRestaurantCombos = (items, budget, people) => {
  const byRestaurant = new Map();
  items.forEach((item) => {
    const key = item.restaurant?._id?.toString() || item.restaurant?.toString();
    if (!byRestaurant.has(key)) byRestaurant.set(key, []);
    byRestaurant.get(key).push(item);
  });

  const cheapestByRestaurant = [...byRestaurant.values()]
    .map((restaurantItems) => restaurantItems.sort((a, b) => a.price - b.price)[0])
    .filter(Boolean)
    .sort((a, b) => a.price - b.price);

  const combos = [];
  for (let start = 0; start < cheapestByRestaurant.length; start += 1) {
    const selected = [];
    let total = 0;

    for (const item of cheapestByRestaurant.slice(start)) {
      if (selected.length >= people) break;
      if (total + item.price <= budget) {
        selected.push(item);
        total += item.price;
      }
    }

    if (selected.length > 0) {
      combos.push({
        title: `${selected.length}-restaurant optimized combo`,
        totalPrice: total,
        restaurantCount: new Set(selected.map((item) => item.restaurant?._id?.toString())).size,
        items: selected.map(itemPayload),
        reason: "Optimized locally for maximum restaurant variety within budget."
      });
    }

    if (combos.length >= 5) break;
  }

  return combos;
};

const recommendMealCombos = async (req, res) => {
  try {
    const budget = toNumber(req.body.budget, 1500);
    const people = Math.max(1, toNumber(req.body.people, 1));
    const { restaurantIds, cuisine, dietaryRestrictions = [], preferences = [] } = req.body;
    const { menuItems } = await loadMenuContext({ restaurantIds });

    const filteredItems = cuisine
      ? menuItems.filter((item) => item.restaurant?.cuisine?.some((c) => c.toLowerCase() === cuisine.toLowerCase()))
      : menuItems;

    const localCombos = makeLocalMealCombos(filteredItems, budget, people);
    let ai = null;

    try {
      ai = await askGroq({
        system: "You are PocketPlate's meal recommendation engine. Return only valid JSON.",
        prompt: JSON.stringify({
          task: "Recommend meal combos from this menu. Use only provided item ids. Keep each combo within budget.",
          outputShape: {
            combos: [
              {
                title: "string",
                totalPrice: "number",
                itemIds: ["string"],
                reason: "string",
                savingsTip: "string"
              }
            ]
          },
          budget,
          people,
          cuisine,
          dietaryRestrictions,
          preferences,
          menuItems: filteredItems.map(itemPayload)
        })
      });
    } catch (error) {
      ai = { error: error.message };
    }

    res.status(200).json({
      aiEnabled: Boolean(process.env.GROQ_API_KEY),
      model: process.env.GROQ_API_KEY ? DEFAULT_MODEL : null,
      budget,
      people,
      combos: ai?.combos?.length ? hydrateAiCombos(ai.combos, filteredItems) : localCombos,
      fallbackCombos: localCombos,
      aiError: ai?.error
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const optimizeCrossRestaurantCombo = async (req, res) => {
  try {
    const budget = toNumber(req.body.budget, 2000);
    const people = Math.max(1, toNumber(req.body.people, 2));
    const { cuisine, preferences = [], restaurantIds } = req.body;
    const { menuItems } = await loadMenuContext({ restaurantIds, maxItems: 120 });
    const filteredItems = cuisine
      ? menuItems.filter((item) => item.restaurant?.cuisine?.some((c) => c.toLowerCase() === cuisine.toLowerCase()))
      : menuItems;
    const localCombos = makeLocalCrossRestaurantCombos(filteredItems, budget, people);
    let ai = null;

    try {
      ai = await askGroq({
        system: "You optimize cross-restaurant food combos for PocketPlate. Return only valid JSON.",
        prompt: JSON.stringify({
          task: "Build cross-restaurant combos. Prefer variety, value, and at least two restaurants when possible. Use only provided item ids.",
          outputShape: {
            combos: [
              {
                title: "string",
                totalPrice: "number",
                restaurantCount: "number",
                itemIds: ["string"],
                reason: "string"
              }
            ]
          },
          budget,
          people,
          cuisine,
          preferences,
          menuItems: filteredItems.map(itemPayload)
        })
      });
    } catch (error) {
      ai = { error: error.message };
    }

    res.status(200).json({
      aiEnabled: Boolean(process.env.GROQ_API_KEY),
      model: process.env.GROQ_API_KEY ? DEFAULT_MODEL : null,
      budget,
      people,
      combos: ai?.combos?.length ? hydrateAiCombos(ai.combos, filteredItems) : localCombos,
      fallbackCombos: localCombos,
      aiError: ai?.error
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPersonalizedRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ error: "User not found" });

    const recentOrders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    const { menuItems } = await loadMenuContext({ maxItems: 100 });
    const budget = user.budget || 1500;
    const localCombos = makeLocalMealCombos(menuItems, budget, 1);
    let ai = null;

    try {
      ai = await askGroq({
        system: "You personalize PocketPlate recommendations. Return only valid JSON.",
        prompt: JSON.stringify({
          task: "Recommend personalized meals using only provided item ids.",
          outputShape: {
            recommendations: [
              {
                title: "string",
                itemIds: ["string"],
                totalPrice: "number",
                reason: "string"
              }
            ]
          },
          userPreferences: user.preferences,
          budget,
          isEndOfMonthMode: user.isEndOfMonthMode,
          recentOrders: recentOrders.map((order) => order.items),
          menuItems: menuItems.map(itemPayload)
        })
      });
    } catch (error) {
      ai = { error: error.message };
    }

    res.status(200).json({
      aiEnabled: Boolean(process.env.GROQ_API_KEY),
      model: process.env.GROQ_API_KEY ? DEFAULT_MODEL : null,
      recommendations: ai?.recommendations?.length ? hydrateAiCombos(ai.recommendations, menuItems) : localCombos,
      fallbackRecommendations: localCombos,
      aiError: ai?.error
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  recommendMealCombos,
  optimizeCrossRestaurantCombo,
  getPersonalizedRecommendations
};
