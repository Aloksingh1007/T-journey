# Emotion Analysis API Troubleshooting Guide

## Common Issues and Solutions

### 403 Forbidden Error

**Error Message:** `Failed to load resource: the server responded with a status of 403 (Forbidden)`

**Endpoint:** `/api/ai/emotion-timeline/:tradeId`

#### Possible Causes:

1. **Trade Ownership Mismatch**
   - The trade belongs to a different user
   - The authenticated user doesn't have permission to access this trade
   
   **Solution:** Ensure the user is logged in and accessing their own trades

2. **Invalid Authentication Token**
   - Token expired
   - Token not included in request headers
   - Token belongs to different user
   
   **Solution:** 
   - Check if user is properly authenticated
   - Verify token is being sent in Authorization header
   - Try logging out and logging back in

3. **Trade ID Mismatch**
   - Trade ID in URL doesn't match the trade being viewed
   - Trade was deleted or doesn't exist
   
   **Solution:** Verify the trade ID in the URL matches the trade data

#### Debugging Steps:

1. **Check Backend Logs**
   ```
   [Emotion Timeline] User <userId> requesting timeline for trade <tradeId>
   [Emotion Timeline] Authorization failed: trade belongs to <ownerId>, requested by <requesterId>
   ```

2. **Verify Authentication**
   - Open browser DevTools → Network tab
   - Check the request headers for `Authorization: Bearer <token>`
   - Verify the token is valid and not expired

3. **Check Trade Ownership**
   - In the database, verify `trade.userId` matches the authenticated user's ID
   - Query: `SELECT id, userId FROM trades WHERE id = '<tradeId>'`

4. **Test with Different Trade**
   - Try accessing a different trade to see if the issue persists
   - If other trades work, the specific trade may have ownership issues

#### Backend Changes Made:

1. **Enhanced Error Messages**
   - Changed generic "Unauthorized" to "You do not have permission to access this trade"
   - Added detailed logging for debugging

2. **Improved Cached Response**
   - Added `keyInsights` extraction from trade data
   - Properly handles null/undefined values

3. **Better Authorization Check**
   - Logs user IDs for debugging
   - Clear error messages for troubleshooting

#### Frontend Changes Made:

1. **Error Handling**
   - Added `error` state from `useEmotionTimeline` hook
   - Displays user-friendly error message when API fails
   - Shows yellow warning box instead of breaking the UI

2. **Graceful Degradation**
   - Trade detail page still works even if emotion analysis fails
   - Error message explains the feature may not be available yet
   - Doesn't block access to other trade information

### 404 Not Found Error

**Possible Causes:**
- Trade ID doesn't exist in database
- Trade was deleted
- Invalid UUID format

**Solution:**
- Verify trade exists: `SELECT * FROM trades WHERE id = '<tradeId>'`
- Check if trade was soft-deleted
- Ensure trade ID is a valid UUID

### 500 Internal Server Error

**Possible Causes:**
- AI service unavailable
- Database connection issue
- Missing environment variables (OPENAI_API_KEY)

**Solution:**
1. Check backend logs for detailed error
2. Verify OpenAI API key is configured
3. Check database connection
4. Verify AI service is running

### Empty Response (No Data)

**Possible Causes:**
- Trade doesn't have enough data for analysis
- AI analysis hasn't been run yet
- Cached data is incomplete

**Solution:**
1. Trigger analysis manually: `POST /api/ai/analyze-emotion` with `{ tradeId }`
2. Ensure trade has emotional data fields filled
3. Check if `aiInsights` and `sentimentScore` are null in database

## API Endpoints

### GET /api/ai/emotion-timeline/:tradeId

**Purpose:** Retrieve emotion timeline for a specific trade

**Authentication:** Required (Bearer token)

**Response:**
```json
{
  "success": true,
  "data": {
    "tradeId": "uuid",
    "preTrade": {
      "emotion": "CONFIDENT",
      "confidence": 8,
      "hesitation": false,
      "sentiment": "confident"
    },
    "duringTrade": {
      "stressLevel": 5,
      "consideredEarlyExit": false,
      "sentiment": "moderate"
    },
    "postTrade": {
      "satisfaction": 7,
      "sentiment": "satisfied",
      "keyInsights": ["Lesson 1", "Lesson 2"]
    },
    "overallSentiment": 0.45,
    "emotionalJourney": "Description of emotional journey..."
  },
  "cached": true
}
```

**Error Responses:**
- `400`: Missing trade ID
- `403`: Unauthorized (trade belongs to different user)
- `404`: Trade not found
- `500`: Server error (AI service failure)

### POST /api/ai/analyze-emotion

**Purpose:** Trigger AI analysis for a trade (generates new timeline)

**Authentication:** Required

**Request Body:**
```json
{
  "tradeId": "uuid"
}
```

**Response:** Same as GET endpoint, but with `cached: false`

### GET /api/ai/emotion-patterns

**Purpose:** Get historical emotion patterns across all trades

**Authentication:** Required

**Query Parameters:**
- `startDate` (optional): Filter trades from this date
- `endDate` (optional): Filter trades until this date
- `minTrades` (optional, default: 10): Minimum trades required for analysis

**Response:**
```json
{
  "success": true,
  "data": {
    "patterns": [...],
    "correlations": [...],
    "stressAnalysis": {...},
    "totalTrades": 25
  }
}
```

## Testing Checklist

- [ ] User can view emotion timeline on their own trades
- [ ] 403 error shown when accessing other user's trades
- [ ] Error message displayed gracefully in UI
- [ ] Loading state shows while fetching data
- [ ] Cached data loads quickly on subsequent views
- [ ] Backend logs show clear debugging information
- [ ] Trade detail page works even if emotion analysis fails

## Environment Variables

Ensure these are set in `backend/.env`:

```env
OPENAI_API_KEY=sk-...
NODE_ENV=development
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

## Database Schema

Relevant fields in `trades` table:
- `aiInsights` (TEXT): Cached emotional journey description
- `sentimentScore` (DECIMAL): Overall sentiment score (-1 to 1)
- `emotionalState` (ENUM): Pre-trade emotional state
- `setupConfidence` (INT): Confidence level (1-10)
- `stressLevel` (INT): During-trade stress (1-10)
- `exitSatisfaction` (INT): Post-trade satisfaction (1-10)
- `hadHesitation` (BOOLEAN): Pre-trade hesitation
- `consideredEarlyExit` (BOOLEAN): During-trade exit consideration
- `keyLesson` (TEXT): Post-trade lesson
- `whatWentWell` (TEXT): Post-trade positive reflection
- `wouldDoDifferently` (TEXT): Post-trade improvement ideas
