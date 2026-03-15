import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import UrlShortenerForm from '../components/UrlShortenerForm.jsx';
import UrlList from '../components/UrlList.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteUrl, getUserUrls, shortenUrl } from '../services/urlApi.js';
import { addGuestShortCode } from '../utils/guestLinks.js';

export default function HomePage() {
  const { token } = useAuth();
  const [urls, setUrls] = useState([]);
  const [latestCreatedLink, setLatestCreatedLink] = useState(null);
  const [copiedState, setCopiedState] = useState('idle');
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
      setLatestCreatedLink(response.data || null);

      if (token) {
        await loadUrls();
      } else {
        if (response.data?.shortCode) {
          addGuestShortCode(response.data.shortCode);
        }
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

  const handleCopyLatest = async () => {
    if (!latestCreatedLink?.shortUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(latestCreatedLink.shortUrl);
      setCopiedState('copied');
      setTimeout(() => setCopiedState('idle'), 1800);
    } catch {
      setCopiedState('error');
      setTimeout(() => setCopiedState('idle'), 1800);
    }
  };

  return (
    <>
      <UrlShortenerForm onSubmit={onCreate} isLoading={loading} />

      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      {latestCreatedLink ? (
        <section className="card link-spotlight">
          <h2>Your link is ready</h2>
          <p className="muted">This is your full shortened URL. Copy and share it.</p>
          <div className="spotlight-url-row">
            <div className="spotlight-url mono">{latestCreatedLink.shortUrl}</div>
          </div>
          <div className="spotlight-actions">
            <button className="button button-primary" type="button" onClick={handleCopyLatest}>
              {copiedState === 'copied' ? 'Copied' : 'Copy link'}
            </button>
            <a className="button button-ghost" href={latestCreatedLink.shortUrl} target="_blank" rel="noreferrer">
              Open link
            </a>
          </div>
          <div className="spotlight-feedback">
            {copiedState === 'copied' ? <p className="success">Link copied to clipboard.</p> : null}
            {copiedState === 'error' ? <p className="error">Could not copy link. Please copy manually.</p> : null}
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