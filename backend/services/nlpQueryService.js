function buildQuery({ intent, product }) {

  /* =========================
     LOW STOCK
  ========================= */
  if (intent === "LOW_STOCK") {
    let sql = `
      SELECT products.name, inventory.quantity
      FROM inventory
      JOIN products ON products.id = inventory.product_id
      WHERE inventory.quantity < 10
    `;

    const params = [];

    if (product) {
      sql += " AND products.name ILIKE $1";
      params.push(`%${product}%`);
    }

    return { sql, params };
  }

  /* =========================
     DELAYED SHIPMENTS
  ========================= */
  if (intent === "DELAYED") {
    let sql = `
      SELECT shipments.id,
             products.name AS product,
             shipments.status,
             shipments.expected_delivery,
             shipments.actual_delivery
      FROM shipments
      JOIN products ON products.id = shipments.product_id
      WHERE shipments.status = 'Delayed'
         OR (
           shipments.actual_delivery IS NOT NULL
           AND shipments.expected_delivery IS NOT NULL
           AND shipments.actual_delivery > shipments.expected_delivery
         )
    `;

    const params = [];

    if (product) {
      sql += " AND products.name ILIKE $1";
      params.push(`%${product}%`);
    }

    return { sql, params };
  }

  /* =========================
     PURCHASE ORDERS (FIXED)
  ========================= */
  if (intent === "PURCHASE_ORDERS") {
    let sql = `
      SELECT 
        purchase_orders.id,
        suppliers.name AS supplier,
        purchase_orders.order_date,
        purchase_orders.status,
        purchase_orders.total_amount
      FROM purchase_orders
      LEFT JOIN suppliers
        ON suppliers.id = purchase_orders.supplier_id
    `;

    return { sql, params: [] };
  }

  /* =========================
     INVENTORY
  ========================= */
  if (intent === "INVENTORY") {
    let sql = `
      SELECT products.name, inventory.quantity
      FROM inventory
      JOIN products ON products.id = inventory.product_id
    `;

    return { sql, params: [] };
  }

  /* =========================
     SUPPLIERS
  ========================= */
  if (intent === "SUPPLIERS") {
    let sql = `
      SELECT id, name FROM suppliers
    `;

    return { sql, params: [] };
  }

  return null;
}

module.exports = { buildQuery };