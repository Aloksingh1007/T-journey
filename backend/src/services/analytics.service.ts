import prisma from '../utils/prisma';

/**
 * Analytics Service for tracking events and storing insights
 */
export class AnalyticsService {
  /**
   * Track any user event
   */
  async trackEvent(
    userId: string,
    eventType: string,
    eventData: any = {},
    sessionId?: string,
    metadata?: {
      ipAddress?: string;
      userAgent?: string;
    }
  ): Promise<void> {
    try {
      await prisma.analyticsEvent.create({
        data: {
          userId,
          eventType,
          eventData,
          sessionId,
          ipAddress: metadata?.ipAddress,
          userAgent: metadata?.userAgent,
          timestamp: new Date(),
        },
      });
      
      console.log(`[Analytics] Event tracked: ${eventType} for user ${userId}`);
    } catch (error) {
      // Don't throw - analytics failures shouldn't break the app
      console.error('[Analytics] Failed to track event:', error);
    }
  }

  /**
   * Store AI-generated insight
   */
  async storeInsight(
    userId: string,
    insightType: string,
    insightData: any,
    options?: {
      tradeId?: string;
      confidence?: number;
      wasShown?: boolean;
    }
  ): Promise<string> {
    try {
      const insight = await prisma.aIInsight.create({
        data: {
          userId,
          tradeId: options?.tradeId,
          insightType,
          insightData,
          confidence: options?.confidence,
          wasShown: options?.wasShown ?? true,
          timestamp: new Date(),
        },
      });

      console.log(`[Analytics] Insight stored: ${insightType} for user ${userId}`);
      return insight.id;
    } catch (error) {
      console.error('[Analytics] Failed to store insight:', error);
      throw error;
    }
  }

  /**
   * Record user feedback on an insight
   */
  async recordInsightFeedback(
    insightId: string,
    wasHelpful: boolean,
    feedback?: string,
    actionTaken?: string
  ): Promise<void> {
    try {
      await prisma.aIInsight.update({
        where: { id: insightId },
        data: {
          wasHelpful,
          userFeedback: feedback,
          actionTaken,
        },
      });

      console.log(`[Analytics] Insight feedback recorded: ${insightId}`);
    } catch (error) {
      console.error('[Analytics] Failed to record insight feedback:', error);
    }
  }

  /**
   * Record pattern occurrence
   */
  async recordPattern(
    userId: string,
    tradeId: string,
    patternType: string,
    severity: number,
    outcome: string,
    pnl: number,
    emotionalState: string,
    options?: {
      wasWarned?: boolean;
      warningHeeded?: boolean;
    }
  ): Promise<void> {
    try {
      await prisma.patternOccurrence.create({
        data: {
          userId,
          tradeId,
          patternType,
          severity,
          outcome,
          pnl,
          emotionalState,
          wasWarned: options?.wasWarned ?? false,
          warningHeeded: options?.warningHeeded,
          timestamp: new Date(),
        },
      });

      console.log(`[Analytics] Pattern recorded: ${patternType} for trade ${tradeId}`);
    } catch (error) {
      console.error('[Analytics] Failed to record pattern:', error);
    }
  }

  /**
   * Start a user session
   */
  async startSession(
    userId: string,
    deviceType?: string
  ): Promise<string> {
    try {
      const session = await prisma.userSession.create({
        data: {
          userId,
          deviceType,
          sessionStart: new Date(),
        },
      });

      console.log(`[Analytics] Session started: ${session.id} for user ${userId}`);
      return session.id;
    } catch (error) {
      console.error('[Analytics] Failed to start session:', error);
      throw error;
    }
  }

  /**
   * End a user session
   */
  async endSession(sessionId: string): Promise<void> {
    try {
      const session = await prisma.userSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) return;

      const duration = Math.floor(
        (new Date().getTime() - session.sessionStart.getTime()) / 1000
      );

      await prisma.userSession.update({
        where: { id: sessionId },
        data: {
          sessionEnd: new Date(),
          duration,
        },
      });

      console.log(`[Analytics] Session ended: ${sessionId}`);
    } catch (error) {
      console.error('[Analytics] Failed to end session:', error);
    }
  }

  /**
   * Update session activity
   */
  async updateSessionActivity(
    sessionId: string,
    activity: {
      pagesVisited?: number;
      tradesLogged?: number;
      insightsViewed?: number;
    }
  ): Promise<void> {
    try {
      await prisma.userSession.update({
        where: { id: sessionId },
        data: activity,
      });
    } catch (error) {
      console.error('[Analytics] Failed to update session activity:', error);
    }
  }

  /**
   * Get user's recent insights
   */
  async getUserInsights(
    userId: string,
    limit: number = 10
  ): Promise<any[]> {
    try {
      return await prisma.aIInsight.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('[Analytics] Failed to get user insights:', error);
      return [];
    }
  }

  /**
   * Get user's pattern history
   */
  async getUserPatterns(
    userId: string,
    patternType?: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const where: any = { userId };
      if (patternType) where.patternType = patternType;

      return await prisma.patternOccurrence.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        take: limit,
      });
    } catch (error) {
      console.error('[Analytics] Failed to get user patterns:', error);
      return [];
    }
  }

  /**
   * Get aggregate statistics for a date range
   */
  async getAggregateStats(startDate: Date, endDate: Date): Promise<any> {
    try {
      const [
        totalUsers,
        totalTrades,
        totalInsights,
        totalPatterns,
        trades,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.trade.count({
          where: {
            tradeDate: { gte: startDate, lte: endDate },
          },
        }),
        prisma.aIInsight.count({
          where: {
            timestamp: { gte: startDate, lte: endDate },
          },
        }),
        prisma.patternOccurrence.count({
          where: {
            timestamp: { gte: startDate, lte: endDate },
          },
        }),
        prisma.trade.findMany({
          where: {
            tradeDate: { gte: startDate, lte: endDate },
          },
          select: {
            pnl: true,
            emotionalState: true,
          },
        }),
      ]);

      // Calculate win rate
      const winningTrades = trades.filter(t => Number(t.pnl) > 0).length;
      const avgWinRate = trades.length > 0 ? winningTrades / trades.length : 0;

      // Calculate average P&L
      const totalPnL = trades.reduce((sum, t) => sum + Number(t.pnl), 0);
      const avgPnL = trades.length > 0 ? totalPnL / trades.length : 0;

      // Emotion distribution
      const emotionCounts: Record<string, number> = {};
      trades.forEach(t => {
        emotionCounts[t.emotionalState] = (emotionCounts[t.emotionalState] || 0) + 1;
      });

      const emotionDistribution: Record<string, number> = {};
      Object.entries(emotionCounts).forEach(([emotion, count]) => {
        emotionDistribution[emotion] = count / trades.length;
      });

      return {
        totalUsers,
        totalTrades,
        totalInsights,
        totalPatterns,
        avgWinRate,
        avgPnL,
        emotionDistribution,
      };
    } catch (error) {
      console.error('[Analytics] Failed to get aggregate stats:', error);
      throw error;
    }
  }

  /**
   * Generate daily aggregate stats (run as cron job)
   */
  async generateDailyStats(date: Date): Promise<void> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const stats = await this.getAggregateStats(startOfDay, endOfDay);

      // Get pattern frequency
      const patterns = await prisma.patternOccurrence.groupBy({
        by: ['patternType'],
        where: {
          timestamp: { gte: startOfDay, lte: endOfDay },
        },
        _count: true,
      });

      const patternFrequency: Record<string, number> = {};
      patterns.forEach(p => {
        patternFrequency[p.patternType] = p._count;
      });

      // Get insight effectiveness
      const insights = await prisma.aIInsight.findMany({
        where: {
          timestamp: { gte: startOfDay, lte: endOfDay },
          wasHelpful: { not: null },
        },
        select: {
          insightType: true,
          wasHelpful: true,
        },
      });

      const insightStats: Record<string, { total: number; helpful: number }> = {};
      insights.forEach(i => {
        if (!insightStats[i.insightType]) {
          insightStats[i.insightType] = { total: 0, helpful: 0 };
        }
        insightStats[i.insightType].total++;
        if (i.wasHelpful) insightStats[i.insightType].helpful++;
      });

      const insightEffectiveness: Record<string, number> = {};
      Object.entries(insightStats).forEach(([type, data]) => {
        insightEffectiveness[type] = data.helpful / data.total;
      });

      // Store daily stats
      await prisma.dailyAggregateStats.upsert({
        where: { date: startOfDay },
        create: {
          date: startOfDay,
          totalUsers: stats.totalUsers,
          totalTrades: stats.totalTrades,
          totalAIInsights: stats.totalInsights,
          totalPatterns: stats.totalPatterns,
          avgWinRate: stats.avgWinRate,
          avgPnL: stats.avgPnL,
          emotionDistribution: stats.emotionDistribution,
          patternFrequency,
          topPatterns: [],
          insightEffectiveness,
        },
        update: {
          totalUsers: stats.totalUsers,
          totalTrades: stats.totalTrades,
          totalAIInsights: stats.totalInsights,
          totalPatterns: stats.totalPatterns,
          avgWinRate: stats.avgWinRate,
          avgPnL: stats.avgPnL,
          emotionDistribution: stats.emotionDistribution,
          patternFrequency,
          insightEffectiveness,
        },
      });

      console.log(`[Analytics] Daily stats generated for ${startOfDay.toISOString()}`);
    } catch (error) {
      console.error('[Analytics] Failed to generate daily stats:', error);
      throw error;
    }
  }

  /**
   * Submit user feedback
   */
  async submitFeedback(
    userId: string,
    feedbackType: string,
    message: string,
    options?: {
      rating?: number;
      context?: any;
    }
  ): Promise<void> {
    try {
      await prisma.userFeedback.create({
        data: {
          userId,
          feedbackType,
          message,
          rating: options?.rating,
          context: options?.context,
          timestamp: new Date(),
        },
      });

      console.log(`[Analytics] Feedback submitted by user ${userId}`);
    } catch (error) {
      console.error('[Analytics] Failed to submit feedback:', error);
      throw error;
    }
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();
