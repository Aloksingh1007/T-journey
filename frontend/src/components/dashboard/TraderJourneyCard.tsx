import { TrendingUp, Calendar, Award, Target } from 'lucide-react';

interface TraderJourneyCardProps {
  totalTrades: number;
  winRate: number;
  currentStreak?: { type: 'win' | 'loss'; count: number };
}

export function TraderJourneyCard({ totalTrades, winRate, currentStreak }: TraderJourneyCardProps) {
  // Calculate milestones
  const milestones = [
    { trades: 10, label: 'First Steps', achieved: totalTrades >= 10 },
    { trades: 50, label: 'Getting Started', achieved: totalTrades >= 50 },
    { trades: 100, label: 'Committed Trader', achieved: totalTrades >= 100 },
    { trades: 250, label: 'Experienced', achieved: totalTrades >= 250 },
    { trades: 500, label: 'Veteran Trader', achieved: totalTrades >= 500 },
    { trades: 1000, label: 'Master Level', achieved: totalTrades >= 1000 },
  ];

  const currentMilestone = milestones.filter((m) => m.achieved).pop();
  const nextMilestone = milestones.find((m) => !m.achieved);

  return (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
      <div className="flex items-center mb-4">
        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg mr-2">
          <Award className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-semibold">Your Trading Journey</h3>
      </div>

      <div className="space-y-4">
        {/* Current Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-white/80 text-sm mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                Total Trades
              </div>
              <div className="text-3xl font-bold">{totalTrades}</div>
            </div>
            <div>
              <div className="flex items-center text-white/80 text-sm mb-1">
                <Target className="w-4 h-4 mr-1" />
                Win Rate
              </div>
              <div className="text-3xl font-bold">{winRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Current Streak */}
        {currentStreak && currentStreak.count > 1 && (
          <div
            className={`${
              currentStreak.type === 'win' ? 'bg-green-500/20' : 'bg-red-500/20'
            } backdrop-blur-sm rounded-lg p-3 border border-white/20`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span className="font-semibold">
                  {currentStreak.type === 'win' ? 'Winning' : 'Losing'} Streak
                </span>
              </div>
              <div className="text-2xl font-bold">{currentStreak.count}</div>
            </div>
          </div>
        )}

        {/* Milestone Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">
              {currentMilestone ? currentMilestone.label : 'Start Trading'}
            </div>
            {nextMilestone && (
              <div className="text-xs text-white/80">
                Next: {nextMilestone.label} ({nextMilestone.trades} trades)
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {nextMilestone && (
            <>
              <div className="bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${((totalTrades - (currentMilestone?.trades || 0)) / (nextMilestone.trades - (currentMilestone?.trades || 0))) * 100}%`,
                  }}
                >
                  <div className="h-full bg-gradient-to-r from-white to-yellow-200 animate-pulse"></div>
                </div>
              </div>
              <div className="text-xs text-white/80">
                {nextMilestone.trades - totalTrades} trades until {nextMilestone.label}
              </div>
            </>
          )}

          {!nextMilestone && (
            <div className="text-center py-2">
              <div className="text-2xl mb-1">🏆</div>
              <div className="text-sm font-semibold">All Milestones Achieved!</div>
            </div>
          )}
        </div>

        {/* Milestone Timeline */}
        <div className="flex items-center justify-between pt-2">
          {milestones.slice(0, 5).map((milestone, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-3 h-3 rounded-full ${
                  milestone.achieved ? 'bg-white' : 'bg-white/30'
                } transition-all duration-500`}
              />
              <div className="text-xs mt-1 text-white/60">{milestone.trades}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
