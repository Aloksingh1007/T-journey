import api from './api';

export interface CommunityPost {
  id: string;
  userId: string;
  postType: 'ACHIEVEMENT' | 'INSIGHT' | 'QUESTION' | 'TRADE_BREAKDOWN';
  title?: string;
  content: string;
  tradeId?: string;
  images: string[];
  likesCount: number;
  commentsCount: number;
  isReported: boolean;
  reportCount: number;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  likes: any[];
  comments: any[];
  user?: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
  };
}

export interface CreatePostData {
  postType: 'ACHIEVEMENT' | 'INSIGHT' | 'QUESTION' | 'TRADE_BREAKDOWN';
  title?: string;
  content: string;
  tradeId?: string;
  images?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  isReported: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  tradingStyle?: string;
  experienceLevel?: string;
  totalTrades: number;
  winRate: number;
  totalPnL?: number;
  currentStreak?: number;
  longestWinStreak?: number;
  badges?: any;
}

export interface LeaderboardEntry extends UserProfile {
  rank: number;
}

class CommunityService {
  // ============ POST MANAGEMENT ============
  
  async createPost(data: CreatePostData): Promise<CommunityPost> {
    const response = await api.post('/community/posts', data);
    return response.data.data;
  }

  async getPost(postId: string): Promise<CommunityPost> {
    const response = await api.get(`/community/posts/${postId}`);
    return response.data.data;
  }

  async updatePost(postId: string, data: Partial<CreatePostData>): Promise<CommunityPost> {
    const response = await api.put(`/community/posts/${postId}`, data);
    return response.data.data;
  }

  async deletePost(postId: string): Promise<void> {
    await api.delete(`/community/posts/${postId}`);
  }

  async getFeed(type: 'following' | 'trending' | 'recent' = 'following', limit: number = 20, offset: number = 0): Promise<CommunityPost[]> {
    const response = await api.get('/community/feed', {
      params: { type, limit, offset },
    });
    return response.data.data;
  }

  // ============ LIKES ============

  async likePost(postId: string): Promise<void> {
    await api.post(`/community/posts/${postId}/like`);
  }

  async unlikePost(postId: string): Promise<void> {
    await api.delete(`/community/posts/${postId}/like`);
  }

  // ============ COMMENTS ============

  async createComment(postId: string, content: string): Promise<Comment> {
    const response = await api.post(`/community/posts/${postId}/comments`, { content });
    return response.data.data;
  }

  async getComments(postId: string, limit: number = 50, offset: number = 0): Promise<Comment[]> {
    const response = await api.get(`/community/posts/${postId}/comments`, {
      params: { limit, offset },
    });
    return response.data.data;
  }

  async deleteComment(commentId: string): Promise<void> {
    await api.delete(`/community/comments/${commentId}`);
  }

  // ============ FOLLOW/UNFOLLOW ============

  async followUser(userId: string): Promise<void> {
    await api.post(`/community/follow/${userId}`);
  }

  async unfollowUser(userId: string): Promise<void> {
    await api.delete(`/community/follow/${userId}`);
  }

  async getFollowers(userId: string, limit: number = 50, offset: number = 0): Promise<UserProfile[]> {
    const response = await api.get(`/community/followers/${userId}`, {
      params: { limit, offset },
    });
    return response.data.data;
  }

  async getFollowing(userId: string, limit: number = 50, offset: number = 0): Promise<UserProfile[]> {
    const response = await api.get(`/community/following/${userId}`, {
      params: { limit, offset },
    });
    return response.data.data;
  }

  async checkFollowStatus(userId: string): Promise<boolean> {
    const response = await api.get(`/community/follow-status/${userId}`);
    return response.data.data.isFollowing;
  }

  // ============ SEARCH & DISCOVERY ============

  async searchUsers(query: string, filters?: {
    tradingStyle?: string;
    experienceLevel?: string;
    limit?: number;
    offset?: number;
  }): Promise<UserProfile[]> {
    const response = await api.get('/community/search', {
      params: { q: query, ...filters },
    });
    return response.data.data;
  }

  async getLeaderboard(
    type: 'trader_score' | 'win_rate' | 'consistency' | 'total_pnl',
    period: 'all_time' | 'monthly' | 'weekly' = 'all_time',
    limit: number = 50
  ): Promise<LeaderboardEntry[]> {
    const response = await api.get('/community/leaderboard', {
      params: { type, period, limit },
    });
    return response.data.data;
  }

  async getSuggestedUsers(limit: number = 10): Promise<UserProfile[]> {
    const response = await api.get('/community/suggested-users', {
      params: { limit },
    });
    return response.data.data;
  }

  // ============ MODERATION ============

  async reportPost(postId: string, reason: string, description?: string): Promise<void> {
    await api.post(`/community/posts/${postId}/report`, { reason, description });
  }
}

export default new CommunityService();
