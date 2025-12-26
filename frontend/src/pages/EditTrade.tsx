import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EnhancedTradeForm } from '@/components/trades/EnhancedTradeForm';
import { tradeService } from '@/services/trade.service';
import { handleAPIError, showSuccess, getErrorMessage } from '@/lib/error-handler';
import type { CreateTradeDTO } from '@/types';

export const EditTrade = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch trade data
  const { data: trade, isLoading: isFetchingTrade, error: fetchError, isError } = useQuery({
    queryKey: ['trade', id],
    queryFn: () => tradeService.getTradeById(id!),
    enabled: !!id,
    retry: 2,
  });

  const updateTradeMutation = useMutation({
    mutationFn: async ({ data, screenshots }: { data: CreateTradeDTO; screenshots?: File[] }) => {
      if (!id) throw new Error('Trade ID is required');
      
      // Update trade with P&L recalculation on backend
      await tradeService.updateTrade(id, data);
      
      // Upload new screenshots if provided
      if (screenshots && screenshots.length > 0) {
        await Promise.all(
          screenshots.map((file) => tradeService.uploadScreenshot(id, file))
        );
      }
    },
    onSuccess: () => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['trade', id] });
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      
      showSuccess("Trade updated successfully!");

      // Redirect to trade detail after a short delay
      setTimeout(() => {
        navigate(`/trades/${id}`);
      }, 1000);
    },
    onError: (err) => {
      handleAPIError(err, "Failed to update trade. Please try again.");
    },
  });

  const handleSubmit = async (data: CreateTradeDTO, screenshots?: File[]) => {
    updateTradeMutation.mutate({ data, screenshots });
  };

  if (isFetchingTrade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30">
        <header className="glass border-b border-white/20 sticky top-0 z-sticky backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Edit Trade
              </h1>
              <button
                onClick={() => navigate(`/trades/${id}`)}
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
              >
                ← Back to Trade
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-neutral-600">Loading trade data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !trade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30">
        <header className="glass border-b border-white/20 sticky top-0 z-sticky backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Edit Trade
              </h1>
              <button
                onClick={() => navigate('/trades')}
                className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
              >
                ← Back to Trades
              </button>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass rounded-2xl shadow-xl border border-danger-200 p-6 animate-fade-in">
            <h2 className="text-lg font-semibold text-danger-900 mb-2">Failed to Load Trade</h2>
            <p className="text-danger-700 mb-4">
              {fetchError ? getErrorMessage(fetchError) : "The trade you're trying to edit doesn't exist or you don't have permission to edit it."}
            </p>
            <button
              onClick={() => navigate('/trades')}
              className="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors shadow-lg hover:shadow-glow-danger"
            >
              Back to Trades
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30">
      {/* Navigation Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-sticky backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Edit Trade
            </h1>
            <button
              onClick={() => navigate(`/trades/${id}`)}
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
            >
              ← Back to Trade
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Trade Form */}
        <EnhancedTradeForm
          onSubmit={handleSubmit}
          isLoading={updateTradeMutation.isPending}
          initialData={{
            // Basic Info
            tradeDate: trade.tradeDate,
            entryTime: trade.entryTime,
            exitTime: trade.exitTime,
            tradeType: trade.tradeType,
            instrument: trade.instrument,
            tradeDirection: trade.tradeDirection,
            optionType: trade.optionType,
            avgBuyPrice: Number(trade.avgBuyPrice),
            avgSellPrice: Number(trade.avgSellPrice),
            positionSize: Number(trade.positionSize),
            leverage: Number(trade.leverage),
            baseCurrency: trade.baseCurrency,
            emotionalState: trade.emotionalState,
            isImpulsive: trade.isImpulsive,
            
            // Pre-Trade Psychology & Planning
            setupConfidence: trade.setupConfidence,
            marketCondition: trade.marketCondition,
            timeOfDay: trade.timeOfDay,
            newsImpact: trade.newsImpact,
            strategy: trade.strategy,
            stopLossPrice: trade.stopLossPrice ? Number(trade.stopLossPrice) : undefined,
            takeProfitPrice: trade.takeProfitPrice ? Number(trade.takeProfitPrice) : undefined,
            positionSizingReason: trade.positionSizingReason,
            
            // Entry Decision
            entryTrigger: trade.entryTrigger,
            hadHesitation: trade.hadHesitation,
            deviatedFromPlan: trade.deviatedFromPlan,
            deviationReason: trade.deviationReason,
            
            // During Trade
            monitoringFrequency: trade.monitoringFrequency,
            stressLevel: trade.stressLevel,
            consideredEarlyExit: trade.consideredEarlyExit,
            earlyExitReason: trade.earlyExitReason,
            
            // Exit Decision
            exitReason: trade.exitReason,
            exitSatisfaction: trade.exitSatisfaction,
            wouldDoDifferently: trade.wouldDoDifferently,
            
            // Post-Trade Reflection
            keyLesson: trade.keyLesson,
            mistakesMade: trade.mistakesMade || [],
            whatWentWell: trade.whatWentWell,
            conditionsMatchExpectation: trade.conditionsMatchExpectation,
            
            // Additional Context
            sessionQuality: trade.sessionQuality,
            physicalState: trade.physicalState,
            mentalState: trade.mentalState,
            externalFactors: trade.externalFactors || [],
            initialNotes: trade.initialNotes || trade.notes?.[0]?.content || '',
          }}
          mode="edit"
        />
      </main>
    </div>
  );
};
