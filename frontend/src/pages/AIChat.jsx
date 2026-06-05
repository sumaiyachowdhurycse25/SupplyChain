import { useState } from "react";
const API = "http://localhost:5000/api";

// Helper to include token
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

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
  if (!question.trim()) return;

  setLoading(true);
  setResult(null);

  try {
    const res = await fetchWithToken("/ai/query", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    setResult(data);

  } catch (err) {
    console.error(err);
    setResult({
      error: err.message
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={container}>
      <h1 style={title}>
        🤖 Supply Chain Query Assistant
      </h1>

      <div style={glassCard}>
        <div style={inputRow}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Try: low stock under 5, delayed shipments..."
            style={inputStyle}
          />

          <button onClick={askAI} style={primaryButton}>
            {loading ? "Loading..." : "Run Query"}
          </button>
        </div>

        {/* 🔥 RESULT AREA */}
        {result && (
          <div style={answerCard}>
            <h3 style={resultTitle}>
              {result.type || "Result"} ({result.count || 0})
            </h3>

            {/* ❗ Error */}
            {result.error && (
              <p style={{ color: "#f87171" }}>{result.error}</p>
            )}

            {/* ⚠️ Message */}
            {result.message && (
              <p style={{ color: "#facc15" }}>{result.message}</p>
            )}

            {/* 📊 Data */}
            {Array.isArray(result.data) && result.data.length > 0 ? (
              <div style={{ marginTop: "15px" }}>
                {result.data.map((row, i) => (
                  <div key={i} style={rowCard}>
                    {Object.entries(row).map(([key, value]) => (
                      <p key={key} style={rowText}>
                        <b>{key}:</b> {String(value)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              !result.message &&
              !result.error && (
                <p style={{ marginTop: "10px" }}>No data found.</p>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* 🎨 STYLES */

const container = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
  color: "#e2e8f0",
  fontWeight: "500"
};

const title = {
  fontSize: "34px",
  fontWeight: "900",
  marginBottom: "30px",
  background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const glassCard = {
  padding: "28px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)"
};

const inputRow = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap"
};

const inputStyle = {
  flex: 1,
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#e2e8f0",
  outline: "none",
  minWidth: "250px"
};

const primaryButton = {
  padding: "14px 20px",
  borderRadius: "12px",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
  color: "#fff",
  background: "linear-gradient(90deg,#60a5fa,#2563eb)",
  boxShadow: "0 0 20px rgba(96,165,250,0.6)"
};

const answerCard = {
  marginTop: "25px",
  padding: "20px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)"
};

const resultTitle = {
  marginBottom: "10px",
  fontWeight: "700"
};

const rowCard = {
  padding: "12px",
  borderRadius: "12px",
  marginBottom: "10px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)"
};

const rowText = {
  margin: "2px 0"
};