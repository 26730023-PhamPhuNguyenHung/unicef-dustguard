import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  XCircle,
  AlertTriangle,
  Camera,
  MessageSquare,
  FileSpreadsheet,
  ShieldCheck,
  Layers,
  UserX,
  MapPin,
  SendHorizontal,
  SprayCan as SprayIcon,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface ProblemStoryProps {
  lang: 'vi' | 'en';
}

export const ProblemStory: React.FC<ProblemStoryProps> = ({ lang }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const checkBadgeRef = useRef<HTMLDivElement>(null);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setHasTriggered(true);
      if (progressBarRef.current) progressBarRef.current.style.transform = 'scaleX(1)';
      if (checkBadgeRef.current) checkBadgeRef.current.style.transform = 'scale(1)';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasTriggered) {
          setHasTriggered(true);

          const ctx = gsap.context(() => {
            gsap.fromTo(
              '.problem-headline',
              { y: 16, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              }
            );

            gsap.fromTo(
              '.problem-lead',
              { y: 12, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                delay: 0.08,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              }
            );

            gsap.fromTo(
              '.problem-card-item',
              { y: 14, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.42,
                stagger: 0.06,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              }
            );

            gsap.fromTo(
              '.flow-container-card',
              { y: 14, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.45,
                stagger: 0.08,
                delay: 0.08,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              }
            );

            if (progressBarRef.current) {
              gsap.fromTo(
                progressBarRef.current,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  transformOrigin: 'left center',
                  duration: 0.6,
                  delay: 0.15,
                  ease: 'power2.out',
                  clearProps: 'transform',
                }
              );
            }

            if (checkBadgeRef.current) {
              gsap.fromTo(
                checkBadgeRef.current,
                { scale: 0.9, opacity: 0.8 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.35,
                  delay: 0.3,
                  ease: 'back.out(2)',
                  clearProps: 'transform,opacity',
                }
              );
            }
          }, sectionRef);

          observer.disconnect();
          return () => ctx.revert();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasTriggered]);

  const problems = [
    {
      num: '01',
      tag: lang === 'vi' ? 'DỮ LIỆU PHÂN MẢNH' : 'FRAGMENTED DATA',
      title: lang === 'vi' ? 'Dữ liệu phân mảnh, không cấu trúc' : 'Fragmented Unstructured Data',
      desc:
        lang === 'vi'
          ? 'Ảnh chụp nằm rải rác trên mạng xã hội hoặc nhóm chat mà không có tọa độ GPS, dấu thời gian số hay mã kiểm chứng.'
          : 'Photos scatter across chats and social media without verifiable GPS, timestamps, or cryptographic digests.',
      consequence:
        lang === 'vi'
          ? 'Hồ sơ thiếu cơ sở pháp lý để cơ quan xử phạt'
          : 'Lacks legal ground for regulatory enforcement',
      icon: <Layers className="w-4 h-4 text-[#C72A20]" />,
    },
    {
      num: '02',
      tag: lang === 'vi' ? 'TRÁCH NHIỆM MÙ MỜ' : 'OPAQUE OWNERSHIP',
      title: lang === 'vi' ? 'Mù mờ trách nhiệm xử lý' : 'Opaque Accountability',
      desc:
        lang === 'vi'
          ? 'Người gửi không thấy tiến trình, không có mã theo dõi, không rõ cơ quan nào chịu trách nhiệm tiếp nhận và giải quyết.'
          : 'Citizens cannot see who owns the case, which agency is assigned, or whether corrective orders were issued.',
      consequence:
        lang === 'vi'
          ? 'Dễ trôi tin, không ai chịu trách nhiệm giải quyết'
          : 'Requests get lost with no accountable handler',
      icon: <UserX className="w-4 h-4 text-[#C72A20]" />,
    },
    {
      num: '03',
      tag: lang === 'vi' ? 'THIẾU TÁI KIỂM' : 'NO REINSPECTION',
      title: lang === 'vi' ? 'Thiếu vòng tái kiểm thực địa' : 'Missing Physical Reinspection',
      desc:
        lang === 'vi'
          ? 'Vụ việc dễ bị đánh dấu "hoàn thành" trên văn bản hành chính trước khi hiện trường thực tế có bất kỳ can thiệp dập bụi nào.'
          : 'Complaints get closed on paper before the construction site actually activates wheel wash stations and cleans the road.',
      consequence:
        lang === 'vi'
          ? 'Bụi bẩn tiếp diễn dù văn bản báo cáo đã đóng'
          : 'Dust persists despite written administrative closure',
      icon: <AlertTriangle className="w-4 h-4 text-[#C72A20]" />,
    },
  ];

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="py-14 sm:py-20 lg:py-24 border-y border-[#E8E1D9] relative overflow-hidden scroll-mt-20 bg-[#FAF7F2]"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER KHU VỰC: RÕ RÀNG, TƯƠNG PHẢN CAO */}
        <div className="max-w-[920px] mb-10 sm:mb-14 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF0EB] border border-[#ECD3C6] text-[#9F241F] text-[11px] sm:text-[12px] font-bold tracking-wider uppercase font-mono shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C72A20]" />
            <span>{lang === 'vi' ? 'THỰC TRẠNG & GIẢI PHÁP' : 'REALITY VS SOLUTION'}</span>
          </div>

          <h2
            className="problem-headline text-[28px] sm:text-[38px] lg:text-[44px] font-black text-[#15171C] tracking-[-0.03em] leading-[1.12]"
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
            className="problem-lead text-[15px] sm:text-[17px] text-[#554D46] leading-[1.65] max-w-[760px] font-normal"
            style={{ textWrap: 'pretty' }}
          >
            {lang === 'vi'
              ? 'Hầu hết ứng dụng dừng lại ở nút gửi tin. Khoảng trống thực sự nằm ở việc lưu vết trách nhiệm và kiểm chứng hiện trường sau can thiệp.'
              : 'Most platforms stop at submission. The real gap lies in maintaining verifiable accountability and physical site follow-up.'}
          </p>
        </div>

        {/* 2 CỘT CÂN ĐỐI: CỘT TRÁI 5/12 COLS / CỘT PHẢI 7/12 COLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* CỘT TRÁI: 3 THẺ VẤN ĐỀ ĐỒNG BỘ, RÕ NÉT, CÂN ĐỐI */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 sm:gap-4">
            {problems.map((item, idx) => (
              <div
                key={idx}
                className="problem-card-item p-5 sm:p-5.5 rounded-2xl bg-white border border-[#E7E0D8] shadow-[0_2px_8px_rgba(20,20,20,0.03)] hover:shadow-[0_6px_20px_rgba(199,42,32,0.06)] hover:border-[#DCA8A2] transition-all duration-200 flex flex-col justify-between space-y-3"
              >
                {/* Header Thẻ */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#FAF0EB] border border-[#ECD3C6] flex items-center justify-center font-mono font-black text-[12px] text-[#C72A20] shrink-0">
                      {item.num}
                    </span>
                    <span className="font-mono text-[10.5px] font-bold text-[#8B7C72] uppercase tracking-wider">
                      {item.tag}
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#EAE3DC] flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                </div>

                {/* Tiêu đề & Nội dung */}
                <div className="space-y-1.5">
                  <h3
                    className="text-[16px] sm:text-[17px] font-bold text-[#15171C] tracking-tight leading-snug"
                    style={{ textWrap: 'pretty' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-[#554D46] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Dòng hệ quả thực tế */}
                <div className="pt-2 border-t border-[#F2ECE4] flex items-center gap-1.5 text-[11.5px] font-medium text-[#991B1B]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] shrink-0" />
                  <span>{item.consequence}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: 2 HỘP QUY TRÌNH ĐỐI CHIẾU SẮC SẢO */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-4 sm:gap-5">
            
            {/* BOX 1: QUY TRÌNH TRUYỀN THỐNG (ĐỨT GÃY) */}
            <div className="flow-container-card p-5 sm:p-6 rounded-2xl bg-white border border-[#E5DDD4] shadow-[0_2px_12px_rgba(20,20,20,0.03)] space-y-3 sm:space-y-4">
              
              {/* Header Box 1 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EAE3] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#EF4444] shrink-0" />
                  <span className="text-[11.5px] sm:text-[12px] font-mono font-bold tracking-wider uppercase text-[#991B1B]">
                    {lang === 'vi' ? 'Quy trình truyền thống (Đứt gãy)' : 'Traditional Flow (Broken)'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#7A6B62] bg-[#F7F2EC] px-2.5 py-0.5 rounded-full border border-[#E7DFD6]">
                  {lang === 'vi' ? 'Dễ thất lạc hồ sơ' : 'High Drop-Off'}
                </span>
              </div>

              {/* 4 Bước đứt gãy */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {/* Bước 1 */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#8A7C72]">01</span>
                    <Camera className="w-3.5 h-3.5 text-[#8A7C72]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#15171C]">
                      {lang === 'vi' ? 'Ảnh rời rạc' : 'Photo taken'}
                    </div>
                    <div className="text-[10.5px] text-[#786B61] mt-0.5">
                      {lang === 'vi' ? 'Lưu trong máy' : 'Unindexed on phone'}
                    </div>
                  </div>
                </div>

                {/* Bước 2 */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#8A7C72]">02</span>
                    <MessageSquare className="w-3.5 h-3.5 text-[#8A7C72]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#15171C]">
                      {lang === 'vi' ? 'Tin nhắn mạng' : 'Chat group'}
                    </div>
                    <div className="text-[10.5px] text-[#786B61] mt-0.5">
                      {lang === 'vi' ? 'Dễ trôi tin' : 'Easily buried'}
                    </div>
                  </div>
                </div>

                {/* Bước 3 */}
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DC] space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#8A7C72]">03</span>
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#8A7C72]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#15171C]">
                      {lang === 'vi' ? 'Sổ sách Excel' : 'Manual Excel'}
                    </div>
                    <div className="text-[10.5px] text-[#786B61] mt-0.5">
                      {lang === 'vi' ? 'Chậm trễ' : 'Delayed batching'}
                    </div>
                  </div>
                </div>

                {/* Bước 4: MẤT DẤU */}
                <div className="p-3 rounded-xl bg-[#FFF5F5] border border-dashed border-[#FCA5A5] space-y-1.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#DC2626]">04 ?</span>
                    <XCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#991B1B]">
                      {lang === 'vi' ? 'Mất dấu' : 'Dropped'}
                    </div>
                    <div className="text-[10.5px] text-[#DC2626] font-semibold mt-0.5">
                      {lang === 'vi' ? 'Không ai tái kiểm' : 'No field check'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dòng cảnh báo chân hộp */}
              <div className="rounded-xl bg-[#FFF5F5] border border-[#FED7D7] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[#991B1B] font-medium text-[11.5px] sm:text-[12px]">
                  <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
                  <span>
                    {lang === 'vi'
                      ? 'Hồ sơ dễ bị đóng trên giấy trong khi ô nhiễm thực tế vẫn tiếp diễn'
                      : 'Cases get closed on paper while physical pollution continues'}
                  </span>
                </span>
                <span className="font-mono text-[10.5px] font-bold text-[#991B1B] bg-[#FEE2E2] px-2 py-0.5 rounded border border-[#FECACA] shrink-0">
                  High Drop-Off
                </span>
              </div>
            </div>

            {/* BOX 2: CHU TRÌNH DUSTGUARD (KHÉP KÍN TOÀN TRÌNH) */}
            <div className="flow-container-card p-5 sm:p-6 rounded-2xl bg-white border-2 border-[#0D6F64]/30 shadow-[0_8px_24px_rgba(13,111,100,0.06)] space-y-3 sm:space-y-4">
              
              {/* Header Box 2 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8F3F1] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0D6F64] shrink-0" />
                  <span className="text-[11.5px] sm:text-[12px] font-mono font-bold tracking-wider uppercase text-[#0D6F64]">
                    {lang === 'vi'
                      ? 'Chu trình DustGuard (Khép kín)'
                      : 'DustGuard Closed-Loop Process'}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#0D6F64] bg-[#E6F4F1] px-2.5 py-0.5 rounded-full border border-[#B2DFD8]">
                  {lang === 'vi' ? 'Mã định danh duy nhất' : 'Single Case ID'}
                </span>
              </div>

              {/* Connected Stepper Pipeline (4 bước khép kín) */}
              <div className="relative pt-0.5">
                {/* Đường nối thanh tiến trình */}
                <div
                  ref={progressBarRef}
                  className="hidden sm:block absolute top-[27px] left-[10%] right-[10%] h-[2px] bg-[#D1EBE6] z-0"
                >
                  <div className="h-full bg-[#0D6F64] w-full" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 relative z-10">
                  {/* Bước 1 */}
                  <div className="p-3 rounded-xl bg-[#F4FAF8] border border-[#D5EBE6] space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#0D6F64]">01</span>
                      <MapPin className="w-3.5 h-3.5 text-[#0D6F64]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#15171C]">
                        {lang === 'vi' ? 'Tọa độ GPS' : 'GPS Location'}
                      </div>
                      <div className="text-[10.5px] text-[#4A5D57] mt-0.5">
                        {lang === 'vi' ? 'Thời gian số WGS84' : 'Digital timestamp'}
                      </div>
                    </div>
                  </div>

                  {/* Bước 2 */}
                  <div className="p-3 rounded-xl bg-[#F4FAF8] border border-[#D5EBE6] space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#0D6F64]">02</span>
                      <SendHorizontal className="w-3.5 h-3.5 text-[#0D6F64]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#15171C]">
                        {lang === 'vi' ? 'Phân công' : 'Dispatched'}
                      </div>
                      <div className="text-[10.5px] text-[#4A5D57] mt-0.5">
                        {lang === 'vi' ? 'Đúng UBND Phường' : 'Direct to Ward'}
                      </div>
                    </div>
                  </div>

                  {/* Bước 3 */}
                  <div className="p-3 rounded-xl bg-[#F4FAF8] border border-[#D5EBE6] space-y-1.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#0D6F64]">03</span>
                      <SprayIcon className="w-3.5 h-3.5 text-[#0D6F64]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#15171C]">
                        {lang === 'vi' ? 'Khắc phục' : 'Remediated'}
                      </div>
                      <div className="text-[10.5px] text-[#4A5D57] mt-0.5">
                        {lang === 'vi' ? 'Rửa xe & dập bụi' : 'Wheel wash active'}
                      </div>
                    </div>
                  </div>

                  {/* Bước 4: TÁI KIỂM 48H */}
                  <div
                    ref={checkBadgeRef}
                    className="p-3 rounded-xl bg-[#E8F8F0] border-2 border-[#10B981] space-y-1.5 flex flex-col justify-between shadow-2xs"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#065F46]">04</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#065F46]">
                        {lang === 'vi' ? 'Tái kiểm 48h' : '48h Verified'}
                      </div>
                      <div className="text-[10.5px] text-[#047857] font-bold mt-0.5">
                        {lang === 'vi' ? 'Đối chứng Trước/Sau' : 'Before/After proof'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dòng bảo chứng chân hộp */}
              <div className="rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <span className="flex items-center gap-2 text-[#065F46] font-semibold text-[12px] sm:text-[12.5px]">
                  <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>
                    {lang === 'vi'
                      ? '100% hồ sơ được lưu vết và theo dõi công khai đến kết quả thực tế'
                      : '100% cases publicly tracked through physical verification'}
                  </span>
                </span>
                <span className="font-mono font-bold text-[10.5px] text-[#065F46] bg-[#DCFCE7] px-2.5 py-0.5 rounded-md border border-[#86EFAC] shrink-0">
                  Closed-Loop
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default ProblemStory;
