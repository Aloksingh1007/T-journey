import { useState } from 'react';
import type { Trade } from '@/types';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface TradeCardProps {
  trade: Trade;
  onDelete?: (id: string) => void;
}

export const TradeCard = ({ trade, onDelete }: TradeCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const isProfitable = Number(trade.pnl) > 0;
  const tradeDateTime = new Date(trade.tradeDate);
  const formattedDate = tradeDateTime.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      CONFIDENT: 'bg-success-100 text-success-800 border-success-200',
      FEARFUL: 'bg-accent-100 text-accent-800 border-accent-200',
      GREEDY: 'bg-warning-100 text-warning-800 border-warning-200',
      ANXIOUS: 'bg-warning-100 text-warning-800 border-warning-200',
      NEUTRAL: 'bg-neutral-100 text-neutral-800 border-neutral-200',
      EXCITED: 'bg-primary-100 text-primary-800 border-primary-200',
      FRUSTRATED: 'bg-danger-100 text-danger-800 border-danger-200',
    };
    return colors[emotion] || 'bg-neutral-100 text-neutral-800 border-neutral-200';
  };

  const getTradeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CRYPTO: 'Crypto',
      STOCK: 'Stock',
      FUTURES: 'Futures',
      OPTIONS: 'Options',
      FUNDED_ACCOUNT: 'Funded',
    };
    return labels[type] || type;
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/trades/${trade.id}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('Are you sure you want to delete this trade?')) {
      onDelete(trade.id);
    }
  };

  return (
    <div
      onClick={() => navigate(`/trades/${trade.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'bg-white rounded-xl shadow-md cursor-pointer border border-gray-100 p-5 relative overflow-hidden',
        'transition-all duration-300 ease-smooth',
        'hover:shadow-2xl hover:-translate-y-2',
        isProfitable ? 'hover:shadow-glow-success' : 'hover:shadow-glow-danger'
      )}
    >
      {/* Status Badge with Glow */}
      <div className="absolute top-3 right-3">
        <div
          className={cn(
            'px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5',
            'border-2 shadow-lg transition-all duration-300',
            isProfitable
              ? 'bg-success-500 text-white border-success-400 shadow-glow-success'
              : 'bg-danger-500 text-white border-danger-400 shadow-glow-danger'
          )}
        >
          {isProfitable ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {isProfitable ? 'WIN' : 'LOSS'}
        </div>
      </div>

      {/* Quick Action Buttons - Show on Hover */}
      {isHovered && (
        <div className="absolute top-3 left-3 flex gap-2 animate-slide-down">
          <button
            onClick={handleEdit}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
              transition-all duration-200 shadow-lg hover:scale-110"
            title="Edit trade"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 
              transition-all duration-200 shadow-lg hover:scale-110"
            title="Delete trade"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4 mt-8">
        <div>
          <h3 className="font-bold text-xl text-neutral-900">
            {trade.instrument}
          </h3>
          <p className="text-sm text-neutral-600 mt-1">
            {formattedDate}
          </p>
          <p className="text-xs text-neutral-500">
            {trade.entryTime} - {trade.exitTime}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={cn(
              'text-2xl font-bold font-mono',
              isProfitable ? 'text-success-600' : 'text-danger-600'
            )}
          >
            {isProfitable ? '+' : ''}
            {formatCurrency(Number(trade.pnl), trade.baseCurrency)}
          </span>
          {trade.pnlPercentage !== undefined && trade.pnlPercentage !== null && (
            <span
              className={cn(
                'text-sm font-semibold font-mono px-2 py-0.5 rounded',
                isProfitable
                  ? 'text-success-700 bg-success-100'
                  : 'text-danger-700 bg-danger-100'
              )}
            >
              {isProfitable ? '+' : ''}
              {Number(trade.pnlPercentage).toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      {/* Trade Details */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm bg-neutral-50/50 rounded-lg p-3">
        <div>
          <span className="text-neutral-500 text-xs">Type</span>
          <p className="font-semibold text-neutral-900">
            {getTradeTypeLabel(trade.tradeType)}
          </p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">Direction</span>
          <p className="font-semibold text-neutral-900">
            {trade.tradeDirection === 'BUY_LONG' ? '📈 Long' : '📉 Short'}
          </p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">Entry</span>
          <p className="font-semibold text-neutral-900 font-mono text-xs">
            {formatCurrency(Number(trade.avgBuyPrice), trade.baseCurrency)}
          </p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">Exit</span>
          <p className="font-semibold text-neutral-900 font-mono text-xs">
            {formatCurrency(Number(trade.avgSellPrice), trade.baseCurrency)}
          </p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">Size</span>
          <p className="font-semibold text-neutral-900 font-mono">
            {Number(trade.positionSize)}
          </p>
        </div>
        <div>
          <span className="text-neutral-500 text-xs">Leverage</span>
          <p className="font-semibold text-neutral-900 font-mono">
            {Number(trade.leverage) || 1}x
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        <span
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-semibold border',
            getEmotionColor(trade.emotionalState)
          )}
        >
          {trade.emotionalState.charAt(0) + trade.emotionalState.slice(1).toLowerCase()}
        </span>
        {trade.isImpulsive && (
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-danger-100 text-danger-800 border border-danger-200">
            ⚡ Impulsive
          </span>
        )}
        <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-100 text-primary-800 border border-primary-200">
          {trade.baseCurrency}
        </span>
        {trade.notes && trade.notes.length > 0 && (
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
            📝 {trade.notes.length} {trade.notes.length === 1 ? 'note' : 'notes'}
          </span>
        )}
        {trade.screenshots && trade.screenshots.length > 0 && (
          <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200">
            📷 {trade.screenshots.length} {trade.screenshots.length === 1 ? 'image' : 'images'}
          </span>
        )}
      </div>
    </div>
  );
};
