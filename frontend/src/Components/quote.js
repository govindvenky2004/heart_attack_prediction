// src/Quote.jsx
import React, { useState } from "react";

export default function Quote() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Example POST request to FastAPI backend
      const response = await fetch("http://localhost:8000/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");
      alert("✅ Your quote request has been submitted!");
      setFormData({ name: "", age: "", email: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Failed to send request. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "90px auto", padding: 20 }}>
      <h2 style={{ textAlign: "center", color: "#b41a2d" }}>
        Request a Heart Health Quote ❤️
      </h2>
      <p style={{ textAlign: "center", color: "#555", marginBottom: 20 }}>
        Fill in your details and we will get back to you with a personalized estimate.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          background: "#fff0f2",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="age"
          placeholder="Age (years)"
          value={formData.age}
          onChange={handleChange}
          required
          type="number"
          style={inputStyle}
        />
        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          type="email"
          style={inputStyle}
        />
        <textarea
          name="message"
          placeholder="Any specific request or symptoms..."
          value={formData.message}
          onChange={handleChange}
          rows={4}
          style={{ ...inputStyle, resize: "none" }}
        />

        <button
          type="submit"
          style={{
            padding: "12px 20px",
            background: "#b41a2d",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  padding: "12px 14px",
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 14,
};
