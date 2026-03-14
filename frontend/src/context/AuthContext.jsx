import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      if (!token) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const data = await getCurrentUser(token);
        setUser(data);
      } catch {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    }

    bootstrap();
  }, [token]);

  const setAuthState = useCallback((authResponse) => {
    localStorage.setItem('token', authResponse.token);
    setToken(authResponse.token);
    setUser({
      _id: authResponse._id,
      username: authResponse.username,
      email: authResponse.email
    });
  }, []);

  const login = useCallback(
    async (payload) => {
      const response = await loginUser(payload);
      setAuthState(response);
      return response;
    },
    [setAuthState]
  );

  const register = useCallback(
    async (payload) => {
      const response = await registerUser(payload);
      setAuthState(response);
      return response;
    },
    [setAuthState]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, isBootstrapping, login, register, logout }),
    [token, user, isBootstrapping, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}