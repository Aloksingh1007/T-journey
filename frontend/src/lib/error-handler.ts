import { toast } from 'sonner';
import { AxiosError } from 'axios';

/**
 * API Error Response Interface
 */
export interface APIError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Error Code to User-Friendly Message Mapping
 */
const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: 'Please check your input and try again',
  AUTHENTICATION_ERROR: 'Authentication failed. Please log in again',
  AUTHORIZATION_ERROR: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  DUPLICATE_ENTRY: 'This record already exists',
  DATABASE_ERROR: 'A database error occurred. Please try again',
  FILE_UPLOAD_ERROR: 'File upload failed. Please check the file and try again',
  AI_SERVICE_ERROR: 'AI service is temporarily unavailable',
  INTERNAL_SERVER_ERROR: 'An unexpected error occurred. Please try again',
};

/**
 * Extract error message from API error response
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as APIError | undefined;
    
    if (apiError?.error) {
      // Return the specific error message from the API
      return apiError.error.message;
    }
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection';
    }
    
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again';
    }
    
    // Handle other axios errors
    return error.message || 'An error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Get user-friendly error message based on error code
 */
export function getUserFriendlyMessage(errorCode: string): string {
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
}

/**
 * Handle API errors with toast notifications
 */
export function handleAPIError(error: unknown, customMessage?: string): void {
  const message = customMessage || getErrorMessage(error);
  toast.error(message);
  
  // Log error in development
  if (import.meta.env.DEV) {
    console.error('API Error:', error);
  }
}

/**
 * Handle validation errors and return field-specific errors
 */
export function getValidationErrors(error: unknown): Record<string, string> {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as APIError | undefined;
    
    if (apiError?.error?.code === 'VALIDATION_ERROR' && apiError.error.details) {
      const errors: Record<string, string> = {};
      
      if (Array.isArray(apiError.error.details)) {
        apiError.error.details.forEach((detail: any) => {
          if (detail.field && detail.message) {
            errors[detail.field] = detail.message;
          }
        });
      }
      
      return errors;
    }
  }
  
  return {};
}

/**
 * Show success toast notification
 */
export function showSuccess(message: string): void {
  toast.success(message);
}

/**
 * Show info toast notification
 */
export function showInfo(message: string): void {
  toast.info(message);
}

/**
 * Show warning toast notification
 */
export function showWarning(message: string): void {
  toast.warning(message);
}

/**
 * Check if error is authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as APIError | undefined;
    return apiError?.error?.code === 'AUTHENTICATION_ERROR' || error.response?.status === 401;
  }
  return false;
}

/**
 * Check if error is authorization error
 */
export function isAuthorizationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as APIError | undefined;
    return apiError?.error?.code === 'AUTHORIZATION_ERROR' || error.response?.status === 403;
  }
  return false;
}
