import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  getCalendarData,
  getCurrencySpecificStats,
  getRecentTrades,
} from '../services/dashboard.service';
import { EnhancedStatsBar } from '../components/dashboard/EnhancedStatsBar';
import { MiniCalendar } from '../components/dashboard/MiniCalendar';
import { CalendarModal } from '../components/dashboard/CalendarModal';
import EmotionWarnings from '../components/dashboard/EmotionWarnings';
import { QuickActionCards } from '../components/dashboard/QuickActionCards';
import { TraderScoreCard } from '../components/dashboard/TraderScoreCard';
import { TraderScoreBreakdown } from '../components/dashboard/TraderScoreBreakdown';
import { AIInsightsCard } from '../components/dashboard/AIInsightsCard';
import { QuickStatsGrid } from '../components/dashboard/QuickStatsGrid';
import { TraderJourneyCard } from '../components/dashboard/TraderJourneyCard';

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD'>('INR');
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  // Fetch data
  const { data: calendarData, isLoading: isLoadingCalendar } = useQuery({
    queryKey: ['calendarData'],
    queryFn: () => getCalendarData(),
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['currencyStats', selectedCurrency],
    queryFn: () => getCurrencySpecificStats(selectedCurrency),
  });

  const { data: recentTradesData, isLoading: isLoadingRecentTrades } = useQuery({
    queryKey: ['recentTrades', 5],
    queryFn: () => getRecentTrades(5),
  });

  // Calculate today, this week, and this month P&L
  const today = new Date().toISOString().split('T')[0];

  // Get today's trades from stats
  const todayTrades = stats?.pnlOverTime.filter((t) => t.date === today) || [];
  const todayPnL = todayTrades.reduce((sum, t) => sum + t.pnl, 0);

  // Calculate this week P&L
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
  const weekTrades = stats?.pnlOverTime.filter((t) => t.date >= startOfWeekStr) || [];
  const weekPnL = weekTrades.reduce((sum, t) => sum + t.pnl, 0);

  // Calculate this month P&L
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  const startOfMonthStr = startOfMonth.toISOString().split('T')[0];
  const monthTrades = stats?.pnlOverTime.filter((t) => t.date >= startOfMonthStr) || [];
  const monthPnL = monthTrades.reduce((sum, t) => sum + t.pnl, 0);

  // All time P&L from stats
  const allTimePnL = stats?.totalPnl || 0;

  // Calculate current streak
  const calculateStreak = () => {
    if (!stats || stats.totalTrades === 0) return undefined;

    const lastTrades = stats.pnlOverTime.slice(-10);
    let streak = 0;
    let type: 'win' | 'loss' = 'win';

    for (let i = lastTrades.length - 1; i >= 0; i--) {
      const isWin = lastTrades[i].pnl > 0;
      if (i === lastTrades.length - 1) {
        type = isWin ? 'win' : 'loss';
        streak = 1;
      } else {
        if ((type === 'win' && isWin) || (type === 'loss' && !isWin)) {
          streak++;
        } else {
          break;
        }
      }
    }

    return { type, count: streak };
  };

  const currentStreak = calculateStreak();

  const handleDateClick = (date: string) => {
    // Navigate to trades page with date filter
    navigate(`/trades?date=${date}`);
  };

  const isLoading = isLoadingCalendar || isLoadingStats || isLoadingRecentTrades;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your trading overview</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <>
          {/* Enhanced Stats Bar */}
          <EnhancedStatsBar
            todayPnL={todayPnL}
            weekPnL={weekPnL}
            monthPnL={monthPnL}
            allTimePnL={allTimePnL}
            currency={selectedCurrency}
            onCurrencyChange={setSelectedCurrency}
          />

          {/* Quick Stats Grid - Full Width */}
          <QuickStatsGrid
            winRate={stats?.winRate || 0}
            totalTrades={stats?.totalTrades || 0}
            avgProfit={stats?.avgProfitPerTrade || 0}
            bestDay={stats?.largestWin || 0}
            currency={selectedCurrency}
          />

          {/* Main Content Grid - 2 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Trader Score Card */}
            <TraderScoreCard />

            {/* Right: Trader Journey */}
            <TraderJourneyCard
              totalTrades={stats?.totalTrades || 0}
              winRate={stats?.winRate || 0}
              currentStreak={currentStreak}
            />
          </div>

          {/* 3 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Insights */}
            <div className="lg:col-span-2">
              <AIInsightsCard />
            </div>

            {/* Mini Calendar */}
            <div className="lg:col-span-1">
              <MiniCalendar data={calendarData || []} onClick={() => setIsCalendarModalOpen(true)} />
            </div>
          </div>

          {/* Score Breakdown - Full Width */}
          <TraderScoreBreakdown />

          {/* Emotion Warnings */}
          <EmotionWarnings />

          {/* Quick Action Cards */}
          <QuickActionCards recentTrades={recentTradesData || []} currentStreak={currentStreak} />
        </>
      )}

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        data={calendarData || []}
        onDateClick={handleDateClick}
      />
    </div>
  );
}
