import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

/**
 * All dashboard routes require authentication
 */

// Get dashboard statistics
router.get('/stats', authMiddleware, dashboardController.getDashboardStatsHandler);

// Get currency-specific statistics
router.get('/stats/:currency', authMiddleware, dashboardController.getCurrencySpecificStatsHandler);

// Get calendar data
router.get('/calendar', authMiddleware, dashboardController.getCalendarDataHandler);

// Get recent trades
router.get('/recent-trades', authMiddleware, dashboardController.getRecentTradesHandler);

export default router;
