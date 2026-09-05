import React, { useState } from 'react';
import { Send, ArrowRight, CheckCircle2, Clock, MapPin, BarChart3, X } from 'lucide-react';

interface PilotCTAProps {
  lang: 'vi' | 'en';
}

export const PilotCTA: React.FC<PilotCTAProps> = ({ lang }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const bullets = [
    {
      icon: <Clock className="w-4 h-4 text-[#B42318]" />,
      text: lang === 'vi' ? 'Thời gian: 4–8 tuần thử nghiệm' : 'Duration: 4–8 weeks pilot',
    },
    {
      icon: <MapPin className="w-4 h-4 text-[#B42318]" />,
      text: lang === 'vi' ? 'Quy mô giới hạn: 1 phường hoặc tuyến đường trọng điểm' : 'Scope: 1 ward or major corridor',
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-[#B42318]" />,
      text: lang === 'vi' ? 'Mục tiêu: Đo lường quy trình trước, mở rộng sau' : 'Goal: Validate workflow before scaling',
    },
  ];

  return (
    <section id="pilot" className="py-20 md:py-28 bg-[#F4EFEA] border-t border-[#E8E1D9]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        
        {/* EDITORIAL BANNER BOX */}
        <div className="bg-white rounded-3xl border border-[#E2DCD5] p-8 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
          
          <div className="max-w-3xl space-y-6">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE6DF] text-[#78350F] text-[12px] font-bold tracking-wider uppercase font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]" />
              <span>{lang === 'vi' ? 'HỢP TÁC TRIỂN KHAI PILOT' : 'PILOT COLLABORATION'}</span>
            </div>

            {/* Headline */}
            <h2 className="text-[36px] sm:text-[46px] lg:text-[54px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.05] text-balance">
              {lang === 'vi' ? (
                <>
                  Đưa DustGuard vào <br />
                  <span className="text-[#B42318]">một khu vực thật.</span>
                </>
              ) : (
                <>
                  Deploy DustGuard into <br />
                  <span className="text-[#B42318]">a real-world district.</span>
                </>
              )}
            </h2>

            {/* Copy */}
            <p className="text-[17px] sm:text-[19px] text-[#475569] leading-relaxed max-w-[620px]">
              {lang === 'vi'
                ? 'Chúng tôi đang tìm đối tác địa phương để thử nghiệm quy trình: phản ánh → xử lý → tái kiểm trong phạm vi nhỏ trước khi mở rộng diện rộng.'
                : 'We are seeking local district partners to validate the civic loop: report → remediate → reinspect in a targeted pilot.'}
            </p>

            {/* 3 Bullets nhỏ */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-2 text-[14px] text-[#334155] font-medium">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {b.icon}
                  <span>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="h-12 px-7 rounded-xl bg-[#B42318] hover:bg-[#91180D] text-white font-bold text-[15px] shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Đăng ký Pilot' : 'Apply for Pilot'}</span>
              </button>

              <a
                href="#process"
                className="h-12 px-5 rounded-xl bg-transparent hover:bg-[#FAF7F2] text-[#0F172A] font-semibold text-[15px] flex items-center justify-center gap-1.5 transition-colors border border-[#E2DCD5]"
              >
                <span>{lang === 'vi' ? 'Xem phạm vi thử nghiệm' : 'View pilot scope'}</span>
                <ArrowRight className="w-4 h-4 text-[#B42318]" />
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* COMPACT MODAL ĐĂNG KÝ PILOT (KHÔNG PHẢI FORM DÀI TRÊN TRANG CHÍNH) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl border border-[#E2DCD5] max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1ECE6]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-[20px] font-black text-[#0F172A]">
                {lang === 'vi' ? 'Đăng ký Hợp tác Pilot' : 'Pilot Partnership'}
              </h3>
              <p className="text-[13px] text-[#64748B]">
                {lang === 'vi'
                  ? 'Để lại thông tin, điều phối viên dự án sẽ liên hệ trong 24 giờ.'
                  : 'Leave your contact info; our coordinator will reach out in 24h.'}
              </p>
            </div>

            {submitted ? (
              <div className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                <div className="font-bold text-[14px]">
                  {lang === 'vi' ? 'Đã tiếp nhận yêu cầu!' : 'Request Received!'}
                </div>
                <div className="text-[12px]">
                  {lang === 'vi'
                    ? 'Cảm ơn bạn. Ban điều phối DustGuard sẽ kết nối qua email.'
                    : 'Thank you. DustGuard team will connect via your email.'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setModalOpen(false);
                  }}
                  className="mt-2 px-4 py-1.5 bg-[#059669] text-white rounded-lg text-[12px] font-semibold"
                >
                  {lang === 'vi' ? 'Đóng' : 'Close'}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setSubmitted(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">
                    {lang === 'vi' ? 'Đơn vị / Cơ quan / Nhóm thanh niên' : 'Organization / Youth Group'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'vi' ? 'VD: UBND Phường Hoàng Liệt hoặc CLB Tình Nguyện' : 'e.g., Ward Committee or Volunteer Club'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[14px] focus:outline-none focus:border-[#B42318]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1">
                    {lang === 'vi' ? 'Email liên hệ' : 'Contact Email'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@district.gov.vn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] text-[14px] focus:outline-none focus:border-[#B42318]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#B42318] hover:bg-[#91180D] text-white font-bold text-[14px] shadow-sm transition-all"
                  >
                    {lang === 'vi' ? 'Gửi đăng ký thử nghiệm' : 'Submit Pilot Request'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
