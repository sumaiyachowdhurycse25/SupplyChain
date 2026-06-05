import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("adminToken");

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  if (!isLoggedIn) return null;

  const linkBaseStyle = {
    display: "block",
    padding: "12px 16px",
    borderRadius: "14px",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textDecoration: "none",
    color: "#fff",
    transition: "all 0.3s ease",
  };
  const stoneIconSmall = {
  display: "inline-block",
  width: "14px",
  height: "14px",
  margin: "0 6px",
  borderRadius: "4px",
  background: "linear-gradient(145deg, #ffffff, #e2e8f0)",
  boxShadow: `
    0 0 8px rgba(255,255,255,0.8),
    inset 0 1px 3px rgba(255,255,255,0.8)
  `
};

  return (
    <aside
      style={{
        width: "260px",
        minHeight: "100vh",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",

        // Glass effect
        background: "linear-gradient(135deg, #0f172a, #1e293b, #0f172a)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255,255,255,0.08)",

        // Depth
        boxShadow:
          "0 20px 60px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.03)",
      }}
    >
      {/* Logo Section */}
      <div>
        <h2
          style={{
    fontSize: "26px",
  fontWeight: "900",
  marginBottom: "10px",
  letterSpacing: "0.5px",
  background: "linear-gradient(90deg, #60a5fa, #a78bfa)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
          }}
        >
          SupplyChain AI
        </h2>

 <h3
          style={{
           fontSize: "18px",
  fontWeight: "500",
  marginBottom: "32px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.7)",
          }}
        >
          <span style={stoneIconSmall} />NoThink<span style={stoneIconSmall} />

        </h3>
        {/* Navigation */}
        <nav>
          {[
            { name: "Dashboard", path: "/" },

            //{ name: "AI Assistant", path: "/ai" },
            //{name: "Chatbot", path: "/nlp"},

            {name: "Chat", path: "/chat"},

            { name: "Suppliers", path: "/suppliers" },
            
            { name: "Products", path: "/products" },

            { name: "Warehouses", path: "/warehouses" },

            { name: "Inventory", path: "/inventory" },

            { name: "Inventory Display", path: "/inventorydisplay" },
            
            { name: "Shipment Tracking", path: "/ShipmentTracking" },
            
            { name: "Add Shipment", path: "/shipments/new" },

            { name: "Purchase Orders", path: "/purchase-orders" },

            { name: "Reorder AI", path: "/reorder" },
            { name: "Delay Prediction", path: "/delay-prediction" },
            { name: "Route Optimization", path: "/route-optimization" },

          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              style={({ isActive }) => ({
                ...linkBaseStyle,
                background: isActive
                  ? "linear-gradient(90deg, #60a5fa, #a78bfa)"
                  : "rgba(255,255,255,0.04)",
                boxShadow: isActive
                  ? "0 0 20px rgba(96,165,250,0.4)"
                  : "none",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  e.currentTarget.style.transform = "translateX(6px)";
                  e.currentTarget.style.background =
                    "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.background =
                  "rgba(255,255,255,0.04)";
              }}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        style={{
          padding: "12px",
          borderRadius: "16px",
          border: "none",
          fontWeight: "600",
          color: "#fff",
          cursor: "pointer",
          background: "linear-gradient(90deg, #f87171, #dc2626)",
          boxShadow: "0 0 20px rgba(248,113,113,0.5)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-4px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        Logout
      </button>
    </aside>
  );
}
