import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

const STATUS_COLORS = {
  "In Transit": "rgba(59, 130, 246, 0.8)",
  Delivered: "rgba(34, 197, 94, 0.8)",
  Delayed: "rgba(239, 68, 68, 0.8)",
};

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

const glassCard = {
  background: "rgba(255, 255, 255, 0.06)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

export default function ShipmentTracking() {
  const [shipments, setShipments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const url =
        filter === "All"
          ? "/shipments"
          : `/shipments?status=${encodeURIComponent(filter)}`;

      const res = await fetchWithToken(url);
      const data = await res.json();
      setShipments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const res = await fetchWithToken(`/shipments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      const updated = await res.json();
      setShipments((prev) =>
        prev.map((s) => (s.id === id ? updated : s))
      );
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteShipment = async (id) => {
    if (!window.confirm("Delete this shipment?")) return;

    await fetchWithToken(`/shipments/${id}`, { method: "DELETE" });
    setShipments((prev) => prev.filter((s) => s.id !== id));
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString() : "--");
  const recentShipments = shipments.slice(0, 3);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px",
        color: "#e5e7eb",
        background:
          "radial-gradient(circle at top, #0b1220, #05070f 60%, #000000)",
      }}
    >
      <h2 style={{ marginBottom: "18px" }}>🚚 Shipment Tracking</h2>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["All", "In Transit", "Delivered", "Delayed"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: "8px 14px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              background:
                filter === t
                  ? "rgba(59,130,246,0.25)"
                  : "rgba(255,255,255,0.05)",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* OUTER WRAPPER */}
      <div
        style={{
          width: "95vw",
          maxWidth: "1600px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >

        {/* ================= TABLE SECTION ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

          {/* 🔥 STICKY HEADER */}
          <div
            style={{
              position: "sticky",
              top: "0px",
              zIndex: 20,
              ...glassCard,
              padding: "12px 14px",
              display: "grid",
              gridTemplateColumns:
                "0.5fr 2fr 1.5fr 1.5fr 1.5fr 0.8fr",
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              opacity: 0.85,
              fontWeight: "600",
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <div>ID</div>
            <div>Product</div>
            <div>Status</div>
            <div>Expected</div>
            <div>Actual</div>
            <div>Action</div>
          </div>

          {/* ================= MAIN SHIPMENTS CARD ================= */}
          <div style={{ ...glassCard, padding: "14px" }}>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

              {loading ? (
                <div style={{ ...glassCard, padding: "16px" }}>
                  Loading...
                </div>
              ) : shipments.length === 0 ? (
                <div style={{ ...glassCard, padding: "16px" }}>
                  No shipments found
                </div>
              ) : (
                shipments.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "0.5fr 2fr 1.5fr 1.5fr 1.5fr 0.8fr",
                      alignItems: "center",
                      padding: "14px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div>#{s.id}</div>
                    <div>{s.product}</div>

                    <div>
                      <select
                        value={s.status}
                        disabled={updatingId === s.id}
                        onChange={(e) =>
                          updateStatus(s.id, e.target.value)
                        }
                        style={{
                          background: STATUS_COLORS[s.status],
                          color: "#fff",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "999px",
                          cursor: "pointer",
                        }}
                      >
                        <option>In Transit</option>
                        <option>Delivered</option>
                        <option>Delayed</option>
                      </select>
                    </div>

                    <div>{formatDate(s.expected_delivery)}</div>
                    <div>{formatDate(s.actual_delivery)}</div>

                    <div>
                      <button
                        onClick={() => deleteShipment(s.id)}
                        style={{
                          background: "rgba(239,68,68,0.85)",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: "10px",
                          color: "#fff",
                          cursor: "pointer",
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= RECENT SHIPMENTS ================= */}
        <div style={{ ...glassCard, padding: "18px" }}>
          <h4 style={{ marginBottom: "12px" }}>Recent Shipments</h4>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

            {/* LABEL ROW */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "0.8fr 2fr 1.2fr 1.2fr 0.8fr",
                padding: "10px 12px",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                opacity: 0.7,
                fontWeight: "600",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div>ID</div>
              <div>Product</div>
              <div>Status</div>
              <div>Actual</div>
              <div>Action</div>
            </div>

            {/* ROWS */}
            {recentShipments.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "0.8fr 2fr 1.2fr 1.2fr 0.8fr",
                  padding: "10px 12px",
                  alignItems: "center",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div>#{s.id}</div>
                <div>{s.product}</div>

                <div>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      background: STATUS_COLORS[s.status],
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  >
                    {s.status}
                  </span>
                </div>

                <div>{formatDate(s.actual_delivery)}</div>

                <div>
                  <button
                    onClick={() => deleteShipment(s.id)}
                    style={{
                      background: "rgba(239,68,68,0.85)",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "10px",
                      color: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}