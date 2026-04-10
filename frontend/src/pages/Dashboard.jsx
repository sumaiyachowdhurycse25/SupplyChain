import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/alerts")
      .then(res => res.json())
      .then(data => {
        setAlerts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getAlertStyle = (type) => {
    switch (type) {
      case "LOW_STOCK":
        return "alert alert-warning";
      case "DELAY":
        return "alert alert-danger";
      case "SYSTEM":
        return "alert alert-info";
      default:
        return "alert";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Admin Dashboard</h2>

      {loading && <p>Loading alerts...</p>}

      {!loading && alerts.length === 0 && (
        <p>No notifications 🎉</p>
      )}

      {alerts.map(alert => (
        <div
          key={alert.id}
          className={getAlertStyle(alert.type)}
          style={{
            marginBottom: "10px",
            padding: "12px",
            borderRadius: "6px"
          }}
        >
          <strong>{alert.type.replace("_", " ")}</strong>
          <p>{alert.message}</p>
          <small>{new Date(alert.created_at).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
