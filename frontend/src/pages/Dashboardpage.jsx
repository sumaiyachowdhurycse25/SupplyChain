import { useEffect, useState } from "react";
import PONotifications from "./PONotifications";

/* =======================
   Inject CSS Styles
======================= */
const styles = `
body {
  background: linear-gradient(135deg, #0f172a, #1e293b);
}
  
.low-stock-table {
    border-collapse: separate;
    border-spacing: 0 16px;
    width: 100%;
    background: transparent;
  }

  /* Header */
  .low-stock-table th {
    padding: 16px 24px;
    text-align: left;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 1.5px;
    font-weight: 600;
    background: linear-gradient(90deg, #60a5fa, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Glass Row */
  .low-stock-table tbody tr {
    transition: all 0.3s ease;
  }

  .low-stock-table td {
    padding: 20px 24px;
    font-size: 14px;
    color: #fff;

    background: rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);

    border-top: 1px solid rgba(255,255,255,0.12);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  /* Rounded glass card row */
  .low-stock-table td:first-child {
    border-radius: 16px 0 0 16px;
  }

  .low-stock-table td:last-child {
    border-radius: 0 16px 16px 0;
  }

  /* Hover Effect */
  .low-stock-table tbody tr:hover td {
    background: rgba(255,255,255,0.12);
    transform: translateY(-4px);
    box-shadow: 
      0 10px 30px rgba(0,0,0,0.35),
      inset 0 0 30px rgba(255,255,255,0.05);
    cursor: pointer;
  }

  /* Reorder Level Highlight */
  .low-stock-table td.reorder-level {
    font-weight: 600;
    background: linear-gradient(90deg, #f87171, #ef4444);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* Subtle row divider glow */
  .low-stock-table tbody tr::after {
    content: "";
    display: block;
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin-top: 8px;
  }
`;

if (typeof document !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.innerHTML = styles;
  document.head.appendChild(styleTag);
}

/* =======================
   Helper to include token
======================= */
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  return fetch(url, { ...options, headers });
};

/* =======================
   StatCard Component
======================= */
const StatCard = ({ title, value, highlight, type }) => {
  const stylesMap = {
    products: {
      gradient: "linear-gradient(135deg, #60A5FA, #2563EB)",
    },
    stock: {
      gradient: "linear-gradient(135deg, #34D399, #059669)",
    },
    shipment: {
      gradient: "linear-gradient(135deg, #FBBF24, #D97706)",
    },
    alert: {
      gradient: "linear-gradient(135deg, #F87171, #DC2626)",
    },
  };

  const current =
    stylesMap[type] || {
      gradient: "linear-gradient(135deg, #94A3B8, #64748B)",
    };

  return (
    <div
      style={{
        position: "relative",
        padding: "24px",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",

        // Glass effect
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.12)",

        // Depth
        boxShadow:
          "0 10px 35px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.04)",

        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 20px 50px rgba(0,0,0,0.55), inset 0 0 40px rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 10px 35px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.04)";
      }}
    >
      {/* Gradient glow layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "20px",
          background: current.gradient,
          opacity: 0.15,
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <span
          style={{
            fontSize: "13px",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            opacity: 0.7,
            color: "#fff",
          }}
        >
          {title}
        </span>

        <div
          style={{
            marginTop: "12px",
            fontSize: "32px",
            fontWeight: "700",
            background: current.gradient,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: highlight
              ? "0 0 15px rgba(248,113,113,0.7)"
              : "none",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
};

/* =======================
   LowStockTable Component
======================= */
const LowStockTable = ({ items }) => (
  <div style={{ overflowX: "auto" }}>
    <table className="low-stock-table" style={{ fontSize: "1.2rem", fontWeight: "700" }}>
      <thead>
        <tr>
          <th style={{ fontSize: "1.2rem", fontWeight: "700" }}>Product</th>
          <th style={{ fontSize: "1.2rem", fontWeight: "700" }}>Current Stock</th>
          <th style={{ fontSize: "1.2rem", fontWeight: "700" }}>Reorder Level</th>
        </tr>
      </thead>

      <tbody>
        {items.length === 0 ? (
          <tr>
            <td
              colSpan={3}
              style={{
                textAlign: "center",
                padding: "30px",
                color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                borderRadius: "16px",
                fontSize: "1.2rem",
                fontWeight: "700",
              }}
            >
              ✅ No low stock items
            </td>
          </tr>
        ) : (
          items.map((item) => {
            const isCritical = item.quantity <= item.reorder_level;

            return (
              <tr key={item.id}>
                <td style={{ fontWeight: "700", fontSize: "1.1rem" }}>{item.product_name}</td>

                <td
                  style={{
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    color: "#ffffff", // Always white
                  }}
                >
                  {item.quantity}
                </td>

                <td
                  className="reorder-level"
                  style={{
                    fontWeight: "700",
                    fontSize: "1.1rem",
                    color: "#f87171",
                    textShadow: isCritical
                      ? "0 0 10px rgba(248,113,113,0.7)"
                      : "none",
                  }}
                >
                  {item.reorder_level}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

/* =======================
   Dashboard Page
======================= */
const Dashboardpage = () => {
  const [products, setProducts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [pendingShipments, setPendingShipments] = useState(0);
  const [reorderCount, setReorderCount] = useState(0);
  const [forecastResults, setForecastResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          productsRes,
          inventoryRes,
          lowStockRes,
          pendingShipmentsRes,
          forecastRes
        ] = await Promise.all([
          fetchWithToken("http://100.54.124.184:5000/api/products"),
          fetchWithToken("http://100.54.124.184:5000/api/inventory"),
          fetchWithToken("http://100.54.124.184:5000/api/inventorydisplay/low-stock"),
          fetchWithToken("http://100.54.124.184:5000/api/pending-shipments"),
          fetchWithToken("http://100.54.124.184:5000/api/forecast-batch"),
        ]);

        const [
          productsData,
          inventoryData,
          lowStockData,
          pendingShipmentsData,
          forecastData
        ] = await Promise.all([
          productsRes.json(),
          inventoryRes.json(),
          lowStockRes.json(),
          pendingShipmentsRes.json(),
          forecastRes.json(),
        ]);

        setProducts(Array.isArray(productsData) ? productsData : []);
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
        setLowStock(Array.isArray(lowStockData) ? lowStockData : []);
        setPendingShipments(pendingShipmentsData.count || 0);
        setReorderCount(Array.isArray(forecastData) ? forecastData.length : 0);

        const storedForecasts = JSON.parse(localStorage.getItem("dashboardData") || "[]");
        setForecastResults(storedForecasts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalStock = inventory.reduce((sum, item) => sum + (item.quantity || item.qty || 0), 0);

  if (loading) {
    return <div style={{ padding: "32px", fontSize: "16px", color: "#e2e8f0" }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ padding: "32px", minHeight: "100vh", background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)", gap: "32px" }}>
    <h1
  style={{
    fontSize: "42px",
    fontWeight: "900",
    marginBottom: "40px",
    letterSpacing: "2px",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }}
>
  Supply Chain Dashboard
</h1>

   
      {/* Stats */}
 <div
  style={{
 

    position: "relative",
    marginBottom: "70px",
    padding: "30px",
    borderRadius: "28px",
    overflow: "hidden",

    // Glass background
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",

    // Depth
    boxShadow:
      "0 25px 70px rgba(0,0,0,0.45), inset 0 0 60px rgba(255,255,255,0.03)",
  }}
>
  {/* Soft gradient glow */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: "28px",
      background:
        "linear-gradient(135deg, rgba(96,165,250,0.08), rgba(168,85,247,0.05))",
      zIndex: 0,
    }}
  />

  <div
    style={{
      position: "relative",
      zIndex: 1,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "28px",
    }}
  >
    <StatCard
      title="Total Products"
      value={products.length}
      type="products"
    />
    <StatCard
      title="Current Stock"
      value={totalStock}
      type="stock"
    />
    <StatCard
      title="Pending Shipments"
      value={pendingShipments}
      type="shipment"
    />
    <StatCard
      title="Stockout Alerts"
      value={lowStock.length}
      type="alert"
      highlight
    />
  </div>
</div>

      
      {/* Low Stock Table */}
<div
  style={{
    position: "relative",
    padding: "32px",
    borderRadius: "24px",
    marginTop: "60px",
    overflow: "hidden",

    // Glass effect
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255,255,255,0.12)",

    // Depth
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)",
  }}
>
  {/* Subtle gradient glow layer */}
  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: "24px",
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
      zIndex: 0,
    }}
  />

  <div style={{ position: "relative", zIndex: 1 }}>
    <h2
      style={{
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "24px",
        background:
          "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "0.5px",
      }}
    >
      ⚠ Low Stock Alerts
    </h2>

    <LowStockTable items={lowStock} />
  </div>
</div>

<div style={{ marginTop: "60px" }}>

   {/* Purchase Order Notifications */}
      <PONotifications />
</div>      




     {/* Latest 3 Forecast Results */}
{forecastResults.length > 0 && (
  <div style={{ marginTop: "60px" }}>
    <h2
      style={{
        fontSize: "28px",
        fontWeight: "700",
        marginBottom: "24px",
        background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "0.5px",
      }}
    >
      🔮 Latest Forecast Results
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
      }}
    >
      {forecastResults
        .slice(-3)
        .reverse()
        .map((item, idx) => (
          <div
            key={idx}
            style={{
              position: "relative",
              padding: "24px",
              borderRadius: "20px",
              color: "#fff",
              cursor: "pointer",

              // Glass Effect
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.15)",

              // Glow
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.35), inset 0 0 40px rgba(255,255,255,0.04)",

              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 15px 45px rgba(0,0,0,0.55), inset 0 0 60px rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 8px 32px rgba(0,0,0,0.35), inset 0 0 40px rgba(255,255,255,0.04)";
            }}
          >
            {/* Gradient shine layer */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.02))",
                zIndex: 0,
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  letterSpacing: "0.5px",
                }}
              >
                {item.name}
              </h4>

              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  marginBottom: "8px",
                  background:
                    "linear-gradient(90deg, #60a5fa, #a78bfa)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {item.predicted}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  opacity: 0.65,
                  marginTop: "8px",
                }}
              >
                {new Date(item.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
    </div>
  </div>
)}

    </div>
  );
};

export default Dashboardpage;

