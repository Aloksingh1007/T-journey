import { Request, Response, NextFunction } from 'express';
import { emotionAnalysisService } from '../services/ai';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/errors.util';
import { analyticsService } from '../services/analytics.service';

/**
 * Analyze emotion for a specific trade
 * POST /api/ai/analyze-emotion
 */
export const analyzeTradeEmotion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { tradeId } = req.body;

    if (!tradeId) {
      throw new AppError('Trade ID is required', 400, 'VALIDATION_ERROR');
    }

    // Fetch trade with relations
    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: {
        notes: true,
        screenshots: true,
      },
    });

    if (!trade) {
      throw new AppError('Trade not found', 404, 'NOT_FOUND');
    }

    if (trade.userId !== userId) {
      throw new AppError('Unauthorized', 403, 'FORBIDDEN');
    }

    // Analyze emotion timeline
    const result = await emotionAnalysisService.analyzeEmotionTimeline(trade, userId);

    if (!result.success) {
      throw new AppError(result.error || 'Failed to analyze emotion', 500, 'AI_ERROR');
    }

    // Store AI insights in trade
    await prisma.trade.update({
      where: { id: tradeId },
      data: {
        aiInsights: result.data?.emotionalJourney,
        sentimentScore: result.data?.overallSentiment,
      },
    });

    // Store insight in analytics
    await analyticsService.storeInsight(
      userId,
      'emotion_timeline',
      result.data,
      { tradeId, confidence: 0.85 }
    );

    // Track analytics event
    await analyticsService.trackEvent(
      userId,
      'emotion_analyzed',
      { tradeId, tokensUsed: result.tokensUsed }
    );

    res.json({
      success: true,
      data: result.data,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get emotion patterns for user's trades
 * GET /api/ai/emotion-patterns
 */
export const getEmotionPatterns = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate, minTrades = 10 } = req.query;

    // Build query filters
    const where: any = { userId };

    if (startDate || endDate) {
      where.tradeDate = {};
      if (startDate) where.tradeDate.gte = new Date(startDate as string);
      if (endDate) where.tradeDate.lte = new Date(endDate as string);
    }

    // Fetch trades
    const trades = await prisma.trade.findMany({
      where,
      include: {
        notes: true,
        screenshots: true,
      },
      orderBy: { tradeDate: 'asc' },
    });

    if (trades.length < Number(minTrades)) {
      return res.json({
        success: true,
        data: {
          patterns: [],
          correlations: [],
          stressAnalysis: null,
          message: `Need at least ${minTrades} trades to detect patterns. You have ${trades.length} trades.`,
        },
      });
    }

    // Detect patterns
    const patternsResult = await emotionAnalysisService.detectEmotionalPatterns(trades, userId);

    // Calculate correlations
    const correlations = emotionAnalysisService.calculateEmotionPerformanceCorrelation(trades);

    // Analyze stress
    const stressAnalysis = emotionAnalysisService.analyzeStressPerformance(trades);

    // Store patterns in analytics
    if (patternsResult.data && patternsResult.data.length > 0) {
      for (const pattern of patternsResult.data) {
        await analyticsService.storeInsight(
          userId,
          'emotion_pattern',
          pattern,
          { confidence: pattern.frequency }
        );

        // Record pattern occurrences
        for (const exampleTradeId of pattern.examples) {
          const exampleTrade = trades.find(t => t.id === exampleTradeId);
          if (exampleTrade) {
            await analyticsService.recordPattern(
              userId,
              exampleTradeId,
              pattern.patternType,
              pattern.frequency,
              Number(exampleTrade.pnl) > 0 ? 'win' : 'loss',
              Number(exampleTrade.pnl),
              exampleTrade.emotionalState
            );
          }
        }
      }
    }

    // Track analytics event
    await analyticsService.trackEvent(
      userId,
      'patterns_analyzed',
      {
        patternsFound: patternsResult.data?.length || 0,
        totalTrades: trades.length,
      }
    );

    res.json({
      success: true,
      data: {
        patterns: patternsResult.data || [],
        correlations,
        stressAnalysis,
        totalTrades: trades.length,
      },
      tokensUsed: patternsResult.tokensUsed,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Get emotion timeline for a specific trade
 * GET /api/ai/emotion-timeline/:tradeId
 */
export const getEmotionTimeline = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { tradeId } = req.params;

    console.log(`[Emotion Timeline] User ${userId} requesting timeline for trade ${tradeId}`);

    // Fetch trade with relations
    const trade = await prisma.trade.findUnique({
      where: { id: tradeId },
      include: {
        notes: true,
        screenshots: true,
      },
    });

    if (!trade) {
      console.log(`[Emotion Timeline] Trade ${tradeId} not found`);
      throw new AppError('Trade not found', 404, 'NOT_FOUND');
    }

    console.log(`[Emotion Timeline] Checking authorization: trade.userId="${trade.userId}", authenticated userId="${userId}"`);
    
    if (trade.userId !== userId) {
      console.log(`[Emotion Timeline] Authorization failed: trade belongs to ${trade.userId}, requested by ${userId}`);
      throw new AppError('You do not have permission to access this trade', 403, 'FORBIDDEN');
    }

    console.log(`[Emotion Timeline] Trade found and authorized for user ${userId}`);

    // Check if we already have AI insights
    if (trade.aiInsights && trade.sentimentScore !== null) {
      // Extract key insights from notes and reflections
      const keyInsights: string[] = [];
      if (trade.keyLesson) keyInsights.push(trade.keyLesson);
      if (trade.whatWentWell) keyInsights.push(trade.whatWentWell);
      if (trade.wouldDoDifferently) keyInsights.push(trade.wouldDoDifferently);
      
      // Return cached timeline
      const timeline = {
        tradeId: trade.id,
        preTrade: {
          emotion: trade.emotionalState,
          confidence: trade.setupConfidence,
          hesitation: trade.hadHesitation,
          sentiment: getPreTradeSentiment(trade),
        },
        duringTrade: {
          stressLevel: trade.stressLevel,
          consideredEarlyExit: trade.consideredEarlyExit,
          sentiment: getDuringTradeSentiment(trade),
        },
        postTrade: {
          satisfaction: trade.exitSatisfaction,
          sentiment: getPostTradeSentiment(trade),
          keyInsights: keyInsights.slice(0, 3), // Limit to 3 insights
        },
        overallSentiment: Number(trade.sentimentScore),
        emotionalJourney: trade.aiInsights,
      };

      return res.json({
        success: true,
        data: timeline,
        cached: true,
      });
    }

    // Generate new timeline
    const result = await emotionAnalysisService.analyzeEmotionTimeline(trade, userId);

    if (!result.success) {
      throw new AppError(result.error || 'Failed to analyze emotion timeline', 500, 'AI_ERROR');
    }

    // Store AI insights
    await prisma.trade.update({
      where: { id: tradeId },
      data: {
        aiInsights: result.data?.emotionalJourney,
        sentimentScore: result.data?.overallSentiment,
      },
    });

    res.json({
      success: true,
      data: result.data,
      tokensUsed: result.tokensUsed,
      cached: false,
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Analyze sentiment of text
 * POST /api/ai/analyze-sentiment
 */
export const analyzeSentiment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.userId;
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      throw new AppError('Text is required', 400, 'VALIDATION_ERROR');
    }

    if (text.length > 5000) {
      throw new AppError('Text is too long (max 5000 characters)', 400, 'VALIDATION_ERROR');
    }

    const result = await emotionAnalysisService.analyzeSentiment(text, userId);

    if (!result.success) {
      throw new AppError(result.error || 'Failed to analyze sentiment', 500, 'AI_ERROR');
    }

    res.json({
      success: true,
      data: result.data,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    next(error);
  }
};


// Helper functions for sentiment calculation
function getPreTradeSentiment(trade: any): string {
  const confidence = trade.setupConfidence || 5;
  const hesitation = trade.hadHesitation;
  const impulsive = trade.isImpulsive;

  if (impulsive) return 'impulsive';
  if (hesitation) return 'uncertain';
  if (confidence >= 8) return 'confident';
  if (confidence <= 3) return 'doubtful';
  return 'neutral';
}

function getDuringTradeSentiment(trade: any): string {
  const stress = trade.stressLevel || 5;
  const consideredExit = trade.consideredEarlyExit;

  if (stress >= 8) return 'highly stressed';
  if (stress >= 6) return 'stressed';
  if (consideredExit) return 'anxious';
  if (stress <= 3) return 'calm';
  return 'moderate';
}

function getPostTradeSentiment(trade: any): string {
  const satisfaction = trade.exitSatisfaction || 5;
  const pnl = Number(trade.pnl);

  if (pnl > 0 && satisfaction >= 8) return 'very satisfied';
  if (pnl > 0 && satisfaction >= 6) return 'satisfied';
  if (pnl > 0 && satisfaction < 6) return 'won but unsatisfied';
  if (pnl < 0 && satisfaction >= 6) return 'lost but learned';
  if (pnl < 0 && satisfaction < 4) return 'disappointed';
  return 'neutral';
}
