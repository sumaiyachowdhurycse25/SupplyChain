const router = require("express").Router();
const db = require("../db");
const axios = require("axios");
const adminAuth = require("../middleware/adminAuth");
router.get("/", adminAuth, async (req, res) => {
  try {
    // Fetch all products
    const productsRes = await db.query("SELECT id, name FROM products");
    const products = productsRes.rows;

    if (!products.length) return res.json({ message: "No products found" });

    // Map each product to a forecast promise
    const forecastPromises = products.map(async (p) => {
      try {
        // Get last 5 inventory records based on id (most recent)
        const historyRes = await db.query(
          `SELECT quantity FROM inventory WHERE product_id = $1 ORDER BY id DESC LIMIT 5`,
          [p.id]
        );

        const sales = historyRes.rows.map(r => r.quantity ?? 0);
        if (!sales.length) return null;

        // Call forecast API
        const forecastRes = await axios.post(
          "http://ml:2500/forecast",
          { sales },
          { timeout: 5000 }
        );

        return {
          id: p.id,
          name: p.name,
          predicted_demand: forecastRes.data.predicted_demand ?? 0
        };
      } catch (err) {
        console.log(`Error for product ${p.name}:`, err.response?.data || err.message);
        return null;
      }
    });

    const forecasts = (await Promise.all(forecastPromises)).filter(f => f);

    if (!forecasts.length) return res.json({ message: "No forecast data available" });

    res.json(forecasts); // return all products with predicted demand
  } catch (err) {
    console.error("Error in /forecast-batch:", err.message);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;
