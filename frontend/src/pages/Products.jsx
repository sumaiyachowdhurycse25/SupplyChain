import React, { useEffect, useState } from "react";
const API = "http://localhost:5000/api";
// Helper to include token
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");

  return fetch(API + url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", sku: "", reorder_level: "" });
  const [editId, setEditId] = useState(null);

  const loadProducts = async () => {
    try {
      const res = await fetchWithToken("/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `/products/${editId}`
      : "/products";

    const payload = editId
      ? { name: form.name, reorder_level: form.reorder_level }
      : form;

    await fetchWithToken(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setForm({ name: "", sku: "", reorder_level: "" });
    setEditId(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    await fetchWithToken(`/products/${id}`, {
      method: "DELETE"
    });

    loadProducts();
  };

  const handleEdit = (product) => {
    setEditId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      reorder_level: product.reorder_level,
    });
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
        🏷️ Product Management
      </h1>

      {/* FORM CARD */}
      <div
        style={{
          padding: "30px",
          borderRadius: "24px",
          marginBottom: "40px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Product Name"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />

          {!editId ? (
            <input
              placeholder="SKU"
              value={form.sku}
              required
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              style={inputStyle}
            />
          ) : (
            <input
              value={form.sku}
              disabled
              style={{ ...inputStyle, backgroundColor: "#eee", color: "#000" }}
            />
          )}

          <input
            placeholder="Reorder Level"
            value={form.reorder_level}
            onChange={(e) =>
              setForm({ ...form, reorder_level: e.target.value })
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              padding: "14px 24px",
              borderRadius: "16px",
              border: "none",
              fontWeight: "600",
              color: "#fff",
              cursor: "pointer",
              background: editId
                ? "linear-gradient(90deg, #fbbf24, #d97706)"
                : "linear-gradient(90deg, #34d399, #059669)",
              boxShadow: editId
                ? "0 0 20px rgba(251,191,36,0.5)"
                : "0 0 20px rgba(52,211,153,0.5)",
            }}
          >
            {editId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* TABLE CARD */}
      <div
        style={{
          padding: "30px",
          borderRadius: "24px",
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            color: "#fff",
          }}
        >
          <thead>
            <tr style={{ textAlign: "left" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Reorder Level</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{p.sku}</td>
                <td style={tdStyle}>{p.reorder_level}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(p)}
                    style={editBtnStyle}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    style={deleteBtnStyle}
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

const inputStyle = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  outline: "none",
  minWidth: "200px",
};

const thStyle = {
  paddingBottom: "15px",
  fontSize: "14px",
  textTransform: "uppercase",
  opacity: 0.7,
};

const tdStyle = {
  padding: "14px 0",
};

const editBtnStyle = {
  marginRight: "10px",
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #60a5fa, #2563eb)",
  color: "#fff",
};

const deleteBtnStyle = {
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #f87171, #dc2626)",
  color: "#fff",
};

