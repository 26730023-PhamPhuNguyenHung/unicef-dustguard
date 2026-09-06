import React, { useRef } from 'react';
import { Award, CheckCircle2, ShieldCheck, Printer, Download, X, QrCode } from 'lucide-react';

export interface YouthCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userRole?: string;
  verifiedHours: number;
  academicCredits: number;
  totalActivitiesCount: number;
}

export const YouthCertificateModal: React.FC<YouthCertificateModalProps> = ({
  isOpen,
  onClose,
  userName,
  userRole = 'Thanh niên Tình nguyện Môi trường',
  verifiedHours,
  academicCredits,
  totalActivitiesCount,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const certificateCode = `DG-CERT-${userName.replace(/\s+/g, '').toUpperCase().slice(0, 4)}-${Math.round(verifiedHours * 10)}`;
  const issueDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-none animate-in fade-in">
      <div className="bg-white rounded-civic-lg border border-border-subtle shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 p-6 sm:p-8">
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-border-subtle pb-3 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-accent-amber" />
            <h2 className="text-base font-bold text-content-main">Giấy Chứng Nhận Hoạt Động Tình Nguyện Môi Trường</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-content-muted hover:text-content-main hover:bg-surface-ground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Certificate Paper */}
        <div
          ref={certRef}
          className="p-6 sm:p-8 rounded-civic-lg border-4 border-double border-primary/40 bg-[#FDFBF7] text-center space-y-5 print:border-none print:p-0"
        >
          {/* Header Banner */}
          <div className="space-y-1 border-b-2 border-primary/20 pb-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
              DUSTGUARD VN — NỀN TẢNG CÔNG NGHỆ CỘNG ĐỒNG BẢO VỆ MÔI TRƯỜNG
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-content-main tracking-tight pt-1">
              GIẤY CHỨNG NHẬN HOẠT ĐỘNG
            </h1>
            <p className="text-xs font-semibold text-content-sub italic">
              Chứng nhận Đóng góp Giám sát & Hành động vì Không khí Sạch Đô thị
            </p>
          </div>

          {/* Recipient Details */}
          <div className="space-y-2 py-2">
            <p className="text-xs text-content-muted uppercase tracking-wider">Trân trọng chứng nhận cá nhân</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-primary">{userName || 'Thanh niên Tình nguyện'}</h2>
            <p className="text-xs font-semibold text-content-sub">{userRole}</p>
          </div>

          {/* Achievement Metrics */}
          <div className="grid grid-cols-3 gap-3 py-3 border-y border-border-subtle bg-white/70 rounded-civic p-3">
            <div>
              <p className="text-[11px] font-semibold text-content-muted">Giờ tình nguyện</p>
              <p className="text-xl font-black text-content-main mt-0.5">{verifiedHours} giờ</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-content-muted">Quy đổi rèn luyện</p>
              <p className="text-xl font-black text-primary mt-0.5">{academicCredits} / 4.0</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-content-muted">Hoạt động xác minh</p>
              <p className="text-xl font-black text-accent-green mt-0.5">{totalActivitiesCount} lượt</p>
            </div>
          </div>

          {/* Verification Code & Seal */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-content-sub">
            <div className="text-left space-y-1">
              <p className="font-mono font-bold text-content-main text-[11px]">Mã tra cứu: {certificateCode}</p>
              <p className="text-[11px] text-content-muted">Ngày cấp: {issueDate}</p>
              <p className="text-[10px] text-content-muted max-w-xs">
                Mã định danh được ký số và lưu trữ bất biến trên hệ thống SSOT của DustGuard VN.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="w-16 h-16 bg-white border border-border-subtle rounded-md p-1 flex items-center justify-center">
                <QrCode className="w-14 h-14 text-content-main" />
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-accent-amber flex items-center justify-center mx-auto text-accent-amber mb-1">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold text-content-sub uppercase block">Dấu niêm phong số</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-content-sub hover:text-content-main border border-border-subtle rounded-civic bg-surface-ground transition"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-primary text-white text-xs font-bold rounded-civic hover:bg-primary-hover transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>In Chứng Nhận</span>
          </button>
        </div>
      </div>
    </div>
  );
};
