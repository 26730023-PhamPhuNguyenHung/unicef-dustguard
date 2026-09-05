import React from 'react';
import { Users, Shield, HardHat, LayoutDashboard, Camera, CheckCircle2, Wrench, Eye } from 'lucide-react';

interface RoleStoriesProps {
  lang: 'vi' | 'en';
}

export const RoleStories: React.FC<RoleStoriesProps> = ({ lang }) => {
  const roles = [
    {
      role: lang === 'vi' ? 'Người dân' : 'Citizen',
      tagline: lang === 'vi' ? 'Gửi và theo dõi' : 'Report & Follow up',
      desc:
        lang === 'vi'
          ? 'Chụp ảnh gửi phản ánh trong 30 giây, nhận mã hồ sơ và cập nhật thông báo khi vụ việc được xử lý.'
          : 'Snap and report in 30 seconds, receive live tracking code and resolution updates.',
      icon: <Users className="w-5 h-5 text-[#B42318]" />,
      mockUi: (
        <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE6DF] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#0F172A] flex items-center gap-1">
              <Camera className="w-3 h-3 text-[#B42318]" />
              {lang === 'vi' ? 'Gửi nhanh 1 chạm' : '1-tap submit'}
            </span>
            <span className="text-[#059669] font-medium font-mono text-[10px]">#DG-OP-014</span>
          </div>
          <div className="h-1.5 w-full bg-[#E2DCD5] rounded-full overflow-hidden">
            <div className="h-full bg-[#059669] w-3/4 rounded-full" />
          </div>
          <div className="text-[10px] text-[#64748B]">
            {lang === 'vi' ? 'Đã cập nhật: Đơn vị đang xử lý' : 'Updated: Work in progress'}
          </div>
        </div>
      ),
    },
    {
      role: lang === 'vi' ? 'Cán bộ' : 'Inspector',
      tagline: lang === 'vi' ? 'Nhận và xác minh' : 'Receive & Verify',
      desc:
        lang === 'vi'
          ? 'Thẩm định hiện trường có bằng chứng định vị, ban hành yêu cầu xử lý và cử kiểm tra thực tế.'
          : 'Review geoverified site evidence, dispatch binding corrective orders, and reinspect.',
      icon: <Shield className="w-5 h-5 text-[#0369A1]" />,
      mockUi: (
        <div className="bg-[#F0F9FF] p-3 rounded-xl border border-[#BAE6FD] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#0369A1] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#0284C7]" />
              {lang === 'vi' ? 'Hồ sơ thẩm định' : 'Case Review'}
            </span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-[#BAE6FD] text-[#0369A1]">
              GPS OK
            </span>
          </div>
          <div className="text-[11px] font-medium text-[#0C4A6E]">
            {lang === 'vi' ? 'Yêu cầu kích hoạt phun rửa lốp' : 'Order: Wheel wash setup'}
          </div>
          <div className="text-[10px] text-[#0284C7]">
            {lang === 'vi' ? 'Hạn chót: 48 giờ' : 'Deadline: 48 hours'}
          </div>
        </div>
      ),
    },
    {
      role: lang === 'vi' ? 'Nhà thầu' : 'Contractor',
      tagline: lang === 'vi' ? 'Khắc phục và cập nhật' : 'Remediate & Update',
      desc:
        lang === 'vi'
          ? 'Nhận thông tin vi phạm cụ thể, triển khai biện pháp giảm bụi và nạp ảnh nghiệm thu để đóng vụ việc.'
          : 'Receive clear incident notices, implement mitigation measures, and upload proof of remediation.',
      icon: <HardHat className="w-5 h-5 text-[#D97706]" />,
      mockUi: (
        <div className="bg-[#FFFBEB] p-3 rounded-xl border border-[#FDE68A] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#92400E] flex items-center gap-1">
              <Wrench className="w-3 h-3 text-[#D97706]" />
              {lang === 'vi' ? 'Hiện trường thi công' : 'Site Compliance'}
            </span>
            <span className="text-[10px] text-[#B45309] font-medium">
              {lang === 'vi' ? 'Đã khắc phục' : 'Resolved'}
            </span>
          </div>
          <div className="text-[11px] font-medium text-[#78350F]">
            {lang === 'vi' ? 'Đã nạp 2 ảnh đối chứng rửa xe' : '2 evidence photos uploaded'}
          </div>
          <div className="text-[10px] text-[#92400E]">
            {lang === 'vi' ? 'Chờ cán bộ tái kiểm' : 'Awaiting reinspection'}
          </div>
        </div>
      ),
    },
    {
      role: lang === 'vi' ? 'Điều phối' : 'Supervisor',
      tagline: lang === 'vi' ? 'Nhìn toàn bộ tiến trình' : 'Full-Loop Oversight',
      desc:
        lang === 'vi'
          ? 'Theo dõi tỷ lệ giải quyết theo phường/quận, quản lý điểm nóng ô nhiễm và đảm bảo không hồ sơ nào bị bỏ quên.'
          : 'Monitor ward-level resolution rates, identify hotspots, and ensure zero dropped civic cases.',
      icon: <LayoutDashboard className="w-5 h-5 text-[#4F46E5]" />,
      mockUi: (
        <div className="bg-[#EEF2FF] p-3 rounded-xl border border-[#C7D2FE] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-[#3730A3] flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#4F46E5]" />
              {lang === 'vi' ? 'Tiến độ toàn quận' : 'District Overview'}
            </span>
            <span className="text-[10px] font-bold text-[#4338CA]">94%</span>
          </div>
          <div className="text-[11px] font-medium text-[#312E81]">
            {lang === 'vi' ? '18/19 hồ sơ đúng hạn 48h' : '18/19 closed within 48h'}
          </div>
          <div className="text-[10px] text-[#4F46E5]">
            {lang === 'vi' ? '0 vụ tồn đọng quá hạn' : 'Zero overdue cases'}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="roles" className="py-20 md:py-28 bg-[#F4EFEA] border-y border-[#E8E1D9]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        
        {/* EDITORIAL HEADING */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-[12px] font-mono font-bold tracking-widest uppercase text-[#B42318]">
            {lang === 'vi' ? 'PHÂN VAI RÕ RÀNG' : 'STREAMLINED ROLES'}
          </span>
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-black text-[#0F172A] tracking-[-0.02em] leading-[1.1] text-balance">
            {lang === 'vi' ? (
              <>
                Mỗi người chỉ cần thấy <br />
                <span className="text-[#B42318]">phần việc của mình.</span>
              </>
            ) : (
              <>
                Each participant focuses only on <br />
                <span className="text-[#B42318]">their actionable step.</span>
              </>
            )}
          </h2>
          <p className="text-[17px] text-[#475569] leading-relaxed max-w-[620px]">
            {lang === 'vi'
              ? 'Không có ma trận phức tạp. Trải nghiệm được tinh chỉnh phù hợp với nhu cầu và ngữ cảnh cụ thể của từng bên.'
              : 'No complicated enterprise matrix. Each stakeholder gets a contextual, focused interface.'}
          </p>
        </div>

        {/* 4 PORTRAIT-STYLE BLOCKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E2DCD5] p-6 flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md transition-all"
            >
              {/* Top part: Icon, Role & Tagline */}
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#EAE6DF] flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[19px] font-black text-[#0F172A] tracking-tight">
                    {item.role}
                  </h3>
                  <div className="text-[13px] font-bold text-[#B42318] mt-0.5">
                    "{item.tagline}"
                  </div>
                </div>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Bottom part: Compact Mock UI */}
              <div className="pt-2">
                {item.mockUi}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
