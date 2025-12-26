import { Trade, Note, Screenshot } from '@prisma/client';

/**
 * Trade data with related entities for AI context
 */
export interface TradeWithRelations extends Trade {
  notes?: Note[];
  screenshots?: Screenshot[];
}

/**
 * Serialized trade data optimized for AI consumption
 */
export interface SerializedTrade {
  id: string;
  date: string;
  instrument: string;
  type: string;
  direction: string;
  
  // Financial data
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  leverage: number;
  pnl: number;
  pnlPercentage: number | null;
  currency: string;
  
  // Pre-trade psychology
  setupConfidence: number | null;
  marketCondition: string | null;
  timeOfDay: string | null;
  newsImpact: string | null;
  strategy: string | null;
  riskRewardRatio: number | null;
  
  // Entry decision
  entryTrigger: string | null;
  hadHesitation: boolean | null;
  deviatedFromPlan: boolean | null;
  deviationReason: string | null;
  
  // During trade
  monitoringFrequency: string | null;
  stressLevel: number | null;
  consideredEarlyExit: boolean | null;
  
  // Exit decision
  exitReason: string | null;
  exitSatisfaction: number | null;
  wouldDoDifferently: string | null;
  
  // Post-trade reflection
  keyLesson: string | null;
  mistakesMade: string[];
  whatWentWell: string | null;
  
  // Emotional & contextual
  emotionalState: string;
  isImpulsive: boolean;
  sessionQuality: number | null;
  physicalState: string | null;
  mentalState: string | null;
  externalFactors: string[];
  
  // Additional context
  notes: string[];
  hasScreenshots: boolean;
}

/**
 * Psychological profile aggregated from multiple trades
 */
export interface PsychologicalProfile {
  // Emotional patterns
  dominantEmotions: Array<{ emotion: string; frequency: number; avgPnL: number }>;
  emotionalVolatility: number; // How much emotions vary
  
  // Confidence patterns
  avgConfidence: number;
  confidenceVsPnLCorrelation: number;
  
  // Stress patterns
  avgStressLevel: number;
  stressVsPnLCorrelation: number;
  highStressTrades: number;
  
  // Behavioral patterns
  impulsiveTradeRate: number;
  planDeviationRate: number;
  hesitationRate: number;
  earlyExitRate: number;
  
  // Session quality
  avgSessionQuality: number;
  sessionQualityVsPnLCorrelation: number;
  
  // Physical & mental state
  physicalStateDistribution: Record<string, number>;
  mentalStateDistribution: Record<string, number>;
  optimalStates: {
    physical: string | null;
    mental: string | null;
  };
  
  // External factors
  commonExternalFactors: Array<{ factor: string; frequency: number }>;
  externalFactorsImpact: number;
  
  // Overall assessment
  totalTrades: number;
  winRate: number;
  avgPnL: number;
}

/**
 * Pattern data formatted for AI analysis
 */
export interface PatternData {
  // Time-based patterns
  timeOfDayPerformance: Record<string, { trades: number; winRate: number; avgPnL: number }>;
  dayOfWeekPerformance: Record<string, { trades: number; winRate: number; avgPnL: number }>;
  
  // Strategy patterns
  strategyPerformance: Record<string, { trades: number; winRate: number; avgPnL: number }>;
  
  // Market condition patterns
  marketConditionPerformance: Record<string, { trades: number; winRate: number; avgPnL: number }>;
  
  // Entry trigger patterns
  entryTriggerPerformance: Record<string, { trades: number; winRate: number; avgPnL: number }>;
  
  // Exit reason patterns
  exitReasonPerformance: Record<string, { trades: number; winRate: number; avgPnL: number }>;
  
  // Mistake patterns
  commonMistakes: Array<{ mistake: string; frequency: number; avgPnL: number }>;
  
  // Success patterns
  successFactors: Array<{ factor: string; frequency: number; avgPnL: number }>;
}

/**
 * Service for preparing trade data for AI consumption
 */
export class DataPreparationService {
  /**
   * Serialize a single trade for AI context
   */
  public serializeTrade(trade: TradeWithRelations): SerializedTrade {
    return {
      id: trade.id,
      date: trade.tradeDate.toISOString().split('T')[0],
      instrument: trade.instrument,
      type: trade.tradeType,
      direction: trade.tradeDirection,
      
      entryPrice: Number(trade.avgBuyPrice),
      exitPrice: Number(trade.avgSellPrice),
      positionSize: Number(trade.positionSize),
      leverage: Number(trade.leverage),
      pnl: Number(trade.pnl),
      pnlPercentage: trade.pnlPercentage ? Number(trade.pnlPercentage) : null,
      currency: trade.baseCurrency,
      
      setupConfidence: trade.setupConfidence,
      marketCondition: trade.marketCondition,
      timeOfDay: trade.timeOfDay,
      newsImpact: trade.newsImpact,
      strategy: trade.strategy,
      riskRewardRatio: trade.riskRewardRatio ? Number(trade.riskRewardRatio) : null,
      
      entryTrigger: trade.entryTrigger,
      hadHesitation: trade.hadHesitation,
      deviatedFromPlan: trade.deviatedFromPlan,
      deviationReason: trade.deviationReason,
      
      monitoringFrequency: trade.monitoringFrequency,
      stressLevel: trade.stressLevel,
      consideredEarlyExit: trade.consideredEarlyExit,
      
      exitReason: trade.exitReason,
      exitSatisfaction: trade.exitSatisfaction,
      wouldDoDifferently: trade.wouldDoDifferently,
      
      keyLesson: trade.keyLesson,
      mistakesMade: trade.mistakesMade || [],
      whatWentWell: trade.whatWentWell,
      
      emotionalState: trade.emotionalState,
      isImpulsive: trade.isImpulsive,
      sessionQuality: trade.sessionQuality,
      physicalState: trade.physicalState,
      mentalState: trade.mentalState,
      externalFactors: trade.externalFactors || [],
      
      notes: trade.notes?.map(n => n.content) || [],
      hasScreenshots: (trade.screenshots?.length || 0) > 0,
    };
  }

  /**
   * Serialize multiple trades for AI context
   */
  public serializeTrades(trades: TradeWithRelations[]): SerializedTrade[] {
    return trades.map(trade => this.serializeTrade(trade));
  }

  /**
   * Build psychological profile from trades
   */
  public buildPsychologicalProfile(trades: TradeWithRelations[]): PsychologicalProfile {
    if (trades.length === 0) {
      return this.getEmptyProfile();
    }

    // Calculate emotional patterns
    const emotionCounts = new Map<string, { count: number; totalPnL: number }>();
    trades.forEach(trade => {
      const emotion = trade.emotionalState;
      const current = emotionCounts.get(emotion) || { count: 0, totalPnL: 0 };
      emotionCounts.set(emotion, {
        count: current.count + 1,
        totalPnL: current.totalPnL + Number(trade.pnl),
      });
    });

    const dominantEmotions = Array.from(emotionCounts.entries())
      .map(([emotion, data]) => ({
        emotion,
        frequency: data.count / trades.length,
        avgPnL: data.totalPnL / data.count,
      }))
      .sort((a, b) => b.frequency - a.frequency);

    // Calculate confidence metrics
    const confidenceTrades = trades.filter(t => t.setupConfidence !== null);
    const avgConfidence = confidenceTrades.length > 0
      ? confidenceTrades.reduce((sum, t) => sum + (t.setupConfidence || 0), 0) / confidenceTrades.length
      : 0;

    const confidenceVsPnLCorrelation = this.calculateCorrelation(
      confidenceTrades.map(t => t.setupConfidence || 0),
      confidenceTrades.map(t => Number(t.pnl))
    );

    // Calculate stress metrics
    const stressTrades = trades.filter(t => t.stressLevel !== null);
    const avgStressLevel = stressTrades.length > 0
      ? stressTrades.reduce((sum, t) => sum + (t.stressLevel || 0), 0) / stressTrades.length
      : 0;

    const stressVsPnLCorrelation = this.calculateCorrelation(
      stressTrades.map(t => t.stressLevel || 0),
      stressTrades.map(t => Number(t.pnl))
    );

    const highStressTrades = stressTrades.filter(t => (t.stressLevel || 0) >= 7).length;

    // Calculate behavioral patterns
    const impulsiveTradeRate = trades.filter(t => t.isImpulsive).length / trades.length;
    const planDeviationRate = trades.filter(t => t.deviatedFromPlan === true).length / trades.length;
    const hesitationRate = trades.filter(t => t.hadHesitation === true).length / trades.length;
    const earlyExitRate = trades.filter(t => t.consideredEarlyExit === true).length / trades.length;

    // Calculate session quality
    const sessionQualityTrades = trades.filter(t => t.sessionQuality !== null);
    const avgSessionQuality = sessionQualityTrades.length > 0
      ? sessionQualityTrades.reduce((sum, t) => sum + (t.sessionQuality || 0), 0) / sessionQualityTrades.length
      : 0;

    const sessionQualityVsPnLCorrelation = this.calculateCorrelation(
      sessionQualityTrades.map(t => t.sessionQuality || 0),
      sessionQualityTrades.map(t => Number(t.pnl))
    );

    // Physical and mental state distribution
    const physicalStateDistribution = this.getDistribution(trades, 'physicalState');
    const mentalStateDistribution = this.getDistribution(trades, 'mentalState');

    const optimalStates = {
      physical: this.findOptimalState(trades, 'physicalState'),
      mental: this.findOptimalState(trades, 'mentalState'),
    };

    // External factors
    const externalFactorCounts = new Map<string, number>();
    trades.forEach(trade => {
      trade.externalFactors?.forEach(factor => {
        externalFactorCounts.set(factor, (externalFactorCounts.get(factor) || 0) + 1);
      });
    });

    const commonExternalFactors = Array.from(externalFactorCounts.entries())
      .map(([factor, frequency]) => ({ factor, frequency }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    const tradesWithExternalFactors = trades.filter(t => t.externalFactors && t.externalFactors.length > 0);
    const avgPnLWithFactors = tradesWithExternalFactors.length > 0
      ? tradesWithExternalFactors.reduce((sum, t) => sum + Number(t.pnl), 0) / tradesWithExternalFactors.length
      : 0;
    const avgPnLWithoutFactors = (trades.length - tradesWithExternalFactors.length) > 0
      ? trades.filter(t => !t.externalFactors || t.externalFactors.length === 0)
          .reduce((sum, t) => sum + Number(t.pnl), 0) / (trades.length - tradesWithExternalFactors.length)
      : 0;
    const externalFactorsImpact = avgPnLWithoutFactors - avgPnLWithFactors;

    // Overall metrics
    const winningTrades = trades.filter(t => Number(t.pnl) > 0).length;
    const winRate = winningTrades / trades.length;
    const avgPnL = trades.reduce((sum, t) => sum + Number(t.pnl), 0) / trades.length;

    return {
      dominantEmotions,
      emotionalVolatility: this.calculateStandardDeviation(
        Array.from(emotionCounts.values()).map(v => v.count)
      ),
      avgConfidence,
      confidenceVsPnLCorrelation,
      avgStressLevel,
      stressVsPnLCorrelation,
      highStressTrades,
      impulsiveTradeRate,
      planDeviationRate,
      hesitationRate,
      earlyExitRate,
      avgSessionQuality,
      sessionQualityVsPnLCorrelation,
      physicalStateDistribution,
      mentalStateDistribution,
      optimalStates,
      commonExternalFactors,
      externalFactorsImpact,
      totalTrades: trades.length,
      winRate,
      avgPnL,
    };
  }

  /**
   * Build pattern data from trades
   */
  public buildPatternData(trades: TradeWithRelations[]): PatternData {
    return {
      timeOfDayPerformance: this.calculatePerformanceByField(trades, 'timeOfDay'),
      dayOfWeekPerformance: this.calculateDayOfWeekPerformance(trades),
      strategyPerformance: this.calculatePerformanceByField(trades, 'strategy'),
      marketConditionPerformance: this.calculatePerformanceByField(trades, 'marketCondition'),
      entryTriggerPerformance: this.calculatePerformanceByField(trades, 'entryTrigger'),
      exitReasonPerformance: this.calculatePerformanceByField(trades, 'exitReason'),
      commonMistakes: this.calculateMistakePatterns(trades),
      successFactors: this.calculateSuccessFactors(trades),
    };
  }

  // Helper methods

  private getEmptyProfile(): PsychologicalProfile {
    return {
      dominantEmotions: [],
      emotionalVolatility: 0,
      avgConfidence: 0,
      confidenceVsPnLCorrelation: 0,
      avgStressLevel: 0,
      stressVsPnLCorrelation: 0,
      highStressTrades: 0,
      impulsiveTradeRate: 0,
      planDeviationRate: 0,
      hesitationRate: 0,
      earlyExitRate: 0,
      avgSessionQuality: 0,
      sessionQualityVsPnLCorrelation: 0,
      physicalStateDistribution: {},
      mentalStateDistribution: {},
      optimalStates: { physical: null, mental: null },
      commonExternalFactors: [],
      externalFactorsImpact: 0,
      totalTrades: 0,
      winRate: 0,
      avgPnL: 0,
    };
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  private getDistribution(trades: TradeWithRelations[], field: keyof Trade): Record<string, number> {
    const distribution: Record<string, number> = {};
    trades.forEach(trade => {
      const value = trade[field];
      if (value && typeof value === 'string') {
        distribution[value] = (distribution[value] || 0) + 1;
      }
    });
    return distribution;
  }

  private findOptimalState(trades: TradeWithRelations[], field: keyof Trade): string | null {
    const statePerformance = new Map<string, { count: number; totalPnL: number }>();
    
    trades.forEach(trade => {
      const state = trade[field];
      if (state && typeof state === 'string') {
        const current = statePerformance.get(state) || { count: 0, totalPnL: 0 };
        statePerformance.set(state, {
          count: current.count + 1,
          totalPnL: current.totalPnL + Number(trade.pnl),
        });
      }
    });

    let optimalState: string | null = null;
    let maxAvgPnL = -Infinity;

    statePerformance.forEach((data, state) => {
      const avgPnL = data.totalPnL / data.count;
      if (avgPnL > maxAvgPnL) {
        maxAvgPnL = avgPnL;
        optimalState = state;
      }
    });

    return optimalState;
  }

  private calculatePerformanceByField(
    trades: TradeWithRelations[],
    field: keyof Trade
  ): Record<string, { trades: number; winRate: number; avgPnL: number }> {
    const performance: Record<string, { trades: number; wins: number; totalPnL: number }> = {};

    trades.forEach(trade => {
      const value = trade[field];
      if (value && typeof value === 'string') {
        if (!performance[value]) {
          performance[value] = { trades: 0, wins: 0, totalPnL: 0 };
        }
        performance[value].trades++;
        if (Number(trade.pnl) > 0) performance[value].wins++;
        performance[value].totalPnL += Number(trade.pnl);
      }
    });

    const result: Record<string, { trades: number; winRate: number; avgPnL: number }> = {};
    Object.entries(performance).forEach(([key, data]) => {
      result[key] = {
        trades: data.trades,
        winRate: data.wins / data.trades,
        avgPnL: data.totalPnL / data.trades,
      };
    });

    return result;
  }

  private calculateDayOfWeekPerformance(
    trades: TradeWithRelations[]
  ): Record<string, { trades: number; winRate: number; avgPnL: number }> {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const performance: Record<string, { trades: number; wins: number; totalPnL: number }> = {};

    trades.forEach(trade => {
      const dayOfWeek = daysOfWeek[trade.tradeDate.getDay()];
      if (!performance[dayOfWeek]) {
        performance[dayOfWeek] = { trades: 0, wins: 0, totalPnL: 0 };
      }
      performance[dayOfWeek].trades++;
      if (Number(trade.pnl) > 0) performance[dayOfWeek].wins++;
      performance[dayOfWeek].totalPnL += Number(trade.pnl);
    });

    const result: Record<string, { trades: number; winRate: number; avgPnL: number }> = {};
    Object.entries(performance).forEach(([key, data]) => {
      result[key] = {
        trades: data.trades,
        winRate: data.wins / data.trades,
        avgPnL: data.totalPnL / data.trades,
      };
    });

    return result;
  }

  private calculateMistakePatterns(
    trades: TradeWithRelations[]
  ): Array<{ mistake: string; frequency: number; avgPnL: number }> {
    const mistakeCounts = new Map<string, { count: number; totalPnL: number }>();

    trades.forEach(trade => {
      trade.mistakesMade?.forEach(mistake => {
        const current = mistakeCounts.get(mistake) || { count: 0, totalPnL: 0 };
        mistakeCounts.set(mistake, {
          count: current.count + 1,
          totalPnL: current.totalPnL + Number(trade.pnl),
        });
      });
    });

    return Array.from(mistakeCounts.entries())
      .map(([mistake, data]) => ({
        mistake,
        frequency: data.count,
        avgPnL: data.totalPnL / data.count,
      }))
      .sort((a, b) => b.frequency - a.frequency);
  }

  private calculateSuccessFactors(
    trades: TradeWithRelations[]
  ): Array<{ factor: string; frequency: number; avgPnL: number }> {
    const winningTrades = trades.filter(t => Number(t.pnl) > 0);
    const factorCounts = new Map<string, { count: number; totalPnL: number }>();

    winningTrades.forEach(trade => {
      // Consider various success factors
      if (trade.strategy) {
        const key = `Strategy: ${trade.strategy}`;
        const current = factorCounts.get(key) || { count: 0, totalPnL: 0 };
        factorCounts.set(key, {
          count: current.count + 1,
          totalPnL: current.totalPnL + Number(trade.pnl),
        });
      }

      if (trade.marketCondition) {
        const key = `Market: ${trade.marketCondition}`;
        const current = factorCounts.get(key) || { count: 0, totalPnL: 0 };
        factorCounts.set(key, {
          count: current.count + 1,
          totalPnL: current.totalPnL + Number(trade.pnl),
        });
      }

      if (!trade.deviatedFromPlan) {
        const key = 'Followed Plan';
        const current = factorCounts.get(key) || { count: 0, totalPnL: 0 };
        factorCounts.set(key, {
          count: current.count + 1,
          totalPnL: current.totalPnL + Number(trade.pnl),
        });
      }
    });

    return Array.from(factorCounts.entries())
      .map(([factor, data]) => ({
        factor,
        frequency: data.count,
        avgPnL: data.totalPnL / data.count,
      }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }
}

// Singleton instance
export const dataPreparationService = new DataPreparationService();
