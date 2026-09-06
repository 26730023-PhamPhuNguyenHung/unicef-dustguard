import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export interface PageHeaderProps {
  title: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  backTo,
  backLabel = 'Quay lại',
  badge,
  actions,
  breadcrumbs,
  className = '',
}) => {
  return (
    <div className={`bg-surface border border-slate-200/90 rounded-lg p-3.5 sm:p-5 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Breadcrumbs or Back button */}
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-ink-500 mb-1">
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-ink-300 select-none">/</span>}
                  {bc.path ? (
                    <Link
                      to={bc.path}
                      className="hover:text-dustguard-red transition-colors py-1 inline-flex items-center"
                    >
                      {bc.label}
                    </Link>
                  ) : (
                    <span className="text-ink-800 font-semibold py-1 inline-flex items-center">{bc.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : backTo ? (
            <div className="mb-1">
              <Link
                to={backTo}
                className="inline-flex items-center gap-1 text-xs font-semibold text-ink-600 hover:text-dustguard-red transition-colors py-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{backLabel}</span>
              </Link>
            </div>
          ) : null}

          {/* Title & Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-ink-900 leading-snug tracking-tight">
              {title}
            </h1>
            {badge}
          </div>

          {/* Description */}
          {description && (
            <p className="text-xs text-ink-600 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center w-full sm:w-auto pt-1 sm:pt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
