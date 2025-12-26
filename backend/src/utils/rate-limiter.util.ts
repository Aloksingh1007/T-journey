interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private minuteLimit: number;
  private hourLimit: number;
  private minuteWindow: Map<string, RateLimitEntry> = new Map();
  private hourWindow: Map<string, RateLimitEntry> = new Map();

  constructor(perMinute: number, perHour: number) {
    this.minuteLimit = perMinute;
    this.hourLimit = perHour;
  }

  /**
   * Check if a request is allowed for the given key (e.g., userId)
   * @param key - Identifier for rate limiting (e.g., userId)
   * @returns true if request is allowed, false otherwise
   */
  public isAllowed(key: string): boolean {
    const now = Date.now();
    
    // Check minute limit
    const minuteEntry = this.minuteWindow.get(key);
    if (minuteEntry) {
      if (now < minuteEntry.resetTime) {
        if (minuteEntry.count >= this.minuteLimit) {
          return false;
        }
      } else {
        // Reset window
        this.minuteWindow.delete(key);
      }
    }

    // Check hour limit
    const hourEntry = this.hourWindow.get(key);
    if (hourEntry) {
      if (now < hourEntry.resetTime) {
        if (hourEntry.count >= this.hourLimit) {
          return false;
        }
      } else {
        // Reset window
        this.hourWindow.delete(key);
      }
    }

    return true;
  }

  /**
   * Record a request for the given key
   * @param key - Identifier for rate limiting
   */
  public recordRequest(key: string): void {
    const now = Date.now();

    // Record for minute window
    const minuteEntry = this.minuteWindow.get(key);
    if (minuteEntry && now < minuteEntry.resetTime) {
      minuteEntry.count++;
    } else {
      this.minuteWindow.set(key, {
        count: 1,
        resetTime: now + 60 * 1000, // 1 minute
      });
    }

    // Record for hour window
    const hourEntry = this.hourWindow.get(key);
    if (hourEntry && now < hourEntry.resetTime) {
      hourEntry.count++;
    } else {
      this.hourWindow.set(key, {
        count: 1,
        resetTime: now + 60 * 60 * 1000, // 1 hour
      });
    }
  }

  /**
   * Get remaining requests for the given key
   * @param key - Identifier for rate limiting
   * @returns Object with remaining requests per minute and per hour
   */
  public getRemaining(key: string): { perMinute: number; perHour: number } {
    const now = Date.now();

    let remainingMinute = this.minuteLimit;
    const minuteEntry = this.minuteWindow.get(key);
    if (minuteEntry && now < minuteEntry.resetTime) {
      remainingMinute = Math.max(0, this.minuteLimit - minuteEntry.count);
    }

    let remainingHour = this.hourLimit;
    const hourEntry = this.hourWindow.get(key);
    if (hourEntry && now < hourEntry.resetTime) {
      remainingHour = Math.max(0, this.hourLimit - hourEntry.count);
    }

    return {
      perMinute: remainingMinute,
      perHour: remainingHour,
    };
  }

  /**
   * Reset rate limits for a specific key
   * @param key - Identifier to reset
   */
  public reset(key: string): void {
    this.minuteWindow.delete(key);
    this.hourWindow.delete(key);
  }

  /**
   * Clean up expired entries (should be called periodically)
   */
  public cleanup(): void {
    const now = Date.now();

    // Clean minute window
    for (const [key, entry] of this.minuteWindow.entries()) {
      if (now >= entry.resetTime) {
        this.minuteWindow.delete(key);
      }
    }

    // Clean hour window
    for (const [key, entry] of this.hourWindow.entries()) {
      if (now >= entry.resetTime) {
        this.hourWindow.delete(key);
      }
    }
  }
}

// Usage tracking for monitoring
export interface UsageStats {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  totalTokensUsed: number;
  lastRequestTime: number;
}

export class UsageTracker {
  private stats: Map<string, UsageStats> = new Map();

  /**
   * Record a successful AI request
   * @param userId - User identifier
   * @param tokensUsed - Number of tokens consumed
   */
  public recordSuccess(userId: string, tokensUsed: number = 0): void {
    const stats = this.getOrCreateStats(userId);
    stats.totalRequests++;
    stats.successfulRequests++;
    stats.totalTokensUsed += tokensUsed;
    stats.lastRequestTime = Date.now();
  }

  /**
   * Record a failed AI request
   * @param userId - User identifier
   */
  public recordFailure(userId: string): void {
    const stats = this.getOrCreateStats(userId);
    stats.totalRequests++;
    stats.failedRequests++;
    stats.lastRequestTime = Date.now();
  }

  /**
   * Get usage statistics for a user
   * @param userId - User identifier
   * @returns Usage statistics
   */
  public getStats(userId: string): UsageStats {
    return { ...this.getOrCreateStats(userId) };
  }

  /**
   * Get all usage statistics
   * @returns Map of all user statistics
   */
  public getAllStats(): Map<string, UsageStats> {
    return new Map(this.stats);
  }

  /**
   * Reset statistics for a user
   * @param userId - User identifier
   */
  public resetStats(userId: string): void {
    this.stats.delete(userId);
  }

  private getOrCreateStats(userId: string): UsageStats {
    let stats = this.stats.get(userId);
    if (!stats) {
      stats = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        totalTokensUsed: 0,
        lastRequestTime: 0,
      };
      this.stats.set(userId, stats);
    }
    return stats;
  }
}
