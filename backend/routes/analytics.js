import express from 'express';
import analyticsController from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/analytics/url/:urlId
// @desc    Get analytics for a specific URL
// @access  Private
router.get('/url/:urlId', protect, analyticsController.getUrlAnalytics);

// @route   GET /api/analytics/dashboard
// @desc    Get user's overall analytics dashboard
// @access  Private
router.get('/dashboard', protect, analyticsController.getDashboard);

export default router;
