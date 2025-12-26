import { Router } from 'express';
import * as passwordResetController from '../controllers/password-reset.controller';

const router = Router();

// Request password reset (send email)
router.post('/request', passwordResetController.requestPasswordReset);

// Reset password with token
router.post('/reset', passwordResetController.resetPassword);

export default router;
