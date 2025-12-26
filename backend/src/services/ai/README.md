# AI Services Infrastructure

This directory contains the foundational infrastructure for AI-powered features in the Trading Journal application.

## Overview

The AI services infrastructure provides:
- **Configuration Management**: Centralized AI configuration with environment variables
- **Rate Limiting**: Per-user rate limiting to prevent abuse and manage costs
- **Usage Tracking**: Monitor AI service usage and token consumption
- **Retry Logic**: Automatic retry with exponential backoff for failed requests
- **Error Handling**: Comprehensive error handling with custom error types
- **Request Queuing**: Queue failed requests for later processing
- **Data Preparation**: Utilities to serialize and format trade data for AI consumption
- **Prompt Templates**: Reusable prompt templates for different AI operations

## Components

### 1. Configuration (`ai.config.ts`)

Manages AI service configuration from environment variables:

```typescript
import { aiConfig } from './config/ai.config';

// Check if AI is configured
if (aiConfig.isConfigured()) {
  const config = aiConfig.getConfig();
  // Use config...
}
```

**Environment Variables:**
- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: Model to use (default: gpt-4)
- `OPENAI_MAX_TOKENS`: Maximum tokens per request (default: 2000)
- `OPENAI_TEMPERATURE`: Temperature for responses (default: 0.7)
- `AI_RATE_LIMIT_PER_MINUTE`: Requests per minute per user (default: 10)
- `AI_RATE_LIMIT_PER_HOUR`: Requests per hour per user (default: 100)
- `AI_REQUEST_TIMEOUT_MS`: Request timeout in milliseconds (default: 30000)
- `AI_MAX_RETRIES`: Maximum retry attempts (default: 3)
- `AI_RETRY_DELAY_MS`: Initial retry delay in milliseconds (default: 1000)

### 2. Rate Limiting (`rate-limiter.util.ts`)

Implements per-user rate limiting:

```typescript
import { RateLimiter, UsageTracker } from './utils/rate-limiter.util';

const rateLimiter = new RateLimiter(10, 100); // 10/min, 100/hour

// Check if request is allowed
if (rateLimiter.isAllowed(userId)) {
  // Process request
  rateLimiter.recordRequest(userId);
}

// Get remaining requests
const remaining = rateLimiter.getRemaining(userId);
console.log(`Remaining: ${remaining.perMinute}/min, ${remaining.perHour}/hour`);
```

### 3. Base AI Service (`base-ai.service.ts`)

Abstract base class for all AI services with common functionality:

```typescript
import { BaseAIService } from './services/ai/base-ai.service';

class MyAIService extends BaseAIService {
  async myOperation(userId: string, data: any) {
    // Ensure service is initialized
    this.ensureInitialized();
    
    // Check rate limits
    this.checkRateLimit(userId);
    
    // Execute with retry logic
    const result = await this.executeWithRetry(
      async () => {
        // Your AI operation here
        return await this.openai.chat.completions.create({...});
      },
      userId,
      'myOperation'
    );
    
    // Record successful request
    this.recordRequest(userId, result.usage?.total_tokens);
    
    return result;
  }
}
```

**Features:**
- Automatic retry with exponential backoff
- Request timeout handling
- Rate limit checking
- Usage tracking
- Request queuing for failed calls
- Comprehensive logging

### 4. Error Handling (`ai-errors.util.ts`)

Custom error types for AI operations:

```typescript
import { 
  AIServiceError, 
  RateLimitError, 
  AITimeoutError,
  handleAIError 
} from './utils/ai-errors.util';

try {
  // AI operation
} catch (error) {
  const aiError = handleAIError(error);
  
  if (aiError instanceof RateLimitError) {
    // Handle rate limit
    console.log('Remaining:', aiError.remaining);
  } else if (aiError instanceof AITimeoutError) {
    // Handle timeout
    console.log('Timeout:', aiError.timeoutMs);
  }
}
```

### 5. Data Preparation (`data-preparation.service.ts`)

Utilities to prepare trade data for AI consumption:

```typescript
import { dataPreparationService } from './services/ai/data-preparation.service';

// Serialize trades for AI context
const serializedTrades = dataPreparationService.serializeTrades(trades);

// Build psychological profile
const profile = dataPreparationService.buildPsychologicalProfile(trades);

// Build pattern data
const patterns = dataPreparationService.buildPatternData(trades);
```

**Features:**
- Trade serialization optimized for AI
- Psychological profile aggregation
- Pattern detection and formatting
- Correlation calculations
- Performance metrics

### 6. Prompt Templates (`prompt-templates.service.ts`)

Reusable prompt templates for different AI operations:

```typescript
import { promptTemplatesService } from './services/ai/prompt-templates.service';

// Get emotion analysis prompt
const prompt = promptTemplatesService.getEmotionAnalysisPrompt(text);

// Get trade insights prompt
const insightsPrompt = promptTemplatesService.getTradeInsightsPrompt(
  trades,
  psychProfile,
  patterns
);

// Get chat prompt
const chatPrompt = promptTemplatesService.getChatPrompt(
  userMessage,
  trades,
  psychProfile
);
```

## Usage Example

Here's a complete example of implementing an AI service:

```typescript
import { BaseAIService } from './services/ai/base-ai.service';
import { dataPreparationService } from './services/ai/data-preparation.service';
import { promptTemplatesService } from './services/ai/prompt-templates.service';

class EmotionAnalysisService extends BaseAIService {
  async analyzeEmotion(userId: string, text: string) {
    // Ensure initialized
    this.ensureInitialized();
    
    // Check rate limits
    this.checkRateLimit(userId);
    
    try {
      // Execute with retry
      const result = await this.executeWithRetry(
        async () => {
          const prompt = promptTemplatesService.getEmotionAnalysisPrompt(text);
          
          const response = await this.openai!.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
          });
          
          return JSON.parse(response.choices[0].message.content || '{}');
        },
        userId,
        'analyzeEmotion'
      );
      
      // Record success
      this.recordRequest(userId, 500);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      // Record failure
      this.recordFailure(userId);
      
      // Queue for retry
      const requestId = this.queueFailedRequest(
        { userId, operation: 'analyzeEmotion', data: { text } },
        (error as Error).message
      );
      
      throw error;
    }
  }
}

export const emotionAnalysisService = new EmotionAnalysisService();
```

## Best Practices

1. **Always check if AI is configured** before using AI features
2. **Use rate limiting** to prevent abuse and manage costs
3. **Implement retry logic** for transient failures
4. **Queue failed requests** for later processing
5. **Track usage** to monitor costs and performance
6. **Handle errors gracefully** with appropriate user feedback
7. **Log all AI operations** for debugging and monitoring
8. **Use prompt templates** for consistency and maintainability
9. **Serialize data efficiently** to minimize token usage
10. **Test with mock data** before using real API calls

## Testing

When testing AI services:

1. Set `OPENAI_API_KEY` to a test key or mock the OpenAI client
2. Use small datasets to minimize token usage
3. Test rate limiting with multiple rapid requests
4. Test retry logic by simulating failures
5. Test error handling for various error types
6. Verify usage tracking accuracy
7. Test request queuing and processing

## Cost Management

To manage OpenAI API costs:

1. **Set appropriate rate limits** based on your budget
2. **Monitor usage** with the UsageTracker
3. **Cache AI responses** when possible
4. **Optimize prompts** to use fewer tokens
5. **Use appropriate models** (GPT-3.5 for simple tasks, GPT-4 for complex)
6. **Implement user quotas** if needed
7. **Set up cost alerts** in your OpenAI dashboard

## Future Enhancements

- [ ] Response caching to reduce API calls
- [ ] Batch processing for multiple requests
- [ ] Streaming responses for better UX
- [ ] A/B testing for prompt optimization
- [ ] Cost tracking and budgeting
- [ ] User-specific AI preferences
- [ ] AI model selection based on task complexity
- [ ] Fallback to simpler models on rate limit
