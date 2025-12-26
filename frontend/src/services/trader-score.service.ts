import { api } from './api';

export interface TraderScoreBreakdown {
  overall: number;
  discipline: {
    score: number;
    weight: number;
    metrics: {
      planAdherence: number;
      impulsiveTradeRate: number;
      stopLossRespect: number;
      emotionalControl: number;
    };
  };
  performance: {
    score: number;
    weight: number;
    metrics: {
      winRate: number;
      riskRewardRatio: number;
      profitFactor: number;
      consistency: number;
    };
  };
  learning: {
    score: number;
    weight: number;
    metrics: {
      lessonsDocumented: number;
      mistakeRepetition: number;
      improvementTrend: number;
      reflectionQuality: number;
    };
  };
  riskManagement: {
    score: number;
    weight: number;
    metrics: {
      positionSizing: number;
      leverageUsage: number;
      drawdownManagement: number;
      diversification: number;
    };
  };
  emotionalIntelligence: {
    score: number;
    weight: number;
    metrics: {
      emotionPerformanceCorrelation: number;
      stressManagement: number;
      lossRecovery: number;
      confidenceCalibration: number;
    };
  };
}

export interface TraderLevel {
  level: number;
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
 * Get overall trader score
 */
export async function getOverallScore(): Promise<{ score: number; level: TraderLevel }> {
  const response = await api.get('/scores/overall');
  return response.data.data;
}

/**
 * Get detailed score breakdown
 */
export async function getScoreBreakdown(): Promise<TraderScoreBreakdown> {
  const response = await api.get('/scores/breakdown');
  return response.data.data;
}

/**
 * Get trader level
 */
export async function getTraderLevel(): Promise<TraderLevel> {
  const response = await api.get('/scores/level');
  return response.data.data;
}

/**
 * Recalculate trader score
 */
export async function recalculateScore(): Promise<{
  score: number;
  breakdown: TraderScoreBreakdown;
  level: TraderLevel;
}> {
  const response = await api.post('/scores/recalculate');
  return response.data.data;
}
