const express = require("express");
const cors = require("cors");
require("dotenv").config({
  path: "../.env"
});

const adminRoutes = require("./routes/adminauth");
const adminAuth = require("./middleware/adminauth");
const suppliers = require("./routes/suppliers");
const products = require("./routes/products");
const warehouses = require("./routes/warehouses");
const inventory = require("./routes/inventory");
const inventoryDisplay = require("./routes/inventorydisplay");
const shipments = require("./routes/shipments");
const pendingShipments = require("./routes/pending-shipments");

const purchaseorders = require("./routes/purchaseOrders");
const purchaseorderitems = require("./routes/purchaseOrderItems");

const reorder = require("./routes/reorder");
const delayPrediction = require("./routes/delayPrediction");
const routeOptimization = require("./routes/routeOptimization");

const ai = require("./routes/ai");
const { startNlpAutoSync } = require("./services/nlpAutoSync");
const nlpQuery = require("./routes/nlpQuery");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminRoutes);

// Protected route
app.use("/api/suppliers", adminAuth, suppliers);
app.use("/api/products", adminAuth, products);
app.use("/api/warehouses", adminAuth, warehouses);
app.use("/api/inventory", adminAuth, inventory);
app.use("/api/inventory-display", adminAuth, inventoryDisplay);
app.use("/api/shipments", adminAuth, shipments);
app.use("/api/pending-shipments", adminAuth, pendingShipments);
app.use("/api/purchase-orders", adminAuth, purchaseorders);
app.use("/api/purchase-order-items", adminAuth, purchaseorderitems);
app.use("/api/reorder", adminAuth, reorder);
app.use("/api/delay-prediction", adminAuth, delayPrediction);
app.use("/api/routes", adminAuth, routeOptimization);
app.use("/api/ai", adminAuth, ai);
app.use("/api/nlp", adminAuth, nlpQuery);

startNlpAutoSync();

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


