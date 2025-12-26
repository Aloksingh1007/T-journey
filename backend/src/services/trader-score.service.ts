import { prisma } from '../utils/prisma';
import type { Trade } from '@prisma/client';

/**
 * Trader Score Breakdown
 */
export interface TraderScoreBreakdown {
  overall: number; // 0-100
  discipline: {
    score: number; // 0-100
    weight: number; // 30%
    metrics: {
      planAdherence: number;
      impulsiveTradeRate: number;
      stopLossRespect: number;
      emotionalControl: number;
    };
  };
  performance: {
    score: number; // 0-100
    weight: number; // 25%
    metrics: {
      winRate: number;
      riskRewardRatio: number;
      profitFactor: number;
      consistency: number;
    };
  };
  learning: {
    score: number; // 0-100
    weight: number; // 20%
    metrics: {
      lessonsDocumented: number;
      mistakeRepetition: number;
      improvementTrend: number;
      reflectionQuality: number;
    };
  };
  riskManagement: {
    score: number; // 0-100
    weight: number; // 15%
    metrics: {
      positionSizing: number;
      leverageUsage: number;
      drawdownManagement: number;
      diversification: number;
    };
  };
  emotionalIntelligence: {
    score: number; // 0-100
    weight: number; // 10%
    metrics: {
      emotionPerformanceCorrelation: number;
      stressManagement: number;
      lossRecovery: number;
      confidenceCalibration: number;
    };
  };
}

/**
 * Trader Level
 */
export interface TraderLevel {
  level: number; // 1-6
  name: string;
  minScore: number;
  maxScore: number;
  description: string;
  nextLevel?: {
    name: string;
    pointsNeeded: number;
  };
}

/**
 * Trader Score Service
 * Calculates comprehensive trader score based on multiple factors
 */
export class TraderScoreService {
  /**
   * Calculate overall trader score for a user
   */
  public async calculateScore(userId: string): Promise<TraderScoreBreakdown> {
    // Fetch all user trades
    const trades = await prisma.trade.findMany({
      where: { userId },
      include: {
        notes: true,
      },
      orderBy: { tradeDate: 'asc' },
    });

    if (trades.length === 0) {
      return this.getDefaultScore();
    }

    // Calculate each component
    const discipline = this.calculateDisciplineScore(trades);
    const performance = this.calculatePerformanceScore(trades);
    const learning = this.calculateLearningScore(trades);
    const riskManagement = this.calculateRiskManagementScore(trades);
    const emotionalIntelligence = this.calculateEmotionalIntelligenceScore(trades);

    // Calculate weighted overall score
    const overall =
      discipline.score * 0.3 +
      performance.score * 0.25 +
      learning.score * 0.2 +
      riskManagement.score * 0.15 +
      emotionalIntelligence.score * 0.1;

    return {
      overall: Math.round(overall),
      discipline: { ...discipline, weight: 30 },
      performance: { ...performance, weight: 25 },
      learning: { ...learning, weight: 20 },
      riskManagement: { ...riskManagement, weight: 15 },
      emotionalIntelligence: { ...emotionalIntelligence, weight: 10 },
    };
  }

  /**
   * Calculate Discipline Score (30%)
   */
  private calculateDisciplineScore(trades: Trade[]): Omit<TraderScoreBreakdown['discipline'], 'weight'> {
    // Plan adherence: trades that didn't deviate from plan
    const tradesFollowingPlan = trades.filter((t) => !t.deviatedFromPlan).length;
    const planAdherence = trades.length > 0 ? (tradesFollowingPlan / trades.length) * 100 : 0;

    // Impulsive trade rate (lower is better)
    const impulsiveTrades = trades.filter((t) => t.isImpulsive).length;
    const impulsiveRate = trades.length > 0 ? (impulsiveTrades / trades.length) * 100 : 0;
    const impulsiveScore = Math.max(0, 100 - impulsiveRate * 2); // Penalize heavily

    // Stop loss respect: trades that had stop loss set
    const tradesWithStopLoss = trades.filter((t) => t.stopLossPrice !== null).length;
    const stopLossRespect = trades.length > 0 ? (tradesWithStopLoss / trades.length) * 100 : 0;

    // Emotional control: low stress trades
    const lowStressTrades = trades.filter((t) => t.stressLevel && t.stressLevel <= 5).length;
    const emotionalControl = trades.length > 0 ? (lowStressTrades / trades.length) * 100 : 50;

    // Average discipline score
    const score = (planAdherence + impulsiveScore + stopLossRespect + emotionalControl) / 4;

    return {
      score: Math.round(score),
      metrics: {
        planAdherence: Math.round(planAdherence),
        impulsiveTradeRate: Math.round(100 - impulsiveScore),
        stopLossRespect: Math.round(stopLossRespect),
        emotionalControl: Math.round(emotionalControl),
      },
    };
  }

  /**
   * Calculate Performance Score (25%)
   */
  private calculatePerformanceScore(trades: Trade[]): Omit<TraderScoreBreakdown['performance'], 'weight'> {
    // Win rate
    const winningTrades = trades.filter((t) => Number(t.pnl) > 0).length;
    const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;

    // Risk-reward ratio (average)
    const avgWin = this.calculateAverageWin(trades);
    const avgLoss = Math.abs(this.calculateAverageLoss(trades));
    const riskRewardRatio = avgLoss > 0 ? avgWin / avgLoss : 1;
    const rrScore = Math.min(100, riskRewardRatio * 40); // 2.5 RR = 100 points

    // Profit factor
    const totalWins = trades.filter((t) => Number(t.pnl) > 0).reduce((sum, t) => sum + Number(t.pnl), 0);
    const totalLosses = Math.abs(trades.filter((t) => Number(t.pnl) < 0).reduce((sum, t) => sum + Number(t.pnl), 0));
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : 1;
    const pfScore = Math.min(100, profitFactor * 40); // 2.5 PF = 100 points

    // Consistency (lower standard deviation = higher score)
    const consistency = this.calculateConsistency(trades);

    const score = (winRate + rrScore + pfScore + consistency) / 4;

    return {
      score: Math.round(score),
      metrics: {
        winRate: Math.round(winRate),
        riskRewardRatio: Math.round(rrScore),
        profitFactor: Math.round(pfScore),
        consistency: Math.round(consistency),
      },
    };
  }

  /**
   * Calculate Learning Score (20%)
   */
  private calculateLearningScore(trades: Trade[]): Omit<TraderScoreBreakdown['learning'], 'weight'> {
    // Lessons documented
    const tradesWithLessons = trades.filter((t) => t.keyLesson && t.keyLesson.length > 10).length;
    const lessonsDocumented = trades.length > 0 ? (tradesWithLessons / trades.length) * 100 : 0;

    // Mistake repetition (lower is better) - simplified for now
    const mistakeRepetition = 70; // Placeholder - would need more complex analysis

    // Improvement trend - compare recent vs older trades
    const improvementTrend = this.calculateImprovementTrend(trades);

    // Reflection quality - based on length and completeness of reflections
    const reflectionQuality = this.calculateReflectionQuality(trades);

    const score = (lessonsDocumented + mistakeRepetition + improvementTrend + reflectionQuality) / 4;

    return {
      score: Math.round(score),
      metrics: {
        lessonsDocumented: Math.round(lessonsDocumented),
        mistakeRepetition: Math.round(mistakeRepetition),
        improvementTrend: Math.round(improvementTrend),
        reflectionQuality: Math.round(reflectionQuality),
      },
    };
  }

  /**
   * Calculate Risk Management Score (15%)
   */
  private calculateRiskManagementScore(trades: Trade[]): Omit<TraderScoreBreakdown['riskManagement'], 'weight'> {
    // Position sizing consistency
    const positionSizing = this.calculatePositionSizingScore(trades);

    // Leverage usage appropriateness
    const avgLeverage = trades.reduce((sum, t) => sum + Number(t.leverage), 0) / trades.length;
    const leverageUsage = avgLeverage <= 2 ? 100 : avgLeverage <= 5 ? 70 : avgLeverage <= 10 ? 40 : 20;

    // Drawdown management
    const drawdownManagement = this.calculateDrawdownScore(trades);

    // Diversification (different instruments)
    const uniqueInstruments = new Set(trades.map((t) => t.instrument)).size;
    const diversification = Math.min(100, uniqueInstruments * 20); // 5+ instruments = 100

    const score = (positionSizing + leverageUsage + drawdownManagement + diversification) / 4;

    return {
      score: Math.round(score),
      metrics: {
        positionSizing: Math.round(positionSizing),
        leverageUsage: Math.round(leverageUsage),
        drawdownManagement: Math.round(drawdownManagement),
        diversification: Math.round(diversification),
      },
    };
  }

  /**
   * Calculate Emotional Intelligence Score (10%)
   */
  private calculateEmotionalIntelligenceScore(
    trades: Trade[]
  ): Omit<TraderScoreBreakdown['emotionalIntelligence'], 'weight'> {
    // Emotion-performance correlation (better emotions = better performance)
    const emotionPerformanceCorrelation = this.calculateEmotionPerformanceScore(trades);

    // Stress management (lower stress = better)
    const avgStress = trades.filter((t) => t.stressLevel).reduce((sum, t) => sum + (t.stressLevel || 0), 0) / trades.length;
    const stressManagement = Math.max(0, 100 - avgStress * 10);

    // Loss recovery (performance after losses)
    const lossRecovery = this.calculateLossRecoveryScore(trades);

    // Confidence calibration (confidence matches outcomes)
    const confidenceCalibration = this.calculateConfidenceCalibrationScore(trades);

    const score = (emotionPerformanceCorrelation + stressManagement + lossRecovery + confidenceCalibration) / 4;

    return {
      score: Math.round(score),
      metrics: {
        emotionPerformanceCorrelation: Math.round(emotionPerformanceCorrelation),
        stressManagement: Math.round(stressManagement),
        lossRecovery: Math.round(lossRecovery),
        confidenceCalibration: Math.round(confidenceCalibration),
      },
    };
  }

  // Helper methods

  private calculateAverageWin(trades: Trade[]): number {
    const wins = trades.filter((t) => Number(t.pnl) > 0);
    if (wins.length === 0) return 0;
    return wins.reduce((sum, t) => sum + Number(t.pnl), 0) / wins.length;
  }

  private calculateAverageLoss(trades: Trade[]): number {
    const losses = trades.filter((t) => Number(t.pnl) < 0);
    if (losses.length === 0) return 0;
    return losses.reduce((sum, t) => sum + Number(t.pnl), 0) / losses.length;
  }

  private calculateConsistency(trades: Trade[]): number {
    if (trades.length < 2) return 50;
    const pnls = trades.map((t) => Number(t.pnl));
    const mean = pnls.reduce((sum, pnl) => sum + pnl, 0) / pnls.length;
    const variance = pnls.reduce((sum, pnl) => sum + Math.pow(pnl - mean, 2), 0) / pnls.length;
    const stdDev = Math.sqrt(variance);
    // Lower std dev = higher consistency
    const consistencyScore = Math.max(0, 100 - stdDev / 10);
    return consistencyScore;
  }

  private calculateImprovementTrend(trades: Trade[]): number {
    if (trades.length < 10) return 50;
    const half = Math.floor(trades.length / 2);
    const oldTrades = trades.slice(0, half);
    const newTrades = trades.slice(half);

    const oldWinRate = oldTrades.filter((t) => Number(t.pnl) > 0).length / oldTrades.length;
    const newWinRate = newTrades.filter((t) => Number(t.pnl) > 0).length / newTrades.length;

    const improvement = ((newWinRate - oldWinRate) / (oldWinRate || 0.01)) * 100;
    return Math.min(100, Math.max(0, 50 + improvement));
  }

  private calculateReflectionQuality(trades: Trade[]): number {
    const tradesWithReflection = trades.filter(
      (t) =>
        (t.keyLesson && t.keyLesson.length > 20) ||
        (t.whatWentWell && t.whatWentWell.length > 20) ||
        (t.wouldDoDifferently && t.wouldDoDifferently.length > 20)
    ).length;
    return trades.length > 0 ? (tradesWithReflection / trades.length) * 100 : 0;
  }

  private calculatePositionSizingScore(trades: Trade[]): number {
    if (trades.length < 2) return 50;
    const sizes = trades.map((t) => Number(t.positionSize));
    const mean = sizes.reduce((sum, size) => sum + size, 0) / sizes.length;
    const variance = sizes.reduce((sum, size) => sum + Math.pow(size - mean, 2), 0) / sizes.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = mean > 0 ? stdDev / mean : 1;
    // Lower CV = more consistent = higher score
    return Math.max(0, 100 - coefficientOfVariation * 100);
  }

  private calculateDrawdownScore(trades: Trade[]): number {
    let peak = 0;
    let maxDrawdown = 0;
    let cumulative = 0;

    trades.forEach((trade) => {
      cumulative += Number(trade.pnl);
      if (cumulative > peak) peak = cumulative;
      const drawdown = peak - cumulative;
      if (drawdown > maxDrawdown) maxDrawdown = drawdown;
    });

    const drawdownPercent = peak > 0 ? (maxDrawdown / peak) * 100 : 0;
    return Math.max(0, 100 - drawdownPercent * 2);
  }

  private calculateEmotionPerformanceScore(trades: Trade[]): number {
    const emotionScores: Record<string, number[]> = {};

    trades.forEach((trade) => {
      const emotion = trade.emotionalState;
      if (!emotionScores[emotion]) emotionScores[emotion] = [];
      emotionScores[emotion].push(Number(trade.pnl));
    });

    // Calculate which emotions lead to better performance
    let goodEmotions = 0;
    let totalEmotions = 0;

    Object.entries(emotionScores).forEach(([_emotion, pnls]) => {
      const avgPnl = pnls.reduce((sum, pnl) => sum + pnl, 0) / pnls.length;
      totalEmotions++;
      if (avgPnl > 0) goodEmotions++;
    });

    return totalEmotions > 0 ? (goodEmotions / totalEmotions) * 100 : 50;
  }

  private calculateLossRecoveryScore(trades: Trade[]): number {
    let recoveryCount = 0;
    let lossCount = 0;

    for (let i = 0; i < trades.length - 1; i++) {
      if (Number(trades[i].pnl) < 0) {
        lossCount++;
        if (Number(trades[i + 1].pnl) > 0) {
          recoveryCount++;
        }
      }
    }

    return lossCount > 0 ? (recoveryCount / lossCount) * 100 : 50;
  }

  private calculateConfidenceCalibrationScore(trades: Trade[]): number {
    const tradesWithConfidence = trades.filter((t) => t.setupConfidence);
    if (tradesWithConfidence.length === 0) return 50;

    let calibrationScore = 0;

    tradesWithConfidence.forEach((trade) => {
      const confidence = trade.setupConfidence || 5;
      const isWin = Number(trade.pnl) > 0;

      if ((isWin && confidence >= 7) || (!isWin && confidence <= 4)) {
        calibrationScore += 100;
      } else if ((isWin && confidence >= 5) || (!isWin && confidence <= 6)) {
        calibrationScore += 50;
      }
    });

    return calibrationScore / tradesWithConfidence.length;
  }

  private getDefaultScore(): TraderScoreBreakdown {
    return {
      overall: 0,
      discipline: {
        score: 0,
        weight: 30,
        metrics: {
          planAdherence: 0,
          impulsiveTradeRate: 0,
          stopLossRespect: 0,
          emotionalControl: 0,
        },
      },
      performance: {
        score: 0,
        weight: 25,
        metrics: {
          winRate: 0,
          riskRewardRatio: 0,
          profitFactor: 0,
          consistency: 0,
        },
      },
      learning: {
        score: 0,
        weight: 20,
        metrics: {
          lessonsDocumented: 0,
          mistakeRepetition: 0,
          improvementTrend: 0,
          reflectionQuality: 0,
        },
      },
      riskManagement: {
        score: 0,
        weight: 15,
        metrics: {
          positionSizing: 0,
          leverageUsage: 0,
          drawdownManagement: 0,
          diversification: 0,
        },
      },
      emotionalIntelligence: {
        score: 0,
        weight: 10,
        metrics: {
          emotionPerformanceCorrelation: 0,
          stressManagement: 0,
          lossRecovery: 0,
          confidenceCalibration: 0,
        },
      },
    };
  }

  /**
   * Get trader level based on score
   */
  public getTraderLevel(score: number): TraderLevel {
    const levels: TraderLevel[] = [
      { level: 1, name: 'Novice Trader', minScore: 0, maxScore: 20, description: 'Just starting your trading journey' },
      { level: 2, name: 'Developing Trader', minScore: 21, maxScore: 40, description: 'Learning the ropes' },
      { level: 3, name: 'Competent Trader', minScore: 41, maxScore: 60, description: 'Showing consistency' },
      { level: 4, name: 'Proficient Trader', minScore: 61, maxScore: 80, description: 'Strong performance' },
      { level: 5, name: 'Expert Trader', minScore: 81, maxScore: 95, description: 'Exceptional skills' },
      { level: 6, name: 'Master Trader', minScore: 96, maxScore: 100, description: 'Elite level' },
    ];

    const currentLevel = levels.find((l) => score >= l.minScore && score <= l.maxScore) || levels[0];
    const nextLevel = levels.find((l) => l.level === currentLevel.level + 1);

    if (nextLevel) {
      currentLevel.nextLevel = {
        name: nextLevel.name,
        pointsNeeded: nextLevel.minScore - score,
      };
    }

    return currentLevel;
  }
}

// Singleton instance
export const traderScoreService = new TraderScoreService();
