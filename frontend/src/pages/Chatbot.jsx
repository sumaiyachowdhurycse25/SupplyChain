import { useState } from "react";

const API = "http://localhost:5000/api";

/* =========================
   FETCH HELPER (TOKEN)
========================= */
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

/* =========================
   MAIN COMPONENT
========================= */
export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     ASK AI
  ========================== */
  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetchWithToken("/nlp/query", {
        method: "POST",
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      console.log("AI RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ENTER KEY SUPPORT
  ========================== */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      askAI();
    }
  };

  return (
    <div style={container}>
      <h1 style={title}>🤖 Supply Chain AI Assistant</h1>

      <div style={glassCard}>
        {/* INPUT */}
        <div style={inputRow}>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stock, purchase orders, inventory..."
            style={inputStyle}
          />

          <button onClick={askAI} style={primaryButton}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div style={answerCard}>
            {result.error ? (
              <p style={{ color: "#f87171" }}>{result.error}</p>
            ) : (
              <>
                {/* 🔥 MAIN HUMAN RESPONSE ONLY */}
                <p style={replyStyle}>
                  {result.reply ||
                    "I processed your request, but no readable summary was generated."}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   STYLES
========================= */

const container = {
  minHeight: "100vh",
  padding: "40px",
  background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
  color: "#e2e8f0",
};

const title = {
  fontSize: "34px",
  fontWeight: "900",
  marginBottom: "30px",
  background: "linear-gradient(90deg,#60a5fa,#a78bfa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const glassCard = {
  padding: "28px",
  borderRadius: "20px",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.12)",
};

const inputRow = {
  display: "flex",
  gap: "15px",
  flexWrap: "wrap",
};

const inputStyle = {
  flex: 1,
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#e2e8f0",
  outline: "none",
  minWidth: "250px",
};

const primaryButton = {
  padding: "14px 20px",
  borderRadius: "12px",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
  color: "#fff",
  background: "linear-gradient(90deg,#60a5fa,#2563eb)",
};

const answerCard = {
  marginTop: "25px",
  padding: "20px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)",
};

const replyStyle = {
  whiteSpace: "pre-line",
  color: "#e2e8f0",
  fontSize: "16px",
  lineHeight: "1.7",
};