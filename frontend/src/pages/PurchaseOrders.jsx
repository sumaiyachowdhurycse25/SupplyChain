import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

// Helper
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

export default function PurchaseOrders() {
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    supplier_id: "",
    order_date: "",
    status: "Pending",
    total_amount: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, o] = await Promise.all([
        fetchWithToken("/suppliers").then(r => r.json()),
        fetchWithToken("/purchase-orders").then(r => r.json())
      ]);

      setSuppliers(Array.isArray(s) ? s : []);
      setOrders(Array.isArray(o) ? o : []);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      supplier_id: Number(form.supplier_id),
      total_amount: Number(form.total_amount)
    };

    try {
      if (editingId) {
        await fetchWithToken(
          `/purchase-orders/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
      } else {
        await fetchWithToken("/purchase-orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          }
        );
      }

      setForm({
        supplier_id: "",
        order_date: "",
        status: "Pending",
        total_amount: ""
      });

      setEditingId(null);
      loadData();
    } catch (err) {
      alert("Failed to save purchase order");
    }
  };

  const handleEdit = (order) => {
    setForm({
      supplier_id: order.supplier_id.toString(),
      order_date: order.order_date || "",
      status: order.status,
      total_amount: order.total_amount
    });
    setEditingId(order.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase order?")) return;

    await fetchWithToken(`/purchase-orders/${id}`, {
        method: "DELETE"
      });

    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved":
        return badgeGreen;
      case "Received":
        return badgeBlue;
      default:
        return badgeYellow;
    }
  };

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>🧾 Purchase Orders</h1>

      {/* FORM CARD */}
      <div style={cardStyle}>
        <form onSubmit={submit} style={formStyle}>
          <select
            required
            value={form.supplier_id}
            onChange={e =>
              setForm({ ...form, supplier_id: e.target.value })
            }
            style={inputStyle}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={form.order_date}
            onChange={e =>
              setForm({ ...form, order_date: e.target.value })
            }
            style={inputStyle}
          />

          <select
            value={form.status}
            onChange={e =>
              setForm({ ...form, status: e.target.value })
            }
            style={inputStyle}
          >
            <option>Pending</option>
            <option>Approved</option>
            <option>Received</option>
          </select>

          <input
            type="number"
            placeholder="Total Amount"
            required
            value={form.total_amount}
            onChange={e =>
              setForm({ ...form, total_amount: e.target.value })
            }
            style={inputStyle}
          />

          <button type="submit" style={submitBtn}>
            {editingId ? "Update PO" : "Create PO"}
          </button>
        </form>
      </div>

      {/* TABLE CARD */}
      <div style={{ ...cardStyle, marginTop: "40px" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Supplier</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o.id} style={rowStyle}>
                <td style={tdStyle}>
                  <button
                    onClick={() =>
                      navigate(`/purchase-orders/${o.id}`)
                    }
                    style={linkBtn}
                  >
                    #{o.id}
                  </button>
                </td>

                <td style={tdStyle}>{o.supplier}</td>

                <td style={tdStyle}>
                  {o.order_date
                    ? new Date(o.order_date).toLocaleDateString()
                    : "—"}
                </td>

                <td style={tdStyle}>
                  <span style={getStatusStyle(o.status)}>
                    {o.status}
                  </span>
                </td>

                <td style={tdStyle}>
                  ${Number(o.total_amount).toFixed(2)}
                </td>

                <td style={tdStyle}>
                  <button onClick={() => handleEdit(o)} style={editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(o.id)} style={deleteBtn}>
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
  height: "48px",
  padding: "0 14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#60a5fa",
  outline: "none",
  backdropFilter: "blur(10px)",
  boxSizing: "border-box"
};

const submitBtn = {
  height: "48px",
  padding: "0 20px",
  borderRadius: "14px",
  border: "none",
  fontWeight: "600",
  color: "#fff",
  cursor: "pointer",
  background: "linear-gradient(90deg, #34d399, #059669)",
  boxSizing: "border-box"
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

const linkBtn = {
  background: "none",
  border: "none",
  color: "#60a5fa",
  cursor: "pointer",
  fontWeight: "600"
};

const badgeGreen = {
  padding: "6px 12px",
  borderRadius: "12px",
  background: "rgba(52,211,153,0.2)",
  color: "#34d399",
  fontWeight: "600"
};

const badgeBlue = {
  padding: "6px 12px",
  borderRadius: "12px",
  background: "rgba(96,165,250,0.2)",
  color: "#60a5fa",
  fontWeight: "600"
};

const badgeYellow = {
  padding: "6px 12px",
  borderRadius: "12px",
  background: "rgba(251,191,36,0.2)",
  color: "#fbbf24",
  fontWeight: "600"
};
