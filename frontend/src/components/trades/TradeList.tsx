import { useState } from 'react';
import type { Trade } from '@/types';
import { TradeCard } from './TradeCard';
import { Grid3x3, List } from 'lucide-react';

interface TradeListProps {
  trades: Trade[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

export const TradeList = ({ trades, isLoading, onDelete }: TradeListProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="glass rounded-xl shadow-lg border border-white/20 p-5 shimmer overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="h-6 bg-neutral-300 rounded-lg w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-300 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-neutral-300 rounded w-1/3"></div>
              </div>
              <div className="h-8 bg-neutral-300 rounded-lg w-24"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-neutral-300 rounded"></div>
              <div className="h-4 bg-neutral-300 rounded"></div>
              <div className="h-4 bg-neutral-300 rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-7 bg-neutral-300 rounded-lg w-20"></div>
              <div className="h-7 bg-neutral-300 rounded-lg w-20"></div>
              <div className="h-7 bg-neutral-300 rounded-lg w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (trades.length === 0) {
    return (
      <div className="glass rounded-2xl shadow-xl border border-white/20 p-12 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <svg
              className="mx-auto h-20 w-20 text-primary-500 relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-neutral-900 mb-2">
            No trades found
          </h3>
          <p className="text-neutral-600">
            Get started by adding your first trade or adjust your filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="glass rounded-lg p-1 flex gap-1 border border-white/20">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="Grid view"
          >
            <Grid3x3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
            title="List view"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Trade Cards */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {trades.map((trade) => (
          <TradeCard key={trade.id} trade={trade} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
};
