# Emotion Analysis API Testing Guide

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. Valid authentication token
3. At least one trade created in the system

## Environment Setup

```bash
# Set your auth token
export AUTH_TOKEN="your_jwt_token_here"

# Set a trade ID for testing
export TRADE_ID="your_trade_id_here"
```

## Test Cases

### 1. Test Emotion Analysis for a Trade

```bash
curl -X POST http://localhost:5000/api/ai/analyze-emotion \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"tradeId\": \"$TRADE_ID\"}"
```

**Expected Response:**
- Status: 200 OK
- Body contains emotion timeline with preTrade, duringTrade, postTrade sections
- AI insights stored in database

### 2. Test Emotion Patterns (Historical Analysis)

```bash
curl -X GET "http://localhost:5000/api/ai/emotion-patterns?minTrades=5" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Expected Response:**
- Status: 200 OK
- Body contains patterns array, correlations array, and stressAnalysis
- If fewer than minTrades, returns message about insufficient data

### 3. Test Emotion Timeline for Specific Trade

```bash
curl -X GET "http://localhost:5000/api/ai/emotion-timeline/$TRADE_ID" \
  -H "Authorization: Bearer $AUTH_TOKEN"
```

**Expected Response:**
- Status: 200 OK
- Body contains emotion timeline
- If cached, response includes `"cached": true`

### 4. Test Sentiment Analysis

```bash
curl -X POST http://localhost:5000/api/ai/analyze-sentiment \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"text": "I felt really confident about this trade. The setup was perfect and I followed my plan exactly."}'
```

**Expected Response:**
- Status: 200 OK
- Body contains sentiment analysis with score, emotions, and keyPhrases

### 5. Test Trade Creation with Emotion Analysis

```bash
curl -X POST "http://localhost:5000/api/trades?analyzeEmotion=true" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tradeDate": "2024-01-15",
    "entryTime": "09:30",
    "exitTime": "10:45",
    "tradeType": "CRYPTO",
    "instrument": "BTC/USDT",
    "tradeDirection": "BUY_LONG",
    "avgBuyPrice": 45000,
    "avgSellPrice": 46000,
    "positionSize": 0.1,
    "leverage": 1,
    "baseCurrency": "USD",
    "emotionalState": "CONFIDENT",
    "isImpulsive": false,
    "setupConfidence": 8,
    "stressLevel": 4,
    "exitSatisfaction": 9
  }'
```

**Expected Response:**
- Status: 201 Created
- Body contains trade data
- If AI available, includes `emotionAnalysis` field

## Error Cases

### 1. Missing Trade ID

```bash
curl -X POST http://localhost:5000/api/ai/analyze-emotion \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
- Status: 400 Bad Request
- Error message: "Trade ID is required"

### 2. Invalid Trade ID

```bash
curl -X POST http://localhost:5000/api/ai/analyze-emotion \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"tradeId": "invalid-uuid"}'
```

**Expected Response:**
- Status: 404 Not Found
- Error message: "Trade not found"

### 3. Unauthorized Access

```bash
curl -X GET http://localhost:5000/api/ai/emotion-patterns
```

**Expected Response:**
- Status: 401 Unauthorized
- Error message about missing authentication

### 4. Text Too Long

```bash
curl -X POST http://localhost:5000/api/ai/analyze-sentiment \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"$(printf 'a%.0s' {1..5001})\"}"
```

**Expected Response:**
- Status: 400 Bad Request
- Error message: "Text is too long (max 5000 characters)"

## Rate Limiting

The API implements rate limiting:
- 10 requests per minute per user
- 100 requests per hour per user

Test rate limiting:

```bash
# Run this in a loop to trigger rate limit
for i in {1..15}; do
  curl -X GET "http://localhost:5000/api/ai/emotion-patterns" \
    -H "Authorization: Bearer $AUTH_TOKEN"
  echo "Request $i completed"
done
```

**Expected Behavior:**
- First 10 requests succeed
- Subsequent requests return 429 Too Many Requests

## Verification Checklist

- [ ] All endpoints return correct status codes
- [ ] Emotion analysis is stored in database (check `aiInsights` and `sentimentScore` fields)
- [ ] Analytics events are tracked (check `analytics_events` table)
- [ ] Pattern occurrences are recorded (check `pattern_occurrences` table)
- [ ] AI insights are stored (check `ai_insights` table)
- [ ] Rate limiting works correctly
- [ ] Error handling is graceful
- [ ] Trade creation succeeds even if emotion analysis fails
- [ ] Cached results are returned when available

## Database Verification

After running tests, verify data in database:

```sql
-- Check AI insights stored in trades
SELECT id, instrument, "aiInsights", "sentimentScore" 
FROM trades 
WHERE "aiInsights" IS NOT NULL;

-- Check analytics events
SELECT "eventType", COUNT(*) 
FROM analytics_events 
WHERE "eventType" LIKE '%emotion%' 
GROUP BY "eventType";

-- Check AI insights
SELECT "insightType", COUNT(*) 
FROM ai_insights 
GROUP BY "insightType";

-- Check pattern occurrences
SELECT "patternType", COUNT(*) 
FROM pattern_occurrences 
GROUP BY "patternType";
```

## Notes

- Ensure OpenAI API key is configured in `.env`
- AI service must be available for emotion analysis to work
- Failed AI requests are queued for retry
- All operations are logged for debugging
