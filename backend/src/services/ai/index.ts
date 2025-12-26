/**
 * AI Services Module
 * 
 * This module provides AI-powered features for the trading journal including:
 * - Emotion analysis
 * - Trade insights generation
 * - Chat assistant
 * - Voice transcription
 * - Risk assessment
 */

export { BaseAIService } from './base-ai.service';
export type { AIRequest, AIResponse, QueuedRequest } from './base-ai.service';

export { 
  dataPreparationService,
  DataPreparationService 
} from './data-preparation.service';
export type {
  TradeWithRelations,
  SerializedTrade,
  PsychologicalProfile,
  PatternData,
} from './data-preparation.service';

export {
  promptTemplatesService,
  PromptTemplatesService,
} from './prompt-templates.service';
export type { TemplateVariables } from './prompt-templates.service';

export {
  emotionAnalysisService,
  EmotionAnalysisService,
} from './emotion-analysis.service';
export type {
  EmotionTimeline,
  SentimentAnalysis,
  EmotionPerformanceCorrelation,
  EmotionalPattern,
  StressPerformanceAnalysis,
} from './emotion-analysis.service';
