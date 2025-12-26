import dotenv from 'dotenv';

dotenv.config();

export interface AIConfig {
  groq: {
    apiKey: string;
    model: string;
    maxTokens: number;
    temperature: number;
  };
  rateLimit: {
    perMinute: number;
    perHour: number;
  };
  request: {
    timeoutMs: number;
    maxRetries: number;
    retryDelayMs: number;
  };
}

class AIConfigService {
  private config: AIConfig;

  constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  private loadConfig(): AIConfig {
    return {
      groq: {
        apiKey: process.env.GROQ_API_KEY || '',
        model: process.env.AI_MODEL || 'groq/compound',
        maxTokens: parseInt(process.env.AI_MAX_TOKENS || '8192', 10),
        temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
      },
      rateLimit: {
        perMinute: parseInt(process.env.AI_RATE_LIMIT_PER_MINUTE || '10', 10),
        perHour: parseInt(process.env.AI_RATE_LIMIT_PER_HOUR || '100', 10),
      },
      request: {
        timeoutMs: parseInt(process.env.AI_REQUEST_TIMEOUT_MS || '30000', 10),
        maxRetries: parseInt(process.env.AI_MAX_RETRIES || '3', 10),
        retryDelayMs: parseInt(process.env.AI_RETRY_DELAY_MS || '1000', 10),
      },
    };
  }

  private validateConfig(): void {
    if (!this.config.groq.apiKey) {
      console.warn('WARNING: GROQ_API_KEY is not set. AI features will not work.');
    }

    if (this.config.groq.maxTokens < 100 || this.config.groq.maxTokens > 32000) {
      throw new Error('AI_MAX_TOKENS must be between 100 and 32000');
    }

    if (this.config.groq.temperature < 0 || this.config.groq.temperature > 2) {
      throw new Error('AI_TEMPERATURE must be between 0 and 2');
    }

    if (this.config.request.maxRetries < 0 || this.config.request.maxRetries > 10) {
      throw new Error('AI_MAX_RETRIES must be between 0 and 10');
    }
  }

  public getConfig(): AIConfig {
    return { ...this.config };
  }

  public isConfigured(): boolean {
    return !!this.config.groq.apiKey;
  }

  public getGroqConfig() {
    return { ...this.config.groq };
  }

  public getRateLimitConfig() {
    return { ...this.config.rateLimit };
  }

  public getRequestConfig() {
    return { ...this.config.request };
  }
}

// Singleton instance
export const aiConfig = new AIConfigService();
