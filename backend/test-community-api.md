# Community API Testing Guide

## Prerequisites
1. Backend server running on http://localhost:5000
2. Valid JWT token from login
3. PostgreSQL database with migrations applied

## Test Endpoints

### 1. Create a Post
```bash
POST http://localhost:5000/api/community/posts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "postType": "INSIGHT",
  "title": "My First Trading Insight",
  "content": "Today I learned that patience is key in trading. Waiting for the right setup is more important than forcing trades."
}
```

### 2. Get Community Feed (Following)
```bash
GET http://localhost:5000/api/community/feed?type=following&limit=20
Authorization: Bearer YOUR_JWT_TOKEN
```

### 3. Get Trending Posts
```bash
GET http://localhost:5000/api/community/feed?type=trending&limit=20
Authorization: Bearer YOUR_JWT_TOKEN
```

### 4. Like a Post
```bash
POST http://localhost:5000/api/community/posts/{POST_ID}/like
Authorization: Bearer YOUR_JWT_TOKEN
```

### 5. Comment on a Post
```bash
POST http://localhost:5000/api/community/posts/{POST_ID}/comments
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "content": "Great insight! I totally agree with this approach."
}
```

### 6. Follow a User
```bash
POST http://localhost:5000/api/community/follow/{USER_ID}
Authorization: Bearer YOUR_JWT_TOKEN
```

### 7. Search Users
```bash
GET http://localhost:5000/api/community/search?q=trader&tradingStyle=DAY_TRADER
Authorization: Bearer YOUR_JWT_TOKEN
```

### 8. Get Leaderboard
```bash
GET http://localhost:5000/api/community/leaderboard?type=win_rate&period=all_time&limit=50
Authorization: Bearer YOUR_JWT_TOKEN
```

### 9. Get Suggested Users
```bash
GET http://localhost:5000/api/community/suggested-users?limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

### 10. Report a Post
```bash
POST http://localhost:5000/api/community/posts/{POST_ID}/report
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "reason": "spam",
  "description": "This post contains promotional content"
}
```

## Expected Responses

### Success Response Format
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

## Testing Checklist

- [ ] Create post with all post types (ACHIEVEMENT, INSIGHT, QUESTION, TRADE_BREAKDOWN)
- [ ] Get feed with different types (following, trending, recent)
- [ ] Like and unlike posts
- [ ] Create and delete comments
- [ ] Follow and unfollow users
- [ ] Search users with different filters
- [ ] Get leaderboards with different types
- [ ] Get suggested users
- [ ] Report posts
- [ ] Verify authentication is required for all endpoints
- [ ] Test with invalid data (missing fields, invalid IDs)
- [ ] Test pagination (limit and offset parameters)

## Notes

- All endpoints require authentication via JWT token
- Post IDs and User IDs are UUIDs
- Leaderboard types: trader_score, win_rate, consistency, total_pnl
- Post types: ACHIEVEMENT, INSIGHT, QUESTION, TRADE_BREAKDOWN
- Feed types: following, trending, recent
