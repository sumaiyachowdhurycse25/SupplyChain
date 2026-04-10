import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Email and password required");
    }

    setLoading(true);

    try {
const res = await fetch("http://100.54.124.184:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        throw new Error(data.error || "Invalid credentials");
      }

      localStorage.setItem("adminToken", data.token);
      setIsLoggedIn(true);
      navigate("/", { replace: true });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const emojis = useMemo(() => {
    return Array.from({ length: 4 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${30 + Math.random() * 40}px`,
      opacity: 0.1 + Math.random() * 0.2
    }));
  }, []);

  return (
    <div style={pageStyle}>
      {emojis.map((emoji, index) => (
  <div
    key={index}
    style={{
      position: "absolute",
      top: emoji.top,
      left: emoji.left,
      fontSize: emoji.size,
      opacity: emoji.opacity,
      pointerEvents: "none",
      userSelect: "none",
      animation: "float 25s ease-in-out infinite alternate"
    }}
  >
    💰
  </div>
))}
      <style>
        {`
          @keyframes float {
            from { transform: translateY(0px); }
            to { transform: translateY(-60px); }
          }
        `}
      </style>

     <h1 style={brandWrapper}>
  <span style={stoneIconLarge} />
  <span style={brandText}>NoThink</span>
  <span style={stoneIconLarge} />
</h1>

      <h2 style={subtitleStyle}> Supply Chain AI Dashboard</h2>

      <div style={cardStyle}>
        <div style={glowLayer} />

        <form onSubmit={login} style={{ position: "relative", zIndex: 1 }}>

<h2 style={cardTitleWrapper}>
  <span style={stoneIconSmall} />
  <span>Admin Login</span>
</h2>

          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={inputStyle}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={passwordstyle}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* --- Extra Styles --- */

/* ================== STYLES ================== */

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
  position: "relative",
  overflow: "hidden",
  padding: "40px 20px"
};

const brandStyle = {
  fontSize: "36px",
  fontWeight: "900",
  marginBottom: "10px",
  color: "#fff",
  textAlign: "center"
};

const subtitleStyle = {
  fontSize: "20px",
  fontWeight: "600",
  marginBottom: "30px",
  color: "#cbd5e1",
  textAlign: "center"
};

const cardStyle = {
  width: "100%",
  maxWidth: "420px",
  padding: "50px 40px 40px",
  borderRadius: "24px",
  position: "relative",
  background: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow:
    "0 25px 70px rgba(0,0,0,0.5), inset 0 0 40px rgba(255,255,255,0.04)"
};

const glowLayer = {
  position: "absolute",
  inset: 0,
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, rgba(96,165,250,0.1), rgba(168,85,247,0.08))",
  zIndex: 0
};

const cardTitle = {
  fontSize: "26px",
  fontWeight: "800",
  marginBottom: "25px",
  background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center"
};

const inputStyle = {
  width: "100%",
  height: "48px",
  padding: "0 14px",
  marginBottom: "18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  height: "48px",
  marginTop: "10px",
  borderRadius: "14px",
  border: "none",
  fontWeight: "600",
  color: "#fff",
  cursor: "pointer",
  background: "linear-gradient(90deg, #60a5fa, #2563eb)",
  boxShadow: "0 0 25px rgba(96,165,250,0.6)",
  transition: "all 0.3s ease"
};
const errorStyle = {
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.4)",
  padding: "10px",
  borderRadius: "10px",
  marginBottom: "15px",
  color: "#f87171",
  fontSize: "13px"
};

const passwordstyle = {

  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
  color: "#60a5fa"

};
const brandWrapper = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "14px",
  fontSize: "38px",
  fontWeight: "900",
  color: "#fff",
  marginBottom: "8px",
  letterSpacing: "1px"
};

const brandText = {
  background: "linear-gradient(90deg, #ffffff, #cbd5e1)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent"
};

const cardTitleWrapper = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  fontSize: "24px",
  fontWeight: "700",
  marginBottom: "25px",
  color: "#fff"
};

const stoneIconLarge = {
  width: "40px",
  height: "30px",
  borderRadius: "10px",
  background: "linear-gradient(145deg, #ffffff, #dbeafe)",
  boxShadow: `
    0 0 10px rgba(255,255,255,0.9),
    0 0 20px rgba(255,255,255,0.5),
    inset 0 2px 4px rgba(255,255,255,0.8)
  `
};

const stoneIconSmall = {
  width: "22px",
  height: "22px",
  borderRadius: "6px",
  background: "linear-gradient(145deg, #ffffff, #e2e8f0)",
  boxShadow: `
    0 0 8px rgba(255,255,255,0.8),
    inset 0 1px 3px rgba(255,255,255,0.8)
  `
};
