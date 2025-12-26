import { Prisma } from '@prisma/client';
import prisma from '../utils/prisma';

/**
 * Dashboard statistics interface
 */
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

/**
 * Query parameters for dashboard stats
 */
export interface DashboardQuery {
  startDate?: string;
  endDate?: string;
}

/**
 * Calendar data interface
 */
export interface CalendarData {
  date: string;
  pnl: number;
  tradeCount: number;
}

/**
 * Calculate comprehensive dashboard statistics
 */
export async function calculateDashboardStats(
  userId: string,
  query: DashboardQuery = {}
): Promise<DashboardStats> {
  const { startDate, endDate } = query;

  // Build where clause for date filtering
  const where: Prisma.TradeWhereInput = {
    userId,
  };

  if (startDate || endDate) {
    where.tradeDate = {};
    if (startDate) {
      where.tradeDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.tradeDate.lte = new Date(endDate);
    }
  }

  // Fetch all trades for the user within the date range
  const trades = await prisma.trade.findMany({
    where,
    select: {
      id: true,
      tradeDate: true,
      tradeType: true,
      emotionalState: true,
      baseCurrency: true,
      pnl: true,
    },
    orderBy: {
      tradeDate: 'asc',
    },
  });

  // Initialize statistics object
  const stats: DashboardStats = {
    totalTrades: trades.length,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalPnlINR: 0,
    totalPnlUSD: 0,
    avgProfitPerTrade: 0,
    largestWin: 0,
    largestLoss: 0,
    tradesByType: {},
    emotionalStateDistribution: {},
    pnlOverTime: [],
  };

  // Return empty stats if no trades
  if (trades.length === 0) {
    return stats;
  }

  // Calculate statistics
  const pnlByDate: Map<string, { INR: number; USD: number }> = new Map();

  trades.forEach((trade) => {
    const pnlValue = trade.pnl.toNumber();

    // Count winning and losing trades
    if (pnlValue > 0) {
      stats.winningTrades++;
    } else if (pnlValue < 0) {
      stats.losingTrades++;
    }

    // Calculate P&L by currency
    if (trade.baseCurrency === 'INR') {
      stats.totalPnlINR += pnlValue;
    } else if (trade.baseCurrency === 'USD') {
      stats.totalPnlUSD += pnlValue;
    }

    // Track largest win and loss
    if (pnlValue > stats.largestWin) {
      stats.largestWin = pnlValue;
    }
    if (pnlValue < stats.largestLoss) {
      stats.largestLoss = pnlValue;
    }

    // Count trades by type
    stats.tradesByType[trade.tradeType] =
      (stats.tradesByType[trade.tradeType] || 0) + 1;

    // Count trades by emotional state
    stats.emotionalStateDistribution[trade.emotionalState] =
      (stats.emotionalStateDistribution[trade.emotionalState] || 0) + 1;

    // Aggregate P&L by date
    const dateKey = trade.tradeDate.toISOString().split('T')[0];
    if (!pnlByDate.has(dateKey)) {
      pnlByDate.set(dateKey, { INR: 0, USD: 0 });
    }
    const dateData = pnlByDate.get(dateKey)!;
    if (trade.baseCurrency === 'INR') {
      dateData.INR += pnlValue;
    } else {
      dateData.USD += pnlValue;
    }
  });

  // Calculate win rate
  stats.winRate =
    stats.totalTrades > 0
      ? (stats.winningTrades / stats.totalTrades) * 100
      : 0;

  // Calculate average profit per trade
  const totalPnl = stats.totalPnlINR + stats.totalPnlUSD;
  stats.avgProfitPerTrade =
    stats.totalTrades > 0 ? totalPnl / stats.totalTrades : 0;

  // Generate P&L over time data
  // Create separate entries for INR and USD
  pnlByDate.forEach((pnlData, date) => {
    if (pnlData.INR !== 0) {
      stats.pnlOverTime.push({
        date,
        pnl: pnlData.INR,
        currency: 'INR',
      });
    }
    if (pnlData.USD !== 0) {
      stats.pnlOverTime.push({
        date,
        pnl: pnlData.USD,
        currency: 'USD',
      });
    }
  });

  // Sort P&L over time by date
  stats.pnlOverTime.sort((a, b) => a.date.localeCompare(b.date));

  return stats;
}

/**
 * Get calendar data for trading calendar view
 */
export async function getCalendarData(
  userId: string,
  query: DashboardQuery = {}
): Promise<CalendarData[]> {
  const { startDate, endDate } = query;

  // Build where clause for date filtering
  const where: Prisma.TradeWhereInput = {
    userId,
  };

  if (startDate || endDate) {
    where.tradeDate = {};
    if (startDate) {
      where.tradeDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.tradeDate.lte = new Date(endDate);
    }
  }

  // Fetch all trades for the user within the date range
  const trades = await prisma.trade.findMany({
    where,
    select: {
      tradeDate: true,
      pnl: true,
    },
    orderBy: {
      tradeDate: 'asc',
    },
  });

  // Aggregate by date
  const dataByDate: Map<string, { pnl: number; count: number }> = new Map();

  trades.forEach((trade) => {
    const dateKey = trade.tradeDate.toISOString().split('T')[0];
    const pnlValue = trade.pnl.toNumber();

    if (!dataByDate.has(dateKey)) {
      dataByDate.set(dateKey, { pnl: 0, count: 0 });
    }

    const dateData = dataByDate.get(dateKey)!;
    dateData.pnl += pnlValue;
    dateData.count += 1;
  });

  // Convert to array
  const calendarData: CalendarData[] = [];
  dataByDate.forEach((data, date) => {
    calendarData.push({
      date,
      pnl: data.pnl,
      tradeCount: data.count,
    });
  });

  // Sort by date
  calendarData.sort((a, b) => a.date.localeCompare(b.date));

  return calendarData;
}

/**
 * Get recent trades for dashboard
 */
export async function getRecentTrades(userId: string, limit: number = 5) {
  const trades = await prisma.trade.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      instrument: true,
      pnl: true,
      tradeDate: true,
      baseCurrency: true,
    },
    orderBy: {
      tradeDate: 'desc',
    },
    take: limit,
  });

  return trades.map(trade => ({
    id: trade.id,
    instrument: trade.instrument,
    pnl: trade.pnl.toNumber(),
    date: trade.tradeDate.toISOString().split('T')[0],
    currency: trade.baseCurrency,
  }));
}

/**
 * Currency-specific dashboard statistics
 */
export interface CurrencySpecificStats {
  currency: 'INR' | 'USD';
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnl: number;
  avgProfitPerTrade: number;
  largestWin: number;
  largestLoss: number;
  tradesByType: Record<string, number>;
  emotionalStateDistribution: Record<string, number>;
  pnlOverTime: Array<{ date: string; pnl: number }>;
}

/**
 * Calculate currency-specific dashboard statistics
 */
export async function calculateCurrencySpecificStats(
  userId: string,
  currency: 'INR' | 'USD',
  query: DashboardQuery = {}
): Promise<CurrencySpecificStats> {
  const { startDate, endDate } = query;

  // Build where clause
  const where: Prisma.TradeWhereInput = {
    userId,
    baseCurrency: currency,
  };

  // Add date filter
  if (startDate || endDate) {
    where.tradeDate = {};
    if (startDate) {
      where.tradeDate.gte = new Date(startDate);
    }
    if (endDate) {
      where.tradeDate.lte = new Date(endDate);
    }
  }

  // Fetch trades
  const trades = await prisma.trade.findMany({
    where,
    select: {
      id: true,
      tradeDate: true,
      tradeType: true,
      emotionalState: true,
      baseCurrency: true,
      pnl: true,
    },
    orderBy: {
      tradeDate: 'asc',
    },
  });

  // Initialize stats
  const stats: CurrencySpecificStats = {
    currency,
    totalTrades: trades.length,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalPnl: 0,
    avgProfitPerTrade: 0,
    largestWin: 0,
    largestLoss: 0,
    tradesByType: {},
    emotionalStateDistribution: {},
    pnlOverTime: [],
  };

  if (trades.length === 0) {
    return stats;
  }

  // Calculate statistics
  const pnlByDate: Map<string, number> = new Map();

  trades.forEach((trade) => {
    const pnlValue = trade.pnl.toNumber();

    // Count winning and losing trades
    if (pnlValue > 0) {
      stats.winningTrades++;
    } else if (pnlValue < 0) {
      stats.losingTrades++;
    }

    // Calculate total P&L
    stats.totalPnl += pnlValue;

    // Track largest win and loss
    if (pnlValue > stats.largestWin) {
      stats.largestWin = pnlValue;
    }
    if (pnlValue < stats.largestLoss) {
      stats.largestLoss = pnlValue;
    }

    // Count trades by type
    stats.tradesByType[trade.tradeType] =
      (stats.tradesByType[trade.tradeType] || 0) + 1;

    // Count trades by emotional state
    stats.emotionalStateDistribution[trade.emotionalState] =
      (stats.emotionalStateDistribution[trade.emotionalState] || 0) + 1;

    // Aggregate P&L by date
    const dateKey = trade.tradeDate.toISOString().split('T')[0];
    pnlByDate.set(dateKey, (pnlByDate.get(dateKey) || 0) + pnlValue);
  });

  // Calculate win rate
  stats.winRate =
    stats.totalTrades > 0
      ? (stats.winningTrades / stats.totalTrades) * 100
      : 0;

  // Calculate average profit per trade
  stats.avgProfitPerTrade =
    stats.totalTrades > 0 ? stats.totalPnl / stats.totalTrades : 0;

  // Generate P&L over time data
  pnlByDate.forEach((pnl, date) => {
    stats.pnlOverTime.push({ date, pnl });
  });

  // Sort by date
  stats.pnlOverTime.sort((a, b) => a.date.localeCompare(b.date));

  return stats;
}
