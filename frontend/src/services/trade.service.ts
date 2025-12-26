import { api } from './api';
import type { CreateTradeDTO, Trade, GetTradesQuery, GetTradesResponse } from '@/types';
import { compressImage } from '@/utils/imageOptimization';

export const tradeService = {
  createTrade: async (data: CreateTradeDTO, screenshots?: File[]): Promise<Trade> => {
    const response = await api.post('/trades', data);
    const trade = response.data.data;

    // Upload screenshots if provided
    if (screenshots && screenshots.length > 0) {
      // Compress images before upload
      const compressedScreenshots = await Promise.all(
        screenshots.map((file) => compressImage(file, 1920, 1080, 0.85))
      );
      
      await Promise.all(
        compressedScreenshots.map((file) => tradeService.uploadScreenshot(trade.id, file))
      );
    }

    // Fetch the updated trade with screenshots
    return tradeService.getTradeById(trade.id);
  },

  getTrades: async (query?: GetTradesQuery): Promise<GetTradesResponse> => {
    const params = new URLSearchParams();
    
    if (query) {
      if (query.startDate) params.append('startDate', query.startDate);
      if (query.endDate) params.append('endDate', query.endDate);
      if (query.tradeType) params.append('tradeType', query.tradeType);
      if (query.baseCurrency) params.append('baseCurrency', query.baseCurrency);
      if (query.emotionalState) params.append('emotionalState', query.emotionalState);
      if (query.isImpulsive !== undefined) params.append('isImpulsive', String(query.isImpulsive));
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);
      if (query.limit) params.append('limit', String(query.limit));
      if (query.offset) params.append('offset', String(query.offset));
    }

    const response = await api.get(`/trades?${params.toString()}`);
    return {
      trades: response.data.data,
      pagination: response.data.pagination,
    };
  },

  getTradeById: async (id: string): Promise<Trade> => {
    const response = await api.get(`/trades/${id}`);
    return response.data.data;
  },

  updateTrade: async (id: string, data: Partial<CreateTradeDTO>): Promise<Trade> => {
    const response = await api.put(`/trades/${id}`, data);
    return response.data.data;
  },

  deleteTrade: async (id: string): Promise<void> => {
    await api.delete(`/trades/${id}`);
  },

  // Note operations
  addNote: async (tradeId: string, content: string): Promise<any> => {
    const response = await api.post(`/trades/${tradeId}/notes`, { content });
    return response.data;
  },

  deleteNote: async (noteId: string): Promise<void> => {
    await api.delete(`/notes/${noteId}`);
  },

  // Screenshot operations
  uploadScreenshot: async (tradeId: string, file: File): Promise<any> => {
    // Compress image before upload
    const compressedFile = await compressImage(file, 1920, 1080, 0.85);
    
    const formData = new FormData();
    formData.append('screenshot', compressedFile);

    const response = await api.post(`/trades/${tradeId}/screenshots`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteScreenshot: async (screenshotId: string): Promise<void> => {
    await api.delete(`/screenshots/${screenshotId}`);
  },
};
