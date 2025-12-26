import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as screenshotController from '../controllers/screenshot.controller';

const router = Router();

/**
 * All screenshot routes require authentication
 */

// Delete a screenshot
router.delete(
  '/:id',
  authMiddleware,
  screenshotController.deleteScreenshotHandler
);

export default router;
