import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function HeartChat() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I'm your Heart Health Assistant 🤖❤️. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatHospitals = (hospitals) => {
    if (!hospitals || hospitals.length === 0) return "No hospitals found nearby.";
    return hospitals
      .map((h, idx) => `${idx + 1}. ${h.name}\n   Address: ${h.address}`)
      .join("\n\n");
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      let lat = null;
      let lng = null;

      const hospitalKeywords = ["nearby hospital", "heart hospital", "cardiac hospital", "near me", "hospital nearby"];
      if (hospitalKeywords.some((k) => input.toLowerCase().includes(k))) {
        if (navigator.geolocation) {
          try {
            const position = await new Promise((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 });
            });
            lat = position.coords.latitude;
            lng = position.coords.longitude;
          } catch {}
        }
      }

      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, lat: lat ?? null, lng: lng ?? null }),
      });

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
      const data = await response.json();

      let botText = data.reply;
      if (data.hospitals && data.hospitals.length > 0) {
        botText = `Here are some nearby heart specialty hospitals:\n\n${formatHospitals(data.hospitals)}`;
      }

      setMessages((prev) => [...prev, { from: "bot", text: botText }]);
    } catch {
      setMessages((prev) => [...prev, { from: "bot", text: "⚠️ Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const goHome = () => navigate("/");

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "100px 20px 40px",
        background: "linear-gradient(to bottom, #ff6b6b, #ff4d4d)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Home Button */}
      <button
        onClick={goHome}
        style={{
          marginBottom: 16,
          padding: "10px 22px",
          background: "#fff",
          border: "2px solid #ff1a1a",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 600,
          color: "#e4bfbfff",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#ff1a1a", e.currentTarget.style.color = "#fff")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fff", e.currentTarget.style.color = "#ff1a1a")}
      >
        🏠 Home
      </button>

      <h2 style={{ marginBottom: 20, color: "#fff", textShadow: "1px 1px 4px rgba(0,0,0,0.3)" }}>
        Heart Health AI Chat 🤖❤️
      </h2>

      {/* Chat Window */}
      <div
        style={{
          borderRadius: 20,
          padding: 20,
          width: "100%",
          maxWidth: 600,
          height: 500,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          background: "#ffe5e5",
          boxShadow: "0 8px 18px rgba(0,0,0,0.08)",
          border: "1px solid #ff9999",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ alignSelf: msg.from === "user" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
            <div
              style={{
                padding: "12px 18px",
                borderRadius: 20,
                background: msg.from === "user" ? "#ffb3b3" : "#ff4d4d",
                color: msg.from === "user" ? "#141416" : "#fff",
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && <div style={{ color: "#fff" }}>HeartCare AI is typing...</div>}
        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div style={{ display: "flex", marginTop: 16, gap: 10, width: "100%", maxWidth: 600 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your question about heart health..."
          style={{
            flex: 1,
            padding: 14,
            borderRadius: 14,
            border: "1px solid #ff9999",
            outline: "none",
            fontSize: 15,
            transition: "border 0.3s",
          }}
          onFocus={(e) => (e.currentTarget.style.border = "2px solid #ff1a1a")}
          onBlur={(e) => (e.currentTarget.style.border = "1px solid #ff9999")}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "12px 22px",
            borderRadius: 14,
            border: "none",
            background: "#ff1a1a",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#cc0000")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ff1a1a")}
        >
          Send
        </button>
      </div>
    </div>
  );
}
