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
          <NavLink
            to="/analytics"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Analytics
          </NavLink>
          <span className="muted">@{user?.username}</span>
          <button type="button" className="button button-ghost" onClick={onLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className="page-grid">{children}</main>
    </div>
  );
}