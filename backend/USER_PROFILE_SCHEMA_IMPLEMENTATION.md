# User Profile Schema Implementation

## Overview
This document describes the implementation of the user profile schema for Phase 3A (Task 30.1) of the AI Trading Journal.

## Changes Made

### 1. Database Schema (Prisma)

#### Updated User Model
Added the following profile fields to the `User` model in `backend/prisma/schema.prisma`:

```prisma
model User {
  id              String           @id @default(uuid())
  email           String           @unique
  passwordHash    String
  name            String?
  
  // Profile Information
  bio             String?          @db.Text
  avatar          String?          // URL to avatar image
  tradingStyle    TradingStyle?
  experienceLevel ExperienceLevel?
  
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
  trades          Trade[]
  
  @@map("users")
}
```

#### New Enums

**TradingStyle Enum:**
```prisma
enum TradingStyle {
  DAY_TRADER
  SWING_TRADER
  SCALPER
  POSITION_TRADER
  ALGORITHMIC
  HYBRID
}
```

**ExperienceLevel Enum:**
```prisma
enum ExperienceLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
  EXPERT
}
```

### 2. Database Migration

Created and applied migration: `20251126101000_add_user_profile_fields`

The migration:
- Creates `TradingStyle` enum with 6 values
- Creates `ExperienceLevel` enum with 4 values
- Adds `bio` (TEXT), `avatar` (TEXT), `tradingStyle`, and `experienceLevel` columns to the `users` table
- All new fields are nullable to maintain backward compatibility

### 3. TypeScript Types

#### Backend Types (`backend/src/types/index.ts`)

Added:
```typescript
export enum TradingStyle {
  DAY_TRADER = 'DAY_TRADER',
  SWING_TRADER = 'SWING_TRADER',
  SCALPER = 'SCALPER',
  POSITION_TRADER = 'POSITION_TRADER',
  ALGORITHMIC = 'ALGORITHMIC',
  HYBRID = 'HYBRID',
}

export enum ExperienceLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT',
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  tradingStyle?: TradingStyle;
  experienceLevel?: ExperienceLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileDTO {
  name?: string;
  bio?: string;
  avatar?: string;
  tradingStyle?: TradingStyle;
  experienceLevel?: ExperienceLevel;
}
```

#### Frontend Types (`frontend/src/types/index.ts`)

Updated `User` interface and added:
```typescript
export type TradingStyle = 'DAY_TRADER' | 'SWING_TRADER' | 'SCALPER' | 'POSITION_TRADER' | 'ALGORITHMIC' | 'HYBRID';
export type ExperienceLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface User {
  id: string;
  email: string;
  name: string | null;
  bio?: string | null;
  avatar?: string | null;
  tradingStyle?: TradingStyle | null;
  experienceLevel?: ExperienceLevel | null;
  createdAt: string;
}

export interface UpdateProfileDTO {
  name?: string;
  bio?: string;
  avatar?: string;
  tradingStyle?: TradingStyle;
  experienceLevel?: ExperienceLevel;
}
```

## Profile Fields Description

### bio (Text)
- Long-form text field for user biography
- Optional field
- Can contain trading philosophy, goals, or personal information

### avatar (String)
- URL to user's profile picture
- Optional field
- Will store either uploaded image URL or external image URL

### tradingStyle (Enum)
- Categorizes the user's primary trading approach
- Options:
  - `DAY_TRADER`: Trades within the same day
  - `SWING_TRADER`: Holds positions for days to weeks
  - `SCALPER`: Very short-term trades (seconds to minutes)
  - `POSITION_TRADER`: Long-term positions (weeks to months)
  - `ALGORITHMIC`: Uses automated trading systems
  - `HYBRID`: Combines multiple trading styles

### experienceLevel (Enum)
- Indicates the user's trading experience
- Options:
  - `BEGINNER`: New to trading (0-1 years)
  - `INTERMEDIATE`: Some experience (1-3 years)
  - `ADVANCED`: Experienced trader (3-5 years)
  - `EXPERT`: Professional level (5+ years)

## Database Status

✅ Migration applied successfully
✅ Database schema is up to date
✅ All profile fields are nullable for backward compatibility
✅ Existing user records remain valid

## Status Update

✅ **Task 30.1 is now COMPLETE!**

All features have been implemented:
- ✅ User profile schema (bio, avatar, trading style, experience level)
- ✅ Privacy settings (public/private profile, data sharing preferences)
- ✅ Profile statistics (shareable metrics)
- ✅ Achievement badges and milestones
- ✅ Profile customization

See `USER_PROFILE_COMPLETE_IMPLEMENTATION.md` for full details.

## Next Steps

2. **Task 30.2**: Build Profile API
   - GET /api/profile/:userId
   - PUT /api/profile
   - GET /api/profile/stats/:userId
   - PUT /api/profile/privacy
   - POST /api/profile/avatar

3. **Task 30.3**: Build Profile UI
   - ProfilePage component
   - PublicProfilePage component
   - ProfileEditor component
   - PrivacySettings component

## Testing Recommendations

When implementing the API endpoints, ensure:
1. Users can only update their own profiles
2. Avatar URLs are validated
3. Bio text is sanitized to prevent XSS
4. Trading style and experience level enums are validated
5. Profile updates trigger the `updatedAt` timestamp
