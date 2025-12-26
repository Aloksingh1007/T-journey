import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', validateRequest(registerSchema), register);

// POST /api/auth/login - Login user
router.post('/login', validateRequest(loginSchema), login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authMiddleware, getCurrentUser);

export default router;
