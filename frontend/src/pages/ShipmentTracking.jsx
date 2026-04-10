import React, { useEffect, useState } from "react";

const STATUS_COLORS = {
  "In Transit": "#3b82f6",
  Delivered: "#22c55e",
  Delayed: "#ef4444"
};

// Helper function to include token in every request
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = { 
    ...options.headers, 
    Authorization: `Bearer ${token}` 
  };
  return fetch(url, { ...options, headers });
};

export default function ShipmentTracking() {
  const [shipments, setShipments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  /* =========================
     Fetch Shipments
  ========================== */
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const url =
        filter === "All"
          ? "http://100.54.124.184:5000/api/shipments"
          : `http://100.54.124.184:5000/api/shipments?status=${encodeURIComponent(filter)}`;

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

  /* =========================
     Update Shipment Status
  ========================== */
  const updateStatus = async (id, newStatus) => {
    if (
      newStatus === "Delivered" &&
      !window.confirm("Mark this shipment as Delivered?")
    ) {
      return;
    }

    try {
      setUpdatingId(id);

      const res = await fetchWithToken(`http://100.54.124.184:5000/api/shipments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setShipments((prev) => prev.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  /* =========================
     Delete Shipment
  ========================== */
  const deleteShipment = async (id) => {
    if (!window.confirm("Do you want to delete this shipment?")) return;

    try {
      const res = await fetchWithToken(`http://100.54.124.184:5000/api/shipments/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete shipment");

      setShipments((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert("Failed to delete shipment");
      console.error(err);
    }
  };

  /* =========================
     Helper
  ========================== */
  const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : "--");
  const recentShipments = shipments.slice(0, 3);

  /* =========================
     UI
  ========================== */
  return (
    <div style={{ padding: "24px", background: "#f8fafc", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "12px" }}>🚚 Shipment Tracking</h2>

      {/* Status Tabs */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        {["All", "In Transit", "Delivered", "Delayed"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              background: filter === t ? "#3b82f6" : "#e5e7eb",
              color: filter === t ? "#fff" : "#374151",
              fontWeight: "500"
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main Shipments Table */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "16px" }}>
        <table width="100%" cellPadding="10">
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th>ID</th>
              <th>Product</th>
              <th>Status</th>
              <th>Expected Delivery</th>
              <th>Actual Delivery</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" align="center">Loading...</td>
              </tr>
            ) : shipments.length === 0 ? (
              <tr>
                <td colSpan="6" align="center">No shipments found</td>
              </tr>
            ) : (
              shipments.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.product}</td>
                  <td>
                    <select
                      value={s.status}
                      disabled={updatingId === s.id}
                      onChange={(e) => updateStatus(s.id, e.target.value)}
                      style={{
                        background: STATUS_COLORS[s.status] || "#6b7280",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: "600",
                        cursor: updatingId === s.id ? "not-allowed" : "pointer"
                      }}
                    >
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Delayed">Delayed</option>
                    </select>
                  </td>
                  <td>{formatDate(s.expected_delivery)}</td>
                  <td>{formatDate(s.actual_delivery)}</td>
                  <td>
                    <button
                      onClick={() => deleteShipment(s.id)}
                      disabled={updatingId === s.id}
                      style={{
                        padding: "4px 8px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: updatingId === s.id ? "not-allowed" : "pointer"
                      }}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Recent Shipments */}
      <div style={{ marginTop: "20px", background: "#fff", borderRadius: "12px", padding: "16px" }}>
        <h4 style={{ marginBottom: "10px" }}>Recent Shipments</h4>
        <table width="100%" cellPadding="10">
          <thead>
            <tr style={{ background: "#f1f5f9" }}>
              <th>ID</th>
              <th>Product</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentShipments.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.product}</td>
                <td>
                  <span
                    style={{
                      background: STATUS_COLORS[s.status],
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "14px"
                    }}
                  >
                    {s.status}
                  </span>
                </td>
                <td>{formatDate(s.expected_delivery)}</td>
                <td>
                  <button
                    onClick={() => deleteShipment(s.id)}
                    style={{
                      padding: "4px 8px",
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
