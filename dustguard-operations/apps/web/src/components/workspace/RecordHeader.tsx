import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '../case/StatusBadge';
import { CaseStatus } from '@dustguard-operations/shared';

export interface RecordHeaderProps {
  backTo: string;
  backLabel?: string;
  code: string;
  status: CaseStatus | string;
  title: string;
  metadata?: React.ReactNode;
  primaryAction?: React.ReactNode;
  badges?: React.ReactNode;
}

export const RecordHeader: React.FC<RecordHeaderProps> = ({
  backTo,
  backLabel = 'Quay lại',
  code,
  status,
  title,
  metadata,
  primaryAction,
  badges,
}) => {
  return (
    <div className="bg-surface border border-slate-200/90 rounded-lg p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          {/* Top row: Back link, Code, Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={backTo}
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-600 hover:text-dustguard-red transition-colors mr-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{backLabel}</span>
            </Link>
            <span className="font-mono text-xs font-bold text-dustguard-red bg-dustguard-redSoft border border-dustguard-redBorder px-2 py-0.5 rounded">
              {code}
            </span>
            <StatusBadge status={status as any} />
            {badges}
          </div>

          {/* Title */}
          <h1 className="text-lg sm:text-xl font-bold text-ink-900 leading-snug">
            {title}
          </h1>

          {/* Metadata */}
          {metadata && (
            <div className="flex flex-wrap items-center gap-x-3 text-xs text-ink-500 pt-0.5">
              {metadata}
            </div>
          )}
        </div>

        {/* Primary Action */}
        {primaryAction && (
          <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
            {primaryAction}
          </div>
        )}
      </div>
    </div>
  );
};
