import React from 'react';
import { Link } from 'react-router-dom';
import { ReportDto, CATEGORY_LABELS } from '@dustguard/shared';
import { StatusBadge } from './StatusBadge.js';
import { MapPin, Calendar, User, ArrowRight } from 'lucide-react';

interface ReportCardProps {
  report: ReportDto | any;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const categoryLabel = CATEGORY_LABELS[report.category as keyof typeof CATEGORY_LABELS] || report.category;
  
  // Tôn trọng quyền riêng tư người báo cáo
  const reporterDisplay = report.reporterDisplayIdentity === 'name' && report.reporterName
    ? report.reporterName
    : 'Người dân khu vực';

  return (
    <div className="bg-surface-card rounded-civic border border-border-subtle shadow-sm hover:shadow transition-all overflow-hidden flex flex-col justify-between">
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-content-sub font-mono">
            {report.report_code || report.reportCode}
          </span>
          <StatusBadge status={report.status} type="report" />
        </div>

        <Link to={`/reports/${report.id}`}>
          <h3 className="text-base font-bold text-content-main hover:text-primary transition-colors line-clamp-2 mb-2 text-pretty">
            {report.title}
          </h3>
        </Link>

        <p className="text-xs font-medium text-content-sub bg-surface-secondary px-2.5 py-1 rounded-md inline-block mb-3">
          {categoryLabel}
        </p>

        <p className="text-xs text-content-sub line-clamp-2 mb-4 text-pretty">
          {report.description}
        </p>

        <div className="flex items-start gap-1.5 text-xs text-content-sub mb-2">
          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span className="line-clamp-1">{report.address}, {report.district}</span>
        </div>
      </div>

      <div className="px-5 py-2.5 bg-surface-secondary/60 border-t border-border-subtle flex items-center justify-between text-xs text-content-sub">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-content-muted" />
            {reporterDisplay}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-content-muted" />
            {new Date(report.observed_at || report.observedAt || report.created_at).toLocaleDateString('vi-VN')}
          </span>
        </div>

        <Link
          to={`/reports/${report.id}`}
          className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary-dark transition-colors py-2 px-1 min-h-[44px]"
        >
          Xem
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
