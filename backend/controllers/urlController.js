import { validationResult } from 'express-validator';
import urlService from '../services/urlService.js';

class UrlController {
  /**
   * Shorten a URL
   * @route   POST /api/url/shorten
   * @access  Private
   */
  async shortenUrl(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { originalUrl } = req.body;

      // Call service to shorten URL
      const { url, isNew } = await urlService.shortenUrl(originalUrl, req.user._id);

      const response = {
        success: true,
        message: isNew ? 'URL shortened successfully' : 'URL already shortened',
        data: {
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
          clicks: url.clicks,
          createdAt: url.createdAt
        }
      };

      res.status(isNew ? 201 : 200).json(response);
    } catch (error) {
      console.error('Shorten URL error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while shortening URL'
      });
    }
  }

  /**
   * Get all URLs for logged-in user
   * @route   GET /api/url/user
   * @access  Private
   */
  async getUserUrls(req, res) {
    try {
      const urls = await urlService.getUserUrls(req.user._id);

      const urlsWithFullPath = urls.map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastAccessedAt: url.lastAccessedAt
      }));

      res.status(200).json({
        success: true,
        count: urlsWithFullPath.length,
        data: urlsWithFullPath
      });
    } catch (error) {
      console.error('Get user URLs error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error while fetching URLs'
      });
    }
  }

  /**
   * Delete a URL
   * @route   DELETE /api/url/:id
   * @access  Private
   */
  async deleteUrl(req, res) {
    try {
      await urlService.deleteUrl(req.params.id, req.user._id);

      res.status(200).json({
        success: true,
        message: 'URL deleted successfully'
      });
    } catch (error) {
      console.error('Delete URL error:', error);

      if (error.message === 'URL not found') {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      if (error.message === 'Not authorized to delete this URL') {
        return res.status(403).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error while deleting URL'
      });
    }
  }

  /**
   * Redirect to original URL
   * @route   GET /:shortCode
   * @access  Public
   */
  async redirectToOriginal(req, res) {
    try {
      const { shortCode } = req.params;

      const analyticsData = {
        ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
        userAgent: req.get('user-agent') || 'unknown',
        referrer: req.get('referrer') || 'direct'
      };

      const url = await urlService.getUrlByShortCode(shortCode, analyticsData);

      // Redirect to original URL
      res.redirect(url.originalUrl);
    } catch (error) {
      console.error('Redirect error:', error);

      if (error.message === 'URL not found') {
        return res.status(404).json({
          success: false,
          message: 'URL not found'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Server error during redirection'
      });
    }
  }
}

export default new UrlController();
