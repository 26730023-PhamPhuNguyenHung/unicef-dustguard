import React from 'react';
import { Link } from 'react-router-dom';
import { CaseDto, CATEGORY_LABELS } from '@dustguard/shared';
import { StatusBadge } from './StatusBadge.js';
import { MapPin, Users, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

interface CaseCardProps {
  caseData: CaseDto | any;
  onConfirm?: (e: React.MouseEvent) => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ caseData }) => {
  const categoryLabel = CATEGORY_LABELS[caseData.category as keyof typeof CATEGORY_LABELS] || caseData.category;

  return (
    <div className="bg-surface-card rounded-civic border border-border-subtle shadow-sm hover:shadow transition-all overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="text-xs font-semibold text-primary font-mono tracking-wider">
            {caseData.case_code || caseData.caseCode}
          </span>
          <StatusBadge status={caseData.status} type="case" />
        </div>

        <Link to={`/cases/${caseData.id}`}>
          <h3 className="text-base font-bold text-content-main hover:text-primary transition-colors line-clamp-2 mb-2">
            {caseData.title}
          </h3>
        </Link>

        <p className="text-xs font-medium text-content-sub bg-surface-secondary px-2.5 py-1 rounded-md inline-block mb-3">
          {categoryLabel}
        </p>

        <p className="text-xs text-content-sub line-clamp-2 mb-4">
          {caseData.summary}
        </p>

        <div className="flex items-start gap-1.5 text-xs text-content-sub mb-4">
          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span className="line-clamp-1">{caseData.address}, {caseData.district}</span>
        </div>
      </div>

      <div className="px-4 sm:px-5 py-3 bg-surface-secondary/60 border-t border-border-subtle flex items-center justify-between gap-2 text-xs text-content-sub">
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 min-w-0">
          <span className="inline-flex items-center gap-1 font-medium text-content-main whitespace-nowrap" title="Số người cùng ghi nhận">
            <Users className="w-3.5 h-3.5 text-primary shrink-0" />
            {caseData.confirmationCount || 0} cùng ghi nhận
          </span>
          <span className="inline-flex items-center gap-1 whitespace-nowrap" title="Số quan sát bổ sung">
            <Eye className="w-3.5 h-3.5 text-content-muted shrink-0" />
            {caseData.observationCount || 0} quan sát
          </span>
        </div>

        <Link
          to={`/cases/${caseData.id}`}
          className="shrink-0 inline-flex items-center gap-1 font-bold text-primary hover:text-primary-dark transition-colors py-1 pl-2"
        >
          Chi tiết
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
