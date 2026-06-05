import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  return (
    <div style={container}>
  <h1 style={title}>🤖 Supply Chain Chatbot</h1>


    <div style={inputRow}>

      <input
        value={question}
        readOnly
        placeholder="Try: Chatbot"
        style={inputStyle}
      />

      <div style={buttonGroup}>
        <button onClick={() => navigate("/ai")} style={primaryButton}>
          Open Query Bot
        </button>

        <button onClick={() => navigate("/nlp")} style={primaryButton}>
          Open AI Chatbot
        </button>
      </div>


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
  flexDirection: "column",
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

const buttonGroup = {
  display: "flex",
  gap: "25px",
  justifyContent: "center",
  marginTop: "50px",
  flexWrap: "wrap"
};