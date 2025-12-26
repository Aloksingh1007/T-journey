import api from './api';
import type {
  EmotionTimeline,
  EmotionPatternsResponse,
} from '../types';

/**
 * Analyze emotion for a specific trade
 */
export const analyzeTradeEmotion = async (tradeId: string): Promise<EmotionTimeline> => {
  const response = await api.post('/ai/analyze-emotion', { tradeId });
  return response.data.data;
};

/**
 * Get emotion patterns for user's trades
 */
export const getEmotionPatterns = async (params?: {
  startDate?: string;
  endDate?: string;
  minTrades?: number;
}): Promise<EmotionPatternsResponse> => {
  const response = await api.get('/ai/emotion-patterns', { params });
  return response.data.data;
};

/**
 * Get emotion timeline for a specific trade
 */
export const getEmotionTimeline = async (tradeId: string): Promise<EmotionTimeline> => {
  const response = await api.get(`/ai/emotion-timeline/${tradeId}`);
  return response.data.data;
};

/**
 * Analyze sentiment of text
 */
export const analyzeSentiment = async (text: string): Promise<any> => {
  const response = await api.post('/ai/analyze-sentiment', { text });
  return response.data.data;
};
