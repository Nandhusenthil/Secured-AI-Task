import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first.");
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://localhost:4000/api/upload", formData);
      setResult(res.data);
    } catch (err) {
      alert("Error processing image. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>🔒 PII Detection & Redaction Preview</h1>

      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{
          marginLeft: "10px",
          padding: "6px 14px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        {loading ? "Processing..." : "Detect & Redact"}
      </button>

      {result && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          <div>
            <h2>Original Text</h2>
            <div
              style={{
                backgroundColor: "#f3f3f3",
                padding: "10px",
                borderRadius: "6px",
                whiteSpace: "pre-wrap",
              }}
            >
              {result.originalText}
            </div>
          </div>

          <div>
            <h2>Redacted Text</h2>
            <div
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "10px",
                borderRadius: "6px",
                whiteSpace: "pre-wrap",
                fontFamily: "monospace",
              }}
            >
              {result.redactedText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
