# User Profile System - Complete Implementation

## Overview
This document describes the complete implementation of Task 30.1: Create User Profile System for Phase 3B of the AI Trading Journal.

## ✅ Completed Features

### 1. User Profile Schema
### 2. Privacy Settings
### 3. Profile Statistics
### 4. Achievement Badges & Milestones
### 5. Profile Customization

---

## Database Schema Changes

### Migration 1: `20251126101000_add_user_profile_fields`
Added basic profile fields:
- `bio` (TEXT) - User biography
- `avatar` (TEXT) - Profile picture URL
- `tradingStyle` (TradingStyle enum)
- `experienceLevel` (ExperienceLevel enum)

### Migration 2: `20251126102202_add_privacy_stats_badges`
Added privacy, statistics, and gamification fields:

#### Privacy Settings
```sql
profileVisibility ProfileVisibility DEFAULT 'PRIVATE'
shareStats        BOOLEAN DEFAULT false
shareTrades       BOOLEAN DEFAULT false
shareEmotions     BOOLEAN DEFAULT false
sharePatterns     BOOLEAN DEFAULT false
```

#### Profile Statistics (Cached)
```sql
totalTrades       INTEGER DEFAULT 0
winRate           DECIMAL(5,2) DEFAULT 0
totalPnL          DECIMAL(18,2) DEFAULT 0
currentStreak     INTEGER DEFAULT 0
longestWinStreak  INTEGER DEFAULT 0
bestTradeDate     TIMESTAMP
```

#### Gamification
```sql
badges            JSONB DEFAULT '[]'
milestones        JSONB DEFAULT '{}'
```

---

## Enums

### TradingStyle
```typescript
enum TradingStyle {
  DAY_TRADER       // Trades within the same day
  SWING_TRADER     // Holds positions for days to weeks
  SCALPER          // Very short-term trades (seconds to minutes)
  POSITION_TRADER  // Long-term positions (weeks to months)
  ALGORITHMIC      // Uses automated trading systems
  HYBRID           // Combines multiple trading styles
}
```

### ExperienceLevel
```typescript
enum ExperienceLevel {
  BEGINNER      // New to trading (0-1 years)
  INTERMEDIATE  // Some experience (1-3 years)
  ADVANCED      // Experienced trader (3-5 years)
  EXPERT        // Professional level (5+ years)
}
```

### ProfileVisibility
```typescript
enum ProfileVisibility {
  PUBLIC        // Profile visible to everyone
  PRIVATE       // Profile visible only to user
  FRIENDS_ONLY  // Profile visible to friends (future feature)
}
```

---

## TypeScript Types

### Backend Types (`backend/src/types/index.ts`)

```typescript
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
  category: 'trading' | 'consistency' | 'learning' | 'milestone';
}

export interface Milestones {
  firstTrade?: boolean;
  trades10?: boolean;
  trades50?: boolean;
  trades100?: boolean;
  trades500?: boolean;
  trades1000?: boolean;
  winStreak5?: boolean;
  winStreak10?: boolean;
  profitMilestone1000?: boolean;
  profitMilestone10000?: boolean;
  profitMilestone100000?: boolean;
  perfectWeek?: boolean;
  perfectMonth?: boolean;
  journalStreak7?: boolean;
  journalStreak30?: boolean;
  journalStreak100?: boolean;
}

export interface PrivacySettings {
  profileVisibility: ProfileVisibility;
  shareStats: boolean;
  shareTrades: boolean;
  shareEmotions: boolean;
  sharePatterns: boolean;
}

export interface ProfileStats {
  totalTrades: number;
  winRate: number;
  totalPnL: number;
  currentStreak: number;
  longestWinStreak: number;
  bestTradeDate?: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar?: string;
  tradingStyle?: TradingStyle;
  experienceLevel?: ExperienceLevel;
  privacySettings: PrivacySettings;
  stats: ProfileStats;
  badges: Badge[];
  milestones: Milestones;
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

export interface UpdatePrivacySettingsDTO {
  profileVisibility?: ProfileVisibility;
  shareStats?: boolean;
  shareTrades?: boolean;
  shareEmotions?: boolean;
  sharePatterns?: boolean;
}
```

---

## Services

### BadgeService (`backend/src/services/badge.service.ts`)

Manages achievement badges and milestones.

#### Badge Definitions

**Trading Milestones:**
- 🎯 First Trade - Logged your first trade
- 📊 Getting Started - Logged 10 trades
- 📈 Active Trader - Logged 50 trades
- 💯 Century - Logged 100 trades
- 🏆 Veteran Trader - Logged 500 trades
- 👑 Master Trader - Logged 1000 trades

**Win Streaks:**
- 🔥 Hot Streak - 5 winning trades in a row
- ⚡ Unstoppable - 10 winning trades in a row

**Profit Milestones:**
- 💰 First Thousand - Reached ₹1,000 in total profit
- 💎 Five Figures - Reached ₹10,000 in total profit
- 🌟 Six Figures - Reached ₹1,00,000 in total profit

**Consistency:**
- ✨ Perfect Week - All winning trades in a week
- 🎖️ Perfect Month - All winning trades in a month

**Journaling:**
- 📝 Committed - Logged trades for 7 days straight
- 📚 Dedicated - Logged trades for 30 days straight
- 🎓 Disciplined - Logged trades for 100 days straight

#### Methods

```typescript
// Check and award badges based on user's trading activity
BadgeService.checkAndAwardBadges(
  currentBadges: Badge[],
  currentMilestones: Milestones,
  stats: { totalTrades, currentStreak, longestWinStreak, totalPnL }
): { badges: Badge[]; milestones: Milestones }

// Get all available badges
BadgeService.getAllBadges(): BadgeDefinition[]

// Get badge progress for a user
BadgeService.getBadgeProgress(
  milestones: Milestones,
  stats: { totalTrades, currentStreak, longestWinStreak, totalPnL }
): BadgeProgress
```

### ProfileStatsService (`backend/src/services/profile-stats.service.ts`)

Manages user profile statistics and badge awards.

#### Methods

```typescript
// Update user profile statistics based on their trades
ProfileStatsService.updateUserStats(userId: string): Promise<void>

// Get shareable profile statistics
ProfileStatsService.getShareableStats(userId: string): Promise<ShareableStats>

// Get badge progress for a user
ProfileStatsService.getBadgeProgress(userId: string): Promise<BadgeProgress>
```

---

## Privacy Settings

### Privacy Controls

Users can control what information is shared:

1. **Profile Visibility**
   - `PUBLIC`: Profile visible to everyone
   - `PRIVATE`: Profile visible only to user (default)
   - `FRIENDS_ONLY`: Profile visible to friends (future feature)

2. **Data Sharing Preferences**
   - `shareStats`: Share trading statistics (win rate, P&L, etc.)
   - `shareTrades`: Share individual trade details
   - `shareEmotions`: Share emotional analysis data
   - `sharePatterns`: Share detected trading patterns

### Default Privacy Settings

All new users start with maximum privacy:
- Profile Visibility: `PRIVATE`
- All sharing options: `false`

---

## Profile Statistics

### Cached Statistics

To improve performance, key statistics are cached in the user table:

- **totalTrades**: Total number of trades logged
- **winRate**: Percentage of winning trades (0-100)
- **totalPnL**: Total profit/loss across all trades
- **currentStreak**: Current win/loss streak (positive for wins, negative for losses)
- **longestWinStreak**: Longest consecutive winning streak
- **bestTradeDate**: Date of the user's most profitable trade

### Updating Statistics

Statistics are updated automatically when:
1. A new trade is created
2. A trade is updated
3. A trade is deleted
4. User manually triggers recalculation

Call `ProfileStatsService.updateUserStats(userId)` to recalculate all statistics.

---

## Achievement System

### Badge Categories

1. **Trading** - Performance-based achievements
2. **Consistency** - Streak and regularity achievements
3. **Learning** - Journaling and improvement achievements
4. **Milestone** - Quantitative milestones

### Milestone Tracking

Milestones are stored as a JSON object with boolean flags:

```json
{
  "firstTrade": true,
  "trades10": true,
  "trades50": false,
  "winStreak5": true,
  "profitMilestone1000": true
}
```

### Badge Awarding Logic

Badges are automatically awarded when:
1. User's statistics meet badge criteria
2. Milestone hasn't been achieved before
3. Badge hasn't been awarded before

The system prevents duplicate badge awards.

---

## Profile Customization

Users can customize their profile with:

1. **Basic Information**
   - Name
   - Bio (up to 5000 characters)
   - Avatar (URL to image)

2. **Trading Identity**
   - Trading Style (Day Trader, Swing Trader, etc.)
   - Experience Level (Beginner to Expert)

3. **Privacy Preferences**
   - Profile visibility
   - Data sharing controls

4. **Visual Elements**
   - Achievement badges (earned automatically)
   - Trading statistics (updated automatically)

---

## Integration Points

### When Creating/Updating Trades

After any trade operation, update user statistics:

```typescript
import { ProfileStatsService } from './services/profile-stats.service';

// After creating/updating/deleting a trade
await ProfileStatsService.updateUserStats(userId);
```

This will:
1. Recalculate all statistics
2. Check for new badge eligibility
3. Award new badges if criteria met
4. Update cached statistics in database

### Displaying User Profile

```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: {
    id: true,
    email: true,
    name: true,
    bio: true,
    avatar: true,
    tradingStyle: true,
    experienceLevel: true,
    profileVisibility: true,
    shareStats: true,
    totalTrades: true,
    winRate: true,
    totalPnL: true,
    currentStreak: true,
    longestWinStreak: true,
    badges: true,
    milestones: true,
  },
});

// Parse JSON fields
const badges = user.badges as Badge[];
const milestones = user.milestones as Milestones;
```

---

## Next Steps (Task 30.2 & 30.3)

### Task 30.2: Build Profile API

Implement the following endpoints:

1. **GET /api/profile/:userId** - Get user profile
   - Check privacy settings
   - Return public data only if profile is public
   - Return full data if requesting own profile

2. **PUT /api/profile** - Update own profile
   - Validate input data
   - Update profile fields
   - Return updated profile

3. **GET /api/profile/stats/:userId** - Get shareable stats
   - Check if user has enabled stats sharing
   - Return statistics and badges
   - Respect privacy settings

4. **PUT /api/profile/privacy** - Update privacy settings
   - Validate privacy settings
   - Update user preferences
   - Return updated settings

5. **POST /api/profile/avatar** - Upload profile picture
   - Handle file upload
   - Validate image format and size
   - Store image and update avatar URL

### Task 30.3: Build Profile UI

Create the following components:

1. **ProfilePage** - User's own profile view
2. **PublicProfilePage** - Other users' profile view
3. **ProfileEditor** - Edit profile form
4. **PrivacySettings** - Privacy controls
5. **BadgeDisplay** - Show earned badges
6. **StatsCard** - Display profile statistics
7. **MilestoneProgress** - Show progress toward milestones

---

## Testing Recommendations

### Unit Tests

1. Test badge awarding logic
2. Test statistics calculation
3. Test privacy settings validation
4. Test milestone tracking

### Integration Tests

1. Test profile statistics update after trade creation
2. Test badge awarding on milestone achievement
3. Test privacy settings enforcement
4. Test shareable stats API with different privacy settings

### Edge Cases

1. User with no trades
2. User with only losing trades
3. User with perfect win rate
4. Very large trade counts (1000+)
5. Negative P&L values
6. Privacy settings changes

---

## Performance Considerations

1. **Cached Statistics**: Statistics are cached in the user table to avoid expensive calculations on every request

2. **Batch Updates**: When updating multiple trades, call `updateUserStats()` once at the end

3. **JSON Fields**: Badges and milestones use JSON for flexibility, but consider separate tables if querying becomes complex

4. **Indexes**: Consider adding indexes on frequently queried fields:
   - `totalTrades`
   - `winRate`
   - `profileVisibility`

---

## Security Considerations

1. **Privacy Enforcement**: Always check privacy settings before returning user data
2. **Input Validation**: Validate all profile updates (bio length, avatar URL format)
3. **XSS Prevention**: Sanitize bio text before display
4. **Authorization**: Users can only update their own profiles
5. **Rate Limiting**: Implement rate limiting on profile updates and avatar uploads

---

## Summary

✅ **Completed:**
- User profile schema with bio, avatar, trading style, experience level
- Privacy settings with granular controls
- Profile statistics with automatic calculation
- Achievement badge system with 15+ badges
- Milestone tracking system
- Badge awarding service
- Profile statistics service

📋 **Ready for:**
- API endpoint implementation (Task 30.2)
- UI component development (Task 30.3)
- Integration with existing trade system
- Testing and validation

The user profile system foundation is complete and ready for API and UI implementation!
