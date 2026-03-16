import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../services/apiClient.js';

export default function RedirectPage() {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const redirect = async () => {
      try {
        setLoading(true);
        
        // Call backend to get original URL and track analytics
        const response = await apiClient.get(`/url/${shortCode}`);
        
        if (response.data?.originalUrl) {
          // Redirect to original URL
          window.location.href = response.data.originalUrl;
        } else {
          setError('Short link not found');
          setLoading(false);
        }
      } catch (err) {
        console.error('Redirect error:', err);
        setError('Short link not found or expired');
        setLoading(false);
      }
    };

    redirect();
  }, [shortCode]);

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Redirecting...</h2>
          <p style={styles.muted}>Please wait while we redirect you.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.error}>❌ Link Not Found</h2>
        <p style={styles.muted}>{error}</p>
        <button
          onClick={() => navigate('/')}
          style={styles.button}
        >
          Create New Short Link
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(145deg, #f4f7ff, #f7faff)',
  },
  card: {
    background: '#fff',
    border: '1px solid #d6e0f2',
    borderRadius: '14px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 14px 38px rgba(17, 42, 99, 0.1)',
    maxWidth: '400px',
  },
  error: {
    margin: '0 0 12px 0',
    fontSize: '1.4rem',
    color: '#bd2d2d',
  },
  muted: {
    margin: '0 0 24px 0',
    color: '#5c6d88',
    fontSize: '0.95rem',
  },
  button: {
    background: '#1246c9',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
};
