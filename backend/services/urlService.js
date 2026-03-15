import Url from '../models/Url.js';
import Analytics from '../models/Analytics.js';
import { generateUniqueShortCode } from '../utils/hashGenerator.js';
import analyticsService from './analyticsService.js';

class UrlService {
  /**
   * Shorten a URL
   * @param {string} originalUrl - Original URL to shorten
    * @param {string|null} userId - User ID for authenticated users, null for guests
   * @returns {Promise<Object>} Created URL
   */
    async shortenUrl(originalUrl, userId = null) {
    // Ensure URL has protocol
    let formattedUrl = originalUrl;
    if (!originalUrl.startsWith('http://') && !originalUrl.startsWith('https://')) {
      formattedUrl = 'https://' + originalUrl;
    }

    // Check if URL already exists for this user
    const ownershipQuery = userId ? { userId } : { userId: null };
    const existingUrl = await Url.findOne({ originalUrl: formattedUrl, ...ownershipQuery });

    if (existingUrl) {
      return { url: existingUrl, isNew: false };
    }

    // Generate unique short code
    const checkExistence = async (code) => {
      const url = await Url.findOne({ shortCode: code });
      return !!url;
    };

    const shortCode = await generateUniqueShortCode(checkExistence);

    // Create new URL
    const url = await Url.create({
      originalUrl: formattedUrl,
      shortCode,
      userId: userId || null
    });

    return { url, isNew: true };
  }

  /**
   * Get all URLs for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} List of URLs
   */
  async getUserUrls(userId) {
    const urls = await Url.find({ userId })
      .sort({ createdAt: -1 })
      .select('originalUrl shortCode clicks createdAt lastAccessedAt');

    return urls;
  }

  /**
   * Claim guest-created links for an authenticated user
   * @param {string} userId - User ID
   * @param {string[]} shortCodes - Guest short codes
   * @returns {Promise<{claimedCount:number,claimedShortCodes:string[]}>}
   */
  async claimGuestLinks(userId, shortCodes = []) {
    const normalizedCodes = [...new Set(shortCodes.filter((code) => typeof code === 'string'))].slice(
      0,
      100
    );

    if (!normalizedCodes.length) {
      return { claimedCount: 0, claimedShortCodes: [] };
    }

    const guestUrls = await Url.find({
      shortCode: { $in: normalizedCodes },
      userId: null
    }).select('_id shortCode');

    if (!guestUrls.length) {
      return { claimedCount: 0, claimedShortCodes: [] };
    }

    const guestUrlIds = guestUrls.map((url) => url._id);
    const claimedShortCodes = guestUrls.map((url) => url.shortCode);

    await Url.updateMany(
      {
        _id: { $in: guestUrlIds },
        userId: null
      },
      {
        $set: { userId }
      }
    );

    return {
      claimedCount: claimedShortCodes.length,
      claimedShortCodes
    };
  }

  /**
   * Delete a URL
   * @param {string} urlId - URL ID
   * @param {string} userId - User ID
   * @returns {Promise<void>}
   */
  async deleteUrl(urlId, userId) {
    const url = await Url.findById(urlId);

    if (!url) {
      throw new Error('URL not found');
    }

    // Check if user owns this URL
    if (url.userId.toString() !== userId.toString()) {
      throw new Error('Not authorized to delete this URL');
    }

    await Url.findByIdAndDelete(urlId);

    // Also delete associated analytics
    await Analytics.deleteMany({ urlId });
  }

  /**
   * Get URL by short code and track analytics
   * @param {string} shortCode - Short code
   * @param {Object} analyticsData - Analytics data (IP, user agent, referrer)
   * @returns {Promise<Object>} URL data
   */
  async getUrlByShortCode(shortCode, analyticsData) {
    // Find URL by short code
    const url = await Url.findOne({ shortCode });

    if (!url) {
      throw new Error('URL not found');
    }

    // Update click count and last accessed
    url.clicks += 1;
    url.lastAccessedAt = new Date();
    await url.save();

    // Log analytics via service to keep tracking behavior centralized
    await analyticsService.trackClickEvent(url._id, analyticsData);

    return url;
  }
}

export default new UrlService();
