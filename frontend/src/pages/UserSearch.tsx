import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import communityService, { type UserProfile } from '../services/community.service';
import FollowButton from '../components/community/FollowButton';
import { useNavigate } from 'react-router-dom';

const UserSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [tradingStyle, setTradingStyle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Get full avatar URL
  const getAvatarUrl = (avatarPath: string | null | undefined) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${avatarPath}`;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() && !tradingStyle && !experienceLevel) {
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await communityService.searchUsers(searchQuery, {
        tradingStyle: tradingStyle || undefined,
        experienceLevel: experienceLevel || undefined,
      });
      setUsers(results);
    } catch (err) {
      console.error('Failed to search users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Search Icon */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Find Traders</h1>
              <p className="text-gray-600 text-lg mt-1">
                Connect with traders who match your style
              </p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <form onSubmit={handleSearch} className="space-y-6">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-semibold text-gray-900 mb-3">
                Search by Name or Email
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter name or email..."
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trading Style */}
              <div>
                <label htmlFor="tradingStyle" className="block text-sm font-semibold text-gray-900 mb-3">
                  Trading Style
                </label>
                <select
                  id="tradingStyle"
                  value={tradingStyle}
                  onChange={(e) => setTradingStyle(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                >
                  <option value="">All Styles</option>
                  <option value="DAY_TRADER">Day Trader</option>
                  <option value="SWING_TRADER">Swing Trader</option>
                  <option value="SCALPER">Scalper</option>
                  <option value="POSITION_TRADER">Position Trader</option>
                  <option value="ALGORITHMIC">Algorithmic</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label htmlFor="experienceLevel" className="block text-sm font-semibold text-gray-900 mb-3">
                  Experience Level
                </label>
                <select
                  id="experienceLevel"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all"
                >
                  <option value="">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Searching...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Search Traders</span>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results
              </h2>
              <p className="text-gray-600 mt-1">
                Found {users.length} {users.length === 1 ? 'trader' : 'traders'}
              </p>
            </div>

            {users.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Traders Found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="p-6 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center gap-5 flex-1 cursor-pointer"
                        onClick={() => handleUserClick(user.id)}
                      >
                        {/* Avatar */}
                        {user.avatar ? (
                          <img
                            src={getAvatarUrl(user.avatar) || ''}
                            alt={user.name || 'User'}
                            className="w-20 h-20 rounded-2xl object-cover shadow-md"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-md ${user.avatar ? 'hidden' : ''}`}>
                          {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {user.name || 'Anonymous Trader'}
                          </h3>
                          {user.bio && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {user.bio}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mb-3">
                            {user.tradingStyle && (
                              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                                {user.tradingStyle.replace('_', ' ')}
                              </span>
                            )}
                            {user.experienceLevel && (
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                                {user.experienceLevel}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              <span className="font-semibold text-gray-900">{user.totalTrades}</span>
                              <span className="text-gray-600">trades</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                              <span className="font-semibold text-gray-900">{Number(user.winRate).toFixed(1)}%</span>
                              <span className="text-gray-600">win rate</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Follow Button */}
                      <FollowButton userId={user.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSearch;
