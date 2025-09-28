import React from 'react'

export default function Nav2() {
  return (
    <div
      style={{
        background: "#f5f5f5",
        borderRadius: "16px",
        maxWidth: 1200,
        margin: "12px auto",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
      }}
    >
      {/* Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <Tab label="Heart Health Basics" active={false} />
        <Tab label="Risk Calculator" active={true} />
        <Tab label="Symptoms & Warning Signs" active={false} />
        <Tab label="Prevention Tips" active={false} />
        <Tab label="Heart-friendly Diet" active={false} />
        <Tab label="Research & News" active={false} />
      </div>
       {/* Search */}
      <div
        style={{
          marginLeft: 20,
          background: "#fff",
          border: "1.5px solid #efefef",
          borderRadius: "10px",
          minWidth: 150,
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          height: 38,
        }}
      >
        <input
          type="search"
          placeholder="Search"
          style={{
            border: "none",
            outline: "none",
            background: "transparent",
            fontSize: "0.95rem",
            color: "#242424",
            width: 100,
            padding: "6px 0",
          }}
        />
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="#b3b3b3"
          strokeWidth="2"
          style={{ marginLeft: 4 }}
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M15 15l-4-4" />
        </svg>
      </div>
    </div>
  );
}

function Tab({ label, active }) {
  return (
    <span
      style={{
        fontWeight: active ? 600 : 500,
        fontSize: "0.95rem",
        color: "#222",
        background: active ? "#fff" : "transparent",
        padding: "6px 14px",
        borderRadius: "9px",
        boxShadow: active ? "0 1px 6px rgba(32,32,32,0.06)" : "none",
        border: active ? "1.2px solid #ededed" : "none",
        transition: "all .14s ease",
        cursor: "pointer",
      }}
    >
      {label}
    </span>
  )
}
