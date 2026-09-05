import React, { useState } from 'react';
import { Users, HardHat, Shield, Building, Award, CheckCircle2, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RoleMatrixSectionProps {
  lang: 'vi' | 'en';
}

export const RoleMatrixSection: React.FC<RoleMatrixSectionProps> = ({ lang }) => {
  const [activeRole, setActiveRole] = useState<'citizen' | 'staff' | 'contractor' | 'executive'>('citizen');

  const roles = [
    {
      id: 'citizen',
      label: lang === 'vi' ? 'Công dân & Thanh niên' : 'Citizens & Youth',
      icon: <Users className="w-4 h-4" />,
      title: lang === 'vi' ? 'Cộng đồng tham gia quan sát và tích lũy tín chỉ' : 'Civic Observers & Youth Volunteers',
      desc:
        lang === 'vi'
          ? 'Bất kỳ người dân nào cũng có thể gửi phản ánh chỉ với 3 thao tác: chụp ảnh, chọn địa điểm và gửi. Thanh niên tình nguyện tham gia đối soát tái kiểm để tích lũy tín chỉ tình nguyện được công nhận.'
          : 'Anyone can submit evidence in 3 taps: photo, location, and submit. Youth volunteers verify follow-ups to earn officially recognized credits.',
      features: [
        lang === 'vi' ? 'Gửi ảnh hiện trường không cần đăng nhập phức tạp' : 'Frictionless submission without tedious registration',
        lang === 'vi' ? 'Nhận mã theo dõi và thông báo khi nhà thầu đã khắc phục' : 'Live push notifications as contractors fix issues',
        lang === 'vi' ? 'Quy đổi 20 giờ tình nguyện thành 4.0 tín chỉ rèn luyện' : 'Accredited community volunteer service credits',
      ],
      ctaText: lang === 'vi' ? 'Gửi phản ánh ngay' : 'Report Now',
      ctaLink: '/reports/new',
    },
    {
      id: 'staff',
      label: lang === 'vi' ? 'Cán bộ Thanh tra' : 'Environmental Officers',
      icon: <Shield className="w-4 h-4" />,
      title: lang === 'vi' ? 'Không gian làm việc thụ lý hồ sơ tập trung' : 'Specialized Investigation Workspace',
      desc:
        lang === 'vi'
          ? 'Cán bộ môi trường có giao diện điều hành chuyên sâu: tra cứu căn cứ pháp lý Luật BVMT 2020, kiểm tra mã băm SHA-256 đối soát đĩa cứng, và ký ban hành lệnh khắc phục.'
          : 'Inspectors access streamlined workspaces: cross-referencing Environmental Law, verifying SHA-256 digests, and issuing binding notices.',
      features: [
        lang === 'vi' ? 'Tự động kiểm tra trùng lặp trong bán kính 50m' : 'Automated 50m geofence deduplication engine',
        lang === 'vi' ? 'Trợ lý phân tích pháp lý không ảo giác (Zero-AI Hallucination)' : 'Grounded legal intelligence without hallucinations',
        lang === 'vi' ? 'Theo dõi hạn chót SLA 48h trên bàn làm việc' : '48-hour SLA deadline tracking and escalation',
      ],
      ctaText: lang === 'vi' ? 'Cổng Cán bộ (Operations)' : 'Staff Portal',
      ctaLink: 'http://localhost:3002',
      isExternal: true,
    },
    {
      id: 'contractor',
      label: lang === 'vi' ? 'Nhà thầu Thi công' : 'Contractors',
      icon: <HardHat className="w-4 h-4" />,
      title: lang === 'vi' ? 'Kênh tiếp nhận minh bạch, bảo vệ uy tín công trình' : 'Clear Compliance & Reputation Safeguard',
      desc:
        lang === 'vi'
          ? 'Nhà thầu nhận cảnh báo sớm trước khi bị xử phạt hành chính. Dễ dàng nạp ảnh minh chứng đã kích hoạt rửa lốp, che bạt để khép lại hồ sơ minh bạch.'
          : 'Contractors receive immediate notice before formal monetary fines. Simple uploads of wheel-wash photos clear complaints transparently.',
      features: [
        lang === 'vi' ? 'Nhận thông báo trực tiếp về hành vi vi phạm tại công trường' : 'Instant digital alerts for specific truck/site incidents',
        lang === 'vi' ? 'Tải lên bằng chứng khắc phục (ảnh rửa xe, bạt che, tưới ẩm)' : 'Direct remediation upload (sprinklers, covers, sweepers)',
        lang === 'vi' ? 'Bảo vệ hồ sơ năng lực môi trường khi đấu thầu công' : 'Demonstrate environmental compliance for public tenders',
      ],
      ctaText: lang === 'vi' ? 'Tra cứu Công trình' : 'Search Projects',
      ctaLink: '/reports',
    },
    {
      id: 'executive',
      label: lang === 'vi' ? 'Lãnh đạo Đô thị' : 'City Leadership',
      icon: <Building className="w-4 h-4" />,
      title: lang === 'vi' ? 'Bản đồ nhiệt và chỉ số giải quyết thời gian thực' : 'City-Wide Heatmaps & Governance Analytics',
      desc:
        lang === 'vi'
          ? 'Báo cáo tổng quan mức độ ô nhiễm bụi theo quận huyện, tỷ lệ nhà thầu chấp hành quy chuẩn và hiệu suất xử lý của từng đội thanh tra địa bàn.'
          : 'Real-time overview of urban dust hotspots, contractor compliance ratings, and agency resolution performance.',
      features: [
        lang === 'vi' ? 'Bản đồ nhiệt điểm nóng ô nhiễm bụi theo thời gian thực' : 'Real-time spatial heatmap of PM2.5 and citizen reports',
        lang === 'vi' ? 'Bảng xếp hạng mức độ chấp hành của các nhà thầu thi công' : 'Contractor compliance index and recurrent violator alerts',
        lang === 'vi' ? 'Số liệu phục vụ quy hoạch và nâng cấp hạ tầng đô thị' : 'Auditable evidence for urban planning and policy updates',
      ],
      ctaText: lang === 'vi' ? 'Xem Bản đồ Giám sát' : 'View Dust Map',
      ctaLink: '/map',
    },
  ];

  const current = roles.find((r) => r.id === activeRole) || roles[0];

  return (
    <section id="roles" className="py-16 sm:py-20 bg-[#FDFBF7] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>{lang === 'vi' ? 'Phân vai minh bạch' : 'Multi-Stakeholder Matrix'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight leading-snug">
            {lang === 'vi'
              ? 'Mỗi người tham gia đúng một vai trò.'
              : 'Every stakeholder has one well-defined role.'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {lang === 'vi'
              ? 'Không có ai phải làm thay việc của ai. Hệ thống kết nối nhịp nhàng giữa Công dân, Cán bộ thực thi, Nhà thầu và Lãnh đạo quản lý.'
              : 'Clear division of responsibilities prevents overlap. Citizens observe, officers enforce, contractors remediate, leaders govern.'}
          </p>
        </div>

        {/* Role Tabs Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {roles.map((r) => {
            const isSelected = activeRole === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveRole(r.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all touch-target border ${
                  isSelected
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Role Content Card */}
        <div className="civic-card p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl shadow-sm max-w-4xl mx-auto animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-8 space-y-4">
              <div className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded text-[11px] font-bold">
                {current.label}
              </div>

              <h3 className="text-xl font-bold text-slate-900 tracking-tight">{current.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{current.desc}</p>

              {/* Bullet points */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {current.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-primary shadow-xs">
                {current.icon}
              </div>

              <span className="text-xs font-bold text-slate-800 block">
                {lang === 'vi' ? 'Bắt đầu tương tác ngay' : 'Ready to participate?'}
              </span>

              {current.isExternal ? (
                <a
                  href={current.ctaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 touch-target shadow-xs"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <Link
                  to={current.ctaLink}
                  className="w-full py-2.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 touch-target shadow-xs"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
