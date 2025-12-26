import React from 'react';
import { useEmotionPatterns } from '../../hooks/useEmotionAnalysis';
import EmotionPatternCard from './EmotionPatternCard';
import EmotionPerformanceChart from './EmotionPerformanceChart';

interface EmotionInsightsProps {
  startDate?: string;
  endDate?: string;
}

const EmotionInsights: React.FC<EmotionInsightsProps> = ({ startDate, endDate }) => {
  const { data, isLoading, error } = useEmotionPatterns({ startDate, endDate, minTrades: 10 });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Analyzing emotional patterns...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-red-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Failed to load emotion insights</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  if (data.message) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-2 text-blue-800">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>{data.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Emotional Insights</h2>
          <p className="text-gray-600 mt-1">
            Analysis based on {data.totalTrades} trades
          </p>
        </div>
      </div>

      {/* Emotion Performance Chart */}
      {data.correlations && data.correlations.length > 0 && (
        <EmotionPerformanceChart correlations={data.correlations} />
      )}

      {/* Stress Analysis */}
      {data.stressAnalysis && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Stress Performance Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Average Stress Level</div>
              <div className="text-2xl font-bold text-gray-900">
                {data.stressAnalysis.avgStressLevel.toFixed(1)}/10
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Optimal Stress Range</div>
              <div className="text-2xl font-bold text-gray-900">
                {data.stressAnalysis.optimalStressRange.min}-{data.stressAnalysis.optimalStressRange.max}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-500 mb-1">Stress-P&L Correlation</div>
              <div className={`text-2xl font-bold ${
                data.stressAnalysis.stressVsPnLCorrelation < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                {data.stressAnalysis.stressVsPnLCorrelation.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 leading-relaxed">
              {data.stressAnalysis.recommendation}
            </p>
          </div>
        </div>
      )}

      {/* Emotional Patterns */}
      {data.patterns && data.patterns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detected Patterns ({data.patterns.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {data.patterns.map((pattern, index) => (
              <EmotionPatternCard key={index} pattern={pattern} />
            ))}
          </div>
        </div>
      )}

      {/* No patterns found */}
      {(!data.patterns || data.patterns.length === 0) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">No concerning emotional patterns detected!</span>
          </div>
          <p className="text-sm text-green-700 mt-2">
            Your trading psychology appears to be well-balanced. Keep up the good work!
          </p>
        </div>
      )}
    </div>
  );
};

export default EmotionInsights;
