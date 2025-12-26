# Testing Public Profile Page

## How to Test

### 1. Access Your Own Public Profile
1. Log in to the application
2. Go to your profile page (`/profile`)
3. Note your user ID from the URL or profile data
4. Navigate to `/profile/{your-user-id}`
5. You should see your profile in "public view" mode (read-only)

### 2. Test Privacy Settings

#### Test Private Profile
1. Go to your profile settings
2. Set "Profile Visibility" to "Private"
3. Copy your profile URL
4. Open in incognito/private browser window (or different user)
5. Should see: "Private Profile" message with lock icon

#### Test Public Profile with Stats Hidden
1. Set "Profile Visibility" to "Public"
2. Disable "Share Statistics"
3. View your public profile
4. Should see: Profile info and badges, but stats section shows lock message

#### Test Fully Public Profile
1. Set "Profile Visibility" to "Public"
2. Enable all sharing options (Stats, Trades, Emotions, Patterns)
3. View your public profile
4. Should see: All information including statistics

### 3. Test Navigation

#### Back Button
1. Navigate to a public profile
2. Click "Back" button
3. Should return to previous page

#### Share Button
1. View a public profile with stats enabled
2. Click "Share Profile" button
3. Should open shareable stats modal
4. Test copying link and stats text

### 4. Test Tabs

#### Overview Tab
- Should show trading style and experience level
- Should show recent achievements (up to 6)
- Should show member since date

#### Statistics Tab (if shared)
- Should show longest win streak
- Should show best trading day
- Should show win rate progress bar

#### Badges Tab
- Should show all earned badges
- Should show badge details (name, description, date)
- Should show empty state if no badges

### 5. Test Error Handling

#### Non-existent User
1. Navigate to `/profile/invalid-user-id-12345`
2. Should show: "Profile Not Found" error message
3. Should have button to return to dashboard

#### Network Error
1. Disconnect internet
2. Try to load a profile
3. Should show appropriate error message

### 6. Test Responsive Design

#### Desktop (1920x1080)
- Profile header should show full width
- Stats should be in 4-column grid
- Badges should be in 3-column grid

#### Tablet (768x1024)
- Layout should adjust appropriately
- Grids should stack or reduce columns

#### Mobile (375x667)
- Single column layout
- Stats should stack vertically
- Tabs should be scrollable if needed

## Expected Behavior

### Public Profile Features
✅ Shows user avatar and cover image
✅ Shows name, bio, trading style, experience level
✅ Shows statistics (if privacy allows)
✅ Shows badges and achievements
✅ Shows member since date
✅ Respects all privacy settings
✅ Provides share functionality
✅ Has back navigation
✅ Has tab-based content organization

### Privacy Protections
✅ Private profiles show lock message
✅ Hidden stats show lock indicator
✅ Only shared data is visible
✅ No edit buttons (read-only view)
✅ Share button respects privacy settings

### User Experience
✅ Smooth loading states
✅ Clear error messages
✅ Intuitive navigation
✅ Consistent design with app
✅ Responsive on all devices

## Common Issues & Solutions

### Issue: "Profile Not Found"
**Cause**: Invalid user ID or user doesn't exist
**Solution**: Verify the user ID is correct

### Issue: "Private Profile" message
**Cause**: User has set profile to private
**Solution**: This is expected behavior - respect user privacy

### Issue: Stats not showing
**Cause**: User has disabled stats sharing
**Solution**: This is expected - check privacy settings

### Issue: Share button shows error
**Cause**: Stats sharing is disabled
**Solution**: Enable stats sharing in privacy settings

## API Endpoints Used

1. `GET /api/profile/:userId` - Fetch user profile
2. `GET /api/profile/stats/:userId` - Fetch shareable stats

## Component Dependencies

- `getUserProfile()` from profile.service
- `getShareableStats()` from profile.service
- `ShareableStatsCard` component
- `Button`, `toast` UI components
- React Router for navigation
- React Query for data fetching

## Success Criteria

✅ Public profiles load correctly
✅ Privacy settings are respected
✅ Navigation works smoothly
✅ Share functionality works
✅ Error states are handled gracefully
✅ Responsive design works on all devices
✅ No TypeScript errors
✅ Build completes successfully

---

**Test Status**: Ready for testing
**Last Updated**: December 2, 2025
