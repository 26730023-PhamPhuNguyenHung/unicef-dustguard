import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  AlertTriangle,
  Camera,
  MessageSquare,
  FileSpreadsheet,
  HelpCircle,
  Layers,
  Users,
  MapPin,
  User,
  Wrench,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface ProblemStoryProps {
  lang: 'vi' | 'en';
}

export const ProblemStory: React.FC<ProblemStoryProps> = ({ lang }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          setHasTriggered(true);

          const ctx = gsap.context(() => {
            gsap.fromTo(
              '.problem-header-block',
              { y: 14, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.38,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              }
            );

            gsap.fromTo(
              '.problem-card-item',
              { y: 12, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.35,
                stagger: 0.05,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              }
            );

            gsap.fromTo(
              '.flow-container-card',
              { y: 12, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.38,
                stagger: 0.06,
                delay: 0.05,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              }
            );
          }, sectionRef);

          observer.disconnect();
          return () => ctx.revert();
        }
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered]);

  const problems = [
    {
      num: '01',
      title: lang === 'vi' ? 'Dữ liệu phân mảnh, không cấu trúc' : 'Fragmented, Unstructured Data',
      desc:
        lang === 'vi'
          ? 'Ảnh chụp nằm rải rác trên mạng xã hội hoặc nhóm chat mà không có tọa độ GPS, dấu thời gian số hay mã kiểm chứng.'
          : 'Photos scatter across chats and social media without verifiable GPS, timestamps, or cryptographic digests.',
      consequence:
        lang === 'vi'
          ? 'Hồ sơ thiếu cơ sở pháp lý để cơ quan xử phạt'
          : 'Lacks legal ground for regulatory enforcement',
      icon: <Layers className="w-5 h-5 text-[#C72A20]" />,
    },
    {
      num: '02',
      title: lang === 'vi' ? 'Mù mờ trách nhiệm xử lý' : 'Opaque Accountability',
      desc:
        lang === 'vi'
          ? 'Người gửi không thấy tiến trình, không có mã theo dõi, không rõ cơ quan nào chịu trách nhiệm tiếp nhận và giải quyết.'
          : 'Citizens cannot see case progress, tracking ID, or which agency owns responsibility to resolve it.',
      consequence:
        lang === 'vi'
          ? 'Dễ trôi tin, không ai chịu trách nhiệm giải quyết'
          : 'Requests get lost with no accountable handler',
      icon: <Users className="w-5 h-5 text-[#C72A20]" />,
    },
    {
      num: '03',
      title: lang === 'vi' ? 'Thiếu vòng tái kiểm thực địa' : 'Missing Physical Reinspection',
      desc:
        lang === 'vi'
          ? 'Vụ việc dễ bị đánh dấu "hoàn thành" trên văn bản hành chính trước khi hiện trường thực tế có bất kỳ can thiệp dập bụi nào.'
          : 'Complaints get closed on paper before the construction site actually carries out physical dust control.',
      consequence:
        lang === 'vi'
          ? 'Bụi vẫn tiếp diễn dù văn bản báo cáo đã đóng'
          : 'Dust persists despite written administrative closure',
      icon: <AlertTriangle className="w-5 h-5 text-[#C72A20]" />,
    },
  ];

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="py-6 sm:py-8 lg:py-10 border-y border-[#E8E1D9] relative overflow-hidden scroll-mt-14 bg-[#FAF7F2]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER: BỎ QUOTE CARD PHẢI THEO YÊU CẦU CỦA USER, TRẢI DÀI RỘNG RÃI */}
        <div className="problem-header-block mb-6 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0EB] border border-[#ECD3C6] text-[#9F241F] text-xs font-bold tracking-wider uppercase font-mono shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C72A20]" />
            <span>{lang === 'vi' ? 'THỰC TRẠNG & GIẢI PHÁP' : 'REALITY VS SOLUTION'}</span>
          </div>

          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight"
            style={{ textWrap: 'pretty' }}
          >
            {lang === 'vi' ? (
              <>
                Phản ánh không khó.{' '}
                <span className="text-[#C72A20]">Theo dõi đến kết quả</span> mới khó.
              </>
            ) : (
              <>
                Reporting is easy.{' '}
                <span className="text-[#C72A20]">Tracking to resolution</span> is hard.
              </>
            )}
          </h2>

          <p
            className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl"
            style={{ textWrap: 'pretty' }}
          >
            {lang === 'vi'
              ? 'Hầu hết ứng dụng hiện nay chỉ dừng lại ở việc tiếp nhận phản ánh. Khoảng trống thực sự nằm ở việc theo dõi trách nhiệm xử lý và kiểm chứng hiện trường sau can thiệp.'
              : 'Most platforms stop at submission. The real gap lies in maintaining verifiable accountability and physical site follow-up.'}
          </p>
        </div>

        {/* 2 CỘT NỘI DUNG CHÍNH (CỘT TRÁI: 5/12 COLS / CỘT PHẢI: 7/12 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
          
          {/* CỘT TRÁI: NHỮNG RÀO CẢN CHÍNH HIỆN NAY */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="text-xs font-mono font-bold tracking-wider text-stone-500 uppercase mb-2 flex items-center gap-1.5">
              <span>{lang === 'vi' ? 'NHỮNG RÀO CẢN CHÍNH HIỆN NAY' : 'CURRENT MAIN BARRIERS'}</span>
            </div>

            <div className="flex flex-col justify-between gap-3.5 flex-1">
              {problems.map((item, idx) => (
                <div
                  key={idx}
                  className="problem-card-item p-4 sm:p-4.5 rounded-2xl bg-white border border-[#EAE3DC] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#DCA8A2] transition-colors flex items-start gap-4 flex-1"
                >
                  {/* Cột trái: Số tròn trên + Icon squircle lớn ở dưới */}
                  <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
                    <span className="text-xs font-mono font-bold text-[#C72A20]">
                      {item.num}
                    </span>
                    <div className="w-11 h-11 rounded-2xl bg-[#FFF1F0] border border-[#FBD7D4] flex items-center justify-center shadow-xs">
                      {item.icon}
                    </div>
                  </div>

                  {/* Cột phải: Tiêu đề + Đoạn mô tả + Dòng cảnh báo chấm than đỏ */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="pt-1 flex items-center gap-2 text-xs text-[#C72A20] font-semibold">
                      <span className="w-4 h-4 rounded-full bg-[#C72A20] text-white font-black text-[10px] flex items-center justify-center shrink-0">
                        !
                      </span>
                      <span>{item.consequence}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CỘT PHẢI: CÙNG MỘT PHẢN ÁNH, HAI CÁCH TIẾP CẬN KHÁC NHAU */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="text-xs font-mono font-bold tracking-wider text-stone-500 uppercase mb-2 flex items-center gap-1.5">
              <span>{lang === 'vi' ? 'CÙNG MỘT PHẢN ÁNH, HAI CÁCH TIẾP CẬN KHÁC NHAU' : 'SAME REPORT, TWO DIFFERENT APPROACHES'}</span>
            </div>

            <div className="flex flex-col justify-between gap-4 flex-1">
              
              {/* CARD 1: QUY TRÌNH TRUYỀN THỐNG (ĐỨT GÃY) */}
              <div className="flow-container-card p-4 sm:p-5 rounded-2xl bg-white border border-[#FCA5A5]/70 shadow-[0_2px_8px_rgba(239,68,68,0.03)] space-y-3 flex-1 flex flex-col justify-between">
                {/* Header Card 1 */}
                <div className="flex items-start justify-between gap-2 border-b border-red-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#EF4444] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
                      ✕
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#B91C1C] leading-snug">
                        {lang === 'vi' ? 'Quy trình truyền thống (đứt gãy)' : 'Traditional Process (Broken)'}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {lang === 'vi'
                          ? 'Phản ánh được tiếp nhận, nhưng khó theo dõi và dễ bị bỏ quên.'
                          : 'Reports received, but lack tracking and get abandoned.'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#B91C1C] bg-[#FFF1F0] px-3 py-1 rounded-full border border-[#FBD7D4] shrink-0 font-medium">
                    {lang === 'vi' ? 'Dễ thất lạc hồ sơ' : 'High Drop-Off'}
                  </span>
                </div>

                {/* 4 Bước ngang đứt gãy */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* B1 */}
                  <div className="flex-1 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] flex flex-col justify-between min-h-[72px]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-stone-400 font-bold">01</span>
                      <Camera className="w-4 h-4 text-stone-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {lang === 'vi' ? 'Ảnh rời rạc' : 'Scattered Photo'}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                        {lang === 'vi' ? 'Lưu trong máy' : 'Unindexed'}
                      </div>
                    </div>
                  </div>

                  <span className="text-red-300 font-mono select-none text-xs tracking-tighter shrink-0">···&gt;</span>

                  {/* B2 */}
                  <div className="flex-1 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] flex flex-col justify-between min-h-[72px]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-stone-400 font-bold">02</span>
                      <MessageSquare className="w-4 h-4 text-stone-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {lang === 'vi' ? 'Tin nhắn mạng' : 'Chat Message'}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                        {lang === 'vi' ? 'Dễ trôi tin' : 'Easily buried'}
                      </div>
                    </div>
                  </div>

                  <span className="text-red-300 font-mono select-none text-xs tracking-tighter shrink-0">···&gt;</span>

                  {/* B3 */}
                  <div className="flex-1 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] flex flex-col justify-between min-h-[72px]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-stone-400 font-bold">03</span>
                      <FileSpreadsheet className="w-4 h-4 text-stone-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {lang === 'vi' ? 'Sổ sách Excel' : 'Manual Excel'}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                        {lang === 'vi' ? 'Chậm trễ' : 'Delayed'}
                      </div>
                    </div>
                  </div>

                  <span className="text-red-300 font-mono select-none text-xs tracking-tighter shrink-0">···&gt;</span>

                  {/* B4: MẤT DẤU */}
                  <div className="flex-1 p-2.5 rounded-xl bg-[#FFF5F5] border border-dashed border-[#FCA5A5] flex flex-col justify-between min-h-[72px]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-red-600 font-bold">04</span>
                      <HelpCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-red-700 leading-tight">
                        {lang === 'vi' ? 'Mất dấu' : 'Dropped'}
                      </div>
                      <div className="text-[11px] text-red-500 mt-0.5 font-medium leading-tight">
                        {lang === 'vi' ? 'Không ai tái kiểm' : 'No follow-up'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert Bar đỏ ở đáy */}
                <div className="rounded-xl bg-[#FFF5F5] border border-[#FED7D7] px-3.5 py-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="text-xs text-[#991B1B] font-medium leading-tight">
                    {lang === 'vi'
                      ? 'Hồ sơ dễ bị đóng trên giấy trong khi ô nhiễm thực tế vẫn tiếp diễn.'
                      : 'Cases get closed on paper while physical pollution continues.'}
                  </span>
                </div>
              </div>

              {/* CARD 2: CHU TRÌNH DUSTGUARD (KHÉP KÍN) */}
              <div className="flow-container-card p-4 sm:p-5 rounded-2xl bg-white border border-[#0D6F64]/30 shadow-[0_2px_10px_rgba(13,111,100,0.04)] space-y-3 flex-1 flex flex-col justify-between">
                {/* Header Card 2 */}
                <div className="flex items-start justify-between gap-2 border-b border-teal-100 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#0D6F64] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#0D6F64] leading-snug">
                        {lang === 'vi' ? 'Chu trình DustGuard (khép kín)' : 'DustGuard Closed-Loop Process'}
                      </h4>
                      <p className="text-xs text-stone-500 mt-0.5">
                        {lang === 'vi'
                          ? 'Theo dõi minh bạch. Xử lý có trách nhiệm. Kiểm chứng bằng kết quả thực tế.'
                          : 'Transparent tracking. Accountable handling. Verified physical results.'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0D6F64] bg-[#E6F4F1] px-3 py-1 rounded-full border border-[#B2DFD8] shrink-0">
                    {lang === 'vi' ? 'Mã định danh duy nhất' : 'Single Case ID'}
                  </span>
                </div>

                {/* 4 Bước ngang khép kín */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {/* B1 */}
                  <div className="flex-1 p-2.5 rounded-xl bg-[#F4FAF8] border border-[#D5EBE6] flex flex-col justify-between min-h-[72px]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#0D6F64] font-bold">01</span>
                      <MapPin className="w-4 h-4 text-[#0D6F64]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {lang === 'vi' ? 'Tọa độ GPS' : 'GPS Location'}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                        {lang === 'vi' ? 'Thời gian số WGS84' : 'Digital WGS84'}
                      </div>
                    </div>
                  </div>

                  <span className="text-teal-400 font-mono select-none text-xs tracking-tighter shrink-0">---&gt;</span>

                  {/* B2 */}
                  <div className="flex-1 p-2.5 rounded-xl bg-[#F4FAF8] border border-[#D5EBE6] flex flex-col justify-between min-h-[72px]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#0D6F64] font-bold">02</span>
                      <User className="w-4 h-4 text-[#0D6F64]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {lang === 'vi' ? 'Phân công' : 'Dispatched'}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                        {lang === 'vi' ? 'Đúng UBND Phường' : 'Direct to Ward'}
                      </div>
                    </div>
                  </div>

                  <span className="text-teal-400 font-mono select-none text-xs tracking-tighter shrink-0">---&gt;</span>

                  {/* B3 */}
                  <div className="flex-1 p-2.5 rounded-xl bg-[#F4FAF8] border border-[#D5EBE6] flex flex-col justify-between min-h-[72px]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#0D6F64] font-bold">03</span>
                      <Wrench className="w-4 h-4 text-[#0D6F64]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 leading-tight">
                        {lang === 'vi' ? 'Khắc phục' : 'Remediated'}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5 leading-tight">
                        {lang === 'vi' ? 'Rửa xe & dập bụi' : 'Wheel wash active'}
                      </div>
                    </div>
                  </div>

                  <span className="text-teal-400 font-mono select-none text-xs tracking-tighter shrink-0">---&gt;</span>

                  {/* B4: TÁI KIỂM 48H */}
                  <div className="flex-1 p-2.5 rounded-xl bg-[#E8F8F0] border-2 border-[#10B981] flex flex-col justify-between min-h-[72px] shadow-xs">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[#065F46] font-bold">04</span>
                      <CheckCircle2 className="w-4 h-4 text-[#059669] stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#065F46] leading-tight">
                        {lang === 'vi' ? 'Tái kiểm 48h' : '48h Verified'}
                      </div>
                      <div className="text-[11px] text-[#047857] mt-0.5 font-semibold leading-tight">
                        {lang === 'vi' ? 'Đối chứng Trước/Sau' : 'Before/After'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alert Bar xanh ở đáy */}
                <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] px-3.5 py-2 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="text-xs text-[#065F46] font-medium leading-tight">
                      {lang === 'vi'
                        ? '100% hồ sơ được lưu vết và theo dõi công khai đến kết quả thực tế.'
                        : '100% cases publicly tracked through physical verification.'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#065F46] bg-[#DCFCE7] px-2.5 py-0.5 rounded border border-[#86EFAC] shrink-0">
                    Closed-Loop
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* DÒNG PHÂN CÁCH VÀ SLOGAN DƯỚI CÙNG */}
        <div className="mt-8 pt-4 text-center text-xs font-mono tracking-widest text-stone-400 uppercase flex items-center justify-center gap-4 select-none">
          <span className="h-px bg-stone-300 w-16 sm:w-24" />
          <span>
            {lang === 'vi'
              ? 'MINH BẠCH HƠN HÔM NAY, KHÔNG KHÍ SẠCH HƠN NGÀY MAI'
              : 'MORE TRANSPARENCY TODAY, CLEANER AIR TOMORROW'}
          </span>
          <span className="h-px bg-stone-300 w-16 sm:w-24" />
        </div>

      </div>
    </section>
  );
};

export default ProblemStory;




