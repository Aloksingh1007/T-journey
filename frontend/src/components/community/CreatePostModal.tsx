import React, { useState } from 'react';
import { X } from 'lucide-react';
import { type CreatePostData } from '../../services/community.service';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePostData) => Promise<void>;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [postType, setPostType] = useState<'ACHIEVEMENT' | 'INSIGHT' | 'QUESTION' | 'TRADE_BREAKDOWN'>('INSIGHT');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        postType,
        title: title.trim() || undefined,
        content: content.trim(),
      });
      
      // Reset form
      setTitle('');
      setContent('');
      setPostType('INSIGHT');
      onClose();
    } catch (error) {
      console.error('Failed to create post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Post Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Post Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'ACHIEVEMENT', label: 'Achievement', color: 'green' },
                { value: 'INSIGHT', label: 'Insight', color: 'blue' },
                { value: 'QUESTION', label: 'Question', color: 'purple' },
                { value: 'TRADE_BREAKDOWN', label: 'Trade Breakdown', color: 'orange' },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setPostType(type.value as any)}
                  className={`p-3 rounded-xl border-2 transition-all font-medium ${
                    postType === type.value
                      ? type.color === 'green' ? 'border-green-500 bg-green-50 text-green-700' :
                        type.color === 'blue' ? 'border-blue-500 bg-blue-50 text-blue-700' :
                        type.color === 'purple' ? 'border-purple-500 bg-purple-50 text-purple-700' :
                        'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title (Optional) */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-3">
              Title (Optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
              maxLength={100}
            />
          </div>

          {/* Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-3">
              Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, insights, or questions..."
              rows={8}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none"
              maxLength={5000}
            />
            <p className="text-sm text-gray-500 mt-2">
              {content.length} / 5000 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-semibold shadow-lg"
            >
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
