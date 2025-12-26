import { Request, Response } from 'express';
import {
  createScreenshot,
  deleteScreenshot,
} from '../services/screenshot.service';

/**
 * POST /api/trades/:id/screenshots
 * Upload a screenshot for a trade
 */
export async function createScreenshotHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const tradeId = req.params.id;
    const file = req.file;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
    }

    if (!file) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_REQUIRED',
          message: 'No file uploaded',
        },
      });
    }

    const screenshot = await createScreenshot(userId, tradeId, file);

    if (!screenshot) {
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
      data: screenshot,
    });
  } catch (error) {
    console.error('Error creating screenshot:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to upload screenshot',
      },
    });
  }
}

/**
 * DELETE /api/screenshots/:id
 * Delete a screenshot
 */
export async function deleteScreenshotHandler(req: Request, res: Response) {
  try {
    const userId = req.user?.userId;
    const screenshotId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User not authenticated',
        },
      });
    }

    const screenshot = await deleteScreenshot(userId, screenshotId);

    if (!screenshot) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SCREENSHOT_NOT_FOUND',
          message: 'Screenshot not found or access denied',
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: screenshot,
    });
  } catch (error) {
    console.error('Error deleting screenshot:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete screenshot',
      },
    });
  }
}
