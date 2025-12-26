import React, { useState, useEffect } from 'react';
import PostCard from './PostCard';
import communityService, { type CommunityPost } from '../../services/community.service';
import { Loader2 } from 'lucide-react';

interface CommunityFeedProps {
  feedType: 'following' | 'trending' | 'recent' | 'my-posts';
  currentUserId?: string;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ feedType, currentUserId }) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPosts();
  }, [feedType]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      
      if (feedType === 'my-posts') {
        // Fetch all posts and filter for current user
        const allPosts = await communityService.getFeed('recent', 100, 0);
        data = allPosts.filter(post => post.userId === currentUserId);
      } else {
        data = await communityService.getFeed(feedType);
      }
      
      setPosts(data);
      
      // Load liked posts from localStorage
      const likedPostsData = localStorage.getItem('likedPosts');
      if (likedPostsData) {
        setLikedPosts(new Set(JSON.parse(likedPostsData)));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      if (likedPosts.has(postId)) {
        await communityService.unlikePost(postId);
        setLikedPosts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(postId);
          // Save to localStorage
          localStorage.setItem('likedPosts', JSON.stringify(Array.from(newSet)));
          return newSet;
        });
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likesCount: post.likesCount - 1 } : post
          )
        );
      } else {
        await communityService.likePost(postId);
        setLikedPosts((prev) => {
          const newSet = new Set(prev).add(postId);
          // Save to localStorage
          localStorage.setItem('likedPosts', JSON.stringify(Array.from(newSet)));
          return newSet;
        });
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId ? { ...post, likesCount: post.likesCount + 1 } : post
          )
        );
      }
    } catch (err) {
      console.error('Failed to like/unlike post:', err);
    }
  };

  const handleComment = (postId: string) => {
    // Comment functionality is handled within PostCard
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handleReport = async (postId: string) => {
    const reason = prompt('Please provide a reason for reporting this post:');
    if (reason) {
      try {
        await communityService.reportPost(postId, 'other', reason);
        alert('Post reported successfully. Our team will review it.');
      } catch (err) {
        console.error('Failed to report post:', err);
        alert('Failed to report post. Please try again.');
      }
    }
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await communityService.deletePost(postId);
        setPosts((prev) => prev.filter((post) => post.id !== postId));
      } catch (err) {
        console.error('Failed to delete post:', err);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={loadPosts}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {feedType === 'following'
            ? 'No posts from people you follow yet. Try following some traders!'
            : feedType === 'my-posts'
            ? 'You haven\'t created any posts yet. Click "Create Post" to share your first insight!'
            : 'No posts available yet. Be the first to share!'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onReport={handleReport}
          onDelete={handleDelete}
          isLiked={likedPosts.has(post.id)}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};

export default CommunityFeed;
