import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as noteController from '../controllers/note.controller';

const router = Router();

/**
 * All note routes require authentication
 */

// Delete a note
router.delete('/:id', authMiddleware, noteController.deleteNoteHandler);

export default router;
