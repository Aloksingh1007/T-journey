import { Router } from 'express';
import {
  analyzeTradeEmotion,
  getEmotionPatterns,
  getEmotionTimeline,
  analyzeSentiment,
} from '../controllers/emotion-analysis.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/ai/analyze-emotion - Analyze emotion for a specific trade
router.post('/analyze-emotion', analyzeTradeEmotion);

// GET /api/ai/emotion-patterns - Get historical emotion patterns
router.get('/emotion-patterns', getEmotionPatterns);

// GET /api/ai/emotion-timeline/:tradeId - Get emotion timeline for a trade
router.get('/emotion-timeline/:tradeId', getEmotionTimeline);

// POST /api/ai/analyze-sentiment - Analyze sentiment of text
router.post('/analyze-sentiment', analyzeSentiment);

export default router;
