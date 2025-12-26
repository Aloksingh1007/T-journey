import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger';
import {
  AppError,
} from '../utils/errors.util';

/**
 * Error Response Interface
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
}

/**
 * Logger utility for errors
 * Uses the centralized logger with file and console output
 */
function logError(error: Error, req: Request): void {
  const userId = req.user?.userId || 'anonymous';

  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    userId,
    query: req.query,
    body: req.body,
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });
}

/**
 * Convert Zod validation errors to our format
 */
function handleZodError(error: ZodError): ErrorResponse {
  const details = error.issues.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));

  return {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details,
    },
  };
}

/**
 * Convert Prisma errors to our format
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): ErrorResponse {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      return {
        success: false,
        error: {
          code: 'DUPLICATE_ENTRY',
          message: 'A record with this value already exists',
          details: {
            field: error.meta?.target,
          },
        },
      };

    case 'P2025':
      // Record not found
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found',
        },
      };

    case 'P2003':
      // Foreign key constraint violation
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Invalid reference to related record',
        },
      };

    default:
      return {
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Database operation failed',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
      };
  }
}

/**
 * Convert JWT errors to our format
 */
function handleJWTError(_error: Error): ErrorResponse {
  return {
    success: false,
    error: {
      code: 'AUTHENTICATION_ERROR',
      message: 'Invalid or expired token',
    },
  };
}

/**
 * Global Error Handler Middleware
 * This should be the last middleware in the chain
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  logError(error, req);

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const response = handleZodError(error);
    res.status(400).json(response);
    return;
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const response = handlePrismaError(error);
    const statusCode = response.error.code === 'NOT_FOUND' ? 404 : 
                       response.error.code === 'DUPLICATE_ENTRY' ? 409 : 500;
    res.status(statusCode).json(response);
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    const response = handleJWTError(error);
    res.status(401).json(response);
    return;
  }

  // Handle custom AppError instances
  if (error instanceof AppError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // Handle Multer file upload errors
  if (error.name === 'MulterError') {
    res.status(400).json({
      success: false,
      error: {
        code: 'FILE_UPLOAD_ERROR',
        message: error.message,
      },
    });
    return;
  }

  // Handle all other errors as Internal Server Error
  const response: ErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'development' 
        ? error.message 
        : 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    },
  };

  res.status(500).json(response);
}

/**
 * Async Handler Wrapper
 * Wraps async route handlers to catch errors and pass them to error middleware
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 Not Found Handler
 * Should be placed before the error handler middleware
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
}
