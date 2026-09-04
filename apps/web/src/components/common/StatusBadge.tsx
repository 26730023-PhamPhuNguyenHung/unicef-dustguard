import React from 'react';
import { CaseStatus, ReportStatus, CASE_STATUS_LABELS, REPORT_STATUS_LABELS } from '@dustguard/shared';

interface StatusBadgeProps {
  status: CaseStatus | ReportStatus | string;
  type?: 'case' | 'report';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'case', className = '' }) => {
  if (type === 'case' && status in CASE_STATUS_LABELS) {
    const config = CASE_STATUS_LABELS[status as CaseStatus];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}
        style={{
          color: config.color,
          backgroundColor: config.bg,
          borderColor: config.border
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
        {config.label}
      </span>
    );
  }

  if (type === 'report' && status in REPORT_STATUS_LABELS) {
    const config = REPORT_STATUS_LABELS[status as ReportStatus];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${className}`}
        style={{
          color: config.color,
          backgroundColor: config.bg,
          borderColor: config.color + '40'
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
        {config.label}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
      {status}
    </span>
  );
};
