import React from 'react';

interface LoadingSkeletonProps {
  type: 'customer' | 'posts' | 'reply';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type }) => {
  const renderCustomerSkeleton = () => (
    <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );

  const renderPostsSkeleton = () => (
    <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-l-4 border-gray-200 pl-3">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReplySkeleton = () => (
    <div className="bg-white rounded-lg p-4 shadow-sm border animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );

  const skeletonMap = {
    customer: renderCustomerSkeleton,
    posts: renderPostsSkeleton,
    reply: renderReplySkeleton,
  };

  return skeletonMap[type]();
};