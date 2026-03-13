import express from 'express';
import Url from '../models/Url.js';
import Analytics from '../models/Analytics.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/url/:urlId
// @desc    Get analytics for a specific URL
// @access  Private
router.get('/url/:urlId', protect, async (req, res) => {
  try {
    const { urlId } = req.params;

    // Find the URL and verify ownership
    const url = await Url.findById(urlId);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: 'URL not found'
      });
    }

    // Check if user owns this URL
    if (url.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics for this URL'
      });
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

    res.status(200).json({
      success: true,
      data: {
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
      }
    });
  } catch (error) {
    console.error('Get URL analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get user's overall analytics dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    // Get all URLs for the user
    const urls = await Url.find({ userId: req.user._id }).select(
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

    res.status(200).json({
      success: true,
      data: {
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
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard analytics'
    });
  }
});

export default router;
