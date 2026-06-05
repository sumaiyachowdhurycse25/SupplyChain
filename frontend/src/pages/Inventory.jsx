import React, { useEffect, useState } from "react";

const API = "http://localhost:5000/api";

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

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: ""
  });

  const loadData = async () => {
    const [p, w, i] = await Promise.all([
      fetchWithToken("/products").then(r => r.json()),
      fetchWithToken("/warehouses").then(r => r.json()),
      fetchWithToken("/inventory").then(r => r.json()),
    ]);

    setProducts(p);
    setWarehouses(w);
    setInventory(i);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    await fetchWithToken("/inventory", {
      method: "POST",
      body: JSON.stringify(form),
    });

    setForm({ product_id: "", warehouse_id: "", quantity: "" });
    loadData();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    await fetchWithToken(`/inventory/${id}`, {
      method: "DELETE",
    });

    loadData();
  };

  return (
    <div style={pageStyle}>
      <h1 style={title}>📦 Inventory Management</h1>

      {/* GLASS FORM */}
      <div style={glassCard}>
        <form style={formStyle} onSubmit={submit}>

          <select
            style={inputStyle}
            value={form.product_id}
            onChange={(e) =>
              setForm({ ...form, product_id: e.target.value })
            }
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            style={inputStyle}
            value={form.warehouse_id}
            onChange={(e) =>
              setForm({ ...form, warehouse_id: e.target.value })
            }
          >
            <option value="">Select Warehouse</option>
            {warehouses.map(w => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            style={inputStyle}
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <button style={primaryButton}>Save Stock</button>

        </form>
      </div>

      {/* GLASS TABLE */}
      <div style={{ ...glassCard, marginTop: "25px" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Warehouse</th>
              <th>Qty</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map(item => (
              <tr key={item.id} style={rowStyle}>
                <td>{item.product_name}</td>
                <td>{item.warehouse}</td>
                <td>{item.quantity}</td>
                <td>
                  <button
                    style={deleteBtn}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
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

/* ================= GLASS STYLES ================= */

const pageStyle = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg,#0f172a,#1e293b,#0f172a)",
  color: "#fff"
};

const title = {
  fontSize: "34px",
  marginBottom: "25px",
  fontWeight: "800",
};

const glassCard = {
  padding: "28px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)"
};

const formStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap"
};

const inputStyle = {
  padding: "12px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "linear-gradient(135deg,#0f172a,#1e293b,#0f172a)",
  color: "#94a3b8",
  outline: "none",
  minWidth: "180px"
};

const primaryButton = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  fontWeight: "600",
  cursor: "pointer",
  color: "#fff",
  background: "linear-gradient(90deg,#60a5fa,#2563eb)",
  boxShadow: "0 0 20px rgba(96,165,250,0.6)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#fff"
};

const rowStyle = {
  borderTop: "1px solid rgba(255,255,255,0.1)"
};

const deleteBtn = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg,#ef4444,#dc2626)",
  color: "#fff"
};