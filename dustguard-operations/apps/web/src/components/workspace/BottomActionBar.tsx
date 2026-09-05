import React from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export interface BottomActionBarProps {
  conclusionLevel?: string;
  confidencePercent?: number;
  onSecondaryAction?: () => void;
  secondaryLabel?: string;
  secondaryLoading?: boolean;
  onPrimaryAction: () => void;
  primaryLabel?: string;
  primaryLoading?: boolean;
  extraInfo?: React.ReactNode;
  className?: string;
}

export const BottomActionBar: React.FC<BottomActionBarProps> = ({
  conclusionLevel = 'PRELIMINARY',
  confidencePercent = 50,
  onSecondaryAction,
  secondaryLabel = 'Yêu cầu xác minh',
  secondaryLoading = false,
  onPrimaryAction,
  primaryLabel = 'Ra quyết định →',
  primaryLoading = false,
  extraInfo,
  className = '',
}) => {
  const getConclusionBadge = (level: string) => {
    switch (level) {
      case 'HUMAN_CONFIRMED':
        return <Badge variant="red" size="md">Lãnh đạo đã ký duyệt</Badge>;
      case 'SUPPORTED':
        return <Badge variant="success" size="md">Đã đối chứng đủ căn cứ</Badge>;
      case 'PRELIMINARY':
        return <Badge variant="warning" size="md">Dấu hiệu sơ bộ (Cần xác minh)</Badge>;
      default:
        return <Badge variant="neutral" size="md">Chưa đủ căn cứ</Badge>;
    }
  };

  return (
    <div
      className={`sticky bottom-0 z-20 w-full bg-surface border-t border-slate-200/90 shadow-md py-3 px-4 sm:px-6 transition-all ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-full">
        {/* Left: Current conclusion & confidence */}
        <div className="flex flex-wrap items-center gap-3 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-ink-500 font-medium hidden md:inline">Kết luận:</span>
            {getConclusionBadge(conclusionLevel)}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-ink-600 font-bold">
              Độ tin cậy: {confidencePercent}%
            </span>
            <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden shrink-0">
              <div
                className="bg-dustguard-red h-full transition-all duration-300 rounded-full"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>

          {extraInfo}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          {onSecondaryAction && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={secondaryLoading}
              onClick={onSecondaryAction}
            >
              {secondaryLabel}
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            loading={primaryLoading}
            onClick={onPrimaryAction}
            className="shadow-xs font-bold"
          >
            <span>{primaryLabel}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
