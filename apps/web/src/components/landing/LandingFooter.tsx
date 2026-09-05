import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ExternalLink, Mail, Phone, MapPin, Heart } from 'lucide-react';

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
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Shield className="w-5 h-5 fill-white/20" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                DustGuard<span className="text-red-400">VN</span>
              </span>
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

          {/* Cột 2: Cổng Người Dân & Thanh Niên */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {lang === 'vi' ? 'Cổng Cộng Đồng' : 'Community'}
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
            </ul>
          </div>

          {/* Cột 3: Cổng Tác Nghiệp Cán Bộ */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              {lang === 'vi' ? 'Cổng Cán Bộ & Pháp Chế' : 'Operations'}
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="http://localhost:3002"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Trung tâm Điều hành (Operations)</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <Link to="/evidence" className="hover:text-white transition-colors">
                  Kho Bằng chứng số SHA-256
                </Link>
              </li>
              <li>
                <a
                  href="http://localhost:3002/inspections"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Mẫu biểu Thanh tra NĐ 45/2022</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:3002/supervisor/workload"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Giám sát hạn chót SLA 48h</span>
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
              <li>Luật Bảo vệ Môi trường 2020 (Điều 64)</li>
              <li>Nghị định số 45/2022/NĐ-CP (Điều 15)</li>
              <li>Thông tư 02/2022/TT-BTNMT</li>
              <li>Quy chuẩn QCVN 05:2023/BTNMT</li>
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
