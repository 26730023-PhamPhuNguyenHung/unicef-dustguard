import React from 'react';
import { ArrowRight, XCircle, CheckCircle2 } from 'lucide-react';

interface ProblemStoryProps {
  lang: 'vi' | 'en';
}

export const ProblemStory: React.FC<ProblemStoryProps> = ({ lang }) => {
  const problems = [
    {
      num: '01',
      title: lang === 'vi' ? 'Phản ánh bị phân tán' : 'Scattered Observations',
      desc:
        lang === 'vi'
          ? 'Ảnh, vị trí và mô tả nằm rải rác trên mạng xã hội, tin nhắn hoặc hòm thư mà không được cấu trúc thành hồ sơ.'
          : 'Photos, locations, and descriptions scatter across chat apps and social feeds without structured records.',
    },
    {
      num: '02',
      title: lang === 'vi' ? 'Không biết ai đang xử lý' : 'Opaque Accountability',
      desc:
        lang === 'vi'
          ? 'Người gửi không nhìn thấy tiến trình, không rõ đơn vị nào chịu trách nhiệm tiếp nhận và giải quyết.'
          : 'Citizens cannot see who owns the ticket, which agency takes charge, or what stage it is in.',
    },
    {
      num: '03',
      title: lang === 'vi' ? 'Thiếu vòng tái kiểm' : 'Missing Reinspection Loop',
      desc:
        lang === 'vi'
          ? 'Vụ việc dễ bị đánh dấu "hoàn thành" trên văn bản hành chính trước khi hiện trường thực tế có sự thay đổi.'
          : 'Complaints get closed on paper before the physical construction site actually cleans up and washes tires.',
    },
  ];

  return (
    <section id="problem" className="py-20 md:py-28 bg-[#F4EFEA] border-y border-[#E8E1D9]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        
        {/* HEADER CHÍNH DẠNG EDITORIAL */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-[12px] font-mono font-bold tracking-widest uppercase text-[#B42318]">
            {lang === 'vi' ? 'THỰC TRẠNG HIỆN HỮU' : 'THE REAL-WORLD GAP'}
          </span>
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-black text-[#0F172A] tracking-[-0.02em] leading-[1.1] text-balance">
            {lang === 'vi' ? (
              <>
                Phản ánh không khó. <br />
                <span className="text-[#64748B]">Theo dõi đến kết quả mới khó.</span>
              </>
            ) : (
              <>
                Reporting is easy. <br />
                <span className="text-[#64748B]">Tracking through resolution is hard.</span>
              </>
            )}
          </h2>
          <p className="text-[17px] text-[#475569] leading-relaxed max-w-[620px]">
            {lang === 'vi'
              ? 'Hầu hết ứng dụng dừng lại ở nút gửi tin. Khoảng trống thực sự nằm ở việc lưu vết trách nhiệm và kiểm chứng hiện trường sau can thiệp.'
              : 'Most platforms stop at submission. The real gap lies in maintaining verifiable accountability and physical site follow-up.'}
          </p>
        </div>

        {/* 2 CỘT: TRÁI 3 STATEMENTS / PHẢI BROKEN VS DUSTGUARD FLOW */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* CỘT TRÁI: 3 STATEMENTS DẠNG NUMBER EDITORIAL (6 cols) */}
          <div className="lg:col-span-6 divide-y divide-[#E2DCD5]">
            {problems.map((item, idx) => (
              <div key={idx} className="py-7 first:pt-0 last:pb-0 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[18px] font-black text-[#B42318]">
                    {item.num}
                  </span>
                  <h3 className="text-[20px] sm:text-[22px] font-bold text-[#0F172A] tracking-tight">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[15px] sm:text-[16px] text-[#475569] leading-relaxed pl-8">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: VISUAL COMPARISON FLOW (BROKEN VS DUSTGUARD) (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* BOX 1: CÁCH CŨ (BROKEN FLOW) */}
            <div className="p-6 rounded-2xl bg-white/70 border border-[#E2DCD5] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold font-mono tracking-wider uppercase text-[#DC2626] flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#DC2626]" />
                  {lang === 'vi' ? 'Quy trình truyền thống (Đứt gãy)' : 'Traditional Flow (Broken)'}
                </span>
                <span className="text-[11px] text-[#94A3B8]">
                  {lang === 'vi' ? 'Dễ thất lạc hồ sơ' : 'High drop-off'}
                </span>
              </div>

              {/* Broken flow blocks */}
              <div className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-[#64748B]">
                <span className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]">
                  {lang === 'vi' ? 'Ảnh rời rạc' : 'Scattered Photo'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
                <span className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]">
                  {lang === 'vi' ? 'Tin nhắn mạng' : 'Chat Thread'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#CBD5E1]" />
                <span className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155]">
                  {lang === 'vi' ? 'Bảng tính Excel' : 'Excel Sheet'}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-[#EF4444]" />
                <span className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 font-semibold">
                  ? ({lang === 'vi' ? 'Không rõ kết quả' : 'Lost'})
                </span>
              </div>

              <p className="text-[12px] text-[#64748B] pt-1">
                {lang === 'vi'
                  ? '→ Người phản ánh không có thông tin cập nhật, tình trạng ô nhiễm tiếp diễn.'
                  : '→ Citizens receive no updates while pollution continues unabated.'}
              </p>
            </div>

            {/* BOX 2: CÁCH DUSTGUARD (CLOSED-LOOP FLOW) */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#B42318]/20 shadow-[0_8px_30px_rgba(180,35,24,0.04)] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold font-mono tracking-wider uppercase text-[#059669] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  {lang === 'vi' ? 'Quy trình DustGuard (Khép kín)' : 'DustGuard Closed-Loop'}
                </span>
                <span className="text-[11px] font-semibold text-[#B42318] bg-red-50 px-2 py-0.5 rounded">
                  {lang === 'vi' ? 'Mã duy nhất' : 'Unique ID'}
                </span>
              </div>

              {/* DustGuard structured flow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[12px]">
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EAE6DF]">
                  <div className="text-[10px] font-mono font-bold text-[#B42318]">01 TỌA ĐỘ</div>
                  <div className="font-semibold text-[#0F172A] mt-0.5">
                    {lang === 'vi' ? 'Ảnh có GPS & ngày giờ' : 'GPS + Timestamp'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#EAE6DF]">
                  <div className="text-[10px] font-mono font-bold text-[#B42318]">02 TIẾP NHẬN</div>
                  <div className="font-semibold text-[#0F172A] mt-0.5">
                    {lang === 'vi' ? 'Phân công đúng thẩm quyền' : 'Assigned to Ward'}
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F0FDF4] border border-[#A7F3D0]">
                  <div className="text-[10px] font-mono font-bold text-[#059669]">03 TÁI KIỂM</div>
                  <div className="font-semibold text-[#065F46] mt-0.5">
                    {lang === 'vi' ? 'Nghiệm thu sau 48h' : '48h Verification'}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px] text-[#475569] pt-1">
                <span>{lang === 'vi' ? 'Công khai toàn bộ tiến trình cho cộng đồng' : 'Public progress for community'}</span>
                <span className="text-[#059669] font-bold">100% {lang === 'vi' ? 'minh bạch' : 'transparent'}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
