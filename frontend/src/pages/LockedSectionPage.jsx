import { Link } from 'react-router-dom';

export default function LockedSectionPage({ sectionName }) {
  return (
    <section className="card locked-section">
      <div className="locked-mock-content" aria-hidden="true">
        <div className="locked-mock-row" />
        <div className="locked-mock-row medium" />
        <div className="locked-mock-grid">
          <div className="locked-mock-card" />
          <div className="locked-mock-card" />
          <div className="locked-mock-card" />
        </div>
      </div>

      <div className="locked-overlay">
        <h2>{sectionName} is locked</h2>
        <p className="muted">Login or create an account to access this section and view your data.</p>
        <Link className="button button-primary" to="/auth">
          Login to continue
        </Link>
      </div>
    </section>
  );
}
