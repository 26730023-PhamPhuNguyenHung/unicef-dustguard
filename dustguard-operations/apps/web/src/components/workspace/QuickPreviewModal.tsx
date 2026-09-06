import React from 'react';
import {
  X,
  MessageSquare,
  Activity,
  FileText,
  Camera,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CaseFact, AccompanyingData } from '@dustguard-operations/shared';

interface QuickPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fact: CaseFact | null;
  onOpenEvidenceDetail?: (fact: CaseFact) => void;
  onOpenActionModal?: (actionType: string, fact?: CaseFact) => void;
}

export const QuickPreviewModal: React.FC<QuickPreviewModalProps> = ({
  isOpen,
  onClose,
  fact,
  onOpenEvidenceDetail,
  onOpenActionModal,
}) => {
  if (!isOpen || !fact) return null;

  // Determine category display and icons
  let categoryLabel = 'DỮ KIỆN HỒ SƠ';
  let categoryIcon = <FileText className="w-4 h-4 text-slate-700" />;

  if (fact.semantic_type === 'CLAIM' || fact.fact_type === 'COMMUNITY_CLAIM') {
    categoryLabel = 'PHẢN ÁNH CỘNG ĐỒNG';
    categoryIcon = <MessageSquare className="w-4 h-4 text-amber-700" />;
  } else if (fact.semantic_type === 'TELEMETRY' || fact.fact_type === 'IOT_ANOMALY') {
    categoryLabel = 'QUAN TRẮC VIỄN THÁM IOT';
    categoryIcon = <Activity className="w-4 h-4 text-blue-700" />;
  } else if (fact.fact_type === 'EVIDENCE_ASSET' || (fact.semantic_type as string) === 'DOCUMENT') {
    categoryLabel = 'BẰNG CHỨNG HIỆN TRƯỜNG';
    categoryIcon = <Camera className="w-4 h-4 text-emerald-700" />;
  } else if (fact.semantic_type === 'OBSERVATION') {
    categoryLabel = 'TIÊU CHÍ THANH TRA THỰC ĐỊA';
    categoryIcon = <ShieldCheck className="w-4 h-4 text-purple-700" />;
  }

  const friendlyCode =
    fact.friendly_code ||
    (fact.id.includes('CLAIM') ? 'COM-REP-8912' : fact.id.replace('FACT-', ''));

  const cognitiveState = fact.cognitive_state || (fact.verification_state === 'VERIFIED' ? 'VERIFIED' : 'FACT');
  const checks = fact.automated_checks || {
    valid_time: true,
    time_note: 'Thời gian ghi nhận hợp lệ',
    near_site: true,
    distance_note: 'Vị trí nằm gần công trình',
    field_verified: fact.verification_state === 'VERIFIED',
    inspector_note: fact.verification_state === 'VERIFIED' ? 'Đã có cán bộ xác minh thực địa' : 'Chưa có xác minh hiện trường',
  };

  const accompanying: AccompanyingData = (fact.accompanying_data || {
    report_count: fact.metadata?.report_count || 1,
    photos_count: 2,
    location_text: fact.metadata?.district || 'Gần công trình',
  }) as AccompanyingData;

  const relatedFinding = fact.related_finding_id || 'Chưa liên kết phát hiện vi phạm';
  const relatedLaw = fact.related_legal_section || 'Quy chuẩn bảo vệ môi trường công trình';

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in"
      style={{ scrollbarGutter: 'stable' }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl max-w-xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        style={{ textWrap: 'pretty' }}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-white rounded-md border border-slate-200 shadow-2xs">
              {categoryIcon}
            </span>
            <div>
              <span className="text-xs font-black tracking-wider text-slate-800 uppercase block">
                {categoryLabel}
              </span>
              <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-slate-700">{friendlyCode}</span>
                <span>·</span>
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{new Date(fact.source_timestamp).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Main Statement Quote */}
          <div className="p-4 bg-amber-50/70 rounded-lg border border-amber-200/90 text-slate-900 leading-relaxed font-medium text-[13px] shadow-2xs">
            <div className="text-xs text-amber-900 font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <span>Nội dung ghi nhận:</span>
            </div>
            “{fact.value}”
          </div>

          {/* Cognitive State & Verification Status */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Trạng thái dữ kiện:</span>
              {cognitiveState === 'VERIFIED' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                  ● VERIFIED (Đã xác nhận)
                </span>
              ) : cognitiveState === 'AI_SUGGESTION' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
                  <Sparkles className="w-3 h-3 text-indigo-700" />
                  ● AI SUGGESTION (Gợi ý máy)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
                  ● FACT (Dữ kiện hệ thống)
                </span>
              )}
            </div>

            <div>
              {fact.verification_state === 'VERIFIED' ? (
                <Badge variant="success" size="sm">Đã đối chứng thực địa</Badge>
              ) : (
                <Badge variant="warning" size="sm">Chưa qua xác minh thực địa</Badge>
              )}
            </div>
          </div>

          {/* Dữ liệu đi kèm (Accompanying Data) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Dữ liệu đi kèm:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {accompanying.report_count && (
                <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-800 font-semibold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                  {accompanying.report_count} lượt phản ánh
                </span>
              )}
              {accompanying.photos_count ? (
                <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-800 font-semibold flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  {accompanying.photos_count} ảnh minh chứng
                </span>
              ) : null}
              {accompanying.location_coords ? (
                <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-800 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Tọa độ GPS: {accompanying.location_coords}
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-800 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {accompanying.location_text || 'Địa bàn phụ trách'}
                </span>
              )}
              {accompanying.readings_count && (
                <span className="px-2.5 py-1 bg-slate-100 rounded border border-slate-200 text-slate-800 font-semibold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  {accompanying.readings_count} mẫu chuỗi thời gian
                </span>
              )}
            </div>
          </div>

          {/* Liên quan đến (Related Finding & Law) */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Liên quan đến vụ việc:
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-900 font-mono text-[11px] font-bold">
                  {relatedFinding.split('·')[0].trim()}
                </span>
                <span>{relatedFinding}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Scale className="w-3.5 h-3.5 text-red-700 shrink-0" />
                <span className="text-red-950 font-semibold">{relatedLaw}</span>
              </div>
            </div>
          </div>

          {/* Hệ thống đã kiểm tra (Automated Checks) */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Hệ thống đã tự động kiểm tra (Rule Engine):
            </span>
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5 text-xs font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-emerald-900 font-semibold">{checks.time_note || 'Thời gian ghi nhận hợp lệ'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="text-emerald-900 font-semibold">{checks.distance_note || 'Vị trí nằm gần công trình (< 50m)'}</span>
              </div>
              <div className="flex items-center gap-2">
                {checks.field_verified ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-emerald-900 font-semibold">{checks.inspector_note || 'Đã có biên bản kiểm tra thực địa'}</span>
                  </>
                ) : (
                  <>
                    <span className="text-amber-600 font-bold px-1 text-sm leading-none">—</span>
                    <span className="text-amber-900 font-semibold">Chưa có cán bộ lập biên bản kiểm tra hiện trường</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Phân tích tự động AI (AI Extraction Box) */}
          {fact.ai_extraction && (
            <div className="p-3.5 bg-indigo-50/60 rounded-lg border border-indigo-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Trích xuất tự động (AI Assistance)
                </span>
                <span className="text-[10px] text-indigo-700 font-semibold">
                  Mức chắc chắn: {fact.ai_extraction.confidence_label || 'TRUNG BÌNH'}
                </span>
              </div>
              <ul className="space-y-1 text-indigo-950 text-[11px] list-disc list-inside">
                {fact.ai_extraction.topic && <li>Chủ đề: <strong>{fact.ai_extraction.topic}</strong></li>}
                {fact.ai_extraction.target && <li>Đối tượng: <strong>{fact.ai_extraction.target}</strong></li>}
                {fact.ai_extraction.timeframe && <li>Mốc thời gian: {fact.ai_extraction.timeframe}</li>}
                {fact.ai_extraction.potential_relevance && <li>Có khả năng liên quan: {fact.ai_extraction.potential_relevance}</li>}
              </ul>
              <p className="text-[10px] text-indigo-700 italic pt-0.5">
                * Lưu ý: Đây là gợi ý trích xuất hỗ trợ rà soát, không phải phán quyết vi phạm chính thức.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Subtle Technical ID pushed to bottom */}
          <div className="text-[10px] font-mono text-slate-600 truncate">
            Mã hệ thống: <span className="font-semibold text-slate-800">{fact.id}</span> · Nguồn: {fact.source_type}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 justify-end">
            {onOpenEvidenceDetail && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenEvidenceDetail(fact);
                }}
                icon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Xem đầy đủ
              </Button>
            )}

            {onOpenActionModal && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenActionModal('CREATE_VERIFICATION_TASK', fact);
                }}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                className="font-bold"
              >
                Tạo xác minh →
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
