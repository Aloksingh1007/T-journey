# Notification System Implementation

## Overview

A comprehensive notification system has been implemented for community interactions in the AI Trading Journal. Users receive real-time notifications when other users interact with their posts, comments, or follow them.

## Features Implemented

### Backend

#### 1. Database Schema
- **Notification Model**: Stores all user notifications
  - `id`: Unique identifier
  - `userId`: User who receives the notification
  - `type`: Type of notification (POST_LIKE, POST_COMMENT, NEW_FOLLOWER, etc.)
  - `title`: Notification title
  - `message`: Notification message
  - `actionUrl`: URL to navigate when clicked
  - `isRead`: Read status
  - `metadata`: Additional data (JSON)
  - `createdAt`: Creation timestamp
  - `readAt`: Read timestamp

#### 2. Notification Types
- `POST_LIKE`: When someone likes your post
- `POST_COMMENT`: When someone comments on your post
- `COMMENT_REPLY`: When someone replies to your comment
- `NEW_FOLLOWER`: When someone follows you
- `POST_MENTION`: When someone mentions you in a post
- `ACHIEVEMENT_UNLOCKED`: When you unlock an achievement

#### 3. Notification Service (`backend/src/services/notification.service.ts`)
- `createNotification()`: Create a new notification
- `notifyPostLike()`: Create notification for post like
- `notifyPostComment()`: Create notification for post comment
- `notifyNewFollower()`: Create notification for new follower
- `getUserNotifications()`: Get user's notifications
- `getUnreadCount()`: Get unread notification count
- `markAsRead()`: Mark notification as read
- `markAllAsRead()`: Mark all notifications as read
- `deleteNotification()`: Delete a notification
- `deleteAllRead()`: Delete all read notifications

#### 4. Notification Controller (`backend/src/controllers/notification.controller.ts`)
Handles HTTP requests for notification operations.

#### 5. Notification Routes (`backend/src/routes/notification.routes.ts`)
- `GET /api/notifications`: Get user's notifications
- `GET /api/notifications/unread-count`: Get unread count
- `PUT /api/notifications/:notificationId/read`: Mark as read
- `PUT /api/notifications/mark-all-read`: Mark all as read
- `DELETE /api/notifications/:notificationId`: Delete notification
- `DELETE /api/notifications/read/all`: Delete all read

#### 6. Integration with Community Service
The notification service is automatically triggered when:
- A user likes a post → `notifyPostLike()`
- A user comments on a post → `notifyPostComment()`
- A user follows another user → `notifyNewFollower()`

### Frontend

#### 1. Notification Service (`frontend/src/services/notification.service.ts`)
Client-side service for interacting with notification API.

#### 2. NotificationBell Component (`frontend/src/components/common/NotificationBell.tsx`)
- Displays bell icon with unread count badge
- Opens dropdown on click
- Auto-refreshes unread count every 30 seconds
- Handles click outside to close dropdown

#### 3. NotificationDropdown Component (`frontend/src/components/common/NotificationDropdown.tsx`)
- Shows recent notifications (up to 20)
- Displays notification icon based on type
- Shows relative time (e.g., "2 hours ago")
- Unread indicator (blue dot)
- Delete button on hover
- "Mark all as read" action
- Empty state with helpful message

#### 4. Notifications Page (`frontend/src/pages/Notifications.tsx`)
Full-page view for managing notifications:
- Filter by all/unread
- Mark all as read
- Clear all read notifications
- Delete individual notifications
- Click to navigate to related content
- Loading and empty states

#### 5. Integration with Navbar
The NotificationBell component is integrated into the navbar, appearing next to the user menu.

## Usage

### Backend

```typescript
// Automatically triggered in community service
await notificationService.notifyPostLike(postId, userId);
await notificationService.notifyPostComment(postId, userId, commentContent);
await notificationService.notifyNewFollower(followedUserId, followerId);
```

### Frontend

```typescript
// Get notifications
const notifications = await notificationService.getNotifications(50, 0);

// Get unread count
const count = await notificationService.getUnreadCount();

// Mark as read
await notificationService.markAsRead(notificationId);

// Mark all as read
await notificationService.markAllAsRead();

// Delete notification
await notificationService.deleteNotification(notificationId);
```

## Database Migration

The notification system requires a database migration:

```bash
cd backend
npx prisma migrate dev --name add_notifications
```

This creates:
- `notifications` table
- `NotificationType` enum
- Necessary indexes for performance

## API Endpoints

### Get Notifications
```
GET /api/notifications?limit=50&offset=0
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "POST_LIKE",
      "title": "New Like",
      "message": "John Doe liked your post",
      "actionUrl": "/community/posts/uuid",
      "isRead": false,
      "metadata": { "postId": "uuid", "actorId": "uuid" },
      "createdAt": "2025-12-24T10:00:00Z",
      "readAt": null
    }
  ]
}
```

### Get Unread Count
```
GET /api/notifications/unread-count
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { "count": 5 }
}
```

### Mark as Read
```
PUT /api/notifications/:notificationId/read
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": { /* updated notification */ }
}
```

### Mark All as Read
```
PUT /api/notifications/mark-all-read
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "All notifications marked as read"
}
```

### Delete Notification
```
DELETE /api/notifications/:notificationId
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Notification deleted"
}
```

### Delete All Read
```
DELETE /api/notifications/read/all
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "All read notifications deleted"
}
```

## UI Components

### Notification Bell
- Location: Navbar (top right)
- Badge: Shows unread count (e.g., "5" or "9+")
- Dropdown: Shows recent 20 notifications
- Auto-refresh: Every 30 seconds

### Notification Dropdown
- Icons: Different icons for each notification type
- Time: Relative time display (e.g., "2 hours ago")
- Unread: Blue dot indicator
- Actions: Delete on hover, mark as read on click
- Footer: Link to full notifications page

### Notifications Page
- URL: `/notifications`
- Filters: All / Unread
- Actions: Mark all as read, Clear read notifications
- Individual: Click to navigate, delete button
- Empty state: Helpful message when no notifications

## Performance Considerations

1. **Database Indexes**: Optimized queries with indexes on:
   - `userId` + `isRead`
   - `userId` + `createdAt`
   - `type`

2. **Auto-refresh**: Unread count refreshes every 30 seconds (configurable)

3. **Lazy Loading**: Notifications only fetched when dropdown is opened

4. **Pagination**: Support for limit/offset pagination

5. **Caching**: React Query caches notification data

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for instant notifications
2. **Push Notifications**: Browser push notifications
3. **Email Notifications**: Email digest for important notifications
4. **Notification Preferences**: User settings for notification types
5. **Notification Grouping**: Group similar notifications (e.g., "5 people liked your post")
6. **Rich Notifications**: Include images, avatars, and more context
7. **Notification History**: Archive old notifications
8. **Notification Analytics**: Track notification engagement

## Testing

### Backend Tests
```bash
cd backend
npm test -- notification.service.test.ts
```

### Frontend Tests
```bash
cd frontend
npm test -- NotificationBell.test.tsx
npm test -- NotificationDropdown.test.tsx
npm test -- Notifications.test.tsx
```

## Troubleshooting

### Notifications not appearing
1. Check if migration was applied: `npx prisma migrate status`
2. Verify notification service is triggered in community service
3. Check browser console for errors
4. Verify API endpoints are accessible

### Unread count not updating
1. Check auto-refresh interval (default: 30 seconds)
2. Verify React Query cache invalidation
3. Check network tab for API calls

### Notifications not marked as read
1. Verify user authentication
2. Check notification ownership
3. Verify API response

## Files Created/Modified

### Backend
- `backend/prisma/migrations/20251224000000_add_notifications/migration.sql`
- `backend/prisma/schema.prisma` (modified)
- `backend/src/services/notification.service.ts` (new)
- `backend/src/controllers/notification.controller.ts` (new)
- `backend/src/routes/notification.routes.ts` (new)
- `backend/src/services/community.service.ts` (modified)
- `backend/src/server.ts` (modified)

### Frontend
- `frontend/src/services/notification.service.ts` (new)
- `frontend/src/components/common/NotificationBell.tsx` (new)
- `frontend/src/components/common/NotificationDropdown.tsx` (new)
- `frontend/src/pages/Notifications.tsx` (new)
- `frontend/src/components/layout/Navbar.tsx` (modified)
- `frontend/src/App.tsx` (modified)

## Conclusion

The notification system is fully implemented and integrated with the community features. Users will now receive notifications for likes, comments, and new followers, enhancing engagement and user experience.
