import { Request, Response } from 'express';
import { DashboardQuerySchema } from '../validators/dashboard.validator';
import * as dashboardService from '../services/dashboard.service';

/**
 * Get dashboard statistics
 * GET /api/dashboard/stats
 */
export async function getDashboardStatsHandler(req: Request, res: Response) {
  try {
    // Validate query parameters
    const validatedQuery = DashboardQuerySchema.parse(req.query);

    // Get user ID from authenticated request
    const userId = req.user!.userId;

    // Calculate dashboard statistics
    const stats = await dashboardService.calculateDashboardStats(
      userId,
      validatedQuery
    );

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: error.errors,
        },
      });
    }

    console.error('Error fetching dashboard stats:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch dashboard statistics',
      },
    });
  }
}

/**
 * Get calendar data
 * GET /api/dashboard/calendar
 */
export async function getCalendarDataHandler(req: Request, res: Response) {
  try {
    // Validate query parameters
    const validatedQuery = DashboardQuerySchema.parse(req.query);

    // Get user ID from authenticated request
    const userId = req.user!.userId;

    // Get calendar data
    const calendarData = await dashboardService.getCalendarData(
      userId,
      validatedQuery
    );

    return res.status(200).json({
      success: true,
      data: calendarData,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: error.errors,
        },
      });
    }

    console.error('Error fetching calendar data:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch calendar data',
      },
    });
  }
}

/**
 * Get recent trades
 * GET /api/dashboard/recent-trades
 */
export async function getRecentTradesHandler(req: Request, res: Response) {
  try {
    const userId = req.user!.userId;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;

    const recentTrades = await dashboardService.getRecentTrades(userId, limit);

    return res.status(200).json({
      success: true,
      data: recentTrades,
    });
  } catch (error: any) {
    console.error('Error fetching recent trades:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch recent trades',
      },
    });
  }
}

/**
 * Get currency-specific dashboard statistics
 * GET /api/dashboard/stats/:currency
 */
export async function getCurrencySpecificStatsHandler(req: Request, res: Response) {
  try {
    const currency = req.params.currency as 'INR' | 'USD';
    
    // Validate currency parameter
    if (!['INR', 'USD'].includes(currency)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid currency. Must be INR or USD',
        },
      });
    }

    // Validate query parameters
    const validatedQuery = DashboardQuerySchema.parse(req.query);

    // Get user ID from authenticated request
    const userId = req.user!.userId;

    // Calculate currency-specific statistics
    const stats = await dashboardService.calculateCurrencySpecificStats(
      userId,
      currency,
      validatedQuery
    );

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: error.errors,
        },
      });
    }

    console.error('Error fetching currency-specific stats:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch currency-specific statistics',
      },
    });
  }
}
