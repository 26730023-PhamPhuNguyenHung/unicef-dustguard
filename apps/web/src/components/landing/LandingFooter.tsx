import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { OPERATIONS_APP_URL } from '../../config/constants';

interface LandingFooterProps {
  lang: 'vi' | 'en';
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ lang }) => {
  return (
    <footer className="bg-[#1E293B] text-slate-300 border-t border-slate-700 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Cột 1: Thương hiệu & Tôn chỉ */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo/dustguard-shield-logo.webp"
                alt="DustGuard VN Shield"
                className="h-9 w-auto object-contain brightness-110"
                width={36}
                height={43}
              />
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white leading-tight">
                  DustGuard<span className="text-red-400 font-black">VN</span>
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  CivicTech Platform
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm">
              {lang === 'vi'
                ? 'Nền tảng CivicTech giám sát bụi xây dựng đô thị, kết nối người dân, thanh niên tình nguyện và cơ quan quản lý — theo dõi chặt chẽ mọi phản ánh đến khi có kết quả xử lý thực tế.'
                : 'CivicTech platform connecting citizens, youth volunteers, and urban authorities to monitor construction dust accountably.'}
            </p>

            <div className="pt-2 text-slate-400 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>contact@dustguard.vn</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Hà Nội & TP. Hồ Chí Minh, Việt Nam</span>
              </div>
            </div>
          </div>

          {/* Cột 2: Phía Cộng đồng & Thanh niên */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {lang === 'vi' ? 'Phía Cộng Đồng' : 'Community Side'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to="/reports/new" className="hover:text-white transition-colors">
                  {lang === 'vi' ? 'Gửi phản ánh mới' : 'Submit Report'}
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition-colors">
                  {lang === 'vi' ? 'Bản đồ ô nhiễm thời gian thực' : 'Real-Time Dust Map'}
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-white transition-colors">
                  {lang === 'vi' ? 'Danh mục hồ sơ đang theo dõi' : 'Active Public Cases'}
                </Link>
              </li>
              <li>
                <Link to="/communities" className="hover:text-white transition-colors">
                  {lang === 'vi' ? 'Mạng lưới CLB & Tín chỉ thanh niên' : 'Youth Volunteer Clubs'}
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors font-medium text-amber-400">
                  {lang === 'vi' ? 'Đăng nhập Cộng đồng' : 'Community Login'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Phía Chuyên trách & Vận hành */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {lang === 'vi' ? 'Phía Chuyên Trách' : 'Professional Side'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href={OPERATIONS_APP_URL}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Trung tâm Điều hành (Operations)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={`${OPERATIONS_APP_URL}/evidence`}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Kho Bằng chứng số SHA-256</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={`${OPERATIONS_APP_URL}/inspections`}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Thanh tra hiện trường QCVN 18</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href={`${OPERATIONS_APP_URL}/login`}
                  className="hover:text-white flex items-center gap-1 transition-colors font-medium text-sky-400"
                >
                  <span>Đăng nhập Cán bộ Chuyên môn</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Quy chuẩn & Pháp luật */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {lang === 'vi' ? 'Căn Cứ Pháp Lý' : 'Statutory Basis'}
            </h4>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>
                <a
                  href="https://thuvienphapluat.vn/van-ban/Tai-nguyen-Moi-truong/Luat-so-72-2020-QH14-Bao-ve-moi-truong-2020-431147.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                  title="Luật số 72/2020/QH14 Bảo vệ môi trường 2020"
                >
                  <span>Luật BVMT 2020 (Điều 64)</span>
                  <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://thuvienphapluat.vn/van-ban/Vi-pham-hanh-chinh/Nghi-dinh-45-2022-ND-CP-xu-phat-vi-pham-hanh-chinh-linh-vuc-bao-ve-moi-truong-484772.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                  title="Nghị định 45/2022/NĐ-CP xử phạt vi phạm hành chính lĩnh vực bảo vệ môi trường"
                >
                  <span>Nghị định 45/2022/NĐ-CP (Điều 15)</span>
                  <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://thuvienphapluat.vn/van-ban/Tai-nguyen-Moi-truong/Thong-tu-02-2022-TT-BTNMT-huong-dan-Luat-Bao-ve-moi-truong-500694.aspx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                  title="Thông tư 02/2022/TT-BTNMT hướng dẫn Luật Bảo vệ môi trường"
                >
                  <span>Thông tư 02/2022/TT-BTNMT</span>
                  <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              </li>
              <li>
                <a
                  href="https://thuvienphapluat.vn/hoi-dap-phap-luat/quy-chuan-quoc-gia-ve-chat-luong-khong-khi-qcvn-052023btnmt-138003428.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                  title="Quy chuẩn quốc gia về chất lượng không khí QCVN 05:2023/BTNMT"
                >
                  <span>Quy chuẩn QCVN 05:2023/BTNMT</span>
                  <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Chân trang bản quyền */}
        <div className="pt-8 mt-8 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © 2026 DustGuard VN. CivicTech for Children & Urban Clean Air. Phục vụ cộng đồng phi lợi nhuận.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Thiết kế vì môi trường sống trong lành của trẻ em</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
