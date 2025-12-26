import { PostType } from '@prisma/client';
import prisma from '../utils/prisma';
import notificationService from './notification.service';

export interface CreatePostDTO {
  userId: string;
  postType: PostType;
  title?: string;
  content: string;
  tradeId?: string;
  images?: string[];
}

export interface UpdatePostDTO {
  title?: string;
  content?: string;
  images?: string[];
}

export interface CreateCommentDTO {
  userId: string;
  postId: string;
  content: string;
}

export interface SearchUsersQuery {
  query?: string;
  tradingStyle?: string;
  experienceLevel?: string;
  limit?: number;
  offset?: number;
}

export interface LeaderboardQuery {
  type: 'trader_score' | 'win_rate' | 'consistency' | 'total_pnl';
  period?: 'all_time' | 'monthly' | 'weekly';
  limit?: number;
}

class CommunityService {
  // ============ POST MANAGEMENT ============
  
  async createPost(data: CreatePostDTO) {
    const post = await prisma.communityPost.create({
      data: {
        userId: data.userId,
        postType: data.postType,
        title: data.title,
        content: data.content,
        tradeId: data.tradeId,
        images: data.images || [],
      },
      include: {
        likes: true,
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return post;
  }

  async getPost(postId: string) {
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
      include: {
        likes: true,
        comments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return post;
  }

  async updatePost(postId: string, userId: string, data: UpdatePostDTO) {
    // Verify ownership
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      throw new Error('Post not found or unauthorized');
    }

    const updatedPost = await prisma.communityPost.update({
      where: { id: postId },
      data: {
        title: data.title,
        content: data.content,
        images: data.images,
      },
      include: {
        likes: true,
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    return updatedPost;
  }

  async deletePost(postId: string, userId: string) {
    // Verify ownership
    const post = await prisma.communityPost.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== userId) {
      throw new Error('Post not found or unauthorized');
    }

    await prisma.communityPost.delete({
      where: { id: postId },
    });

    return { success: true };
  }

  async getFeed(userId: string, limit: number = 20, offset: number = 0) {
    // Get posts from users the current user follows, plus their own posts
    const following = await prisma.userFollow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId); // Include own posts

    const posts = await prisma.communityPost.findMany({
      where: {
        userId: { in: followingIds },
        isHidden: false,
      },
      include: {
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Fetch user data for all posts
    const userIds = [...new Set(posts.map(p => p.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    // Map user data to posts
    const postsWithUsers = posts.map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        user: user || { id: post.userId, name: null, email: 'Unknown', avatar: null },
      };
    });

    return postsWithUsers;
  }

  async getTrendingPosts(limit: number = 20, offset: number = 0) {
    // Get posts with most engagement in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const posts = await prisma.communityPost.findMany({
      where: {
        isHidden: false,
        createdAt: { gte: sevenDaysAgo },
      },
      include: {
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: [
        { likesCount: 'desc' },
        { commentsCount: 'desc' },
      ],
      take: limit,
      skip: offset,
    });

    // Fetch user data for all posts
    const userIds = [...new Set(posts.map(p => p.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    // Map user data to posts
    const postsWithUsers = posts.map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        user: user || { id: post.userId, name: null, email: 'Unknown', avatar: null },
      };
    });

    return postsWithUsers;
  }

  async getRecentPosts(limit: number = 20, offset: number = 0) {
    const posts = await prisma.communityPost.findMany({
      where: {
        isHidden: false,
      },
      include: {
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Fetch user data for all posts
    const userIds = [...new Set(posts.map(p => p.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    // Map user data to posts
    const postsWithUsers = posts.map(post => {
      const user = users.find(u => u.id === post.userId);
      return {
        ...post,
        user: user || { id: post.userId, name: null, email: 'Unknown', avatar: null },
      };
    });

    return postsWithUsers;
  }

  // ============ LIKES ============

  async likePost(postId: string, userId: string) {
    // Check if already liked
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      return { success: true, message: 'Already liked' };
    }

    // Create like and increment count
    await prisma.$transaction([
      prisma.postLike.create({
        data: {
          postId,
          userId,
        },
      }),
      prisma.communityPost.update({
        where: { id: postId },
        data: {
          likesCount: { increment: 1 },
        },
      }),
    ]);

    // Create notification for post owner
    await notificationService.notifyPostLike(postId, userId);

    return { success: true, message: 'Post liked' };
  }

  async unlikePost(postId: string, userId: string) {
    const existingLike = await prisma.postLike.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!existingLike) {
      return { success: true, message: 'Not liked' };
    }

    // Delete like and decrement count
    await prisma.$transaction([
      prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId,
          },
        },
      }),
      prisma.communityPost.update({
        where: { id: postId },
        data: {
          likesCount: { decrement: 1 },
        },
      }),
    ]);

    return { success: true, message: 'Post unliked' };
  }

  // ============ COMMENTS ============

  async createComment(data: CreateCommentDTO) {
    const comment = await prisma.$transaction(async (tx) => {
      const newComment = await tx.postComment.create({
        data: {
          postId: data.postId,
          userId: data.userId,
          content: data.content,
        },
      });

      await tx.communityPost.update({
        where: { id: data.postId },
        data: {
          commentsCount: { increment: 1 },
        },
      });

      return newComment;
    });

    // Create notification for post owner
    await notificationService.notifyPostComment(data.postId, data.userId, data.content);

    return comment;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await prisma.postComment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== userId) {
      throw new Error('Comment not found or unauthorized');
    }

    await prisma.$transaction([
      prisma.postComment.delete({
        where: { id: commentId },
      }),
      prisma.communityPost.update({
        where: { id: comment.postId },
        data: {
          commentsCount: { decrement: 1 },
        },
      }),
    ]);

    return { success: true };
  }

  async getComments(postId: string, limit: number = 50, offset: number = 0) {
    const comments = await prisma.postComment.findMany({
      where: {
        postId,
        isHidden: false,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    return comments;
  }

  // ============ FOLLOW/UNFOLLOW ============

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new Error('Cannot follow yourself');
    }

    // Check if already following
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (existingFollow) {
      return { success: true, message: 'Already following' };
    }

    await prisma.userFollow.create({
      data: {
        followerId,
        followingId,
      },
    });

    // Create notification for followed user
    await notificationService.notifyNewFollower(followingId, followerId);

    return { success: true, message: 'User followed' };
  }

  async unfollowUser(followerId: string, followingId: string) {
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    if (!existingFollow) {
      return { success: true, message: 'Not following' };
    }

    await prisma.userFollow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return { success: true, message: 'User unfollowed' };
  }

  async getFollowers(userId: string, limit: number = 50, offset: number = 0) {
    const followers = await prisma.userFollow.findMany({
      where: { followingId: userId },
      select: {
        followerId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Get user details for each follower
    const followerIds = followers.map((f) => f.followerId);
    const users = await prisma.user.findMany({
      where: { id: { in: followerIds } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        tradingStyle: true,
        experienceLevel: true,
        totalTrades: true,
        winRate: true,
      },
    });

    return users;
  }

  async getFollowing(userId: string, limit: number = 50, offset: number = 0) {
    const following = await prisma.userFollow.findMany({
      where: { followerId: userId },
      select: {
        followingId: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });

    // Get user details for each following
    const followingIds = following.map((f) => f.followingId);
    const users = await prisma.user.findMany({
      where: { id: { in: followingIds } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        tradingStyle: true,
        experienceLevel: true,
        totalTrades: true,
        winRate: true,
      },
    });

    return users;
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await prisma.userFollow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });

    return !!follow;
  }

  // ============ USER SEARCH ============

  async searchUsers(query: SearchUsersQuery) {
    const { query: searchQuery, tradingStyle, experienceLevel, limit = 20, offset = 0 } = query;

    const where: any = {
      profileVisibility: 'PUBLIC',
    };

    if (searchQuery) {
      where.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
      ];
    }

    if (tradingStyle) {
      where.tradingStyle = tradingStyle;
    }

    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        tradingStyle: true,
        experienceLevel: true,
        totalTrades: true,
        winRate: true,
        totalPnL: true,
        currentStreak: true,
        badges: true,
      },
      orderBy: [
        { totalTrades: 'desc' },
        { winRate: 'desc' },
      ],
      take: limit,
      skip: offset,
    });

    return users;
  }

  // ============ LEADERBOARDS ============

  async getLeaderboard(query: LeaderboardQuery) {
    const { type, limit = 50 } = query;
    // Note: period filtering will be implemented when we have time-based leaderboard entries

    // For now, we'll calculate leaderboards on the fly
    // In production, these should be pre-calculated and cached
    let orderBy: any = {};

    switch (type) {
      case 'trader_score':
        // Assuming trader score is calculated from multiple factors
        orderBy = [
          { winRate: 'desc' },
          { totalTrades: 'desc' },
        ];
        break;
      case 'win_rate':
        orderBy = { winRate: 'desc' };
        break;
      case 'consistency':
        orderBy = { longestWinStreak: 'desc' };
        break;
      case 'total_pnl':
        orderBy = { totalPnL: 'desc' };
        break;
    }

    const users = await prisma.user.findMany({
      where: {
        profileVisibility: 'PUBLIC',
        totalTrades: { gt: 0 }, // Only users with trades
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        tradingStyle: true,
        experienceLevel: true,
        totalTrades: true,
        winRate: true,
        totalPnL: true,
        currentStreak: true,
        longestWinStreak: true,
        badges: true,
      },
      orderBy,
      take: limit,
    });

    // Add rank to each user
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return rankedUsers;
  }

  // ============ MODERATION ============

  async reportPost(postId: string, reportedBy: string, reason: string, description?: string) {
    const report = await prisma.$transaction(async (tx) => {
      const newReport = await tx.postReport.create({
        data: {
          postId,
          reportedBy,
          reason,
          description,
        },
      });

      await tx.communityPost.update({
        where: { id: postId },
        data: {
          isReported: true,
          reportCount: { increment: 1 },
        },
      });

      return newReport;
    });

    return report;
  }

  async getSuggestedUsers(userId: string, limit: number = 10) {
    // Get users with similar trading style and experience level
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        tradingStyle: true,
        experienceLevel: true,
      },
    });

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Get users already following
    const following = await prisma.userFollow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = following.map((f) => f.followingId);
    followingIds.push(userId); // Exclude self

    const suggestedUsers = await prisma.user.findMany({
      where: {
        id: { notIn: followingIds },
        profileVisibility: 'PUBLIC',
        totalTrades: { gt: 0 },
        OR: [
          { tradingStyle: currentUser.tradingStyle },
          { experienceLevel: currentUser.experienceLevel },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        tradingStyle: true,
        experienceLevel: true,
        totalTrades: true,
        winRate: true,
        badges: true,
      },
      orderBy: [
        { totalTrades: 'desc' },
        { winRate: 'desc' },
      ],
      take: limit,
    });

    return suggestedUsers;
  }
}

export default new CommunityService();
