// User Profile Types
export type TradingStyle = 'DAY_TRADER' | 'SWING_TRADER' | 'SCALPER' | 'POSITION_TRADER' | 'ALGORITHMIC' | 'HYBRID';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
export type ProfileVisibility = 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'trading' | 'consistency' | 'learning' | 'milestone';
}

export interface Milestones {
  firstTrade?: boolean;
  trades10?: boolean;
  trades50?: boolean;
  trades100?: boolean;
  trades500?: boolean;
  trades1000?: boolean;
  winStreak5?: boolean;
  winStreak10?: boolean;
  profitMilestone1000?: boolean;
  profitMilestone10000?: boolean;
  profitMilestone100000?: boolean;
  perfectWeek?: boolean;
  perfectMonth?: boolean;
  journalStreak7?: boolean;
  journalStreak30?: boolean;
  journalStreak100?: boolean;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  shareStats: boolean;
  shareTrades: boolean;
  shareEmotions: boolean;
  sharePatterns: boolean;
}

export interface ProfileStats {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  currentStreak: number;
  longestWinStreak: number;
  bestTradeDate?: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  bio?: string | null;
  avatar?: string | null;
  tradingStyle?: TradingStyle | null;
  experienceLevel?: ExperienceLevel | null;
  profileVisibility?: ProfileVisibility;
  shareStats?: boolean;
  shareTrades?: boolean;
  shareEmotions?: boolean;
  sharePatterns?: boolean;
  totalTrades?: number;
  winRate?: number;
  totalPnL?: number;
  currentStreak?: number;
  longestWinStreak?: number;
  bestTradeDate?: string;
  badges?: Badge[];
  milestones?: Milestones;
  createdAt: string;
}

export interface UpdateProfileDTO {
  name?: string;
  bio?: string;
  avatar?: string;
  tradingStyle?: TradingStyle;
  experienceLevel?: ExperienceLevel;
}

export interface UpdatePrivacySettingsDTO {
  profileVisibility?: ProfileVisibility;
  shareStats?: boolean;
  shareTrades?: boolean;
  shareEmotions?: boolean;
  sharePatterns?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

// Trade Types
export type TradeType = 'CRYPTO' | 'STOCK' | 'FUTURES' | 'OPTIONS' | 'FUNDED_ACCOUNT';
export type TradeDirection = 'BUY_LONG' | 'SELL_SHORT';
export type OptionType = 'CALL' | 'PUT';
export type Currency = 'INR' | 'USD';
export type EmotionalState = 'CONFIDENT' | 'FEARFUL' | 'GREEDY' | 'ANXIOUS' | 'NEUTRAL' | 'EXCITED' | 'FRUSTRATED';

export interface CreateTradeDTO {
  tradeDate: string;
  entryTime: string;
  exitTime: string;
  tradeType: TradeType;
  instrument: string;
  tradeDirection: TradeDirection;
  optionType?: OptionType;
  avgBuyPrice: number;
  avgSellPrice: number;
  positionSize: number;
  leverage?: number;
  baseCurrency: Currency;
  emotionalState: EmotionalState;
  isImpulsive: boolean;
  initialNotes?: string;
  
  // Pre-Trade Psychology & Planning
  setupConfidence?: number;
  marketCondition?: string;
  timeOfDay?: string;
  newsImpact?: string;
  strategy?: string;
  riskRewardRatio?: number;
  stopLossPrice?: number;
  takeProfitPrice?: number;
  positionSizingReason?: string;
  
  // Entry Decision
  entryTrigger?: string;
  hadHesitation?: boolean;
  deviatedFromPlan?: boolean;
  deviationReason?: string;
  
  // During Trade
  monitoringFrequency?: string;
  stressLevel?: number;
  consideredEarlyExit?: boolean;
  earlyExitReason?: string;
  
  // Exit Decision
  exitReason?: string;
  exitSatisfaction?: number;
  wouldDoDifferently?: string;
  
  // Post-Trade Reflection
  keyLesson?: string;
  mistakesMade?: string[];
  whatWentWell?: string;
  conditionsMatchExpectation?: boolean;
  
  // Additional Context
  sessionQuality?: number;
  physicalState?: string;
  mentalState?: string;
  externalFactors?: string[];
}

export interface Note {
  id: string;
  tradeId: string;
  content: string;
  createdAt: string;
}

export interface Screenshot {
  id: string;
  tradeId: string;
  filename: string;
  url: string;
  fileSize: number;
  mimeType: string;
  createdAt: string;
}

export interface Trade extends CreateTradeDTO {
  id: string;
  userId: string;
  pnl: number;
  pnlPercentage?: number;
  notes?: Note[];
  screenshots?: Screenshot[];
  createdAt: string;
  updatedAt: string;
}

export interface GetTradesQuery {
  startDate?: string;
  endDate?: string;
  tradeType?: TradeType;
  baseCurrency?: Currency;
  emotionalState?: EmotionalState;
  isImpulsive?: boolean;
  sortBy?: 'tradeDate' | 'pnl' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface GetTradesResponse {
  trades: Trade[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

// Dashboard Types
export interface DashboardStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnlINR: number;
  totalPnlUSD: number;
  avgProfitPerTrade: number;
  largestWin: number;
  largestLoss: number;
  tradesByType: Record<string, number>;
  emotionalStateDistribution: Record<string, number>;
  pnlOverTime: Array<{ date: string; pnl: number; currency: string }>;
}

export interface DashboardQuery {
  startDate?: string;
  endDate?: string;
}

// AI Emotion Analysis Types
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
  overallSentiment: number;
  emotionalJourney: string;
}

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

export interface EmotionalPattern {
  patternType: 'greedy_after_wins' | 'fearful_after_losses' | 'revenge_trading' | 
                'overconfident' | 'analysis_paralysis' | 'fomo' | 'emotional_volatility';
  description: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
  impactScore: number;
  examples: string[];
  recommendation: string;
}

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

export interface EmotionPatternsResponse {
  patterns: EmotionalPattern[];
  correlations: EmotionPerformanceCorrelation[];
  stressAnalysis: StressPerformanceAnalysis | null;
  totalTrades: number;
  message?: string;
}
