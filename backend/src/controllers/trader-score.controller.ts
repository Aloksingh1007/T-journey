import { Request, Response, NextFunction } from 'express';
import { traderScoreService } from '../services/trader-score.service';

/**
 * Get overall trader score
 * GET /api/scores/overall
 */
export const getOverallScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const scoreBreakdown = await traderScoreService.calculateScore(userId);
    const level = traderScoreService.getTraderLevel(scoreBreakdown.overall);

    res.json({
      success: true,
      data: {
        score: scoreBreakdown.overall,
        level,
      },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get detailed score breakdown
 * GET /api/scores/breakdown
 */
export const getScoreBreakdown = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const scoreBreakdown = await traderScoreService.calculateScore(userId);

    res.json({
      success: true,
      data: scoreBreakdown,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get trader level information
 * GET /api/scores/level
 */
export const getTraderLevel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const scoreBreakdown = await traderScoreService.calculateScore(userId);
    const level = traderScoreService.getTraderLevel(scoreBreakdown.overall);

    res.json({
      success: true,
      data: level,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Recalculate trader score
 * POST /api/scores/recalculate
 */
export const recalculateScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    const scoreBreakdown = await traderScoreService.calculateScore(userId);
    const level = traderScoreService.getTraderLevel(scoreBreakdown.overall);

    res.json({
      success: true,
      data: {
        score: scoreBreakdown.overall,
        breakdown: scoreBreakdown,
        level,
      },
      message: 'Score recalculated successfully',
    });
  } catch (error) {
    return next(error);
  }
};
