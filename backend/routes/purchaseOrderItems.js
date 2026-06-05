const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
/**
 * GET items for a purchase order
 */
router.get("/:poId", adminAuth, async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        poi.id,
        p.name AS product,
        poi.quantity,
        poi.unit_price,
        (poi.quantity * poi.unit_price) AS line_total
      FROM purchase_order_items poi
      JOIN products p ON p.id = poi.product_id
      WHERE poi.purchase_order_id = $1
      ORDER BY poi.id
      `,
      [req.params.poId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADD item to purchase order
 */
router.post("/", adminAuth, async (req, res) => {
  const { purchase_order_id, product_id, quantity, unit_price } = req.body;

  try {
    const result = await db.query(
      `
      INSERT INTO purchase_order_items
      (purchase_order_id, product_id, quantity, unit_price)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [purchase_order_id, product_id, quantity, unit_price]
    );

    // 🔁 Update PO total
    await db.query(
      `
      UPDATE purchase_orders
      SET total_amount = (
        SELECT COALESCE(SUM(quantity * unit_price), 0)
        FROM purchase_order_items
        WHERE purchase_order_id = $1
      )
      WHERE id = $1
      `,
      [purchase_order_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  const { quantity, unit_price } = req.body;
  const { id } = req.params;

  try {
    const result = await db.query(
      `
      UPDATE purchase_order_items
      SET quantity = $1, unit_price = $2
      WHERE id = $3
      RETURNING *
      `,
      [quantity, unit_price, id]
    );

    
    await db.query(
      `
      UPDATE purchase_orders
      SET total_amount = (
        SELECT COALESCE(SUM(quantity * unit_price), 0)
        FROM purchase_order_items
        WHERE purchase_order_id = (SELECT purchase_order_id FROM purchase_order_items WHERE id = $1)
      )
      WHERE id = (SELECT purchase_order_id FROM purchase_order_items WHERE id = $1)
      `,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const poIdResult = await db.query(
      `SELECT purchase_order_id FROM purchase_order_items WHERE id = $1`,
      [id]
    );
    const poId = poIdResult.rows[0].purchase_order_id;

    await db.query(`DELETE FROM purchase_order_items WHERE id = $1`, [id]);


    await db.query(
      `
      UPDATE purchase_orders
      SET total_amount = (
        SELECT COALESCE(SUM(quantity * unit_price), 0)
        FROM purchase_order_items
        WHERE purchase_order_id = $1
      )
      WHERE id = $1
      `,
      [poId]
    );

    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
