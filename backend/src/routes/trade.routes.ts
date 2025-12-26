import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import * as tradeController from '../controllers/trade.controller';
import * as noteController from '../controllers/note.controller';
import * as screenshotController from '../controllers/screenshot.controller';
import { createNoteSchema } from '../validators/note.validator';
import {
  uploadImage,
  handleUploadError,
} from '../middleware/upload.middleware';

const router = Router();

/**
 * All trade routes require authentication
 */

// Create a new trade
router.post('/', authMiddleware, tradeController.createTradeHandler);

// Get all trades with filters
router.get('/', authMiddleware, tradeController.getTradesHandler);

// Get a single trade by ID
router.get('/:id', authMiddleware, tradeController.getTradeByIdHandler);

// Update a trade
router.put('/:id', authMiddleware, tradeController.updateTradeHandler);

// Delete a trade
router.delete('/:id', authMiddleware, tradeController.deleteTradeHandler);

// Note routes
router.post(
  '/:id/notes',
  authMiddleware,
  validateRequest(createNoteSchema),
  noteController.createNoteHandler
);

// Screenshot routes
router.post(
  '/:id/screenshots',
  authMiddleware,
  uploadImage.single('screenshot'),
  handleUploadError,
  screenshotController.createScreenshotHandler
);

export default router;
