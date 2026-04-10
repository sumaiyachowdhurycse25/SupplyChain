const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
/**
 * Predict delayed shipments
 */
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        s.id,
        p.name AS product,
        s.status,
        s.expected_delivery,
        CURRENT_DATE - s.expected_delivery AS days_late,
        CASE
          WHEN s.status = 'Delayed' THEN 'High'
          WHEN s.status = 'In Transit' 
               AND CURRENT_DATE > s.expected_delivery THEN 'High'
          WHEN s.status = 'In Transit' 
               AND CURRENT_DATE + INTERVAL '2 days' >= s.expected_delivery THEN 'Medium'
          ELSE 'Low'
        END AS delay_risk
      FROM shipments s
      JOIN products p ON p.id = s.product_id
      ORDER BY delay_risk DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

