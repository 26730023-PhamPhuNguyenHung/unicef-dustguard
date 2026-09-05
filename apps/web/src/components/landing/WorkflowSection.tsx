import React from 'react';
import { Camera, CheckSquare, Send, RotateCcw, Archive, ArrowRight } from 'lucide-react';

interface WorkflowSectionProps {
  lang: 'vi' | 'en';
}

export const WorkflowSection: React.FC<WorkflowSectionProps> = ({ lang }) => {
  const steps = [
    {
      num: '01',
      icon: <Camera className="w-5 h-5 text-primary" />,
      role: lang === 'vi' ? 'Công dân / Thanh niên' : 'Citizen / Youth',
      title: lang === 'vi' ? 'Phát hiện & Niêm phong' : 'Observe & Seal',
      desc:
        lang === 'vi'
          ? 'Chụp ảnh xe ben hoặc công trường phát tán bụi. Tọa độ GPS và dấu thời gian được băm SHA-256 niêm phong tự động.'
          : 'Snap photo of dusty truck or site. GPS and timestamp are automatically cryptographically sealed with SHA-256.',
      badge: lang === 'vi' ? 'Mã băm SHA-256' : 'SHA-256 Sealed',
      badgeColor: 'bg-red-50 text-primary border-red-200',
    },
    {
      num: '02',
      icon: <CheckSquare className="w-5 h-5 text-amber-700" />,
      role: lang === 'vi' ? 'Cán bộ Điều phối' : 'Triage Officer',
      title: lang === 'vi' ? 'Xác minh & Đánh giá' : 'Triage & Priority',
      desc:
        lang === 'vi'
          ? 'Hệ thống tự động lọc trùng lặp trong bán kính 50m. Cán bộ thẩm tra dữ kiện và kích hoạt hồ sơ điều hành chính thức.'
          : 'Engine dedupes within 50m geofence. Officer reviews preliminary facts and opens formal operational case.',
      badge: lang === 'vi' ? 'Mã DG-2026-OP-xxx' : 'Official Case ID',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      num: '03',
      icon: <Send className="w-5 h-5 text-blue-700" />,
      role: lang === 'vi' ? 'Nhà thầu Thi công' : 'Contractor',
      title: lang === 'vi' ? 'Giao việc Khắc phục' : 'Notice & Remediate',
      desc:
        lang === 'vi'
          ? 'Lệnh khắc phục gửi trực tiếp đến ban chỉ huy công trường. Đồng hồ đếm ngược 48 giờ bắt đầu kích hoạt.'
          : 'Binding corrective notice dispatched to site manager. 48-hour SLA countdown timer activates immediately.',
      badge: lang === 'vi' ? 'SLA 48 Giờ' : '48h SLA Timer',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      num: '04',
      icon: <RotateCcw className="w-5 h-5 text-emerald-700" />,
      role: lang === 'vi' ? 'Thanh tra Môi trường' : 'Inspector',
      title: lang === 'vi' ? 'Tái kiểm Nghiệm thu' : 'Reinspect Site',
      desc:
        lang === 'vi'
          ? 'Cán bộ hoặc tình nguyện viên quay lại hiện trường chụp ảnh đối chứng: kiểm tra vòi xịt bánh, bạt che và chỉ số bụi.'
          : 'Inspector returns on-site to verify corrective actions: wheel wash operational, tarps secured, dust levels compliant.',
      badge: lang === 'vi' ? 'Ảnh Trước/Sau' : 'Before/After Audit',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      num: '05',
      icon: <Archive className="w-5 h-5 text-slate-700" />,
      role: lang === 'vi' ? 'Lãnh đạo Ban Quản trị' : 'Supervisor',
      title: lang === 'vi' ? 'Đóng hồ sơ & Lưu vết' : 'Closure & Ledger',
      desc:
        lang === 'vi'
          ? 'Hồ sơ chỉ được đóng khi thỏa mãn đủ 4 điều kiện. Lưu vết vĩnh viễn vào CSDL SQLite và tích lũy tín chỉ thanh niên.'
          : 'Case permanently closed only when 4 mandatory criteria are satisfied. Preserved in SQLite D1 ledger with youth credits.',
      badge: lang === 'vi' ? 'Bất biến D1 SSOT' : 'Immutable Record',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    },
  ];

  return (
    <section id="workflow" className="py-16 sm:py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>{lang === 'vi' ? 'Quy trình 5 chặng khép kín' : '5-Node Closed-Loop'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight leading-snug">
            {lang === 'vi'
              ? 'Mỗi hồ sơ đều có trạng thái. Mỗi trạng thái đều có người chịu trách nhiệm.'
              : 'Every case has a status. Every status has a single accountable owner.'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {lang === 'vi'
              ? 'Loại bỏ hoàn toàn tình trạng đùn đẩy trách nhiệm. Hệ thống bảo đảm tính minh bạch tuyệt đối qua 5 mắt xích không thể đảo ngược.'
              : 'Eliminate bureaucratic hand-waving. Transparent state machine enforces progress through 5 strict nodes.'}
          </p>
        </div>

        {/* 5 Steps Linear Horizontal / Vertical on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className="civic-card p-5 bg-[#FDFBF7] border border-slate-200 rounded-xl hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div className="space-y-3">
                {/* Step header with Number and Role */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <span className="font-mono text-xl font-black text-slate-400 group-hover:text-primary transition-colors">
                    {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-2xs">
                    {step.icon}
                  </div>
                </div>

                {/* Role text */}
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  {step.role}
                </span>

                {/* Title and Desc */}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                </div>
              </div>

              {/* Step Badge */}
              <div className="pt-2 border-t border-slate-200">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${step.badgeColor}`}>
                  {step.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee Callout Banner */}
        <div className="mt-12 p-4 bg-emerald-50 border border-emerald-200 rounded-xl max-w-2xl mx-auto text-center space-y-1">
          <div className="text-xs font-bold text-emerald-900">
            {lang === 'vi'
              ? '✓ Nguyên tắc Bất biến: Không hồ sơ nào được phép đóng nếu thiếu ảnh tái kiểm đạt chuẩn'
              : '✓ Core Invariant: No case can be closed without verified reinspection evidence'}
          </div>
          <p className="text-[11px] text-emerald-800">
            {lang === 'vi'
              ? 'Quy trình ngăn chặn việc báo cáo khống trên bàn giấy, buộc việc xử lý phải diễn ra thực chất tại hiện trường.'
              : 'Strict runtime invariant prevents fake compliance on paper, enforcing real physical action on the ground.'}
          </p>
        </div>
      </div>
    </section>
  );
};
