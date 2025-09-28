import React from "react";
import { useNavigate } from "react-router-dom"; // import useNavigate

export default function Navbar() {
  const navigate = useNavigate(); // initialize navigate

  return (
    <>
      {/* Top navbar: ONLY this bar is fixed */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: 70,
          background: "#fff",
          borderBottom: "1.4px solid #f2f2f2",
          boxShadow: "0 0.5px 8px rgba(34,34,34,0.045)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 48px",
          zIndex: 1002
        }}
      >
        {/* Left: Heart, title, tagline */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src="/heart_logo.svg" // your SVG in public folder
            alt="Heart Logo"
            width={38}
            height={38}
            style={{ display: "block" }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "1.42rem", color: "#191919" }}>
              Heart & AI
            </div>
            <div style={{ fontSize: 13, color: "#767676", marginTop: -2 }}>
              Since 2025
            </div>
          </div>
        </div>

        {/* Right: buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* START A CONVERSATION button navigates to /chat */}
          <button
            onClick={() => navigate("/chat")}
            style={{
              padding: "11px 28px",
              background: "#fff",
              border: "2.2px solid #232323",
              borderRadius: "10px",
              color: "#191919",
              fontWeight: 700,
              letterSpacing: ".03em",
              fontSize: "1.09rem",
              marginRight: 2,
              cursor: "pointer",
              transition: "background 0.14s"
            }}
          >
            START A CONVERSATION
          </button>

          <button
          onClick={()=>navigate("/quote")}
            style={{
              padding: "11px 28px",
              background: "#ffe37e",
              border: "none",
              borderRadius: "10px",
              color: "#191919",
              fontWeight: 800,
              fontSize: "1.09rem",
              letterSpacing: ".03em",
              boxShadow: "0 1px 6px #ffed9e11",
              marginRight: 2,
              cursor: "pointer",
              transition: "background 0.14s"
            }}
          >
            GET A QUOTE
          </button>

          <span
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f4f4f6",
              marginLeft: 8,
              border: "2px solid #ededed"
            }}
          >
            <span
              style={{
                width: 15,
                height: 15,
                display: "inline-block",
                background:
                  "radial-gradient(circle at 50% 50%, #444 27%, #fff 28% 100%)",
                borderRadius: "50%"
              }}
            ></span>
          </span>
        </div>
      </div>

      {/* To prevent overlap, add margin at top of rest of page */}
      <div style={{ minHeight: 70 }}></div>
    </>
  );
}
