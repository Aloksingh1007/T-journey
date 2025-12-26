import api from './api';

export interface Notification {
  id: string;
  userId: string;
  type: 'POST_LIKE' | 'POST_COMMENT' | 'COMMENT_REPLY' | 'NEW_FOLLOWER' | 'POST_MENTION' | 'ACHIEVEMENT_UNLOCKED';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
  readAt?: string;
}

class NotificationService {
  /**
   * Get user's notifications
   */
  async getNotifications(limit: number = 50, offset: number = 0): Promise<Notification[]> {
    const response = await api.get('/notifications', {
      params: { limit, offset },
    });
    return response.data.data;
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.data.count;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string): Promise<Notification> {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data.data;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/mark-all-read');
  }

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    await api.delete(`/notifications/${notificationId}`);
  }

  /**
   * Delete all read notifications
   */
  async deleteAllRead(): Promise<void> {
    await api.delete('/notifications/read/all');
  }
}

export default new NotificationService();
