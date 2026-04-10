import React, { useEffect, useState } from "react";

// Helper
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = { 
    ...options.headers, 
    Authorization: `Bearer ${token}` 
  };
  return fetch(url, { ...options, headers });
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [editId, setEditId] = useState(null);

  const loadSuppliers = async () => {
    try {
      const res = await fetchWithToken("http://100.54.124.184:5000/api/suppliers");

      const data = await res.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch {
      setSuppliers([]);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://100.54.124.184:5000/api/suppliers/${editId}`
      : "http://100.54.124.184:5000/api/suppliers";

   await fetchWithToken(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    setForm({ name: "", email: "", phone: "" });
    setEditId(null);
    loadSuppliers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete supplier?")) return;

    await fetchWithToken(`http://100.54.124.184:5000/api/suppliers/${id}`, {
      method: "DELETE"
    });

    loadSuppliers();
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name, email: s.email, phone: s.phone });
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🏭 Supplier Management</h1>

      {/* FORM CARD */}
      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            placeholder="Supplier Name"
            value={form.name}
            required
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            style={inputStyle}
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            style={inputStyle}
          />

          <button type="submit" style={submitBtn}>
            {editId ? "Update Supplier" : "Add Supplier"}
          </button>
        </form>
      </div>

      {/* TABLE CARD */}
      <div style={{ ...cardStyle, marginTop: "40px" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(s => (
              <tr key={s.id} style={rowStyle}>
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.email || "—"}</td>
                <td style={tdStyle}>{s.phone || "—"}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(s)}
                    style={editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s.id)}
                    style={deleteBtn}
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

const cardStyle = {
  padding: "30px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)"
};

const formStyle = {
  display: "flex",
  gap: "20px",
  flexWrap: "wrap"
};

const inputStyle = {
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  outline: "none",
  minWidth: "200px"
};

const submitBtn = {
  padding: "14px 24px",
  borderRadius: "16px",
  border: "none",
  fontWeight: "600",
  color: "#fff",
  cursor: "pointer",
  background: "linear-gradient(90deg, #34d399, #059669)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#fff"
};

const thStyle = {
  paddingBottom: "15px",
  textAlign: "left",
  fontSize: "14px",
  opacity: 0.7,
  textTransform: "uppercase"
};

const rowStyle = {
  borderTop: "1px solid rgba(255,255,255,0.1)"
};

const tdStyle = {
  padding: "14px 0"
};

const editBtn = {
  marginRight: "10px",
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #60a5fa, #2563eb)",
  color: "#fff"
};

const deleteBtn = {
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #f87171, #dc2626)",
  color: "#fff"
};
