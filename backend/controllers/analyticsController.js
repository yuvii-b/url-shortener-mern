import analyticsService from '../services/analyticsService.js';

class AnalyticsController {
  /**
   * Get analytics for a specific URL
   * @route   GET /api/analytics/url/:urlId
   * @access  Private
   */
  async getUrlAnalytics(req, res) {
    try {
      const { urlId } = req.params;

      const data = await analyticsService.getUrlAnalytics(urlId, req.user._id);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get URL analytics error:', error);

      if (error.message === 'URL not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Not authorized to view analytics for this URL') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error while fetching analytics'
      });
    }
  }

  /**
   * Get user's overall analytics dashboard
   * @route   GET /api/analytics/dashboard
   * @access  Private
   */
  async getDashboard(req, res) {
    try {
      const data = await analyticsService.getDashboardAnalytics(req.user._id);

      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Get dashboard analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching dashboard analytics'
      });
    }
  }
}

export default new AnalyticsController();
