# Profile Stats & Avatar Fix Guide

## Issues Fixed

### 1. ✅ Avatar Image Not Displaying
**Problem:** Uploaded avatar images were not showing because the URL path was incomplete.

**Solution:** Added a helper function to construct the full avatar URL by prepending the backend URL.

**Files Modified:**
- `frontend/src/pages/Profile.tsx` - Added `getAvatarUrl()` helper
- `frontend/src/components/profile/ShareableStatsCard.tsx` - Added `getAvatarUrl()` helper

**How it works:**
```typescript
const getAvatarUrl = (avatarPath?: string) => {
  if (!avatarPath) return null;
  if (avatarPath.startsWith('http')) return avatarPath;
  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
  return `${backendUrl}${avatarPath}`;
};
```

### 2. ✅ Profile Stats Showing 0 Trades
**Problem:** Profile statistics were not being calculated from actual trades.

**Solution:** Added a "Refresh Stats" button that triggers the backend stats recalculation.

**Files Modified:**
- `frontend/src/services/profile.service.ts` - Added `recalculateStats()` function
- `frontend/src/pages/Profile.tsx` - Added refresh button and mutation

**How to use:**
1. Go to your Profile page
2. Click on the "Statistics" tab
3. Click the "Refresh Stats" button (top right)
4. Your stats will be recalculated from all your trades

## How Stats Are Calculated

The backend automatically calculates stats when:
- ✅ A new trade is created
- ✅ A trade is updated
- ✅ A trade is deleted
- ✅ User manually clicks "Refresh Stats"

Stats include:
- Total Trades
- Win Rate (%)
- Total P&L
- Current Streak (winning or losing)
- Longest Win Streak
- Best Trading Day

## Testing the Fixes

### Test Avatar Display:
1. Go to Profile page
2. Click "Edit Profile"
3. Upload a new avatar image
4. Click "Upload"
5. Avatar should now display correctly in:
   - Profile header
   - Shareable stats cards

### Test Stats Recalculation:
1. Make sure you have some trades in the system
2. Go to Profile page
3. Click "Statistics" tab
4. Click "Refresh Stats" button
5. Stats should update to reflect your actual trades

### Test Shareable Stats:
1. Go to Profile page
2. Make sure "Share Stats" is enabled in Settings tab
3. Click "Share Profile" button
4. Select a card style (Overview, Performance, or Achievements)
5. Verify:
   - Avatar displays correctly
   - Stats show your actual data
   - All numbers are accurate

## Environment Variables

Make sure your `.env` file in the frontend has:
```
VITE_API_URL=http://localhost:5000/api
```

This is used to construct the full avatar URL.

## Backend Configuration

The backend serves uploaded files from:
```
/uploads -> backend/uploads/
```

Make sure the `backend/uploads` directory exists and has write permissions.

## Troubleshooting

### Avatar Still Not Showing?

1. **Check if file was uploaded:**
   - Look in `backend/uploads/` folder
   - File should be there with a unique name

2. **Check backend logs:**
   - Look for any upload errors
   - Verify the file path in the database

3. **Check browser console:**
   - Look for 404 errors on image requests
   - Verify the full URL being requested

4. **Check CORS settings:**
   - Make sure backend allows requests from frontend origin

### Stats Still Showing 0?

1. **Verify you have trades:**
   - Go to Trades page
   - Make sure you have at least one trade

2. **Click Refresh Stats:**
   - Go to Profile > Statistics tab
   - Click "Refresh Stats" button
   - Wait for success message

3. **Check backend logs:**
   - Look for any errors during stats calculation
   - Verify trades are being fetched correctly

4. **Check database:**
   - Verify trades exist in the database
   - Check if user ID matches

### Shareable Stats Not Working?

1. **Enable stats sharing:**
   - Go to Profile > Settings tab
   - Make sure "Share Statistics" is enabled
   - Click "Save Changes"

2. **Try again:**
   - Click "Share Profile" button
   - Should now open the modal

3. **Check privacy settings:**
   - Profile Visibility should not be "Private"
   - Or "Share Stats" should be enabled

## New Features Added

### 1. Refresh Stats Button
- Location: Profile > Statistics tab (top right)
- Function: Manually triggers stats recalculation
- Visual feedback: Spinning icon while loading
- Toast notification on success/error

### 2. Avatar URL Helper
- Automatically constructs full avatar URLs
- Works with both relative and absolute paths
- Consistent across all components

### 3. Improved Error Handling
- Clear error messages for privacy issues
- User-friendly toast notifications
- Actionable error messages

## API Endpoints Used

### Profile Stats:
- `GET /api/profile/:userId` - Get user profile with stats
- `POST /api/profile/recalculate-stats` - Manually recalculate stats
- `GET /api/profile/stats/:userId` - Get shareable stats

### Avatar:
- `POST /api/profile/avatar` - Upload avatar image
- `GET /uploads/:filename` - Serve uploaded images

## Code Changes Summary

### Frontend Changes:
1. Added `getAvatarUrl()` helper in Profile.tsx
2. Added `getAvatarUrl()` helper in ShareableStatsCard.tsx
3. Added `recalculateStats()` function in profile.service.ts
4. Added refresh button with mutation in Profile.tsx
5. Imported `RefreshCw` icon and `useMutation` hook

### Backend Changes:
None required - all functionality already exists!

## Next Steps

1. **Test the fixes:**
   - Upload a new avatar
   - Click "Refresh Stats"
   - Try sharing your profile

2. **Verify data:**
   - Check that stats match your actual trades
   - Verify avatar displays everywhere

3. **Report any issues:**
   - If problems persist, check the troubleshooting section
   - Look at browser console and backend logs

## Success Indicators

✅ Avatar displays in profile header
✅ Avatar displays in shareable cards
✅ Stats show actual trade data (not 0)
✅ "Refresh Stats" button works
✅ Shareable stats cards show correct data
✅ No console errors
✅ No 404 errors for images

## Additional Notes

- Stats are automatically updated when trades are created/updated/deleted
- Manual refresh is only needed if stats seem out of sync
- Avatar images are stored in `backend/uploads/` directory
- All uploaded images are served statically by Express
- Privacy settings are respected in shareable stats
