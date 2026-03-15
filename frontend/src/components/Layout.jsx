import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="app-shell">
      <header className="surface top-nav">
        <div className="brand">
          <span className="brand-mark" />
          <span>NovaLink</span>
        </div>

        <nav className="nav-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Shortener
          </NavLink>

          {user ? (
            <>
              <NavLink
                to="/analytics"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Analytics
              </NavLink>
              <span className="muted">@{user.username}</span>
              <button type="button" className="button button-ghost" onClick={onLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <span className="muted">Login required for analytics</span>
              <NavLink to="/auth" className="button button-primary">
                Login / Register
              </NavLink>
            </>
          )}
        </nav>
      </header>

      <main className="page-grid">{children}</main>
    </div>
  );
}