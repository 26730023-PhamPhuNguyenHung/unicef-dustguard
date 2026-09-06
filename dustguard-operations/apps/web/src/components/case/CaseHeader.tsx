import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Button } from '../common/Button';
import { MapPin, User, Calendar, AlertTriangle, ArrowRight, MoreHorizontal, FileText, CheckCircle2 } from 'lucide-react';
import { Case, CaseStatus } from '@dustguard-operations/shared';

export interface CaseHeaderProps {
  caseData: Case;
  onPrimaryAction?: () => void;
  onSecondaryAction?: (action: string) => void;
}

export const CaseHeader: React.FC<CaseHeaderProps> = ({
  caseData,
  onPrimaryAction,
  onSecondaryAction,
}) => {
  // Determine dominant single Primary CTA based on current stage - DUSTGUARD RED SSOT
  const getPrimaryCta = (status: CaseStatus): { label: string; icon: React.ReactNode; variant: 'primary' | 'danger' } => {
    switch (status) {
      case 'NEW':
        return { label: 'Tiếp nhận & Phân loại', icon: <ArrowRight className="w-4 h-4" />, variant: 'primary' };
      case 'TRIAGED':
        return { label: 'Phân công cán bộ', icon: <User className="w-4 h-4" />, variant: 'primary' };
      case 'ASSIGNED':
        return { label: 'Lập lịch kiểm tra', icon: <Calendar className="w-4 h-4" />, variant: 'primary' };
      case 'LEGAL_REVIEW':
        return { label: 'Hoàn thành thẩm tra', icon: <FileText className="w-4 h-4" />, variant: 'primary' };
      case 'INSPECTION_PLANNED':
        return { label: 'Bắt đầu kiểm tra', icon: <ArrowRight className="w-4 h-4" />, variant: 'primary' };
      case 'INSPECTION_IN_PROGRESS':
        return { label: 'Nộp biên bản hiện trường', icon: <CheckCircle2 className="w-4 h-4" />, variant: 'primary' };
      case 'ACTION_REQUIRED':
        return { label: 'Nộp minh chứng khắc phục', icon: <FileText className="w-4 h-4" />, variant: 'primary' };
      case 'REMEDIATION':
        return { label: 'Thẩm duyệt khắc phục', icon: <CheckCircle2 className="w-4 h-4" />, variant: 'primary' };
      case 'REINSPECTION':
        return { label: 'Lập lịch tái kiểm tra', icon: <Calendar className="w-4 h-4" />, variant: 'primary' };
      case 'READY_TO_CLOSE':
        return { label: 'Ký quyết định đóng vụ việc', icon: <CheckCircle2 className="w-4 h-4" />, variant: 'primary' };
      case 'CLOSED':
        return { label: 'Mở lại hồ sơ vụ việc', icon: <ArrowRight className="w-4 h-4" />, variant: 'primary' };
      case 'REOPENED':
        return { label: 'Tiếp nhận xử lý lại', icon: <ArrowRight className="w-4 h-4" />, variant: 'primary' };
      default:
        return { label: 'Cập nhật trạng thái', icon: <ArrowRight className="w-4 h-4" />, variant: 'primary' };
    }
  };

  const cta = getPrimaryCta(caseData.status);

  return (
    <div className="bg-white border border-slate-200/90 rounded-lg p-4 sm:p-6 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
        {/* Left info */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-dustguard-red bg-dustguard-redSoft border border-dustguard-redBorder px-2 py-0.5 rounded">
              {caseData.case_code}
            </span>
            <StatusBadge status={caseData.status} />
            {caseData.priority === 'URGENT' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                <AlertTriangle className="w-3 h-3" /> Khẩn cấp
              </span>
            )}
            <span className="text-xs text-ink-500">
              Nguồn: <strong className="text-ink-700">{caseData.source}</strong> ({caseData.source_report_count} phản ánh)
            </span>
          </div>

          <h1 className="text-lg sm:text-2xl font-bold text-ink-900 leading-tight tracking-tight">
            {caseData.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs sm:text-sm text-ink-600 pt-0.5">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-ink-400 shrink-0" />
              <span className="truncate">{caseData.location_text}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-ink-400 shrink-0" />
              <span>
                Cán bộ thụ lý:{' '}
                <strong className="text-ink-800">
                  {caseData.assigned_staff_name || 'Chưa phân công'}
                </strong>
              </span>
            </div>
            {caseData.contractor_name && (
              <div className="flex items-center gap-1">
                <span className="text-ink-400">Đơn vị:</span>
                <strong className="text-ink-800">{caseData.contractor_name}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Right CTA: Single Dominant DustGuard Red Button */}
        <div className="flex flex-wrap items-center gap-2 self-start shrink-0 pt-2 lg:pt-0 w-full lg:w-auto">
          <Button
            variant={cta.variant}
            size="md"
            icon={cta.icon}
            onClick={onPrimaryAction}
            className="font-semibold shadow-xs w-full sm:w-auto min-h-[44px]"
          >
            {cta.label}
          </Button>

          {onSecondaryAction && (
            <Button
              variant="secondary"
              size="md"
              className="px-3 min-h-[44px] min-w-[44px] touch-target"
              onClick={() => onSecondaryAction('toggle_menu')}
              aria-label="Thao tác khác"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
