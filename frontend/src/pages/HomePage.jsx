import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import UrlShortenerForm from '../components/UrlShortenerForm.jsx';
import UrlList from '../components/UrlList.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteUrl, getUserUrls, shortenUrl } from '../services/urlApi.js';
import { addGuestShortCode } from '../utils/guestLinks.js';

export default function HomePage() {
  const { token } = useAuth();
  const [urls, setUrls] = useState([]);
  const [latestGuestLink, setLatestGuestLink] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUrls = useCallback(async () => {
    if (!token) {
      setUrls([]);
      return;
    }

    setError('');

    try {
      const data = await getUserUrls(token);
      setUrls(data);
    } catch {
      setError('Failed to load links');
    }
  }, [token]);

  useEffect(() => {
    loadUrls();
  }, [loadUrls]);

  const onCreate = async (originalUrl) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await shortenUrl(token, originalUrl);
      const successMessage = response.message || 'Short link created';
      setSuccess(successMessage);

      if (token) {
        setLatestGuestLink(null);
        await loadUrls();
      } else {
        if (response.data?.shortCode) {
          addGuestShortCode(response.data.shortCode);
        }
        setLatestGuestLink(response.data || null);
      }
    } catch (apiError) {
      const message =
        apiError.response?.data?.message || apiError.response?.data?.errors?.[0]?.msg || 'Failed to shorten URL';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (urlId) => {
    setError('');
    setSuccess('');

    try {
      await deleteUrl(token, urlId);
      setSuccess('URL deleted successfully');
      await loadUrls();
    } catch {
      setError('Failed to delete URL');
    }
  };

  const totalClicks = useMemo(() => urls.reduce((sum, item) => sum + item.clicks, 0), [urls]);

  return (
    <>
      <section className="split">
        <StatCard
          label={token ? 'Total Links' : 'Public Shortener'}
          value={token ? urls.length : 'Guest Mode'}
          hint={token ? 'Active short URLs' : 'Anyone can shorten URLs instantly'}
        />
        <StatCard
          label={token ? 'Total Clicks' : 'Analytics Access'}
          value={token ? totalClicks : 'Login Required'}
          hint={token ? 'All-time tracked events' : 'Create an account to view dashboard'}
        />
      </section>

      <UrlShortenerForm onSubmit={onCreate} isLoading={loading} />

      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {!token && latestGuestLink ? (
        <section className="card">
          <h2>Your short URL</h2>
          <p className="muted">Use this link now. Login is only needed for analytics dashboard access.</p>
          <div className="field-row">
            <a className="mono" href={latestGuestLink.shortUrl} target="_blank" rel="noreferrer">
              {latestGuestLink.shortUrl}
            </a>
            <button
              className="button button-ghost"
              type="button"
              onClick={() => navigator.clipboard.writeText(latestGuestLink.shortUrl)}
            >
              Copy
            </button>
          </div>
        </section>
      ) : null}

      {token ? (
        <UrlList urls={urls} onDelete={onDelete} />
      ) : (
        <section className="card">
          <h2>Want link analytics?</h2>
          <p className="muted">
            Create a free account to access click trends, referrers, countries, and dashboard
            insights for your links.
          </p>
          <Link className="button button-primary" to="/auth">
            Login to view analytics
          </Link>
        </section>
      )}
    </>
  );
}