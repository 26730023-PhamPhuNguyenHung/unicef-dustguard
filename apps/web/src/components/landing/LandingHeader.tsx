import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Send, Globe } from 'lucide-react';
import { OPERATIONS_APP_URL } from '../../config/constants';

interface LandingHeaderProps {
  lang: 'vi' | 'en';
  onToggleLang: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ lang, onToggleLang }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const drawerRef = useRef<HTMLDivElement>(null);

  // Theo dõi scroll để tăng border/shadow nhẹ khi trượt
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver phát hiện active section cho navigation
  useEffect(() => {
    const sectionIds = ['problem', 'process', 'roles', 'pilot'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Đóng drawer khi bấm phím ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // Khóa cuộn trang khi drawer mobile mở
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const navItems = [
    { href: '#problem', id: 'problem', label: lang === 'vi' ? 'Vấn đề' : 'The Issue' },
    { href: '#process', id: 'process', label: lang === 'vi' ? 'Cách hoạt động' : 'How it works' },
    { href: '#roles', id: 'roles', label: lang === 'vi' ? 'Dành cho ai' : 'Who it is for' },
    { href: '#pilot', id: 'pilot', label: lang === 'vi' ? 'Thử nghiệm Pilot' : 'Pilot' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 bg-[#FBF9F5] ${
        isScrolled
          ? 'border-b border-[#E2DDD5] shadow-[0_2px_8px_rgba(35,27,20,0.06)]'
          : 'border-b border-[#ECE6DD]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-[72px] flex items-center justify-between gap-4">
        
        {/* 1. BRAND AREA (Left - Tinh giản gọn hơn ~15%, hierarchy rõ ràng) */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group focus-visible:outline-2 focus-visible:outline-[#0D6F64] rounded-lg p-0.5 select-none shrink-0"
          aria-label="DustGuard VN - Về trang chủ"
        >
          <img
            src="/images/logo/dustguard-shield-logo.webp"
            alt="Logo DustGuard VN"
            className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105 shrink-0"
            width={32}
            height={38}
            loading="eager"
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-[17px] tracking-tight text-[#0F172A] whitespace-nowrap">
                DustGuard<span className="text-[#B42318] ml-0.5">VN</span>
              </span>
              <span className="text-[9px] font-bold text-[#0D6F64] bg-[#0D6F64]/10 border border-[#0D6F64]/20 px-1.5 py-[2px] rounded leading-none uppercase tracking-wider whitespace-nowrap">
                CivicTech
              </span>
            </div>
            <span className="text-[9.5px] font-medium text-[#64748B] tracking-wider uppercase leading-tight mt-1 whitespace-nowrap">
              {lang === 'en' ? 'Air Quality Oversight' : 'Giám sát bụi · Minh bạch hóa'}
            </span>
          </div>
        </Link>

        {/* 2. PRIMARY NAVIGATION (Center) */}
        <nav
          className="hidden md:flex items-center gap-1 lg:gap-2 shrink-0"
          aria-label="Thanh điều hướng chính"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`relative text-[14px] font-medium px-3.5 py-2 rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0D6F64] ${
                  isActive
                    ? 'text-[#B42318] font-semibold bg-[#B42318]/5'
                    : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F3EFEA]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-[#B42318] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* 3. RIGHT ACTION AREA (Chuẩn 2 nút: Đăng nhập + Gửi phản ánh, padding đầy đủ, không truncate) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {/* Nút 1: Đăng nhập (Outlined Button có viền sắc nét, nền trắng) */}
          <Link
            to="/login"
            className="h-10 px-5 rounded-xl bg-white hover:bg-[#F5F1EB] text-[#1E293B] hover:text-[#0F172A] border border-[#D5CDC3] hover:border-[#A89E92] text-[13.5px] font-semibold transition-all duration-150 flex items-center justify-center whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-2 focus-visible:outline-[#0D6F64]"
          >
            {lang === 'vi' ? 'Đăng nhập' : 'Log in'}
          </Link>

          {/* Nút 2: Gửi phản ánh (Primary CTA đỏ DustGuard, padding px-5 chuẩn Tailwind) */}
          <Link
            to="/reports/new"
            className="h-10 px-5 rounded-xl bg-[#B42318] hover:bg-[#991B1B] active:translate-y-0 hover:-translate-y-[1px] text-white text-[13.5px] font-bold shadow-sm transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B42318]"
          >
            <Send className="w-4 h-4 stroke-[2.2] shrink-0" />
            <span className="whitespace-nowrap">{lang === 'vi' ? 'Gửi phản ánh' : 'Report dust'}</span>
          </Link>
        </div>

        {/* 4. MOBILE CONTROLS */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          {/* Quick Primary CTA trên mobile */}
          <Link
            to="/reports/new"
            className="h-9 px-3.5 rounded-xl bg-[#B42318] hover:bg-[#991B1B] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
            <span className="whitespace-nowrap">{lang === 'vi' ? 'Gửi phản ánh' : 'Report'}</span>
          </Link>

          {/* Toggle Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[#334155] hover:text-[#0F172A] hover:bg-[#F3EFEA] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[#0D6F64]"
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* 5. MOBILE DRAWER & BACKDROP */}
      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-0 top-[72px] z-40 md:hidden flex flex-col justify-between bg-[#FBF9F5] border-b border-[#E2DDD5] px-6 py-6 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150"
          ref={drawerRef}
        >
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-1">
              {lang === 'vi' ? 'Điều hướng' : 'Navigation'}
            </span>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-[15px] font-medium px-3.5 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'text-[#B42318] font-bold bg-[#B42318]/10'
                      : 'text-[#1E293B] hover:text-[#B42318] hover:bg-[#F3EFEA]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          <div className="pt-6 border-t border-[#E8E2D9] flex flex-col gap-3">
            {/* Primary Action Mobile */}
            <Link
              to="/reports/new"
              onClick={() => setMobileOpen(false)}
              className="w-full h-11 rounded-xl bg-[#B42318] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{lang === 'vi' ? 'Gửi phản ánh ngay' : 'Report dust now'}</span>
            </Link>

            {/* Secondary Action Mobile */}
            <a
              href={OPERATIONS_APP_URL}
              className="w-full h-11 rounded-xl bg-white border border-[#0D6F64]/30 text-[#0D6F64] font-bold text-sm flex items-center justify-center gap-2"
            >
              <span>{lang === 'vi' ? 'Cổng Đơn vị Xử lý' : 'Operations Portal'}</span>
              <ArrowUpRight className="w-4 h-4 text-[#0D6F64]" />
            </a>

            {/* Bottom bar: Login + Lang switch */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D9]/60">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-[#475569] hover:text-[#0F172A] py-1.5 px-2"
              >
                {lang === 'vi' ? 'Đăng nhập nền tảng →' : 'Sign in →'}
              </Link>

              <button
                type="button"
                onClick={onToggleLang}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] bg-[#F3EFEA] border border-[#E2DDD5] px-3 py-1.5 rounded-lg"
              >
                <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                <span>{lang === 'vi' ? 'Tiếng Anh (EN)' : 'Tiếng Việt (VI)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
