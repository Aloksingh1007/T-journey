import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Target, DollarSign, Loader2 } from 'lucide-react';
import communityService, { type LeaderboardEntry } from '../services/community.service';
import FollowButton from '../components/community/FollowButton';

const Leaderboard: React.FC = () => {
  const [leaderboardType, setLeaderboardType] = useState<'trader_score' | 'win_rate' | 'consistency' | 'total_pnl'>('trader_score');
  const [period, setPeriod] = useState<'all_time' | 'monthly' | 'weekly'>('all_time');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get full avatar URL
  const getAvatarUrl = (avatarPath: string | null | undefined) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    // Remove /api from VITE_API_URL for file uploads
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');
    return `${baseUrl}${avatarPath}`;
  };

  useEffect(() => {
    loadLeaderboard();
  }, [leaderboardType, period]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await communityService.getLeaderboard(leaderboardType, period);
      setEntries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-gray-600 dark:text-gray-400';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Trophy className={`w-6 h-6 ${getRankColor(rank)}`} />;
    }
    return <span className="text-lg font-bold text-gray-600 dark:text-gray-400">#{rank}</span>;
  };

  const getLeaderboardTitle = () => {
    switch (leaderboardType) {
      case 'trader_score':
        return 'Top Traders';
      case 'win_rate':
        return 'Highest Win Rate';
      case 'consistency':
        return 'Most Consistent';
      case 'total_pnl':
        return 'Highest P&L';
      default:
        return 'Leaderboard';
    }
  };

  const getMetricValue = (entry: LeaderboardEntry) => {
    switch (leaderboardType) {
      case 'win_rate':
        return `${Number(entry.winRate).toFixed(1)}%`;
      case 'consistency':
        return `${entry.longestWinStreak} trades`;
      case 'total_pnl':
        return `$${entry.totalPnL?.toFixed(2) || '0.00'}`;
      default:
        return `${entry.totalTrades} trades`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Trophy Icon */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
              <p className="text-gray-600 text-lg mt-1">
                See how you rank against other traders
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Leaderboard Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Leaderboard Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setLeaderboardType('trader_score')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    leaderboardType === 'trader_score'
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>Score</span>
                </button>
                <button
                  onClick={() => setLeaderboardType('win_rate')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    leaderboardType === 'win_rate'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Target className="w-4 h-4" />
                  <span>Win Rate</span>
                </button>
                <button
                  onClick={() => setLeaderboardType('consistency')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    leaderboardType === 'consistency'
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Consistency</span>
                </button>
                <button
                  onClick={() => setLeaderboardType('total_pnl')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    leaderboardType === 'total_pnl'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>P&L</span>
                </button>
              </div>
            </div>

            {/* Period */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Time Period
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['all_time', 'monthly', 'weekly'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p as any)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all ${
                      period === p
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {p.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{getLeaderboardTitle()}</h2>
            <p className="text-gray-600 mt-1">Top performers in the community</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading leaderboard...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-800 font-medium mb-3">{error}</p>
                <button
                  onClick={loadLeaderboard}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Entries Yet</h3>
              <p className="text-gray-600">
                Be the first to appear on this leaderboard!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-6 hover:bg-gray-50 transition-all ${
                    entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50/30 to-orange-50/30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      {/* Rank Badge */}
                      <div className="w-16 flex items-center justify-center">
                        {entry.rank <= 3 ? (
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md ${
                            entry.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            entry.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            'bg-gradient-to-br from-orange-400 to-orange-600'
                          }`}>
                            <Trophy className="w-7 h-7 text-white" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                            <span className="text-2xl font-bold text-gray-600">#{entry.rank}</span>
                          </div>
                        )}
                      </div>

                      {/* Avatar */}
                      {entry.avatar ? (
                        <img
                          src={getAvatarUrl(entry.avatar) || ''}
                          alt={entry.name || 'User'}
                          className="w-16 h-16 rounded-2xl object-cover shadow-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md ${entry.avatar ? 'hidden' : ''}`}>
                        {entry.name?.[0]?.toUpperCase() || 'U'}
                      </div>

                      {/* User Info */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {entry.name || 'Anonymous Trader'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {entry.tradingStyle && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg">
                              {entry.tradingStyle.replace('_', ' ')}
                            </span>
                          )}
                          {entry.experienceLevel && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                              {entry.experienceLevel}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900">
                          {getMetricValue(entry)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {entry.totalTrades} total trades
                        </p>
                      </div>
                      <FollowButton userId={entry.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
