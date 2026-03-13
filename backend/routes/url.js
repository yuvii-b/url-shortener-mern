import express from 'express';
import { body } from 'express-validator';
import urlController from '../controllers/urlController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/url/shorten
// @desc    Shorten a URL
// @access  Private
router.post(
  '/shorten',
  protect,
  [body('originalUrl').trim().isURL().withMessage('Please provide a valid URL')],
  urlController.shortenUrl
);

// @route   GET /api/url/user
// @desc    Get all URLs for logged-in user
// @access  Private
router.get('/user', protect, urlController.getUserUrls);

// @route   DELETE /api/url/:id
// @desc    Delete a URL
// @access  Private
router.delete('/:id', protect, urlController.deleteUrl);

// @route   GET /:shortCode
// @desc    Redirect to original URL
// @access  Public
router.get('/:shortCode', urlController.redirectToOriginal);

export default router;
