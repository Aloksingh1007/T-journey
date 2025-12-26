import Groq from 'groq-sdk';
import { aiConfig } from '../../config/ai.config';
import { RateLimiter, UsageTracker } from '../../utils/rate-limiter.util';
import { AIServiceError, RateLimitError } from '../../utils/ai-errors.util';

export interface AIRequest {
  userId: string;
  operation: string;
  data: any;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  tokensUsed?: number;
  requestId?: string;
}

export interface QueuedRequest {
  id: string;
  request: AIRequest;
  timestamp: number;
  retryCount: number;
  lastError?: string;
}

/**
 * Base AI Service class providing common functionality for all AI operations
 */
export class BaseAIService {
  protected groq: Groq | null = null;
  protected rateLimiter: RateLimiter;
  protected usageTracker: UsageTracker;
  protected requestQueue: Map<string, QueuedRequest> = new Map();
  protected isInitialized: boolean = false;

  constructor() {
    const config = aiConfig.getConfig();
    this.rateLimiter = new RateLimiter(
      config.rateLimit.perMinute,
      config.rateLimit.perHour
    );
    this.usageTracker = new UsageTracker();

    // Initialize Groq client if API key is configured
    if (aiConfig.isConfigured()) {
      this.groq = new Groq({
        apiKey: config.groq.apiKey,
      });
      this.isInitialized = true;
    } else {
      console.warn('Groq API key not configured. AI features will be disabled.');
    }

    // Start cleanup interval for rate limiter
    setInterval(() => {
      this.rateLimiter.cleanup();
    }, 60000); // Clean up every minute
  }

  /**
   * Check if AI service is properly configured and initialized
   */
  protected ensureInitialized(): void {
    if (!this.isInitialized || !this.groq) {
      throw new AIServiceError(
        'AI service is not configured. Please set GROQ_API_KEY in environment variables.',
        'NOT_CONFIGURED'
      );
    }
  }

  /**
   * Check rate limits before making a request
   */
  protected checkRateLimit(userId: string): void {
    if (!this.rateLimiter.isAllowed(userId)) {
      const remaining = this.rateLimiter.getRemaining(userId);
      throw new RateLimitError(
        'Rate limit exceeded. Please try again later.',
        remaining
      );
    }
  }

  /**
   * Record a request in rate limiter and usage tracker
   */
  protected recordRequest(userId: string, tokensUsed: number = 0): void {
    this.rateLimiter.recordRequest(userId);
    this.usageTracker.recordSuccess(userId, tokensUsed);
  }

  /**
   * Record a failed request
   */
  protected recordFailure(userId: string): void {
    this.usageTracker.recordFailure(userId);
  }

  /**
   * Execute an AI request with retry logic and exponential backoff
   */
  protected async executeWithRetry<T>(
    operation: () => Promise<T>,
    userId: string,
    operationName: string
  ): Promise<T> {
    const config = aiConfig.getRequestConfig();
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
      try {
        // Add timeout to the operation
        const result = await this.withTimeout(operation(), config.timeoutMs);
        
        // Log successful request
        this.logRequest(userId, operationName, 'success', attempt);
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          this.logRequest(userId, operationName, 'failed_non_retryable', attempt);
          throw error;
        }

        // If this was the last attempt, throw the error
        if (attempt === config.maxRetries) {
          this.logRequest(userId, operationName, 'failed_max_retries', attempt);
          break;
        }

        // Calculate exponential backoff delay
        const delay = config.retryDelayMs * Math.pow(2, attempt);
        this.logRequest(userId, operationName, 'retrying', attempt, delay);
        
        // Wait before retrying
        await this.sleep(delay);
      }
    }

    // All retries failed, throw the last error
    throw new AIServiceError(
      `AI operation failed after ${config.maxRetries} retries: ${lastError?.message}`,
      'MAX_RETRIES_EXCEEDED',
      lastError || undefined
    );
  }

  /**
   * Wrap a promise with a timeout
   */
  protected async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      ),
    ]);
  }

  /**
   * Check if an error should not be retried
   */
  protected isNonRetryableError(error: any): boolean {
    // Don't retry on authentication errors, invalid requests, etc.
    if (error instanceof RateLimitError) return true;
    if (error?.status === 401) return true; // Unauthorized
    if (error?.status === 400) return true; // Bad request
    if (error?.status === 403) return true; // Forbidden
    
    return false;
  }

  /**
   * Sleep for a specified duration
   */
  protected sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Log AI request for monitoring and debugging
   */
  protected logRequest(
    userId: string,
    operation: string,
    status: 'success' | 'failed_non_retryable' | 'failed_max_retries' | 'retrying',
    attempt: number,
    retryDelay?: number
  ): void {
    const logData = {
      timestamp: new Date().toISOString(),
      userId,
      operation,
      status,
      attempt,
      retryDelay,
    };

    if (status === 'success') {
      console.log('[AI Service] Request successful:', logData);
    } else if (status === 'retrying') {
      console.warn('[AI Service] Request failed, retrying:', logData);
    } else {
      console.error('[AI Service] Request failed:', logData);
    }
  }

  /**
   * Add a failed request to the queue for later processing
   */
  protected queueFailedRequest(request: AIRequest, error: string): string {
    const requestId = this.generateRequestId();
    const queuedRequest: QueuedRequest = {
      id: requestId,
      request,
      timestamp: Date.now(),
      retryCount: 0,
      lastError: error,
    };

    this.requestQueue.set(requestId, queuedRequest);
    console.log(`[AI Service] Request queued for later processing: ${requestId}`);
    
    return requestId;
  }

  /**
   * Process queued requests (can be called periodically or manually)
   */
  public async processQueuedRequests(): Promise<void> {
    console.log(`[AI Service] Processing ${this.requestQueue.size} queued requests`);

    for (const [requestId, queuedRequest] of this.requestQueue.entries()) {
      try {
        // Check if request is too old (e.g., older than 24 hours)
        const age = Date.now() - queuedRequest.timestamp;
        if (age > 24 * 60 * 60 * 1000) {
          console.log(`[AI Service] Removing expired queued request: ${requestId}`);
          this.requestQueue.delete(requestId);
          continue;
        }

        // Attempt to process the request
        // This should be implemented by subclasses based on operation type
        console.log(`[AI Service] Processing queued request: ${requestId}`);
        
        // Remove from queue on success
        this.requestQueue.delete(requestId);
      } catch (error) {
        queuedRequest.retryCount++;
        queuedRequest.lastError = (error as Error).message;
        
        // Remove if too many retries
        if (queuedRequest.retryCount > 5) {
          console.error(`[AI Service] Removing failed request after max retries: ${requestId}`);
          this.requestQueue.delete(requestId);
        }
      }
    }
  }

  /**
   * Get queued requests for a specific user
   */
  public getQueuedRequests(userId: string): QueuedRequest[] {
    return Array.from(this.requestQueue.values()).filter(
      req => req.request.userId === userId
    );
  }

  /**
   * Get usage statistics for a user
   */
  public getUsageStats(userId: string) {
    return this.usageTracker.getStats(userId);
  }

  /**
   * Get rate limit information for a user
   */
  public getRateLimitInfo(userId: string) {
    return this.rateLimiter.getRemaining(userId);
  }

  /**
   * Generate a unique request ID
   */
  protected generateRequestId(): string {
    return `ai_req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if the service is available
   */
  public isAvailable(): boolean {
    return this.isInitialized && this.groq !== null;
  }
}
