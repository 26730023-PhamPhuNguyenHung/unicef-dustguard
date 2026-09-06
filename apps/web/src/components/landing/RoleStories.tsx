import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, ArrowRight, Camera, CheckCircle2, ShieldAlert, Award, FileCheck2, Building2, Scale } from 'lucide-react';
import { OPERATIONS_APP_URL } from '../../config/constants';

interface RoleStoriesProps {
  lang: 'vi' | 'en';
}

export const RoleStories: React.FC<RoleStoriesProps> = ({ lang }) => {
  return (
    <section id="roles" className="py-20 md:py-28 bg-[#F4EFEA] border-y border-[#E8E1D9]">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8">
        
        {/* EDITORIAL HEADING */}
        <div className="max-w-3xl mb-16 space-y-4">
          <span className="text-[12px] font-mono font-bold tracking-widest uppercase text-[#B42318]">
            {lang === 'vi' ? 'MÔ HÌNH HAI PHÍA ĐỒNG HÀNH' : 'TWO-SIDE COLLABORATIVE MODEL'}
          </span>
          <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-black text-[#0F172A] tracking-[-0.02em] leading-[1.1] text-balance">
            {lang === 'vi' ? (
              <>
                Một chu trình khép kín. <br />
                <span className="text-[#B42318]">Hai phía phối hợp trách nhiệm.</span>
              </>
            ) : (
              <>
                One closed-loop lifecycle. <br />
                <span className="text-[#B42318]">Two accountable partners.</span>
              </>
            )}
          </h2>
          <p className="text-[17px] text-[#475569] leading-relaxed max-w-[640px]">
            {lang === 'vi'
              ? 'Xóa bỏ mô hình phản ánh một chiều rơi vào im lặng. DustGuard kết nối sức mạnh quan sát của cộng đồng với năng lực thực thi của đơn vị chức năng.'
              : 'Breaking the silence of one-way reporting. DustGuard bridges civic ground observation with authoritative field enforcement.'}
          </p>
        </div>

        {/* 2-SIDE COMPARATIVE CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* SIDE A: PHÍA CỘNG ĐỒNG */}
          <div className="bg-white rounded-3xl border border-[#E2DCD5] p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden group hover:border-[#B42318]/40 transition-all">
            <div className="space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#EAE6DF] text-[#B42318] text-[12px] font-extrabold tracking-wider uppercase font-mono">
                  <Users className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'PHÍA CỘNG ĐỒNG' : 'COMMUNITY SIDE'}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#64748B]">
                  {lang === 'vi' ? 'Người dân · Thanh niên · CLB' : 'Citizens · Youth · Clubs'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight">
                  {lang === 'vi' ? 'Ghi nhận · Xác thực & Theo dõi' : 'Observe · Verify & Track'}
                </h3>
                <p className="text-[14px] text-[#475569] leading-relaxed">
                  {lang === 'vi'
                    ? 'Chụp ảnh có tọa độ GPS, mã hóa bằng chứng số bất biến, xác thực tín hiệu chéo giữa các tình nguyện viên và theo dõi hồ sơ cho tới khi có kết quả khắc phục.'
                    : 'Capture geoverified photos, secure tamper-evident hashes, cross-confirm signals, and track civic cases transparently.'}
                </p>
              </div>

              {/* Capabilities List */}
              <div className="space-y-2.5 pt-2 border-t border-[#F1ECE6]">
                <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#334155]">
                  <Camera className="w-4 h-4 text-[#B42318] shrink-0" />
                  <span>{lang === 'vi' ? 'Tạo phản ánh vi phạm bụi có gắn định vị trong 30 giây' : 'Submit geolocated dust reports in 30 seconds'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#334155]">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                  <span>{lang === 'vi' ? 'Cộng đồng xác nhận ("Tôi cũng ghi nhận") tăng trọng số tin báo' : 'Community co-confirmations to substantiate valid signals'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#334155]">
                  <Award className="w-4 h-4 text-[#D97706] shrink-0" />
                  <span>{lang === 'vi' ? 'Ghi nhận thời gian hoạt động thực tế và dấu ấn đóng góp vì môi trường' : 'Accumulate volunteer hours and verified community impact'}</span>
                </div>
              </div>

              {/* Compact Mock UI */}
              <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EAE6DF] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#0F172A] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#059669]" />
                    {lang === 'vi' ? 'Tín hiệu cộng đồng đã xác thực' : 'Confirmed Community Signal'}
                  </span>
                  <span className="text-[#059669] font-bold font-mono text-[11px]">#DG-C-2026-081</span>
                </div>
                <div className="text-[12px] text-[#475569] line-clamp-1">
                  {lang === 'vi' ? 'Công trình Vành Đai 3 — 8 phản ánh trùng khớp & 24 lượt xác nhận' : 'Ring Road 3 Site — 8 merged reports & 24 confirmations'}
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-2">
              <Link
                to="/reports/new"
                className="w-full py-3 rounded-xl bg-[#B42318] hover:bg-[#91180D] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{lang === 'vi' ? 'Gửi phản ánh hoặc tham gia CLB' : 'Submit report or join club'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* SIDE B: PHÍA CHUYÊN TRÁCH */}
          <div className="bg-white rounded-3xl border border-[#BAE6FD] p-7 sm:p-9 flex flex-col justify-between space-y-6 shadow-xs relative overflow-hidden group hover:border-[#0284C7] transition-all">
            <div className="space-y-5">
              {/* Header Badge */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-[#0369A1] text-[12px] font-extrabold tracking-wider uppercase font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{lang === 'vi' ? 'PHÍA CHUYÊN TRÁCH' : 'PROFESSIONAL SIDE'}</span>
                </div>
                <span className="text-[11px] font-semibold text-[#64748B]">
                  {lang === 'vi' ? 'Cán bộ · Giám sát · Pháp lý · Nhà thầu' : 'Staff · Supervisors · Legal · Contractors'}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-[24px] font-black text-[#0F172A] tracking-tight">
                  {lang === 'vi' ? 'Tiếp nhận · Thanh tra & Xử lý' : 'Intake · Inspect & Enforce'}
                </h3>
                <p className="text-[14px] text-[#475569] leading-relaxed">
                  {lang === 'vi'
                    ? 'Tự động nhập hồ sơ từ cộng đồng, kiểm tra hiện trường theo 10 tiêu chuẩn QCVN 18/BXD, đối chiếu pháp lý FTS5 và giám sát nhà thầu khắc phục trong bán kính 50m.'
                    : 'Auto-intake civic dossiers, conduct 10-criterion site checklists, cross-reference FTS5 environmental laws, and enforce remediation within 50m.'}
                </p>
              </div>

              {/* Capabilities List */}
              <div className="space-y-2.5 pt-2 border-t border-[#E0F2FE]">
                <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#334155]">
                  <FileCheck2 className="w-4 h-4 text-[#0369A1] shrink-0" />
                  <span>{lang === 'vi' ? 'Checklist thanh tra hiện trường 10 tiêu chuẩn QCVN 18/BXD thao tác 1 tay' : '10-criterion QCVN 18/BXD field inspection checklist'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#334155]">
                  <Scale className="w-4 h-4 text-[#4F46E5] shrink-0" />
                  <span>{lang === 'vi' ? 'Trí tuệ pháp lý FTS5 tra cứu tức thì Luật BVMT 2020 và Nghị định 45' : 'FTS5 Environmental Law library with instant citation match'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#334155]">
                  <Building2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>{lang === 'vi' ? 'Nhà thầu nộp ảnh Before/After qua Quick-Token với GPS Geofence ≤ 50m' : 'Contractor remediation upload via Quick-Token & 50m Geofence'}</span>
                </div>
              </div>

              {/* Compact Mock UI */}
              <div className="bg-[#F0F9FF] p-3.5 rounded-2xl border border-[#BAE6FD] space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-[#0C4A6E] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                    {lang === 'vi' ? 'Cổng kiểm soát 4 điều kiện đóng hồ sơ' : '4-Condition Closure Gate'}
                  </span>
                  <span className="text-[#0369A1] font-bold font-mono text-[11px]">#DG-OP-2026-081</span>
                </div>
                <div className="text-[12px] text-[#0369A1] line-clamp-1">
                  {lang === 'vi' ? 'Đã nghiệm thu ảnh rửa xe · Giám sát viên phê duyệt · Sẵn sàng đóng' : 'Remediation verified · Supervisor approved · Ready to close'}
                </div>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-2">
              <a
                href={OPERATIONS_APP_URL}
                className="w-full py-3 rounded-xl bg-[#0369A1] hover:bg-[#0284C7] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{lang === 'vi' ? 'Truy cập Cổng Điều hành Nghiệp vụ' : 'Open Operations Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
export default RoleStories;
