import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import AdminRoute from "./components/AdminRoute";

import Dashboardpage from "./pages/Dashboardpage";
import AdminLogin from "./pages/AdminLogin";
import AIChat from "./pages/AIChat";
import Suppliers from "./pages/Suppliers";
import Products from "./pages/Products";
import Warehouses from "./pages/warehouses";
import Inventory from "./pages/Inventory";
import Inventorydisplay from "./pages/Inventorydisplay";
import ShipmentTracking from "./pages/ShipmentTracking";
import AddShipment from "./pages/AddShipment";
import PurchaseOrders from "./pages/PurchaseOrders";
import PurchaseOrderItems from "./pages/PurchaseOrderItems";
import ReorderDashboard from "./pages/ReorderDashboard";
import DelayPrediction from "./pages/DelayPrediction";
import RouteOptimization from "./pages/RouteOptimization";
import DemandForecast from "./pages/DemandForecast";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {isLoggedIn && <Sidebar />}

        <main style={{ flex: 1, padding: "24px" }}>
          <Routes>

            <Route
              path="/admin-login"
              element={
                isLoggedIn
                  ? <Navigate to="/" replace />
                  : <AdminLogin setIsLoggedIn={setIsLoggedIn} />
              }
            />

            <Route
              path="/"
              element={
                isLoggedIn
                  ? <Dashboardpage />
                  : <Navigate to="/admin-login" replace />
              }
            />

         


            <Route path="/ai" element={<AdminRoute><AIChat /></AdminRoute>} />
            <Route path="/suppliers" element={<AdminRoute><Suppliers /></AdminRoute>} />
            <Route path="/products" element={<AdminRoute><Products /></AdminRoute>} />
            <Route path="/warehouses" element={<AdminRoute><Warehouses /></AdminRoute>} />
            <Route path="/inventory" element={<AdminRoute><Inventory /></AdminRoute>} />
            <Route path="/inventorydisplay" element={<AdminRoute><Inventorydisplay /></AdminRoute>} />
            <Route path="/ShipmentTracking" element={<AdminRoute><ShipmentTracking /></AdminRoute>} />
            <Route path="/shipments/new" element={<AdminRoute><AddShipment /></AdminRoute>} />
            <Route path="/purchase-orders" element={<AdminRoute><PurchaseOrders /></AdminRoute>} />
            <Route path="/purchase-orders/:id" element={<AdminRoute><PurchaseOrderItems /></AdminRoute>} />
            <Route path="/reorder" element={<AdminRoute><ReorderDashboard /></AdminRoute>} />
            <Route path="/delay-prediction" element={<AdminRoute><DelayPrediction /></AdminRoute>} />
            <Route path="/route-optimization" element={<AdminRoute><RouteOptimization /></AdminRoute>} />
            <Route path="/forecast" element={<AdminRoute><DemandForecast /></AdminRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
