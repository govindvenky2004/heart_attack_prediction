import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "#b41a2d",
        color: "#fff",
        fontWeight: 600,
        border: "none",
        borderRadius: "10px",
        padding: "10px 20px",
        fontSize: "1rem",
        cursor: "pointer",
        position: "absolute",
        top: "90px",
        left: "40px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
        zIndex: 100,
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#9e0f22")}
      onMouseOut={(e) => (e.currentTarget.style.background = "#b41a2d")}
    >
      ⬅ Back to Home
    </button>
  );
}
