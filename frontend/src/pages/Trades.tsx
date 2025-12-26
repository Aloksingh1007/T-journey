import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { TradeList } from '@/components/trades/TradeList';
import { TradeFilters } from '@/components/trades/TradeFilters';
import { tradeService } from '@/services/trade.service';
import QuickAddTradeModal from '@/components/trades/QuickAddTradeModal';
import type { GetTradesQuery } from '@/types';

export const Trades = () => {
  const navigate = useNavigate();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [filters, setFilters] = useState<GetTradesQuery>({
    sortBy: 'tradeDate',
    sortOrder: 'desc',
    limit: 50,
    offset: 0,
  });

  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['trades', filters],
    queryFn: () => tradeService.getTrades(filters),
    staleTime: 1 * 60 * 1000, // 1 minute - trades list updates frequently
    gcTime: 5 * 60 * 1000, // 5 minutes cache
    retry: 2,
    // Keep previous data while fetching new data for better UX
    placeholderData: (previousData) => previousData,
  });

  const handleFiltersChange = (newFilters: GetTradesQuery) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      sortBy: 'tradeDate',
      sortOrder: 'desc',
      limit: 50,
      offset: 0,
    });
  };

  const handleLoadMore = () => {
    if (data && data.trades.length < data.pagination.total) {
      setFilters((prev) => ({
        ...prev,
        offset: (prev.offset || 0) + (prev.limit || 50),
      }));
    }
  };

  const hasMore = data && data.trades.length < data.pagination.total;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/30 to-accent-50/30">
      {/* Navigation Header */}
      <header className="glass border-b border-white/20 sticky top-0 z-sticky backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              My Trades
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm text-neutral-600 hover:text-neutral-900 
                  transition-colors duration-200"
              >
                ← Dashboard
              </button>
              <Button 
                onClick={() => setIsQuickAddOpen(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 
                  hover:to-emerald-700 text-white shadow-lg hover:shadow-glow-primary transition-all duration-300 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Quick Add
              </Button>
              <Button 
                onClick={() => navigate('/trades/add')}
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 
                  hover:to-accent-700 text-white shadow-lg hover:shadow-glow-primary transition-all duration-300"
              >
                + Detailed Add
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Add Modal */}
      <QuickAddTradeModal 
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <TradeFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Trades List */}
          <div className="flex-1">
            {isError && (
              <div className="bg-white rounded-xl border border-danger-200 shadow-md p-4 mb-6 animate-slide-down">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-danger-800 font-semibold">
                      Failed to load trades
                    </p>
                    <p className="text-danger-600 text-sm mt-1">
                      {error instanceof Error ? error.message : 'Please try again later.'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="hover:shadow-glow-danger transition-all duration-200"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {data && (
              <div className="mb-6 bg-white rounded-lg shadow-sm p-3 border border-gray-100">
                <p className="text-sm text-neutral-700 font-medium">
                  Showing {data.trades.length} of {data.pagination.total} trades
                </p>
              </div>
            )}

            <TradeList 
              trades={data?.trades || []} 
              isLoading={isLoading}
              onDelete={(id) => {
                // Handle delete - you can implement this with mutation
                console.log('Delete trade:', id);
              }}
            />

            {/* Load More Button */}
            {hasMore && !isLoading && (
              <div className="mt-8 text-center">
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore}
                  className="glass border-primary-300 hover:border-primary-500 hover:shadow-glow-primary 
                    transition-all duration-300"
                >
                  Load More Trades
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
