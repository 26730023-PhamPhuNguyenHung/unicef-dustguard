import React from 'react';
import { HelpCircle, FileX2, RefreshCwOff, ShieldAlert, ArrowDown } from 'lucide-react';

interface ProblemSectionProps {
  lang: 'vi' | 'en';
}

export const ProblemSection: React.FC<ProblemSectionProps> = ({ lang }) => {
  const problems = [
    {
      icon: <FileX2 className="w-6 h-6 text-rose-600" />,
      tag: lang === 'vi' ? 'ĐỨT GÃY 1' : 'GAP 1',
      title: lang === 'vi' ? 'Phản ánh rơi vào khoảng trống' : 'Reports Lost in the Void',
      desc:
        lang === 'vi'
          ? 'Người dân gửi ảnh lên mạng xã hội hoặc hòm thư nhưng không có mã định danh vụ việc. Không ai biết hồ sơ đang ở đâu, cơ quan nào thụ lý và bao giờ có phản hồi.'
          : 'Citizens post photos online or email hotlines without tracking codes. Nobody knows who owns the issue, which agency is accountable, or when it gets answered.',
      consequence: lang === 'vi' ? 'Hậu quả: 85% người dân mất dần niềm tin sau 2 lần báo cáo không kết quả.' : 'Impact: 85% of citizens stop reporting after 2 unanswered complaints.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-amber-600" />,
      tag: lang === 'vi' ? 'ĐỨT GÃY 2' : 'GAP 2',
      title: lang === 'vi' ? 'Thiếu chứng cứ có giá trị pháp lý' : 'Unverifiable & Tamperable Claims',
      desc:
        lang === 'vi'
          ? 'Hình ảnh chụp thiếu tọa độ GPS thực địa, không có dấu thời gian niêm phong mã băm. Khi cán bộ đến kiểm tra thì hiện trường đã thay đổi, nhà thầu dễ dàng thoái thác.'
          : 'Photos lack cryptographic geofencing and verifiable timestamps. By the time inspectors arrive, dust is cleared or contractors simply deny responsibility.',
      consequence: lang === 'vi' ? 'Hậu quả: Cán bộ thiếu căn cứ ban hành quyết định xử phạt vi phạm hành chính.' : 'Impact: Enforcement officers lack solid legal grounds for administrative penalties.',
    },
    {
      icon: <RefreshCwOff className="w-6 h-6 text-indigo-600" />,
      tag: lang === 'vi' ? 'ĐỨT GÃY 3' : 'GAP 3',
      title: lang === 'vi' ? 'Không có quy trình tái kiểm 48h' : 'Zero Closed-Loop Reinspection',
      desc:
        lang === 'vi'
          ? 'Cơ quan quản lý chỉ nhắc nhở qua văn bản nhưng không có cơ chế bắt buộc cử thanh tra quay lại kiểm tra thực tế xem nhà thầu đã bật vòi xịt rửa bánh hay chưa.'
          : 'Official notices are sent, but nobody systematically returns 48 hours later to inspect if wheel-washing stations were actually turned on.',
      consequence: lang === 'vi' ? 'Hậu quả: Vi phạm tái diễn ngày này qua ngày khác, bụi vẫn mù mịt.' : 'Impact: Violations repeat daily, roads remain dusty, and air quality keeps degrading.',
    },
  ];

  return (
    <section id="problem" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'vi' ? 'Khoảng trống thực tế' : 'The Real-World Gap'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight leading-snug">
            {lang === 'vi'
              ? 'Một phản ánh chỉ có giá trị khi biết điều gì xảy ra sau đó.'
              : 'A citizen report is only meaningful when you know what happens next.'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {lang === 'vi'
              ? 'Thách thức lớn nhất trong quản lý bụi xây dựng đô thị không phải là thiếu người nhìn thấy, mà là sự đứt gãy giữa phản ánh của người dân và hành động thực thi của cơ quan có thẩm quyền.'
              : 'The fundamental bottleneck in urban dust management is not lack of detection, but the broken link between civic reporting and accountable enforcement.'}
          </p>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, idx) => (
            <div
              key={idx}
              className="civic-card p-6 bg-[#FDFBF7] border border-slate-200 rounded-xl hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    {p.icon}
                  </div>
                  <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-bold rounded">
                    {p.tag}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">{p.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{p.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-[11px] font-semibold text-rose-900 leading-tight">
                  {p.consequence}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transition callout */}
        <div className="mt-12 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center max-w-xl mx-auto flex items-center justify-center gap-2 text-xs font-semibold text-slate-800">
          <ArrowDown className="w-4 h-4 text-primary animate-bounce" />
          <span>
            {lang === 'vi'
              ? 'DustGuard giải quyết triệt để 3 đứt gãy này bằng kiến trúc 1 Vấn đề · 1 Hồ sơ'
              : 'DustGuard resolves this with: One Issue · One Case · One Accountable Trail'}
          </span>
        </div>
      </div>
    </section>
  );
};
