import { Router } from 'express';
import {
  getAggregateStats,
  getUserInsights,
  getUserPatterns,
  recordInsightFeedback,
  submitFeedback,
  trackEvent,
} from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/analytics/stats - Get aggregate statistics (admin only in production)
router.get('/stats', getAggregateStats);

// GET /api/analytics/insights - Get user's insights
router.get('/insights', getUserInsights);

// GET /api/analytics/patterns - Get user's pattern history
router.get('/patterns', getUserPatterns);

// POST /api/analytics/insights/:id/feedback - Record insight feedback
router.post('/insights/:id/feedback', recordInsightFeedback);

// POST /api/analytics/feedback - Submit user feedback
router.post('/feedback', submitFeedback);

// POST /api/analytics/track - Track custom event
router.post('/track', trackEvent);

export default router;
