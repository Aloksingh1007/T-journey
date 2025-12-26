import type { Trade } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import EmotionTimeline from '../emotion/EmotionTimeline';
import { useEmotionTimeline } from '../../hooks/useEmotionAnalysis';

interface TradeDetailProps {
  trade: Trade & {
    statistics?: {
      instrument: {
        totalTrades: number;
        winningTrades: number;
        winRate: number;
        avgPnL: number;
      };
      emotionalState: {
        totalTrades: number;
        winningTrades: number;
        winRate: number;
        avgPnL: number;
      };
      tradeType: {
        totalTrades: number;
        winningTrades: number;
        winRate: number;
        avgPnL: number;
      };
    };
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const TradeDetail = ({ trade, onEdit, onDelete }: TradeDetailProps) => {
  const isProfitable = Number(trade.pnl) > 0;
  
  // Fetch emotion timeline for this trade
  const { data: emotionTimeline, isLoading: isLoadingEmotion, error: emotionError } = useEmotionTimeline(trade.id);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'INR' ? 'INR' : 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      CONFIDENT: 'bg-green-100 text-green-800',
      FEARFUL: 'bg-purple-100 text-purple-800',
      GREEDY: 'bg-orange-100 text-orange-800',
      ANXIOUS: 'bg-yellow-100 text-yellow-800',
      NEUTRAL: 'bg-gray-100 text-gray-800',
      EXCITED: 'bg-blue-100 text-blue-800',
      FRUSTRATED: 'bg-red-100 text-red-800',
    };
    return colors[emotion] || 'bg-gray-100 text-gray-800';
  };

  const getTradeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CRYPTO: 'Crypto',
      STOCK: 'Stock',
      FUTURES: 'Futures',
      OPTIONS: 'Options',
      FUNDED_ACCOUNT: 'Funded Account',
    };
    return labels[type] || type;
  };

  const getDirectionLabel = (direction: string) => {
    return direction === 'BUY_LONG' ? 'Long' : 'Short';
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{trade.instrument}</h2>
            <p className="text-gray-600">
              {format(new Date(trade.tradeDate), 'MMMM dd, yyyy')}
            </p>
            <p className="text-sm text-gray-500">
              Entry: {trade.entryTime} • Exit: {trade.exitTime}
            </p>
          </div>
          <div className="text-right">
            <div
              className={cn(
                'text-3xl font-bold mb-1',
                isProfitable ? 'text-green-600' : 'text-red-600'
              )}
            >
              {isProfitable ? '+' : ''}
              {formatCurrency(Number(trade.pnl), trade.baseCurrency)}
            </div>
            {trade.pnlPercentage !== undefined && trade.pnlPercentage !== null && (
              <div
                className={cn(
                  'text-lg font-medium',
                  isProfitable ? 'text-green-600' : 'text-red-600'
                )}
              >
                {isProfitable ? '+' : ''}
                {Number(trade.pnlPercentage).toFixed(2)}%
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Trade
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Trade
          </button>
        </div>
      </div>

      {/* Basic Trade Details Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">📊 Basic Trade Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Trade Type</p>
            <p className="text-base font-medium text-gray-900">
              {getTradeTypeLabel(trade.tradeType)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Direction</p>
            <p className="text-base font-medium text-gray-900">
              {getDirectionLabel(trade.tradeDirection)}
            </p>
          </div>
          {trade.optionType && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Option Type</p>
              <p className="text-base font-medium text-gray-900">{trade.optionType}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500 mb-1">Average Buy Price</p>
            <p className="text-base font-medium text-gray-900">
              {formatCurrency(Number(trade.avgBuyPrice), trade.baseCurrency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Average Sell Price</p>
            <p className="text-base font-medium text-gray-900">
              {formatCurrency(Number(trade.avgSellPrice), trade.baseCurrency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Position Size</p>
            <p className="text-base font-medium text-gray-900">{Number(trade.positionSize)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Leverage</p>
            <p className="text-base font-medium text-gray-900">{Number(trade.leverage) || 1}x</p>
            <p className="text-xs text-gray-400 mt-1">
              Own Capital: {formatCurrency(Number(trade.avgBuyPrice) * Number(trade.positionSize) / (Number(trade.leverage) || 1), trade.baseCurrency)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Base Currency</p>
            <p className="text-base font-medium text-gray-900">{trade.baseCurrency}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              getEmotionColor(trade.emotionalState)
            )}
          >
            {trade.emotionalState.charAt(0) + trade.emotionalState.slice(1).toLowerCase()}
          </span>
          {trade.isImpulsive && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Impulsive Trade
            </span>
          )}
        </div>
      </div>

      {/* Pre-Trade Setup Section */}
      {(trade.setupConfidence || trade.marketCondition || trade.strategy || trade.stopLossPrice || trade.takeProfitPrice) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🎯 Pre-Trade Setup & Planning</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trade.setupConfidence && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Setup Confidence</p>
                <p className="text-base font-medium text-gray-900">{trade.setupConfidence}/10</p>
              </div>
            )}
            {trade.marketCondition && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Market Condition</p>
                <p className="text-base font-medium text-gray-900">{trade.marketCondition.replace(/_/g, ' ')}</p>
              </div>
            )}
            {trade.timeOfDay && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Time of Day</p>
                <p className="text-base font-medium text-gray-900">{trade.timeOfDay.replace(/_/g, ' ')}</p>
              </div>
            )}
            {trade.newsImpact && (
              <div>
                <p className="text-sm text-gray-500 mb-1">News Impact</p>
                <p className="text-base font-medium text-gray-900">{trade.newsImpact.replace(/_/g, ' ')}</p>
              </div>
            )}
            {trade.strategy && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Strategy</p>
                <p className="text-base font-medium text-gray-900">{trade.strategy}</p>
              </div>
            )}
            {trade.stopLossPrice && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Stop Loss</p>
                <p className="text-base font-medium text-gray-900">
                  {formatCurrency(Number(trade.stopLossPrice), trade.baseCurrency)}
                </p>
              </div>
            )}
            {trade.takeProfitPrice && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Take Profit Target</p>
                <p className="text-base font-medium text-gray-900">
                  {formatCurrency(Number(trade.takeProfitPrice), trade.baseCurrency)}
                </p>
              </div>
            )}
            {trade.riskRewardRatio && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Risk-Reward Ratio</p>
                <p className={cn(
                  "text-base font-medium",
                  Number(trade.riskRewardRatio) >= 2 ? "text-green-600" : 
                  Number(trade.riskRewardRatio) >= 1 ? "text-yellow-600" : "text-red-600"
                )}>
                  1:{Number(trade.riskRewardRatio).toFixed(2)}
                </p>
              </div>
            )}
            {trade.positionSizingReason && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Position Sizing Reason</p>
                <p className="text-base font-medium text-gray-900">{trade.positionSizingReason.replace(/_/g, ' ')}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Entry & Management Section */}
      {(trade.entryTrigger || trade.hadHesitation || trade.deviatedFromPlan || trade.stressLevel) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Entry & Trade Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trade.entryTrigger && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Entry Trigger</p>
                <p className="text-base font-medium text-gray-900">{trade.entryTrigger}</p>
              </div>
            )}
            {trade.stressLevel && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Stress Level</p>
                <p className="text-base font-medium text-gray-900">{trade.stressLevel}/10</p>
              </div>
            )}
            {trade.hadHesitation !== undefined && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Had Hesitation</p>
                <p className="text-base font-medium text-gray-900">{trade.hadHesitation ? 'Yes' : 'No'}</p>
              </div>
            )}
            {trade.deviatedFromPlan !== undefined && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Deviated From Plan</p>
                <p className="text-base font-medium text-gray-900">{trade.deviatedFromPlan ? 'Yes' : 'No'}</p>
              </div>
            )}
            {trade.deviationReason && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Deviation Reason</p>
                <p className="text-base font-medium text-gray-900">{trade.deviationReason}</p>
              </div>
            )}
            {trade.monitoringFrequency && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Monitoring Frequency</p>
                <p className="text-base font-medium text-gray-900">{trade.monitoringFrequency}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Exit Details Section */}
      {(trade.exitReason || trade.exitSatisfaction || trade.consideredEarlyExit || trade.wouldDoDifferently) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🎬 Exit Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trade.exitReason && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Exit Reason</p>
                <p className="text-base font-medium text-gray-900">{trade.exitReason}</p>
              </div>
            )}
            {trade.exitSatisfaction && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Exit Satisfaction</p>
                <p className="text-base font-medium text-gray-900">{trade.exitSatisfaction}/10</p>
              </div>
            )}
            {trade.consideredEarlyExit !== undefined && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Considered Early Exit</p>
                <p className="text-base font-medium text-gray-900">{trade.consideredEarlyExit ? 'Yes' : 'No'}</p>
              </div>
            )}
            {trade.earlyExitReason && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500 mb-1">Early Exit Reason</p>
                <p className="text-base font-medium text-gray-900">{trade.earlyExitReason}</p>
              </div>
            )}
            {trade.wouldDoDifferently && (
              <div className="md:col-span-3">
                <p className="text-sm text-gray-500 mb-1">What Would You Do Differently</p>
                <p className="text-base font-medium text-gray-900">{trade.wouldDoDifferently}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reflection & Learning Section */}
      {(trade.keyLesson || trade.mistakesMade || trade.whatWentWell || trade.sessionQuality) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">💡 Reflection & Learning</h3>
          <div className="space-y-4">
            {trade.sessionQuality && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Session Quality</p>
                <p className="text-base font-medium text-gray-900">{trade.sessionQuality}/10</p>
              </div>
            )}
            {trade.keyLesson && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Key Lesson</p>
                <p className="text-base font-medium text-gray-900">{trade.keyLesson}</p>
              </div>
            )}
            {trade.whatWentWell && (
              <div>
                <p className="text-sm text-gray-500 mb-1">What Went Well</p>
                <p className="text-base font-medium text-gray-900">{trade.whatWentWell}</p>
              </div>
            )}
            {trade.mistakesMade && trade.mistakesMade.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Mistakes Made</p>
                <div className="flex flex-wrap gap-2">
                  {trade.mistakesMade.map((mistake, index) => (
                    <span key={index} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                      {mistake}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {trade.conditionsMatchExpectation !== undefined && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Conditions Matched Expectation</p>
                <p className="text-base font-medium text-gray-900">{trade.conditionsMatchExpectation ? 'Yes' : 'No'}</p>
              </div>
            )}
            {trade.physicalState && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Physical State</p>
                <p className="text-base font-medium text-gray-900">{trade.physicalState}</p>
              </div>
            )}
            {trade.mentalState && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Mental State</p>
                <p className="text-base font-medium text-gray-900">{trade.mentalState}</p>
              </div>
            )}
            {trade.externalFactors && trade.externalFactors.length > 0 && (
              <div>
                <p className="text-sm text-gray-500 mb-2">External Factors</p>
                <div className="flex flex-wrap gap-2">
                  {trade.externalFactors.map((factor, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Emotion Analysis Section */}
      {emotionTimeline && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🧠</span>
            <h3 className="text-xl font-semibold text-gray-900">AI Emotion Analysis</h3>
          </div>
          <EmotionTimeline timeline={emotionTimeline} />
        </div>
      )}

      {/* Loading Emotion Analysis */}
      {isLoadingEmotion && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="text-gray-600">Analyzing emotional journey...</span>
          </div>
        </div>
      )}

      {/* Error Loading Emotion Analysis */}
      {emotionError && !isLoadingEmotion && !emotionTimeline && (
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Emotion Analysis Unavailable</h4>
              <p className="text-sm text-yellow-800">
                Unable to load emotion analysis for this trade. This feature requires AI processing which may not be available yet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Section */}
      {trade.statistics && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Related Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Instrument Stats */}
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                {trade.instrument} Performance
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Total Trades</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trade.statistics.instrument.totalTrades}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Win Rate</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trade.statistics.instrument.winRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg P&L</p>
                  <p
                    className={cn(
                      'text-lg font-semibold',
                      trade.statistics.instrument.avgPnL > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {formatCurrency(trade.statistics.instrument.avgPnL, trade.baseCurrency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Emotional State Stats */}
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                {trade.emotionalState.charAt(0) +
                  trade.emotionalState.slice(1).toLowerCase()}{' '}
                Trades
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Total Trades</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trade.statistics.emotionalState.totalTrades}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Win Rate</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trade.statistics.emotionalState.winRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg P&L</p>
                  <p
                    className={cn(
                      'text-lg font-semibold',
                      trade.statistics.emotionalState.avgPnL > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {formatCurrency(trade.statistics.emotionalState.avgPnL, trade.baseCurrency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Trade Type Stats */}
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                {getTradeTypeLabel(trade.tradeType)} Trades
              </h4>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Total Trades</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trade.statistics.tradeType.totalTrades}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Win Rate</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {trade.statistics.tradeType.winRate.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg P&L</p>
                  <p
                    className={cn(
                      'text-lg font-semibold',
                      trade.statistics.tradeType.avgPnL > 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    )}
                  >
                    {formatCurrency(trade.statistics.tradeType.avgPnL, trade.baseCurrency)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notes Section */}
      {(trade.initialNotes || (trade.notes && trade.notes.length > 0)) && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Notes</h3>
          <div className="space-y-4">
            {trade.initialNotes && (
              <div className="border-l-4 border-blue-300 pl-4 py-2 bg-blue-50">
                <p className="text-gray-900 mb-2">{trade.initialNotes}</p>
                <p className="text-xs text-gray-500">Initial trade notes</p>
              </div>
            )}
            {trade.notes && trade.notes.map((note) => (
              <div key={note.id} className="border-l-4 border-gray-300 pl-4 py-2">
                <p className="text-gray-900 mb-2">{note.content}</p>
                <p className="text-xs text-gray-500">
                  {format(new Date(note.createdAt), 'MMM dd, yyyy • h:mm a')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Screenshots Section */}
      {trade.screenshots && trade.screenshots.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Screenshots</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trade.screenshots.map((screenshot) => (
              <div
                key={screenshot.id}
                className="relative group overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={screenshot.url}
                  alt={screenshot.filename}
                  className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm truncate">{screenshot.filename}</p>
                  <p className="text-white/80 text-xs">
                    {format(new Date(screenshot.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
