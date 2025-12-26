import { api } from './api';
import type { DashboardStats, DashboardQuery } from '../types';

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(
  query?: DashboardQuery
): Promise<DashboardStats> {
  const response = await api.get('/dashboard/stats', { params: query });
  return response.data.data;
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
 * Get calendar data for trading calendar view
 */
export async function getCalendarData(
  query?: DashboardQuery
): Promise<CalendarData[]> {
  const response = await api.get('/dashboard/calendar', { params: query });
  return response.data.data;
}

/**
 * Recent trade interface
 */
export interface RecentTrade {
  id: string;
  instrument: string;
  pnl: number;
  date: string;
  currency: string;
}

/**
 * Get recent trades
 */
export async function getRecentTrades(limit: number = 5): Promise<RecentTrade[]> {
  const response = await api.get('/dashboard/recent-trades', { params: { limit } });
  return response.data.data;
}

/**
 * Currency-specific stats interface
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
 * Get currency-specific dashboard statistics
 */
export async function getCurrencySpecificStats(
  currency: 'INR' | 'USD',
  query?: DashboardQuery
): Promise<CurrencySpecificStats> {
  const response = await api.get(`/dashboard/stats/${currency}`, { params: query });
  return response.data.data;
}
