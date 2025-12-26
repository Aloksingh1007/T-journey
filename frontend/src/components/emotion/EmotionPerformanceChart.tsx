import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { EmotionPerformanceCorrelation } from '../../types';

interface EmotionPerformanceChartProps {
  correlations: EmotionPerformanceCorrelation[];
}

const EmotionPerformanceChart: React.FC<EmotionPerformanceChartProps> = ({ correlations }) => {
  // Prepare data for chart
  const chartData = correlations.map(corr => ({
    emotion: corr.emotion,
    winRate: (corr.winRate * 100).toFixed(1),
    avgPnL: corr.avgPnL,
    trades: corr.totalTrades,
    confidence: corr.avgConfidence,
    stress: corr.avgStress,
  }));

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      CONFIDENT: '#10b981',
      FEARFUL: '#ef4444',
      GREEDY: '#f59e0b',
      ANXIOUS: '#f97316',
      NEUTRAL: '#6b7280',
      EXCITED: '#8b5cf6',
      FRUSTRATED: '#dc2626',
    };
    return colors[emotion] || '#6b7280';
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{data.emotion}</p>
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Trades:</span> {data.trades}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Win Rate:</span> {data.winRate}%
            </p>
            <p className={`font-medium ${data.avgPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <span className="font-medium text-gray-700">Avg P&L:</span> {data.avgPnL >= 0 ? '+' : ''}{data.avgPnL.toFixed(2)}
            </p>
            {data.confidence > 0 && (
              <p className="text-gray-700">
                <span className="font-medium">Avg Confidence:</span> {data.confidence.toFixed(1)}/10
              </p>
            )}
            {data.stress > 0 && (
              <p className="text-gray-700">
                <span className="font-medium">Avg Stress:</span> {data.stress.toFixed(1)}/10
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Emotion vs Performance
      </h3>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="emotion" 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#6b7280"
              label={{ value: 'Avg P&L', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgPnL" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getEmotionColor(entry.emotion)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations Table */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Recommendations by Emotion</h4>
        <div className="space-y-2">
          {correlations.map((corr, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
            >
              <div
                className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                style={{ backgroundColor: getEmotionColor(corr.emotion) }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{corr.emotion}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{corr.totalTrades} trades</span>
                    <span className={corr.avgPnL >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {corr.avgPnL >= 0 ? '+' : ''}{corr.avgPnL.toFixed(2)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {corr.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionPerformanceChart;
