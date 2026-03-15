import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  username: '',
  email: '',
  password: ''
};

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');

    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const isRegister = mode === 'register';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }

      navigate('/');
    } catch (apiError) {
      const message =
        apiError.response?.data?.message ||
        apiError.response?.data?.errors?.[0]?.msg ||
        'Authentication failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <aside className="auth-hero">
        <h1>Make long links travel light.</h1>
        <p>
          NovaLink gives you short, elegant URLs with clear click analytics. Build, track, and
          optimize every link from one dashboard.
        </p>
      </aside>

      <section className="auth-panel">
        <div className="auth-panel-head">
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
            <span className="theme-switch-label">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </label>
        </div>

        <div className="tab-strip">
          <button
            type="button"
            className={`tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

          <form className="field" onSubmit={onSubmit}>
            {isRegister ? (
              <div className="field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  className="input"
                  value={form.username}
                  minLength={3}
                  maxLength={30}
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  required
                />
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="input"
                type="email"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="input"
                type="password"
                minLength={6}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                required
              />
            </div>

            {error ? <p className="error">{error}</p> : null}

            <button className="button button-primary" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
            </button>
        </form>
      </section>
    </div>
  );
}