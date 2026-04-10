import { useEffect, useState } from "react";

// Helper to include token in all requests
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  return fetch(url, { ...options, headers });
};

const PONotifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetchWithToken("http://100.54.124.184:5000/api/purchase-orders/notifications");
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching PO notifications:", err);
        setNotifications([]);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!notifications.length) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
        marginBottom: "40px",
      }}
    >
      {notifications.map((po) => (
        <div
          key={po.id}
          style={{
            position: "relative",
            padding: "24px",
            borderRadius: "20px",
            cursor: "pointer",
            color: "#fff",

            // Glass effect
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",

            // Soft glow
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 0 40px rgba(255,255,255,0.05)",

            transition: "all 0.3s ease",
          }}
          onClick={() =>
            window.location.assign(`/purchase-orders/${po.id}`)
          }
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-6px)";
            e.currentTarget.style.boxShadow =
              "0 15px 40px rgba(0, 0, 0, 0.5), inset 0 0 50px rgba(255,255,255,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 8px 32px rgba(0, 0, 0, 0.35), inset 0 0 40px rgba(255,255,255,0.05)";
          }}
        >
          {/* Gradient glow background layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.02))",
              zIndex: 0,
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: "14px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                opacity: 0.7,
                marginBottom: "10px",
              }}
            >
              Purchase Order Notification
            </div>

            <div
              style={{
                fontSize: "26px",
                fontWeight: "600",
                marginBottom: "12px",
              }}
            >
              PO #{po.id}
            </div>

            <div style={{ fontSize: "15px", opacity: 0.9 }}>
              Supplier: <strong>{po.supplier}</strong>
            </div>

            <div style={{ fontSize: "15px", opacity: 0.9 }}>
              Status: <strong>{po.status}</strong>
            </div>

            <div
              style={{
                fontSize: "14px",
                opacity: 0.6,
                marginTop: "10px",
              }}
            >
              {po.order_date
                ? new Date(po.order_date).toLocaleDateString()
                : "—"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PONotifications;

