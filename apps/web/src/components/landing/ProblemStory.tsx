import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  XCircle,
  AlertTriangle,
  Check,
  Camera,
  MessageSquare,
  FileSpreadsheet,
  ShieldCheck,
  Layers,
  UserX,
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
            // Hiệu ứng entrance dứt khoát, nhanh gọn (<0.6s) và luôn clearProps
            gsap.fromTo(
              '.problem-headline',
              { y: 20, opacity: 0 },
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
                { scale: 0.88, opacity: 0.8 },
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
      title: lang === 'vi' ? 'Dữ liệu phân mảnh, không cấu trúc' : 'Fragmented Unstructured Data',
      desc:
        lang === 'vi'
          ? 'Ảnh chụp nằm rải rác trên mạng xã hội, tin nhắn hoặc hòm thư mà không có tọa độ GPS, dấu thời gian số hay mã kiểm chứng.'
          : 'Photos scatter across chats and social media without verifiable GPS, timestamps, or cryptographic digests.',
      icon: <Layers className="w-[18px] h-[18px] text-[#C72A20]" />,
    },
    {
      num: '02',
      title: lang === 'vi' ? 'Mù mờ trách nhiệm xử lý' : 'Opaque Accountability',
      desc:
        lang === 'vi'
          ? 'Người gửi không thấy tiến trình, không có mã theo dõi, không rõ cơ quan nào chịu trách nhiệm tiếp nhận và giải quyết.'
          : 'Citizens cannot see who owns the case, which agency is assigned, or whether corrective orders were issued.',
      icon: <UserX className="w-[18px] h-[18px] text-[#C72A20]" />,
    },
    {
      num: '03',
      title: lang === 'vi' ? 'Thiếu vòng tái kiểm thực địa' : 'Missing Physical Reinspection',
      desc:
        lang === 'vi'
          ? 'Vụ việc dễ bị đánh dấu "hoàn thành" trên văn bản hành chính trước khi hiện trường thực tế có bất kỳ can thiệp dập bụi nào.'
          : 'Complaints get closed on paper before the construction site actually activates wheel wash stations and cleans the road.',
      icon: <AlertTriangle className="w-[18px] h-[18px] text-[#C72A20]" />,
    },
  ];

  return (
    <section
      id="problem"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 border-y border-[#E7DED6] relative overflow-hidden scroll-mt-20"
      style={{
        background:
          'radial-gradient(circle at 76% 45%, rgba(199, 42, 32, 0.045), transparent 30%), #F8F3ED',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 relative z-10">
        {/* EDITORIAL HEADER: CHỮ ĐẬM SẮC NÉT, DÒNG 2 ĐỎ DUSTGUARD */}
        <div className="max-w-[960px] mb-10 sm:mb-12 lg:mb-14 space-y-3.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF6F0] border border-[#E7DED6] text-[#8B322C] text-[12px] font-bold tracking-wider uppercase font-mono shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C72A20]" />
            <span>{lang === 'vi' ? 'THỰC TRẠNG HIỆN HỮU' : 'THE REAL-WORLD GAP'}</span>
          </div>

          <h2
            className="problem-headline text-[30px] sm:text-[40px] lg:text-[46px] font-black text-[#15171C] tracking-[-0.035em] leading-[1.04]"
            style={{ textWrap: 'pretty' }}
          >
            {lang === 'vi' ? (
              <>
                Phản ánh không khó. <br />
                <span className="text-[#C72A20]">Theo dõi đến kết quả mới khó.</span>
              </>
            ) : (
              <>
                Reporting is easy. <br />
                <span className="text-[#C72A20]">Tracking through resolution is hard.</span>
              </>
            )}
          </h2>

          <p
            className="problem-lead text-[16px] sm:text-[17.5px] text-[#524A43] leading-[1.65] max-w-[750px] font-normal"
            style={{ textWrap: 'pretty' }}
          >
            {lang === 'vi'
              ? 'Hầu hết ứng dụng dừng lại ở nút gửi tin. Khoảng trống thực sự nằm ở việc lưu vết trách nhiệm và kiểm chứng hiện trường sau can thiệp.'
              : 'Most platforms stop at submission. The real gap lies in maintaining verifiable accountability and physical site follow-up.'}
          </p>
        </div>

        {/* 2 CỘT CÂN ĐỐI: TRÁI ~40% (5/12 COLS) / PHẢI ~60% (7/12 COLS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-11 items-stretch">
          {/* CỘT TRÁI (5/12 COLS): 3 THẺ VẤN ĐỀ RÕ RÀNG, SẮC SẢO, OPACITY = 1 */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-4.5 sm:gap-5">
            {problems.map((item, idx) => {
              // Card 01 & 03: white warm tint. Card 02: slightly warmer red tint
              const isCard02 = idx === 1;
              return (
                <div
                  key={idx}
                  className={`problem-card-item flex-1 p-5.5 sm:p-6.5 rounded-[22px] border shadow-[0_10px_30px_rgba(40,25,15,0.045)] flex flex-col justify-between space-y-2.5 transition-all duration-200 hover:border-[#C72A20]/40 ${
                    isCard02
                      ? 'bg-[#FFF9F6] border-[#E8C8C0]'
                      : 'bg-white/90 border-[rgba(145,110,90,0.20)]'
                  }`}
                  style={{ opacity: 1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-[32px] h-[32px] rounded-full bg-white border border-[#E2D5CC] flex items-center justify-center font-mono font-black text-[13px] text-[#C72A20] shadow-2xs shrink-0">
                        {item.num}
                      </span>
                      <h3
                        className="text-[17px] sm:text-[18px] font-bold text-[#15171C] tracking-tight leading-[1.35]"
                        style={{ textWrap: 'pretty' }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <div className="p-1.5 rounded-lg bg-[#FAF6F0] border border-[#E7DED6] shrink-0">
                      {item.icon}
                    </div>
                  </div>
                  <p className="text-[14.5px] sm:text-[15px] text-[#524A43] leading-[1.65] max-w-[480px] pl-[44px]">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CỘT PHẢI (7/12 COLS): SƠ ĐỒ ĐỐI CHIẾU SONG SONG — GỌN GÀNG, SẮC SẢO */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5 sm:gap-6">
            {/* BOX 1: QUY TRÌNH HIỆN NAY (ĐỨT GÃY) */}
            <div
              className="flow-container-card p-5 sm:p-6.5 rounded-[22px] bg-white/90 border border-[#E2DCD5] shadow-[0_8px_24px_rgba(40,25,15,0.04)] space-y-3.5 sm:space-y-4"
              style={{ opacity: 1 }}
            >
              {/* Header Box 1 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7DED6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#DC2626] shrink-0" />
                  <span className="text-[12px] font-mono font-bold tracking-wider uppercase text-[#DC2626]">
                    {lang === 'vi' ? 'Quy trình truyền thống (Đứt gãy)' : 'Traditional Flow (Broken)'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#7A6B62] bg-[#FAF6F0] px-2.5 py-0.5 rounded-full border border-[#E7DED6] whitespace-nowrap">
                  {lang === 'vi' ? 'Dễ thất lạc hồ sơ' : 'High drop-off'}
                </span>
              </div>

              {/* Connected Stepper Pipeline (4 bước) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-0.5">
                {/* Bước 1 */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#E7DED6] space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#7A6B62]">01</span>
                    <Camera className="w-3.5 h-3.5 text-[#7A6B62]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#15171C]">
                      {lang === 'vi' ? 'Ảnh rời rạc' : 'Photo taken'}
                    </div>
                    <div className="text-[10.5px] text-[#7A6B62] mt-0.5">
                      {lang === 'vi' ? 'Lưu trong máy' : 'On mobile phone'}
                    </div>
                  </div>
                </div>

                {/* Bước 2 */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#E7DED6] space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#7A6B62]">02</span>
                    <MessageSquare className="w-3.5 h-3.5 text-[#7A6B62]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#15171C]">
                      {lang === 'vi' ? 'Tin nhắn mạng' : 'Chat group'}
                    </div>
                    <div className="text-[10.5px] text-[#7A6B62] mt-0.5">
                      {lang === 'vi' ? 'Dễ trôi tin' : 'Easily buried'}
                    </div>
                  </div>
                </div>

                {/* Bước 3 */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-white border border-[#E7DED6] space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#7A6B62]">03</span>
                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#7A6B62]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#15171C]">
                      {lang === 'vi' ? 'Sổ sách Excel' : 'Manual Excel'}
                    </div>
                    <div className="text-[10.5px] text-[#7A6B62] mt-0.5">
                      {lang === 'vi' ? 'Chậm trễ' : 'Delayed input'}
                    </div>
                  </div>
                </div>

                {/* Bước 4: ĐỨT GÃY TẠI ĐÂY */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#FEE2E2] border border-dashed border-[#EF4444] space-y-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono font-bold text-[#C72A20]">04 ?</span>
                    <XCircle className="w-3.5 h-3.5 text-[#DC2626]" />
                  </div>
                  <div>
                    <div className="text-[12px] font-bold text-[#C72A20]">
                      {lang === 'vi' ? 'Mất dấu' : 'Dropped'}
                    </div>
                    <div className="text-[10.5px] text-[#991B1B] font-semibold mt-0.5">
                      {lang === 'vi' ? 'Không ai tái kiểm' : 'No field check'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dòng tóm tắt đứt gãy */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[#7A6B62] border-t border-[#E7DED6]">
                <span className="flex items-center gap-1.5 text-[#C72A20] font-medium text-[11.5px] sm:text-[12px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] shrink-0" />
                  {lang === 'vi'
                    ? 'Hồ sơ dễ đóng trên giấy trong khi ô nhiễm vẫn tiếp diễn'
                    : 'Closed on paper while site pollution continues'}
                </span>
                <span className="font-mono text-[11px] text-[#8B8178] bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#E7DED6] shrink-0">
                  High Drop-Off
                </span>
              </div>
            </div>

            {/* BOX 2: CHU TRÌNH DUSTGUARD (KHÉP KÍN TOÀN TRÌNH) */}
            <div
              className="flow-container-card p-5 sm:p-6.5 rounded-[22px] bg-white border-[1.5px] border-[rgba(199,42,32,0.28)] shadow-[0_14px_45px_rgba(199,42,32,0.07)] space-y-3.5 sm:space-y-4"
              style={{ opacity: 1 }}
            >
              {/* Header Box 2 */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7DED6] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C72A20] shrink-0" />
                  <span className="text-[12px] font-mono font-bold tracking-wider uppercase text-[#C72A20]">
                    {lang === 'vi'
                      ? 'Chu trình DustGuard (Khép kín)'
                      : 'DustGuard Closed-Loop Process'}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#C72A20] bg-[#FDE8E6] px-2.5 py-0.5 rounded-full border border-[#F8D3D1] whitespace-nowrap">
                  {lang === 'vi' ? 'Mã định danh duy nhất' : 'Single Case ID'}
                </span>
              </div>

              {/* Progress Line Connector */}
              <div className="relative pt-0.5">
                <div
                  ref={progressBarRef}
                  className="hidden sm:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-[#E7DED6] z-0"
                >
                  <div className="h-full bg-[#C72A20]/40 w-full" />
                </div>

                {/* Connected Stepper Pipeline (4 bước khép kín) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 relative z-10">
                  {/* Bước 1 */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D9] space-y-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#C72A20]">01</span>
                      <span className="w-2 h-2 rounded-full bg-[#C72A20]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#15171C]">
                        {lang === 'vi' ? 'Tọa độ GPS' : 'GPS Location'}
                      </div>
                      <div className="text-[10.5px] text-[#524A43] mt-0.5">
                        {lang === 'vi' ? 'Thời gian số WGS84' : 'Digital timestamp'}
                      </div>
                    </div>
                  </div>

                  {/* Bước 2 */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D9] space-y-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#C72A20]">02</span>
                      <span className="w-2 h-2 rounded-full bg-[#C72A20]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#15171C]">
                        {lang === 'vi' ? 'Phân công' : 'Dispatched'}
                      </div>
                      <div className="text-[10.5px] text-[#524A43] mt-0.5">
                        {lang === 'vi' ? 'Đúng UBND Phường' : 'Direct to Ward'}
                      </div>
                    </div>
                  </div>

                  {/* Bước 3 */}
                  <div className="p-3 sm:p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E1D9] space-y-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#C72A20]">03</span>
                      <span className="w-2 h-2 rounded-full bg-[#C72A20]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#15171C]">
                        {lang === 'vi' ? 'Khắc phục' : 'Remediated'}
                      </div>
                      <div className="text-[10.5px] text-[#524A43] mt-0.5">
                        {lang === 'vi' ? 'Rửa xe & dập bụi' : 'Wheel wash active'}
                      </div>
                    </div>
                  </div>

                  {/* Bước 4: TÁI KIỂM & NGHIỆM THU */}
                  <div
                    ref={checkBadgeRef}
                    className="p-3 sm:p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-1 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono font-bold text-[#065F46]">04</span>
                      <Check className="w-3.5 h-3.5 text-[#059669] stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#065F46]">
                        {lang === 'vi' ? 'Tái kiểm 48h' : '48h Verified'}
                      </div>
                      <div className="text-[10.5px] text-[#047857] font-semibold mt-0.5">
                        {lang === 'vi' ? 'Đối chứng Before/After' : 'Before/After proof'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dòng tóm tắt khép kín — System Verification State */}
              <div className="rounded-xl bg-[#F0FDF4]/95 border border-[#BBF7D0] px-3.5 sm:px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <span className="flex items-center gap-2 text-[#065F46] font-semibold text-[12px] sm:text-[13px]">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#059669] shrink-0" />
                  <span>
                    {lang === 'vi'
                      ? '100% hồ sơ được lưu vết và theo dõi công khai đến kết quả thực tế'
                      : '100% audit trail publicly tracked through resolution'}
                  </span>
                </span>
                <span className="font-mono font-bold text-[11px] text-[#065F46] bg-[#DCFCE7] px-2.5 py-0.5 sm:py-1 rounded-md border border-[#86EFAC] shrink-0">
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
