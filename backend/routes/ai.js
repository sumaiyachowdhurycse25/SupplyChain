// routes/ai.js

const router = require("express").Router();
const db = require("../db");
const adminAuth = require("../middleware/adminAuth");
const { parseQuery } = require("../services/queryService");

// Health check
router.get("/", adminAuth, (req, res) => {
  res.json({ status: "Safe query chatbot running" });
});

// Main endpoint
router.post("/query", adminAuth, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === "") {
      return res.status(400).json({ error: "Question is required" });
    }

    const parsed = parseQuery(question);

    if (parsed.type === "UNKNOWN") {
      return res.json({
        type: "UNKNOWN",
        count: 0,
        data: [],
        message: "Query not understood. Try: low stock, shipments, suppliers"
      });
    }

    // ✅ SAFE QUERY EXECUTION
    const result = await db.query(parsed.sql, parsed.params);

    res.json({
      type: parsed.type,
      count: result.rows.length,
      data: result.rows
    });

  } catch (err) {
    console.error("SAFE QUERY ERROR:", err);
    res.status(500).json({ error: "Query failed" });
  }
});

module.exports = router;