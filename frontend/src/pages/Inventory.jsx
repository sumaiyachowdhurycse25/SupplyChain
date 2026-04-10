import React, { useEffect, useState } from "react";

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    warehouse_id: "",
    quantity: ""
  });

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("adminToken")}`
  });

  const loadData = async () => {
    try {
      const headers = authHeader();

      const [pRes, wRes, iRes] = await Promise.all([
      fetch("http://100.54.124.184:5000/api/products", { headers }),
      fetch("http://100.54.124.184:5000/api/warehouses", { headers }),
      fetch("http://100.54.124.184:5000/api/inventory", { headers })
    ]);

      const p = await pRes.json();
      const w = await wRes.json();
      const i = await iRes.json();

      setProducts(Array.isArray(p) ? p : []);
      setWarehouses(Array.isArray(w) ? w : []);
      setInventory(Array.isArray(i) ? i : []);
    } catch (err) {
      console.error(err);
      setInventory([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    await fetch("http://100.54.124.184:5000/api/inventory/upsert", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader()
      },
      body: JSON.stringify(form)
    });

    setForm({ product_id: "", warehouse_id: "", quantity: "" });
    loadData();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
        color: "#fff"
      }}
    >
      <h1
        style={{
          fontSize: "34px",
          fontWeight: "800",
          marginBottom: "30px",
          background: "linear-gradient(90deg,#34d399,#059669)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        📦 Inventory Management
      </h1>

      <div style={glassCard}>
        <form
          onSubmit={submit}
          style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}
        >
          <select
            required
            value={form.product_id}
            onChange={e => setForm({ ...form, product_id: e.target.value })}
            style={inputStyle}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </select>

          <select
            required
            value={form.warehouse_id}
            onChange={e => setForm({ ...form, warehouse_id: e.target.value })}
            style={inputStyle}
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
            required
            value={form.quantity}
            onChange={e => setForm({ ...form, quantity: e.target.value })}
            style={inputStyle}
          />

          <button type="submit" style={primaryButton}>
            Save Stock
          </button>
        </form>
      </div>
    </div>
  );
}

/* 🔥 Styles Outside Component */

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

const inputStyle = {
  padding: "12px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
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

