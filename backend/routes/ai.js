const router = require("express").Router();
const db = require("../db");
const { askLLM } = require("../services/llmService");
const adminAuth = require("../middleware/adminAuth");

// Health check
router.get("/", adminAuth, async (req, res) => {
  res.json({ status: "AI route running" });
});

// Main AI query endpoint
router.post("/query", adminAuth, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question is required" });
    }

    // 🔥 Fetch only relevant columns (NOT SELECT *)
    const [
      inventory,
      suppliers,
      shipments,
      products,
      warehouses,
      purchaseOrders,
      purchaseOrderItems
    ] = await Promise.all([
      db.query(`
        SELECT product_id, warehouse_id, quantity
        FROM inventory
      `),
      db.query(`
        SELECT id, name
        FROM suppliers
      `),
      db.query(`
        SELECT id, status, expected_delivery, actual_delivery
        FROM shipments
      `),
      db.query(`
        SELECT id, name, sku
        FROM products
      `),
      db.query(`
        SELECT id, name, location
        FROM warehouses
      `),
      db.query(`
        SELECT id, supplier_id, status, order_date
        FROM purchase_orders
      `),
      db.query(`
        SELECT purchase_order_id, product_id, quantity
        FROM purchase_order_items
      `)
    ]);

    // 🧠 Structured context for LLM
    const context = {
      inventory: inventory.rows,
      suppliers: suppliers.rows,
      shipments: shipments.rows,
      products: products.rows,
      warehouses: warehouses.rows,
      purchase_orders: purchaseOrders.rows,
      purchase_order_items: purchaseOrderItems.rows
    };

    const systemPrompt = `
You are an AI supply chain analyst.

Rules:
- Use ONLY the provided data
- Do NOT invent numbers
- Be concise and factual
- If data is insufficient, say so clearly

You can:
- Detect low stock risks
- Identify delayed shipments
- Find supplier performance issues
- Answer forecasting questions qualitatively
`;

    const answer = await askLLM(question, context, systemPrompt);

    res.json({ answer });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ error: "AI processing failed" });
  }
});
router.post("/forecast-explain", adminAuth, async (req, res) => {
  try {
    const { product, history, predicted } = req.body;

    if (!product || !Array.isArray(history) || predicted == null) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const systemPrompt = `
You are a supply chain AI.
Rules:
- Use ONLY the provided inputs
- Do NOT invent numbers
- Be concise and factual
- If data is insufficient, say so clearly
`;

    const userPrompt = `
Product: ${product}
Historical demand: ${history.join(", ")}
Predicted demand: ${predicted}

Explain:
1. Why this prediction was made
2. Risk of stockout
3. Recommended action
`;

    const answer = await askLLM(userPrompt, null, systemPrompt);

    res.json({ explanation: answer });
  } catch (err) {
    console.error("AI EXPLAIN ERROR:", err);
    res.status(500).json({ error: "AI explanation failed" });
  }
});


module.exports = router;
