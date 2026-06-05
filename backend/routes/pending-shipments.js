const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT COUNT(*) AS pending
       FROM shipments
       WHERE status IN ('In Transit', 'Delayed')`
    );

    res.json({ count: Number(result.rows[0].pending) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

