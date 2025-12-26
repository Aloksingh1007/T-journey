import { BaseAIService, AIResponse } from './base-ai.service';
import { TradeWithRelations, dataPreparationService } from './data-preparation.service';
import { EmotionalState } from '@prisma/client';

/**
 * Emotion timeline showing emotional journey through trade lifecycle
 */
export interface EmotionTimeline {
  tradeId: string;
  preTrade: {
    emotion: EmotionalState;
    confidence: number | null;
    hesitation: boolean | null;
    sentiment: string;
  };
  duringTrade: {
    stressLevel: number | null;
    consideredEarlyExit: boolean | null;
    sentiment: string;
  };
  postTrade: {
    satisfaction: number | null;
    sentiment: string;
    keyInsights: string[];
  };
  overallSentiment: number; // -1 to 1
  emotionalJourney: string; // AI-generated narrative
}

/**
 * Sentiment analysis result for text fields
 */
export interface SentimentAnalysis {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  emotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    confidence: number;
  };
  keyPhrases: string[];
}

/**
 * Emotion-performance correlation data
 */
export interface EmotionPerformanceCorrelation {
  emotion: EmotionalState;
  totalTrades: number;
  winRate: number;
  avgPnL: number;
  avgConfidence: number;
  avgStress: number;
  impulsiveRate: number;
  planDeviationRate: number;
  recommendation: string;
}

/**
 * Emotional pattern detected in trading behavior
 */
export interface EmotionalPattern {
  patternType: 'greedy_after_wins' | 'fearful_after_losses' | 'revenge_trading' | 
                'overconfident' | 'analysis_paralysis' | 'fomo' | 'emotional_volatility';
  description: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  impactScore: number; // Impact on P&L
  examples: string[]; // Trade IDs
  recommendation: string;
}

/**
 * Stress-performance analysis
 */
export interface StressPerformanceAnalysis {
  avgStressLevel: number;
  stressVsPnLCorrelation: number;
  optimalStressRange: { min: number; max: number };
  highStressTrades: {
    count: number;
    winRate: number;
    avgPnL: number;
  };
  lowStressTrades: {
    count: number;
    winRate: number;
    avgPnL: number;
  };
  recommendation: string;
}

/**
 * Multi-dimensional emotion analysis service
 */
export class EmotionAnalysisService extends BaseAIService {

  /**
   * Analyze emotion timeline for a single trade
   */
  public async analyzeEmotionTimeline(
    trade: TradeWithRelations,
    userId: string
  ): Promise<AIResponse<EmotionTimeline>> {
    try {
      // Check if AI is configured, if not return basic analysis
      if (!this.isInitialized || !this.groq) {
        console.log('[Emotion Analysis] Groq AI not configured, returning basic analysis');
        return this.getBasicEmotionTimeline(trade);
      }

      this.checkRateLimit(userId);

      const serializedTrade = dataPreparationService.serializeTrade(trade);

      const result = await this.executeWithRetry(
        async () => {
          const completion = await this.groq!.chat.completions.create({
            model: 'groq/compound',
            messages: [
              {
                role: 'system',
                content: `You are a personal trading psychologist speaking directly to the trader. Use "you" and "your" to make it personal and engaging. Analyze their complete trade journey from the 5-step form data and provide meaningful, actionable insights. Respond ONLY with valid JSON.`
              },
              {
                role: 'user',
                content: `Analyze this trade's emotional timeline and respond with ONLY a JSON object (no markdown, no explanation):

Pre-Trade:
- Emotional State: ${serializedTrade.emotionalState}
- Setup Confidence: ${serializedTrade.setupConfidence || 'N/A'}/10
- Had Hesitation: ${serializedTrade.hadHesitation ? 'Yes' : 'No'}
- Impulsive: ${serializedTrade.isImpulsive ? 'Yes' : 'No'}

During Trade:
- Stress Level: ${serializedTrade.stressLevel || 'N/A'}/10
- Considered Early Exit: ${serializedTrade.consideredEarlyExit ? 'Yes' : 'No'}

Post-Trade:
- Exit Satisfaction: ${serializedTrade.exitSatisfaction || 'N/A'}/10
- P&L: ${serializedTrade.pnl} ${serializedTrade.currency} (${Number(serializedTrade.pnl) > 0 ? 'PROFIT' : 'LOSS'})
- Key Lesson: ${serializedTrade.keyLesson || 'None'}

CRITICAL RULES:
1. Use "you" and "your" (e.g., "You started feeling...", "Your confidence was...")
2. overallSentiment MUST be a NUMBER between -1 and 1 (not a string):
   - For LOSSES: Use NEGATIVE values (-0.8 to -0.1) - bigger loss = more negative
   - For PROFITS: Use POSITIVE values (0.1 to 0.8) - bigger profit = more positive
   - Current P&L: ${serializedTrade.pnl} ${serializedTrade.currency}
   - Loss % matters: -12% loss should be around -0.6 to -0.7
3. emotionalJourney: 2-3 sentences in second person, empathetic tone
4. keyInsights: 3-4 actionable pieces of advice in second person

Respond with this exact JSON structure:
{
  "overallSentiment": -0.6,
  "emotionalJourney": "You started with...",
  "keyInsights": ["You should...", "Consider...", "Next time try..."]
}`
              }
            ],
            temperature: 0.3,
            max_tokens: 1000,
          });

          return completion;
        },
        userId,
        'analyzeEmotionTimeline'
      );

      const content = result.choices[0]?.message?.content || '{}';
      
      // Try to extract JSON from the response (in case it's wrapped in markdown)
      let jsonContent = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonContent.startsWith('```json')) {
        jsonContent = jsonContent.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonContent.startsWith('```')) {
        jsonContent = jsonContent.replace(/```\n?/g, '');
      }
      
      // Try to find JSON object in the response
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
      }
      
      let aiAnalysis;
      try {
        aiAnalysis = JSON.parse(jsonContent);
      } catch (parseError) {
        console.error('[Emotion Analysis] Failed to parse AI response:', content);
        // Return default values if parsing fails
        aiAnalysis = {
          overallSentiment: 0,
          emotionalJourney: 'Unable to generate AI analysis. Using basic analysis.',
          keyInsights: []
        };
      }

      const timeline: EmotionTimeline = {
        tradeId: trade.id,
        preTrade: {
          emotion: trade.emotionalState,
          confidence: trade.setupConfidence,
          hesitation: trade.hadHesitation,
          sentiment: this.getPreTradeSentiment(trade),
        },
        duringTrade: {
          stressLevel: trade.stressLevel,
          consideredEarlyExit: trade.consideredEarlyExit,
          sentiment: this.getDuringTradeSentiment(trade),
        },
        postTrade: {
          satisfaction: trade.exitSatisfaction,
          sentiment: this.getPostTradeSentiment(trade),
          keyInsights: aiAnalysis.keyInsights || [],
        },
        overallSentiment: aiAnalysis.overallSentiment || 0,
        emotionalJourney: aiAnalysis.emotionalJourney || '',
      };

      this.recordRequest(userId, result.usage?.total_tokens || 0);

      return {
        success: true,
        data: timeline,
        tokensUsed: result.usage?.total_tokens,
      };
    } catch (error) {
      this.recordFailure(userId);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Get basic emotion timeline without AI (fallback when OpenAI is not configured)
   */
  private getBasicEmotionTimeline(trade: TradeWithRelations): AIResponse<EmotionTimeline> {
    const keyInsights: string[] = [];
    if (trade.keyLesson) keyInsights.push(trade.keyLesson);
    if (trade.whatWentWell) keyInsights.push(trade.whatWentWell);
    if (trade.wouldDoDifferently) keyInsights.push(trade.wouldDoDifferently);

    // Calculate basic sentiment score
    let sentimentScore = 0;
    if (Number(trade.pnl) > 0) sentimentScore += 0.3;
    if (Number(trade.pnl) < 0) sentimentScore -= 0.3;
    if (trade.setupConfidence && trade.setupConfidence >= 7) sentimentScore += 0.2;
    if (trade.setupConfidence && trade.setupConfidence <= 3) sentimentScore -= 0.2;
    if (trade.exitSatisfaction && trade.exitSatisfaction >= 7) sentimentScore += 0.2;
    if (trade.exitSatisfaction && trade.exitSatisfaction <= 3) sentimentScore -= 0.2;
    if (trade.stressLevel && trade.stressLevel >= 7) sentimentScore -= 0.2;
    if (trade.hadHesitation) sentimentScore -= 0.1;
    if (trade.isImpulsive) sentimentScore -= 0.15;

    // Generate basic emotional journey narrative
    const pnlResult = Number(trade.pnl) > 0 ? 'profitable' : 'losing';
    const emotionWord = trade.emotionalState.toLowerCase();
    const confidenceLevel = trade.setupConfidence 
      ? trade.setupConfidence >= 7 ? 'high' : trade.setupConfidence <= 3 ? 'low' : 'moderate'
      : 'unknown';
    
    const emotionalJourney = `This ${pnlResult} trade was entered with ${emotionWord} emotions and ${confidenceLevel} confidence. ` +
      (trade.stressLevel && trade.stressLevel >= 7 ? 'High stress levels during the trade may have affected decision-making. ' : '') +
      (trade.hadHesitation ? 'Initial hesitation suggests uncertainty about the setup. ' : '') +
      (trade.isImpulsive ? 'The impulsive nature of this trade indicates emotional decision-making. ' : '') +
      (trade.exitSatisfaction && trade.exitSatisfaction >= 7 ? 'The trader was satisfied with the exit execution.' : 
       trade.exitSatisfaction && trade.exitSatisfaction <= 3 ? 'The trader was dissatisfied with the exit execution.' : '');

    const timeline: EmotionTimeline = {
      tradeId: trade.id,
      preTrade: {
        emotion: trade.emotionalState,
        confidence: trade.setupConfidence,
        hesitation: trade.hadHesitation,
        sentiment: this.getBasicPreTradeSentiment(trade),
      },
      duringTrade: {
        stressLevel: trade.stressLevel,
        consideredEarlyExit: trade.consideredEarlyExit,
        sentiment: this.getBasicDuringTradeSentiment(trade),
      },
      postTrade: {
        satisfaction: trade.exitSatisfaction,
        sentiment: this.getBasicPostTradeSentiment(trade),
        keyInsights: keyInsights.slice(0, 3),
      },
      overallSentiment: Math.max(-1, Math.min(1, sentimentScore)),
      emotionalJourney,
    };

    return {
      success: true,
      data: timeline,
      tokensUsed: 0,
    };
  }

  private getBasicPreTradeSentiment(trade: TradeWithRelations): string {
    const confidence = trade.setupConfidence || 5;
    const hesitation = trade.hadHesitation;
    const impulsive = trade.isImpulsive;

    if (impulsive) return 'impulsive';
    if (hesitation) return 'uncertain';
    if (confidence >= 8) return 'confident';
    if (confidence <= 3) return 'doubtful';
    return 'neutral';
  }

  private getBasicDuringTradeSentiment(trade: TradeWithRelations): string {
    const stress = trade.stressLevel || 5;
    const consideredExit = trade.consideredEarlyExit;

    if (stress >= 8) return 'highly stressed';
    if (stress >= 6) return 'stressed';
    if (consideredExit) return 'anxious';
    if (stress <= 3) return 'calm';
    return 'moderate';
  }

  private getBasicPostTradeSentiment(trade: TradeWithRelations): string {
    const satisfaction = trade.exitSatisfaction || 5;
    const pnl = Number(trade.pnl);

    if (pnl > 0 && satisfaction >= 8) return 'very satisfied';
    if (pnl > 0 && satisfaction >= 6) return 'satisfied';
    if (pnl > 0 && satisfaction < 6) return 'won but unsatisfied';
    if (pnl < 0 && satisfaction >= 6) return 'lost but learned';
    if (pnl < 0 && satisfaction < 4) return 'disappointed';
    return 'neutral';
  }

  /**
   * Analyze sentiment of free-text fields
   */
  public async analyzeSentiment(
    text: string,
    userId: string
  ): Promise<AIResponse<SentimentAnalysis>> {
    try {
      this.ensureInitialized();
      this.checkRateLimit(userId);

      const result = await this.executeWithRetry(
        async () => {
          const completion = await this.groq!.chat.completions.create({
            model: 'groq/compound',
            messages: [
              {
                role: 'system',
                content: `You are a sentiment analysis expert. Analyze the emotional content of trading journal entries.
                Return your analysis as a JSON object with sentiment, score (-1 to 1), emotions (joy, sadness, anger, fear, confidence as 0-1 values), and keyPhrases.`
              },
              {
                role: 'user',
                content: `Analyze the sentiment of this text: "${text}"`
              }
            ],
            temperature: 0.3,
            max_tokens: 500,
          });

          return completion;
        },
        userId,
        'analyzeSentiment'
      );

      const content = result.choices[0]?.message?.content || '{}';
      const aiAnalysis = JSON.parse(content);

      const analysis: SentimentAnalysis = {
        text,
        sentiment: aiAnalysis.sentiment || 'neutral',
        score: aiAnalysis.score || 0,
        emotions: aiAnalysis.emotions || {
          joy: 0,
          sadness: 0,
          anger: 0,
          fear: 0,
          confidence: 0,
        },
        keyPhrases: aiAnalysis.keyPhrases || [],
      };

      this.recordRequest(userId, result.usage?.total_tokens || 0);

      return {
        success: true,
        data: analysis,
        tokensUsed: result.usage?.total_tokens,
      };
    } catch (error) {
      this.recordFailure(userId);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Calculate emotion-performance correlations
   */
  public calculateEmotionPerformanceCorrelation(
    trades: TradeWithRelations[]
  ): EmotionPerformanceCorrelation[] {
    const emotionGroups = new Map<EmotionalState, TradeWithRelations[]>();

    // Group trades by emotion
    trades.forEach(trade => {
      const emotion = trade.emotionalState;
      if (!emotionGroups.has(emotion)) {
        emotionGroups.set(emotion, []);
      }
      emotionGroups.get(emotion)!.push(trade);
    });

    // Calculate metrics for each emotion
    const correlations: EmotionPerformanceCorrelation[] = [];

    emotionGroups.forEach((emotionTrades, emotion) => {
      const totalTrades = emotionTrades.length;
      const winningTrades = emotionTrades.filter(t => Number(t.pnl) > 0).length;
      const winRate = winningTrades / totalTrades;
      const avgPnL = emotionTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / totalTrades;

      const tradesWithConfidence = emotionTrades.filter(t => t.setupConfidence !== null);
      const avgConfidence = tradesWithConfidence.length > 0
        ? tradesWithConfidence.reduce((sum, t) => sum + (t.setupConfidence || 0), 0) / tradesWithConfidence.length
        : 0;

      const tradesWithStress = emotionTrades.filter(t => t.stressLevel !== null);
      const avgStress = tradesWithStress.length > 0
        ? tradesWithStress.reduce((sum, t) => sum + (t.stressLevel || 0), 0) / tradesWithStress.length
        : 0;

      const impulsiveRate = emotionTrades.filter(t => t.isImpulsive).length / totalTrades;
      const planDeviationRate = emotionTrades.filter(t => t.deviatedFromPlan === true).length / totalTrades;

      const recommendation = this.generateEmotionRecommendation(
        emotion,
        winRate,
        avgPnL,
        impulsiveRate,
        planDeviationRate
      );

      correlations.push({
        emotion,
        totalTrades,
        winRate,
        avgPnL,
        avgConfidence,
        avgStress,
        impulsiveRate,
        planDeviationRate,
        recommendation,
      });
    });

    return correlations.sort((a, b) => b.avgPnL - a.avgPnL);
  }

  /**
   * Detect emotional patterns in trading behavior
   */
  public async detectEmotionalPatterns(
    trades: TradeWithRelations[],
    userId: string
  ): Promise<AIResponse<EmotionalPattern[]>> {
    try {
      this.ensureInitialized();
      this.checkRateLimit(userId);

      const patterns: EmotionalPattern[] = [];

      // Pattern 1: Greedy after wins
      const greedyAfterWins = this.detectGreedyAfterWins(trades);
      if (greedyAfterWins) patterns.push(greedyAfterWins);

      // Pattern 2: Fearful after losses
      const fearfulAfterLosses = this.detectFearfulAfterLosses(trades);
      if (fearfulAfterLosses) patterns.push(fearfulAfterLosses);

      // Pattern 3: Revenge trading
      const revengeTrading = this.detectRevengeTrading(trades);
      if (revengeTrading) patterns.push(revengeTrading);

      // Pattern 4: Overconfidence
      const overconfidence = this.detectOverconfidence(trades);
      if (overconfidence) patterns.push(overconfidence);

      // Pattern 5: Analysis paralysis
      const analysisParalysis = this.detectAnalysisParalysis(trades);
      if (analysisParalysis) patterns.push(analysisParalysis);

      // Pattern 6: FOMO
      const fomo = this.detectFOMO(trades);
      if (fomo) patterns.push(fomo);

      // Pattern 7: Emotional volatility
      const emotionalVolatility = this.detectEmotionalVolatility(trades);
      if (emotionalVolatility) patterns.push(emotionalVolatility);

      // Use AI to enhance pattern descriptions
      if (patterns.length > 0 && this.isAvailable()) {
        const enhancedPatterns = await this.enhancePatternsWithAI(patterns, trades, userId);
        if (enhancedPatterns.success && enhancedPatterns.data) {
          return enhancedPatterns;
        }
      }

      return {
        success: true,
        data: patterns,
      };
    } catch (error) {
      this.recordFailure(userId);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Analyze stress-performance relationship
   */
  public analyzeStressPerformance(trades: TradeWithRelations[]): StressPerformanceAnalysis {
    const tradesWithStress = trades.filter(t => t.stressLevel !== null);

    if (tradesWithStress.length === 0) {
      return {
        avgStressLevel: 0,
        stressVsPnLCorrelation: 0,
        optimalStressRange: { min: 0, max: 0 },
        highStressTrades: { count: 0, winRate: 0, avgPnL: 0 },
        lowStressTrades: { count: 0, winRate: 0, avgPnL: 0 },
        recommendation: 'Not enough data to analyze stress patterns.',
      };
    }

    const avgStressLevel = tradesWithStress.reduce((sum, t) => sum + (t.stressLevel || 0), 0) / tradesWithStress.length;

    // Calculate correlation
    const stressLevels = tradesWithStress.map(t => t.stressLevel || 0);
    const pnls = tradesWithStress.map(t => Number(t.pnl));
    const stressVsPnLCorrelation = this.calculateCorrelation(stressLevels, pnls);

    // Find optimal stress range
    const stressRanges = [
      { min: 1, max: 3, trades: tradesWithStress.filter(t => (t.stressLevel || 0) >= 1 && (t.stressLevel || 0) <= 3) },
      { min: 4, max: 6, trades: tradesWithStress.filter(t => (t.stressLevel || 0) >= 4 && (t.stressLevel || 0) <= 6) },
      { min: 7, max: 10, trades: tradesWithStress.filter(t => (t.stressLevel || 0) >= 7 && (t.stressLevel || 0) <= 10) },
    ];

    let optimalRange = { min: 0, max: 0 };
    let maxAvgPnL = -Infinity;

    stressRanges.forEach(range => {
      if (range.trades.length > 0) {
        const avgPnL = range.trades.reduce((sum, t) => sum + Number(t.pnl), 0) / range.trades.length;
        if (avgPnL > maxAvgPnL) {
          maxAvgPnL = avgPnL;
          optimalRange = { min: range.min, max: range.max };
        }
      }
    });

    // High stress trades (7-10)
    const highStressTrades = tradesWithStress.filter(t => (t.stressLevel || 0) >= 7);
    const highStressWins = highStressTrades.filter(t => Number(t.pnl) > 0).length;
    const highStressAvgPnL = highStressTrades.length > 0
      ? highStressTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / highStressTrades.length
      : 0;

    // Low stress trades (1-3)
    const lowStressTrades = tradesWithStress.filter(t => (t.stressLevel || 0) <= 3);
    const lowStressWins = lowStressTrades.filter(t => Number(t.pnl) > 0).length;
    const lowStressAvgPnL = lowStressTrades.length > 0
      ? lowStressTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / lowStressTrades.length
      : 0;

    const recommendation = this.generateStressRecommendation(
      avgStressLevel,
      stressVsPnLCorrelation,
      optimalRange,
      highStressAvgPnL,
      lowStressAvgPnL
    );

    return {
      avgStressLevel,
      stressVsPnLCorrelation,
      optimalStressRange: optimalRange,
      highStressTrades: {
        count: highStressTrades.length,
        winRate: highStressTrades.length > 0 ? highStressWins / highStressTrades.length : 0,
        avgPnL: highStressAvgPnL,
      },
      lowStressTrades: {
        count: lowStressTrades.length,
        winRate: lowStressTrades.length > 0 ? lowStressWins / lowStressTrades.length : 0,
        avgPnL: lowStressAvgPnL,
      },
      recommendation,
    };
  }

  // Helper methods for pattern detection

  private detectGreedyAfterWins(trades: TradeWithRelations[]): EmotionalPattern | null {
    const sortedTrades = [...trades].sort((a, b) => a.tradeDate.getTime() - b.tradeDate.getTime());
    let greedyAfterWinCount = 0;
    const examples: string[] = [];

    for (let i = 1; i < sortedTrades.length; i++) {
      const prevTrade = sortedTrades[i - 1];
      const currentTrade = sortedTrades[i];

      if (Number(prevTrade.pnl) > 0 && currentTrade.emotionalState === 'GREEDY') {
        greedyAfterWinCount++;
        if (examples.length < 3) examples.push(currentTrade.id);
      }
    }

    if (greedyAfterWinCount >= 3) {
      const frequency = greedyAfterWinCount / (sortedTrades.length - 1);
      const greedyTrades = sortedTrades.filter(t => t.emotionalState === 'GREEDY');
      const avgPnL = greedyTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / greedyTrades.length;

      return {
        patternType: 'greedy_after_wins',
        description: 'You tend to become greedy after winning trades, which may lead to overtrading or taking excessive risks.',
        frequency,
        impact: avgPnL < 0 ? 'negative' : 'neutral',
        impactScore: avgPnL,
        examples,
        recommendation: 'After a winning trade, take a break to reset emotionally. Stick to your trading plan and avoid increasing position sizes impulsively.',
      };
    }

    return null;
  }

  private detectFearfulAfterLosses(trades: TradeWithRelations[]): EmotionalPattern | null {
    const sortedTrades = [...trades].sort((a, b) => a.tradeDate.getTime() - b.tradeDate.getTime());
    let fearfulAfterLossCount = 0;
    const examples: string[] = [];

    for (let i = 1; i < sortedTrades.length; i++) {
      const prevTrade = sortedTrades[i - 1];
      const currentTrade = sortedTrades[i];

      if (Number(prevTrade.pnl) < 0 && currentTrade.emotionalState === 'FEARFUL') {
        fearfulAfterLossCount++;
        if (examples.length < 3) examples.push(currentTrade.id);
      }
    }

    if (fearfulAfterLossCount >= 3) {
      const frequency = fearfulAfterLossCount / (sortedTrades.length - 1);
      const fearfulTrades = sortedTrades.filter(t => t.emotionalState === 'FEARFUL');
      const avgPnL = fearfulTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / fearfulTrades.length;

      return {
        patternType: 'fearful_after_losses',
        description: 'You become fearful after losing trades, which may cause you to miss good opportunities or exit trades too early.',
        frequency,
        impact: avgPnL < 0 ? 'negative' : 'neutral',
        impactScore: avgPnL,
        examples,
        recommendation: 'Losses are part of trading. Review your strategy objectively and trust your analysis. Consider reducing position size temporarily to rebuild confidence.',
      };
    }

    return null;
  }

  private detectRevengeTrading(trades: TradeWithRelations[]): EmotionalPattern | null {
    const sortedTrades = [...trades].sort((a, b) => a.tradeDate.getTime() - b.tradeDate.getTime());
    let revengeTradingCount = 0;
    const examples: string[] = [];

    for (let i = 1; i < sortedTrades.length; i++) {
      const prevTrade = sortedTrades[i - 1];
      const currentTrade = sortedTrades[i];

      // Revenge trading: impulsive trade shortly after a loss
      const timeDiff = currentTrade.tradeDate.getTime() - prevTrade.tradeDate.getTime();
      const sameDay = timeDiff < 24 * 60 * 60 * 1000;

      if (Number(prevTrade.pnl) < 0 && currentTrade.isImpulsive && sameDay) {
        revengeTradingCount++;
        if (examples.length < 3) examples.push(currentTrade.id);
      }
    }

    if (revengeTradingCount >= 2) {
      const frequency = revengeTradingCount / (sortedTrades.length - 1);
      const revengeTrades = sortedTrades.filter((t, i) => {
        if (i === 0) return false;
        const prevTrade = sortedTrades[i - 1];
        const timeDiff = t.tradeDate.getTime() - prevTrade.tradeDate.getTime();
        return Number(prevTrade.pnl) < 0 && t.isImpulsive && timeDiff < 24 * 60 * 60 * 1000;
      });
      const avgPnL = revengeTrades.length > 0
        ? revengeTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / revengeTrades.length
        : 0;

      return {
        patternType: 'revenge_trading',
        description: 'You tend to take impulsive trades shortly after losses, trying to recover quickly. This often leads to more losses.',
        frequency,
        impact: 'negative',
        impactScore: avgPnL,
        examples,
        recommendation: 'CRITICAL: Stop trading immediately after a loss. Take at least a 30-minute break. Never try to "win back" losses in the same session.',
      };
    }

    return null;
  }

  private detectOverconfidence(trades: TradeWithRelations[]): EmotionalPattern | null {
    const confidentTrades = trades.filter(t => t.emotionalState === 'CONFIDENT' && (t.setupConfidence || 0) >= 8);

    if (confidentTrades.length >= 5) {
      const frequency = confidentTrades.length / trades.length;
      const avgPnL = confidentTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / confidentTrades.length;
      const winRate = confidentTrades.filter(t => Number(t.pnl) > 0).length / confidentTrades.length;
      const examples = confidentTrades.slice(0, 3).map(t => t.id);

      // Overconfidence is problematic if win rate is low despite high confidence
      if (winRate < 0.5) {
        return {
          patternType: 'overconfident',
          description: `You frequently trade with high confidence (${confidentTrades.length} trades), but your win rate is only ${(winRate * 100).toFixed(1)}%. This suggests overconfidence.`,
          frequency,
          impact: 'negative',
          impactScore: avgPnL,
          examples,
          recommendation: 'Be more critical of your setups. High confidence should be backed by solid analysis. Consider keeping a checklist of criteria before entering trades.',
        };
      }
    }

    return null;
  }

  private detectAnalysisParalysis(trades: TradeWithRelations[]): EmotionalPattern | null {
    const hesitantTrades = trades.filter(t => t.hadHesitation === true);

    if (hesitantTrades.length >= 5) {
      const frequency = hesitantTrades.length / trades.length;
      const avgPnL = hesitantTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / hesitantTrades.length;
      const examples = hesitantTrades.slice(0, 3).map(t => t.id);

      // Check if hesitation led to missed opportunities (late entries)
      const lateEntries = hesitantTrades.filter(t => Number(t.pnl) < 0);

      if (lateEntries.length / hesitantTrades.length > 0.6) {
        return {
          patternType: 'analysis_paralysis',
          description: `You hesitated before entering ${hesitantTrades.length} trades. This often leads to late entries and missed opportunities.`,
          frequency,
          impact: 'negative',
          impactScore: avgPnL,
          examples,
          recommendation: 'Trust your analysis more. Create a simple entry checklist and execute when criteria are met. Overthinking often leads to worse outcomes.',
        };
      }
    }

    return null;
  }

  private detectFOMO(trades: TradeWithRelations[]): EmotionalPattern | null {
    const fomoTrades = trades.filter(t => 
      t.isImpulsive && 
      (t.emotionalState === 'EXCITED' || t.emotionalState === 'ANXIOUS') &&
      t.entryTrigger?.toLowerCase().includes('fomo')
    );

    if (fomoTrades.length >= 3) {
      const frequency = fomoTrades.length / trades.length;
      const avgPnL = fomoTrades.reduce((sum, t) => sum + Number(t.pnl), 0) / fomoTrades.length;
      const examples = fomoTrades.slice(0, 3).map(t => t.id);

      return {
        patternType: 'fomo',
        description: `You've taken ${fomoTrades.length} trades driven by FOMO (Fear of Missing Out). These trades are typically impulsive and poorly planned.`,
        frequency,
        impact: 'negative',
        impactScore: avgPnL,
        examples,
        recommendation: 'FOMO is a trader\'s enemy. If you feel rushed to enter a trade, step back. There will always be another opportunity. Wait for your setup.',
      };
    }

    return null;
  }

  private detectEmotionalVolatility(trades: TradeWithRelations[]): EmotionalPattern | null {
    if (trades.length < 10) return null;

    const emotionChanges = new Set<EmotionalState>();
    trades.forEach(t => emotionChanges.add(t.emotionalState));

    // High emotional volatility if using 5+ different emotions
    if (emotionChanges.size >= 5) {
      const avgPnL = trades.reduce((sum, t) => sum + Number(t.pnl), 0) / trades.length;
      const examples = trades.slice(0, 3).map(t => t.id);

      return {
        patternType: 'emotional_volatility',
        description: `Your emotional state varies significantly across trades (${emotionChanges.size} different emotions). This suggests inconsistent mental preparation.`,
        frequency: emotionChanges.size / 7, // 7 possible emotions
        impact: 'neutral',
        impactScore: avgPnL,
        examples,
        recommendation: 'Work on emotional consistency. Develop a pre-trade routine to get into the right mindset. Consider meditation or breathing exercises.',
      };
    }

    return null;
  }

  private async enhancePatternsWithAI(
    patterns: EmotionalPattern[],
    trades: TradeWithRelations[],
    userId: string
  ): Promise<AIResponse<EmotionalPattern[]>> {
    try {
      const result = await this.executeWithRetry(
        async () => {
          const completion = await this.groq!.chat.completions.create({
            model: 'groq/compound',
            messages: [
              {
                role: 'system',
                content: 'You are a trading psychologist. Enhance the pattern descriptions and recommendations to be more actionable and personalized.'
              },
              {
                role: 'user',
                content: `Enhance these emotional patterns with better descriptions and recommendations:
                ${JSON.stringify(patterns, null, 2)}
                
                Context: ${trades.length} total trades analyzed.`
              }
            ],
            temperature: 0.7,
            max_tokens: 1500,
          });

          return completion;
        },
        userId,
        'enhancePatterns'
      );

      const content = result.choices[0]?.message?.content || '[]';
      const enhancedPatterns = JSON.parse(content);

      this.recordRequest(userId, result.usage?.total_tokens || 0);

      return {
        success: true,
        data: enhancedPatterns,
        tokensUsed: result.usage?.total_tokens,
      };
    } catch (error) {
      // Return original patterns if AI enhancement fails
      return {
        success: true,
        data: patterns,
      };
    }
  }

  // Helper methods for sentiment calculation

  private getPreTradeSentiment(trade: TradeWithRelations): string {
    const confidence = trade.setupConfidence || 5;
    const hesitation = trade.hadHesitation;
    const impulsive = trade.isImpulsive;

    if (impulsive) return 'impulsive';
    if (hesitation) return 'uncertain';
    if (confidence >= 8) return 'confident';
    if (confidence <= 3) return 'doubtful';
    return 'neutral';
  }

  private getDuringTradeSentiment(trade: TradeWithRelations): string {
    const stress = trade.stressLevel || 5;
    const consideredExit = trade.consideredEarlyExit;

    if (stress >= 8) return 'highly stressed';
    if (stress >= 6) return 'stressed';
    if (consideredExit) return 'anxious';
    if (stress <= 3) return 'calm';
    return 'moderate';
  }

  private getPostTradeSentiment(trade: TradeWithRelations): string {
    const satisfaction = trade.exitSatisfaction || 5;
    const pnl = Number(trade.pnl);

    if (pnl > 0 && satisfaction >= 8) return 'very satisfied';
    if (pnl > 0 && satisfaction >= 6) return 'satisfied';
    if (pnl > 0 && satisfaction < 6) return 'won but unsatisfied';
    if (pnl < 0 && satisfaction >= 6) return 'lost but learned';
    if (pnl < 0 && satisfaction < 4) return 'disappointed';
    return 'neutral';
  }

  private generateEmotionRecommendation(
    emotion: EmotionalState,
    winRate: number,
    avgPnL: number,
    impulsiveRate: number,
    planDeviationRate: number
  ): string {
    if (avgPnL > 0 && winRate > 0.6) {
      return `${emotion} trades are working well for you. Continue trading in this emotional state.`;
    }

    if (avgPnL < 0 || winRate < 0.4) {
      return `${emotion} trades are underperforming. Consider avoiding trades when feeling ${emotion.toLowerCase()}.`;
    }

    if (impulsiveRate > 0.5) {
      return `When ${emotion.toLowerCase()}, you tend to be impulsive. Take extra time to validate your setups.`;
    }

    if (planDeviationRate > 0.5) {
      return `When ${emotion.toLowerCase()}, you often deviate from your plan. Stick to your strategy more strictly.`;
    }

    return `${emotion} trades show mixed results. Focus on following your trading plan consistently.`;
  }

  private generateStressRecommendation(
    avgStress: number,
    correlation: number,
    optimalRange: { min: number; max: number },
    highStressAvgPnL: number,
    lowStressAvgPnL: number
  ): string {
    if (correlation < -0.5) {
      return `High stress is negatively impacting your performance. Your optimal stress range is ${optimalRange.min}-${optimalRange.max}. Practice stress management techniques.`;
    }

    if (highStressAvgPnL < lowStressAvgPnL) {
      return `You perform better with lower stress levels. Avoid trading when stress is above ${optimalRange.max}. Take breaks and manage position sizes.`;
    }

    if (avgStress > 7) {
      return `Your average stress level (${avgStress.toFixed(1)}/10) is high. This can lead to poor decisions. Consider reducing position sizes or taking fewer trades.`;
    }

    return `Your stress levels are manageable. Continue monitoring and maintain your current approach.`;
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
}

// Singleton instance
export const emotionAnalysisService = new EmotionAnalysisService();
