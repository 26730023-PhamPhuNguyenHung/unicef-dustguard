import React from 'react';
import { History, ShieldCheck, UserCheck, HelpCircle } from 'lucide-react';

interface TrustSectionProps {
  lang: 'vi' | 'en';
}

export const TrustSection: React.FC<TrustSectionProps> = ({ lang }) => {
  const principles = [
    {
      num: '01',
      title: lang === 'vi' ? 'Không sửa lịch sử im lặng' : 'No Silent Edits',
      desc:
        lang === 'vi'
          ? 'Mỗi thay đổi trạng thái, phân công hay ghi chú đều được gắn dấu thời gian và lưu vết vĩnh viễn trong nhật ký hoạt động.'
          : 'Every status change, assignment, and note is permanently timestamped in an append-only audit trail.',
      detail: lang === 'vi' ? 'Dấu thời gian bất biến' : 'Immutable timestamp',
    },
    {
      num: '02',
      title: lang === 'vi' ? 'Bằng chứng có thể đối chiếu' : 'Verifiable Evidence',
      desc:
        lang === 'vi'
          ? 'Ảnh hiện trường và văn bản nghiệm thu được gán mã kiểm chứng số, đảm bảo không thể hoán đổi hay làm sai lệch dữ kiện.'
          : 'Site photos and compliance notes carry cryptographic verification digests, preventing file swapping or tampering.',
      detail: lang === 'vi' ? 'Mã kiểm chứng tệp (SHA-256 đối soát)' : 'Cryptographic file digest',
    },
    {
      num: '03',
      title: lang === 'vi' ? 'AI chỉ hỗ trợ, không thay quyết định' : 'AI Assists, Humans Decide',
      desc:
        lang === 'vi'
          ? 'Trí tuệ nhân tạo chỉ gợi ý phân loại và kiểm tra độ đầy đủ của bằng chứng; cán bộ có thẩm quyền luôn là người ra quyết định cuối cùng.'
          : 'AI only suggests categorization and flags incomplete facts; verified civil servants retain 100% final judgment.',
      detail: lang === 'vi' ? 'Con người ký duyệt' : 'Human authorization required',
    },
  ];

  return (
    <section id="trust" className="py-14 md:py-24 bg-[#FBF9F5]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        
        {/* EDITORIAL HEADING */}
        <div className="max-w-3xl mb-12 md:mb-16 space-y-3.5">
          <span className="text-[12px] font-mono font-bold tracking-widest uppercase text-[#B42318]">
            {lang === 'vi' ? 'NGUYÊN TẮC MINH BẠCH' : 'CORE TRUST PRINCIPLES'}
          </span>
          <h2
            className="text-[30px] sm:text-[42px] lg:text-[48px] font-black text-[#0F172A] tracking-[-0.02em] leading-[1.12]"
            style={{ textWrap: 'pretty' }}
          >
            {lang === 'vi' ? (
              <>
                Minh bạch không nằm ở lời hứa. <br />
                <span className="text-[#B42318]">Nó nằm ở cách hồ sơ được lưu.</span>
              </>
            ) : (
              <>
                Transparency is not an empty promise. <br />
                <span className="text-[#B42318]">It is how records are maintained.</span>
              </>
            )}
          </h2>
          <p
            className="text-[15px] sm:text-[17px] text-[#475569] leading-relaxed max-w-[620px]"
            style={{ textWrap: 'pretty' }}
          >
            {lang === 'vi'
              ? 'Dữ liệu được tổ chức để mọi bên — từ người dân, đơn vị thi công đến cơ quan quản lý — đều có thể tin cậy vào sự thật khách quan.'
              : 'Structured so that every stakeholder can rely on objective, verifiable facts without ambiguity.'}
          </p>
        </div>

        {/* 3 PRINCIPLES EDITORIAL LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {principles.map((item, idx) => (
            <div
              key={idx}
              className="space-y-4 border-t-2 border-[#0F172A] pt-5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <span className="font-mono text-[14px] font-black text-[#B42318]">
                  {item.num}
                </span>
                <h3
                  className="text-[19px] sm:text-[21px] font-black text-[#0F172A] tracking-tight"
                  style={{ textWrap: 'pretty' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[14px] sm:text-[15px] text-[#475569] leading-relaxed"
                  style={{ textWrap: 'pretty' }}
                >
                  {item.desc}
                </p>
              </div>

              {/* Minimalist verification tag */}
              <div className="pt-3 flex items-center gap-1.5 text-[12px] font-medium text-[#64748B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                <span>{item.detail}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
