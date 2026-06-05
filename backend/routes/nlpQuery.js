const router = require("express").Router();
const { Pool } = require("pg");

const db = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_CO1lAeH9NEKr@ep-mute-frost-amo4qgj3-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: { rejectUnauthorized: false }
});


const adminAuth = require("../middleware/adminauth");

const { processQuery } = require("../services/nlpModel");
const { buildQuery } = require("../services/nlpQueryService");
const { buildReply } = require("../services/replyEngine");

/* =========================
   DATA PREPARATION
========================= */
function prepareData(intent, rows) {

  if (intent === "PURCHASE_ORDERS") {
    return {
      count: rows.length,
      items: rows.slice(0, 5)
    };
  }

  if (intent === "LOW_STOCK") {
    return {
      count: rows.length,
      items: rows.slice(0, 5)
    };
  }

  if (intent === "DELAYED") {
    return {
      count: rows.length,
      urgent: rows[0],
      items: rows.slice(0, 5)
    };
  }

  return {
    count: rows.length,
    items: rows
  };
}

/* =========================
   ENDPOINT
========================= */
router.post("/query", adminAuth, async (req, res) => {
  try {
    const { question } = req.body;

    const parsed = await processQuery(question);

    if (parsed.intent === "UNKNOWN") {
      return res.json({
        intent: "UNKNOWN",
        count: 0,
        data: [],
        reply: "Try asking about inventory, stock, shipments, suppliers, or purchase orders."
      });
    }

    const query = buildQuery(parsed);
    const result = await db.query(query.sql, query.params || []);

    const prepared = prepareData(parsed.intent, result.rows);

    const reply = buildReply(parsed.intent, prepared);

    return res.json({
      intent: parsed.intent,
      count: prepared.count,
      data: prepared.items,
      reply
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;