import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, ArrowUpRight, Send } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-[#FBF9F5] border-b border-[#EAE6DF] transition-all">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-[72px] sm:h-[76px] flex items-center justify-between">
        
        {/* LOGO TRÁI */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#B42318] flex items-center justify-center text-white shadow-xs group-hover:bg-[#91180D] transition-colors">
            <Shield className="w-4 h-4 fill-white/20" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-[17px] tracking-tight text-[#0F172A] font-sans">
              DustGuard<span className="text-[#B42318] ml-0.5">VN</span>
            </span>
            <span className="hidden md:inline-block text-[11px] font-medium tracking-wide text-[#64748B] uppercase">
              · CivicTech
            </span>
          </div>
        </Link>

        {/* NAVIGATION GIỮA - CHỈ 4 MỤC TINH GỌN */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14px] font-medium text-[#475569] hover:text-[#0F172A] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* ACTION PHẢI */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="text-[13px] font-semibold text-[#64748B] hover:text-[#0F172A] px-2 py-1 rounded transition-colors mr-1"
          >
            {lang === 'vi' ? 'EN' : 'VI'}
          </button>

          {/* Login Button */}
          <Link
            to="/login"
            className="text-[13px] font-semibold text-[#475569] hover:text-[#0F172A] hover:bg-[#EAE6DF]/60 px-3 py-2 rounded-lg transition-colors"
          >
            {lang === 'vi' ? 'Đăng nhập' : 'Log in'}
          </Link>

          {/* Secondary CTA: Dành cho Đơn vị Xử lý (Side B) */}
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-semibold text-[#0369A1] hover:text-[#0C4A6E] hover:bg-[#E0F2FE]/70 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1 border border-[#BAE6FD]/80"
          >
            <span>{lang === 'vi' ? 'Đơn vị xử lý' : 'Operations'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </a>

          {/* Primary CTA: Gửi phản ánh (Side A) */}
          <Link
            to="/reports/new"
            className="text-[13px] font-semibold text-white bg-[#B42318] hover:bg-[#91180D] px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{lang === 'vi' ? 'Gửi phản ánh' : 'Report dust'}</span>
          </Link>
        </div>

        {/* MOBILE CONTROLS */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            to="/reports/new"
            className="text-[12px] font-semibold text-white bg-[#B42318] px-3 py-1.5 rounded-lg shadow-xs"
          >
            {lang === 'vi' ? 'Gửi tin' : 'Report'}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#334155] hover:text-[#0F172A] rounded-lg"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU DROPDOWN */}
      {mobileOpen && (
        <div className="sm:hidden bg-[#FBF9F5] border-b border-[#EAE6DF] px-6 py-5 space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium text-[#1E293B] py-1"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-[#EAE6DF] flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full text-center py-2.5 text-xs font-bold rounded-xl border border-border-subtle bg-white text-content-main"
            >
              {lang === 'vi' ? 'Đăng nhập nền tảng' : 'Log in'}
            </Link>

            <div className="flex items-center justify-between pt-1">
              <a
                href="http://localhost:3002"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] font-semibold text-[#0369A1] flex items-center gap-1"
              >
                <span>{lang === 'vi' ? 'Cổng Đơn vị Xử lý' : 'Operations'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={onToggleLang}
                className="text-[13px] font-bold text-[#B42318] px-2.5 py-1 border border-[#EAE6DF] rounded-md bg-white"
              >
                {lang === 'vi' ? 'Tiếng Anh (EN)' : 'Tiếng Việt (VI)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
