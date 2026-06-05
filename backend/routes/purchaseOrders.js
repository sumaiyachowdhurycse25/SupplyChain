const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
/**
 * GET all purchase orders
 */
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT po.id, po.supplier_id, s.name AS supplier, po.order_date, po.status, po.total_amount
      FROM purchase_orders po
      JOIN suppliers s ON s.id = po.supplier_id
      ORDER BY po.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * CREATE purchase order
 */
router.post("/", adminAuth, async (req, res) => {
  const { supplier_id, order_date, status, total_amount } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO purchase_orders
       (supplier_id, order_date, status, total_amount)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [supplier_id, order_date, status, total_amount]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/notifications", adminAuth, async (req, res) => {
  try {
    // Get POs created in last 10 seconds or still pending
    const result = await db.query(
      `
      SELECT po.id, s.name AS supplier, po.order_date, po.status
      FROM purchase_orders po
      JOIN suppliers s ON s.id = po.supplier_id
      WHERE po.status = 'Pending'
      ORDER BY po.order_date DESC
      `
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * UPDATE purchase order
 */
router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { supplier_id, order_date, status, total_amount } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE purchase_orders
      SET supplier_id = $1, order_date = $2, status = $3, total_amount = $4
      WHERE id = $5
      RETURNING *
      `,
      [supplier_id, order_date, status, total_amount, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE purchase order
 */
router.delete("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `DELETE FROM purchase_orders WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Purchase order not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

