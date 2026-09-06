import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowRight, CheckCircle2, Clock, MapPin, BarChart3, X, Map } from 'lucide-react';

interface PilotCTAProps {
  lang: 'vi' | 'en';
}

export const PilotCTA: React.FC<PilotCTAProps> = ({ lang }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const bullets = [
    {
      icon: <Clock className="w-4 h-4 text-[#B42318] shrink-0" />,
      text: lang === 'vi' ? 'Thời gian: 4–8 tuần thử nghiệm' : 'Duration: 4–8 weeks pilot',
    },
    {
      icon: <MapPin className="w-4 h-4 text-[#B42318] shrink-0" />,
      text: lang === 'vi' ? 'Quy mô: 1 phường hoặc tuyến đường trọng điểm' : 'Scope: 1 ward or major corridor',
    },
    {
      icon: <BarChart3 className="w-4 h-4 text-[#B42318] shrink-0" />,
      text: lang === 'vi' ? 'Mục tiêu: Hoàn thiện quy trình trước khi nhân rộng' : 'Goal: Refine workflow before scaling',
    },
  ];

  return (
    <section id="pilot" className="py-14 md:py-24 bg-[#F4EFEA] border-t border-[#E8E1D9]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* EDITORIAL BANNER BOX */}
        <div className="bg-white rounded-3xl border border-[#E2DCD5] p-6 sm:p-12 lg:p-16 shadow-xs relative overflow-hidden">
          
          <div className="max-w-3xl space-y-6">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE6DF] text-[#78350F] text-[12px] font-bold tracking-wider uppercase font-mono shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]" />
              <span>{lang === 'vi' ? 'HỢP TÁC TRIỂN KHAI PILOT' : 'PILOT COLLABORATION'}</span>
            </div>

            {/* Headline */}
            <h2
              className="text-[30px] sm:text-[44px] lg:text-[50px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.12]"
              style={{ textWrap: 'pretty' }}
            >
              {lang === 'vi' ? (
                <>
                  Cùng DustGuard chung tay <br />
                  <span className="text-[#B42318]">vì môi trường xanh sạch đẹp.</span>
                </>
              ) : (
                <>
                  Join hands with DustGuard <br />
                  <span className="text-[#B42318]">for a greener community.</span>
                </>
              )}
            </h2>

            {/* Copy */}
            <p
              className="text-[15px] sm:text-[18px] text-[#475569] leading-relaxed max-w-[620px]"
              style={{ textWrap: 'pretty' }}
            >
              {lang === 'vi'
                ? 'Hợp tác cùng chính quyền địa phương và khu dân cư thử nghiệm quy trình: phản ánh bụi → xử lý dứt điểm → kiểm tra lại, cùng nhau giữ gìn từng tuyến phố sạch đẹp.'
                : 'Partnering with local communities and authorities to report, clean up, and verify dust hotspots — making every street cleaner together.'}
            </p>

            {/* 3 Bullets nhỏ */}
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 pt-1 text-[13.5px] text-[#334155] font-medium">
              {bullets.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {b.icon}
                  <span>{b.text}</span>
                </div>
              ))}
            </div>

            {/* Buttons (Touch Targets >= 44px) */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="min-h-[44px] h-12 px-7 rounded-xl bg-[#B42318] hover:bg-[#91180D] text-white font-bold text-[15px] shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] whitespace-nowrap shrink-0 cursor-pointer w-full sm:w-auto"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{lang === 'vi' ? 'Đăng ký Pilot' : 'Apply for Pilot'}</span>
              </button>

              <Link
                to="/map"
                className="min-h-[44px] h-12 px-5 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#0F172A] font-bold text-[14px] flex items-center justify-center gap-2 transition-colors border border-[#E2DCD5] whitespace-nowrap shrink-0 w-full sm:w-auto shadow-2xs"
              >
                <Map className="w-4 h-4 text-[#0D6F64] shrink-0" />
                <span>{lang === 'vi' ? 'Khám phá bản đồ' : 'Explore Map'}</span>
              </Link>

              <a
                href="#process"
                className="min-h-[44px] px-4 rounded-xl text-[#475569] hover:text-[#0F172A] hover:bg-[#FAF7F2] font-semibold text-[14px] flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 w-full sm:w-auto"
              >
                <span>{lang === 'vi' ? 'Xem phạm vi thử nghiệm ↓' : 'View pilot scope ↓'}</span>
              </a>
            </div>

          </div>

        </div>

      </div>

      {/* COMPACT MODAL ĐĂNG KÝ PILOT (ZERO GLASSMORPHISM, HIGH CONTRAST) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-[#E2DCD5] max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-3.5 right-3.5 min-w-[44px] min-h-[44px] rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1ECE6] flex items-center justify-center transition-colors"
              aria-label={lang === 'vi' ? 'Đóng cửa sổ' : 'Close modal'}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-10">
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
              <div className="p-5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] space-y-2.5 text-center">
                <CheckCircle2 className="w-9 h-9 text-[#10B981] mx-auto" />
                <div className="font-bold text-[15px]">
                  {lang === 'vi' ? 'Đã tiếp nhận yêu cầu!' : 'Request Received!'}
                </div>
                <div className="text-[13px] text-[#047857]">
                  {lang === 'vi'
                    ? 'Cảm ơn bạn. Ban điều phối DustGuard sẽ kết nối qua email trong 24h.'
                    : 'Thank you. DustGuard team will connect via your email in 24h.'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setModalOpen(false);
                  }}
                  className="mt-2 min-h-[44px] px-6 py-2 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-[13px] font-bold shadow-xs transition-colors"
                >
                  {lang === 'vi' ? 'Đóng cửa sổ' : 'Close'}
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
                  <label className="block text-[12px] font-bold text-[#334155] mb-1.5">
                    {lang === 'vi' ? 'Đơn vị / Cơ quan / Nhóm thanh niên' : 'Organization / Youth Group'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'vi' ? 'VD: UBND Phường Hoàng Liệt hoặc CLB Tình Nguyện' : 'e.g., Ward Committee or Volunteer Club'}
                    className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-[#CBD5E1] text-[14px] text-[#0F172A] focus:outline-none focus:border-[#B42318] focus:ring-1 focus:ring-[#B42318]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#334155] mb-1.5">
                    {lang === 'vi' ? 'Email liên hệ' : 'Contact Email'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@district.gov.vn"
                    className="w-full min-h-[44px] h-11 px-3.5 rounded-xl border border-[#CBD5E1] text-[14px] text-[#0F172A] focus:outline-none focus:border-[#B42318] focus:ring-1 focus:ring-[#B42318]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[44px] h-12 rounded-xl bg-[#B42318] hover:bg-[#91180D] text-white font-bold text-[14px] shadow-sm transition-all active:scale-[0.99]"
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
