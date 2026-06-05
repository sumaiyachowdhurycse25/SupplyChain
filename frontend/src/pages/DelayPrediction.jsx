import React, { useEffect, useState } from "react";
const API = "http://localhost:5000/api";

const COLORS = {
  High: "#ef4444",
  Medium: "#f59e0b",
  Low: "#22c55e"
};

// Helper function to include token
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");

  return fetch(API + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

// Format date
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default function DelayPrediction() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchWithToken("/delay-prediction")

      .then(res => res.json())
      .then(json => setData(Array.isArray(json) ? json : []))
      .catch(err => console.error("Error fetching delay prediction:", err));
  }, []);

  const highCount = data.filter(d => d.delay_risk === "High").length;
  const mediumCount = data.filter(d => d.delay_risk === "Medium").length;
  const lowCount = data.filter(d => d.delay_risk === "Low").length;

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>⏱ Shipment Delay Prediction</h1>

      {/* SUMMARY CARDS */}
      <div style={summaryContainer}>
  <SummaryCard
    label="Risk Level"
    title="High Risk"
    value={highCount}
    color="#ef4444"
  />
  <SummaryCard
    label="Risk Level"
    title="Medium Risk"
    value={mediumCount}
    color="#f59e0b"
  />
  <SummaryCard
    label="Risk Level"
    title="Low Risk"
    value={lowCount}
    color="#22c55e"
  />
</div>
      {/* TABLE */}
      <div style={cardStyle}>
        {data.length === 0 ? (
          <div style={emptyStyle}>No active shipments found.</div>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Shipment ID</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Expected Delivery</th>
                <th style={thStyle}>Delay Risk</th>
              </tr>
            </thead>
            <tbody>
              {data.map(s => {
                const isHigh = s.delay_risk === "High";

                return (
                  <tr
                    key={s.id}
                    style={{
                      ...rowStyle,
                      background: isHigh
                        ? "rgba(239,68,68,0.08)"
                        : "transparent"
                    }}
                  >
                    <td style={tdStyle}>{s.id}</td>
                    <td style={tdStyle}>{s.product}</td>
                    <td style={tdStyle}>{s.status}</td>
                    <td style={tdStyle}>
                      {formatDate(s.expected_delivery)}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          background: COLORS[s.delay_risk],
                          color: "#fff",
                          padding: "6px 14px",
                          borderRadius: "12px",
                          fontWeight: "600",
                          fontSize: "13px"
                        }}
                      >
                        {s.delay_risk}
                      </span>
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

/* ---------------- COMPONENTS ---------------- */

function SummaryCard({ label, title, value, color }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "24px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        textAlign: "left"
      }}
    >
      {/* Small Label */}
      <div
        style={{
          fontSize: "12px",
          opacity: 0.6,
          textTransform: "uppercase",
          letterSpacing: "1px"
        }}
      >
        {label}
      </div>

      {/* Title */}
      <div
        style={{
         
          marginTop: "6px",
          marginBottom: "12px",
 fontSize: "36px",
          fontWeight: "800",
          color: color
        }}
      >
        {title}
      </div>

      {/* Value */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: "800",
          color
        }}
      >
        {value}
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

const summaryContainer = {
  display: "flex",
  gap: "20px",
  marginBottom: "40px"
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
  opacity: 0.8
};
