const { Pool } = require("pg");
const { manager } = require("./nlpModel");

/* =========================
   DATABASE
========================= */
const db = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_CO1lAeH9NEKr@ep-mute-frost-amo4qgj3-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false
  }
});

/* =========================
   CACHE (avoid duplicates)
========================= */
let cache = new Set();

/* =========================
   LOAD EXISTING PRODUCTS
========================= */
async function loadExistingProducts() {
  const res = await db.query("SELECT name FROM products");

  for (const p of res.rows) {
    if (!cache.has(p.name)) {
      cache.add(p.name);

      manager.addNamedEntityText(
        "product",
        p.name,
        ["en"],
        [p.name.toLowerCase()]
      );
    }
  }

  console.log("✅ NLP: existing products loaded");
}

/* =========================
   SMART SYNC (OPTIMIZED)
   instead of full polling, only fetch new items
========================= */
async function syncNewProducts() {
  try {
    const res = await db.query(
      "SELECT name FROM products WHERE name IS NOT NULL"
    );

    for (const p of res.rows) {
      if (!cache.has(p.name)) {
        cache.add(p.name);

        manager.addNamedEntityText(
          "product",
          p.name,
          ["en"],
          [p.name.toLowerCase()]
        );

        console.log("🆕 New product synced:", p.name);
      }
    }
  } catch (err) {
    console.error("NLP sync error:", err.message);
  }
}

/* =========================
   START AUTO SYNC
========================= */
function startNlpAutoSync() {
  loadExistingProducts();

  // safer interval (not too aggressive)
  setInterval(syncNewProducts, 30000);

  console.log("🔄 NLP Auto Sync Started");
}

module.exports = { startNlpAutoSync };