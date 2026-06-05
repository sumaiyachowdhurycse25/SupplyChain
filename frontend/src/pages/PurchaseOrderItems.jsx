import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

export default function PurchaseOrderItems() {
  const { id } = useParams();

  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    unit_price: ""
  });

  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({
    quantity: "",
    unit_price: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [itemsRes, productsRes] = await Promise.all([
        fetchWithToken(`/purchase-order-items/${id}`).then(r => r.json()),
        fetchWithToken("/products").then(r => r.json())
      ]);

      setItems(Array.isArray(itemsRes) ? itemsRes : []);
      setProducts(Array.isArray(productsRes) ? productsRes : []);
    } catch (err) {
      console.error(err);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await fetchWithToken("/purchase-order-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            purchase_order_id: Number(id),
            product_id: Number(form.product_id),
            quantity: Number(form.quantity),
            unit_price: Number(form.unit_price)
          })
        }
      );

      setForm({ product_id: "", quantity: "", unit_price: "" });
      loadData();
    } catch {
      alert("Failed to add item");
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditValues({
      quantity: item.quantity,
      unit_price: item.unit_price
    });
  };

  const saveEdit = async (itemId) => {
    try {
      await fetchWithToken(`/purchase-order-items/${itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quantity: Number(editValues.quantity),
            unit_price: Number(editValues.unit_price)
          })
        }
      );

      setEditId(null);
      loadData();
    } catch {
      alert("Failed to update item");
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("Delete this item?")) return;

    await fetchWithToken(`/purchase-order-items/${itemId}`, { method: "DELETE" });

    loadData();
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + Number(i.line_total),
    0
  );

  return (
    <div style={pageStyle}>
      <h1 style={titleStyle}>📦 Purchase Order #{id}</h1>

      {/* FORM CARD */}
      <div style={cardStyle}>
        <form onSubmit={submit} style={formStyle}>
          <select
            required
            value={form.product_id}
            onChange={e =>
              setForm({ ...form, product_id: e.target.value })
            }
            style={inputStyle}
          >
            <option value="">Select Product</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Qty"
            required
            value={form.quantity}
            onChange={e =>
              setForm({ ...form, quantity: e.target.value })
            }
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Unit Price"
            required
            value={form.unit_price}
            onChange={e =>
              setForm({ ...form, unit_price: e.target.value })
            }
            style={inputStyle}
          />

          <button style={addBtn}>Add Item</button>
        </form>
      </div>

      {/* TABLE CARD */}
      <div style={{ ...cardStyle, marginTop: "40px" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Line Total</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map(i => (
              <tr key={i.id} style={rowStyle}>
                <td style={tdStyle}>{i.product}</td>

                <td style={tdStyle}>
                  {editId === i.id ? (
                    <input
                      type="number"
                      value={editValues.quantity}
                      onChange={e =>
                        setEditValues({
                          ...editValues,
                          quantity: e.target.value
                        })
                      }
                      style={smallInput}
                    />
                  ) : (
                    i.quantity
                  )}
                </td>

                <td style={tdStyle}>
                  {editId === i.id ? (
                    <input
                      type="number"
                      value={editValues.unit_price}
                      onChange={e =>
                        setEditValues({
                          ...editValues,
                          unit_price: e.target.value
                        })
                      }
                      style={smallInput}
                    />
                  ) : (
                    `$${Number(i.unit_price).toFixed(2)}`
                  )}
                </td>

                <td style={tdStyle}>
                  ${Number(i.line_total).toFixed(2)}
                </td>

                <td style={tdStyle}>
                  {editId === i.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(i.id)}
                        style={saveBtn}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        style={cancelBtn}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(i)}
                        style={editBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(i.id)}
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

        {/* TOTAL FOOTER */}
        <div style={totalStyle}>
          Total: ${totalAmount.toFixed(2)}
        </div>
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
  fontSize: "34px",
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

const smallInput = {
  ...inputStyle,
  padding: "6px",
  width: "80px"
};

const addBtn = {
  padding: "14px 24px",
  borderRadius: "16px",
  border: "none",
  fontWeight: "600",
  color: "#fff",
  cursor: "pointer",
  background: "linear-gradient(90deg, #34d399, #059669)"
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

const saveBtn = {
  marginRight: "10px",
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #34d399, #059669)",
  color: "#fff"
};

const cancelBtn = {
  padding: "8px 14px",
  borderRadius: "12px",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(90deg, #9ca3af, #6b7280)",
  color: "#fff"
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

const tdStyle = {
  padding: "14px 0"
};

const rowStyle = {
  borderTop: "1px solid rgba(255,255,255,0.1)"
};

const totalStyle = {
  marginTop: "20px",
  textAlign: "right",
  fontSize: "18px",
  fontWeight: "700",
  color: "#34d399"
};
