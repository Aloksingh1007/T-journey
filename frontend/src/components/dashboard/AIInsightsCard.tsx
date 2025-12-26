import { Sparkles, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getScoreBreakdown } from '../../services/trader-score.service';

export function AIInsightsCard() {
  const { data: breakdown } = useQuery({
    queryKey: ['traderScoreBreakdown'],
    queryFn: getScoreBreakdown,
  });

  if (!breakdown) return null;

  // Generate AI insights based on scores
  const insights = [];

  // Find strongest area
  const scores = [
    { name: 'Discipline', score: breakdown.discipline.score },
    { name: 'Performance', score: breakdown.performance.score },
    { name: 'Learning', score: breakdown.learning.score },
    { name: 'Risk Management', score: breakdown.riskManagement.score },
    { name: 'Emotional Intelligence', score: breakdown.emotionalIntelligence.score },
  ];

  const strongest = scores.reduce((max, item) => (item.score > max.score ? item : max));
  const weakest = scores.reduce((min, item) => (item.score < min.score ? item : min));

  if (strongest.score >= 70) {
    insights.push({
      type: 'strength',
      icon: TrendingUp,
      color: 'green',
      title: `Strong ${strongest.name}`,
      message: `Your ${strongest.name.toLowerCase()} is excellent at ${strongest.score}/100. Keep it up!`,
    });
  }

  if (weakest.score < 50) {
    insights.push({
      type: 'warning',
      icon: AlertTriangle,
      color: 'amber',
      title: `Improve ${weakest.name}`,
      message: `Focus on ${weakest.name.toLowerCase()} - currently at ${weakest.score}/100.`,
    });
  }

  // Check specific metrics
  if (breakdown.discipline.metrics.impulsiveTradeRate > 30) {
    insights.push({
      type: 'tip',
      icon: Lightbulb,
      color: 'blue',
      title: 'Reduce Impulsive Trades',
      message: `${breakdown.discipline.metrics.impulsiveTradeRate}% of your trades are impulsive. Take a breath before entering.`,
    });
  }

  if (breakdown.performance.metrics.winRate < 40) {
    insights.push({
      type: 'tip',
      icon: Lightbulb,
      color: 'purple',
      title: 'Win Rate Opportunity',
      message: `Your win rate is ${breakdown.performance.metrics.winRate}%. Focus on quality over quantity.`,
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: 'strength',
      icon: Sparkles,
      color: 'green',
      title: 'Balanced Performance',
      message: 'Your trading is well-balanced across all areas. Keep maintaining consistency!',
    });
  }

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      green: { bg: 'bg-green-50', text: 'text-green-700', icon: 'text-green-600' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'text-amber-600' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', icon: 'text-blue-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', icon: 'text-purple-600' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl shadow-md p-6 border border-purple-100">
      <div className="flex items-center mb-4">
        <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
          BETA
        </span>
      </div>

      <div className="space-y-3">
        {insights.slice(0, 3).map((insight, index) => {
          const Icon = insight.icon;
          const colors = getColorClasses(insight.color);

          return (
            <div
              key={index}
              className={`${colors.bg} rounded-lg p-4 border border-${insight.color}-200 hover:shadow-md transition-all`}
            >
              <div className="flex items-start">
                <Icon className={`w-5 h-5 mr-3 mt-0.5 ${colors.icon} flex-shrink-0`} />
                <div className="flex-1">
                  <div className={`font-semibold ${colors.text} mb-1`}>{insight.title}</div>
                  <div className="text-sm text-gray-700">{insight.message}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
