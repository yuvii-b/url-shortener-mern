import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { deleteUrl, getUserUrls } from '../services/urlApi.js';
import { formatDate, shortenText } from '../utils/formatters.js';

export default function LinksPage() {
  const { token } = useAuth();
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');

  const loadUrls = useCallback(async () => {
    try {
      setError('');
      const data = await getUserUrls(token);
      setUrls(data);
    } catch {
      setError('Failed to load links data');
    }
  }, [token]);

  useEffect(() => {
    loadUrls();
  }, [loadUrls]);

  const filteredUrls = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return urls;
    }

    return urls.filter(
      (item) =>
        item.shortCode.toLowerCase().includes(term) || item.originalUrl.toLowerCase().includes(term)
    );
  }, [urls, searchTerm]);

  const onCopy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.shortUrl);
      setCopiedId(item.id || item._id);
      setTimeout(() => setCopiedId(''), 1500);
    } catch {
      setCopiedId('');
    }
  };

  const onDelete = async (item) => {
    try {
      await deleteUrl(token, item.id || item._id);
      await loadUrls();
    } catch {
      setError('Failed to delete link');
    }
  };

  return (
    <section className="card links-page">
      <div className="links-page-header">
        <h2>Your links</h2>
        <Link className="button button-primary" to="/">
          Create link
        </Link>
      </div>

      <div className="links-toolbar">
        <input
          className="input"
          placeholder="Search links"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <div className="muted">Showing {filteredUrls.length} links</div>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <div className="links-list">
        {!filteredUrls.length ? (
          <div className="card">
            <p className="muted">No links found. Create a link to see data here.</p>
          </div>
        ) : null}

        {filteredUrls.map((item) => {
          const itemId = item.id || item._id;

          return (
            <article className="link-item-card" key={itemId}>
              <div className="link-item-content">
                <h3>{shortenText(item.originalUrl.replace(/^https?:\/\//, ''), 56)}</h3>
                <a className="mono short-link-text" href={item.shortUrl} target="_blank" rel="noreferrer">
                  {item.shortUrl}
                </a>
                <p className="muted">{shortenText(item.originalUrl, 110)}</p>
                <div className="link-meta muted">
                  <span>Created {formatDate(item.createdAt)}</span>
                  <span>{item.clicks} clicks</span>
                </div>
              </div>

              <div className="link-item-actions">
                <button className="button button-ghost" type="button" onClick={() => onCopy(item)}>
                  {copiedId === itemId ? 'Copied' : 'Copy'}
                </button>
                <Link className="button button-ghost" to="/analytics">
                  Analytics
                </Link>
                <button className="button button-ghost" type="button" onClick={() => onDelete(item)}>
                  Delete
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
