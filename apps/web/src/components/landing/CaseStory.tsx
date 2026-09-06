import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  MapPin,
  Check,
  RotateCcw,
  Sparkles,
  Camera,
  Truck,
  Droplets,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface CaseStoryProps {
  lang: 'vi' | 'en';
}

export const CaseStory: React.FC<CaseStoryProps> = ({ lang }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const ambientGridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const evidenceStageRef = useRef<HTMLDivElement>(null);
  const beforeSceneRef = useRef<HTMLDivElement>(null);
  const afterSceneRef = useRef<HTMLDivElement>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);
  const timelineBarRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const badgeRef = useRef<HTMLDivElement>(null);
  const badgeRingRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // State quản lý xem thủ công sau khi animation chính kết thúc
  const [activeView, setActiveView] = useState<'before' | 'after'>('after');
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    // 1. Kiểm tra prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 640;

    if (prefersReducedMotion) {
      // Khi người dùng bật giảm chuyển động: đặt ngay trạng thái cuối cùng
      if (afterSceneRef.current) gsap.set(afterSceneRef.current, { clipPath: 'inset(0% 0% 0% 0%)' });
      if (scanLineRef.current) gsap.set(scanLineRef.current, { opacity: 0 });
      if (timelineBarRef.current) gsap.set(timelineBarRef.current, { scaleY: 1 });
      nodeRefs.current.forEach((n) => n && gsap.set(n, { opacity: 1, scale: 1 }));
      labelRefs.current.forEach((l) => l && gsap.set(l, { opacity: 1, x: 0 }));
      if (badgeRef.current) gsap.set(badgeRef.current, { opacity: 1, scale: 1 });
      if (footerRef.current) gsap.set(footerRef.current, { opacity: 1, y: 0 });
      setAnimationDone(true);
      return;
    }

    // 2. Tạo GSAP Context để cleanup an toàn trong React
    const ctx = gsap.context(() => {
      // Ambient background drifting rất chậm (cực kỳ nhẹ nhàng ~10px trong 20s)
      if (ambientGridRef.current) {
        gsap.to(ambientGridRef.current, {
          x: 10,
          y: -8,
          duration: 20,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // Khởi tạo trạng thái ban đầu
      gsap.set(afterSceneRef.current, { clipPath: 'inset(0% 100% 0% 0%)' });
      gsap.set(scanLineRef.current, { left: '0%', opacity: 0 });
      gsap.set(timelineBarRef.current, { scaleY: 0, transformOrigin: 'top center' });
      gsap.set(badgeRingRef.current, { scale: 0.6, opacity: 0 });

      // Orchestrated Timeline chính: kể câu chuyện trong ~3.8s
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          setAnimationDone(true);
          setActiveView('after');
        },
      });

      // Giai đoạn 0: Card xuất hiện & Before scene hiển thị
      tl.from(cardRef.current, {
        y: 24,
        opacity: 0,
        duration: isMobile ? 0.5 : 0.7,
      })
        .from(
          headerRef.current,
          {
            y: -10,
            opacity: 0,
            duration: 0.4,
          },
          '-=0.3'
        )
        .from(
          beforeSceneRef.current,
          {
            scale: 1.02,
            opacity: 0,
            duration: 0.5,
          },
          '-=0.2'
        )

        // Giai đoạn 1: 01 Phát hiện (0.6s)
        .to(nodeRefs.current[0], { opacity: 1, scale: 1.1, duration: 0.25 })
        .to(nodeRefs.current[0], { scale: 1, duration: 0.15 })
        .to(labelRefs.current[0], { opacity: 1, x: 0, duration: 0.3 }, '<')

        // Giai đoạn 2: Tiến trình kéo xuống 02 Tiếp nhận (1.2s)
        .to(timelineBarRef.current, { scaleY: 0.35, duration: 0.4, ease: 'power2.inOut' })
        .to(nodeRefs.current[1], { opacity: 1, scale: 1.1, duration: 0.25 })
        .to(nodeRefs.current[1], { scale: 1, duration: 0.15 })
        .to(labelRefs.current[1], { opacity: 1, x: 0, duration: 0.3 }, '<')

        // Giai đoạn 3: Tiến trình kéo xuống 03 Khắc phục (1.8s)
        .to(timelineBarRef.current, { scaleY: 0.68, duration: 0.4, ease: 'power2.inOut' })
        .to(nodeRefs.current[2], { opacity: 1, scale: 1.1, duration: 0.25 })
        .to(nodeRefs.current[2], { scale: 1, duration: 0.15 })
        .to(labelRefs.current[2], { opacity: 1, x: 0, duration: 0.3 }, '<')

        // Giai đoạn 4: MÀN WIPE THỰC ĐỊA BEFORE -> AFTER (2.4s -> 3.3s)
        .set(scanLineRef.current, { opacity: 1 })
        .to(
          afterSceneRef.current,
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: isMobile ? 0.8 : 1.0,
            ease: 'power2.inOut',
          },
          'wipe'
        )
        .to(
          scanLineRef.current,
          {
            left: '100%',
            duration: isMobile ? 0.8 : 1.0,
            ease: 'power2.inOut',
          },
          'wipe'
        )
        .to(scanLineRef.current, { opacity: 0, duration: 0.2 })

        // Giai đoạn 5: Tiến trình chạm 04 Tái kiểm (3.3s)
        .to(timelineBarRef.current, { scaleY: 1, duration: 0.3, ease: 'power2.inOut' }, 'wipe+=0.5')
        .to(nodeRefs.current[3], { opacity: 1, scale: 1.15, duration: 0.25 }, 'wipe+=0.7')
        .to(nodeRefs.current[3], { scale: 1, duration: 0.15 })
        .to(labelRefs.current[3], { opacity: 1, x: 0, duration: 0.3 }, '<')

        // Giai đoạn 6: Status Badge Verified bung nở nhẹ (3.6s)
        .from(
          badgeRef.current,
          {
            scale: 0.85,
            opacity: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
          },
          '-=0.1'
        )
        .to(
          badgeRingRef.current,
          {
            scale: 1.7,
            opacity: 0.3,
            duration: 0.25,
            ease: 'power2.out',
          },
          '<0.1'
        )
        .to(
          badgeRingRef.current,
          {
            opacity: 0,
            duration: 0.3,
          },
          '>-0.1'
        )

        // Giai đoạn 7: Footer xác nhận khép kín toàn trình (3.9s)
        .from(
          footerRef.current,
          {
            y: 8,
            opacity: 0,
            duration: 0.35,
          },
          '-=0.2'
        );
    }, containerRef);

    // 3. Micro-interactions Parallax trên desktop (max 4px / 0.3deg)
    const cardEl = cardRef.current;
    if (cardEl && !isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        const rect = cardEl.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(cardEl, {
          rotateY: x * 0.4,
          rotateX: -y * 0.4,
          y: -4,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardEl, {
          rotateY: 0,
          rotateX: 0,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
      };

      cardEl.addEventListener('mousemove', handleMouseMove);
      cardEl.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        cardEl.removeEventListener('mousemove', handleMouseMove);
        cardEl.removeEventListener('mouseleave', handleMouseLeave);
        ctx.revert();
      };
    }

    return () => ctx.revert();
  }, []);

  // Handler chuyển đổi so sánh thủ công Before / After bằng GSAP
  const handleToggleView = () => {
    if (!afterSceneRef.current) return;

    if (activeView === 'after') {
      gsap.to(afterSceneRef.current, {
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: () => setActiveView('before'),
      });
    } else {
      gsap.to(afterSceneRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: () => setActiveView('after'),
      });
    }
  };

  const stages = [
    { num: '01', title: lang === 'vi' ? 'Phát hiện' : 'Detection', time: '05/09 · 08:15' },
    { num: '02', title: lang === 'vi' ? 'Tiếp nhận' : 'Triage', time: '05/09 · 09:30' },
    { num: '03', title: lang === 'vi' ? 'Khắc phục' : 'Remediate', time: '06/09 · 14:00' },
    { num: '04', title: lang === 'vi' ? 'Tái kiểm' : 'Reinspect', time: '07/09 · 08:40', isFinal: true },
  ];

  return (
    <div ref={containerRef} className="relative w-full max-w-[510px] mx-auto py-2 overflow-hidden">
      {/* 1. SUBTLE MAP / CIVIC DATA BACKGROUND (3-6% Opacity Drift) */}
      <div
        ref={ambientGridRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-5 overflow-hidden select-none"
      >
        <svg className="w-full h-full text-[#0F172A]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="civic-grid-ts" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="24" cy="24" r="1.5" fill="currentColor" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#civic-grid-ts)" />
          <line x1="10%" y1="20%" x2="90%" y2="85%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 6" />
          <line x1="80%" y1="15%" x2="20%" y2="90%" stroke="currentColor" strokeWidth="1.2" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* 2. MAIN LIVING CASE CARD */}
      <div
        ref={cardRef}
        className="relative z-10 w-full bg-white rounded-[26px] border border-[#E2DCD5] shadow-[0_18px_45px_rgba(30,41,59,0.07)] overflow-visible transition-shadow"
      >
        {/* CHIP TRÀN VIỀN NHẸ (+14px) - EDITORIAL DEPTH */}
        <div className="absolute -top-3 left-6 z-20 px-3 py-0.5 rounded-full bg-[#0F172A] text-white text-[11px] font-mono tracking-wider shadow-sm flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-pulse" />
          <span>LIVE CASE · GPS 20.9852° N</span>
        </div>

        {/* CARD HEADER */}
        <div
          ref={headerRef}
          className="pt-5 px-4 sm:px-6 pb-3.5 bg-[#FAF7F2] rounded-t-[26px] border-b border-[#EAE6DF] flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="font-mono text-[12px] sm:text-[13px] font-black text-[#0F172A] tracking-tight whitespace-nowrap shrink-0">
              DG-2026-OP-014
            </span>
            <span className="text-[#94A3B8] text-[12px] shrink-0">·</span>
            <span className="text-[11px] sm:text-[12px] font-semibold text-[#64748B] flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-[#B42318] shrink-0" />
              <span className="truncate">Nút giao Kim Đồng</span>
            </span>
          </div>

          {/* VERIFIED BADGE WITH GSAP SCALE + RIPPLE RING */}
          <div className="relative shrink-0">
            <div
              ref={badgeRingRef}
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#10B981]"
            />
            <div
              ref={badgeRef}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[10px] sm:text-[11px] font-bold shadow-2xs whitespace-nowrap"
            >
              <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
              <span>{lang === 'vi' ? 'Đã tái kiểm' : 'Verified'}</span>
            </div>
          </div>
        </div>

        {/* 3. LARGE EVIDENCE STAGE — BEFORE / AFTER SHARED FRAME */}
        <div className="p-5 sm:p-6 space-y-5">
          
          <div
            ref={evidenceStageRef}
            className="relative h-48 sm:h-52 w-full rounded-[18px] overflow-hidden border border-[#E2DCD5] shadow-inner bg-[#1E293B]"
          >
            {/* --- SCENE A: BEFORE --- */}
            <div
              ref={beforeSceneRef}
              className="absolute inset-0 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]/70 flex flex-col justify-between p-4 select-none"
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/75 text-white font-mono text-[10px]">
                  <Camera className="w-3 h-3 text-[#F59E0B]" />
                  <span>05/09 · 08:15:22</span>
                </div>
                <span className="font-bold text-[#B42318] bg-white/90 px-2 py-0.5 rounded text-[10px] border border-red-200 uppercase tracking-wider">
                  {lang === 'vi' ? 'Lúc phát hiện' : 'Before'}
                </span>
              </div>

              <div className="relative py-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-800 shrink-0">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[13px] sm:text-[14px] font-bold text-[#78350F] leading-snug">
                    {lang === 'vi'
                      ? 'Bụi phát sinh khi xe chở đất rời công trình.'
                      : 'Dust clouds generated by trucks departing site.'}
                  </p>
                  <p className="text-[11px] text-[#B45309]">
                    {lang === 'vi' ? 'Bụi cuốn mù mịt · Chưa bật vòi xịt rửa bánh' : 'No tire washing · Heavy airborne dust'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#92400E] font-medium pt-1 border-t border-amber-300/40">
                <span>{lang === 'vi' ? 'Nguồn: Công dân quan sát' : 'Source: Citizen report'}</span>
                <span className="italic">{lang === 'vi' ? 'Dữ liệu minh họa' : 'Sample Data'}</span>
              </div>
            </div>

            {/* --- SCENE B: AFTER (WITH GSAP CLIP-PATH WIPE) --- */}
            <div
              ref={afterSceneRef}
              className="absolute inset-0 bg-gradient-to-br from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]/60 flex flex-col justify-between p-4 select-none z-10"
              style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#064E3B] text-white font-mono text-[10px]">
                  <ShieldCheck className="w-3 h-3 text-[#34D399]" />
                  <span>07/09 · 08:40:15 (48h)</span>
                </div>
                <span className="font-bold text-[#065F46] bg-white/90 px-2 py-0.5 rounded text-[10px] border border-emerald-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#10B981]" />
                  {lang === 'vi' ? 'Sau tái kiểm' : 'After'}
                </span>
              </div>

              <div className="relative py-2 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-600/40 flex items-center justify-center text-emerald-800 shrink-0">
                  <Droplets className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[13px] sm:text-[14px] font-bold text-[#065F46] leading-snug">
                    {lang === 'vi'
                      ? 'Đã bổ sung rửa bánh xe và làm ẩm mặt đường.'
                      : 'High-pressure wheel wash deployed & pavement watered.'}
                  </p>
                  <p className="text-[11px] text-[#047857]">
                    {lang === 'vi' ? 'Biên bản BB-TTMT-092/2026 · Mặt đường sạch' : 'Inspection compliant · Surface cleaned'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#065F46] font-medium pt-1 border-t border-emerald-300/50">
                <span>{lang === 'vi' ? 'Nghiệm thu: Cán bộ địa bàn' : 'Verified: Ward Officer'}</span>
                <span className="font-mono text-[#059669] font-bold">BB-TTMT-092</span>
              </div>
            </div>

            {/* SCANNING WIPE LINE */}
            <div
              ref={scanLineRef}
              aria-hidden="true"
              className="pointer-events-none absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.9),0_0_4px_#10B981] z-20 -translate-x-1/2"
            />

            {/* USER MANUAL TOGGLE (Touch target >= 44px) */}
            {animationDone && (
              <button
                type="button"
                onClick={handleToggleView}
                className="absolute bottom-2.5 right-2.5 z-30 min-h-[44px] px-3.5 py-2 rounded-xl bg-white text-[#0F172A] border border-[#CBD5E1] shadow-md text-[12px] font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer hover:bg-[#FAF7F2]"
                title={lang === 'vi' ? 'Nhấn để chuyển đổi xem Before / After' : 'Toggle Before / After'}
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#B42318] shrink-0" />
                <span>
                  {activeView === 'after'
                    ? lang === 'vi'
                      ? 'Xem lúc phát hiện'
                      : 'View Before'
                    : lang === 'vi'
                    ? 'Xem sau xử lý'
                    : 'View After'}
                </span>
              </button>
            )}
          </div>

          {/* 4. THE 4-STAGE LINEAR PROCESS TIMELINE (GSAP ANIMATED) */}
          <div className="relative pl-6 py-1">
            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#E2DCD5]" />

            <div
              ref={timelineBarRef}
              className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-[#B42318] origin-top"
            />

            <div className="space-y-3.5">
              {stages.map((stage, idx) => (
                <div key={idx} className="relative flex items-center justify-between text-[13px]">
                  <div
                    ref={(el) => (nodeRefs.current[idx] = el)}
                    className={`absolute -left-[23px] w-4 h-4 rounded-full flex items-center justify-center border-2 transition-colors ${
                      stage.isFinal
                        ? 'bg-white border-[#10B981] text-[#10B981]'
                        : 'bg-white border-[#B42318] text-[#B42318]'
                    }`}
                    style={{ opacity: 0.35, transform: 'scale(0.8)' }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        stage.isFinal ? 'bg-[#10B981]' : 'bg-[#B42318]'
                      }`}
                    />
                  </div>

                  <div
                    ref={(el) => (labelRefs.current[idx] = el)}
                    className="flex items-center justify-between w-full pr-1"
                    style={{ opacity: 0.4, transform: 'translateX(-4px)' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[11px] text-[#94A3B8]">
                        {stage.num}
                      </span>
                      <span
                        className={`font-semibold ${
                          stage.isFinal ? 'text-[#065F46] font-bold' : 'text-[#1E293B]'
                        }`}
                      >
                        {stage.title}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#64748B]">
                      {stage.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* 5. CARD FOOTER */}
        <div
          ref={footerRef}
          className="px-4 sm:px-6 py-3 bg-[#FAF7F2] rounded-b-[26px] border-t border-[#EAE6DF] flex items-center justify-between gap-2 text-[11px] sm:text-[12px]"
        >
          <span className="text-[#065F46] font-semibold flex items-center gap-1.5 truncate">
            <Check className="w-4 h-4 text-[#10B981] shrink-0" />
            <span className="truncate">{lang === 'vi' ? 'Hồ sơ đã khép kín toàn trình' : 'Closed-loop audit verified'}</span>
          </span>
          <span className="text-[10px] sm:text-[11px] font-mono text-[#64748B] flex items-center gap-1 shrink-0">
            <Eye className="w-3 h-3 text-[#94A3B8]" />
            <span>{lang === 'vi' ? 'Minh chứng công khai' : 'Public audit'}</span>
          </span>
        </div>

      </div>
    </div>
  );
};
