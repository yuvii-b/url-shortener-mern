import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ children }) {
  const { token, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="app-shell">
        <div className="surface card">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}