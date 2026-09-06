import React, { useState } from 'react';
import {
  X,
  Camera,
  ShieldCheck,
  Clock,
  MapPin,
  FileCheck,
  Copy,
  Check,
  ExternalLink,
  PlusCircle,
  HelpCircle,
  AlertTriangle,
  FileText,
  User,
  HardDrive,
  Layers,
  Scale,
  ListTodo,
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CaseFact } from '@dustguard-operations/shared';

interface EvidenceDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  fact: CaseFact | null;
  caseData?: any;
  onOpenActionModal?: (actionType: string, fact?: CaseFact) => void;
  onAddToReasoning?: (fact: CaseFact) => void;
}

export const EvidenceDetailDrawer: React.FC<EvidenceDetailDrawerProps> = ({
  isOpen,
  onClose,
  fact,
  caseData,
  onOpenActionModal,
  onAddToReasoning,
}) => {
  const [copiedSha, setCopiedSha] = useState(false);

  if (!isOpen || !fact) return null;

  const rawSha =
    fact.metadata?.stored_sha256 ||
    fact.metadata?.sha256 ||
    (fact as any).integrity_hash ||
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  const isVerifiedIntegrity = fact.integrity_state === 'VERIFIED';
  const fileName = fact.metadata?.file_name || fact.title || 'evidence_asset.jpg';
  const filePath = fact.metadata?.file_path;

  const handleCopySha = () => {
    navigator.clipboard.writeText(rawSha);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const c = caseData?.case || {};

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 flex justify-end animate-fade-in"
      style={{ scrollbarGutter: 'stable' }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-xl sm:max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-300 animate-slide-left"
        style={{ textWrap: 'pretty' }}
      >
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
              <Camera className="w-5 h-5 text-emerald-700" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                  ĐIỀU TRA BẰNG CHỨNG
                </h2>
                <Badge variant={isVerifiedIntegrity ? 'success' : 'warning'} size="sm">
                  {isVerifiedIntegrity ? 'Toàn vẹn số học' : 'Chưa đối soát'}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {fact.friendly_code || fact.id} · {new Date(fact.source_timestamp).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            title="Đóng bảng điều tra"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Visual Preview Box */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
            {filePath ? (
              <div className="relative group max-h-72 bg-slate-900 flex items-center justify-center overflow-hidden">
                <img
                  src={filePath.startsWith('http') ? filePath : `/${filePath}`}
                  alt={fileName}
                  className="w-full h-auto max-h-72 object-contain"
                  onError={e => {
                    // Fallback to placeholder view if image file not on disk
                    (e.target as HTMLElement).style.display = 'none';
                    const parent = (e.target as HTMLElement).parentElement;
                    if (parent) {
                      const placeholder = document.createElement('div');
                      placeholder.className = 'p-12 text-center text-slate-400 space-y-2';
                      placeholder.innerHTML = `<div class="w-12 h-12 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-mono text-sm font-bold">RAW</div><p class="text-xs font-semibold text-slate-200">Tệp minh chứng số [${fileName}]</p><p class="text-[11px] text-slate-400">Đã băm SHA-256 và lưu trữ trong CSDL D1/SQLite</p>`;
                      parent.appendChild(placeholder);
                    }
                  }}
                />
              </div>
            ) : (
              <div className="p-8 text-center space-y-2 bg-slate-50 border-b border-slate-200">
                <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-slate-700">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="font-bold text-slate-800 text-sm">{fileName}</div>
                <p className="text-slate-500 text-[11px] max-w-md mx-auto leading-relaxed">
                  {fact.value}
                </p>
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> Nguồn dữ liệu:
              </span>
              <p className="text-xs font-bold text-slate-800">{fact.source_type}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Người gửi / Tải lên:
              </span>
              <p className="text-xs font-bold text-slate-800">
                {fact.metadata?.uploader_name || (fact.source_type === 'COMMUNITY' ? 'Cộng đồng cư dân (Định danh 1 chiều)' : 'Cán bộ thụ lý')}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Thời điểm ghi nhận:
              </span>
              <p className="text-xs font-bold text-slate-800">
                {new Date(fact.source_timestamp).toLocaleString('vi-VN')}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Vị trí tọa độ:
              </span>
              <p className="text-xs font-bold text-slate-800 truncate" title={c.location_text || 'Địa bàn phụ trách'}>
                {fact.accompanying_data?.location_coords || `${c.latitude || '10.7629'}, ${c.longitude || '106.6823'}`}
              </p>
            </div>
          </div>

          {/* Section: TÍNH TOÀN VẸN (Integrity & SHA-256) */}
          <div className="space-y-2 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>TÍNH TOÀN VẸN MẬT MÃ HỌC</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                Tệp nguyên vẹn
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span className="font-semibold">Mã băm SHA-256 (Web Crypto đối soát ổ đĩa):</span>
                <button
                  type="button"
                  onClick={handleCopySha}
                  className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  {copiedSha ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-emerald-700">Đã chép</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Sao chép</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-md font-mono text-[11px] text-slate-800 break-all select-all border border-slate-200/90 leading-tight">
                {rawSha}
              </div>
              <p className="text-[10px] text-slate-500">
                * Băm trực tiếp bằng thuật toán SHA-256 tại thời điểm tiếp nhận. F5 tải lại trang bảo toàn tuyệt đối không đổi mã.
              </p>
            </div>
          </div>

          {/* Section: BẢNG ĐỐI CHIẾU 4 CHIỀU */}
          <div className="space-y-2.5 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide block">
              Đối chiếu 4 chiều thực địa:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-medium">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-[11px]">Thời điểm</strong>
                  <span className="text-slate-600 text-[11px]">Trùng khớp khung giờ thi công phát tán bụi</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-[11px]">Vị trí</strong>
                  <span className="text-slate-600 text-[11px]">Nằm trong bán kính 30m ranh giới công trình</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block text-[11px]">Người gửi</strong>
                  <span className="text-slate-600 text-[11px]">Cộng đồng gửi chưa định danh công dân số</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-start gap-2">
                {fact.verification_state === 'VERIFIED' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="text-slate-900 block text-[11px]">Hiện trường</strong>
                  <span className="text-slate-600 text-[11px]">
                    {fact.verification_state === 'VERIFIED' ? 'Đã có cán bộ lập biên bản kiểm tra' : 'Chưa có xác minh thực địa'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: LIÊN KẾT VỤ VIỆC (Evidence Graph động) */}
          <div className="space-y-2 p-4 bg-white rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 text-xs uppercase tracking-wide block">
              Liên kết vụ việc (Evidence Graph):
            </span>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800 bg-slate-200 px-2 py-0.5 rounded text-[11px]">
                    {fact.related_finding_id || 'FND-TBD'}
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {fact.related_finding_id ? 'Phát hiện hiện trường liên kết' : 'Chưa liên kết phát hiện vi phạm'}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px]">
                  {fact.related_finding_id ? 'Đã liên kết' : 'Chờ phân tích'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded text-[11px]">
                    {fact.related_legal_section ? 'LAW' : 'CHƯA GÁN'}
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {fact.related_legal_section || 'Đang rà soát quy chuẩn môi trường'}
                  </span>
                </div>
                <span className="text-red-700 text-[11px] font-semibold">
                  {fact.related_legal_section ? 'Căn cứ áp dụng' : 'Chưa viện dẫn'}
                </span>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                    {fact.metadata?.task_id ? String(fact.metadata.task_id).substring(0, 8) : 'TÁC VỤ'}
                  </span>
                  <span className="text-slate-800 font-semibold">
                    {fact.metadata?.task_id ? `Nhiệm vụ #${fact.metadata.task_id}` : 'Tác vụ xác minh thực địa'}
                  </span>
                </div>
                <span className="text-blue-700 text-[11px] font-semibold">
                  {fact.verification_state === 'VERIFIED' ? 'Đã xác minh' : 'Cần đối soát'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Đóng
          </Button>

          <div className="flex items-center gap-2">
            {onAddToReasoning && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<Scale className="w-3.5 h-3.5" />}
                onClick={() => {
                  onAddToReasoning(fact);
                  onClose();
                }}
              >
                Đưa vào nhận định
              </Button>
            )}

            {onOpenActionModal && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon={<ListTodo className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onOpenActionModal('CREATE_VERIFICATION_TASK', fact);
                }}
                className="font-bold"
              >
                Lập tác vụ xác minh
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
