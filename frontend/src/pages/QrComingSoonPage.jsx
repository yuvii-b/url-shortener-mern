import { Link } from 'react-router-dom';

export default function QrComingSoonPage() {
  return (
    <section className="card locked-section">
      <div className="locked-mock-content" aria-hidden="true">
        <div className="locked-mock-row" />
        <div className="locked-mock-grid">
          <div className="locked-mock-card" />
          <div className="locked-mock-card" />
          <div className="locked-mock-card" />
        </div>
      </div>

      <div className="locked-overlay">
        <h2>QR Codes are coming soon</h2>
        <p className="muted">
          We are building QR code generation and tracking. You can keep creating links now and use
          QR features in an upcoming update.
        </p>
        <Link className="button button-primary" to="/">
          Back to shortener
        </Link>
      </div>
    </section>
  );
}
