import React, { useState } from 'react';
import { ArrowDown, Check, Clock, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

interface CaseStoryProps {
  lang: 'vi' | 'en';
}

export const CaseStory: React.FC<CaseStoryProps> = ({ lang }) => {
  const [selectedPhase, setSelectedPhase] = useState<'both' | 'before' | 'after'>('both');

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white rounded-2xl border border-[#E2DCD5] shadow-[0_12px_36px_rgba(30,41,59,0.06)] overflow-hidden transition-all">
      {/* CARD HEADER */}
      <div className="px-4 sm:px-5 py-3.5 bg-[#FAF7F2] border-b border-[#EAE6DF] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="font-mono text-[12px] font-bold text-[#0F172A] tracking-tight whitespace-nowrap shrink-0">
            DG-2026-OP-014
          </span>
          <span className="text-[#94A3B8] text-[12px] shrink-0">·</span>
          <span className="text-[12px] font-medium text-[#64748B] flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 text-[#B42318] shrink-0" />
            <span className="truncate">Nút giao Kim Đồng</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[11px] font-semibold whitespace-nowrap shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          <span>{lang === 'vi' ? 'Đã tái kiểm đạt' : 'Reinspected'}</span>
        </div>
      </div>

      {/* STORY BODY */}
      <div className="p-5 space-y-4">
        
        {/* BLOCK 1: BEFORE / PHÁT HIỆN BAN ĐẦU */}
        <div className="group rounded-xl border border-[#F1ECE6] bg-[#FCFAF7] p-3.5 space-y-2.5 transition-all hover:border-[#E2DCD5]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#B42318] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]" />
              {lang === 'vi' ? '01 · Phát hiện ban đầu' : '01 · Initial Observation'}
            </span>
            <span className="font-mono text-[#64748B]">05/09 · 08:15</span>
          </div>

          {/* Realistic Visual Thumbnail representing real dusty construction */}
          <div className="relative h-28 w-full rounded-lg overflow-hidden bg-gradient-to-r from-amber-100 via-stone-200 to-amber-200/80 flex flex-col justify-end p-3 border border-amber-300/40">
            {/* Atmospheric Dust Texture Simulation */}
            <div className="absolute inset-0 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px] opacity-20" />
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-none text-white text-[10px] font-mono font-medium">
              GPS: 20.9852° N, 105.8436° E
            </div>
            <div className="relative z-10 bg-white/95 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#1E293B] shadow-2xs">
              {lang === 'vi'
                ? 'Đoàn xe ben chở đất làm rơi vãi, bụi cuốn mù mịt'
                : 'Trucks departing site without tire wash, dense dust'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-0.5">
            <span>{lang === 'vi' ? 'Ghi nhận: Người dân phản ánh' : 'Reported by citizen'}</span>
            <span className="text-[#B42318] font-medium">
              {lang === 'vi' ? 'Bụi tăng cao (Dữ liệu thực địa)' : 'High dust level'}
            </span>
          </div>
        </div>

        {/* TRANSITION CONNECTOR */}
        <div className="flex items-center justify-center gap-3 py-0.5 text-[#94A3B8]">
          <div className="h-[1px] flex-1 bg-[#EAE6DF]" />
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4EFEA] text-[11px] font-medium text-[#475569]">
            <Clock className="w-3 h-3 text-[#B42318]" />
            <span>{lang === 'vi' ? 'Sau 48 giờ xử lý & tái kiểm' : 'After 48h resolution'}</span>
            <ArrowDown className="w-3 h-3 text-[#B42318]" />
          </div>
          <div className="h-[1px] flex-1 bg-[#EAE6DF]" />
        </div>

        {/* BLOCK 2: AFTER / SAU TÁI KIỂM NGHIỆM THU */}
        <div className="group rounded-xl border border-[#D1FAE5] bg-[#F0FDF4]/50 p-3.5 space-y-2.5 transition-all hover:border-[#A7F3D0]">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#065F46] uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              {lang === 'vi' ? '02 · Hiện trường sau khắc phục' : '02 · Verified Remediation'}
            </span>
            <span className="font-mono text-[#64748B]">07/09 · 08:40</span>
          </div>

          {/* Cleaned Site Visual Representation */}
          <div className="relative h-28 w-full rounded-lg overflow-hidden bg-gradient-to-r from-emerald-100 via-teal-100 to-sky-100 flex flex-col justify-end p-3 border border-emerald-300/40">
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-emerald-900/80 text-white text-[10px] font-mono font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              BB-TTMT-092/2026
            </div>
            <div className="relative z-10 bg-white/95 rounded-md px-2.5 py-1 text-[11px] font-medium text-[#065F46] shadow-2xs">
              {lang === 'vi'
                ? 'Đã kích hoạt trạm rửa bánh áp lực cao & tưới ẩm mặt đường'
                : 'High-pressure wheel wash installed & road watered'}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-0.5">
            <span>{lang === 'vi' ? 'Nghiệm thu: Cán bộ Trần Quốc Dũng' : 'Verified by Officer Dung'}</span>
            <span className="text-[#059669] font-medium">
              {lang === 'vi' ? 'Hiện trường sạch · Đạt chuẩn' : 'Compliant status'}
            </span>
          </div>
        </div>

      </div>

      {/* CARD FOOTER */}
      <div className="px-5 py-3 bg-[#FAF7F2] border-t border-[#EAE6DF] flex items-center justify-between text-[12px]">
        <span className="text-[#64748B] flex items-center gap-1.5 font-medium">
          <Check className="w-4 h-4 text-[#059669]" />
          {lang === 'vi' ? 'Hồ sơ đã khép kín toàn trình' : 'Closed-loop audit completed'}
        </span>
        <span className="text-[11px] font-mono text-[#94A3B8]">
          {lang === 'vi' ? 'Minh chứng công khai' : 'Public evidence'}
        </span>
      </div>
    </div>
  );
};
