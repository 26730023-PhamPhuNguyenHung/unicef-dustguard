import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  ChevronRight,
  Hash,
  Eye,
} from 'lucide-react';

interface HeroSectionProps {
  lang: 'vi' | 'en';
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<'initial' | 'after'>('initial');

  return (
    <section id="hero" className="pt-28 pb-16 md:pt-36 md:pb-24 bg-[#FDFBF7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* CỘT TRÁI: THÔNG ĐIỆP CHÍNH & HÀNH ĐỘNG */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag thông tin */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-primary border border-red-200 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{lang === 'vi' ? 'Nền tảng CivicTech Đồng Giám sát Bụi Đô thị' : 'CivicTech Urban Dust Action Platform'}</span>
            </div>

            {/* Tiêu đề cấp 1 */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-content-main tracking-tight leading-[1.15] text-balance">
              {lang === 'vi' ? (
                <>
                  Phát hiện bụi. <br className="hidden sm:inline" />
                  <span className="text-primary underline decoration-red-200 decoration-4 underline-offset-4">
                    Theo dõi đến khi
                  </span>{' '}
                  được xử lý.
                </>
              ) : (
                <>
                  Spot urban dust. <br className="hidden sm:inline" />
                  <span className="text-primary underline decoration-red-200 decoration-4 underline-offset-4">
                    Track until
                  </span>{' '}
                  accountably resolved.
                </>
              )}
            </h1>

            {/* Mô tả giải pháp thực tế */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl font-normal">
              {lang === 'vi'
                ? 'Biến mỗi bức ảnh phản ánh của người dân thành một hồ sơ pháp lý minh bạch có mã định danh, giám sát quy trình tái kiểm thực địa trong 48 giờ và đối soát bằng chứng số niêm phong SHA-256.'
                : 'Turn citizen reports into structured civic evidence with sequential tracking codes, 48-hour SLA follow-ups, and tamper-proof SHA-256 photographic verification.'}
            </p>

            {/* Bộ nút hành động chính */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/reports/new"
                className="px-5 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all touch-target"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Gửi phản ánh hiện trường' : 'Report Dust Issue'}</span>
              </Link>

              <Link
                to="/map"
                className="px-5 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-bold text-xs sm:text-sm shadow-2xs flex items-center gap-2 transition-all touch-target"
              >
                <MapPin className="w-4 h-4 text-primary" />
                <span>{lang === 'vi' ? 'Xem bản đồ ô nhiễm' : 'Explore Live Map'}</span>
              </Link>

              <a
                href="#workflow"
                className="px-4 py-3 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors touch-target"
              >
                <span>{lang === 'vi' ? 'Xem quy trình 5 chặng' : 'How it works'}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Dải 4 chỉ số cốt lõi */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>SLA</span>
                </div>
                <div className="text-xl font-black text-slate-900">48 giờ</div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight">
                  {lang === 'vi' ? 'Tái kiểm hiện trường' : 'Field reinspection'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>BẢO CHỨNG</span>
                </div>
                <div className="text-xl font-black text-slate-900">100%</div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight">
                  {lang === 'vi' ? 'Niêm phong SHA-256' : 'SHA-256 sealed'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 text-blue-700 text-xs font-bold mb-0.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>TÍN CHỈ</span>
                </div>
                <div className="text-xl font-black text-slate-900">20h = 4.0</div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight">
                  {lang === 'vi' ? 'Hoạt động tình nguyện' : 'Volunteer credits'}
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold mb-0.5">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>KẾT QUẢ</span>
                </div>
                <div className="text-xl font-black text-slate-900">0 Hồ sơ</div>
                <div className="text-[11px] text-slate-500 font-medium leading-tight">
                  {lang === 'vi' ? 'Bị rơi vào im lặng' : 'Lost in the void'}
                </div>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: INTERACTIVE EVIDENCE COMPARISON CARD */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-slate-200 shadow-md overflow-hidden">
              {/* Card Header & Tab Switcher */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[11px] font-mono font-bold">
                    DG-2026-OP-014
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {lang === 'vi' ? 'Hồ sơ Đối chứng Minh bạch' : 'Evidence Audit Card'}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-md">
                  <button
                    type="button"
                    onClick={() => setActiveTab('initial')}
                    className={`px-2 py-1 text-[11px] font-bold rounded transition-all touch-target ${
                      activeTab === 'initial'
                        ? 'bg-white text-rose-800 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    1. Phát hiện
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('after')}
                    className={`px-2 py-1 text-[11px] font-bold rounded transition-all touch-target ${
                      activeTab === 'after'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    2. Sau 48h
                  </button>
                </div>
              </div>

              {/* Card Body - Content Based on Active Tab */}
              <div className="p-4 space-y-4">
                {activeTab === 'initial' ? (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="relative rounded-lg overflow-hidden border border-rose-200 bg-rose-50/50 aspect-video flex flex-col items-center justify-center p-4 text-center">
                      <AlertTriangle className="w-10 h-10 text-rose-600 mb-2" />
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        Hiện trường phát hiện ban đầu
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                        Xe tải chở đất thi công không rửa bánh, bụi mù mịt lan ra làn đường xe máy, trạm rửa lốp bị bỏ trống.
                      </p>
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
                        PM2.5: 184 µg/m³ (VƯỢT 3.6 LẦN)
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Vị trí phản ánh:</span>
                        <strong className="text-slate-900">Dự án Nút giao Vành đai 2.5</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Thời điểm ghi nhận:</span>
                        <span className="font-mono text-slate-700">08:15 — 05/09/2026</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Tình trạng tiếp nhận:</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[11px]">
                          Đã chuyển giao Đội TT Môi trường
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="relative rounded-lg overflow-hidden border border-emerald-200 bg-emerald-50/50 aspect-video flex flex-col items-center justify-center p-4 text-center">
                      <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">
                        Kết quả tái kiểm nghiệm thu sau 48h
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 max-w-xs">
                        Nhà thầu đã kích hoạt vòi phun áp lực cao, lắp bạt che kín thùng xe ben, mặt đường được tưới ẩm định kỳ.
                      </p>
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold">
                        PM2.5: 36 µg/m³ (ĐẠT CHUẨN QCVN)
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Biên bản thanh tra:</span>
                        <strong className="text-slate-900">BB-TTMT-092/2026</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Cán bộ phụ trách:</span>
                        <span className="font-semibold text-slate-800">Thanh tra viên Trần Quốc Dũng</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Mã băm niêm phong:</span>
                        <span className="font-mono text-[10px] text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          e3b0c442...98b5 (Khớp 100%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Action of Card */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 font-medium">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    Lưu trữ bất biến D1 SSOT
                  </span>
                  <Link
                    to="/reports"
                    className="text-primary font-bold hover:underline flex items-center gap-0.5"
                  >
                    Xem toàn bộ nhật ký <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
