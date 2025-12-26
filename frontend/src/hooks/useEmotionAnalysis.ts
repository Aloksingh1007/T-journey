import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getEmotionTimeline,
  getEmotionPatterns,
  analyzeTradeEmotion,
} from '../services/emotion-analysis.service';
import type {
  EmotionTimeline,
  EmotionPatternsResponse,
} from '../types';

/**
 * Hook to fetch emotion timeline for a trade
 */
export const useEmotionTimeline = (tradeId: string | null) => {
  return useQuery<EmotionTimeline>({
    queryKey: ['emotionTimeline', tradeId],
    queryFn: () => getEmotionTimeline(tradeId!),
    enabled: !!tradeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch emotion patterns
 */
export const useEmotionPatterns = (params?: {
  startDate?: string;
  endDate?: string;
  minTrades?: number;
}) => {
  return useQuery<EmotionPatternsResponse>({
    queryKey: ['emotionPatterns', params],
    queryFn: () => getEmotionPatterns(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to analyze trade emotion (triggers AI analysis)
 */
export const useAnalyzeTradeEmotion = () => {
  return useMutation({
    mutationFn: (tradeId: string) => analyzeTradeEmotion(tradeId),
  });
};
