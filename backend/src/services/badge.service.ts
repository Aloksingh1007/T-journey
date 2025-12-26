import { Badge, Milestones } from '../types';

// Badge Definitions
export const BADGE_DEFINITIONS = {
  // Trading Milestones
  FIRST_TRADE: {
    id: 'first_trade',
    name: 'First Trade',
    description: 'Logged your first trade',
    icon: '🎯',
    category: 'milestone' as const,
  },
  TRADES_10: {
    id: 'trades_10',
    name: 'Getting Started',
    description: 'Logged 10 trades',
    icon: '📊',
    category: 'milestone' as const,
  },
  TRADES_50: {
    id: 'trades_50',
    name: 'Active Trader',
    description: 'Logged 50 trades',
    icon: '📈',
    category: 'milestone' as const,
  },
  TRADES_100: {
    id: 'trades_100',
    name: 'Century',
    description: 'Logged 100 trades',
    icon: '💯',
    category: 'milestone' as const,
  },
  TRADES_500: {
    id: 'trades_500',
    name: 'Veteran Trader',
    description: 'Logged 500 trades',
    icon: '🏆',
    category: 'milestone' as const,
  },
  TRADES_1000: {
    id: 'trades_1000',
    name: 'Master Trader',
    description: 'Logged 1000 trades',
    icon: '👑',
    category: 'milestone' as const,
  },

  // Win Streaks
  WIN_STREAK_5: {
    id: 'win_streak_5',
    name: 'Hot Streak',
    description: '5 winning trades in a row',
    icon: '🔥',
    category: 'trading' as const,
  },
  WIN_STREAK_10: {
    id: 'win_streak_10',
    name: 'Unstoppable',
    description: '10 winning trades in a row',
    icon: '⚡',
    category: 'trading' as const,
  },

  // Profit Milestones
  PROFIT_1000: {
    id: 'profit_1000',
    name: 'First Thousand',
    description: 'Reached ₹1,000 in total profit',
    icon: '💰',
    category: 'milestone' as const,
  },
  PROFIT_10000: {
    id: 'profit_10000',
    name: 'Five Figures',
    description: 'Reached ₹10,000 in total profit',
    icon: '💎',
    category: 'milestone' as const,
  },
  PROFIT_100000: {
    id: 'profit_100000',
    name: 'Six Figures',
    description: 'Reached ₹1,00,000 in total profit',
    icon: '🌟',
    category: 'milestone' as const,
  },

  // Consistency
  PERFECT_WEEK: {
    id: 'perfect_week',
    name: 'Perfect Week',
    description: 'All winning trades in a week',
    icon: '✨',
    category: 'consistency' as const,
  },
  PERFECT_MONTH: {
    id: 'perfect_month',
    name: 'Perfect Month',
    description: 'All winning trades in a month',
    icon: '🎖️',
    category: 'consistency' as const,
  },

  // Journaling
  JOURNAL_STREAK_7: {
    id: 'journal_streak_7',
    name: 'Committed',
    description: 'Logged trades for 7 days straight',
    icon: '📝',
    category: 'learning' as const,
  },
  JOURNAL_STREAK_30: {
    id: 'journal_streak_30',
    name: 'Dedicated',
    description: 'Logged trades for 30 days straight',
    icon: '📚',
    category: 'learning' as const,
  },
  JOURNAL_STREAK_100: {
    id: 'journal_streak_100',
    name: 'Disciplined',
    description: 'Logged trades for 100 days straight',
    icon: '🎓',
    category: 'learning' as const,
  },
};

export class BadgeService {
  /**
   * Check and award badges based on user's trading activity
   */
  static checkAndAwardBadges(
    currentBadges: Badge[],
    currentMilestones: Milestones,
    stats: {
      totalTrades: number;
      currentStreak: number;
      longestWinStreak: number;
      totalPnL: number;
    }
  ): { badges: Badge[]; milestones: Milestones } {
    const newBadges = [...currentBadges];
    const newMilestones = { ...currentMilestones };
    const earnedBadgeIds = new Set(currentBadges.map((b) => b.id));

    // Check trade count milestones
    if (stats.totalTrades >= 1 && !newMilestones.firstTrade) {
      newMilestones.firstTrade = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.FIRST_TRADE.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.FIRST_TRADE,
          earnedAt: new Date(),
        });
      }
    }

    if (stats.totalTrades >= 10 && !newMilestones.trades10) {
      newMilestones.trades10 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.TRADES_10.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.TRADES_10,
          earnedAt: new Date(),
        });
      }
    }

    if (stats.totalTrades >= 50 && !newMilestones.trades50) {
      newMilestones.trades50 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.TRADES_50.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.TRADES_50,
          earnedAt: new Date(),
        });
      }
    }

    if (stats.totalTrades >= 100 && !newMilestones.trades100) {
      newMilestones.trades100 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.TRADES_100.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.TRADES_100,
          earnedAt: new Date(),
        });
      }
    }

    if (stats.totalTrades >= 500 && !newMilestones.trades500) {
      newMilestones.trades500 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.TRADES_500.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.TRADES_500,
          earnedAt: new Date(),
        });
      }
    }

    if (stats.totalTrades >= 1000 && !newMilestones.trades1000) {
      newMilestones.trades1000 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.TRADES_1000.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.TRADES_1000,
          earnedAt: new Date(),
        });
      }
    }

    // Check win streak milestones
    if (stats.longestWinStreak >= 5 && !newMilestones.winStreak5) {
      newMilestones.winStreak5 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.WIN_STREAK_5.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.WIN_STREAK_5,
          earnedAt: new Date(),
        });
      }
    }

    if (stats.longestWinStreak >= 10 && !newMilestones.winStreak10) {
      newMilestones.winStreak10 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.WIN_STREAK_10.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.WIN_STREAK_10,
          earnedAt: new Date(),
        });
      }
    }

    // Check profit milestones
    if (stats.totalPnL >= 1000 && !newMilestones.profitMilestone1000) {
      newMilestones.profitMilestone1000 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.PROFIT_1000.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.PROFIT_1000,
          earnedAt: new Date(),
        });
      }
    }

    if (stats.totalPnL >= 10000 && !newMilestones.profitMilestone10000) {
      newMilestones.profitMilestone10000 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.PROFIT_10000.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.PROFIT_10000,
          earnedAt: new Date(),
        });
      }
    }

    if (stats.totalPnL >= 100000 && !newMilestones.profitMilestone100000) {
      newMilestones.profitMilestone100000 = true;
      if (!earnedBadgeIds.has(BADGE_DEFINITIONS.PROFIT_100000.id)) {
        newBadges.push({
          ...BADGE_DEFINITIONS.PROFIT_100000,
          earnedAt: new Date(),
        });
      }
    }

    return { badges: newBadges, milestones: newMilestones };
  }

  /**
   * Get all available badges
   */
  static getAllBadges() {
    return Object.values(BADGE_DEFINITIONS);
  }

  /**
   * Get badge progress for a user
   */
  static getBadgeProgress(
    milestones: Milestones,
    stats: {
      totalTrades: number;
      currentStreak: number;
      longestWinStreak: number;
      totalPnL: number;
    }
  ) {
    return {
      trades: {
        current: stats.totalTrades,
        milestones: [
          { target: 1, achieved: milestones.firstTrade || false },
          { target: 10, achieved: milestones.trades10 || false },
          { target: 50, achieved: milestones.trades50 || false },
          { target: 100, achieved: milestones.trades100 || false },
          { target: 500, achieved: milestones.trades500 || false },
          { target: 1000, achieved: milestones.trades1000 || false },
        ],
      },
      winStreak: {
        current: stats.longestWinStreak,
        milestones: [
          { target: 5, achieved: milestones.winStreak5 || false },
          { target: 10, achieved: milestones.winStreak10 || false },
        ],
      },
      profit: {
        current: stats.totalPnL,
        milestones: [
          { target: 1000, achieved: milestones.profitMilestone1000 || false },
          { target: 10000, achieved: milestones.profitMilestone10000 || false },
          { target: 100000, achieved: milestones.profitMilestone100000 || false },
        ],
      },
    };
  }
}
