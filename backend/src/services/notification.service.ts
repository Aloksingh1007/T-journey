import { NotificationType } from '@prisma/client';
import prisma from '../utils/prisma';

export interface CreateNotificationDTO {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: any;
}

class NotificationService {
  /**
   * Create a new notification
   */
  async createNotification(data: CreateNotificationDTO) {
    const notification = await prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        actionUrl: data.actionUrl,
        metadata: data.metadata,
      },
    });

    return notification;
  }

  /**
   * Create notification for post like
   */
  async notifyPostLike(postId: string, likedBy: string) {
    // Get post details and owner
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: {
        userId: true,
        title: true,
        content: true,
      },
    });

    if (!post || post.userId === likedBy) {
      // Don't notify if post not found or user liked their own post
      return null;
    }

    // Get liker's name
    const liker = await prisma.user.findUnique({
      where: { id: likedBy },
      select: { name: true, email: true },
    });

    const likerName = liker?.name || liker?.email || 'Someone';

    return this.createNotification({
      userId: post.userId,
      type: 'POST_LIKE',
      title: 'New Like',
      message: `${likerName} liked your post`,
      actionUrl: `/community/posts/${postId}`,
      metadata: {
        postId,
        actorId: likedBy,
        actorName: likerName,
      },
    });
  }

  /**
   * Create notification for post comment
   */
  async notifyPostComment(postId: string, commentedBy: string, commentContent: string) {
    // Get post details and owner
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      select: {
        userId: true,
        title: true,
        content: true,
      },
    });

    if (!post || post.userId === commentedBy) {
      // Don't notify if post not found or user commented on their own post
      return null;
    }

    // Get commenter's name
    const commenter = await prisma.user.findUnique({
      where: { id: commentedBy },
      select: { name: true, email: true },
    });

    const commenterName = commenter?.name || commenter?.email || 'Someone';
    const preview = commentContent.length > 50 
      ? commentContent.substring(0, 50) + '...' 
      : commentContent;

    return this.createNotification({
      userId: post.userId,
      type: 'POST_COMMENT',
      title: 'New Comment',
      message: `${commenterName} commented: "${preview}"`,
      actionUrl: `/community/posts/${postId}`,
      metadata: {
        postId,
        actorId: commentedBy,
        actorName: commenterName,
        commentPreview: preview,
      },
    });
  }

  /**
   * Create notification for new follower
   */
  async notifyNewFollower(followedUserId: string, followerId: string) {
    if (followedUserId === followerId) {
      // Don't notify if somehow user followed themselves
      return null;
    }

    // Get follower's name
    const follower = await prisma.user.findUnique({
      where: { id: followerId },
      select: { name: true, email: true },
    });

    const followerName = follower?.name || follower?.email || 'Someone';

    return this.createNotification({
      userId: followedUserId,
      type: 'NEW_FOLLOWER',
      title: 'New Follower',
      message: `${followerName} started following you`,
      actionUrl: `/profile/${followerId}`,
      metadata: {
        actorId: followerId,
        actorName: followerName,
      },
    });
  }

  /**
   * Get user's notifications
   */
  async getUserNotifications(userId: string, limit: number = 50, offset: number = 0) {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return notifications;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const count = await prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return count;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string) {
    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return updated;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string) {
    await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true };
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string, userId: string) {
    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new Error('Notification not found or unauthorized');
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  }

  /**
   * Delete all read notifications
   */
  async deleteAllRead(userId: string) {
    await prisma.notification.deleteMany({
      where: {
        userId,
        isRead: true,
      },
    });

    return { success: true };
  }
}

export default new NotificationService();
