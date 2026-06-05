const { NlpManager } = require("node-nlp");
const { Pool } = require("pg");

/* =========================
   DATABASE
========================= */
const db = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_CO1lAeH9NEKr@ep-mute-frost-amo4qgj3-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false,
  },
});

/* =========================
   NLP MANAGER
========================= */
const manager = new NlpManager({ languages: ["en"] });

/* =========================
   TRAINING DATA
========================= */

const LOW_STOCK = [
  "low stock","which products have low stock","show low stock products",
  "what products are low in stock","items running low","inventory is low",
  "products below threshold","which items need restocking",
  "what should i restock","anything running out","products with low quantity",
  "stock is running out","items almost out of stock","list low inventory items",
  "products nearly finished","stock shortage items","low quantity products",
  "items below minimum stock","products under stock limit",
  "what items are understocked","inventory shortage products",
  "items low in warehouse","what products are nearly out",
  "show products under threshold","list items running low",
  "products needing restock","low inventory warning","inventory critical items",
  "products below safe level","items low in quantity","low inventory list",
  "items to reorder","stock running out soon","products almost finished",
  "low quantity alert","stock below required level","inventory below minimum",
  "low stock list","products in shortage","items below safety stock",
  "low inventory products","items with shortage","inventory low items",
  "items almost depleted","low stock warning","products with shortage",
  "inventory under limit","low supply items","stock deficiency",
  "inventory critical level","stock near zero","inventory nearly empty",
  "products below safe stock","stock nearly empty","inventory running out",
  "products at risk of stockout","low stock detection",
  "inventory shortage list","stock deficit items","inventory low alert",
  "items short in stock","low stock check","inventory insufficient"
];

const DELAYED = [
  "delayed shipments","which shipments are delayed","late deliveries",
  "shipment delay","which deliveries are late","late shipment items",
  "delayed delivery list","show delayed shipments","what shipments are delayed",
  "shipment delays","late delivery items","delayed orders",
  "shipment running late","delivery delay","delayed logistics",
  "late shipment report","items delayed in transit","shipment issues",
  "delayed goods","late shipment status","delivery problems",
  "shipment stuck","delivery stuck in transit","late logistics",
  "shipment behind schedule","delivery behind schedule",
  "shipment delay alert","late shipments list","delayed transport",
  "delivery delay issues","shipment problem","delivery problem",
  "delayed packages","late delivery alert","shipment overdue",
  "delivery overdue","shipment not delivered on time",
  "delivery not on time","shipment timing issue",
  "late arrival shipments","shipment slow","delayed logistics items",
  "shipment stuck in transit","late goods","shipment delay tracking",
  "delivery tracking delay","shipment delay analysis",
  "shipment delay warning","delivery delay warning",
  "delayed freight","late freight","shipment behind time",
  "delivery behind time","shipment delay check","delivery delay check"
];

const INVENTORY = [
  "inventory","show inventory","all inventory","inventory list",
  "show stock","warehouse stock","product inventory",
  "list all products","available stock","inventory status"
];

const PURCHASE_ORDERS = [
  "purchase orders","show purchase orders","orders list",
  "supplier orders","recent orders","order history",
  "all purchase orders","orders from suppliers"
];

/* =========================
   LOAD TRAINING INTO NLP
========================= */
LOW_STOCK.forEach(text => manager.addDocument("en", text, "LOW_STOCK"));
DELAYED.forEach(text => manager.addDocument("en", text, "DELAYED"));
INVENTORY.forEach(text => manager.addDocument("en", text, "INVENTORY"));
PURCHASE_ORDERS.forEach(text => manager.addDocument("en", text, "PURCHASE_ORDERS"));

/* =========================
   LOAD PRODUCT ENTITIES
========================= */
async function loadEntities() {
  const res = await db.query("SELECT name FROM products");

  res.rows.forEach(p => {
    manager.addNamedEntityText(
      "product",
      p.name,
      ["en"],
      [p.name.toLowerCase()]
    );
  });

  console.log("✅ Products loaded into NLP");
}

/* =========================
   TRAIN MODEL
========================= */
async function trainModel() {
  await loadEntities();
  await manager.train();
  manager.save();
  console.log("✅ NLP trained");
}

/* =========================
   PROCESS QUERY
========================= */
async function processQuery(question) {
  const result = await manager.process("en", question);

  console.log("NLP RESULT:", result);

  const productEntity = result.entities.find(
    e => e.entity === "product"
  );

  const q = question.toLowerCase();

  /* =========================
     FALLBACK LOGIC (VERY IMPORTANT)
  ========================= */
  if (!result.intent || result.intent === "None" || result.score < 0.2) {

    if (q.includes("stock") || q.includes("low")) {
      return { intent: "LOW_STOCK", product: productEntity?.option || null };
    }

    if (q.includes("delay") || q.includes("late")) {
      return { intent: "DELAYED", product: productEntity?.option || null };
    }

    if (q.includes("inventory")) {
      return { intent: "INVENTORY", product: productEntity?.option || null };
    }

    if (q.includes("order")) {
      return { intent: "PURCHASE_ORDERS", product: productEntity?.option || null };
    }

    return {
      intent: "UNKNOWN",
      product: productEntity?.option || null,
      confidence: result.score
    };
  }

  /* =========================
     NORMAL RETURN
  ========================= */
  return {
    intent: result.intent,
    product: productEntity?.option || null,
    confidence: result.score
  };
}

module.exports = {
  manager,
  trainModel,
  processQuery,
  db
};