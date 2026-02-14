import React, { useState } from "react";

export default function SinhalaClassifier() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classifyText = async () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:5001/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Classification failed");
      }
    } catch (err) {
      setError(
        "Failed to connect to server. Make sure Flask API is running on http://localhost:5001",
      );
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sampleText) => {
    setText(sampleText);
    setResult(null);
    setError(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sinhala News Classifier</h1>
        <p style={styles.subtitle}>
          Classify news into International, Business, or Sport
        </p>

        <div style={styles.inputSection}>
          <label style={styles.label}>Enter Sinhala News Text:</label>
          <textarea
            style={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ඔබේ පුවත් පාඨය මෙහි ඇතුළත් කරන්න..."
            rows="6"
            disabled={loading}
          />

          <div style={styles.sampleButtons}>
            <p style={styles.sampleLabel}>Quick samples:</p>
            <button
              style={styles.sampleBtn}
              onClick={() =>
                loadSample(
                  "අලුත් යුද්ධයක් නිර්මාණය කරන බවට,වෙනිසියුලා ජනපතිගෙන් අමෙරිකාවට චෝදනා",
                )
              }
              disabled={loading}
            >
              International
            </button>
            <button
              style={styles.sampleBtn}
              onClick={() =>
                loadSample("කොළඹ කොටස් වෙළඳපොළ අද ලකුණු 50කින් ඉහළ ගියේය")
              }
              disabled={loading}
            >
              Business
            </button>
            <button
              style={styles.sampleBtn}
              onClick={() =>
                loadSample("ශ්‍රී ලංකා ක්‍රිකට් කණ්ඩායම ජයග්‍රහණය කරයි")
              }
              disabled={loading}
            >
              Sport
            </button>
          </div>

          <button
            style={{
              ...styles.button,
              ...(loading || !text.trim() ? styles.buttonDisabled : {}),
            }}
            onClick={classifyText}
            disabled={loading || !text.trim()}
          >
            {loading ? "Classifying..." : "Classify Text"}
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div style={styles.resultBox}>
            <h3 style={styles.resultTitle}>Classification Result</h3>

            <div style={styles.resultCard}>
              <div style={styles.resultRow}>
                <div>
                  <div style={styles.resultLabel}>Category</div>
                  <div style={styles.resultValue}>{result.category}</div>
                </div>
                <div style={styles.confidence}>
                  <div style={styles.resultLabel}>Confidence</div>
                  <div style={styles.resultValue}>
                    {(result.confidence * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.inputDisplay}>
              <strong>Input Text:</strong>
              <p style={styles.inputText}>{result.text}</p>
            </div>
          </div>
        )}

        <div style={styles.categories}>
          <div style={styles.categoryCard}>
            <h4>🌍 International</h4>
            <p>World news & global events</p>
          </div>
          <div style={styles.categoryCard}>
            <h4>💼 Business</h4>
            <p>Economy & corporate news</p>
          </div>
          <div style={styles.categoryCard}>
            <h4>⚽ Sport</h4>
            <p>Sports & athletic events</p>
          </div>
        </div>

        <footer style={styles.footer}>
          Powered by Machine Learning • NER-Based Data Augmentation
        </footer>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    padding: "30px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "10px",
    color: "#333",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
  },
  inputSection: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "2px solid #ddd",
    borderRadius: "4px",
    resize: "vertical",
    fontFamily: "Arial, sans-serif",
    boxSizing: "border-box",
  },
  sampleButtons: {
    margin: "15px 0",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  sampleLabel: {
    margin: 0,
    fontSize: "14px",
    color: "#666",
  },
  sampleBtn: {
    padding: "6px 12px",
    fontSize: "13px",
    backgroundColor: "#e3f2fd",
    border: "1px solid #90caf9",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#1976d2",
  },
  button: {
    width: "100%",
    padding: "15px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  errorBox: {
    backgroundColor: "#ffebee",
    border: "1px solid #f44336",
    borderRadius: "4px",
    padding: "15px",
    marginTop: "20px",
    color: "#c62828",
  },
  resultBox: {
    marginTop: "30px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
  },
  resultTitle: {
    marginTop: 0,
    marginBottom: "20px",
    fontSize: "20px",
    color: "#333",
  },
  resultCard: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: "14px",
    opacity: 0.9,
    marginBottom: "5px",
  },
  resultValue: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  confidence: {
    textAlign: "right",
  },
  inputDisplay: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  inputText: {
    marginTop: "10px",
    lineHeight: "1.6",
    color: "#333",
  },
  categories: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
    marginTop: "30px",
    marginBottom: "20px",
  },
  categoryCard: {
    backgroundColor: "#f5f5f5",
    padding: "15px",
    borderRadius: "4px",
    textAlign: "center",
    border: "1px solid #e0e0e0",
  },
  footer: {
    textAlign: "center",
    color: "#999",
    fontSize: "14px",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
  },
};
