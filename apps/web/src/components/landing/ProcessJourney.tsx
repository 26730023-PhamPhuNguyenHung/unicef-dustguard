import React from 'react';
import { ArrowRight, ArrowDown, Check } from 'lucide-react';

interface ProcessJourneyProps {
  lang: 'vi' | 'en';
}

export const ProcessJourney: React.FC<ProcessJourneyProps> = ({ lang }) => {
  const steps = [
    {
      num: '01',
      name: lang === 'vi' ? 'Phát hiện' : 'Detect',
      desc:
        lang === 'vi'
          ? 'Người dân chụp ảnh hiện trường có định vị GPS và dấu thời gian thực.'
          : 'Citizens capture site photo with verified GPS location and real timestamp.',
      highlight: false,
    },
    {
      num: '02',
      name: lang === 'vi' ? 'Tạo hồ sơ' : 'Create Case',
      desc:
        lang === 'vi'
          ? 'Hệ thống tự động cấp mã định danh duy nhất và mở hồ sơ theo dõi.'
          : 'System generates unique case ID and initializes open tracking profile.',
      highlight: false,
    },
    {
      num: '03',
      name: lang === 'vi' ? 'Phân công' : 'Assign',
      desc:
        lang === 'vi'
          ? 'Chuyển thông tin tới đúng đơn vị phụ trách địa bàn và đơn vị thi công.'
          : 'Dispatched directly to accountable ward officers and site supervisors.',
      highlight: false,
    },
    {
      num: '04',
      name: lang === 'vi' ? 'Xử lý' : 'Remediate',
      desc:
        lang === 'vi'
          ? 'Đơn vị thi công khắc phục: rửa bánh xe, che chắn, tưới nước dập bụi.'
          : 'Contractors take corrective action: wheel wash, tarp cover, and watering.',
      highlight: false,
    },
    {
      num: '05',
      name: lang === 'vi' ? 'Tái kiểm' : 'Reinspect',
      desc:
        lang === 'vi'
          ? 'Kiểm tra thực địa đối chiếu ảnh trước/sau và hoàn tất đóng hồ sơ.'
          : 'Field follow-up verifying before/after evidence to accountably close case.',
      highlight: true, // Stage chốt hạ đặc trưng của DustGuard
    },
  ];

  return (
    <section id="process" className="py-20 md:py-28 bg-[#FBF9F5]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        
        {/* EDITORIAL HEADING */}
        <div className="max-w-3xl mb-16 md:mb-20 space-y-4">
          <span className="text-[12px] font-mono font-bold tracking-widest uppercase text-[#B42318]">
            {lang === 'vi' ? 'HÀNH TRÌNH MINH BẠCH' : 'TRANSPARENT JOURNEY'}
          </span>
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-black text-[#0F172A] tracking-[-0.02em] leading-[1.1] text-balance">
            {lang === 'vi' ? (
              <>
                Một phản ánh. <br />
                Một hồ sơ. <br />
                <span className="text-[#B42318]">Một hành trình xử lý.</span>
              </>
            ) : (
              <>
                One observation. <br />
                One record. <br />
                <span className="text-[#B42318]">One verified resolution path.</span>
              </>
            )}
          </h2>
          <p className="text-[17px] text-[#475569] leading-relaxed max-w-[620px]">
            {lang === 'vi'
              ? 'Không có bước nào rơi vào im lặng. Mọi giai đoạn đều có mốc thời gian và trách nhiệm rõ ràng.'
              : 'Zero dropped steps. Every phase carries transparent ownership and verifiable timestamps.'}
          </p>
        </div>

        {/* DESKTOP HORIZONTAL JOURNEY (>= lg) */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-6 relative">
          
          {/* Connector Line behind steps */}
          <div className="absolute top-[28px] left-[5%] right-[5%] h-[2px] bg-[#E2DCD5] z-0" />

          {steps.map((step, idx) => (
            <div key={idx} className="relative z-10 flex flex-col space-y-4">
              
              {/* Node Indicator */}
              <div className="flex items-center">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-black text-[15px] transition-all shadow-xs ${
                    step.highlight
                      ? 'bg-[#B42318] text-white ring-4 ring-[#B42318]/15'
                      : 'bg-white border-2 border-[#E2DCD5] text-[#0F172A]'
                  }`}
                >
                  {step.num}
                </div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 flex justify-center text-[#94A3B8]">
                    <ArrowRight className="w-4 h-4 opacity-40" />
                  </div>
                )}
              </div>

              {/* Text Information */}
              <div className="space-y-1.5 pr-2">
                <div className="flex items-center gap-1.5">
                  <h3
                    className={`text-[17px] font-extrabold tracking-tight ${
                      step.highlight ? 'text-[#B42318]' : 'text-[#0F172A]'
                    }`}
                  >
                    {step.name}
                  </h3>
                  {step.highlight && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#B42318] inline-block" />
                  )}
                </div>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  {step.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* MOBILE & TABLET VERTICAL JOURNEY (< lg) */}
        <div className="lg:hidden space-y-8 relative pl-6 border-l-2 border-[#E2DCD5] ml-4">
          {steps.map((step, idx) => (
            <div key={idx} className="relative space-y-2">
              {/* Timeline dot */}
              <div
                className={`absolute -left-[35px] top-0 w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-[12px] shadow-2xs ${
                  step.highlight
                    ? 'bg-[#B42318] text-white ring-4 ring-[#B42318]/20'
                    : 'bg-white border border-[#CBD5E1] text-[#0F172A]'
                }`}
              >
                {step.num}
              </div>

              <div className="space-y-1">
                <h3
                  className={`text-[16px] font-extrabold tracking-tight ${
                    step.highlight ? 'text-[#B42318]' : 'text-[#0F172A]'
                  }`}
                >
                  {step.name}
                </h3>
                <p className="text-[14px] text-[#475569] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
