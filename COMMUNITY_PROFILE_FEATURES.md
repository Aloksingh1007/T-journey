# Community & Profile Features - Phase 3F

## Overview
Transform the AI Trading Journal into a social platform where traders can connect, learn from each other, and share their journey. This creates a supportive community while maintaining privacy and data security.

---

## 1. User Profile System

### Profile Components

#### Public Profile Information
- **Basic Info**:
  - Username (unique)
  - Display name
  - Profile picture/avatar
  - Bio (max 500 characters)
  - Trading since (date)
  - Location (optional)
  
- **Trading Style**:
  - Primary markets (Crypto, Stocks, Futures, Options)
  - Trading timeframe (Day trader, Swing trader, Position trader)
  - Experience level (Beginner, Intermediate, Advanced, Expert)
  - Favorite strategies (tags)

- **Shareable Statistics** (Privacy controlled):
  - Trader Score & Level
  - Win Rate
  - Total Trades
  - Trading Streak
  - Achievements & Badges
  - Monthly P&L Chart (anonymized amounts)
  - Emotion Distribution Chart
  - Best Trading Days (day of week)

#### Private Profile Information
- Email (never shared)
- Full trade history
- Detailed P&L amounts
- Personal notes and reflections
- AI insights and coaching

### Privacy Settings

**Granular Control**:
- Profile visibility (Public, Friends Only, Private)
- Show/Hide specific stats
- Share trade count only (hide P&L)
- Share win rate only
- Share emotional patterns
- Share trading patterns
- Allow/Disallow followers
- Allow/Disallow messages

**Data Sharing Levels**:
1. **Public**: Anyone can see
2. **Followers**: Only people who follow you
3. **Following**: Only people you follow
4. **Friends**: Mutual followers
5. **Private**: Only you

---

## 2. Community Features

### Community Feed

**Post Types**:
1. **Achievement Post**
   - Celebrate milestones (100 trades, level up, winning streak)
   - Auto-generated with shareable card
   - Includes achievement badge

2. **Trade Breakdown Post**
   - Share a specific trade (anonymized or detailed)
   - Include chart screenshot
   - Add analysis and lessons learned
   - Tag strategy used

3. **Insight Post**
   - Share trading wisdom
   - Discuss market conditions
   - Ask questions
   - Share resources

4. **Journal Entry Post**
   - Share daily/weekly reflections
   - Discuss emotional challenges
   - Celebrate progress

**Post Features**:
- Text content (max 2000 characters)
- Image attachments (up to 4)
- Trade reference (link to specific trade)
- Tags/hashtags
- Mentions (@username)
- Like/Unlike
- Comment system (nested replies)
- Share/Repost
- Report/Flag inappropriate content

### Feed Algorithm

**Feed Types**:
1. **Following Feed**: Posts from people you follow
2. **Trending Feed**: Most liked/commented posts (24h)
3. **Recent Feed**: Latest posts from community
4. **Recommended Feed**: AI-suggested posts based on your interests

**Ranking Factors**:
- Recency
- Engagement (likes, comments, shares)
- User's trading style match
- User's level match
- Content quality (AI moderation)

### User Search & Discovery

**Search Filters**:
- Username/Display name
- Trading style (Day trader, Swing trader, etc.)
- Experience level
- Trader score range
- Win rate range
- Markets traded
- Location
- Active in last X days

**Discovery Features**:
- **Suggested Traders**: Based on similar trading style
- **Top Performers**: Highest trader scores
- **Most Followed**: Popular traders
- **Rising Stars**: Rapidly improving traders
- **Similar to You**: Traders with similar patterns

### Leaderboards

**Leaderboard Categories**:
1. **Overall Trader Score**: Top 100 traders by score
2. **Win Rate Leaders**: Highest win rates (min 50 trades)
3. **Consistency Champions**: Most consistent traders
4. **Discipline Masters**: Highest discipline scores
5. **Learning Leaders**: Best learning scores
6. **Emotional Intelligence**: Best EQ scores
7. **Most Improved**: Biggest score improvements (30 days)
8. **Streak Leaders**: Longest winning streaks

**Leaderboard Features**:
- Filter by timeframe (All-time, This Month, This Week)
- Filter by market type
- Filter by experience level
- Opt-in/Opt-out of leaderboards
- Anonymous mode (show rank without name)

### Follow System

**Features**:
- Follow/Unfollow users
- See follower count
- See following count
- View followers list
- View following list
- Mutual followers (Friends)
- Follow suggestions
- Follow notifications

**Follow Benefits**:
- See their posts in your feed
- Get notified of achievements
- Access to "Followers Only" content
- Ability to send direct messages (future)

---

## 3. Shareable Content

### Shareable Trade Cards

**Features**:
- Beautiful card design with gradient
- Trade summary (instrument, direction, outcome)
- P&L (optional, can anonymize)
- Key lesson learned
- Emotional state
- QR code for profile link
- Watermark with app branding

**Export Options**:
- PNG image
- PDF
- Share link
- Copy to clipboard
- Share to social media

### Shareable Achievement Badges

**Badge Types**:
- Level up badges (Novice → Master)
- Milestone badges (10, 50, 100, 500, 1000 trades)
- Streak badges (5, 10, 20 day streaks)
- Score badges (Score 50, 70, 90)
- Special badges (Perfect Week, Comeback King, etc.)

**Badge Features**:
- Animated badge reveal
- Shareable image
- Display on profile
- Badge collection page
- Rarity indicators

### Shareable Reports

**Monthly Trading Report**:
- Summary statistics
- Best/worst trades
- Emotional insights
- AI coaching summary
- Progress charts
- Shareable link or PDF

**Custom Stat Cards**:
- Create custom stat visualizations
- Choose metrics to display
- Choose color theme
- Add personal message
- Share on social media

---

## 4. Community Guidelines & Moderation

### Community Rules

1. **Be Respectful**: No harassment, hate speech, or personal attacks
2. **No Financial Advice**: Share experiences, not recommendations
3. **Protect Privacy**: Don't share others' personal information
4. **No Spam**: No promotional content or excessive posting
5. **Authentic Content**: No fake trades or misleading information
6. **No Market Manipulation**: No pump & dump schemes
7. **Age Appropriate**: Keep content professional

### Moderation System

**Automated Moderation**:
- AI content filtering (profanity, spam)
- Duplicate post detection
- Suspicious activity detection
- Rate limiting (max posts per day)

**User Reporting**:
- Report post/comment
- Report user
- Block user
- Mute user

**Admin Actions**:
- Warning
- Temporary suspension
- Permanent ban
- Content removal
- Account review

---

## 5. Technical Implementation

### Database Schema

**User Profile Table**:
```sql
- id (UUID)
- userId (FK to User)
- username (unique)
- displayName
- bio
- avatar
- tradingSince
- location
- tradingStyle
- experienceLevel
- favoriteStrategies (JSON)
- privacySettings (JSON)
- createdAt
- updatedAt
```

**Community Post Table**:
```sql
- id (UUID)
- userId (FK to User)
- postType (achievement, trade, insight, journal)
- content (text)
- images (JSON array)
- tradeId (FK to Trade, optional)
- tags (JSON array)
- likesCount
- commentsCount
- sharesCount
- createdAt
- updatedAt
```

**Post Like Table**:
```sql
- id (UUID)
- postId (FK to Post)
- userId (FK to User)
- createdAt
```

**Post Comment Table**:
```sql
- id (UUID)
- postId (FK to Post)
- userId (FK to User)
- parentCommentId (FK to Comment, for replies)
- content (text)
- likesCount
- createdAt
- updatedAt
```

**Follow Table**:
```sql
- id (UUID)
- followerId (FK to User)
- followingId (FK to User)
- createdAt
```

**Achievement Badge Table**:
```sql
- id (UUID)
- userId (FK to User)
- badgeType
- badgeName
- earnedAt
- isDisplayed (boolean)
```

### API Endpoints

**Profile APIs**:
- `GET /api/profile/:userId` - Get user profile
- `PUT /api/profile` - Update own profile
- `POST /api/profile/avatar` - Upload avatar
- `GET /api/profile/stats/:userId` - Get shareable stats
- `PUT /api/profile/privacy` - Update privacy settings

**Community APIs**:
- `POST /api/community/posts` - Create post
- `GET /api/community/feed` - Get feed (with filters)
- `GET /api/community/posts/:id` - Get single post
- `PUT /api/community/posts/:id` - Update post
- `DELETE /api/community/posts/:id` - Delete post
- `POST /api/community/posts/:id/like` - Like post
- `DELETE /api/community/posts/:id/like` - Unlike post
- `POST /api/community/posts/:id/comment` - Add comment
- `GET /api/community/posts/:id/comments` - Get comments

**Search & Discovery APIs**:
- `GET /api/community/search` - Search users
- `GET /api/community/leaderboard` - Get leaderboard
- `GET /api/community/suggested` - Get suggested users
- `GET /api/community/trending` - Get trending posts

**Follow APIs**:
- `POST /api/community/follow/:userId` - Follow user
- `DELETE /api/community/follow/:userId` - Unfollow user
- `GET /api/community/followers/:userId` - Get followers
- `GET /api/community/following/:userId` - Get following
- `GET /api/community/friends` - Get mutual followers

**Share APIs**:
- `POST /api/share/trade/:id` - Generate shareable trade card
- `POST /api/share/badge/:id` - Generate shareable badge
- `POST /api/share/report` - Generate monthly report
- `GET /api/share/:shareId` - View shared content

---

## 6. UI Components

### Profile Components
- `ProfilePage.tsx` - Own profile view
- `PublicProfilePage.tsx` - Other user's profile
- `ProfileEditor.tsx` - Edit profile form
- `ProfileStats.tsx` - Statistics display
- `PrivacySettings.tsx` - Privacy controls
- `AvatarUpload.tsx` - Avatar upload component
- `BadgeCollection.tsx` - Display earned badges

### Community Components
- `CommunityPage.tsx` - Main community page
- `CommunityFeed.tsx` - Post feed
- `PostCard.tsx` - Individual post display
- `CreatePostModal.tsx` - Create new post
- `PostComments.tsx` - Comments section
- `UserSearchPage.tsx` - Search interface
- `LeaderboardPage.tsx` - Leaderboards display
- `SuggestedUsers.tsx` - User suggestions
- `FollowButton.tsx` - Follow/Unfollow button
- `UserCard.tsx` - User preview card

### Shareable Components
- `ShareableTradeCard.tsx` - Trade card generator
- `ShareableBadge.tsx` - Badge card generator
- `ShareModal.tsx` - Share options modal
- `MonthlyReport.tsx` - Report generator
- `QRCodeGenerator.tsx` - QR code component

---

## 7. Success Metrics

### Engagement Metrics
- Daily active users
- Posts per day
- Comments per post
- Likes per post
- Follow rate
- Profile views
- Search queries

### Community Health
- User retention rate
- Average session duration
- Posts per user per week
- Comment rate
- Report rate (should be low)
- User satisfaction score

### Feature Adoption
- % users with public profiles
- % users following others
- % users posting content
- % users engaging (likes/comments)
- % users on leaderboards

---

## 8. Privacy & Security

### Data Protection
- End-to-end encryption for private data
- Secure avatar storage (CDN)
- Rate limiting on API calls
- GDPR compliance
- Data export functionality
- Account deletion with data cleanup

### Content Moderation
- AI-powered content filtering
- User reporting system
- Admin moderation dashboard
- Automated spam detection
- Suspicious activity alerts

### User Safety
- Block/Mute functionality
- Report abuse
- Privacy controls
- Age verification
- Terms of service acceptance

---

## 9. Future Enhancements

### Phase 4 Ideas
- Direct messaging between users
- Trading groups/communities
- Live trading sessions
- Mentorship program
- Trading challenges/competitions
- Video content support
- Voice notes
- Trading journal templates sharing
- Strategy marketplace
- Educational content hub

---

**Status**: 📋 PLANNED - Phase 3F
**Timeline**: Week 11-12 of Phase 3
**Dependencies**: User authentication, Trader Score System, Profile system
**Priority**: High - Adds social dimension to platform
