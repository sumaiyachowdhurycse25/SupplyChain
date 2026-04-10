import { useState } from "react";
import { api } from "../api";

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await api.post("/ai/query", { question });
      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Something went wrong.");
    } finally {
      setLoading(false);
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
        🤖 AI Supply Chain Assistant
      </h1>

      <div style={glassCard}>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask about inventory, routes, stock levels..."
            style={{ ...inputStyle, flex: 1 }}
          />

          <button onClick={askAI} style={primaryButton}>
            {loading ? "Thinking..." : "Ask AI"}
          </button>
        </div>

        {answer && (
          <div style={answerCard}>
            <h3 style={{ marginBottom: "10px", fontWeight: "700" }}>
              AI Response
            </h3>
            <p style={{ lineHeight: "1.6" }}>{answer}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🔥 Shared Styles */

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
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#e2e8f0",
  outline: "none",
  fontWeight: "500",
  minWidth: "250px"
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

const answerCard = {
  marginTop: "25px",
  padding: "20px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.15)"
};
