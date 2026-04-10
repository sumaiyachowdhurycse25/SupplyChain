const db = require("../db");

/**
 * Insert or update stock for a product in a warehouse
 */
exports.upsertStock = async ({ product_id, warehouse_id, quantity }) => {
  const result = await db.query(
    `
    INSERT INTO inventory (product_id, warehouse_id, quantity)
    VALUES ($1, $2, $3)
    ON CONFLICT (product_id, warehouse_id)
    DO UPDATE SET quantity = EXCLUDED.quantity
    RETURNING *
    `,
    [product_id, warehouse_id, quantity]
  );

  return result.rows[0];
};
