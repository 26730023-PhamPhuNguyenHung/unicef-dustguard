import React from 'react';
import {
  FileText,
  ShieldCheck,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  Hash,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface SolutionSectionProps {
  lang: 'vi' | 'en';
}

export const SolutionSection: React.FC<SolutionSectionProps> = ({ lang }) => {
  return (
    <section id="solution" className="py-16 sm:py-20 bg-[#FDFBF7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-primary border border-red-200 rounded-full text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Giải pháp CivicTech cốt lõi' : 'Core Product Architecture'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight leading-snug">
            {lang === 'vi'
              ? 'Một vấn đề. Một hồ sơ. Một hành trình xử lý.'
              : 'One Issue. One Record. One Verifiable Journey.'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {lang === 'vi'
              ? 'Mọi tín hiệu từ công dân hay trạm quan trắc IoT đều được quy về một hồ sơ duy nhất với dòng thời gian bất biến, ràng buộc trách nhiệm cụ thể của cơ quan và nhà thầu.'
              : 'Every observation from citizens or IoT stations collapses into a single permanent case record with transparent accountability.'}
          </p>
        </div>

        {/* Bento Grid Layout (4 Boxes) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Box 1: Mã hồ sơ định danh tuần tự (Large 7 cols) */}
          <div className="md:col-span-7 civic-card p-6 bg-white border border-slate-200 rounded-xl space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-red-50 text-primary flex items-center justify-center font-bold text-xs border border-red-200">
                  <FileText className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase">
                  {lang === 'vi' ? 'Mã Định Danh Tuần Tự Toàn Đô Thị' : 'Sequential Civic Identifier'}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[11px] font-bold">
                Đang xử lý
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="font-mono text-sm font-extrabold text-primary">DG-2026-OP-001</div>
                <div className="text-xs text-slate-600 font-medium">Hầm chui Kim Đồng - Giải Phóng</div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                Đoàn xe ben chở đất thi công làm rơi vãi đất sét khô, phát tán bụi mù mịt khi phương tiện lưu thông qua làn hỗn hợp.
              </p>

              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Nhà thầu:</span>
                  <strong className="text-slate-900 truncate block">TCT Thăng Long</strong>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Thanh tra viên:</span>
                  <strong className="text-slate-900 truncate block">Trần Quốc Dũng</strong>
                </div>
                <div className="bg-white p-2 rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Tọa độ GPS:</span>
                  <strong className="text-slate-900 truncate block">20.9852, 105.8436</strong>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Mỗi hồ sơ liên kết chặt chẽ với Nhà thầu thi công, Giấy phép môi trường và Đơn vị chịu trách nhiệm kiểm tra.
            </p>
          </div>

          {/* Box 2: Đồng hồ đếm ngược SLA 48h (5 cols) */}
          <div className="md:col-span-5 civic-card p-6 bg-white border border-slate-200 rounded-xl space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                  <Clock className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase">
                  {lang === 'vi' ? 'Cam Kết Xử Lý 48 Giờ (SLA)' : '48-Hour SLA Guarantee'}
                </span>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-center space-y-1">
                <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wide">
                  Thời gian còn lại để tái kiểm
                </div>
                <div className="text-3xl font-black text-amber-900 font-mono tracking-tight">
                  31 : 24 : 08
                </div>
                <div className="text-[11px] text-amber-800 font-medium">
                  Hạn chót: 16:00 ngày mai (Tự động nhắc nhở cán bộ)
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Chống trì hoãn hành chính
              </div>
              <p className="text-[11px] leading-relaxed">
                Hệ thống tự động kích hoạt cảnh báo vượt cấp nếu sau 48h không có biên bản tái kiểm nghiệm thu từ cán bộ phụ trách.
              </p>
            </div>
          </div>

          {/* Box 3: Bằng chứng số niêm phong SHA-256 (5 cols) */}
          <div className="md:col-span-5 civic-card p-6 bg-white border border-slate-200 rounded-xl space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase">
                  {lang === 'vi' ? 'Niêm Phong Toàn Vẹn SHA-256' : 'Cryptographic Integrity'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 bg-slate-900 text-emerald-400 font-mono text-xs rounded-lg space-y-1 select-all">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-sans">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3" /> SHA-256 DIGEST
                    </span>
                    <span className="text-emerald-400 font-bold">100% MATCH</span>
                  </div>
                  <div className="truncate text-[11px]">
                    a5dcf1804b5d17e692c5e51344ae97df925b75dbe51ddd848044777a503ac75d
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Xác thực ảnh gốc không bị chỉnh sửa, làm bằng chứng pháp lý tại tòa.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link to="/evidence" className="text-primary font-bold hover:underline flex items-center gap-1">
                Mở kho bằng chứng số <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Box 4: Tín chỉ hoạt động Thanh niên & Tình nguyện viên (7 cols) */}
          <div className="md:col-span-7 civic-card p-6 bg-white border border-slate-200 rounded-xl space-y-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-200">
                  <Award className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-slate-900 uppercase">
                  {lang === 'vi' ? 'Quy Đổi Tín Chỉ Tình Nguyện Thanh Niên' : 'Youth Volunteer Credits'}
                </span>
              </div>
              <span className="text-xs font-bold text-blue-700">20 giờ = 4.0 Tín chỉ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  Ghi nhận công sức thực tế
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Mỗi lần gửi ảnh phản ánh chính xác hoặc tham gia đối soát tái kiểm được cộng điểm rèn luyện và giờ tình nguyện xã hội.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-600" />
                  Chứng chỉ số có QR đối soát
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Cấp giấy chứng nhận điện tử được công nhận bởi Đoàn Thanh niên, các trường Đại học và đối tác UNICEF.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Hơn 1,200 thanh niên và sinh viên đang tham gia</span>
              <Link to="/communities" className="text-primary font-bold hover:underline">
                Tham gia Mạng lưới →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
