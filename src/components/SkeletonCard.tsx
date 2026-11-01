import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="rounded-2xl overflow-hidden glass-card border border-white/5 flex flex-col">
      <div className="aspect-[3/4.2] w-full skeleton-shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        <div className="h-3 w-1/2 rounded skeleton-shimmer" />
        <div className="pt-2 border-t border-white/5 flex justify-between">
          <div className="h-2.5 w-1/3 rounded skeleton-shimmer" />
          <div className="h-2.5 w-1/4 rounded skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
};
