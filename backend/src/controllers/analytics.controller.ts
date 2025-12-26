import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service';
import { AppError } from '../utils/errors.util';

/**
 * Get aggregate statistics
 * GET /api/analytics/stats
 */
export const getAggregateStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      throw new AppError('Start date and end date are required', 400, 'VALIDATION_ERROR');
    }

    const stats = await analyticsService.getAggregateStats(
      new Date(startDate as string),
      new Date(endDate as string)
    );

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's insights
 * GET /api/analytics/insights
 */
export const getUserInsights = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { limit = 10 } = req.query;

    const insights = await analyticsService.getUserInsights(
      userId,
      Number(limit)
    );

    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get user's pattern history
 * GET /api/analytics/patterns
 */
export const getUserPatterns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { patternType, limit = 50 } = req.query;

    const patterns = await analyticsService.getUserPatterns(
      userId,
      patternType as string,
      Number(limit)
    );

    res.json({
      success: true,
      data: patterns,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record insight feedback
 * POST /api/analytics/insights/:id/feedback
 */
export const recordInsightFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { wasHelpful, feedback, actionTaken } = req.body;

    if (typeof wasHelpful !== 'boolean') {
      throw new AppError('wasHelpful must be a boolean', 400, 'VALIDATION_ERROR');
    }

    await analyticsService.recordInsightFeedback(
      id,
      wasHelpful,
      feedback,
      actionTaken
    );

    res.json({
      success: true,
      message: 'Feedback recorded',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit user feedback
 * POST /api/analytics/feedback
 */
export const submitFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { feedbackType, message, rating, context } = req.body;

    if (!feedbackType || !message) {
      throw new AppError('Feedback type and message are required', 400, 'VALIDATION_ERROR');
    }

    await analyticsService.submitFeedback(
      userId,
      feedbackType,
      message,
      { rating, context }
    );

    res.json({
      success: true,
      message: 'Feedback submitted',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Track custom event
 * POST /api/analytics/track
 */
export const trackEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { eventType, eventData } = req.body;

    if (!eventType) {
      throw new AppError('Event type is required', 400, 'VALIDATION_ERROR');
    }

    await analyticsService.trackEvent(userId, eventType, eventData);

    res.json({
      success: true,
      message: 'Event tracked',
    });
  } catch (error) {
    next(error);
  }
};
