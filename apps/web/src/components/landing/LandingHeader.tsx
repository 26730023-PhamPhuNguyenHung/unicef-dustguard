import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Send, Globe } from 'lucide-react';
import { OPERATIONS_APP_URL } from '../../config/constants';

interface LandingHeaderProps {
  lang: 'vi' | 'en';
  onToggleLang: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ lang, onToggleLang }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#problem', label: lang === 'vi' ? 'Vấn đề' : 'The Gap' },
    { href: '#process', label: lang === 'vi' ? 'Cách hoạt động' : 'How it works' },
    { href: '#roles', label: lang === 'vi' ? 'Dành cho ai' : 'Who it is for' },
    { href: '#pilot', label: lang === 'vi' ? 'Thử nghiệm Pilot' : 'Pilot' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FDFBF7] border-b border-[#E8E2D9] shadow-[0_1px_3px_0_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[72px] sm:h-[76px] flex items-center justify-between">
        
        {/* LOGO & BRAND LOCKUP */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none select-none">
          <img
            src="/images/logo/dustguard-shield-logo.webp"
            alt="DustGuard VN Logo"
            className="h-9 sm:h-10 w-auto object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
            width={36}
            height={43}
            loading="eager"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-[18px] sm:text-[19px] tracking-tight text-[#0F172A] leading-tight font-sans">
                DustGuard<span className="text-[#B42318] ml-0.5 font-black">VN</span>
              </span>
              <span className="hidden md:inline-flex items-center text-[10px] font-bold text-[#0D6F64] bg-[#0D6F64]/10 border border-[#0D6F64]/20 px-2 py-0.5 rounded-md leading-none uppercase tracking-wide">
                CivicTech
              </span>
            </div>
            <span className="text-[10px] sm:text-[10.5px] font-bold text-[#71645A] tracking-wider uppercase leading-none mt-1">
              {lang === 'en' ? 'Civic Air Quality Platform' : 'Giám sát Bụi · Minh bạch Hóa'}
            </span>
          </div>
        </Link>

        {/* NAVIGATION GIỮA */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#F3EFEA] px-3.5 py-1.5 rounded-lg transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* ACTION PHẢI */}
        <div className="hidden sm:flex items-center gap-2.5 lg:gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#475569] hover:text-[#0F172A] bg-[#F3EFEA] hover:bg-[#EAE4DC] border border-[#E2DDD5] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            <Globe className="w-3.5 h-3.5 text-[#64748B]" />
            <span>{lang === 'vi' ? 'EN' : 'VI'}</span>
          </button>

          {/* Login Link */}
          <Link
            to="/login"
            className="text-xs font-bold text-[#334155] hover:text-[#0F172A] hover:bg-[#F3EFEA] px-3 py-1.5 rounded-lg transition-colors"
          >
            {lang === 'vi' ? 'Đăng nhập' : 'Log in'}
          </Link>

          {/* Secondary CTA: Dành cho Đơn vị Xử lý (Side B) */}
          <a
            href={OPERATIONS_APP_URL}
            className="text-xs font-bold text-[#0D6F64] bg-[#0D6F64]/8 hover:bg-[#0D6F64]/15 border border-[#0D6F64]/25 hover:border-[#0D6F64]/40 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
          >
            <span>{lang === 'vi' ? 'Đơn vị xử lý' : 'Operations'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#0D6F64]" />
          </a>

          {/* Primary CTA: Gửi phản ánh (Side A) */}
          <Link
            to="/reports/new"
            className="text-xs font-bold text-white bg-[#B42318] hover:bg-[#991B1B] active:scale-[0.98] px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Gửi phản ánh' : 'Report dust'}</span>
          </Link>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            to="/reports/new"
            className="text-[12px] font-bold text-white bg-[#B42318] hover:bg-[#991B1B] px-3 py-1.5 rounded-lg shadow-xs active:scale-95 transition-all"
          >
            {lang === 'vi' ? 'Gửi tin' : 'Report'}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#334155] hover:text-[#0F172A] hover:bg-[#F3EFEA] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <div className="sm:hidden bg-[#FDFBF7] border-b border-[#E8E2D9] px-6 py-5 space-y-4 shadow-lg animate-in fade-in duration-150">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-semibold text-[#1E293B] hover:text-[#B42318] hover:bg-[#F3EFEA] px-3 py-2 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#E8E2D9] flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold rounded-lg border border-[#DCD6CE] bg-white text-[#1E293B] hover:bg-[#F3EFEA] transition-colors"
            >
              {lang === 'vi' ? 'Đăng nhập nền tảng' : 'Log in'}
            </Link>

            <div className="flex items-center justify-between pt-1">
              <a
                href={OPERATIONS_APP_URL}
                className="text-xs font-bold text-[#0D6F64] bg-[#0D6F64]/8 border border-[#0D6F64]/25 px-3 py-1.5 rounded-lg flex items-center gap-1"
              >
                <span>{lang === 'vi' ? 'Cổng Đơn vị Xử lý' : 'Operations'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#0D6F64]" />
              </a>

              <button
                type="button"
                onClick={onToggleLang}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#475569] bg-[#F3EFEA] hover:bg-[#EAE4DC] border border-[#E2DDD5] px-3 py-1.5 rounded-lg transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{lang === 'vi' ? 'English (EN)' : 'Tiếng Việt (VI)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
