import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import LinksPage from './pages/LinksPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import LockedSectionPage from './pages/LockedSectionPage.jsx';
import QrComingSoonPage from './pages/QrComingSoonPage.jsx';
import RedirectPage from './pages/RedirectPage.jsx';
import { useAuth } from './context/AuthContext.jsx';

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/auth" element={token ? <Navigate to="/" replace /> : <AuthPage />} />
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/analytics"
        element={
          <Layout>
            {token ? <AnalyticsPage /> : <LockedSectionPage sectionName="Analytics" />}
          </Layout>
        }
      />
      <Route
        path="/links"
        element={
          <Layout>
            {token ? <LinksPage /> : <LockedSectionPage sectionName="Links" />}
          </Layout>
        }
      />
      <Route
        path="/qr-codes"
        element={
          <Layout>
            <QrComingSoonPage />
          </Layout>
        }
      />
      <Route path="/:shortCode" element={<RedirectPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}