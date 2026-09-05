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
        <div className="hidden sm:flex items-center gap-4">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="text-[13px] font-semibold text-[#64748B] hover:text-[#0F172A] px-2 py-1 rounded transition-colors"
          >
            {lang === 'vi' ? 'EN' : 'VI'}
          </button>

          {/* Secondary: Cổng cán bộ */}
          <a
            href="http://localhost:3002"
            target="_blank"
            rel="noreferrer"
            className="text-[13px] font-semibold text-[#334155] hover:text-[#0F172A] hover:bg-[#EAE6DF]/60 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>{lang === 'vi' ? 'Cổng cán bộ' : 'Staff portal'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-50" />
          </a>

          {/* Primary CTA: Gửi phản ánh */}
          <Link
            to="/reports/new"
            className="text-[13px] font-semibold text-white bg-[#B42318] hover:bg-[#91180D] px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
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
            {lang === 'vi' ? 'Gửi phản ánh' : 'Report'}
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

          <div className="pt-3 border-t border-[#EAE6DF] flex items-center justify-between">
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noreferrer"
              className="text-[13px] font-semibold text-[#334155] flex items-center gap-1"
            >
              <span>{lang === 'vi' ? 'Cổng cán bộ điều hành' : 'Staff portal'}</span>
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
      )}
    </header>
  );
};
