import React, { useState } from "react";

// Helper to include token
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  return fetch(url, { ...options, headers });
};

export default function RouteOptimization() {
  const [destination, setDestination] = useState("");
  const [productName, setProductName] = useState("");
  const [route, setRoute] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const optimize = async () => {
    if (!destination || !productName) {
      return alert("Please enter both destination and product name");
    }

    setError("");
    setRoute(null);
    setLoading(true);

    try {
     const res = await fetchWithToken("http://100.54.124.184:5000/api/routes/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            destination,
            product_name: productName,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No warehouse found");
        return;
      }

      setRoute(data);
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "800",
          marginBottom: "40px",
          background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🗺 Route Optimization
      </h1>

      {/* Glass Card */}
      <div
        style={{
          maxWidth: "600px",
          padding: "32px",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)",
        }}
      >
        <input
          placeholder="Destination City"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={optimize}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "16px",
            border: "none",
            fontWeight: "600",
            color: "#fff",
            cursor: "pointer",
            background: "linear-gradient(90deg, #60a5fa, #2563eb)",
            boxShadow: "0 0 25px rgba(96,165,250,0.6)",
            transition: "all 0.3s ease",
          }}
        >
          {loading ? "Optimizing..." : "Optimize Route"}
        </button>

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(248,113,113,0.15)",
              border: "1px solid rgba(248,113,113,0.4)",
              color: "#f87171",
              fontWeight: "600",
            }}
          >
            ⚠ {error}
          </div>
        )}

        {/* Result */}
        {route && (
          <div
            style={{
              marginTop: "24px",
              padding: "20px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.4), inset 0 0 30px rgba(255,255,255,0.05)",
              color: "#fff",
            }}
          >
            <h3
              style={{
                marginBottom: "12px",
                background:
                  "linear-gradient(90deg, #34d399, #059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ✅ Optimal Warehouse Found
            </h3>

            <p><strong>Warehouse:</strong> {route.warehouse}</p>
            <p><strong>Product:</strong> {route.product_name}</p>
            <p><strong>Stock Available:</strong> {route.stock}</p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  outline: "none",
  fontSize: "14px",
  backdropFilter: "blur(10px)",
};
