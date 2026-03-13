import Url from '../models/Url.js';
import Analytics from '../models/Analytics.js';

class AnalyticsService {
  /**
   * Get analytics for a specific URL
   * @param {string} urlId - URL ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} URL analytics data
   */
  async getUrlAnalytics(urlId, userId) {
    // Find the URL and verify ownership
    const url = await Url.findById(urlId);

    if (!url) {
      throw new Error('URL not found');
    }

    // Check if user owns this URL
    if (url.userId.toString() !== userId.toString()) {
      throw new Error('Not authorized to view analytics for this URL');
    }

    // Get all analytics for this URL
    const analytics = await Analytics.find({ urlId })
      .sort({ clickTimestamp: -1 })
      .select('clickTimestamp ipAddress userAgent referrer country');

    // Prepare data for charts
    const clicksByDate = {};
    const referrerCounts = {};
    const countryCounts = {};

    analytics.forEach((entry) => {
      // Group by date
      const date = entry.clickTimestamp.toISOString().split('T')[0];
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;

      // Count referrers
      referrerCounts[entry.referrer] = (referrerCounts[entry.referrer] || 0) + 1;

      // Count countries
      countryCounts[entry.country] = (countryCounts[entry.country] || 0) + 1;
    });

    // Format for Chart.js
    const clicksOverTime = {
      labels: Object.keys(clicksByDate).sort(),
      data: Object.keys(clicksByDate)
        .sort()
        .map((date) => clicksByDate[date])
    };

    const referrerData = {
      labels: Object.keys(referrerCounts),
      data: Object.values(referrerCounts)
    };

    const countryData = {
      labels: Object.keys(countryCounts),
      data: Object.values(countryCounts)
    };

    return {
      url: {
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        totalClicks: url.clicks,
        createdAt: url.createdAt,
        lastAccessedAt: url.lastAccessedAt
      },
      analytics: {
        totalEvents: analytics.length,
        clicksOverTime,
        referrerData,
        countryData,
        recentClicks: analytics.slice(0, 10)
      }
    };
  }

  /**
   * Get user's overall analytics dashboard
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Dashboard analytics data
   */
  async getDashboardAnalytics(userId) {
    // Get all URLs for the user
    const urls = await Url.find({ userId }).select(
      'originalUrl shortCode clicks createdAt lastAccessedAt'
    );

    // Calculate total clicks
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);

    // Get all analytics for user's URLs
    const urlIds = urls.map((url) => url._id);
    const analytics = await Analytics.find({ urlId: { $in: urlIds } }).sort({
      clickTimestamp: -1
    });

    // Find most popular URL
    const mostPopularUrl = urls.reduce(
      (max, url) => (url.clicks > (max?.clicks || 0) ? url : max),
      null
    );

    // Group clicks by date for the last 30 days
    const last30Days = {};
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      last30Days[dateStr] = 0;
    }

    // Count clicks in last 30 days
    analytics.forEach((entry) => {
      const date = entry.clickTimestamp.toISOString().split('T')[0];
      if (last30Days.hasOwnProperty(date)) {
        last30Days[date] += 1;
      }
    });

    // Top 5 URLs by clicks
    const topUrls = urls
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map((url) => ({
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks: url.clicks
      }));

    // Format for Chart.js
    const clicksOverTime = {
      labels: Object.keys(last30Days),
      data: Object.values(last30Days)
    };

    const topUrlsChart = {
      labels: topUrls.map((url) => url.shortCode),
      data: topUrls.map((url) => url.clicks)
    };

    // Referrer distribution across all URLs
    const referrerCounts = {};
    analytics.forEach((entry) => {
      referrerCounts[entry.referrer] = (referrerCounts[entry.referrer] || 0) + 1;
    });

    const referrerData = {
      labels: Object.keys(referrerCounts).slice(0, 10),
      data: Object.values(referrerCounts).slice(0, 10)
    };

    return {
      summary: {
        totalUrls: urls.length,
        totalClicks,
        mostPopularUrl: mostPopularUrl
          ? {
              shortCode: mostPopularUrl.shortCode,
              originalUrl: mostPopularUrl.originalUrl,
              clicks: mostPopularUrl.clicks
            }
          : null,
        recentUrls: urls.slice(0, 5).map((url) => ({
          shortCode: url.shortCode,
          originalUrl: url.originalUrl,
          clicks: url.clicks,
          createdAt: url.createdAt
        }))
      },
      charts: {
        clicksOverTime,
        topUrlsChart,
        referrerData
      }
    };
  }
}

export default new AnalyticsService();
