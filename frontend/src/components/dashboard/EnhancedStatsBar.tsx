import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedStatsBarProps {
  todayPnL: number;
  weekPnL: number;
  monthPnL: number;
  allTimePnL: number;
  currency: 'INR' | 'USD';
  onCurrencyChange?: (currency: 'INR' | 'USD') => void;
}

export function EnhancedStatsBar({
  todayPnL,
  weekPnL,
  monthPnL,
  allTimePnL,
  currency,
  onCurrencyChange,
}: EnhancedStatsBarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const StatItem = ({ 
    label, 
    value, 
    isHighlight = false 
  }: { 
    label: string; 
    value: number; 
    isHighlight?: boolean;
  }) => {
    const isPositive = value >= 0;
    const isZero = value === 0;

    return (
      <div className={cn(
        'flex flex-col items-center px-6 py-4 transition-all duration-300',
        isHighlight && 'bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg'
      )}>
        <span className={cn(
          'text-sm font-medium mb-2',
          isHighlight ? 'text-gray-800' : 'text-gray-600'
        )}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {!isZero && (
            <div className={cn(
              'p-1.5 rounded-full',
              isPositive ? 'bg-green-100' : 'bg-red-100'
            )}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
          )}
          <span
            className={cn(
              'font-bold font-mono',
              isHighlight ? 'text-2xl' : 'text-xl',
              isZero ? 'text-gray-700' : isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {formatCurrency(value)}
          </span>
        </div>
        {isHighlight && (
          <div className="flex items-center gap-1 mt-2">
            <DollarSign className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-500">Total Realized</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Performance Overview
        </h3>
        {onCurrencyChange && (
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-sm">
            {(['INR', 'USD'] as const).map((curr) => (
              <button
                key={curr}
                onClick={() => onCurrencyChange(curr)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                  currency === curr
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <StatItem label="Today's P&L" value={todayPnL} />
        <StatItem label="This Week" value={weekPnL} />
        <StatItem label="This Month" value={monthPnL} />
        <StatItem label="All Time P&L" value={allTimePnL} isHighlight />
      </div>
    </div>
  );
}
