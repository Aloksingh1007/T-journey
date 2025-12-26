import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import * as communityController from '../controllers/community.controller';

const router = Router();

// All community routes require authentication
router.use(authMiddleware);

// ============ POST ROUTES ============
router.post('/posts', communityController.createPost);
router.get('/posts/:postId', communityController.getPost);
router.put('/posts/:postId', communityController.updatePost);
router.delete('/posts/:postId', communityController.deletePost);

// ============ FEED ROUTES ============
router.get('/feed', communityController.getFeed);

// ============ LIKE ROUTES ============
router.post('/posts/:postId/like', communityController.likePost);
router.delete('/posts/:postId/like', communityController.unlikePost);

// ============ COMMENT ROUTES ============
router.post('/posts/:postId/comments', communityController.createComment);
router.get('/posts/:postId/comments', communityController.getComments);
router.delete('/comments/:commentId', communityController.deleteComment);

// ============ FOLLOW ROUTES ============
router.post('/follow/:userId', communityController.followUser);
router.delete('/follow/:userId', communityController.unfollowUser);
router.get('/followers/:userId', communityController.getFollowers);
router.get('/following/:userId', communityController.getFollowing);
router.get('/follow-status/:userId', communityController.checkFollowStatus);

// ============ SEARCH & DISCOVERY ROUTES ============
router.get('/search', communityController.searchUsers);
router.get('/leaderboard', communityController.getLeaderboard);
router.get('/suggested-users', communityController.getSuggestedUsers);

// ============ MODERATION ROUTES ============
router.post('/posts/:postId/report', communityController.reportPost);

export default router;
