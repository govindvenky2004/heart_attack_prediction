import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ECGAnalyzer() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload an ECG image first.");
      return;
    }

    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:8000/ecg/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError("Error analyzing ECG. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #fff0f2 60%, #ffe6e9 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
        color: "#222",
        padding: "40px 10px",
      }}
    >
      {/* Back Button (matches HeartChat theme) */}
      <button
        onClick={() => navigate("/")}
        style={{
          alignSelf: "flex-start",
          marginLeft: "40px",
          marginBottom: "20px",
          padding: "10px 18px",
          background: "transparent",
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
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#b41a2d";
        }}
      >
        ⬅ Back to Home
      </button>

      {/* Analyzer Card */}
      <div
        style={{
          background: "#ffffff",
          padding: "40px 50px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(180,26,45,0.15)",
          textAlign: "center",
          width: "400px",
          border: "1px solid #f5b9c1",
        }}
      >
        <h2
          style={{
            color: "#b41a2d",
            fontWeight: 800,
            marginBottom: "30px",
            letterSpacing: "1px",
            textShadow: "0 0 10px #b41a2d22",
            fontSize: "1.8rem",
          }}
        >
          🩺 ECG Image Analyzer
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Upload */}
          <label
            htmlFor="file"
            style={{
              display: "inline-block",
              background: "#fff6f7",
              color: "#b41a2d",
              padding: "12px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              border: "1.8px solid #b41a2d",
              transition: "0.25s",
              fontSize: "0.95rem",
              width: "80%",
              textAlign: "center",
              fontWeight: 600,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#b41a2d";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff6f7";
              e.currentTarget.style.color = "#b41a2d";
            }}
          >
            {file ? file.name : "Choose ECG Image"}
            <input
              id="file"
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              hidden
            />
          </label>

          {/* Analyze Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: "#b41a2d",
              color: "white",
              fontWeight: 600,
              border: "none",
              borderRadius: "8px",
              padding: "12px 28px",
              cursor: "pointer",
              width: "80%",
              fontSize: "1rem",
              transition: "0.25s ease",
              letterSpacing: "0.5px",
              boxShadow: loading
                ? "0 0 12px rgba(180,26,45,0.3)"
                : "0 3px 10px rgba(0,0,0,0.15)",
              opacity: loading ? 0.8 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = "#9e0f22";
                e.currentTarget.style.transform = "scale(1.03)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#b41a2d";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {loading ? "Analyzing..." : "Analyze ECG"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <p
            style={{
              color: "#b41a2d",
              fontWeight: 500,
              marginTop: "20px",
              fontSize: "0.95rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Result */}
        {result && (
          <div
            style={{
              background: "#fff0f2",
              border: "1px solid #f5b9c1",
              borderRadius: "10px",
              padding: "18px 16px",
              marginTop: "26px",
              textAlign: "left",
              boxShadow: "0 0 10px rgba(180,26,45,0.08)",
              lineHeight: "1.5rem",
              fontSize: "0.95rem",
              color: "#333",
            }}
          >
            <h3
              style={{
                color: "#b41a2d",
                marginBottom: "10px",
                fontSize: "1.1rem",
              }}
            >
              Result
            </h3>
            <p><strong>Predicted Class:</strong> {result.predicted_class}</p>
            <p>
              <strong>Confidence:</strong>{" "}
              {typeof result.confidence === "string"
                ? result.confidence
                : `${(result.confidence * 100).toFixed(2)}%`}
            </p>
            <p><strong>Interpretation:</strong> {result.interpretation}</p>
          </div>
        )}
      </div>
    </div>
  );
}
