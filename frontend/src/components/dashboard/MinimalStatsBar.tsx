import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MinimalStatsBarProps {
  todayPnL: number;
  weekPnL: number;
  monthPnL: number;
  currency?: 'INR' | 'USD';
}

export function MinimalStatsBar({
  todayPnL,
  weekPnL,
  monthPnL,
  currency = 'INR',
}: MinimalStatsBarProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const StatItem = ({ label, value }: { label: string; value: number }) => {
    const isPositive = value >= 0;
    const isZero = value === 0;

    return (
      <div className="flex flex-col items-center px-6 py-3">
        <span className="text-sm text-gray-600 mb-1">{label}</span>
        <div className="flex items-center gap-1">
          {!isZero && (
            isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )
          )}
          <span
            className={cn(
              'text-xl font-bold font-mono',
              isZero ? 'text-gray-700' : isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {formatCurrency(value)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-around divide-x divide-gray-200">
        <StatItem label="Today's P&L" value={todayPnL} />
        <StatItem label="This Week" value={weekPnL} />
        <StatItem label="This Month" value={monthPnL} />
      </div>
    </div>
  );
}
