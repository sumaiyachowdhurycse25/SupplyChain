const db = require("../db");
const Alerts = require("../models/alertsModel");

exports.checkLowStock = async () => {
  try {

    const result = await db.query(`
      SELECT i.product_id, i.warehouse_id, i.quantity, p.reorder_level, p.name
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      WHERE i.quantity < p.reorder_level
    `);

    for (const item of result.rows) {

      // 🔥 Prevent duplicate alerts
      const existing = await db.query(
        `
        SELECT id FROM alerts
        WHERE product_id = $1
          AND warehouse_id = $2
          AND type = 'LOW_STOCK'
          AND is_read = false
        `,
        [item.product_id, item.warehouse_id]
      );

      if (existing.rows.length > 0) {
        continue; // already exists → skip
      }

      const message = `Low stock alert: ${item.name} has ${item.quantity} units (reorder level ${item.reorder_level})`;

      await Alerts.createAlert({
        type: "LOW_STOCK",
        message,
        product_id: item.product_id,
        warehouse_id: item.warehouse_id
      });
    }

  } catch (err) {
    console.error("LOW STOCK CHECK ERROR:", err);
  }
};
