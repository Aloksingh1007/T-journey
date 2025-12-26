import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt.util';
import { AuthenticationError } from '../utils/errors.util';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from Authorization header
 */
export function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    console.log(`[AUTH] ${req.method} ${req.path} - Checking authentication...`);
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[AUTH] No valid authorization header found');
      throw new AuthenticationError('Authentication required');
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = verifyToken(token);
    console.log(`[AUTH] Token verified for user: ${payload.userId}`);

    // Attach user to request
    req.user = payload;

    next();
  } catch (error) {
    console.log('[AUTH] Authentication failed:', error);
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Verifies JWT token if provided, but doesn't throw error if missing
 * Useful for routes that have different behavior for authenticated vs unauthenticated users
 */
export function optionalAuthMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    console.log(`[OPTIONAL-AUTH] ${req.method} ${req.path} - Checking for optional authentication...`);
    
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[OPTIONAL-AUTH] No authorization header found, continuing without auth');
      next();
      return;
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify token
      const payload = verifyToken(token);
      console.log(`[OPTIONAL-AUTH] Token verified for user: ${payload.userId}`);

      // Attach user to request
      req.user = payload;
    } catch (error) {
      console.log('[OPTIONAL-AUTH] Invalid token, continuing without auth');
      // Don't throw error, just continue without user
    }

    next();
  } catch (error) {
    console.log('[OPTIONAL-AUTH] Unexpected error:', error);
    next(error);
  }
}
