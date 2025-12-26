/**
 * Test script for notification system
 * 
 * This script tests the notification system by:
 * 1. Creating test notifications
 * 2. Retrieving notifications
 * 3. Marking notifications as read
 * 4. Deleting notifications
 * 
 * Run with: npx ts-node test-notification-system.ts
 */

import prisma from './src/utils/prisma';
import notificationService from './src/services/notification.service';

async function testNotificationSystem() {
  console.log('🧪 Testing Notification System...\n');

  try {
    // Get a test user (or create one)
    let testUser = await prisma.user.findFirst();
    
    if (!testUser) {
      console.log('❌ No users found in database. Please create a user first.');
      return;
    }

    console.log(`✅ Using test user: ${testUser.email}\n`);

    // Test 1: Create a notification
    console.log('Test 1: Creating a notification...');
    const notification = await notificationService.createNotification({
      userId: testUser.id,
      type: 'POST_LIKE',
      title: 'Test Notification',
      message: 'This is a test notification',
      actionUrl: '/test',
      metadata: { test: true },
    });
    console.log(`✅ Created notification: ${notification.id}\n`);

    // Test 2: Get user notifications
    console.log('Test 2: Retrieving user notifications...');
    const notifications = await notificationService.getUserNotifications(testUser.id, 10, 0);
    console.log(`✅ Retrieved ${notifications.length} notifications\n`);

    // Test 3: Get unread count
    console.log('Test 3: Getting unread count...');
    const unreadCount = await notificationService.getUnreadCount(testUser.id);
    console.log(`✅ Unread count: ${unreadCount}\n`);

    // Test 4: Mark as read
    console.log('Test 4: Marking notification as read...');
    const updatedNotification = await notificationService.markAsRead(notification.id, testUser.id);
    console.log(`✅ Marked as read: ${updatedNotification.isRead}\n`);

    // Test 5: Get unread count again
    console.log('Test 5: Getting unread count after marking as read...');
    const newUnreadCount = await notificationService.getUnreadCount(testUser.id);
    console.log(`✅ New unread count: ${newUnreadCount}\n`);

    // Test 6: Delete notification
    console.log('Test 6: Deleting notification...');
    await notificationService.deleteNotification(notification.id, testUser.id);
    console.log(`✅ Deleted notification\n`);

    // Test 7: Verify deletion
    console.log('Test 7: Verifying deletion...');
    const finalNotifications = await notificationService.getUserNotifications(testUser.id, 10, 0);
    const deletedNotification = finalNotifications.find(n => n.id === notification.id);
    if (!deletedNotification) {
      console.log(`✅ Notification successfully deleted\n`);
    } else {
      console.log(`❌ Notification still exists\n`);
    }

    console.log('✅ All tests passed!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testNotificationSystem();
