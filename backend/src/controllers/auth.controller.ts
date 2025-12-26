import { Request, Response } from 'express';
import { registerUser, loginUser, getUserById } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../validators/auth.validator';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthenticationError, NotFoundError } from '../utils/errors.util';

/**
 * Register a new user
 * POST /api/auth/register
 */
export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data: RegisterInput = req.body;
  const result = await registerUser(data);

  res.status(201).json({
    success: true,
    data: result,
  });
});

/**
 * Login a user
 * POST /api/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const data: LoginInput = req.body;
  const result = await loginUser(data);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * Get current authenticated user
 * GET /api/auth/me
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AuthenticationError('Authentication required');
  }

  const user = await getUserById(req.user.userId);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
  });
});
