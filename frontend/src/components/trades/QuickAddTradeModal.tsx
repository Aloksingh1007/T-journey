import React, { useState } from 'react';
import { X, Zap } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tradeService } from '../../services/trade.service';
import type { CreateTradeDTO } from '@/types';

interface QuickAddTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickAddTradeModal: React.FC<QuickAddTradeModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    tradeDate: new Date().toISOString().split('T')[0],
    instrument: '',
    tradeType: 'STOCK' as const,
    tradeDirection: 'BUY_LONG' as const,
    avgBuyPrice: '',
    avgSellPrice: '',
    positionSize: '',
    baseCurrency: 'INR' as const,
    emotionalState: 'NEUTRAL' as const,
  });

  const createTradeMutation = useMutation({
    mutationFn: (data: CreateTradeDTO) => tradeService.createTrade(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trades'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      onClose();
      resetForm();
    },
  });

  const resetForm = () => {
    setFormData({
      tradeDate: new Date().toISOString().split('T')[0],
      instrument: '',
      tradeType: 'STOCK',
      tradeDirection: 'BUY_LONG',
      avgBuyPrice: '',
      avgSellPrice: '',
      positionSize: '',
      baseCurrency: 'INR',
      emotionalState: 'NEUTRAL',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate P&L
    const buyPrice = parseFloat(formData.avgBuyPrice);
    const sellPrice = parseFloat(formData.avgSellPrice);
    const size = parseFloat(formData.positionSize);

    let pnl = 0;
    if (formData.tradeDirection === 'BUY_LONG') {
      pnl = (sellPrice - buyPrice) * size;
    } else {
      pnl = (buyPrice - sellPrice) * size;
    }

    const tradeData: CreateTradeDTO = {
      tradeDate: formData.tradeDate,
      entryTime: '09:00',
      exitTime: '15:30',
      tradeType: formData.tradeType,
      instrument: formData.instrument,
      tradeDirection: formData.tradeDirection,
      avgBuyPrice: buyPrice,
      avgSellPrice: sellPrice,
      positionSize: size,
      baseCurrency: formData.baseCurrency,
      pnl: pnl,
      emotionalState: formData.emotionalState,
      isImpulsive: false,
    };

    createTradeMutation.mutate(tradeData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Quick Add Trade</h2>
              <p className="text-sm text-gray-600">Log your trade in seconds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date & Instrument */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Trade Date *
              </label>
              <input
                type="date"
                value={formData.tradeDate}
                onChange={(e) => setFormData({ ...formData, tradeDate: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Instrument *
              </label>
              <input
                type="text"
                value={formData.instrument}
                onChange={(e) => setFormData({ ...formData, instrument: e.target.value })}
                placeholder="e.g., AAPL, BTC/USDT"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Trade Type & Direction */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Trade Type *
              </label>
              <select
                value={formData.tradeType}
                onChange={(e) => setFormData({ ...formData, tradeType: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="STOCK">Stock</option>
                <option value="CRYPTO">Crypto</option>
                <option value="FUTURES">Futures</option>
                <option value="OPTIONS">Options</option>
                <option value="FUNDED_ACCOUNT">Funded Account</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Direction *
              </label>
              <select
                value={formData.tradeDirection}
                onChange={(e) => setFormData({ ...formData, tradeDirection: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="BUY_LONG">Buy/Long</option>
                <option value="SELL_SHORT">Sell/Short</option>
              </select>
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Buy Price *
              </label>
              <input
                type="number"
                step="0.00000001"
                value={formData.avgBuyPrice}
                onChange={(e) => setFormData({ ...formData, avgBuyPrice: e.target.value })}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Sell Price *
              </label>
              <input
                type="number"
                step="0.00000001"
                value={formData.avgSellPrice}
                onChange={(e) => setFormData({ ...formData, avgSellPrice: e.target.value })}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Position Size *
              </label>
              <input
                type="number"
                step="0.00000001"
                value={formData.positionSize}
                onChange={(e) => setFormData({ ...formData, positionSize: e.target.value })}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Currency & Emotion */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Currency *
              </label>
              <select
                value={formData.baseCurrency}
                onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Emotional State *
              </label>
              <select
                value={formData.emotionalState}
                onChange={(e) => setFormData({ ...formData, emotionalState: e.target.value as any })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CONFIDENT">Confident</option>
                <option value="NEUTRAL">Neutral</option>
                <option value="ANXIOUS">Anxious</option>
                <option value="FEARFUL">Fearful</option>
                <option value="GREEDY">Greedy</option>
                <option value="FOMO">FOMO</option>
                <option value="REVENGE">Revenge</option>
                <option value="EUPHORIC">Euphoric</option>
              </select>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Quick Mode:</strong> Only essential fields required. You can add more details later by editing the trade.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createTradeMutation.isPending}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg flex items-center gap-2"
            >
              <Zap className="w-5 h-5" />
              {createTradeMutation.isPending ? 'Adding...' : 'Quick Add Trade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickAddTradeModal;
