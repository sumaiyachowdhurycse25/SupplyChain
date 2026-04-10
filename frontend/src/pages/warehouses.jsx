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

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [form, setForm] = useState({ name: "", location: "" });
  const [editId, setEditId] = useState(null);

  const loadWarehouses = async () => {
    try {
      const res = await fetchWithToken("http://100.54.124.184:5000/api/warehouses");

      const data = await res.json();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setWarehouses([]);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://100.54.124.184:5000/api/warehouses/${editId}`
      : "http://100.54.124.184:5000/api/warehouses";

    await fetchWithToken(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({ name: "", location: "" });
    setEditId(null);
    loadWarehouses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Warehouse?")) return;

    await fetchWithToken(`http://100.54.124.184:5000/api/warehouses/${id}`, {
      method: "DELETE"
    });

    loadWarehouses();
  };

  const handleEdit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name, location: s.location });
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
        🏭 Warehouse Management
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
            placeholder="Warehouse Name"
            value={form.name}
            required
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            style={inputStyle}
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
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
              boxShadow: "0 0 20px rgba(52,211,153,0.5)",
            }}
          >
            {editId ? "Update Warehouse" : "Add Warehouse"}
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
              <th style={thStyle}>Location</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {warehouses.map((s) => (
              <tr
                key={s.id}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <td style={tdStyle}>{s.name}</td>
                <td style={tdStyle}>{s.location}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(s)}
                    style={editBtnStyle}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(s.id)}
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
