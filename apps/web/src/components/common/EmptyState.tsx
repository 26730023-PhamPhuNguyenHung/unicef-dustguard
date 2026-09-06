import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  ctaText?: string;
  ctaLink?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  ctaText,
  ctaLink,
  onAction,
  icon
}) => {
  const finalActionText = actionText || ctaText;
  const finalActionLink = actionLink || ctaLink;
  return (
    <div className="bg-surface-card border border-border-subtle rounded-civic p-6 sm:p-8 lg:p-10 text-center max-w-lg mx-auto shadow-sm">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-bold text-content-main mb-2 text-pretty">{title}</h3>
      <p className="text-sm text-content-sub mb-6 text-pretty leading-relaxed">{description}</p>
      
      {finalActionText && finalActionLink && (
        <Link
          to={finalActionLink}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-civic bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-all shadow-sm min-h-[44px] active:scale-98"
        >
          {finalActionText}
        </Link>
      )}

      {finalActionText && onAction && !finalActionLink && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-civic bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-all shadow-sm min-h-[44px] active:scale-98"
        >
          {finalActionText}
        </button>
      )}
    </div>
  );
};
