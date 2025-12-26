# Profile API Demo

## Quick Test Guide

### 1. Start the Backend Server
```bash
cd backend
npm run dev
```

### 2. Register a Test User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@example.com",
    "password": "DemoPassword123!",
    "name": "Demo User"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid-here",
      "email": "demo@example.com",
      "name": "Demo User",
      "createdAt": "2025-11-26T..."
    },
    "token": "jwt-token-here"
  }
}
```

### 3. Get Own Profile (Authenticated)
```bash
curl -X GET http://localhost:5000/api/profile/{user-uuid} \
  -H "Authorization: Bearer {jwt-token}"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid",
    "email": "demo@example.com",
    "name": "Demo User",
    "privacySettings": {
      "profileVisibility": "PRIVATE",
      "shareStats": false,
      "shareTrades": false,
      "shareEmotions": false,
      "sharePatterns": false
    },
    "stats": {
      "totalTrades": 0,
      "winRate": 0,
      "totalPnL": 0,
      "currentStreak": 0,
      "longestWinStreak": 0
    },
    "badges": [],
    "milestones": {},
    "createdAt": "2025-11-26T...",
    "updatedAt": "2025-11-26T..."
  }
}
```

### 4. Try to Get Profile Without Authentication (Should Fail)
```bash
curl -X GET http://localhost:5000/api/profile/{user-uuid}
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "This profile is private"
  }
}
```

### 5. Try to Get Non-Existent Profile
```bash
curl -X GET http://localhost:5000/api/profile/00000000-0000-0000-0000-000000000000
```

**Response:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User not found"
  }
}
```

## Automated Test

Run the automated test suite:
```bash
cd backend
npx ts-node test-profile-api.ts
```

**Expected Output:**
```
🧪 Testing Profile API Endpoint
==================================================

1️⃣  Registering test user...
✅ User registered successfully

2️⃣  Testing GET /api/profile/:userId (authenticated - own profile)...
✅ Own profile retrieved successfully

3️⃣  Testing GET /api/profile/:userId (unauthenticated)...
✅ Correctly blocked access to private profile

4️⃣  Testing GET /api/profile/:userId (non-existent user)...
✅ Correctly returned 404 for non-existent user

==================================================
📊 Test Summary

✅ Test 1: Get own profile (authenticated)
✅ Test 2: Get profile (unauthenticated, private profile)
✅ Test 3: Get non-existent profile

==================================================

🎯 Results: 3/3 tests passed
🎉 All tests passed!
```

## Privacy Settings Behavior

| Scenario | profileVisibility | shareStats | Result |
|----------|------------------|------------|--------|
| Owner viewing own profile | Any | Any | Full access to all data |
| Non-owner, PRIVATE profile | PRIVATE | Any | 403 Forbidden |
| Non-owner, PUBLIC profile | PUBLIC | true | Full stats visible |
| Non-owner, PUBLIC profile | PUBLIC | false | Stats hidden (zeros) |

## Integration with Existing Features

The profile endpoint integrates with:
- ✅ User authentication system (JWT tokens)
- ✅ Profile statistics service (ProfileStatsService)
- ✅ Badge system (badges and milestones)
- ✅ Privacy settings (from User model)

## Next Steps

To complete the profile feature, implement:
1. PUT /api/profile - Update profile information
2. GET /api/profile/stats/:userId - Get shareable stats card
3. PUT /api/profile/privacy - Update privacy settings
4. POST /api/profile/avatar - Upload profile picture
