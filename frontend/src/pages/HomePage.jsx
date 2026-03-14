import { useCallback, useEffect, useMemo, useState } from 'react';
import UrlShortenerForm from '../components/UrlShortenerForm.jsx';
import UrlList from '../components/UrlList.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteUrl, getUserUrls, shortenUrl } from '../services/urlApi.js';

export default function HomePage() {
  const { token } = useAuth();
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUrls = useCallback(async () => {
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
      setSuccess(response.message || 'Short link created');
      await loadUrls();
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
        <StatCard label="Total Links" value={urls.length} hint="Active short URLs" />
        <StatCard label="Total Clicks" value={totalClicks} hint="All-time tracked events" />
      </section>

      <UrlShortenerForm onSubmit={onCreate} isLoading={loading} />

      {error ? <p className="error">{error}</p> : null}
      {success ? <p className="success">{success}</p> : null}

      <UrlList urls={urls} onDelete={onDelete} />
    </>
  );
}