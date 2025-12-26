import { Router } from 'express';
import {
  getOverallScore,
  getScoreBreakdown,
  getTraderLevel,
  recalculateScore,
} from '../controllers/trader-score.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/scores/overall - Get overall trader score
router.get('/overall', getOverallScore);

// GET /api/scores/breakdown - Get detailed score breakdown
router.get('/breakdown', getScoreBreakdown);

// GET /api/scores/level - Get trader level
router.get('/level', getTraderLevel);

// POST /api/scores/recalculate - Recalculate score
router.post('/recalculate', recalculateScore);

export default router;
