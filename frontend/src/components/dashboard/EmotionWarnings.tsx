import React from 'react';
import { useEmotionPatterns } from '../../hooks/useEmotionAnalysis';

interface EmotionWarningsProps {
  startDate?: string;
  endDate?: string;
}

const EmotionWarnings: React.FC<EmotionWarningsProps> = ({ startDate, endDate }) => {
  const { data, isLoading } = useEmotionPatterns({ startDate, endDate, minTrades: 5 });

  if (isLoading) {
    return null; // Don't show loading state on dashboard
  }

  if (!data || !data.patterns || data.patterns.length === 0) {
    return null; // No warnings to display
  }

  // Filter for negative patterns only
  const negativePatterns = data.patterns.filter(p => p.impact === 'negative');

  if (negativePatterns.length === 0) {
    return null;
  }

  // Show only the most impactful pattern
  const mostImpactful = negativePatterns.reduce((prev, current) => 
    Math.abs(current.impactScore) > Math.abs(prev.impactScore) ? current : prev
  );

  const getPatternIcon = (patternType: string) => {
    const icons: Record<string, string> = {
      greedy_after_wins: '💰',
      fearful_after_losses: '😰',
      revenge_trading: '⚔️',
      overconfident: '🦸',
      analysis_paralysis: '🤔',
      fomo: '🏃',
      emotional_volatility: '🎢',
    };
    return icons[patternType] || '⚠️';
  };

  const getPatternTitle = (patternType: string) => {
    return patternType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border-l-4 border-orange-500 rounded-lg p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
            {getPatternIcon(mostImpactful.patternType)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              ⚠️ Emotional Pattern Detected
            </h3>
            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
              {(mostImpactful.frequency * 100).toFixed(0)}% of trades
            </span>
          </div>

          <h4 className="font-medium text-gray-800 mb-2">
            {getPatternTitle(mostImpactful.patternType)}
          </h4>

          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            {mostImpactful.description}
          </p>

          {/* Impact Score */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-600">Impact on P&L:</span>
            <span className="text-sm font-bold font-mono text-red-600">
              {mostImpactful.impactScore.toFixed(2)}
            </span>
          </div>

          {/* Recommendation */}
          <div className="bg-white/80 rounded-lg p-3 border border-orange-200">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <div className="text-xs font-semibold text-orange-900 mb-1">Recommendation</div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {mostImpactful.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close button (optional) */}
        <button
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* View All Link */}
      {negativePatterns.length > 1 && (
        <div className="mt-4 pt-4 border-t border-orange-200">
          <a
            href="/analytics?tab=emotions"
            className="text-sm font-medium text-orange-700 hover:text-orange-800 flex items-center gap-1"
          >
            View all {negativePatterns.length} patterns
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default EmotionWarnings;
