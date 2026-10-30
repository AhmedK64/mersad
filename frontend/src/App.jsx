import React, { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('الرجاء إدخال نص للتحليل.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('فشل الاتصال بالخادم');

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالخادم الخلفي (Backend). تأكد من تشغيل FastAPI.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inject Cairo font directly to guarantee it loads across all elements */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        
        * {
          font-family: 'Cairo', sans-serif !important;
          box-sizing: border-box;
        }

        ::placeholder {
          font-family: 'Cairo', sans-serif !important;
          color: #64748b !important;
          opacity: 1;
        }
      `}</style>

      <div style={styles.body} dir="rtl">
        <div style={styles.card}>
          <div style={styles.badgeTop}>منصة مرصاد الذكية</div>
          <h1 style={styles.title}>محلل التهديدات والاحتيال</h1>
          <p style={styles.subtitle}>قم بلصق أي رسالة مشبوهة، بريد إلكتروني، أو رابط أدناه لتقييم المخاطر الأمنية بدقة.</p>

          <div style={styles.inputContainer}>
            <textarea
              style={styles.textarea}
              placeholder="مثال: تنبيه عاجل: تم قفل حسابك البنكي. انقر هنا للتحقق..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <button style={styles.button} onClick={handleAnalyze} disabled={loading}>
            {loading ? 'جاري الفحص الأمني...' : 'تحليل الرسالة'}
          </button>

          {error && <p style={styles.errorText}>{error}</p>}

          {result && (
            <div style={styles.reportCard}>
              <div style={styles.reportHeader}>
                <h3 style={styles.reportTitle}>تقرير التحليل السيبراني</h3>
                <span style={{
                  ...styles.riskBadge,
                  backgroundColor: result.risk_level.toLowerCase().includes('high') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  color: result.risk_level.toLowerCase().includes('high') ? '#f87171' : '#4ade80',
                  borderColor: result.risk_level.toLowerCase().includes('high') ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'
                }}>
                  مستوى الخطر: {result.risk_level}
                </span>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionLabel}>نوع التهديد المرصود:</h4>
                <p style={styles.threatTypeText}>{result.threat_type}</p>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionLabel}>أسباب الاشتباه والتحليل:</h4>
                <ul style={styles.list}>
                  {result.reasons?.map((reason, index) => (
                    <li key={index} style={styles.listItem}>{reason}</li>
                  ))}
                </ul>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionLabel}>التوصيات الأمنية المقترحة:</h4>
                <ul style={styles.list}>
                  {result.recommendations?.map((rec, index) => (
                    <li key={index} style={styles.listItem}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = {
  body: {
    backgroundColor: '#070a13',
    color: '#f1f5f9',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 1rem',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },
  card: {
    backgroundColor: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '750px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  },
  badgeTop: {
    display: 'inline-block',
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    color: '#22d3ee',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    padding: '0.35rem 1rem',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '700',
    marginBottom: '1.2rem',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '0.5rem',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '1rem',
    lineHeight: '1.6',
    marginBottom: '1.75rem',
  },
  inputContainer: {
    marginBottom: '1.5rem',
  },
  textarea: {
    width: '100%',
    height: '150px',
    backgroundColor: '#020617',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '1.1rem',
    color: '#f8fafc',
    fontSize: '1.05rem',
    lineHeight: '1.6',
    resize: 'vertical',
    outline: 'none',
    direction: 'auto',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  button: {
    width: '100%',
    backgroundColor: '#0891b2',
    color: '#ffffff',
    border: 'none',
    padding: '0.95rem',
    fontSize: '1.1rem',
    fontWeight: '700',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 14px rgba(8, 145, 178, 0.3)',
  },
  errorText: {
    color: '#f87171',
    marginTop: '1rem',
    textAlign: 'center',
    fontWeight: '600',
  },
  reportCard: {
    marginTop: '2.2rem',
    borderTop: '1px solid #1e293b',
    paddingTop: '1.8rem',
  },
  reportHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  reportTitle: {
    fontSize: '1.35rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  riskBadge: {
    padding: '0.35rem 0.85rem',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.9rem',
    border: '1px solid',
  },
  section: {
    marginBottom: '1.4rem',
  },
  sectionLabel: {
    color: '#94a3b8',
    fontSize: '0.9rem',
    fontWeight: '600',
    marginBottom: '0.4rem',
  },
  threatTypeText: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#38bdf8',
  },
  list: {
    marginRight: '1.2rem',
    color: '#e2e8f0',
  },
  listItem: {
    marginBottom: '0.4rem',
    fontSize: '1rem',
    lineHeight: '1.6',
  },
};