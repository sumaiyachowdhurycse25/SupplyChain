import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper to include token
const fetchWithToken = (url, options = {}) => {
  const token = localStorage.getItem("adminToken");
  const headers = { ...options.headers, Authorization: `Bearer ${token}` };
  return fetch(url, { ...options, headers });
};

export default function DemandForecast() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithToken("http://100.54.124.184:5000/api/products")

      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const predict = async () => {
    if (!selectedProduct) return alert("Select a product");

    try {
      const res = await fetchWithToken(
        `http://100.54.124.184:5000/api/forecast/${selectedProduct.id}`
      );
      const data = await res.json();
      setResult(data);
      setExplanation("");

      const existing = JSON.parse(localStorage.getItem("dashboardData") || "[]");
      const updated = [
        ...existing,
        {
          id: selectedProduct.id,
          name: selectedProduct.name,
          predicted: data.predicted_demand,
          history: data.history,
          timestamp: new Date().toISOString()
        }
      ];
      localStorage.setItem("dashboardData", JSON.stringify(updated.slice(-3)));

      alert("Prediction saved to Dashboard!");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch prediction");
    }
  };

  const explain = async () => {
    if (!result) return;

    try {
      const res = await fetchWithToken("http://100.54.124.184:5000/api/ai/forecast-explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: selectedProduct.name,
          history: result.history.map(h => h.quantity),
          predicted: result.predicted_demand
        })
      });
      const data = await res.json();
      setExplanation(data.explanation);
    } catch (err) {
      console.error(err);
      alert("Failed to get AI explanation");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
        color: "#e2e8f0",
        fontWeight: "500"
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          fontWeight: "900",
          marginBottom: "30px",
          background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        📈 Demand Forecast
      </h1>

      <div style={glassCard}>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <select
            value={selectedProduct?.id || ""}
            onChange={e => {
              const product = products.find(p => p.id === Number(e.target.value));
              setSelectedProduct(product || null);
              setResult(null);
              setExplanation("");
            }}
            style={inputStyle}
          >
            <option value="" disabled hidden>
              Select Product
            </option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button onClick={predict} style={primaryButton}>
            Predict & Save
          </button>

          <button onClick={() => navigate("/")} style={secondaryButton}>
            Go to Dashboard
          </button>
        </div>

        {result && (
          <div style={{ marginTop: "25px" }}>
            <h3 style={{ fontWeight: "700" }}>Predicted Demand: {result.predicted_demand}</h3>
            <button onClick={explain} style={{ ...secondaryButton, marginTop: "10px" }}>
              🤖 Explain Prediction
            </button>
          </div>
        )}

        {explanation && (
          <div style={answerCard}>
            <h4 style={{ marginBottom: "10px", fontWeight: "700" }}>AI Explanation</h4>
            <p>{explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
}


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
  padding: "14px 20px",
  borderRadius: "14px",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
  color: "#fff",
  background: "linear-gradient(90deg,#60a5fa,#2563eb)",
  boxShadow: "0 0 20px rgba(96,165,250,0.6)"
};

const secondaryButton = {
  padding: "14px 20px",
  borderRadius: "14px",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
  color: "#fff",
  background: "linear-gradient(90deg,#94a3b8,#64748b)",
  boxShadow: "0 0 20px rgba(100,116,139,0.4)"
};

const answerCard = {
  marginTop: "20px",
  padding: "20px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)"
};
