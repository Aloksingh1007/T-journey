import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, getShareableStats, recalculateStats } from '../services/profile.service';
import { 
  User, 
  Award, 
  TrendingUp, 
  Calendar, 
  Target, 
  Settings,
  Edit2,
  Share2,
  Trophy,
  Zap,
  Star,
  RefreshCw
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProfileEditor } from '../components/profile/ProfileEditor';
import { PrivacySettings } from '../components/profile/PrivacySettings';
import { ShareableStatsCard } from '../components/profile/ShareableStatsCard';
import { toast } from 'sonner';

export function Profile() {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'badges' | 'settings'>('overview');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isPrivacySettingsOpen, setIsPrivacySettingsOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareableStats, setShareableStats] = useState<any>(null);

  // Fetch user profile
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', authUser?.id],
    queryFn: () => getUserProfile(authUser!.id),
    enabled: !!authUser?.id,
  });

  // Recalculate stats mutation
  const recalculateStatsMutation = useMutation({
    mutationFn: recalculateStats,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Stats recalculated successfully!');
    },
    onError: () => {
      toast.error('Failed to recalculate stats');
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-blue-600 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to load profile</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getTradingStyleLabel = (style?: string) => {
    const styles: Record<string, string> = {
      DAY_TRADER: 'Day Trader',
      SWING_TRADER: 'Swing Trader',
      SCALPER: 'Scalper',
      POSITION_TRADER: 'Position Trader',
      ALGORITHMIC: 'Algorithmic',
      HYBRID: 'Hybrid',
    };
    return style ? styles[style] || style : 'Not specified';
  };

  const getExperienceLevelLabel = (level?: string) => {
    const levels: Record<string, string> = {
      BEGINNER: 'Beginner',
      INTERMEDIATE: 'Intermediate',
      ADVANCED: 'Advanced',
      EXPERT: 'Expert',
    };
    return level ? levels[level] || level : 'Not specified';
  };

  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath) return null;
    // If it's already a full URL, return it
    if (avatarPath.startsWith('http')) return avatarPath;
    // Otherwise, prepend the backend URL
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${backendUrl}${avatarPath}`;
  };

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case 'trading':
        return <TrendingUp className="w-5 h-5" />;
      case 'consistency':
        return <Target className="w-5 h-5" />;
      case 'learning':
        return <Star className="w-5 h-5" />;
      case 'milestone':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const handleShareProfile = async () => {
    if (!authUser?.id) return;

    try {
      const stats = await getShareableStats(authUser.id);
      setShareableStats(stats);
      setIsShareModalOpen(true);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast.error('Please enable stats sharing in your privacy settings first');
      } else {
        toast.error('Failed to load shareable stats');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your profile and view your trading journey</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleShareProfile}
          >
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsEditorOpen(true)}
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-start gap-6 -mt-16">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={getAvatarUrl(profile.avatar) || profile.avatar}
                    alt={profile.name || 'Profile'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 pt-16">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.name || 'Anonymous Trader'}
                  </h2>
                  <p className="text-gray-600 mt-1">{profile.email}</p>
                  {profile.bio && (
                    <p className="text-gray-700 mt-3 max-w-2xl">{profile.bio}</p>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total Trades</div>
                  <div className="text-2xl font-bold text-gray-900">{profile.stats.totalTrades}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Win Rate</div>
                  <div className="text-2xl font-bold text-green-600">
                    {profile.stats.winRate.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Total P&L</div>
                  <div className={`text-2xl font-bold ${profile.stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(profile.stats.totalPnL)}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Current Streak</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {profile.stats.currentStreak}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'badges'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Badges & Achievements
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 border-b-2 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Trading Profile */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trading Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-600">Trading Style</div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {getTradingStyleLabel(profile.tradingStyle)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="text-sm text-gray-600">Experience Level</div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {getExperienceLevelLabel(profile.experienceLevel)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                {profile.badges.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    {profile.badges.slice(0, 6).map((badge) => (
                      <div
                        key={badge.id}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                            {getBadgeIcon(badge.category)}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{badge.name}</div>
                            <div className="text-xs text-gray-600">
                              {formatDate(badge.earnedAt)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No badges earned yet. Keep trading to unlock achievements!</p>
                  </div>
                )}
              </div>

              {/* Member Since */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <span className="text-gray-600">Member since </span>
                    <span className="font-semibold text-gray-900">
                      {formatDate(profile.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Detailed Statistics</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => recalculateStatsMutation.mutate()}
                  disabled={recalculateStatsMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${recalculateStatsMutation.isPending ? 'animate-spin' : ''}`} />
                  {recalculateStatsMutation.isPending ? 'Updating...' : 'Refresh Stats'}
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="text-sm text-green-700 mb-2">Longest Win Streak</div>
                  <div className="text-3xl font-bold text-green-900">
                    {profile.stats.longestWinStreak} trades
                  </div>
                </div>
                
                {profile.stats.bestTradeDate && (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <div className="text-sm text-blue-700 mb-2">Best Trading Day</div>
                    <div className="text-3xl font-bold text-blue-900">
                      {formatDate(profile.stats.bestTradeDate)}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Win Rate</span>
                      <span className="font-semibold text-gray-900">
                        {profile.stats.winRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${profile.stats.winRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">All Badges & Achievements</h3>
              
              {profile.badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {profile.badges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                          {getBadgeIcon(badge.category)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{badge.name}</div>
                          <div className="text-xs text-gray-600 capitalize">{badge.category}</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{badge.description}</p>
                      <div className="text-xs text-gray-600">
                        Earned on {formatDate(badge.earnedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">No Badges Yet</h4>
                  <p className="text-gray-600">
                    Start trading and journaling to unlock achievements!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Privacy Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Profile Visibility</div>
                    <div className="text-sm text-gray-600">
                      {profile.privacySettings.profileVisibility === 'PUBLIC' && 'Your profile is visible to everyone'}
                      {profile.privacySettings.profileVisibility === 'PRIVATE' && 'Your profile is private'}
                      {profile.privacySettings.profileVisibility === 'FRIENDS_ONLY' && 'Only friends can see your profile'}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsPrivacySettingsOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Share Statistics</div>
                    <div className="text-sm text-gray-600">
                      {profile.privacySettings.shareStats ? 'Others can see your stats' : 'Your stats are private'}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsPrivacySettingsOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Share Trades</div>
                    <div className="text-sm text-gray-600">
                      {profile.privacySettings.shareTrades ? 'Others can see your trades' : 'Your trades are private'}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsPrivacySettingsOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Share Emotions</div>
                    <div className="text-sm text-gray-600">
                      {profile.privacySettings.shareEmotions ? 'Others can see your emotional data' : 'Your emotional data is private'}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsPrivacySettingsOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">Share Patterns</div>
                    <div className="text-sm text-gray-600">
                      {profile.privacySettings.sharePatterns ? 'Others can see your trading patterns' : 'Your patterns are private'}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsPrivacySettingsOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Change
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Editor Modal */}
      {profile && (
        <ProfileEditor
          profile={profile}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* Privacy Settings Modal */}
      {profile && (
        <PrivacySettings
          currentSettings={profile.privacySettings}
          isOpen={isPrivacySettingsOpen}
          onClose={() => setIsPrivacySettingsOpen(false)}
        />
      )}

      {/* Shareable Stats Card Modal */}
      {shareableStats && (
        <ShareableStatsCard
          stats={shareableStats}
          isOpen={isShareModalOpen}
          onClose={() => {
            setIsShareModalOpen(false);
            setShareableStats(null);
          }}
        />
      )}
    </div>
  );
}
