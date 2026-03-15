import express from 'express';
import { body } from 'express-validator';
import urlController from '../controllers/urlController.js';
import { optionalProtect, protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/url/shorten
// @desc    Shorten a URL
// @access  Public (optionally linked to logged-in user)
router.post(
  '/shorten',
  optionalProtect,
  [
    body('originalUrl')
      .trim()
      .notEmpty()
      .withMessage('Original URL is required')
      .bail()
      .custom((value) => {
        const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;

        try {
          const parsed = new URL(candidate);
          if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            throw new Error('invalid protocol');
          }
          return true;
        } catch {
          throw new Error('Please provide a valid URL');
        }
      })
  ],
  urlController.shortenUrl
);

// @route   GET /api/url/user
// @desc    Get all URLs for logged-in user
// @access  Private
router.get('/user', protect, urlController.getUserUrls);

// @route   POST /api/url/claim
// @desc    Claim guest-created links for logged-in user
// @access  Private
router.post(
  '/claim',
  protect,
  [body('shortCodes').isArray({ min: 1 }).withMessage('shortCodes must be a non-empty array')],
  urlController.claimGuestLinks
);

// @route   DELETE /api/url/:id
// @desc    Delete a URL
// @access  Private
router.delete('/:id', protect, urlController.deleteUrl);

// @route   GET /:shortCode
// @desc    Redirect to original URL
// @access  Public
router.get('/:shortCode', urlController.redirectToOriginal);

export default router;
