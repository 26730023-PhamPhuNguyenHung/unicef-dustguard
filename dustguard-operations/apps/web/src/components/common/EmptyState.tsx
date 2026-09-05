import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLoading?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionLoading = false,
  className = '',
}) => {
  return (
    <div
      className={`py-8 px-6 text-center flex flex-col items-center justify-center rounded-lg bg-surface border border-slate-200/80 ${className}`}
    >
      {icon && (
        <div className="w-10 h-10 rounded-full bg-surface-subtle border border-slate-200 flex items-center justify-center text-ink-500 mb-3 shadow-xs">
          {icon}
        </div>
      )}
      <h4 className="text-sm font-bold text-ink-900 mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-ink-600 max-w-sm mb-4 leading-relaxed font-normal">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button
          variant="primary"
          size="sm"
          loading={actionLoading}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
