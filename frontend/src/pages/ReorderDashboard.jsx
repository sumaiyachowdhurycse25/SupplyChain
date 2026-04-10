import React, { useEffect, useState } from "react";

// Helper to include token in every request
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  return fetch(url, { ...options, headers });
};

export default function ReorderDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchWithToken("http://100.54.124.184:5000/api/reorder");

        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (err) {
        console.error("Failed to fetch reorder data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>📦 Reorder Suggestions</h1>

      <div style={cardStyle}>
        {data.length === 0 ? (
          <div style={emptyStyle}>
            ✅ All products are sufficiently stocked.
          </div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Current Stock</th>
                <th style={thStyle}>Reorder Level</th>
                <th style={thStyle}>Reorder Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.map((p) => {
                const needsReorder = p.reorder_quantity > 0;

                return (
                  <tr key={p.product_id} style={rowStyle}>
                    <td style={tdStyle}>{p.product_name}</td>
                    <td style={tdStyle}>{p.sku}</td>
                    <td style={tdStyle}>{p.current_stock}</td>
                    <td style={tdStyle}>{p.reorder_level}</td>
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: "700",
                        color: needsReorder ? "#f87171" : "#34d399"
                      }}
                    >
                      {needsReorder ? `⚠ ${p.reorder_quantity}` : "0"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)"
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "800",
  marginBottom: "40px",
  background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const cardStyle = {
  padding: "30px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#fff"
};

const thStyle = {
  paddingBottom: "16px",
  textAlign: "left",
  fontSize: "13px",
  opacity: 0.7,
  textTransform: "uppercase",
  letterSpacing: "1px"
};

const rowStyle = {
  borderTop: "1px solid rgba(255,255,255,0.1)"
};

const tdStyle = {
  padding: "16px 0"
};

const emptyStyle = {
  padding: "40px",
  textAlign: "center",
  fontSize: "18px",
  opacity: 0.8
};
