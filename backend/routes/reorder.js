const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
/**
 * GET reorder recommendations
 */
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        p.sku,
        p.reorder_level,
        COALESCE(SUM(i.quantity), 0) AS current_stock,
        CASE
          WHEN COALESCE(SUM(i.quantity), 0) <= p.reorder_level
          THEN (p.reorder_level * 2) - COALESCE(SUM(i.quantity), 0)
          ELSE 0
        END AS reorder_quantity
      FROM products p
      LEFT JOIN inventory i ON p.id = i.product_id
      GROUP BY p.id
      ORDER BY reorder_quantity DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

