import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCurrencySpecificStats } from '../services/dashboard.service';
import { CurrencyToggle } from '../components/dashboard/CurrencyToggle';
import StatsCard from '../components/dashboard/StatsCard';
import PnLChart from '../components/dashboard/PnLChart';
import TradeTypeChart from '../components/dashboard/TradeTypeChart';
import EmotionChart from '../components/dashboard/EmotionChart';
import { EmotionInsights } from '../components/emotion';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  DollarSign,
  IndianRupee,
  Download,
} from 'lucide-react';

export function Analytics() {
  const [selectedCurrency, setSelectedCurrency] = useState<'INR' | 'USD'>('INR');
  const [dateRange, setDateRange] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  // Fetch currency-specific statistics with optimized caching
  const {
    data: stats,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ['currencyStats', selectedCurrency, dateRange],
    queryFn: () => getCurrencySpecificStats(selectedCurrency, dateRange),
    staleTime: 3 * 60 * 1000, // 3 minutes - analytics data doesn't change frequently
    gcTime: 15 * 60 * 1000, // 15 minutes cache
    retry: 2,
    // Keep previous data while fetching for smoother transitions
    placeholderData: (previousData) => previousData,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    alert('Export functionality coming soon!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Detailed performance insights and trading statistics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <CurrencyToggle
            selected={selectedCurrency}
            onChange={setSelectedCurrency}
          />
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-gray-700">
            Filter by Date Range:
          </label>
          <input
            type="date"
            value={dateRange.startDate || ''}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm 
              bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200"
            placeholder="Start Date"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={dateRange.endDate || ''}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm 
              bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all duration-200"
            placeholder="End Date"
          />
          {(dateRange.startDate || dateRange.endDate) && (
            <button
              onClick={() => setDateRange({})}
              className="px-3 py-2 text-sm bg-gray-200 text-gray-700 
                rounded-lg hover:bg-gray-300 transition-all duration-200"
            >
              Clear
            </button>
          )}
        </div>
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

      {/* Error State */}
      {isError && (
        <div className="bg-white rounded-xl border border-red-200 shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">
                Failed to Load Analytics
              </h3>
              <p className="text-red-700">
                {error instanceof Error ? error.message : 'Unable to load analytics data. Please try again.'}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 
                transition-all duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Analytics Content */}
      {stats && !isLoading && (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total Trades"
              value={stats.totalTrades}
              icon={Activity}
              description={`${stats.winningTrades} wins, ${stats.losingTrades} losses`}
            />
            <StatsCard
              title="Win Rate"
              value={formatPercentage(stats.winRate)}
              icon={Target}
              description="Percentage of winning trades"
            />
            <StatsCard
              title={`Total P&L (${selectedCurrency})`}
              value={formatCurrency(stats.totalPnl)}
              icon={selectedCurrency === 'USD' ? DollarSign : IndianRupee}
              className={
                stats.totalPnl >= 0 ? 'border-green-200' : 'border-red-200'
              }
            />
            <StatsCard
              title="Avg Profit"
              value={formatCurrency(stats.avgProfitPerTrade)}
              icon={TrendingUp}
              description="Per trade average"
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
              title="Largest Win"
              value={formatCurrency(stats.largestWin)}
              icon={TrendingUp}
              description="Best performing trade"
            />
            <StatsCard
              title="Largest Loss"
              value={formatCurrency(Math.abs(stats.largestLoss))}
              icon={TrendingDown}
              description="Worst performing trade"
            />
          </div>

          {/* Charts Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Performance Charts</h2>
            
            {/* P&L Chart - Full Width */}
            <PnLChart data={stats.pnlOverTime} currency={selectedCurrency} />

            {/* Trade Type and Emotion Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TradeTypeChart data={stats.tradesByType} />
              <EmotionChart data={stats.emotionalStateDistribution} />
            </div>
          </div>

          {/* AI Emotion Insights Section */}
          {stats.totalTrades >= 10 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <h2 className="text-2xl font-bold text-gray-900">AI Emotion Analysis</h2>
              </div>
              <EmotionInsights 
                startDate={dateRange.startDate} 
                endDate={dateRange.endDate} 
              />
            </div>
          )}

          {/* Empty State */}
          {stats.totalTrades === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <Activity className="h-20 w-20 text-blue-500 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No trading data yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start recording your trades to see detailed analytics and performance insights
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
