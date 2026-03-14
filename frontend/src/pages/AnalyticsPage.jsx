import { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    async function loadInitial() {
      setError('');
      try {
        const [dashboardData, urlsData] = await Promise.all([
          getDashboardAnalytics(token),
          getUserUrls(token)
        ]);

        setDashboard(dashboardData);
        setUrls(urlsData);
        if (urlsData.length) {
          setSelectedUrlId(urlsData[0].id || urlsData[0]._id);
        }
      } catch {
        setError('Failed to load analytics dashboard');
      }
    }

    loadInitial();
  }, [token]);

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