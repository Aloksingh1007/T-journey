import prisma from '../utils/prisma';
import { BadgeService } from './badge.service';
import { Badge, Milestones } from '../types';

export class ProfileStatsService {
  /**
   * Update user profile statistics based on their trades
   */
  static async updateUserStats(userId: string): Promise<void> {
    // Get all user trades
    const trades = await prisma.trade.findMany({
      where: { userId },
      orderBy: { tradeDate: 'asc' },
    });

    if (trades.length === 0) {
      return;
    }

    // Calculate statistics
    const totalTrades = trades.length;
    const winningTrades = trades.filter((t) => Number(t.pnl) > 0).length;
    const winRate = (winningTrades / totalTrades) * 100;
    const totalPnL = trades.reduce((sum, t) => sum + Number(t.pnl), 0);

    // Calculate current streak
    let currentStreak = 0;
    for (let i = trades.length - 1; i >= 0; i--) {
      const pnl = Number(trades[i].pnl);
      if (currentStreak === 0) {
        currentStreak = pnl > 0 ? 1 : pnl < 0 ? -1 : 0;
      } else if (currentStreak > 0 && pnl > 0) {
        currentStreak++;
      } else if (currentStreak < 0 && pnl < 0) {
        currentStreak--;
      } else {
        break;
      }
    }

    // Calculate longest win streak
    let longestWinStreak = 0;
    let tempStreak = 0;
    for (const trade of trades) {
      if (Number(trade.pnl) > 0) {
        tempStreak++;
        longestWinStreak = Math.max(longestWinStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    // Find best trade date
    const bestTrade = trades.reduce((best, current) => {
      return Number(current.pnl) > Number(best.pnl) ? current : best;
    });
    const bestTradeDate = bestTrade.tradeDate;

    // Get current user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { badges: true, milestones: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Parse current badges and milestones
    const currentBadges = (user.badges as unknown as Badge[]) || [];
    const currentMilestones = (user.milestones as unknown as Milestones) || {};

    // Check and award new badges
    const { badges: updatedBadges, milestones: updatedMilestones } =
      BadgeService.checkAndAwardBadges(currentBadges, currentMilestones, {
        totalTrades,
        currentStreak,
        longestWinStreak,
        totalPnL,
      });

    // Update user profile stats
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalTrades,
        winRate,
        totalPnL,
        currentStreak,
        longestWinStreak,
        bestTradeDate,
        badges: updatedBadges as any,
        milestones: updatedMilestones as any,
      },
    });
  }

  /**
   * Get shareable profile statistics
   */
  static async getShareableStats(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        tradingStyle: true,
        experienceLevel: true,
        totalTrades: true,
        winRate: true,
        totalPnL: true,
        currentStreak: true,
        longestWinStreak: true,
        badges: true,
        shareStats: true,
        shareTrades: true,
        profileVisibility: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if stats are shareable
    if (!user.shareStats && user.profileVisibility === 'PRIVATE') {
      throw new Error('User has not enabled stats sharing');
    }

    return {
      name: user.name,
      tradingStyle: user.tradingStyle,
      experienceLevel: user.experienceLevel,
      totalTrades: user.totalTrades,
      winRate: Number(user.winRate),
      totalPnL: Number(user.totalPnL),
      currentStreak: user.currentStreak,
      longestWinStreak: user.longestWinStreak,
      badges: user.badges as unknown as Badge[],
    };
  }

  /**
   * Get badge progress for a user
   */
  static async getBadgeProgress(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        totalTrades: true,
        currentStreak: true,
        longestWinStreak: true,
        totalPnL: true,
        milestones: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return BadgeService.getBadgeProgress(user.milestones as Milestones, {
      totalTrades: user.totalTrades,
      currentStreak: user.currentStreak,
      longestWinStreak: user.longestWinStreak,
      totalPnL: Number(user.totalPnL),
    });
  }
}
