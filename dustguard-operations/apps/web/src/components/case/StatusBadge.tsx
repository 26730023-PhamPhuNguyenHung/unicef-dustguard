import React from 'react';
import {
  CaseStatus,
  CASE_STATUS_LABELS,
  CASE_STATUS_COLORS,
} from '@dustguard-operations/shared';

export const StatusBadge: React.FC<{ status: CaseStatus | string; className?: string }> = ({
  status,
  className = '',
}) => {
  const s = status as CaseStatus;
  const label = CASE_STATUS_LABELS[s] || status;
  const colors = CASE_STATUS_COLORS[s] || { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        borderColor: colors.border,
      }}
    >
      {label}
    </span>
  );
};
