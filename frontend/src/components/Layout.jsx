import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function MenuIcon({ type }) {
  const commonProps = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  if (type === 'home') {
    return (
      <svg {...commonProps}>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    );
  }

  if (type === 'link') {
    return (
      <svg {...commonProps}>
        <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L10 5" />
        <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L14 18" />
      </svg>
    );
  }

  if (type === 'qr') {
    return (
      <svg {...commonProps}>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <path d="M14 14h3v3h-3z" />
        <path d="M20 14v6" />
        <path d="M17 20h4" />
      </svg>
    );
  }

  if (type === 'user') {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.8-3.2 4.5-5 8-5s6.2 1.8 8 5" />
      </svg>
    );
  }

  if (type === 'logout') {
    return (
      <svg {...commonProps}>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M4 20V9" />
      <path d="M10 20V4" />
      <path d="M16 20v-8" />
      <path d="M22 20V12" />
    </svg>
  );
}

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const onLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className={`app-shell app-shell-with-sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`surface side-nav ${collapsed ? 'collapsed' : ''}`}>
        <button
          type="button"
          className="collapse-toggle"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '>' : '<'}
        </button>

        <div className="brand side-brand">
          <img src="/favicon.svg" alt="NovaLink" className="brand-favicon" />
          {!collapsed ? <span>NovaLink</span> : null}
        </div>

        <button type="button" className="button create-button" onClick={() => navigate('/')}>
          {collapsed ? '+' : 'Create new'}
        </button>

        <div className="divider-line" />

        <nav className="menu-list">
          <NavLink to="/" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <span className="menu-icon">
              <MenuIcon type="home" />
            </span>
            {!collapsed ? <span>Home</span> : null}
          </NavLink>

          <NavLink
            to="/links"
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''} ${!user ? 'locked' : ''}`}
          >
            <span className="menu-icon">
              <MenuIcon type="link" />
            </span>
            {!collapsed ? <span>Links</span> : null}
            {!user && !collapsed ? <span className="lock-badge">Login</span> : null}
          </NavLink>

          <NavLink to="/qr-codes" className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}>
            <span className="menu-icon">
              <MenuIcon type="qr" />
            </span>
            {!collapsed ? <span>QR Codes</span> : null}
            {!collapsed ? <span className="lock-badge">Soon</span> : null}
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) => `menu-item ${isActive ? 'active' : ''} ${!user ? 'locked' : ''}`}
          >
            <span className="menu-icon">
              <MenuIcon type="analytics" />
            </span>
            {!collapsed ? <span>Analytics</span> : null}
            {!user && !collapsed ? <span className="lock-badge">Login</span> : null}
          </NavLink>
        </nav>

        <div className="side-footer">
          {user ? (
            <>
              {!collapsed ? <div className="muted">Signed in as @{user.username}</div> : null}
              <button
                type="button"
                className={`button button-ghost ${collapsed ? 'side-auth-icon' : ''}`}
                onClick={onLogout}
                title="Logout"
                aria-label="Logout"
              >
                {collapsed ? <MenuIcon type="logout" /> : 'Logout'}
              </button>
            </>
          ) : (
            <NavLink
              to="/auth"
              className={`button button-primary ${collapsed ? 'side-auth-icon' : ''}`}
              title="Login / Register"
              aria-label="Login or Register"
            >
              {collapsed ? <MenuIcon type="user" /> : 'Login / Register'}
            </NavLink>
          )}
        </div>
      </aside>

      <section className="content-shell">
        <header className="surface top-nav">
          <div>
            <h1 className="page-title">Create and share short links</h1>
            <p className="muted">Shorten instantly. Login only when you want analytics.</p>
          </div>
          <label
            className="theme-switch"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <input
              type="checkbox"
              checked={theme === 'dark'}
              onChange={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            />
            <span className="theme-slider" />
            <span className="theme-switch-label">
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </span>
          </label>
        </header>

        <main className="page-grid">{children}</main>
      </section>
    </div>
  );
}