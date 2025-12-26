// User Profile Types
export enum TradingStyle {
  DAY_TRADER = 'DAY_TRADER',
  SWING_TRADER = 'SWING_TRADER',
  SCALPER = 'SCALPER',
  POSITION_TRADER = 'POSITION_TRADER',
  ALGORITHMIC = 'ALGORITHMIC',
  HYBRID = 'HYBRID',
}

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export enum ProfileVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FRIENDS_ONLY = 'FRIENDS_ONLY',
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
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
  bestTradeDate?: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  tradingStyle?: TradingStyle;
  experienceLevel?: ExperienceLevel;
  privacySettings: PrivacySettings;
  stats: ProfileStats;
  badges: Badge[];
  milestones: Milestones;
  createdAt: Date;
  updatedAt: Date;
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

export {};
