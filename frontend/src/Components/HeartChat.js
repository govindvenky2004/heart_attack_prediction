import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ import for navigation

export default function HeartChat() {
  const navigate = useNavigate(); // ✅ hook to navigate home
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I’m your Heart Health Assistant. How are you feeling today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const lowerInput = input.toLowerCase();

    // ✅ Handle nearby hospital queries
    if (lowerInput.includes("nearby hospital") || lowerInput.includes("near me")) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("📍 User location:", latitude, longitude);

            try {
              const res = await axios.post("http://127.0.0.1:8000/chat", {
                message: input,
                lat: latitude,
                lng: longitude,
              });

              const botReply = res.data.reply || "✅ Got your location!";
              setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
            } catch (err) {
              setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Error fetching nearby hospitals." },
              ]);
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.error("Location error:", error);
            setMessages((prev) => [
              ...prev,
              { sender: "bot", text: "⚠️ Please allow location access in your browser settings." },
            ]);
            setLoading(false);
          }
        );
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Geolocation not supported by this browser." },
        ]);
        setLoading(false);
      }
      return;
    }

    // ✅ Normal chat flow
    try {
      const res = await axios.post("http://127.0.0.1:8000/chat", { message: input });
      const botReply = res.data.reply || "💡 I’m here to help, could you rephrase that?";
      setMessages((prev) => [...prev, { sender: "bot", text: botReply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error — please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff0f2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 20px",
        fontFamily: "'Segoe UI', sans-serif",
        flexDirection: "column",
      }}
    >
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          alignSelf: "flex-start",
          marginBottom: "18px",
          marginLeft: "20px",
          padding: "10px 18px",
          background: "#fff",
          border: "2px solid #b41a2d",
          borderRadius: "8px",
          color: "#b41a2d",
          fontWeight: 600,
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#b41a2d";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#fff";
          e.currentTarget.style.color = "#b41a2d";
        }}
      >
        ⬅ Back to Home
      </button>

      {/* Chat Container */}
      <div
        style={{
          width: "700px",
          height: "85vh",
          background: "#ffffff",
          borderRadius: "18px",
          boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#b41a2d",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1.4rem",
            textAlign: "center",
            padding: "20px 0",
            letterSpacing: "0.6px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          ❤️ Heart Health Chat
        </div>

        {/* Chat Messages */}
        <div
          style={{
            flex: 1,
            padding: "26px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            overflowY: "auto",
            background: "#fff9fa",
            scrollBehavior: "smooth",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                background:
                  msg.sender === "user" ? "#b41a2d" : "rgba(255, 100, 120, 0.12)",
                color: msg.sender === "user" ? "#fff" : "#333",
                padding: "14px 18px",
                borderRadius:
                  msg.sender === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                maxWidth: "80%",
                fontSize: "1.05rem",
                lineHeight: "1.5rem",
                boxShadow:
                  msg.sender === "user"
                    ? "0 0 6px rgba(180,26,45,0.25)"
                    : "0 0 4px rgba(180,26,45,0.1)",
                wordBreak: "break-word",
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: msg.text }}
                style={{ whiteSpace: "pre-line" }}
              />
            </div>
          ))}

          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "rgba(255, 100, 120, 0.12)",
                color: "#555",
                padding: "12px 16px",
                borderRadius: "18px 18px 18px 4px",
                fontStyle: "italic",
                opacity: 0.8,
              }}
            >
              Typing...
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={sendMessage}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "16px 18px",
            borderTop: "1px solid #f1c9cf",
            background: "#fff6f7",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your heart health question..."
            style={{
              flex: 1,
              border: "1px solid #f5b9c1",
              borderRadius: "10px",
              padding: "14px 16px",
              fontSize: "1rem",
              color: "#333",
              background: "#fff",
              outline: "none",
              boxShadow: "0 0 4px rgba(180,26,45,0.08) inset",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              marginLeft: "12px",
              background: "#b41a2d",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "14px 28px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
              opacity: loading ? 0.8 : 1,
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#9e0f22")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#b41a2d")}
          >
            Send
          </button>
        </form>
      </div>

      {/* Inline link styles */}
      <style>{`
        a {
          color: #b41a2d;
          font-weight: 600;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
          color: #9e0f22;
        }
      `}</style>
    </div>
  );
}
