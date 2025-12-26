import { Request, Response } from 'express';
import { ProfileService } from '../services/profile.service';
import { asyncHandler } from '../middleware/error.middleware';

/**
 * Get user profile by ID
 * GET /api/profile/:userId
 */
export const getProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;
    const viewerId = req.user?.userId; // Optional - may be undefined if not authenticated

    const profile = await ProfileService.getUserProfile(userId, viewerId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  }
);


/**
 * Update own profile
 * PUT /api/profile
 */
export const updateProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const userId = req.user.userId;
    const updateData = req.body;

    const profile = await ProfileService.updateProfile(userId, updateData);

    res.status(200).json({
      success: true,
      data: profile,
    });
  }
);


/**
 * Get shareable profile statistics
 * GET /api/profile/stats/:userId
 */
export const getShareableStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    const stats = await ProfileService.getShareableStats(userId);

    res.status(200).json({
      success: true,
      data: stats,
    });
  }
);

/**
 * Update privacy settings
 * PUT /api/profile/privacy
 */
export const updatePrivacySettings = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const userId = req.user.userId;
    const privacyData = req.body;

    const privacySettings = await ProfileService.updatePrivacySettings(userId, privacyData);

    res.status(200).json({
      success: true,
      data: privacySettings,
    });
  }
);

/**
 * Upload profile avatar
 * POST /api/profile/avatar
 */
export const uploadAvatar = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const userId = req.user.userId;
    const file = req.file;

    if (!file) {
      throw new Error('No file uploaded');
    }

    const profile = await ProfileService.uploadAvatar(userId, file);

    res.status(200).json({
      success: true,
      data: profile,
    });
  }
);

/**
 * Recalculate user profile statistics
 * POST /api/profile/recalculate-stats
 */
export const recalculateStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new Error('Authentication required');
    }

    const userId = req.user.userId;

    // Import ProfileStatsService
    const { ProfileStatsService } = await import('../services/profile-stats.service');
    
    await ProfileStatsService.updateUserStats(userId);

    res.status(200).json({
      success: true,
      message: 'Profile statistics recalculated successfully',
    });
  }
);
