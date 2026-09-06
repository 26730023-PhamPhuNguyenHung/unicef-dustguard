import React, { useState, useRef } from 'react';
import {
  Share2,
  Printer,
  Copy,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  MapPin,
  Clock,
  Activity,
  CheckCircle2,
  FileText
} from 'lucide-react';

export interface ContributionSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole?: string;
  totalActivities: number;
  contributionHours: number;
  verifiedActivities: number;
  resolvedCasesCount: number;
  locationsCount: number;
  locations?: string[];
  recentActivities?: Array<{
    code: string;
    typeLabel: string;
    title: string;
    district: string;
    hours: number;
    isVerified: boolean;
    createdAt: string;
  }>;
}

export const ContributionSummaryModal: React.FC<ContributionSummaryModalProps> = ({
  isOpen,
  onClose,
  userName,
  userRole = 'Thành viên cộng đồng DustGuard',
  totalActivities,
  contributionHours,
  verifiedActivities,
  resolvedCasesCount,
  locationsCount,
  locations = [],
  recentActivities = [],
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  // Quyền riêng tư chia sẻ (Privacy Controls)
  const [showFullName, setShowFullName] = useState(true);
  const [showHours, setShowHours] = useState(true);
  const [showActivitiesCount, setShowActivitiesCount] = useState(true);
  const [showLocations, setShowLocations] = useState(true);
  const [showActivityList, setShowActivityList] = useState(true);

  if (!isOpen) return null;

  const displayName = showFullName ? (userName || 'Thành viên Cộng đồng') : 'Người tham gia đóng góp';
  const issueDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/credits?ref=${encodeURIComponent(displayName)}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback nếu clipboard API bị chặn
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto space-y-5 p-5 sm:p-7 my-auto">
        
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Share2 className="w-4 h-4 text-[#0d6f64]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight">
                Chia sẻ Hành trình Đóng góp
              </h2>
              <p className="text-xs text-slate-600">
                Bản tổng kết đóng góp và tác động môi trường thực tế của bạn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Controls Panel */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 print:hidden space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0d6f64]" /> Hiển thị trên bản chia sẻ
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Không công khai GPS chi tiết & số điện thoại
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setShowFullName(!showFullName)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left font-medium transition ${
                showFullName ? 'bg-white border-slate-300 text-slate-900 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <span>Họ tên</span>
              {showFullName ? <Eye className="w-3.5 h-3.5 text-teal-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button
              type="button"
              onClick={() => setShowHours(!showHours)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left font-medium transition ${
                showHours ? 'bg-white border-slate-300 text-slate-900 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <span>Thời gian</span>
              {showHours ? <Eye className="w-3.5 h-3.5 text-teal-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button
              type="button"
              onClick={() => setShowActivitiesCount(!showActivitiesCount)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left font-medium transition ${
                showActivitiesCount ? 'bg-white border-slate-300 text-slate-900 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <span>Số hoạt động</span>
              {showActivitiesCount ? <Eye className="w-3.5 h-3.5 text-teal-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button
              type="button"
              onClick={() => setShowLocations(!showLocations)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left font-medium transition ${
                showLocations ? 'bg-white border-slate-300 text-slate-900 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <span>Địa bàn</span>
              {showLocations ? <Eye className="w-3.5 h-3.5 text-teal-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>

            <button
              type="button"
              onClick={() => setShowActivityList(!showActivityList)}
              className={`col-span-2 flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-left font-medium transition ${
                showActivityList ? 'bg-white border-slate-300 text-slate-900 shadow-xs' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <span>Chi tiết danh sách hoạt động</span>
              {showActivityList ? <Eye className="w-3.5 h-3.5 text-teal-700" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Printable & Shareable Contribution Summary Card */}
        <div
          ref={printRef}
          className="p-6 sm:p-8 rounded-2xl border-2 border-slate-200 bg-[#FDFBF7] text-slate-900 space-y-6 print:border-none print:p-0 shadow-xs"
        >
          {/* Header Branding */}
          <div className="border-b border-slate-200 pb-4 text-center space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0d6f64] inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> DUSTGUARD VN · CỘNG ĐỒNG BẢO VỆ KHÔNG KHÍ SẠCH
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              BẢN TỔNG KẾT ĐÓNG GÓP
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Ghi nhận những hoạt động chung tay vì môi trường sống trong lành
            </p>
          </div>

          {/* Recipient Profile */}
          <div className="text-center space-y-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hồ sơ người đóng góp</p>
            <h2 className="text-2xl font-extrabold text-[#0d6f64]">{displayName}</h2>
            <p className="text-xs text-slate-600 font-medium">{userRole}</p>
          </div>

          {/* 4 Impact Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-y border-slate-200 bg-white rounded-xl p-3 text-center">
            <div className="p-2">
              <p className="text-[11px] font-semibold text-slate-500">Hoạt động tham gia</p>
              <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                {showActivitiesCount ? totalActivities : '••'}
              </p>
              <span className="text-[10px] text-slate-500">Phản ánh & thực địa</span>
            </div>

            <div className="p-2 border-l border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Thời gian đóng góp</p>
              <p className="text-xl sm:text-2xl font-black text-[#0d6f64] mt-0.5">
                {showHours ? `${contributionHours}h` : '••'}
              </p>
              <span className="text-[10px] text-slate-500">Hoạt động thực tế</span>
            </div>

            <div className="p-2 border-l border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Đã xác minh</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-800 mt-0.5">
                {showActivitiesCount ? verifiedActivities : '••'}
              </p>
              <span className="text-[10px] text-slate-500">Có bằng chứng</span>
            </div>

            <div className="p-2 border-l border-slate-100">
              <p className="text-[11px] font-semibold text-slate-500">Vấn đề có kết quả</p>
              <p className="text-xl sm:text-2xl font-black text-[#9f241f] mt-0.5">
                {resolvedCasesCount}
              </p>
              <span className="text-[10px] text-slate-500">Đã xử lý / khắc phục</span>
            </div>
          </div>

          {/* Location Coverage if enabled */}
          {showLocations && locations.length > 0 && (
            <div className="text-xs text-slate-700 flex flex-wrap items-center gap-1.5 justify-center">
              <span className="font-semibold text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-700" /> Địa bàn đã góp sức:
              </span>
              {locations.map((loc, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-medium text-slate-800">
                  {loc}
                </span>
              ))}
            </div>
          )}

          {/* Recent Activity Highlights if enabled */}
          {showActivityList && recentActivities.length > 0 && (
            <div className="space-y-2 pt-1 text-left">
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Một số hoạt động nổi bật
              </p>
              <div className="divide-y divide-slate-200 border-t border-slate-200">
                {recentActivities.slice(0, 3).map((act, i) => (
                  <div key={i} className="py-2 flex items-center justify-between text-xs gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">
                          {act.code}
                        </span>
                        <span className="font-bold text-slate-900 truncate">
                          {act.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {act.typeLabel} · {act.district}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-[#0d6f64] shrink-0">
                      +{act.hours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer Motto & Verification Stamp */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="text-center sm:text-left space-y-0.5">
              <p className="font-medium italic text-slate-700">
                "Cùng cộng đồng góp thêm một hành động nhỏ cho môi trường sống tốt hơn."
              </p>
              <p className="text-[10px] text-slate-500">
                Dữ liệu được cập nhật ngày {issueDate} từ nền tảng giám sát cộng đồng DustGuard.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dữ liệu thực tế xác thực</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-1 print:hidden">
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-50 transition shadow-xs min-h-[44px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Đã sao chép liên kết!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-600" />
                <span>Sao chép liên kết</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#0d6f64] text-white text-xs font-bold rounded-xl hover:bg-[#0b5e55] transition shadow-xs min-h-[44px]"
          >
            <Printer className="w-4 h-4" />
            <span>In / Tải bản tổng kết</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContributionSummaryModal;
