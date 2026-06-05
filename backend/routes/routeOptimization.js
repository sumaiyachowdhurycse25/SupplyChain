const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
router.post("/optimize", adminAuth, async (req, res) => {
  try {
    const { product_name } = req.body;

    if (!product_name) {
      return res.status(400).json({ error: "product_name is required" });
    }

    // Lookup product
    const productResult = await db.query(
      "SELECT id, name FROM products WHERE name ILIKE $1",
      [`%${product_name.trim()}%`]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = productResult.rows[0];

    // Get all warehouses
    const warehouses = await db.query("SELECT * FROM warehouses");

    // Get inventory for this product
    const inventoryResult = await db.query(
      "SELECT warehouse_id, quantity FROM inventory WHERE product_id = $1",
      [product.id]
    );

    const inventoryMap = {};
    for (const row of inventoryResult.rows) {
      inventoryMap[row.warehouse_id] = Number(row.quantity);
    }

    // Find the warehouse with the highest stock
    let bestRoute = null;
    let maxStock = -1;

    for (const w of warehouses.rows) {
      const stock = inventoryMap[w.id] || 0;
      if (stock > maxStock) {
        maxStock = stock;
        bestRoute = {
          warehouse_id: w.id,
          warehouse: w.name,
          stock,
          product_name: product.name
        };
      }
    }

    if (!bestRoute || bestRoute.stock === 0) {
      return res.status(404).json({ error: "No warehouse has this product in stock." });
    }

    res.json(bestRoute);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
