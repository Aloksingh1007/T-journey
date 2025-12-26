import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  getShareableStats,
  updatePrivacySettings,
  uploadAvatar,
  recalculateStats,
} from '../controllers/profile.controller';
import { optionalAuthMiddleware, authMiddleware } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { updateProfileSchema, updatePrivacySettingsSchema } from '../validators/profile.validator';
import { uploadImage, handleUploadError } from '../middleware/upload.middleware';

const router = Router();

// GET /api/profile/stats/:userId - Get shareable stats (must be before /:userId route)
router.get('/stats/:userId', getShareableStats);

// GET /api/profile/:userId - Get user profile
// Note: This route is public but respects privacy settings
// Authentication is optional - if authenticated, user can see their own full profile
router.get('/:userId', optionalAuthMiddleware, getProfile);

// PUT /api/profile - Update own profile (protected)
router.put('/', authMiddleware, validateRequest(updateProfileSchema), updateProfile);

// PUT /api/profile/privacy - Update privacy settings (protected)
router.put('/privacy', authMiddleware, validateRequest(updatePrivacySettingsSchema), updatePrivacySettings);

// POST /api/profile/avatar - Upload profile avatar (protected)
router.post('/avatar', authMiddleware, uploadImage.single('avatar'), handleUploadError, uploadAvatar);

// POST /api/profile/recalculate-stats - Recalculate profile statistics (protected)
router.post('/recalculate-stats', authMiddleware, recalculateStats);

export default router;
