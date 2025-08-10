import React from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { CustomerPost } from '../types/zendesk';

interface RecentPostsProps {
  posts: CustomerPost[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

export const RecentPosts: React.FC<RecentPostsProps> = ({ 
  posts, 
  loading, 
  error, 
  onRetry 
}) => {
  if (error) {
    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center gap-2 text-amber-600 mb-2">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Recent Posts</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-lg hover:bg-amber-200 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center gap-2 text-gray-700 mb-3">
        <FileText className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Recent Posts</h3>
        <span className="text-sm text-gray-500">({posts.length})</span>
      </div>
      
      {posts.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No recent posts found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border-l-4 border-blue-200 pl-3 py-1 hover:border-blue-400 transition-colors"
            >
              <p className="text-sm font-medium text-gray-900 leading-snug">
                {post.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};