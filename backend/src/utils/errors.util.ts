/**
 * Custom Error Classes for the Trading Journal System
 * These provide consistent error handling across the application
 */

/**
 * Base Application Error
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    code: string,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error (400)
 * Used when request data fails validation
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, 400, 'VALIDATION_ERROR', true, details);
  }
}

/**
 * Authentication Error (401)
 * Used when authentication is required or fails
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR', true);
  }
}

/**
 * Authorization Error (403)
 * Used when user doesn't have permission to access resource
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR', true);
  }
}

/**
 * Not Found Error (404)
 * Used when requested resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND', true);
  }
}

/**
 * Duplicate Entry Error (409)
 * Used when trying to create a resource that already exists
 */
export class DuplicateEntryError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, 409, 'DUPLICATE_ENTRY', true);
  }
}

/**
 * Database Error (500)
 * Used when database operations fail
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', details?: any) {
    super(message, 500, 'DATABASE_ERROR', true, details);
  }
}

/**
 * File Upload Error (400)
 * Used when file upload fails validation or processing
 */
export class FileUploadError extends AppError {
  constructor(message: string = 'File upload failed', details?: any) {
    super(message, 400, 'FILE_UPLOAD_ERROR', true, details);
  }
}

/**
 * AI Service Error (503)
 * Used when AI service calls fail (Phase 2)
 */
export class AIServiceError extends AppError {
  constructor(message: string = 'AI service unavailable', details?: any) {
    super(message, 503, 'AI_SERVICE_ERROR', true, details);
  }
}

/**
 * Internal Server Error (500)
 * Used for unexpected errors
 */
export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected error occurred') {
    super(message, 500, 'INTERNAL_SERVER_ERROR', false);
  }
}
