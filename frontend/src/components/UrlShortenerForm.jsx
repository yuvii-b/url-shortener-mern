import { useState } from 'react';

export default function UrlShortenerForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!url.trim()) {
      return;
    }

    await onSubmit(url.trim());
    setUrl('');
  };

  return (
    <section className="card">
      <h2>Create a short link</h2>
      <p className="muted">Paste a long URL and get a compact share link instantly.</p>
      <form onSubmit={handleSubmit} className="field-row">
        <input
          className="input"
          type="url"
          placeholder="https://example.com/very/long/path"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
        />
        <button className="button button-primary" disabled={isLoading} type="submit">
          {isLoading ? 'Shortening...' : 'Shorten'}
        </button>
      </form>
    </section>
  );
}