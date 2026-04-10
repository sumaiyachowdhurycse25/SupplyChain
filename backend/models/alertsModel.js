const db = require("../db");

exports.createAlert = async ({ type, message, product_id, warehouse_id }) => {
  const res = await db.query(
    `
    INSERT INTO alerts (type, message, product_id, warehouse_id)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [type, message, product_id, warehouse_id]
  );
  return res.rows[0];
};

exports.getUnread = async () => {
  const res = await db.query(
    "SELECT * FROM alerts WHERE is_read = false ORDER BY created_at DESC"
  );
  return res.rows;
};

