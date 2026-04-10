import React, { useEffect, useState } from "react";

// Helper to include token
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, { ...options, headers });
};

export default function AddShipment() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    product_id: "",
    status: "In Transit",
    expected_delivery: "",
    actual_delivery: ""
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetchWithToken("http://100.54.124.184:5000/api/products");

      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetchWithToken("http://100.54.124.184:5000/api/shipments", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: Number(form.product_id),
          status: form.status,
          expected_delivery: form.expected_delivery,
          actual_delivery:
            form.status === "Delivered"
              ? form.actual_delivery || null
              : null
        })
      });

      if (!res.ok) throw new Error("Failed");

      alert("Shipment created successfully");

      setForm({
        product_id: "",
        status: "In Transit",
        expected_delivery: "",
        actual_delivery: ""
      });
    } catch (err) {
      alert("Error creating shipment");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🚚 Shipment Management</h1>

      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>

          {/* Product */}
          <select
            required
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: e.target.value })
            }
            style={inputStyle}
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
                actual_delivery: ""
              })
            }
            style={inputStyle}
          >
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Delayed">Delayed</option>
          </select>

          {/* Expected Delivery */}
          <input
            type="date"
            required
            value={form.expected_delivery}
            onChange={(e) =>
              setForm({ ...form, expected_delivery: e.target.value })
            }
            style={inputStyle}
          />

          {/* Actual Delivery */}
          <input
            type="date"
            disabled={form.status !== "Delivered"}
            value={form.actual_delivery}
            onChange={(e) =>
              setForm({ ...form, actual_delivery: e.target.value })
            }
            style={{
              ...inputStyle,
              opacity: form.status !== "Delivered" ? 0.5 : 1
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={loading ? disabledBtn : submitBtn}
          >
            {loading ? "Saving..." : "Save Shipment"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const pageStyle = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
};

const titleStyle = {
  fontSize: "36px",
  fontWeight: "800",
  marginBottom: "40px",
  background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const cardStyle = {
  maxWidth: "600px",
  padding: "30px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginBottom: "18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#60a5fa",
  outline: "none",
  fontSize: "14px",
  backdropFilter: "blur(10px)",
};

const submitBtn = {
  padding: "14px",
  borderRadius: "16px",
  border: "none",
  fontWeight: "600",
  color: "#fff",
  cursor: "pointer",
  background: "linear-gradient(90deg, #34d399, #059669)",
  boxShadow: "0 0 20px rgba(52,211,153,0.5)",
};

const disabledBtn = {
  ...submitBtn,
  opacity: 0.6,
  cursor: "not-allowed",
};
