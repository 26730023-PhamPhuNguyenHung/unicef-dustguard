import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Lock, Send, AlertTriangle, Scale, ShieldCheck, X } from 'lucide-react';
import { HumanDecisionType } from '@dustguard-operations/shared';

export interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDecision: (decisionType: HumanDecisionType, reason: string) => Promise<void>;
  submitting?: boolean;
  caseCode: string;
  caseTitle: string;
  conclusionLevel?: string;
  confidencePercent?: number;
  findingsCount?: number;
  missingFacts?: any[];
  selectedLegalBasis?: string;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  isOpen,
  onClose,
  onSubmitDecision,
  submitting = false,
  caseCode,
  caseTitle,
  conclusionLevel = 'PRELIMINARY',
  confidencePercent = 50,
  findingsCount = 0,
  missingFacts = [],
  selectedLegalBasis,
}) => {
  const [decisionType, setDecisionType] = useState<HumanDecisionType>('ACCEPT_ASSESSMENT');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    await onSubmitDecision(decisionType, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-ink-900/40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-surface rounded-lg max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-xl border border-slate-200 z-10 animate-fade-in max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200/90 pb-3 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-dustguard-redSoft text-dustguard-red flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-ink-900">
                Ký duyệt Quyết định Cán bộ
              </h3>
              <p className="text-xs text-ink-500 font-mono">Hồ sơ: {caseCode}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-ink-400 hover:text-ink-900 hover:bg-surface-subtle cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview banner */}
        <div className="p-3 bg-surface-subtle rounded-md border border-slate-200/80 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink-600">Đánh giá hệ thống đối chứng:</span>
            <Badge variant="red" size="sm">Thẩm quyền cán bộ</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-ink-700">
            <div>• Căn cứ đã kiểm tra: <strong>{findingsCount} nhận định</strong></div>
            <div>• Độ tin cậy dữ liệu: <strong>{confidencePercent}%</strong></div>
          </div>
          {selectedLegalBasis && (
            <div className="text-[11px] text-ink-600 border-t border-slate-200/60 pt-1 flex items-center gap-1 font-mono">
              <Scale className="w-3 h-3 text-ink-400 shrink-0" />
              <span className="truncate">{selectedLegalBasis}</span>
            </div>
          )}
        </div>

        {/* Missing fact warning if any */}
        {missingFacts.length > 0 && (
          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-md text-xs text-amber-950 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Cảnh báo: Còn {missingFacts.length} dữ kiện chưa hoàn thiện</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-relaxed">
              Cán bộ có thể tiếp tục phê duyệt nếu có nhận định nghiệp vụ độc lập, hoặc yêu cầu kiểm tra bổ sung trước khi kết luận.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-ink-800 block text-xs">
              Thao tác quyết định áp dụng:
            </label>
            <select
              value={decisionType}
              onChange={e => setDecisionType(e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-md font-semibold text-ink-900 bg-white outline-none focus:ring-2 focus:ring-dustguard-red text-xs"
            >
              <option value="ACCEPT_ASSESSMENT">1. Chấp thuận thẩm định & Ban hành quyết định (Accept Assessment)</option>
              <option value="REQUEST_MORE_VERIFICATION">2. Yêu cầu xác minh hiện trường bổ sung (Request More Verification)</option>
              <option value="REJECT_ASSESSMENT">3. Bác bỏ kết quả thẩm tra (Reject Assessment)</option>
              <option value="SEND_TO_FIELD_INSPECTION">4. Chuyển lệnh kiểm tra đột xuất hiện trường (Send to Field Inspection)</option>
              <option value="SEND_TO_LEGAL_REVIEW">5. Chuyển rà soát chuyên sâu bộ phận Pháp chế (Send to Legal Review)</option>
              <option value="CLOSE_INSUFFICIENT_EVIDENCE">6. Đóng hồ sơ do không đủ căn cứ xử lý (Close Insufficient)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-ink-800 block text-xs">
              Nhận xét & căn cứ pháp lý phê chuẩn *:
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Nhập nhận xét của cán bộ có thẩm quyền, các điều khoản viện dẫn và chỉ đạo xử lý..."
              className="w-full p-2.5 border border-slate-300 rounded-md text-xs text-ink-900 outline-none focus:ring-2 focus:ring-dustguard-red bg-white font-medium"
              required
            />
            <span className="text-[11px] text-ink-400 block italic">
              * Khuyến nghị của hệ thống là trợ lý tham vấn. Trách nhiệm pháp lý thuộc cán bộ ký duyệt.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
              icon={<Send className="w-3.5 h-3.5" />}
              className="font-bold shadow-xs"
            >
              Ký duyệt & Lưu quyết định
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
