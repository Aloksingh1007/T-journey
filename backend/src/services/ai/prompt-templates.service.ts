import { SerializedTrade, PsychologicalProfile, PatternData } from './data-preparation.service';

/**
 * Template variables that can be used in prompts
 */
export interface TemplateVariables {
  [key: string]: any;
}

/**
 * Service for managing AI prompt templates
 */
export class PromptTemplatesService {
  /**
   * Generate a prompt for emotion analysis
   */
  public getEmotionAnalysisPrompt(text: string): string {
    return `Analyze the emotional content of the following trading journal entry. 
Identify the primary emotion, sentiment score (-1 to 1), and confidence level (0 to 1).
Also break down the emotions into fear, greed, confidence, and anxiety (each 0 to 1).

Journal Entry:
"${text}"

Respond in JSON format:
{
  "primaryEmotion": "CONFIDENT|FEARFUL|GREEDY|ANXIOUS|NEUTRAL|EXCITED|FRUSTRATED",
  "sentimentScore": <number between -1 and 1>,
  "confidence": <number between 0 and 1>,
  "emotions": {
    "fear": <number between 0 and 1>,
    "greed": <number between 0 and 1>,
    "confidence": <number between 0 and 1>,
    "anxiety": <number between 0 and 1>
  }
}`;
  }

  /**
   * Generate a prompt for trade insights
   */
  public getTradeInsightsPrompt(
    trades: SerializedTrade[],
    psychProfile: PsychologicalProfile,
    patterns: PatternData
  ): string {
    const tradesContext = this.formatTradesForContext(trades.slice(-20)); // Last 20 trades
    const profileContext = this.formatPsychologicalProfile(psychProfile);
    const patternsContext = this.formatPatterns(patterns);

    return `You are an expert trading psychologist and performance analyst. Analyze the following trading data and provide comprehensive insights.

RECENT TRADES:
${tradesContext}

PSYCHOLOGICAL PROFILE:
${profileContext}

PERFORMANCE PATTERNS:
${patternsContext}

Based on this data, provide:
1. Overall Assessment: A brief summary of the trader's current state and performance
2. Key Patterns: 3-5 significant patterns you've identified (both positive and negative)
3. Recommendations: 3-5 specific, actionable recommendations for improvement
4. Warnings: Any concerning patterns or behaviors that need immediate attention
5. Emotional Correlations: How emotions are affecting performance

Respond in JSON format:
{
  "overallAssessment": "<string>",
  "patterns": ["<pattern1>", "<pattern2>", ...],
  "recommendations": ["<rec1>", "<rec2>", ...],
  "warnings": ["<warning1>", "<warning2>", ...],
  "emotionalCorrelations": [
    {
      "emotion": "<emotion>",
      "winRate": <number>,
      "avgPnL": <number>,
      "insight": "<string>"
    }
  ]
}`;
  }

  /**
   * Generate a prompt for chat assistant
   */
  public getChatPrompt(
    userMessage: string,
    trades: SerializedTrade[],
    psychProfile: PsychologicalProfile
  ): string {
    const tradesContext = this.formatTradesForContext(trades.slice(-10)); // Last 10 trades
    const profileSummary = this.formatPsychologicalProfileSummary(psychProfile);

    return `You are an AI trading journal assistant. You help traders understand their performance, patterns, and psychology.

TRADER'S RECENT HISTORY:
${tradesContext}

PSYCHOLOGICAL SUMMARY:
${profileSummary}

USER QUESTION:
"${userMessage}"

Provide a helpful, insightful response based on the trader's data. Be specific and reference actual numbers from their trading history when relevant. Keep your response concise but informative.`;
  }

  /**
   * Generate a prompt for pre-trade risk assessment
   */
  public getRiskAssessmentPrompt(
    tradeSetup: Partial<SerializedTrade>,
    psychProfile: PsychologicalProfile,
    recentTrades: SerializedTrade[]
  ): string {
    const setupContext = this.formatTradeSetup(tradeSetup);
    const profileContext = this.formatPsychologicalProfileSummary(psychProfile);
    const recentContext = this.formatRecentPerformance(recentTrades);

    return `You are a trading risk assessment expert. Evaluate the following trade setup considering the trader's psychological profile and recent performance.

PROPOSED TRADE SETUP:
${setupContext}

TRADER'S PSYCHOLOGICAL PROFILE:
${profileContext}

RECENT PERFORMANCE:
${recentContext}

Assess the risk and provide:
1. Risk Score (0-100, where 0 is lowest risk and 100 is highest risk)
2. Confidence Score (0-100, how confident you are in this assessment)
3. Positive Factors (things working in favor of this trade)
4. Negative Factors (concerns or red flags)
5. Recommendation (PROCEED, CAUTION, or AVOID)
6. Position Size Adjustment (if any, as a percentage)
7. Specific Advice (actionable suggestions)

Respond in JSON format:
{
  "riskScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "positiveFactors": ["<factor1>", "<factor2>", ...],
  "negativeFactors": ["<factor1>", "<factor2>", ...],
  "recommendation": "PROCEED|CAUTION|AVOID",
  "positionSizeAdjustment": <number, e.g., -20 for 20% reduction>,
  "advice": "<string>"
}`;
  }

  /**
   * Generate a prompt for learning aggregation
   */
  public getLearningAggregationPrompt(trades: SerializedTrade[]): string {
    const lessonsContext = this.formatLessonsFromTrades(trades);

    return `You are a trading education expert. Analyze the lessons learned from these trades and extract key insights.

LESSONS FROM TRADES:
${lessonsContext}

Identify:
1. Recurring Themes: Common lessons that appear multiple times
2. Most Impactful Lessons: Lessons that led to the biggest improvements
3. Personalized Trading Rules: 5-10 specific rules this trader should follow
4. Learning Curve Assessment: How the trader is progressing over time

Respond in JSON format:
{
  "recurringThemes": [
    {
      "theme": "<string>",
      "frequency": <number>,
      "examples": ["<example1>", "<example2>"]
    }
  ],
  "impactfulLessons": [
    {
      "lesson": "<string>",
      "impact": "<string>",
      "trades": <number>
    }
  ],
  "tradingRules": ["<rule1>", "<rule2>", ...],
  "learningCurveAssessment": "<string>"
}`;
  }

  // Helper methods for formatting context

  private formatTradesForContext(trades: SerializedTrade[]): string {
    return trades
      .map((trade, index) => {
        return `Trade ${index + 1} (${trade.date}):
  - Instrument: ${trade.instrument} (${trade.type})
  - Direction: ${trade.direction}
  - P&L: ${trade.pnl} ${trade.currency} (${trade.pnlPercentage?.toFixed(2)}%)
  - Emotion: ${trade.emotionalState}${trade.isImpulsive ? ' (IMPULSIVE)' : ''}
  - Strategy: ${trade.strategy || 'N/A'}
  - Confidence: ${trade.setupConfidence || 'N/A'}/10
  - Stress: ${trade.stressLevel || 'N/A'}/10
  - Key Lesson: ${trade.keyLesson || 'None'}
  - Mistakes: ${trade.mistakesMade.length > 0 ? trade.mistakesMade.join(', ') : 'None'}`;
      })
      .join('\n\n');
  }

  private formatPsychologicalProfile(profile: PsychologicalProfile): string {
    return `Total Trades: ${profile.totalTrades}
Win Rate: ${(profile.winRate * 100).toFixed(1)}%
Average P&L: ${profile.avgPnL.toFixed(2)}

Emotional Patterns:
${profile.dominantEmotions
  .slice(0, 3)
  .map(e => `  - ${e.emotion}: ${(e.frequency * 100).toFixed(1)}% (Avg P&L: ${e.avgPnL.toFixed(2)})`)
  .join('\n')}

Behavioral Metrics:
  - Impulsive Trade Rate: ${(profile.impulsiveTradeRate * 100).toFixed(1)}%
  - Plan Deviation Rate: ${(profile.planDeviationRate * 100).toFixed(1)}%
  - Hesitation Rate: ${(profile.hesitationRate * 100).toFixed(1)}%
  - Early Exit Rate: ${(profile.earlyExitRate * 100).toFixed(1)}%

Performance Correlations:
  - Confidence vs P&L: ${profile.confidenceVsPnLCorrelation.toFixed(2)}
  - Stress vs P&L: ${profile.stressVsPnLCorrelation.toFixed(2)}
  - Session Quality vs P&L: ${profile.sessionQualityVsPnLCorrelation.toFixed(2)}

Optimal States:
  - Physical: ${profile.optimalStates.physical || 'Unknown'}
  - Mental: ${profile.optimalStates.mental || 'Unknown'}`;
  }

  private formatPsychologicalProfileSummary(profile: PsychologicalProfile): string {
    return `Win Rate: ${(profile.winRate * 100).toFixed(1)}% | Avg P&L: ${profile.avgPnL.toFixed(2)} | Total Trades: ${profile.totalTrades}
Dominant Emotions: ${profile.dominantEmotions.slice(0, 2).map(e => e.emotion).join(', ')}
Impulsive Rate: ${(profile.impulsiveTradeRate * 100).toFixed(1)}% | Plan Deviation: ${(profile.planDeviationRate * 100).toFixed(1)}%`;
  }

  private formatPatterns(patterns: PatternData): string {
    const formatPerformance = (data: Record<string, { trades: number; winRate: number; avgPnL: number }>) => {
      return Object.entries(data)
        .sort((a, b) => b[1].avgPnL - a[1].avgPnL)
        .slice(0, 5)
        .map(([key, perf]) => `  - ${key}: ${perf.trades} trades, ${(perf.winRate * 100).toFixed(1)}% win rate, ${perf.avgPnL.toFixed(2)} avg P&L`)
        .join('\n');
    };

    return `Time of Day Performance:
${formatPerformance(patterns.timeOfDayPerformance)}

Strategy Performance:
${formatPerformance(patterns.strategyPerformance)}

Market Condition Performance:
${formatPerformance(patterns.marketConditionPerformance)}

Common Mistakes:
${patterns.commonMistakes
  .slice(0, 5)
  .map(m => `  - ${m.mistake}: ${m.frequency} times (Avg P&L: ${m.avgPnL.toFixed(2)})`)
  .join('\n')}

Success Factors:
${patterns.successFactors
  .slice(0, 5)
  .map(f => `  - ${f.factor}: ${f.frequency} times (Avg P&L: ${f.avgPnL.toFixed(2)})`)
  .join('\n')}`;
  }

  private formatTradeSetup(setup: Partial<SerializedTrade>): string {
    return `Instrument: ${setup.instrument || 'N/A'}
Type: ${setup.type || 'N/A'}
Direction: ${setup.direction || 'N/A'}
Strategy: ${setup.strategy || 'N/A'}
Market Condition: ${setup.marketCondition || 'N/A'}
Time of Day: ${setup.timeOfDay || 'N/A'}
Setup Confidence: ${setup.setupConfidence || 'N/A'}/10
Risk-Reward Ratio: ${setup.riskRewardRatio || 'N/A'}
Emotional State: ${setup.emotionalState || 'N/A'}
Physical State: ${setup.physicalState || 'N/A'}
Mental State: ${setup.mentalState || 'N/A'}
External Factors: ${setup.externalFactors?.join(', ') || 'None'}`;
  }

  private formatRecentPerformance(trades: SerializedTrade[]): string {
    const recentTrades = trades.slice(-5);
    const wins = recentTrades.filter(t => t.pnl > 0).length;
    const totalPnL = recentTrades.reduce((sum, t) => sum + t.pnl, 0);

    return `Last 5 Trades: ${wins} wins, ${recentTrades.length - wins} losses
Total P&L: ${totalPnL.toFixed(2)}
Current Streak: ${this.calculateStreak(recentTrades)}`;
  }

  private formatLessonsFromTrades(trades: SerializedTrade[]): string {
    return trades
      .filter(t => t.keyLesson)
      .map((trade, index) => {
        return `Trade ${index + 1} (${trade.date}, P&L: ${trade.pnl}):
  Lesson: ${trade.keyLesson}
  What Went Well: ${trade.whatWentWell || 'N/A'}
  Mistakes: ${trade.mistakesMade.join(', ') || 'None'}`;
      })
      .join('\n\n');
  }

  private calculateStreak(trades: SerializedTrade[]): string {
    if (trades.length === 0) return 'No trades';

    let streak = 1;
    const lastTrade = trades[trades.length - 1];
    const isWinning = lastTrade.pnl > 0;

    for (let i = trades.length - 2; i >= 0; i--) {
      const currentIsWinning = trades[i].pnl > 0;
      if (currentIsWinning === isWinning) {
        streak++;
      } else {
        break;
      }
    }

    return `${streak} ${isWinning ? 'winning' : 'losing'} trade${streak > 1 ? 's' : ''}`;
  }

  /**
   * Replace variables in a template string
   */
  public replaceVariables(template: string, variables: TemplateVariables): string {
    let result = template;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value));
    });
    return result;
  }
}

// Singleton instance
export const promptTemplatesService = new PromptTemplatesService();
