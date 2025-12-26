/**
 * Base error class for AI service errors
 */
export class AIServiceError extends Error {
  public code: string;
  public originalError?: Error;

  constructor(message: string, code: string = 'AI_SERVICE_ERROR', originalError?: Error) {
    super(message);
    this.name = 'AIServiceError';
    this.code = code;
    this.originalError = originalError;

    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AIServiceError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      stack: this.stack,
    };
  }
}

/**
 * Error thrown when rate limit is exceeded
 */
export class RateLimitError extends AIServiceError {
  public remaining: {
    perMinute: number;
    perHour: number;
  };

  constructor(
    message: string,
    remaining: { perMinute: number; perHour: number }
  ) {
    super(message, 'RATE_LIMIT_EXCEEDED');
    this.name = 'RateLimitError';
    this.remaining = remaining;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      remaining: this.remaining,
    };
  }
}

/**
 * Error thrown when AI service is not configured
 */
export class AIConfigurationError extends AIServiceError {
  constructor(message: string) {
    super(message, 'AI_NOT_CONFIGURED');
    this.name = 'AIConfigurationError';
  }
}

/**
 * Error thrown when AI request times out
 */
export class AITimeoutError extends AIServiceError {
  public timeoutMs: number;

  constructor(message: string, timeoutMs: number) {
    super(message, 'AI_REQUEST_TIMEOUT');
    this.name = 'AITimeoutError';
    this.timeoutMs = timeoutMs;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      timeoutMs: this.timeoutMs,
    };
  }
}

/**
 * Error thrown when AI response is invalid or cannot be parsed
 */
export class AIResponseError extends AIServiceError {
  public response?: any;

  constructor(message: string, response?: any) {
    super(message, 'AI_INVALID_RESPONSE');
    this.name = 'AIResponseError';
    this.response = response;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      response: this.response,
    };
  }
}

/**
 * Error thrown when OpenAI API returns an error
 */
export class OpenAIAPIError extends AIServiceError {
  public statusCode?: number;
  public apiError?: any;

  constructor(message: string, statusCode?: number, apiError?: any) {
    super(message, 'OPENAI_API_ERROR');
    this.name = 'OpenAIAPIError';
    this.statusCode = statusCode;
    this.apiError = apiError;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      statusCode: this.statusCode,
      apiError: this.apiError,
    };
  }
}

/**
 * Utility function to handle and format AI errors
 */
export function handleAIError(error: any): AIServiceError {
  // If it's already an AIServiceError, return it
  if (error instanceof AIServiceError) {
    return error;
  }

  // Handle OpenAI specific errors
  if (error?.status) {
    return new OpenAIAPIError(
      error.message || 'OpenAI API error',
      error.status,
      error
    );
  }

  // Handle timeout errors
  if (error?.message?.includes('timeout')) {
    return new AITimeoutError('AI request timed out', 30000);
  }

  // Generic AI service error
  return new AIServiceError(
    error?.message || 'Unknown AI service error',
    'UNKNOWN_ERROR',
    error
  );
}

/**
 * Check if an error is retryable
 */
export function isRetryableError(error: any): boolean {
  if (error instanceof RateLimitError) return false;
  if (error instanceof AIConfigurationError) return false;
  
  // Don't retry on 4xx errors (client errors)
  if (error?.status >= 400 && error?.status < 500) {
    return false;
  }

  // Retry on 5xx errors (server errors) and network errors
  return true;
}
