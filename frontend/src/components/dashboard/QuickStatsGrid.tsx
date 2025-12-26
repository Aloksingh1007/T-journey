import { TrendingUp, Target, Zap, Award } from 'lucide-react';

interface QuickStatsGridProps {
  winRate: number;
  totalTrades: number;
  avgProfit: number;
  bestDay: number;
  currency: string;
}

export function QuickStatsGrid({ winRate, totalTrades, avgProfit, bestDay, currency }: QuickStatsGridProps) {
  const stats = [
    {
      label: 'Win Rate',
      value: `${winRate.toFixed(1)}%`,
      icon: Target,
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Trades',
      value: totalTrades.toString(),
      icon: Zap,
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Avg Profit',
      value: `${currency === 'INR' ? '₹' : '$'}${avgProfit.toFixed(0)}`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Best Day',
      value: `${currency === 'INR' ? '₹' : '$'}${bestDay.toFixed(0)}`,
      icon: Award,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-50 to-orange-50',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`bg-gradient-to-br ${stat.bgGradient} rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`${stat.iconBg} p-2.5 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-1 font-medium">{stat.label}</div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
