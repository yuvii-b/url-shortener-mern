import { useCallback, useEffect, useMemo, useState } from 'react';
import ChartPanel from '../components/ChartPanel.jsx';
import StatCard from '../components/StatCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getDashboardAnalytics, getUrlAnalytics } from '../services/analyticsApi.js';
import { getUserUrls } from '../services/urlApi.js';
import { shortenText } from '../utils/formatters.js';

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [urls, setUrls] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [urlAnalytics, setUrlAnalytics] = useState(null);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(
    async ({ silent = false } = {}) => {
      if (!silent) {
        setError('');
      }

      try {
        const [dashboardData, urlsData] = await Promise.all([
          getDashboardAnalytics(token),
          getUserUrls(token)
        ]);

        setDashboard(dashboardData);
        setUrls(urlsData);
        setSelectedUrlId((current) => {
          if (!urlsData.length) {
            return '';
          }

          if (current && urlsData.some((item) => (item.id || item._id) === current)) {
            return current;
          }

          return urlsData[0].id || urlsData[0]._id;
        });
      } catch {
        if (!silent) {
          setError('Failed to load analytics dashboard');
        }
      }
    },
    [token]
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const refresh = () => {
      loadDashboard({ silent: true });
    };

    const intervalId = window.setInterval(refresh, 15000);

    const onFocus = () => {
      refresh();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [loadDashboard]);

  useEffect(() => {
    async function loadUrlAnalytics() {
      if (!selectedUrlId) {
        setUrlAnalytics(null);
        return;
      }

      try {
        const details = await getUrlAnalytics(token, selectedUrlId);
        setUrlAnalytics(details);
      } catch {
        setError('Failed to load URL analytics');
      }
    }

    loadUrlAnalytics();
  }, [token, selectedUrlId]);

  const topUrlHint = useMemo(() => {
    const top = dashboard?.summary?.mostPopularUrl;
    if (!top) {
      return 'No click data yet';
    }

    return `${top.shortCode} (${top.clicks} clicks)`;
  }, [dashboard]);

  return (
    <>
      {error ? <p className="error">{error}</p> : null}

      <section className="grid-3">
        <StatCard label="Tracked URLs" value={dashboard?.summary?.totalUrls ?? 0} />
        <StatCard label="Total Clicks" value={dashboard?.summary?.totalClicks ?? 0} />
        <StatCard label="Top Performer" value={topUrlHint} />
      </section>

      <section className="card field">
        <h2>Inspect a specific URL</h2>
        <select
          className="select"
          value={selectedUrlId}
          onChange={(event) => setSelectedUrlId(event.target.value)}
          disabled={!urls.length}
        >
          {!urls.length ? <option value="">No URLs available</option> : null}
          {urls.map((item) => (
            <option key={item.id || item._id} value={item.id || item._id}>
              {item.shortCode} - {shortenText(item.originalUrl, 52)}
            </option>
          ))}
        </select>
      </section>

      <section className="split">
        <ChartPanel
          title="Last 30 days clicks"
          kind="line"
          labels={dashboard?.charts?.clicksOverTime?.labels || []}
          data={dashboard?.charts?.clicksOverTime?.data || []}
          color="#1f7a75"
        />
        <ChartPanel
          title="Top URLs"
          kind="bar"
          labels={dashboard?.charts?.topUrlsChart?.labels || []}
          data={dashboard?.charts?.topUrlsChart?.data || []}
          color="#e86f2d"
        />
      </section>

      <section className="split">
        <ChartPanel
          title="Referrers"
          kind="pie"
          labels={urlAnalytics?.analytics?.referrerData?.labels || []}
          data={urlAnalytics?.analytics?.referrerData?.data || []}
          color="#1f7a75"
        />
        <ChartPanel
          title="Countries"
          kind="bar"
          labels={urlAnalytics?.analytics?.countryData?.labels || []}
          data={urlAnalytics?.analytics?.countryData?.data || []}
          color="#b8511d"
        />
      </section>
    </>
  );
}