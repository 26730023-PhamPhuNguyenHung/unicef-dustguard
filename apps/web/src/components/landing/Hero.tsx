import React from 'react';
import { Link } from 'react-router-dom';
import { Send, ArrowRight, ShieldCheck, Clock, Eye, Map } from 'lucide-react';
import { CaseStory } from './CaseStory';

interface HeroProps {
  lang: 'vi' | 'en';
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20 bg-[#FBF9F5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* CỘT TRÁI: 58% CONTENT (7/12 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* EYEBROW */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4EFEA] border border-[#E8E1D9] text-[#78350F] text-[12px] font-bold tracking-wider uppercase font-mono shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B42318]" />
              <span>
                {lang === 'vi'
                  ? 'DUSTGUARD VN · CIVIC TECH CHO ĐÔ THỊ SẠCH'
                  : 'DUSTGUARD VN · CIVIC TECH FOR CLEANER CITIES'}
              </span>
            </div>

            {/* HEADLINE LỚN: Responsive mượt mà 360px -> desktop, không đè chữ */}
            <h1
              className="text-[32px] xs:text-[40px] sm:text-[52px] lg:text-[62px] font-black text-[#0F172A] tracking-[-0.03em] leading-[1.12]"
              style={{ textWrap: 'pretty' }}
            >
              {lang === 'vi' ? (
                <>
                  Phát hiện bụi.{' '}
                  <br className="hidden xs:inline" />
                  <span className="text-[#B42318]">Theo dõi đến khi</span>{' '}
                  <br className="hidden sm:inline" />
                  được xử lý.
                </>
              ) : (
                <>
                  Spot urban dust.{' '}
                  <br className="hidden xs:inline" />
                  <span className="text-[#B42318]">Track until</span>{' '}
                  <br className="hidden sm:inline" />
                  accountably resolved.
                </>
              )}
            </h1>

            {/* SUPPORTING COPY TỐI ĐA 2-3 DÒNG */}
            <p
              className="text-[16px] sm:text-[18px] text-[#475569] leading-relaxed max-w-[620px] font-normal"
              style={{ textWrap: 'pretty' }}
            >
              {lang === 'vi'
                ? 'Mỗi phản ánh trở thành một hồ sơ có mã định danh, bằng chứng được lưu vết và tiến trình xử lý có thể theo dõi đến kết quả thực tế.'
                : 'Every citizen observation becomes a structured case with unique ID, verifiable evidence trail, and tracked through full remediation.'}
            </p>

            {/* CTAS: 3 HƯỚNG SỬ DỤNG CHÍNH + LINK HỒ SƠ MẪU (TOUCH TARGETS >= 44PX) */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              {/* Phía Cộng đồng (Primary) */}
              <Link
                to="/reports/new"
                className="min-h-[44px] h-12 px-6 rounded-xl bg-[#B42318] hover:bg-[#91180D] text-white font-bold text-[15px] shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99] w-full sm:w-auto"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span>{lang === 'vi' ? 'Gửi phản ánh' : 'Report dust'}</span>
              </Link>

              {/* Phía Chuyên trách (Secondary) */}
              <Link
                to="/login?side=operations"
                className="min-h-[44px] h-12 px-5 rounded-xl bg-white hover:bg-[#F0F9FF] text-[#0369A1] font-bold text-[14px] flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto border border-[#BAE6FD]"
              >
                <span>{lang === 'vi' ? 'Dành cho đơn vị xử lý' : 'For authorities'}</span>
                <ArrowRight className="w-4 h-4 text-[#0369A1] shrink-0" />
              </Link>

              {/* Khám phá bản đồ */}
              <Link
                to="/map"
                className="min-h-[44px] h-12 px-5 rounded-xl bg-[#FAF7F2] hover:bg-[#F2ECE4] text-[#0F172A] font-semibold text-[14px] flex items-center justify-center gap-1.5 transition-colors w-full sm:w-auto border border-[#E2DDD5]"
              >
                <Map className="w-4 h-4 text-[#0D6F64] shrink-0" />
                <span>{lang === 'vi' ? 'Khám phá bản đồ' : 'Explore map'}</span>
              </Link>

              {/* Xem hồ sơ mẫu */}
              <a
                href="#case-preview"
                className="min-h-[44px] px-3.5 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F2ECE4] font-semibold text-[13.5px] flex items-center justify-center gap-1 transition-colors w-full sm:w-auto"
              >
                <span>{lang === 'vi' ? 'Xem hồ sơ mẫu ↓' : 'Live case preview ↓'}</span>
              </a>
            </div>

            {/* TRUST ROW RẤT NHẸ - KHÔNG DÙNG 4 KPI CARDS */}
            <div className="pt-6 border-t border-[#EAE6DF] flex flex-wrap items-center gap-4 sm:gap-8 text-[13px] text-[#475569] font-medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B42318] shrink-0" />
                <span>{lang === 'vi' ? 'Mốc tái kiểm mục tiêu: 48 giờ' : '48h follow-up target'}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{lang === 'vi' ? 'Bằng chứng lưu vết' : 'Tamper-evident trail'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>{lang === 'vi' ? 'Theo dõi công khai' : 'Public oversight'}</span>
              </div>
            </div>

          </div>

          {/* CỘT PHẢI: 42% VISUAL (5/12 cols) - CASE STORY CARD LỚN DUY NHẤT */}
          <div id="case-preview" className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <CaseStory lang={lang} />
          </div>

        </div>
      </div>
    </section>
  );
};
