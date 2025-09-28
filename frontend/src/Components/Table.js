import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import navigation

export default function Table() {
  const navigate = useNavigate(); // initialize navigation

  const initialFormData = {
    Age: "",
    Sex: "",
    ChestPainType: "",
    RestingBP: "",
    Cholesterol: "",
    FastingBS: "",
    RestingECG: "",
    MaxHR: "",
    ExerciseAngina: "",
    Oldpeak: "",
    ST_Slope: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleRadioChange = (e) => {
    setFormData({
      ...formData,
      Sex: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const payload = {
      Age: Number(formData.Age),
      Sex: Number(formData.Sex),
      ChestPainType: Number(formData.ChestPainType),
      RestingBP: Number(formData.RestingBP),
      Cholesterol: Number(formData.Cholesterol),
      FastingBS: Number(formData.FastingBS),
      RestingECG: Number(formData.RestingECG),
      MaxHR: Number(formData.MaxHR),
      ExerciseAngina: Number(formData.ExerciseAngina),
      Oldpeak: parseFloat(formData.Oldpeak),
      ST_Slope: Number(formData.ST_Slope),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/predict-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      if (data && typeof data.probability === "number") setResult(data);
      else setResult({ error: "Invalid response from backend" });
    } catch (error) {
      setResult({ error: "Failed to fetch prediction. Check backend." });
    } finally {
      setLoading(false);
    }
  };

  const handleHome = () => {
    navigate("/"); // navigate to home page
  };

  const RISK_THRESHOLD = 0.45;
  const isHighRisk = result && typeof result.probability === "number"
    ? result.probability >= RISK_THRESHOLD
    : false;

  const inputFields = [
    { label: "Age", name: "Age", type: "number", unit: "years" },
    { label: "Chest Pain Type", name: "ChestPainType", type: "number", unit: "0-3" },
    { label: "Resting BP", name: "RestingBP", type: "number", unit: "mmHg" },
    { label: "Cholesterol", name: "Cholesterol", type: "number", unit: "mg/dL" },
    { label: "Fasting BS", name: "FastingBS", type: "number", unit: "0=Normal,1=High" },
    { label: "Resting ECG", name: "RestingECG", type: "number", unit: "0-2" },
    { label: "Max HR", name: "MaxHR", type: "number", unit: "bpm" },
    { label: "Exercise Angina", name: "ExerciseAngina", type: "number", unit: "0=No,1=Yes" },
    { label: "Oldpeak", name: "Oldpeak", type: "number", step: "0.01", unit: "mV" },
    { label: "ST Slope", name: "ST_Slope", type: "number", unit: "0-2" },
  ];

  return (
    <div
      style={{
        fontFamily: "'Inter','Segoe UI',Arial,sans-serif",
        background: "#99bf91ff",
        minHeight: "80vh",
        padding: "0px",
        margin: 70,
        borderRadius: 30,
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "54px 16px 18px 16px", textAlign: "center" }}>
        <h1 style={{ fontWeight: 800, fontSize: "3.3rem", letterSpacing: "-.02em", margin: 0, color: "#222" }}>
          Heart Attack Risk Prediction
        </h1>
        <div style={{ marginTop: 24, color: "#5c5858ff", fontSize: "1.23rem", fontWeight: 450 }}>
          AI-powered tool for simple health risk estimation
        </div>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "65px auto 0",
          background: "#fff",
          boxShadow: "0 2.5px 22px rgba(34,34,34,0.07)",
          borderRadius: "13px",
          padding: "34px 32px 24px 32px",
          border: "1px solid #ececec",
        }}
      >
        <button
          onClick={handleHome} // now navigates to home
          style={{
            marginBottom: 20,
            padding: "8px 20px",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e0e0e0")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#f0f0f0")}
        >
          🏠 Home
        </button>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "28px 36px",
              borderBottom: "1px solid #eee",
              paddingBottom: "20px",
              marginBottom: "22px",
            }}
          >
            {inputFields.map(({ label, name, type, step, unit }) => (
              <div key={name} style={{ flex: "1 1 300px", minWidth: 280, marginBottom: 20 }}>
                <label style={{ fontWeight: 600, color: "#363636", fontSize: "1.05rem", display: "block" }}>
                  {label} ({unit})
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  step={step}
                  min={0}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  style={{
                    width: "100%",
                    marginTop: 6,
                    padding: "10px",
                    fontSize: "1rem",
                    background: "#fafafa",
                    border: "1.3px solid #e8e8e8",
                    borderRadius: "6px",
                    color: "#14181e",
                  }}
                />
              </div>
            ))}

            <div style={{ flex: "1 1 300px", minWidth: 280, marginBottom: 20 }}>
              <label style={{ fontWeight: 600, color: "#363636", fontSize: "1.05rem", display: "block", marginBottom: 6 }}>
                Sex
              </label>
              <div style={{ display: "flex", gap: 24 }}>
                <label style={{ fontWeight: 500, color: "#525252", fontSize: "1rem", display: "flex", alignItems: "center" }}>
                  <input
                    type="radio"
                    name="Sex"
                    value="1"
                    checked={formData.Sex === "1"}
                    onChange={handleRadioChange}
                    style={{ marginRight: 6 }}
                  />
                  Male
                </label>
                <label style={{ fontWeight: 500, color: "#525252", fontSize: "1rem", display: "flex", alignItems: "center" }}>
                  <input
                    type="radio"
                    name="Sex"
                    value="0"
                    checked={formData.Sex === "0"}
                    onChange={handleRadioChange}
                    style={{ marginRight: 6 }}
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: "block",
              margin: "24px auto 0 auto",
              padding: "12px 56px",
              background: "#0bac54ff",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1.05rem",
              border: "none",
              borderRadius: "28px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              opacity: loading ? 0.7 : 1,
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = "#0a9745ff")}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = "#0bac54ff")}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </form>

        {result && result.probability !== undefined ? (
          <div
            style={{
              margin: "32px auto 0 auto",
              background: isHighRisk ? "#fff1f1" : "#f8fdf7",
              border: `1.2px solid ${isHighRisk ? "#f1cccc" : "#e0f9ef"}`,
              borderRadius: "10px",
              color: isHighRisk ? "#a11313" : "#157b52",
              maxWidth: 520,
              fontWeight: 600,
              fontSize: "1.05rem",
              textAlign: "center",
              padding: "24px 8px 20px 8px",
            }}
          >
            <span style={{ fontSize: "26px", fontWeight: 700, display: "block", marginBottom: 8 }}>
              {isHighRisk ? "⚠️ High Risk" : "✅ Low Risk"}
            </span>
            <span style={{ fontWeight: 600, fontSize: "18px" }}>
              Probability: {(result.probability * 100).toFixed(2)}%
            </span>

            {result.download_link && (
              <div style={{ marginTop: 12 }}>
                <a
                  href={`http://127.0.0.1:8000${result.download_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#0bac54ff", fontWeight: 600, textDecoration: "underline" }}
                >
                  Download PDF Report
                </a>
              </div>
            )}
          </div>
        ) : result && result.error ? (
          <div style={{ color: "red", textAlign: "center", marginTop: 24 }}>
            {result.error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
