import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Globe, ArrowRight, Menu, X, ExternalLink, MapPin, Send } from 'lucide-react';

interface LandingNavProps {
  lang: 'vi' | 'en';
  onToggleLang: () => void;
  activeSection: string;
}

export const LandingNav: React.FC<LandingNavProps> = ({ lang, onToggleLang, activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#problem', label: lang === 'vi' ? 'Vấn đề thực địa' : 'The Gap' },
    { href: '#solution', label: lang === 'vi' ? 'Hồ sơ 1 chạm' : 'Solution' },
    { href: '#workflow', label: lang === 'vi' ? 'Quy trình 48h' : '48h Workflow' },
    { href: '#roles', label: lang === 'vi' ? 'Vai trò tham gia' : 'Roles' },
    { href: '#tech', label: lang === 'vi' ? 'Công nghệ minh chứng' : 'CivicTech' },
    { href: '#pilot', label: lang === 'vi' ? 'Thử nghiệm Pilot' : 'Pilot' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#FDFBF7]/95 border-b border-slate-200 shadow-xs backdrop-blur-none'
          : 'bg-[#FDFBF7] border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white shadow-xs group-hover:bg-primary-dark transition-colors">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-content-main block leading-none">
              DustGuard<span className="text-primary ml-0.5">VN</span>
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-content-sub uppercase mt-0.5 block leading-none">
              {lang === 'vi' ? 'Giám sát bụi đô thị' : 'Urban Dust CivicTech'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/80 border border-slate-200 rounded-full px-3 py-1 shadow-2xs">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-content-sub hover:text-content-main hover:bg-slate-100'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-2.5 py-1.5 text-xs font-semibold text-content-main hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors touch-target"
            title={lang === 'vi' ? 'Chuyển sang tiếng Anh' : 'Switch to Vietnamese'}
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          {/* Cổng điều hành cán bộ */}
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-primary hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors touch-target"
          >
            <span>{lang === 'vi' ? 'Cổng Cán bộ' : 'Staff Portal'}</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          {/* Dominant CTA - Vào bảng tin / Gửi phản ánh */}
          <Link
            to="/reports/new"
            className="px-3.5 py-1.5 text-xs font-bold bg-primary text-white hover:bg-primary-dark rounded-lg shadow-xs flex items-center gap-1.5 transition-all touch-target"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Gửi phản ánh' : 'Report Dust'}</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="p-2 text-xs font-semibold text-content-main rounded-lg border border-slate-200 touch-target"
          >
            {lang === 'vi' ? 'EN' : 'VI'}
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-content-main hover:bg-slate-100 rounded-lg border border-slate-200 touch-target"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#FDFBF7] border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in fade-in">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-content-main hover:border-primary text-center touch-target"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            <Link
              to="/reports/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 bg-primary text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 touch-target shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Gửi phản ánh ngay' : 'Report Dust Issue'}</span>
            </Link>

            <Link
              to="/map"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-800 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 touch-target"
            >
              <MapPin className="w-4 h-4 text-primary" />
              <span>{lang === 'vi' ? 'Xem Bản đồ Giám sát' : 'View Dust Map'}</span>
            </Link>

            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-4 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-1.5 touch-target"
            >
              <span>{lang === 'vi' ? 'Mở Cổng Cán bộ & Điều phối' : 'Staff Operations Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
