import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number; variant?: 'grid' | 'table' | 'list' }> = ({
  rows = 4,
  variant = 'grid'
}) => {
  if (variant === 'table') {
    return (
      <div className="bg-surface-card rounded-civic border border-border-subtle p-4 space-y-3 animate-pulse">
        <div className="h-6 bg-surface-secondary rounded w-1/4 mb-4"></div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2.5 border-b border-border-subtle/50 last:border-0">
            <div className="h-4 bg-surface-secondary rounded w-1/4"></div>
            <div className="h-4 bg-surface-subtle rounded w-1/5"></div>
            <div className="h-4 bg-surface-subtle rounded w-1/6"></div>
            <div className="h-4 bg-surface-secondary rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full animate-pulse" role="status" aria-label="Đang tải dữ liệu...">
      <div className="h-8 bg-surface-secondary rounded-civic w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="bg-surface-card p-5 rounded-civic border border-border-subtle space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-surface-secondary rounded w-24"></div>
              <div className="h-4 bg-surface-subtle rounded w-16"></div>
            </div>
            <div className="h-5 bg-surface-secondary rounded w-3/4"></div>
            <div className="h-3.5 bg-surface-subtle rounded w-full"></div>
            <div className="h-3.5 bg-surface-subtle rounded w-5/6"></div>
            <div className="h-9 bg-surface-subtle rounded-civic w-full mt-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
