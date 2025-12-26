import { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Download, 
  TrendingUp, 
  Target, 
  Trophy,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import type { ShareableStats } from '../../services/profile.service';

interface ShareableStatsCardProps {
  stats: ShareableStats;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareableStatsCard({ stats, isOpen, onClose }: ShareableStatsCardProps) {
  const [copied, setCopied] = useState(false);
  const [selectedCard, setSelectedCard] = useState<'overview' | 'performance' | 'achievements'>('overview');

  if (!isOpen) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTradingStyleLabel = (style: string | null) => {
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

  const getExperienceLevelLabel = (level: string | null) => {
    const levels: Record<string, string> = {
      BEGINNER: 'Beginner',
      INTERMEDIATE: 'Intermediate',
      ADVANCED: 'Advanced',
      EXPERT: 'Expert',
    };
    return level ? levels[level] || level : 'Not specified';
  };

  const generateShareableLink = () => {
    const baseUrl = window.location.origin;
    const profileUrl = `${baseUrl}/profile/${stats.name || 'trader'}`;
    return profileUrl;
  };

  const handleCopyLink = async () => {
    const link = generateShareableLink();
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Profile link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleCopyStats = async () => {
    const statsText = `
🎯 Trading Stats for ${stats.name || 'Anonymous Trader'}

📊 Performance:
• Total Trades: ${stats.totalTrades}
• Win Rate: ${stats.winRate.toFixed(1)}%
• Total P&L: ${formatCurrency(stats.totalPnL)}
• Current Streak: ${stats.currentStreak}
• Longest Win Streak: ${stats.longestWinStreak}

🏆 Trading Profile:
• Style: ${getTradingStyleLabel(stats.tradingStyle)}
• Experience: ${getExperienceLevelLabel(stats.experienceLevel)}
${stats.bestTradeDate ? `• Best Trading Day: ${formatDate(stats.bestTradeDate)}` : ''}

🏅 Achievements: ${stats.badges.length} badges earned

View full profile: ${generateShareableLink()}
    `.trim();

    try {
      await navigator.clipboard.writeText(statsText);
      toast.success('Stats copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy stats');
    }
  };

  const handleDownloadCard = () => {
    // This would ideally generate an image, but for now we'll just show a message
    toast.info('Image download feature coming soon!');
  };

  const getAvatarUrl = (avatarPath: string | null) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    return `${backendUrl}${avatarPath}`;
  };

  const renderOverviewCard = () => (
    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        {stats.avatar ? (
          <img
            src={getAvatarUrl(stats.avatar) || stats.avatar}
            alt={stats.name || 'Trader'}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center text-3xl font-bold">
            {stats.name?.[0]?.toUpperCase() || 'T'}
          </div>
        )}
        <div>
          <h3 className="text-2xl font-bold">{stats.name || 'Anonymous Trader'}</h3>
          <p className="text-white/80">{getTradingStyleLabel(stats.tradingStyle)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-white/70 text-sm mb-1">Total Trades</div>
          <div className="text-3xl font-bold">{stats.totalTrades}</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-white/70 text-sm mb-1">Win Rate</div>
          <div className="text-3xl font-bold">{stats.winRate.toFixed(1)}%</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-white/70 text-sm mb-1">Total P&L</div>
          <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {formatCurrency(stats.totalPnL)}
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-white/70 text-sm mb-1">Current Streak</div>
          <div className="text-3xl font-bold">{stats.currentStreak}</div>
        </div>
      </div>

      <div className="text-center text-white/60 text-sm">
        Powered by AI Trading Journal
      </div>
    </div>
  );

  const renderPerformanceCard = () => (
    <div className="bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-2xl p-8 text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Performance Metrics</h3>
          <p className="text-white/80">{stats.name || 'Anonymous Trader'}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70">Win Rate</span>
            <span className="text-xl font-bold">{stats.winRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${stats.winRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Longest Win Streak</span>
            <span className="text-2xl font-bold">{stats.longestWinStreak}</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Total P&L</span>
            <span className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {formatCurrency(stats.totalPnL)}
            </span>
          </div>
        </div>

        {stats.bestTradeDate && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-white/70" />
              <span className="text-white/70">Best Trading Day</span>
            </div>
            <div className="text-lg font-semibold">{formatDate(stats.bestTradeDate)}</div>
          </div>
        )}
      </div>

      <div className="text-center text-white/60 text-sm">
        Powered by AI Trading Journal
      </div>
    </div>
  );

  const renderAchievementsCard = () => (
    <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-2xl p-8 text-white shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Trophy className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-2xl font-bold">Achievements</h3>
          <p className="text-white/80">{stats.name || 'Anonymous Trader'}</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
        <div className="text-center mb-4">
          <div className="text-5xl font-bold">{stats.badges.length}</div>
          <div className="text-white/70">Badges Earned</div>
        </div>

        {stats.badges.length > 0 && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {stats.badges.slice(0, 5).map((badge) => (
              <div
                key={badge.id}
                className="bg-white/10 rounded-lg p-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-yellow-400/30 rounded-lg flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-yellow-200" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-sm text-white/70">{badge.description}</div>
                </div>
              </div>
            ))}
            {stats.badges.length > 5 && (
              <div className="text-center text-white/70 text-sm">
                +{stats.badges.length - 5} more badges
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">{stats.totalTrades}</div>
          <div className="text-white/70 text-sm">Total Trades</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-2xl font-bold">{stats.currentStreak}</div>
          <div className="text-white/70 text-sm">Current Streak</div>
        </div>
      </div>

      <div className="text-center text-white/60 text-sm">
        Powered by AI Trading Journal
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share Your Stats</h2>
              <p className="text-sm text-gray-600">Choose a card style and share your achievements</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Card Type Selector */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setSelectedCard('overview')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedCard === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Target className="w-4 h-4 inline-block mr-2" />
              Overview
            </button>
            <button
              onClick={() => setSelectedCard('performance')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedCard === 'performance'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline-block mr-2" />
              Performance
            </button>
            <button
              onClick={() => setSelectedCard('achievements')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                selectedCard === 'achievements'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Trophy className="w-4 h-4 inline-block mr-2" />
              Achievements
            </button>
          </div>

          {/* Card Preview */}
          <div className="mb-6">
            <div className="max-w-md mx-auto">
              {selectedCard === 'overview' && renderOverviewCard()}
              {selectedCard === 'performance' && renderPerformanceCard()}
              {selectedCard === 'achievements' && renderAchievementsCard()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Profile Link
                </>
              )}
            </Button>
            <Button
              onClick={handleCopyStats}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Stats Text
            </Button>
            <Button
              onClick={handleDownloadCard}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Card
            </Button>
          </div>

          {/* Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <Share2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Share your trading journey</p>
                <p className="text-blue-700">
                  These shareable cards respect your privacy settings. Only information you've
                  chosen to share publicly will be visible to others.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
