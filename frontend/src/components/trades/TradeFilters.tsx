import type { GetTradesQuery, TradeType, Currency, EmotionalState } from '@/types';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TradeFiltersProps {
  filters: GetTradesQuery;
  onFiltersChange: (filters: GetTradesQuery) => void;
  onReset: () => void;
}

export const TradeFilters = ({ filters, onFiltersChange, onReset }: TradeFiltersProps) => {
  const handleFilterChange = (key: keyof GetTradesQuery, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
      offset: 0, // Reset to first page when filters change
    });
  };

  const tradeTypes: TradeType[] = ['CRYPTO', 'STOCK', 'FUTURES', 'OPTIONS', 'FUNDED_ACCOUNT'];
  const currencies: Currency[] = ['INR', 'USD'];
  const emotionalStates: EmotionalState[] = [
    'CONFIDENT',
    'FEARFUL',
    'GREEDY',
    'ANXIOUS',
    'NEUTRAL',
    'EXCITED',
    'FRUSTRATED',
  ];

  const getTradeTypeLabel = (type: TradeType) => {
    const labels: Record<TradeType, string> = {
      CRYPTO: 'Crypto',
      STOCK: 'Stock',
      FUTURES: 'Futures',
      OPTIONS: 'Options',
      FUNDED_ACCOUNT: 'Funded Account',
    };
    return labels[type];
  };

  const getEmotionLabel = (emotion: EmotionalState) => {
    return emotion.charAt(0) + emotion.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-5 space-y-4 sticky top-24 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-neutral-900">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReset}
          className="hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
        >
          Reset
        </Button>
      </div>

      {/* Date Range */}
      <div className="space-y-2">
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={filters.startDate ? filters.startDate.split('T')[0] : ''}
          onChange={(e) => {
            const value = e.target.value;
            handleFilterChange('startDate', value ? new Date(value).toISOString() : '');
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={filters.endDate ? filters.endDate.split('T')[0] : ''}
          onChange={(e) => {
            const value = e.target.value;
            handleFilterChange('endDate', value ? new Date(value).toISOString() : '');
          }}
        />
      </div>

      {/* Trade Type */}
      <div className="space-y-2">
        <Label htmlFor="tradeType">Trade Type</Label>
        <Select
          id="tradeType"
          value={filters.tradeType || ''}
          onChange={(e) => handleFilterChange('tradeType', e.target.value)}
        >
          <option value="">All Types</option>
          {tradeTypes.map((type) => (
            <option key={type} value={type}>
              {getTradeTypeLabel(type)}
            </option>
          ))}
        </Select>
      </div>

      {/* Currency */}
      <div className="space-y-2">
        <Label htmlFor="baseCurrency">Currency</Label>
        <Select
          id="baseCurrency"
          value={filters.baseCurrency || ''}
          onChange={(e) => handleFilterChange('baseCurrency', e.target.value)}
        >
          <option value="">All Currencies</option>
          {currencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
      </div>

      {/* Emotional State */}
      <div className="space-y-2">
        <Label htmlFor="emotionalState">Emotional State</Label>
        <Select
          id="emotionalState"
          value={filters.emotionalState || ''}
          onChange={(e) => handleFilterChange('emotionalState', e.target.value)}
        >
          <option value="">All Emotions</option>
          {emotionalStates.map((emotion) => (
            <option key={emotion} value={emotion}>
              {getEmotionLabel(emotion)}
            </option>
          ))}
        </Select>
      </div>

      {/* Impulsive Filter */}
      <div className="space-y-2">
        <Label htmlFor="isImpulsive">Impulsive Trades</Label>
        <Select
          id="isImpulsive"
          value={
            filters.isImpulsive === undefined
              ? ''
              : filters.isImpulsive
              ? 'true'
              : 'false'
          }
          onChange={(e) => {
            const value = e.target.value;
            handleFilterChange(
              'isImpulsive',
              value === '' ? undefined : value === 'true'
            );
          }}
        >
          <option value="">All Trades</option>
          <option value="true">Impulsive Only</option>
          <option value="false">Non-Impulsive Only</option>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="space-y-2">
        <Label htmlFor="sortBy">Sort By</Label>
        <Select
          id="sortBy"
          value={filters.sortBy || 'tradeDate'}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
        >
          <option value="tradeDate">Trade Date</option>
          <option value="pnl">P&L</option>
          <option value="createdAt">Created Date</option>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Sort Order</Label>
        <Select
          id="sortOrder"
          value={filters.sortOrder || 'desc'}
          onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </Select>
      </div>
    </div>
  );
};
