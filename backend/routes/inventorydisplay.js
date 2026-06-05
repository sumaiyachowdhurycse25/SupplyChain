const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");


// =========================
// INVENTORY SUMMARY
// =========================
router.get("/inventory", adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM inventory_view
      ORDER BY product_name
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("INVENTORY VIEW ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// =========================
// LOW STOCK
// =========================
router.get("/low-stock", adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT *
      FROM inventory_view
      WHERE quantity <= COALESCE(reorder_level, 0)
      ORDER BY quantity ASC
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("LOW STOCK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;