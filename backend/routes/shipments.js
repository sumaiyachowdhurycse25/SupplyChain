const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
/**
 * GET shipments (optional status filter)
 */
router.get("/", adminAuth, async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT
        s.id,
        p.name AS product,
        s.status,
        s.expected_delivery,
        s.actual_delivery
      FROM shipments s
      JOIN products p ON p.id = s.product_id
    `;

    const params = [];

    if (status && status !== "All") {
      query += " WHERE s.status = $1";
      params.push(status);
    }

    query += " ORDER BY s.id DESC";

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * CREATE shipment
 */
router.post("/", adminAuth, async (req, res) => {
  const { product_id, status = "Pending", expected_delivery, actual_delivery } = req.body;

  if (!product_id || !expected_delivery) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const safeActualDelivery =
    status === "Delivered" ? actual_delivery || new Date() : null;

  try {
    const result = await db.query(
      `
      INSERT INTO shipments
        (product_id, status, expected_delivery, actual_delivery)
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [product_id, status, expected_delivery, safeActualDelivery]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE shipment status
 */
router.put("/:id", adminAuth, async (req, res) => {
  const { id } = req.params;
  const { status, actual_delivery } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  const safeActualDelivery =
    status === "Delivered"
      ? actual_delivery || new Date()
      : null;

  try {
  const result = await db.query(
  `
  UPDATE shipments AS s
  SET status = $1,
      actual_delivery = $2
  FROM products p
  WHERE s.id = $3 AND s.product_id = p.id
  RETURNING s.id, s.product_id, s.status, s.expected_delivery, s.actual_delivery, p.name AS product
  `,
  [status, safeActualDelivery, id]
);


    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE shipment
 */
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `
      DELETE FROM shipments
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Shipment not found" });
    }

    res.json({ message: "Shipment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
