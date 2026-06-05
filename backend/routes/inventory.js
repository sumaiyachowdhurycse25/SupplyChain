const express = require("express");
const router = express.Router();

const db = require("../db");
const adminAuth = require("../middleware/adminAuth");

const LowStockService = require("../services/lowStockService");
const { upsertStock } = require("../services/inventoryService");


// ======================
// GET INVENTORY
// ======================
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        i.id,
        p.name AS product_name,
        p.sku,
        w.name AS warehouse,
        i.quantity,
        p.reorder_level
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN warehouses w ON i.warehouse_id = w.id
      ORDER BY p.name
    `);

    res.json(result.rows);

  } catch (err) {
    console.error("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ======================
// ADD / UPDATE INVENTORY
// ======================
router.post("/", adminAuth, async (req, res) => {
  try {
    const record = await upsertStock(req.body);

    await LowStockService.checkLowStock();

    res.status(201).json(record);

  } catch (err) {
    console.error("POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ======================
// UPDATE INVENTORY
// ======================
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const result = await db.query(`
      UPDATE inventory
      SET quantity = $1
      WHERE id = $2
      RETURNING *
    `, [quantity, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Inventory record not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error("PUT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ======================
// DELETE INVENTORY
// ======================
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(`
      DELETE FROM inventory
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Inventory record not found"
      });
    }

    res.json({
      message: "Inventory deleted successfully"
    });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;