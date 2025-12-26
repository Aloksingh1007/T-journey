# Groq AI Setup Guide

## What is Groq?

Groq is a free AI inference platform that provides fast, high-quality AI models. We're using it instead of OpenAI because it's completely free and offers excellent performance.

## Getting Your Groq API Key

1. **Visit Groq Console**: Go to [https://console.groq.com](https://console.groq.com)

2. **Sign Up/Login**: Create a free account or login with your existing account

3. **Generate API Key**:
   - Navigate to "API Keys" section
   - Click "Create API Key"
   - Give it a name (e.g., "Trading Journal")
   - Copy the generated key

4. **Add to .env file**:
   ```env
   GROQ_API_KEY=your-actual-api-key-here
   ```

## Model Information

We're using the `groq/compound` model which is:
- **Free**: No cost for API calls
- **Fast**: Extremely low latency
- **Powerful**: Great for analysis and reasoning tasks
- **Token Limit**: 8192 tokens per request

## Current Configuration

Your `.env` file should have:

```env
# Groq AI Configuration
GROQ_API_KEY=your-groq-api-key-here
AI_MODEL=groq/compound
AI_MAX_TOKENS=8192
AI_TEMPERATURE=0.7
```

## Features Using Groq AI

1. **Emotion Analysis**: Analyzes trader emotions throughout the trade lifecycle
2. **Pattern Detection**: Identifies behavioral patterns in trading
3. **Sentiment Analysis**: Analyzes text notes and reflections
4. **Trade Insights**: Generates insights from trade data

## Fallback Behavior

If Groq API is not configured or fails:
- The system will return basic analysis based on trade data
- No AI-generated insights, but core functionality still works
- You'll see a warning in the console logs

## Rate Limits

Current rate limits (configurable in .env):
- **Per Minute**: 10 requests
- **Per Hour**: 100 requests

These are conservative limits. Groq's actual limits are much higher, but we keep them low to prevent abuse.

## Troubleshooting

### "AI service is not configured" error
- Check that `GROQ_API_KEY` is set in your `.env` file
- Restart the backend server after updating `.env`

### "Rate limit exceeded" error
- Wait a minute and try again
- Increase limits in `.env` if needed:
  ```env
  AI_RATE_LIMIT_PER_MINUTE=20
  AI_RATE_LIMIT_PER_HOUR=200
  ```

### JSON parsing errors
- The system will automatically fall back to basic analysis
- Check console logs for details
- The error is logged but won't break the application

## Testing the Integration

1. Start the backend server:
   ```bash
   npm run dev
   ```

2. Create a trade with emotional data

3. View the trade detail page - you should see emotion analysis

4. Check the console logs for AI service status:
   ```
   ✅ Groq AI initialized successfully
   ```

## Cost Comparison

| Service | Cost | Speed | Quality |
|---------|------|-------|---------|
| OpenAI GPT-4 | $0.03/1K tokens | Medium | Excellent |
| Groq Compound | **FREE** | Very Fast | Excellent |

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your API key is valid at [console.groq.com](https://console.groq.com)
3. Ensure you're using the latest version of the code

## Additional Resources

- [Groq Documentation](https://console.groq.com/docs)
- [Groq API Reference](https://console.groq.com/docs/api-reference)
- [Groq Models](https://console.groq.com/docs/models)
