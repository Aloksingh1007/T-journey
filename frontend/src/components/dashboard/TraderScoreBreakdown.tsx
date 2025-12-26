import { useQuery } from '@tanstack/react-query';
import { getScoreBreakdown } from '../../services/trader-score.service';
import { Brain, Target, BookOpen, Shield, Heart } from 'lucide-react';

export function TraderScoreBreakdown() {
  const { data: breakdown, isLoading } = useQuery({
    queryKey: ['traderScoreBreakdown'],
    queryFn: getScoreBreakdown,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse">
        <div className="h-96 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (!breakdown) return null;

  const categories = [
    {
      name: 'Discipline',
      icon: Target,
      color: 'blue',
      data: breakdown.discipline,
      metrics: [
        { label: 'Plan Adherence', value: breakdown.discipline.metrics.planAdherence },
        { label: 'Impulsive Trades', value: 100 - breakdown.discipline.metrics.impulsiveTradeRate },
        { label: 'Stop Loss Respect', value: breakdown.discipline.metrics.stopLossRespect },
        { label: 'Emotional Control', value: breakdown.discipline.metrics.emotionalControl },
      ],
    },
    {
      name: 'Performance',
      icon: Target,
      color: 'green',
      data: breakdown.performance,
      metrics: [
        { label: 'Win Rate', value: breakdown.performance.metrics.winRate },
        { label: 'Risk/Reward', value: breakdown.performance.metrics.riskRewardRatio },
        { label: 'Profit Factor', value: breakdown.performance.metrics.profitFactor },
        { label: 'Consistency', value: breakdown.performance.metrics.consistency },
      ],
    },
    {
      name: 'Learning',
      icon: BookOpen,
      color: 'purple',
      data: breakdown.learning,
      metrics: [
        { label: 'Lessons Documented', value: breakdown.learning.metrics.lessonsDocumented },
        { label: 'Mistake Avoidance', value: breakdown.learning.metrics.mistakeRepetition },
        { label: 'Improvement Trend', value: breakdown.learning.metrics.improvementTrend },
        { label: 'Reflection Quality', value: breakdown.learning.metrics.reflectionQuality },
      ],
    },
    {
      name: 'Risk Management',
      icon: Shield,
      color: 'amber',
      data: breakdown.riskManagement,
      metrics: [
        { label: 'Position Sizing', value: breakdown.riskManagement.metrics.positionSizing },
        { label: 'Leverage Usage', value: breakdown.riskManagement.metrics.leverageUsage },
        { label: 'Drawdown Control', value: breakdown.riskManagement.metrics.drawdownManagement },
        { label: 'Diversification', value: breakdown.riskManagement.metrics.diversification },
      ],
    },
    {
      name: 'Emotional Intelligence',
      icon: Heart,
      color: 'pink',
      data: breakdown.emotionalIntelligence,
      metrics: [
        { label: 'Emotion-Performance', value: breakdown.emotionalIntelligence.metrics.emotionPerformanceCorrelation },
        { label: 'Stress Management', value: breakdown.emotionalIntelligence.metrics.stressManagement },
        { label: 'Loss Recovery', value: breakdown.emotionalIntelligence.metrics.lossRecovery },
        { label: 'Confidence Calibration', value: breakdown.emotionalIntelligence.metrics.confidenceCalibration },
      ],
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg mr-2">
          <Brain className="w-5 h-5 text-white" />
        </div>
        Detailed Score Breakdown
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const colors = getColorClasses(category.color);

          return (
            <div
              key={category.name}
              className={`border ${colors.border} rounded-xl p-4 ${colors.bg} hover:shadow-md transition-all hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Icon className={`w-4 h-4 ${colors.text}`} />
                  </div>
                </div>
                <div className={`text-3xl font-bold ${colors.text}`}>{category.data.score}</div>
              </div>

              <div className="mb-3">
                <div className="font-semibold text-gray-900 text-sm">{category.name}</div>
                <div className="text-xs text-gray-500">Weight: {category.data.weight}%</div>
              </div>

              <div className="space-y-2">
                {category.metrics.map((metric) => (
                  <div key={metric.label} className="bg-white/70 rounded-lg p-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs text-gray-600 font-medium">{metric.label}</div>
                      <span className="text-xs font-bold text-gray-700">{metric.value}</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          metric.value >= 70 ? 'bg-green-500' : metric.value >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
