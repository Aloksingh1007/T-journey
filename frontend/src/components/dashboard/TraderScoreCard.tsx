import { useQuery } from '@tanstack/react-query';
import { getOverallScore } from '../../services/trader-score.service';
import { Trophy, TrendingUp, RefreshCw, Sparkles } from 'lucide-react';
import { ProgressRing } from './ProgressRing';

export function TraderScoreCard() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['traderScore'],
    queryFn: getOverallScore,
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-pulse">
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const score = data?.score || 0;
  const level = data?.level;

  // Color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#2563eb';
    if (score >= 40) return '#eab308';
    return '#dc2626';
  };

  const getGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-blue-500 to-cyan-600';
    if (score >= 40) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-rose-600';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-2 rounded-lg mr-2">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          Trader Score
        </h3>
        <button
          onClick={() => refetch()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-all hover:rotate-180 duration-500"
          title="Recalculate score"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        {/* Circular Progress with glow effect */}
        <div className="relative">
          <ProgressRing progress={score} size={160} strokeWidth={14} color={getStrokeColor(score)}>
            <div className="flex flex-col items-center">
              <span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span>
              <span className="text-xs text-gray-500 font-medium">/ 100</span>
            </div>
          </ProgressRing>
        </div>

        {/* Level Info */}
        <div className="flex-1 ml-8">
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">Current Level</div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${getGradient(score)} bg-clip-text text-transparent mb-1`}>
              {level?.name}
            </div>
            <div className="text-sm text-gray-600">{level?.description}</div>
          </div>

          {level?.nextLevel && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center text-sm text-blue-700 mb-2">
                <TrendingUp className="w-4 h-4 mr-1.5" />
                <span className="font-semibold">Next Level</span>
                <Sparkles className="w-3 h-3 ml-1 text-yellow-500" />
              </div>
              <div className="text-sm text-gray-700 mb-3">
                <span className="font-bold text-blue-700">{level.nextLevel.name}</span>
                <span className="text-gray-600"> • {level.nextLevel.pointsNeeded} points to go</span>
              </div>
              <div className="relative bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${((score - level.minScore) / (level.maxScore - level.minScore)) * 100}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
