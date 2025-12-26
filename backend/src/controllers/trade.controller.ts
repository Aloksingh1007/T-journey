import { Request, Response } from 'express';
import {
  CreateTradeSchema,
  UpdateTradeSchema,
  GetTradesQuerySchema,
} from '../validators/trade.validator';
import * as tradeService from '../services/trade.service';
import { NotFoundError } from '../utils/errors.util';
import { asyncHandler } from '../middleware/error.middleware';
import { analyticsService } from '../services/analytics.service';
import { emotionAnalysisService } from '../services/ai';

/**
 * Create a new trade
 * POST /api/trades
 */
export const createTradeHandler = asyncHandler(async (req: Request, res: Response) => {
  // Validate request body
  const validatedData = CreateTradeSchema.parse(req.body);

  // Get user ID from authenticated request
  const userId = req.user!.userId;

  // Check if emotion analysis should be performed (optional query param)
  const analyzeEmotion = req.query.analyzeEmotion === 'true';

  // Create trade
  const trade = await tradeService.createTrade(userId, validatedData);

  // Track analytics event
  await analyticsService.trackEvent(
    userId,
    'trade_created',
    {
      tradeId: trade.id,
      tradeType: trade.tradeType,
      emotionalState: trade.emotionalState,
      isImpulsive: trade.isImpulsive,
      pnl: Number(trade.pnl),
    }
  );

  // Optionally perform emotion analysis on trade creation
  let emotionAnalysis = null;
  if (analyzeEmotion && emotionAnalysisService.isAvailable()) {
    try {
      // Perform emotion analysis in background (don't block response)
      const analysisResult = await emotionAnalysisService.analyzeEmotionTimeline(trade, userId);
      
      if (analysisResult.success && analysisResult.data) {
        // Store AI insights in trade
        await tradeService.updateTradeAIInsights(
          trade.id,
          analysisResult.data.emotionalJourney,
          analysisResult.data.overallSentiment
        );

        // Store insight in analytics
        await analyticsService.storeInsight(
          userId,
          'emotion_timeline',
          analysisResult.data,
          { tradeId: trade.id, confidence: 0.85 }
        );

        emotionAnalysis = analysisResult.data;
      }
    } catch (error) {
      // Log error but don't fail trade creation
      console.error('Failed to analyze emotion on trade creation:', error);
    }
  }

  res.status(201).json({
    success: true,
    data: trade,
    emotionAnalysis,
  });
});

/**
 * Get all trades with filters
 * GET /api/trades
 */
export const getTradesHandler = asyncHandler(async (req: Request, res: Response) => {
  // Validate query parameters
  const validatedQuery = GetTradesQuerySchema.parse(req.query);

  // Get user ID from authenticated request
  const userId = req.user!.userId;

  // Get trades
  const result = await tradeService.getTrades(userId, validatedQuery);

  res.status(200).json({
    success: true,
    data: result.trades,
    pagination: {
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    },
  });
});

/**
 * Get a single trade by ID
 * GET /api/trades/:id
 */
export const getTradeByIdHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  // Get trade
  const trade = await tradeService.getTradeById(userId, id);

  if (!trade) {
    throw new NotFoundError('Trade not found');
  }

  res.status(200).json({
    success: true,
    data: trade,
  });
});

/**
 * Update a trade
 * PUT /api/trades/:id
 */
export const updateTradeHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  // Validate request body
  const validatedData = UpdateTradeSchema.parse(req.body);

  // Update trade
  const trade = await tradeService.updateTrade(userId, id, validatedData);

  if (!trade) {
    throw new NotFoundError('Trade not found');
  }

  res.status(200).json({
    success: true,
    data: trade,
  });
});

/**
 * Delete a trade
 * DELETE /api/trades/:id
 */
export const deleteTradeHandler = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  // Delete trade
  const trade = await tradeService.deleteTrade(userId, id);

  if (!trade) {
    throw new NotFoundError('Trade not found');
  }

  res.status(200).json({
    success: true,
    message: 'Trade deleted successfully',
  });
});
