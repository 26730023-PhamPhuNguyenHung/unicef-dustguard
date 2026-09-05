import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, Lock, GitBranch } from 'lucide-react';

interface CivicTechSectionProps {
  lang: 'vi' | 'en';
}

export const CivicTechSection: React.FC<CivicTechSectionProps> = ({ lang }) => {
  const techs = [
    {
      icon: <Lock className="w-6 h-6 text-emerald-700" />,
      title: lang === 'vi' ? 'Dữ liệu Hiện trường Chống giả mạo' : 'Tamper-Proof Evidence Ledger',
      subtitle: 'SHA-256 Web Crypto Digest',
      desc:
        lang === 'vi'
          ? 'Mọi tệp hình ảnh và biên bản kiểm tra đều được tính toán mã băm SHA-256 ngay khi tải lên. Không ai có thể chỉnh sửa, hoán đổi ảnh hoặc ngụy tạo kết quả mà không bị phát hiện.'
          : 'All images and inspection records are cryptographically hashed upon upload. No one can alter or swap photos without immediate detection.',
      checks: [
        lang === 'vi' ? 'Mã băm lưu trữ bất biến tại D1 / SQLite SSOT' : 'Immutable hash stored in SQLite SSOT',
        lang === 'vi' ? 'Hỗ trợ đối soát trực tiếp tệp nhị phân trên đĩa cứng' : 'Direct on-disk binary byte-for-byte verification',
        lang === 'vi' ? 'Bảo vệ giá trị pháp lý khi xử lý vi phạm hành chính' : 'Court-admissible civic evidence for administrative fines',
      ],
    },
    {
      icon: <GitBranch className="w-6 h-6 text-primary" />,
      title: lang === 'vi' ? 'Ràng buộc Trạng thái & Thời hạn SLA' : 'Deterministic State Machine & SLA',
      subtitle: 'Strict Finite State Machine',
      desc:
        lang === 'vi'
          ? 'Không cho phép nhảy cóc quy trình từ Tiếp nhận thẳng sang Đóng hồ sơ. Mọi chuyển đổi đều ghi nhận actor, mốc thời gian và yêu cầu biên bản tái kiểm thực tế.'
          : 'Zero skipping from report directly to closure. Transitions are strictly validated with actor audit logs and required reinspection proof.',
      checks: [
        lang === 'vi' ? 'Tự động đếm ngược thời hạn xử lý trong 48 giờ' : '48-hour automated countdown timers',
        lang === 'vi' ? 'Cấm đóng hồ sơ nếu thiếu ảnh minh chứng đạt chuẩn' : 'Closure blocked without verified before/after evidence',
        lang === 'vi' ? 'Lưu vết lịch sử phân công và tái phân công cán bộ' : 'Immutable staff assignment and reassignment audit trail',
      ],
    },
    {
      icon: <Cpu className="w-6 h-6 text-indigo-700" />,
      title: lang === 'vi' ? 'AI Hỗ trợ — Con người Quyết định' : 'AI-Assisted, Human-Confirmed',
      subtitle: 'Evidence-Grounded Intelligence',
      desc:
        lang === 'vi'
          ? 'Trợ lý AI chỉ đóng vai trò phân tích dữ kiện có sẵn từ hiện trường và tra cứu quy định pháp luật (Luật BVMT 2020, NĐ 45/2022). Quyết định xử lý cuối cùng 100% thuộc về cán bộ.'
          : 'AI strictly assists by synthesizing field facts and statutory citations. Final legal and enforcement decisions remain 100% human-authorized.',
      checks: [
        lang === 'vi' ? 'Tuyệt đối không bịa đặt căn cứ pháp luật (Zero Hallucination)' : 'Strict provenance: AI cannot cite non-existent articles',
        lang === 'vi' ? 'Tự động cảnh báo hồ sơ thiếu dữ kiện (INSUFFICIENT_DATA)' : 'Automatic flagging of incomplete evidence packages',
        lang === 'vi' ? 'Chữ ký điện tử của cán bộ thẩm quyền xác thực kết luận' : 'Human Officer sign-off required for confirmed violations',
      ],
    },
  ];

  return (
    <section id="tech" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'vi' ? 'Kỷ luật công nghệ CivicTech' : 'CivicTech Invariants'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight leading-snug">
            {lang === 'vi'
              ? 'Công nghệ đúng phía sau quy trình.'
              : 'Reliable technology behind strict civic process.'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {lang === 'vi'
              ? 'Chúng tôi không chạy theo các khẩu hiệu hào nhoáng. Hệ thống được xây dựng trên các nguyên tắc bất biến: dữ liệu thật, lưu trữ bền vững và con người chịu trách nhiệm.'
              : 'No hype, no fake claims. Built on foundational invariants: authentic data, durable persistence, and accountable human authority.'}
          </p>
        </div>

        {/* 3 Tech Pillars Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {techs.map((t, idx) => (
            <div
              key={idx}
              className="civic-card p-6 bg-[#FDFBF7] border border-slate-200 rounded-xl flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                  {t.icon}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t.subtitle}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{t.title}</h3>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">{t.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-2">
                {t.checks.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
