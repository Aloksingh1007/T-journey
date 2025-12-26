import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  PlusCircle,
  TrendingUp,
  Target,
  Calendar,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCard {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  color: string;
}

interface RecentTrade {
  id: string;
  instrument: string;
  pnl: number;
  date: string;
}

interface QuickActionCardsProps {
  recentTrades?: RecentTrade[];
  currentStreak?: {
    type: 'win' | 'loss';
    count: number;
  };
}

export function QuickActionCards({ recentTrades = [], currentStreak }: QuickActionCardsProps) {
  const navigate = useNavigate();

  const actionCards: QuickActionCard[] = [
    {
      title: 'View Analytics',
      description: 'Detailed performance insights and charts',
      icon: BarChart3,
      onClick: () => navigate('/analytics'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Add Trade',
      description: 'Record a new trading transaction',
      icon: PlusCircle,
      onClick: () => navigate('/trades/add'),
      color: 'from-green-500 to-green-600',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Action Cards */}
      {actionCards.map((card, index) => (
        <button
          key={index}
          onClick={card.onClick}
          className={cn(
            'bg-white rounded-xl shadow-md p-6 border border-gray-100',
            'hover:shadow-lg hover:-translate-y-1',
            'transition-all duration-300 ease-smooth',
            'text-left group'
          )}
        >
          <div className={cn(
            'w-12 h-12 rounded-lg bg-gradient-to-br mb-4',
            'flex items-center justify-center',
            'group-hover:scale-110 transition-transform duration-300',
            card.color
          )}>
            <card.icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {card.title}
          </h3>
          <p className="text-sm text-gray-600">
            {card.description}
          </p>
        </button>
      ))}

      {/* Recent Trades Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Trades
          </h3>
        </div>
        {recentTrades.length > 0 ? (
          <div className="space-y-2">
            {recentTrades.slice(0, 5).map((trade) => (
              <div
                key={trade.id}
                onClick={() => navigate(`/trades/${trade.id}`)}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {trade.instrument}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(trade.date)}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-sm font-semibold font-mono',
                    trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {formatCurrency(trade.pnl)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent trades</p>
        )}
      </div>

      {/* Trading Streak Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            'w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center',
            currentStreak?.type === 'win' ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'
          )}>
            <Target className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Current Streak
          </h3>
        </div>
        {currentStreak ? (
          <div className="text-center">
            <div className={cn(
              'text-4xl font-bold font-mono mb-2',
              currentStreak.type === 'win' ? 'text-green-600' : 'text-red-600'
            )}>
              {currentStreak.count}
            </div>
            <p className="text-sm text-gray-600">
              {currentStreak.type === 'win' ? 'Winning' : 'Losing'} trades in a row
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            No streak data available
          </p>
        )}
      </div>

      {/* Trading Goals Card (Placeholder) */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6 border border-gray-200 relative overflow-hidden">
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-white rounded-full">
            Coming Soon
          </span>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center opacity-50">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">
            Trading Goals
          </h3>
        </div>
        <p className="text-sm text-gray-500">
          Set and track your trading objectives
        </p>
      </div>
    </div>
  );
}
