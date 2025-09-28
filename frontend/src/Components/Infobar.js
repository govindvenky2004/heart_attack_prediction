import React from "react";

export default function Infobar() {
  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "68px auto 0 auto", // margin top as requested
        background: "#feeb97",
        borderRadius: "22px",
        minHeight: 210,
        display: "flex",
        alignItems: "stretch",
        boxShadow: "0 2.5px 20px rgba(120,100,0,0.06)",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Left Main Content */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "38px 40px 28px 42px",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          {/* Heart SVG logo */}
          <img
            src="/heart_logo.svg" // path from public folder
            alt="Heart Logo"
            width={32}
            height={32}
            style={{ display: "block" }}
          />
          <span style={{fontWeight: 700, fontSize: "1.2rem", color: "#231b1b", letterSpacing: ".01em"}}>
            Heart Health
          </span>
        </div>
        <div style={{fontWeight: 800, fontSize: "2rem", color: "#141416", marginBottom: 16}}>
          Personalized Heart Health Insights
        </div>
        <div style={{ fontSize: "1.18rem", color: "#332b17", fontWeight: 500, marginBottom: 25, maxWidth: 490 }}>
          Instantly analyze your risk for heart attack and get science-backed tips to improve your heart health. Private, secure, and free—powered by smart AI.
        </div>
        <div style={{ display: "flex", gap: 30, alignItems: "center", marginBottom: 20 }}>
          <div style={{display: "flex", gap: 18, fontSize:"1.1rem", color:"#141414"}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span role="img" aria-label="shield">🛡️</span> Privacy-First
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span role="img" aria-label="AI lightning">⚡</span> Instant Results
            </div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <span role="img" aria-label="advice">📋</span> Actionable Advice
            </div>
          </div>
        </div>
      </div>
      {/* Right Images/Icons */}
      <div
        style={{
          minWidth: 280,
          background: "linear-gradient(120deg,#feeb97 75%,#ffeab2)",
          borderTopRightRadius: "22px",
          borderBottomRightRadius: "22px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 24px",
          justifyContent: "center"
        }}
      >
        {/* Health-related icons */}
        <div style={{display: "flex", gap: 16, marginBottom: 22}}>
          <span style={{
            background: "#ffdedf",
            borderRadius: "50%",
            padding: 9,
            display: "inline-flex",
            fontSize: 22
          }}>❤️</span>
          <span style={{
            background: "#d8f7f1",
            borderRadius: "50%",
            padding: 9,
            display: "inline-flex",
            fontSize: 22
          }}>💪</span>
          <span style={{
            background: "#e5eaff",
            borderRadius: "50%",
            padding: 9,
            display: "inline-flex",
            fontSize: 22
          }}>🏃‍♂️</span>
          <span style={{
            background: "#fbe6fc",
            borderRadius: "50%",
            padding: 9,
            display: "inline-flex",
            fontSize: 22
          }}>🩺</span>
          <span style={{
            background: "#f6f9ca",
            borderRadius: "50%",
            padding: 9,
            display: "inline-flex",
            fontSize: 22
          }}>📈</span>
        </div>
        {/* Optional static heart report illustration */}
        <svg width={90} height={90} style={{marginTop:10}} viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="43" fill="#fff" stroke="#dac065" strokeWidth="4"/>
          <path d="M30 57 Q40 40 45 52 Q50 64 60 35" stroke="#b41a2d" strokeWidth="3.5" fill="none" />
          <circle cx="30" cy="57" r="4.5" fill="#ff919a" />
          <circle cx="60" cy="35" r="4.5" fill="#ff919a" />
        </svg>
      </div>
    </div>
  );
}
