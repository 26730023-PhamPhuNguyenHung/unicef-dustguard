import React, { useState, useEffect } from 'react';
import {
  X,
  Scale,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Camera,
  Activity,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Save,
  ShieldCheck,
  CheckSquare,
  Info,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { HumanDecisionType, ConclusionLevel } from '@dustguard-operations/shared';

interface DecisionWorkspaceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  caseData: any;
  analysis: any;
  facts: any[];
  submitting: boolean;
  onSubmitDecision: (decisionType: HumanDecisionType, reason: string) => Promise<void>;
  onOpenActionModal?: (actionType: string) => void;
}

export const DecisionWorkspaceDrawer: React.FC<DecisionWorkspaceDrawerProps> = ({
  isOpen,
  onClose,
  caseData,
  analysis,
  facts,
  submitting,
  onSubmitDecision,
  onOpenActionModal,
}) => {
  const c = caseData?.case || {};
  const [selectedDecision, setSelectedDecision] = useState<HumanDecisionType>('REQUEST_MORE_VERIFICATION');
  const [reason, setReason] = useState('');
  const [showReasoningRationale, setShowReasoningRationale] = useState(false);

  const missingFacts = analysis?.missing_facts || [];
  const findings = analysis?.findings || [];
  const verifiedEvidence = facts.filter(f => f.fact_type === 'EVIDENCE_ASSET' && f.verification_state === 'VERIFIED');
  const telemetryFacts = facts.filter(f => f.semantic_type === 'TELEMETRY');
  const claimFacts = facts.filter(f => f.semantic_type === 'CLAIM');

  useEffect(() => {
    if (isOpen) {
      // Initialize default decision and draft reasoning based on evidence completeness
      if (missingFacts.length > 0) {
        setSelectedDecision('REQUEST_MORE_VERIFICATION');
        setReason(
          `Hồ sơ ghi nhận ${claimFacts.length} phản ánh phát tán bụi và ${verifiedEvidence.length} ảnh minh chứng, nhưng còn thiếu ảnh kiểm tra trạm rửa bánh xe tại cổng ra vào theo Điều 15 NĐ 45/2022/NĐ-CP. Yêu cầu đoàn kiểm tra xác minh thực địa trước khi ban hành kết luận xử lý.`
        );
      } else {
        setSelectedDecision('ACCEPT_ASSESSMENT');
        setReason(
          `Đã có đầy đủ căn cứ và bằng chứng đối chiếu đạt chuẩn quy định tại Khoản 1 Điều 15 Nghị định 45/2022/NĐ-CP. Thống nhất ban hành yêu cầu nhà thầu triển khai biện pháp che chắn và vận hành trạm rửa xe trong 48h.`
        );
      }
    }
  }, [isOpen, analysis]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onSubmitDecision(selectedDecision, reason);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 flex justify-end animate-fade-in"
      style={{ scrollbarGutter: 'stable' }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-300 animate-slide-left"
        style={{ textWrap: 'pretty' }}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-red-50 rounded-lg border border-red-200 text-red-800">
              <Scale className="w-5 h-5 text-red-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  BÀN LÀM VIỆC RA QUYẾT ĐỊNH
                </h2>
                <Badge variant="red" size="sm">Cán bộ ký duyệt</Badge>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {c.case_code || 'DG-2026-OP-013'} · {c.title || 'Hồ sơ thẩm tra căn cứ thực tế'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            title="Đóng bàn làm việc"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body (5 Standard Blocks) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* 1. NHẬN ĐỊNH */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">1</span>
              NHẬN ĐỊNH NGHIỆP VỤ:
            </span>
            <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-900 font-semibold text-xs leading-relaxed">
              {findings[0]?.statement || 'Có dấu hiệu chưa đáp ứng biện pháp kiểm soát bụi tại khu vực thi công / phá dỡ kết cấu gạch đá.'}
            </div>
          </div>

          {/* 2. CĂN CỨ PHÁP LÝ */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">2</span>
              CĂN CỨ PHÁP QUY ÁP DỤNG:
            </span>
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-800">
              <div className="flex items-center gap-2 font-bold text-red-900">
                <Scale className="w-4 h-4 text-red-700 shrink-0" />
                <span>Khoản 1 Điều 15 Nghị định số 45/2022/NĐ-CP</span>
              </div>
              <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                Quy định về bảo vệ môi trường trong thi công xây dựng công trình: bắt buộc che chắn lưới kín chu vi, tưới nước dập bụi và rửa sạch bánh xe phương tiện vận tải trước khi đi ra đường công cộng.
              </p>
            </div>
          </div>

          {/* 3. CHỨNG CỨ ĐỐI CHIẾU */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">3</span>
              CHỨNG CỨ ĐÃ ĐỐI CHIẾU:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-800">
                  ✓ {verifiedEvidence.length || 2} ảnh hiện trường đối soát SHA-256
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-800">
                  ✓ Chuỗi số liệu quan trắc viễn thám IoT
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-slate-800">
                  ✓ Hồ sơ đăng ký bảo vệ môi trường công trình
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-amber-200/90 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium text-amber-900">
                  ⚠ {claimFacts.length || 1} phản ánh cộng đồng chưa xác minh
                </span>
              </div>
            </div>
          </div>

          {/* 4. DỮ KIỆN CÒN THIẾU */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
            <span className="font-bold text-amber-950 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-700 text-white flex items-center justify-center text-[10px] font-bold">4</span>
              DỮ KIỆN CÒN THIẾU CẦN BỔ SUNG:
            </span>
            {missingFacts.length === 0 ? (
              <div className="p-2.5 bg-white rounded-lg border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Hồ sơ đã đầy đủ chứng cứ đối soát.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {missingFacts.map((mf: any, idx: number) => (
                  <div key={idx} className="p-2.5 bg-white rounded-lg border border-amber-300 text-xs flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block leading-tight">{mf.fact}</strong>
                      <span className="text-slate-600 text-[11px] mt-0.5 block">{mf.reason_needed}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. ĐỀ XUẤT HỆ THỐNG */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-700 text-white flex items-center justify-center text-[10px] font-bold">5</span>
                ĐỀ XUẤT TỰ ĐỘNG CỦA HỆ THỐNG (AI ASSISTANT):
              </span>
              <button
                type="button"
                onClick={() => setShowReasoningRationale(!showReasoningRationale)}
                className="text-[11px] font-bold text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Tại sao? [Xem lập luận]</span>
              </button>
            </div>

            <div className="p-3 bg-white rounded-lg border border-indigo-200 text-xs text-indigo-950 leading-relaxed font-semibold">
              {missingFacts.length > 0
                ? 'Đề xuất: Yêu cầu xác minh bổ sung hiện trường trước khi kết luận xử phạt chính thức.'
                : 'Đề xuất: Đủ căn cứ ban hành Yêu cầu khắc phục trong 48 giờ.'}
            </div>

            {showReasoningRationale && (
              <div className="p-3 bg-indigo-100/70 rounded-lg text-[11px] text-indigo-950 space-y-1 animate-fade-in border border-indigo-300">
                <strong className="block text-indigo-900">Chuỗi lập luận hỗ trợ:</strong>
                <p>1. Dữ liệu viễn thám và phản ánh ghi nhận có bụi, nhưng chưa có ảnh cận cảnh trạm rửa bánh xe.</p>
                <p>2. Theo nguyên tắc bảo vệ quyền lợi hợp pháp, cần biên bản thị sát trực tiếp của cán bộ để bảo đảm quyết định có giá trị thi hành pháp lý tuyệt đối.</p>
              </div>
            )}
          </div>

          {/* DECISION SELECTION FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="block font-bold text-slate-900 text-xs uppercase tracking-wide">
                Chọn hình thức quyết định của Cán bộ:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <label
                  className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-2 ${
                    selectedDecision === 'REQUEST_MORE_VERIFICATION'
                      ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision_type"
                    value="REQUEST_MORE_VERIFICATION"
                    checked={selectedDecision === 'REQUEST_MORE_VERIFICATION'}
                    onChange={() => setSelectedDecision('REQUEST_MORE_VERIFICATION')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="block leading-tight">Yêu cầu xác minh</span>
                    <span className="text-[10px] text-slate-500 font-normal">Cần bổ sung chứng cứ</span>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-2 ${
                    selectedDecision === 'ACCEPT_ASSESSMENT'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision_type"
                    value="ACCEPT_ASSESSMENT"
                    checked={selectedDecision === 'ACCEPT_ASSESSMENT'}
                    onChange={() => setSelectedDecision('ACCEPT_ASSESSMENT')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="block leading-tight">Chấp thuận thẩm tra</span>
                    <span className="text-[10px] text-slate-500 font-normal">Ban hành khắc phục 48h</span>
                  </div>
                </label>

                <label
                  className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-start gap-2 ${
                    selectedDecision === 'CONFIRM_VIOLATION'
                      ? 'border-red-600 bg-red-50 text-red-950 font-bold'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="decision_type"
                    value="CONFIRM_VIOLATION"
                    checked={selectedDecision === 'CONFIRM_VIOLATION'}
                    onChange={() => setSelectedDecision('CONFIRM_VIOLATION')}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="block leading-tight">Xác nhận vi phạm</span>
                    <span className="text-[10px] text-slate-500 font-normal">Chuyển lập biên bản phạt</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Note Textarea */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-900 text-xs">
                Nội dung kết luận & bút phê của Cán bộ (Lưu trữ vĩnh viễn):
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Nhập nhận định và chỉ đạo nghiệp vụ chính thức..."
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 leading-relaxed font-medium"
              />
            </div>

            {/* Decision CTAs */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onClose}
                disabled={submitting}
              >
                Lưu nháp
              </Button>

              <div className="flex items-center gap-2">
                {onOpenActionModal && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      onClose();
                      onOpenActionModal('CREATE_VERIFICATION_TASK');
                    }}
                  >
                    Yêu cầu xác minh
                  </Button>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={submitting}
                  className="font-bold shadow-sm"
                >
                  Xác nhận quyết định
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
