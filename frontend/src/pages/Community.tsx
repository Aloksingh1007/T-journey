import React, { useState } from 'react';
import { Plus, TrendingUp, Clock, Users, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import CommunityFeed from '../components/community/CommunityFeed';
import CreatePostModal from '../components/community/CreatePostModal';
import communityService, { type CreatePostData } from '../services/community.service';
import { useAuth } from '../contexts/AuthContext';

const Community: React.FC = () => {
  const { user } = useAuth();
  const [feedType, setFeedType] = useState<'following' | 'trending' | 'recent' | 'my-posts'>('trending');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch user's community stats
  const { data: followers = [] } = useQuery({
    queryKey: ['followers', user?.id],
    queryFn: () => communityService.getFollowers(user!.id, 100, 0),
    enabled: !!user?.id,
  });

  const { data: following = [] } = useQuery({
    queryKey: ['following', user?.id],
    queryFn: () => communityService.getFollowing(user!.id, 100, 0),
    enabled: !!user?.id,
  });

  // Fetch user's posts count
  const { data: userPosts = [] } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: () => communityService.getFeed('following', 100, 0),
    enabled: !!user?.id,
  });

  const userPostsCount = userPosts.filter(post => post.userId === user?.id).length;

  const handleCreatePost = async (data: CreatePostData) => {
    try {
      await communityService.createPost(data);
      setRefreshKey((prev) => prev + 1); // Trigger feed refresh
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with gradient */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Community</h1>
              <p className="text-gray-600 text-lg">
                Connect with traders, share insights, and learn from the community
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Create Post</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Left */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Posts</span>
                  <span className="text-2xl font-bold text-blue-600">{userPostsCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Followers</span>
                  <span className="text-2xl font-bold text-green-600">{followers.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl">
                  <span className="text-sm font-medium text-gray-700">Following</span>
                  <span className="text-2xl font-bold text-purple-600">{following.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {/* Feed Type Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setFeedType('trending')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    feedType === 'trending'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Trending</span>
                </button>
                <button
                  onClick={() => setFeedType('recent')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    feedType === 'recent'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Recent</span>
                </button>
                <button
                  onClick={() => setFeedType('following')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    feedType === 'following'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Following</span>
                </button>
                <button
                  onClick={() => setFeedType('my-posts')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                    feedType === 'my-posts'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>My Posts</span>
                </button>
              </div>
            </div>

            {/* Feed */}
            <CommunityFeed key={refreshKey} feedType={feedType} currentUserId={user?.id} />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />
    </div>
  );
};

export default Community;
