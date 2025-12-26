import { Request, Response, NextFunction } from 'express';
import communityService from '../services/community.service';
import { PostType } from '@prisma/client';

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { postType, title, content, tradeId, images } = req.body;

    if (!postType || !content) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Post type and content are required',
        },
      });
      return;
    }

    const post = await communityService.createPost({
      userId,
      postType: postType as PostType,
      title,
      content,
      tradeId,
      images,
    });

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { postId } = req.params;

    const post = await communityService.getPost(postId);

    if (!post) {
      res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Post not found',
        },
      });
      return;
    }

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;
    const { title, content, images } = req.body;

    const post = await communityService.updatePost(postId, userId, {
      title,
      content,
      images,
    });

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;

    await communityService.deletePost(postId, userId);

    res.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const feedType = req.query.type as string || 'following';

    let posts;

    if (feedType === 'trending') {
      posts = await communityService.getTrendingPosts(limit, offset);
    } else if (feedType === 'recent') {
      posts = await communityService.getRecentPosts(limit, offset);
    } else {
      posts = await communityService.getFeed(userId, limit, offset);
    }

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;

    const result = await communityService.likePost(postId, userId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;

    const result = await communityService.unlikePost(postId, userId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { postId } = req.params;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Comment content is required',
        },
      });
      return;
    }

    const comment = await communityService.createComment({
      userId,
      postId,
      content,
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { commentId } = req.params;

    await communityService.deleteComment(commentId, userId);

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const comments = await communityService.getComments(postId, limit, offset);

    res.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user!.userId;
    const { userId } = req.params;

    const result = await communityService.followUser(followerId, userId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user!.userId;
    const { userId } = req.params;

    const result = await communityService.unfollowUser(followerId, userId);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const followers = await communityService.getFollowers(userId, limit, offset);

    res.json({
      success: true,
      data: followers,
    });
  } catch (error) {
    next(error);
  }
};

export const getFollowing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const following = await communityService.getFollowing(userId, limit, offset);

    res.json({
      success: true,
      data: following,
    });
  } catch (error) {
    next(error);
  }
};

export const checkFollowStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user!.userId;
    const { userId } = req.params;

    const isFollowing = await communityService.isFollowing(followerId, userId);

    res.json({
      success: true,
      data: { isFollowing },
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    const tradingStyle = req.query.tradingStyle as string;
    const experienceLevel = req.query.experienceLevel as string;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const users = await communityService.searchUsers({
      query,
      tradingStyle,
      experienceLevel,
      limit,
      offset,
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const type = req.query.type as 'trader_score' | 'win_rate' | 'consistency' | 'total_pnl';
    const period = req.query.period as 'all_time' | 'monthly' | 'weekly';
    const limit = parseInt(req.query.limit as string) || 50;

    if (!type) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Leaderboard type is required',
        },
      });
      return;
    }

    const leaderboard = await communityService.getLeaderboard({
      type,
      period,
      limit,
    });

    res.json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    next(error);
  }
};

export const reportPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reportedBy = req.user!.userId;
    const { postId } = req.params;
    const { reason, description } = req.body;

    if (!reason) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Report reason is required',
        },
      });
      return;
    }

    const report = await communityService.reportPost(postId, reportedBy, reason, description);

    res.status(201).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

export const getSuggestedUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const limit = parseInt(req.query.limit as string) || 10;

    const users = await communityService.getSuggestedUsers(userId, limit);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
