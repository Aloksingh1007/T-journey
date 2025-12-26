import { Request, Response } from 'express';
import { createNote, deleteNote } from '../services/note.service';

/**
 * POST /api/trades/:id/notes
 * Create a new note for a trade
 */
export async function createNoteHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const tradeId = req.params.id;
    const noteData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
    }

    const note = await createNote(userId, tradeId, noteData);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'TRADE_NOT_FOUND',
          message: 'Trade not found or access denied',
        },
      });
    }

    return res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('Error creating note:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create note',
      },
    });
  }
}

/**
 * DELETE /api/notes/:id
 * Delete a note
 */
export async function deleteNoteHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const noteId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
    }

    const note = await deleteNote(userId, noteId);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOTE_NOT_FOUND',
          message: 'Note not found or access denied',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete note',
      },
    });
  }
}
