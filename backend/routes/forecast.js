const router = require("express").Router();
const db = require("../db");
const axios = require("axios");
const adminAuth = require("../middleware/adminAuth");
/**
 * Forecast demand for a product
 */
router.get("/:productId", adminAuth, async (req, res) => {
  try {
    const { productId } = req.params;

    // Derive demand from delivered shipments (no new table)
    const history = await db.query(`
      SELECT
        DATE(actual_delivery) AS day,
        COUNT(*) * 10 AS quantity
      FROM shipments
      WHERE product_id = $1
        AND status = 'Delivered'
        AND actual_delivery IS NOT NULL
      GROUP BY day
      ORDER BY day
    `, [productId]);

    if (history.rows.length < 5) {
      return res.json({
        predicted_demand: 0,
        message: "Not enough historical data"
      });
    }

    const sales = history.rows.map(r => r.quantity);

    // Call Python LSTM service
    const response = await axios.post(
      "http://ml:2500/forecast",
      { sales }
    );

    res.json({
      product_id: productId,
      predicted_demand: response.data.predicted_demand,
      history: history.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
