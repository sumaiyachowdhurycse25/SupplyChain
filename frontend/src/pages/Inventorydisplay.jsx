import React, { useEffect, useState } from "react";

// Helper to include token in all requests
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = { 
    ...options.headers, 
    Authorization: `Bearer ${token}` 
  };
  return fetch(url, { ...options, headers });
};

export default function Inventorydisplay() {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");

  const loadData = async () => {
    try {
      const [inv, low] = await Promise.all([
        fetchWithToken("http://100.54.124.184:5000/api/inventorydisplay/inventory").then(res => res.json()),
        fetchWithToken("http://100.54.124.184:5000/api/inventorydisplay/low-stock").then(res => res.json())
      ]);

      setInventory(Array.isArray(inv) ? inv : []);
      setLowStock(Array.isArray(low) ? low : []);
    } catch (err) {
      console.error(err);
      setInventory([]);
      setLowStock([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveEdit = async (id) => {
    await fetchWithToken(`http://100.54.124.184:5000/api/inventory/${id}`, {

      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: Number(editQuantity) })
    });

    setEditingId(null);
    loadData();
  };

  const deleteRow = async (id) => {
    if (!window.confirm("Delete this inventory record?")) return;

    await fetchWithToken(`http://100.54.124.184:5000/api/inventory/${id}`, { method: "DELETE" });

    loadData();
  };

  return (
    <div style={pageStyle}>
      {/* Title */}
      <h1 style={titleStyle}>📦 Inventory Management</h1>

      {/* KPI CARDS */}
      <div style={kpiContainer}>
        <div style={kpiBlue}>
          <div>Products in Inventory</div>
          <div style={kpiNumber}>{inventory.length}</div>
        </div>

        <div style={kpiRed}>
          <div>Low Stock Alerts</div>
          <div style={kpiNumber}>{lowStock.length}</div>
        </div>
      </div>

      {/* TABLE CARD */}
      <div style={cardStyle}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>SKU</th>
              <th style={thStyle}>Warehouse</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Reorder</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventory.map(row => (
              <tr
                key={row.inventory_id}
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.1)",
                  background:
                    row.quantity <= row.reorder_level
                      ? "rgba(239,68,68,0.15)"
                      : "transparent"
                }}
              >
                <td style={tdStyle}>{row.product_name}</td>
                <td style={tdStyle}>{row.sku}</td>
                <td style={tdStyle}>{row.warehouse_name}</td>

                <td style={tdStyle}>
                  {editingId === row.inventory_id ? (
                    <input
                      type="number"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      style={inputStyle}
                    />
                  ) : (
                    row.quantity
                  )}
                </td>

                <td style={tdStyle}>{row.reorder_level}</td>

                <td style={tdStyle}>
                  {editingId === row.inventory_id ? (
                    <>
                      <button
                        onClick={() => saveEdit(row.inventory_id)}
                        style={saveBtn}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        style={cancelBtn}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(row.inventory_id);
                          setEditQuantity(row.quantity);
                        }}
                        style={editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRow(row.inventory_id)}
                        style={deleteBtn}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------- STYLES -------------------- */

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

const kpiContainer = {
  display: "flex",
  gap: "30px",
  marginBottom: "40px",
  flexWrap: "wrap",
};

const kpiBlue = {
  flex: 1,
  padding: "30px",
  borderRadius: "24px",
  color: "#fff",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
};

const kpiRed = {
  flex: 1,
  padding: "30px",
  borderRadius: "24px",
  color: "#fff",
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
};

const kpiNumber = {
  fontSize: "40px",
  fontWeight: "700",
  marginTop: "10px",
};

const cardStyle = {
  padding: "30px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  color: "#fff",
};

const thStyle = {
  paddingBottom: "15px",
  fontSize: "14px",
  textTransform: "uppercase",
  opacity: 0.7,
  textAlign: "left",
};

const tdStyle = {
  padding: "14px 0",
};

const inputStyle = {
  padding: "8px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  outline: "none",
  width: "80px",
};

const editBtn = {
  marginRight: "10px",
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #60a5fa, #2563eb)",
  color: "#fff",
};

const deleteBtn = {
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #f87171, #dc2626)",
  color: "#fff",
};

const saveBtn = {
  marginRight: "10px",
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #34d399, #059669)",
  color: "#fff",
};

const cancelBtn = {
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #9ca3af, #6b7280)",
  color: "#fff",
};

