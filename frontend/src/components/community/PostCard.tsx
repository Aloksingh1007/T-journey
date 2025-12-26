import React, { useState } from 'react';
import { type CommunityPost } from '../../services/community.service';
import { Heart, MessageCircle, Share2, MoreVertical, Flag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface PostCardProps {
  post: CommunityPost;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  isLiked?: boolean;
  currentUserId?: string;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onReport,
  onDelete,
  isLiked = false,
  currentUserId,
}) => {
  const { user: currentUser } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Get full avatar URL
  const getAvatarUrl = (avatarPath: string | null | undefined) => {
    if (!avatarPath) return null;
    // If it's already a full URL, return as is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    // Otherwise, prepend the backend server URL
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${avatarPath}`;
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'ACHIEVEMENT':
        return 'bg-green-100 text-green-800';
      case 'INSIGHT':
        return 'bg-blue-100 text-blue-800';
      case 'QUESTION':
        return 'bg-purple-100 text-purple-800';
      case 'TRADE_BREAKDOWN':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPostType = (type: string) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const isOwnPost = currentUserId === post.userId;

  // Get avatar URL or use initials
  const getAvatarDisplay = () => {
    const avatarUrl = getAvatarUrl(post.user?.avatar);
    
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt={post.user?.name || 'User'}
          className="w-12 h-12 rounded-xl object-cover shadow-sm"
          onError={(e) => {
            // Fallback to initials if image fails to load
            console.error('Failed to load avatar:', avatarUrl);
            e.currentTarget.style.display = 'none';
          }}
        />
      );
    }
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
        {post.user?.name ? post.user.name.charAt(0).toUpperCase() : post.user?.email?.charAt(0).toUpperCase() || 'U'}
      </div>
    );
  };

  // Render avatar for any user (comments, etc)
  const renderUserAvatar = (user: any, size: 'small' | 'medium' = 'small') => {
    const avatarUrl = getAvatarUrl(user?.avatar);
    const sizeClasses = size === 'small' ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg';
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U';

    if (avatarUrl) {
      return (
        <>
          <img
            src={avatarUrl}
            alt={user?.name || 'User'}
            className={`${sizeClasses} rounded-lg object-cover shadow-sm flex-shrink-0`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div className={`${sizeClasses} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg hidden items-center justify-center text-white font-semibold flex-shrink-0`}>
            {initial}
          </div>
        </>
      );
    }
    return (
      <div className={`${sizeClasses} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0`}>
        {initial}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getAvatarDisplay()}
          <div>
            <p className="font-bold text-gray-900">
              {post.user?.name || post.user?.email || 'Unknown User'}
            </p>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
              {isOwnPost && onDelete && (
                <button
                  onClick={() => {
                    onDelete(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg mx-1"
                >
                  Delete Post
                </button>
              )}
              {!isOwnPost && onReport && (
                <button
                  onClick={() => {
                    onReport(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 flex items-center gap-2 rounded-lg mx-1"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Type Badge */}
      <div className="mb-3">
        <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-bold ${getPostTypeColor(post.postType)}`}>
          {formatPostType(post.postType)}
        </span>
      </div>

      {/* Title */}
      {post.title && (
        <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
      )}

      {/* Content */}
      <p className="text-gray-700 mb-4 whitespace-pre-wrap leading-relaxed">{post.content}</p>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {post.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Post image ${index + 1}`}
              className="w-full h-48 object-cover rounded-xl"
            />
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-2 transition-all ${
            isLiked
              ? 'text-red-500'
              : 'text-gray-500 hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{post.likesCount}</span>
        </button>

        <button
          onClick={() => {
            setShowComments(!showComments);
            onComment(post.id);
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.commentsCount}</span>
        </button>

        {onShare && (
          <button
            onClick={() => onShare(post.id)}
            className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-3">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-3">
                  {renderUserAvatar(comment.user, 'small')}
                  <div className="flex-1 bg-gray-50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.user?.name || comment.user?.email || 'User'}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>

          {/* Comment Input */}
          <div className="mt-4 flex gap-3">
            {renderUserAvatar(currentUser, 'small')}
            <input
              type="text"
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              onKeyPress={async (e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  const content = e.currentTarget.value.trim();
                  const inputElement = e.currentTarget;
                  try {
                    // Import communityService at the top of the file
                    const communityService = (await import('../../services/community.service')).default;
                    await communityService.createComment(post.id, content);
                    inputElement.value = '';
                    // Refresh the page to show new comment
                    setTimeout(() => window.location.reload(), 100);
                  } catch (error) {
                    console.error('Failed to post comment:', error);
                    alert('Failed to post comment. Please try again.');
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
