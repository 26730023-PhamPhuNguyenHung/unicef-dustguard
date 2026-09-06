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
    { href: '#problem', id: 'problem', label: lang === 'vi' ? 'Vấn đề' : 'The Issue', isRoute: false },
    { href: '#process', id: 'process', label: lang === 'vi' ? 'Cách hoạt động' : 'How it works', isRoute: false },
    { href: '#roles', id: 'roles', label: lang === 'vi' ? 'Dành cho ai' : 'Who it is for', isRoute: false },
    { href: '/map', id: 'map', label: lang === 'vi' ? 'Bản đồ số' : 'Live Map', isRoute: true },
    { href: '#pilot', id: 'pilot', label: lang === 'vi' ? 'Thử nghiệm Pilot' : 'Pilot', isRoute: false },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 bg-[#FBF9F5] ${
        isScrolled
          ? 'border-b border-[#E2DDD5] shadow-[0_2px_8px_rgba(35,27,20,0.06)]'
          : 'border-b border-[#ECE6DD]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 h-[72px] flex items-center justify-between gap-4">
        
        {/* 1. BRAND AREA (Left - Tinh giản gọn gàng, hierarchy rõ nét) */}
        <Link
          to="/"
          className="flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-[#0D6F64] rounded-lg p-1 select-none min-h-[44px] min-w-0"
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
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-[16px] sm:text-[17px] tracking-tight text-[#0F172A] whitespace-nowrap">
                DustGuard<span className="text-[#B42318] ml-0.5">VN</span>
              </span>
              <span className="text-[9px] font-bold text-[#0D6F64] bg-[#0D6F64]/10 border border-[#0D6F64]/20 px-1.5 py-[2px] rounded leading-none uppercase tracking-wider whitespace-nowrap">
                CivicTech
              </span>
            </div>
            <span className="hidden sm:block text-[9.5px] font-medium text-[#64748B] tracking-wider uppercase leading-tight mt-1 whitespace-nowrap">
              {lang === 'en' ? 'Air Quality Oversight' : 'Giám sát bụi · Minh bạch hóa'}
            </span>
          </div>
        </Link>

        {/* 2. PRIMARY NAVIGATION (Center - Kích hoạt từ màn hình lớn lg >= 1024px) */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0"
          aria-label="Thanh điều hướng chính"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            const itemClasses = `relative text-[14px] font-medium px-3.5 py-2 rounded-lg transition-colors duration-150 whitespace-nowrap min-h-[40px] flex items-center focus-visible:outline-2 focus-visible:outline-[#0D6F64] ${
              isActive
                ? 'text-[#B42318] font-semibold bg-[#B42318]/5'
                : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F3EFEA]'
            }`;

            if (item.isRoute) {
              return (
                <Link key={item.href} to={item.href} className={itemClasses}>
                  {item.label}
                </Link>
              );
            }

            return (
              <a key={item.href} href={item.href} className={itemClasses}>
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-[#B42318] rounded-full" />
                )}
              </a>
            );
          })}
        </nav>

        {/* 3. RIGHT ACTION AREA (1 Outlined + 1 Primary CTA duy nhất - Hiển thị trên lg >= 1024px) */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Nút Đăng nhập: Outlined tinh tế */}
          <Link
            to="/login"
            className="h-10 px-4 rounded-xl bg-white hover:bg-[#F5F1EB] text-[#1E293B] hover:text-[#0F172A] border border-[#D5CDC3] hover:border-[#A89E92] text-[13.5px] font-semibold transition-all duration-150 flex items-center justify-center whitespace-nowrap shrink-0 shadow-2xs focus-visible:outline-2 focus-visible:outline-[#0D6F64]"
          >
            {lang === 'vi' ? 'Đăng nhập' : 'Log in'}
          </Link>

          {/* Primary CTA duy nhất: Gửi phản ánh */}
          <Link
            to="/reports/new"
            className="h-10 px-5 rounded-xl bg-[#B42318] hover:bg-[#991B1B] active:translate-y-0 hover:-translate-y-[1px] text-white text-[13.5px] font-bold shadow-sm transition-all duration-150 flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B42318]"
          >
            <Send className="w-4 h-4 stroke-[2.2] shrink-0" />
            <span className="whitespace-nowrap">{lang === 'vi' ? 'Gửi phản ánh' : 'Report dust'}</span>
          </Link>
        </div>

        {/* 4. MOBILE / TABLET CONTROLS (< 1024px) */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Primary CTA trên mobile (Touch target >= 44px) */}
          <Link
            to="/reports/new"
            className="min-h-[44px] px-2.5 sm:px-3.5 rounded-xl bg-[#B42318] hover:bg-[#991B1B] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.2] shrink-0" />
            <span className="whitespace-nowrap">{lang === 'vi' ? 'Gửi phản ánh' : 'Report'}</span>
          </Link>

          {/* Toggle Hamburger Button (Chuẩn touch target >= 44px) */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#334155] hover:text-[#0F172A] hover:bg-[#F3EFEA] rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-[#0D6F64]"
            aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* 5. MOBILE DRAWER & BACKDROP (Smooth Slide & Non-blocking zero-glassmorphism) */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[72px] z-40 lg:hidden flex flex-col justify-between">
          {/* Tối giản Backdrop không blur */}
          <div
            className="fixed inset-0 top-[72px] bg-[#0F172A]/40 transition-opacity duration-200"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          <div
            id="mobile-nav-drawer"
            className="relative z-10 flex flex-col justify-between bg-[#FBF9F5] border-b border-[#E2DDD5] shadow-xl px-5 py-5 overflow-y-auto max-h-[calc(100vh-72px)] animate-in fade-in slide-in-from-top-3 duration-200"
            ref={drawerRef}
          >
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-3 mb-1">
                {lang === 'vi' ? 'Điều hướng' : 'Navigation'}
              </span>
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                const linkClass = `min-h-[44px] flex items-center text-[15px] font-medium px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'text-[#B42318] font-bold bg-[#B42318]/10'
                    : 'text-[#1E293B] hover:text-[#B42318] hover:bg-[#F3EFEA]'
                }`;

                if (item.isRoute) {
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={linkClass}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={linkClass}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>

            <div className="pt-5 mt-4 border-t border-[#E8E2D9] flex flex-col gap-2.5">
              {/* Primary Action Mobile */}
              <Link
                to="/reports/new"
                onClick={() => setMobileOpen(false)}
                className="w-full min-h-[44px] h-12 rounded-xl bg-[#B42318] hover:bg-[#991B1B] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'vi' ? 'Gửi phản ánh' : 'Report dust now'}</span>
              </Link>

              {/* Operations Portal CTA */}
              <Link
                to="/login?side=operations"
                onClick={() => setMobileOpen(false)}
                className="w-full min-h-[44px] h-12 rounded-xl bg-white border border-[#0D6F64]/40 hover:bg-[#E6F4F1] text-[#0D6F64] font-bold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>{lang === 'vi' ? 'Dành cho đơn vị xử lý' : 'For Operations Side'}</span>
                <ArrowUpRight className="w-4 h-4 text-[#0D6F64]" />
              </Link>

              {/* Explore Map CTA */}
              <Link
                to="/map"
                onClick={() => setMobileOpen(false)}
                className="w-full min-h-[44px] h-11 rounded-xl bg-[#FAF7F2] border border-[#E2DDD5] text-[#334155] font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>{lang === 'vi' ? 'Khám phá bản đồ' : 'Explore Map'}</span>
              </Link>

              {/* Bottom bar: Login + Lang switch */}
              <div className="flex items-center justify-between pt-3 mt-1 border-t border-[#E8E2D9]/60">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="min-h-[44px] flex items-center text-sm font-semibold text-[#475569] hover:text-[#0F172A] px-2"
                >
                  {lang === 'vi' ? 'Đăng nhập nền tảng →' : 'Sign in →'}
                </Link>

                <button
                  type="button"
                  onClick={onToggleLang}
                  className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-semibold text-[#475569] bg-[#F3EFEA] hover:bg-[#EAE5DF] border border-[#E2DDD5] px-3.5 py-2 rounded-xl transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>{lang === 'vi' ? 'Tiếng Anh (EN)' : 'Tiếng Việt (VI)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
