import React from 'react';
import type { EmotionalPattern } from '../../types';

interface EmotionPatternCardProps {
  pattern: EmotionalPattern;
}

const EmotionPatternCard: React.FC<EmotionPatternCardProps> = ({ pattern }) => {
  const getPatternIcon = (patternType: string) => {
    switch (patternType) {
      case 'greedy_after_wins':
        return '💰';
      case 'fearful_after_losses':
        return '😰';
      case 'revenge_trading':
        return '⚔️';
      case 'overconfident':
        return '🦸';
      case 'analysis_paralysis':
        return '🤔';
      case 'fomo':
        return '🏃';
      case 'emotional_volatility':
        return '🎢';
      default:
        return '📊';
    }
  };

  const getPatternTitle = (patternType: string) => {
    return patternType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'positive':
        return '✓ Positive';
      case 'negative':
        return '✗ Negative';
      default:
        return '○ Neutral';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getPatternIcon(pattern.patternType)}</div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {getPatternTitle(pattern.patternType)}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getImpactColor(pattern.impact)}`}>
                {getImpactBadge(pattern.impact)}
              </span>
              <span className="text-xs text-gray-500">
                Frequency: {(pattern.frequency * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Impact Score */}
        <div className="text-right">
          <div className="text-xs text-gray-500 mb-1">Impact on P&L</div>
          <div className={`text-lg font-bold font-mono ${
            pattern.impactScore > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {pattern.impactScore > 0 ? '+' : ''}
            {pattern.impactScore.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 text-sm leading-relaxed mb-4">
        {pattern.description}
      </p>

      {/* Recommendation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="text-xs font-semibold text-blue-900 mb-1">Recommendation</div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {pattern.recommendation}
            </p>
          </div>
        </div>
      </div>

      {/* Examples */}
      {pattern.examples.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">
            Found in {pattern.examples.length} trade{pattern.examples.length > 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionPatternCard;
