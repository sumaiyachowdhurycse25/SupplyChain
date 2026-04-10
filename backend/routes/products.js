const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
/**
 * GET all products
 */
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * ADD product
 */
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, sku, reorder_level } = req.body;

    const result = await db.query(
      `INSERT INTO products (name, sku, reorder_level)
       VALUES ($1, $2, $3) RETURNING *`,
      [name, sku, reorder_level]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE product
 */
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { name, reorder_level } = req.body;

    const result = await db.query(
      `UPDATE products
       SET name=$1, reorder_level=$2
       WHERE id=$3 RETURNING *`,
      [name, reorder_level, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE product
 */
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    await db.query("DELETE FROM products WHERE id=$1", [req.params.id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET /api/products/names


module.exports = router;


