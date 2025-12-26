import React from 'react';
import type { EmotionTimeline as EmotionTimelineType } from '../../types';

interface EmotionTimelineProps {
  timeline: EmotionTimelineType;
}

const EmotionTimeline: React.FC<EmotionTimelineProps> = ({ timeline }) => {
  const getSentimentColor = (sentiment: string) => {
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('confident') || lowerSentiment.includes('satisfied') || lowerSentiment.includes('calm')) {
      return 'text-green-600 bg-green-50 border-green-200';
    }
    if (lowerSentiment.includes('stressed') || lowerSentiment.includes('anxious') || lowerSentiment.includes('disappointed')) {
      return 'text-red-600 bg-red-50 border-red-200';
    }
    if (lowerSentiment.includes('uncertain') || lowerSentiment.includes('impulsive')) {
      return 'text-orange-600 bg-orange-50 border-orange-200';
    }
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getOverallSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Overall Sentiment */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-2">Overall Emotional Journey</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="text-3xl font-bold font-mono">
            <span className={getOverallSentimentColor(timeline.overallSentiment)}>
              {timeline.overallSentiment > 0 ? '+' : ''}
              {timeline.overallSentiment.toFixed(2)}
            </span>
          </div>
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  timeline.overallSentiment > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.abs(timeline.overallSentiment) * 50}%`,
                  marginLeft: timeline.overallSentiment > 0 ? '50%' : 'auto',
                  marginRight: timeline.overallSentiment < 0 ? '50%' : 'auto',
                }}
              />
            </div>
          </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{timeline.emotionalJourney}</p>
      </div>

      {/* Timeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pre-Trade */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <h4 className="font-semibold text-gray-900">Pre-Trade</h4>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Emotion</span>
              <div className="mt-1">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700">
                  {timeline.preTrade.emotion}
                </span>
              </div>
            </div>
            
            {timeline.preTrade.confidence !== null && (
              <div>
                <span className="text-sm text-gray-500">Confidence</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all"
                      style={{ width: `${timeline.preTrade.confidence * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-semibold">
                    {timeline.preTrade.confidence}/10
                  </span>
                </div>
              </div>
            )}

            <div>
              <span className="text-sm text-gray-500">Sentiment</span>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getSentimentColor(timeline.preTrade.sentiment)}`}>
                  {timeline.preTrade.sentiment}
                </span>
              </div>
            </div>

            {timeline.preTrade.hesitation !== null && timeline.preTrade.hesitation && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Had hesitation</span>
              </div>
            )}
          </div>
        </div>

        {/* During Trade */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-semibold">2</span>
            </div>
            <h4 className="font-semibold text-gray-900">During Trade</h4>
          </div>

          <div className="space-y-3">
            {timeline.duringTrade.stressLevel !== null && (
              <div>
                <span className="text-sm text-gray-500">Stress Level</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        timeline.duringTrade.stressLevel >= 7 ? 'bg-red-500' :
                        timeline.duringTrade.stressLevel >= 4 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${timeline.duringTrade.stressLevel * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-semibold">
                    {timeline.duringTrade.stressLevel}/10
                  </span>
                </div>
              </div>
            )}

            <div>
              <span className="text-sm text-gray-500">Sentiment</span>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getSentimentColor(timeline.duringTrade.sentiment)}`}>
                  {timeline.duringTrade.sentiment}
                </span>
              </div>
            </div>

            {timeline.duringTrade.consideredEarlyExit !== null && timeline.duringTrade.consideredEarlyExit && (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>Considered early exit</span>
              </div>
            )}
          </div>
        </div>

        {/* Post-Trade */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-semibold">3</span>
            </div>
            <h4 className="font-semibold text-gray-900">Post-Trade</h4>
          </div>

          <div className="space-y-3">
            {timeline.postTrade.satisfaction !== null && (
              <div>
                <span className="text-sm text-gray-500">Satisfaction</span>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all"
                      style={{ width: `${timeline.postTrade.satisfaction * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono font-semibold">
                    {timeline.postTrade.satisfaction}/10
                  </span>
                </div>
              </div>
            )}

            <div>
              <span className="text-sm text-gray-500">Sentiment</span>
              <div className="mt-1">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getSentimentColor(timeline.postTrade.sentiment)}`}>
                  {timeline.postTrade.sentiment}
                </span>
              </div>
            </div>

            {timeline.postTrade.keyInsights.length > 0 && (
              <div>
                <span className="text-sm text-gray-500 block mb-2">Key Insights</span>
                <ul className="space-y-1">
                  {timeline.postTrade.keyInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionTimeline;
