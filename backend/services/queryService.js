// services/queryService.js

function extractNumber(q) {
  const match = q.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function parseQuery(question) {
  const q = question.toLowerCase();

  const number = extractNumber(q);

  // 📦 LOW STOCK
  if (q.includes("low stock") || q.includes("out of stock")) {
    return {
      type: "LOW_STOCK",
      sql: `
        SELECT p.name AS product, i.quantity, w.name AS warehouse
        FROM inventory i
        JOIN products p ON p.id = i.product_id
        JOIN warehouses w ON w.id = i.warehouse_id
        WHERE i.quantity < $1
        ORDER BY i.quantity ASC
      `,
      params: [number || 10]
    };
  }

  // 🚚 DELAYED SHIPMENTS
  if (q.includes("delayed") || q.includes("late shipment")) {
 
 
  return {
    type: "DELAYED_SHIPMENTS",
    sql: `
      SELECT 
        s.id,
        p.name AS product,
        s.status,
        s.expected_delivery,
        s.actual_delivery,
        CASE 
          WHEN s.status = 'Delayed' THEN true
          WHEN s.actual_delivery IS NOT NULL 
               AND s.actual_delivery > s.expected_delivery THEN true
          ELSE false
        END AS is_delayed
      FROM shipments s
      JOIN products p ON p.id = s.product_id
      WHERE s.status = 'Delayed'
         OR (s.actual_delivery IS NOT NULL 
             AND s.actual_delivery > s.expected_delivery)
      ORDER BY s.expected_delivery DESC
    `,
    params: []
  };
}

  // 🏭 SUPPLIERS
  if (q.includes("suppliers")) {
    return {
      type: "SUPPLIERS",
      sql: `
        SELECT id, name
        FROM suppliers
        ORDER BY name ASC
      `,
      params: []
    };
  }

  // 📊 PURCHASE ORDERS
  if (q.includes("purchase orders")) {
    return {
      type: "PURCHASE_ORDERS",
      sql: `
           SELECT 
        purchase_orders.id,
        suppliers.name AS supplier,
        purchase_orders.order_date,
        purchase_orders.status,
        purchase_orders.total_amount
      FROM purchase_orders
      LEFT JOIN suppliers
        ON suppliers.id = purchase_orders.supplier_id
    `,
      params: []
    };
  }

  // 📦 INVENTORY
  if (q.includes("inventory")) {
    return {
      type: "INVENTORY",
      sql: `
        SELECT p.name AS product, w.name AS warehouse, i.quantity
        FROM inventory i
        JOIN products p ON p.id = i.product_id
        JOIN warehouses w ON w.id = i.warehouse_id
        ORDER BY w.name
      `,
      params: []
    };
  }

  return { type: "UNKNOWN", sql: "", params: [] };
}

module.exports = { parseQuery };