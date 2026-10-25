import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/analyze', { text });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError('Connection failed. Make sure FastAPI is running on http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>MERSAD AI</div>
          <h1 style={styles.title}>Threat & Scam Analyzer</h1>
          <p style={styles.subtitle}>Paste any suspicious message, email, or link below to evaluate security risks.</p>
        </div>

        {/* Input Area */}
        <div style={styles.inputGroup}>
          <textarea
            rows="5"
            style={styles.textarea}
            placeholder="e.g. Urgent alert: Your bank account has been locked. Click here to verify..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            style={{
              ...styles.button,
              opacity: loading || !text.trim() ? 0.6 : 1,
              cursor: loading || !text.trim() ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Analyzing with Gemini...' : 'Analyze Message'}
          </button>
        </div>

        {/* Error Box */}
        {error && <div style={styles.errorBox}>{error}</div>}

        {/* Results Box */}
        {result && (
          <div style={styles.resultBox}>
            <div style={styles.resultHeader}>
              <span style={styles.resultTitle}>Analysis Report</span>
              <span style={{
                ...styles.riskBadge,
                backgroundColor: 
                  result.risk_level === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' :
                  result.risk_level === 'MEDIUM' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                color: 
                  result.risk_level === 'HIGH' ? '#f87171' :
                  result.risk_level === 'MEDIUM' ? '#fbbf24' : '#34d399',
                borderColor: 
                  result.risk_level === 'HIGH' ? 'rgba(239, 68, 68, 0.4)' :
                  result.risk_level === 'MEDIUM' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)',
              }}>
                RISK: {result.risk_level}
              </span>
            </div>

            <div style={styles.resultItem}>
              <strong style={styles.label}>Threat Type:</strong>
              <span style={styles.value}>{result.threat_type}</span>
            </div>

            <div style={styles.resultItem}>
              <strong style={styles.label}>Reasons for Suspicion:</strong>
              <p style={styles.paragraph}>{result.reasons}</p>
            </div>

            <div style={styles.resultItem}>
              <strong style={styles.label}>Actionable Recommendation:</strong>
              <p style={{ ...styles.paragraph, color: '#38bdf8' }}>{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#090d16',
    color: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: '650px',
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  },
  header: {
    marginBottom: '24px',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#22d3ee',
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    padding: '4px 10px',
    borderRadius: '20px',
    marginBottom: '10px',
    border: '1px solid rgba(34, 211, 238, 0.2)',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  textarea: {
    width: '100%',
    backgroundColor: '#030712',
    border: '1px solid #374151',
    borderRadius: '10px',
    padding: '14px',
    color: '#f8fafc',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    backgroundColor: '#22d3ee',
    color: '#030712',
    fontWeight: '600',
    fontSize: '15px',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    transition: 'background 0.2s',
  },
  errorBox: {
    marginTop: '20px',
    backgroundColor: 'rgba(127, 29, 29, 0.4)',
    border: '1px solid rgba(185, 28, 28, 0.5)',
    color: '#fca5a5',
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
  },
  resultBox: {
    marginTop: '24px',
    backgroundColor: '#030712',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '20px',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #1f2937',
    paddingBottom: '12px',
    marginBottom: '16px',
  },
  resultTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f8fafc',
  },
  riskBadge: {
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid',
  },
  resultItem: {
    marginBottom: '12px',
  },
  label: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#9ca3af',
    display: 'block',
    marginBottom: '4px',
  },
  value: {
    fontSize: '14px',
    color: '#f8fafc',
  },
  paragraph: {
    fontSize: '14px',
    color: '#d1d5db',
    margin: 0,
    lineHeight: '1.5',
  },
};