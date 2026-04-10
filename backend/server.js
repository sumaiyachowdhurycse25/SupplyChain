require("dotenv").config();

const express = require("express");
const cors = require("cors");

const suppliers = require("./routes/suppliers");
const products = require("./routes/products");
const inventory = require("./routes/inventory");
const shipments = require("./routes/shipments");
const ai = require("./routes/ai");
const alerts = require("./routes/alerts");
const warehouses = require("./routes/warehouses");
const inventorydisplay = require("./routes/inventorydisplay");
const pendingShipments = require("./routes/pending-shipments");
const purchaseorders = require("./routes/purchaseOrders");
const purchaseorderitems = require("./routes/purchaseOrderItems");
const reorder = require("./routes/reorder");
const delayPrediction = require("./routes/delayPrediction");
const routeOptimization = require("./routes/routeOptimization");
const forecast = require("./routes/forecast");
const forecastBatch = require("./routes/forecastBatch");
const adminAuth = require("./routes/adminAuth");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/suppliers", suppliers);
app.use("/api/products", products);
app.use("/api/inventory", inventory);
app.use("/api/shipments", shipments);
app.use("/api/ai", ai);
app.use("/api/alerts", alerts);
app.use("/api/warehouses", warehouses);
app.use("/api/inventorydisplay", inventorydisplay);
app.use("/api/pending-shipments", pendingShipments);
app.use("/api/purchase-orders", purchaseorders);
app.use("/api/purchase-order-items", purchaseorderitems);
app.use("/api/reorder", reorder);
app.use("/api/delay-prediction", delayPrediction);
app.use("/api/routes", routeOptimization);
app.use("/api/forecast", forecast);
app.use("/api/forecast-batch", forecastBatch);
app.use("/api/admin", adminAuth);
app.listen(5000, '0.0.0.0', () => {
  console.log("Server running on port 5000");
});


