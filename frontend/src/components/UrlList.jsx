import { Link } from 'react-router-dom';
import { formatDate, shortenText } from '../utils/formatters.js';

export default function UrlList({ urls, onDelete }) {
  if (!urls.length) {
    return (
      <section className="card">
        <h2>Your links</h2>
        <p className="muted">No links yet. Create your first short URL above.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Your links</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Short</th>
            <th>Destination</th>
            <th>Clicks</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((item) => (
            <tr key={item.id || item._id}>
              <td className="mono">{item.shortCode}</td>
              <td title={item.originalUrl}>{shortenText(item.originalUrl, 52)}</td>
              <td>
                <span className="tag">{item.clicks}</span>
              </td>
              <td>{formatDate(item.createdAt)}</td>
              <td>
                <div className="field-row">
                  <button
                    className="button button-ghost"
                    type="button"
                    onClick={() => navigator.clipboard.writeText(item.shortUrl)}
                  >
                    Copy
                  </button>
                  <Link className="button button-ghost" to="/analytics">
                    Analytics
                  </Link>
                  <button
                    className="button button-ghost"
                    type="button"
                    onClick={() => onDelete(item.id || item._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}