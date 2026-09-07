import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, DEV_ACCOUNTS } from '../../context/AuthContext';
import { api } from '../../api/client';
import { CommandPalette } from '../common/CommandPalette';
import {
  LayoutDashboard,
  Inbox,
  ClipboardCheck,
  BookOpen,
  Wrench,
  Bell,
  User,
  Users,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  FileCheck2,
  CheckSquare,
  FileUp,
  Zap,
  Settings,
  Search,
  BarChart3,
  HardHat,
  Radio,
  Scale,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { Role, getRoleLabel } from '@dustguard-operations/shared';

interface NavSection {
  title: string;
  items: Array<{
    label: string;
    path: string;
    icon: React.ReactNode;
    perm: string;
    badge?: number;
  }>;
}

export const AppLayout: React.FC = () => {
  const { user, logout, can, switchRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.notifications.list().then(res => setUnreadCount(res.unreadCount)).catch(() => {});
    }
  }, [user, location.pathname]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Body scroll lock on mobile drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 4 Logical Operational Sections (Consistent Information Architecture)
  const navSections: NavSection[] = [
    {
      title: 'VẬN HÀNH',
      items: [
        { label: 'Tổng quan', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 shrink-0" />, perm: 'dashboard:view' },
        { label: 'Vụ việc', path: '/cases', icon: <Inbox className="w-4 h-4 shrink-0" />, perm: 'case:view' },
        { label: 'Công trình', path: '/projects', icon: <HardHat className="w-4 h-4 shrink-0" />, perm: 'case:view' },
        { label: 'Nhà thầu', path: '/contractors', icon: <Building2 className="w-4 h-4 shrink-0" />, perm: 'case:view' },
        { label: 'Nhiệm vụ', path: '/tasks', icon: <CheckSquare className="w-4 h-4 shrink-0" />, perm: 'task:view' },
        { label: 'Hiện trường', path: '/inspections', icon: <ClipboardCheck className="w-4 h-4 shrink-0" />, perm: 'inspection:perform' },
        { label: 'Khắc phục', path: '/actions', icon: <Wrench className="w-4 h-4 shrink-0" />, perm: 'action:create' },
      ],
    },
    {
      title: 'TRÍ TUỆ PHÁP LÝ',
      items: [
        { label: 'Phân tích pháp lý', path: '/tasks?tab=LEGAL', icon: <Scale className="w-4 h-4 shrink-0" />, perm: 'legal:view' },
        { label: 'Thư viện pháp lý', path: '/legal/library', icon: <BookOpen className="w-4 h-4 shrink-0" />, perm: 'legal:view' },
        { label: 'Nhập văn bản pháp lý', path: '/legal/import', icon: <FileUp className="w-4 h-4 shrink-0" />, perm: 'legal:import' },
      ],
    },
    {
      title: 'GIÁM SÁT',
      items: [
        { label: 'IoT & Cảnh báo', path: '/iot', icon: <Radio className="w-4 h-4 shrink-0" />, perm: 'iot:view' },
        { label: 'Bằng chứng số', path: '/evidence', icon: <ShieldCheck className="w-4 h-4 shrink-0" />, perm: 'evidence:view' },
      ],
    },
    {
      title: 'QUẢN TRỊ & BÁO CÁO',
      items: [
        { label: 'Báo cáo vận hành', path: '/reports', icon: <BarChart3 className="w-4 h-4 shrink-0" />, perm: 'dashboard:view' },
        { label: 'Điều phối tải việc', path: '/supervisor/workload', icon: <Users className="w-4 h-4 shrink-0" />, perm: 'workload:view' },
        { label: 'Tự động hóa', path: '/automations', icon: <Zap className="w-4 h-4 shrink-0" />, perm: 'automation:view' },
        { label: 'Người dùng', path: '/admin/users', icon: <User className="w-4 h-4 shrink-0" />, perm: 'user:manage' },
        { label: 'Nhật ký hệ thống', path: '/admin/audit', icon: <FileCheck2 className="w-4 h-4 shrink-0" />, perm: 'audit:view' },
        { label: 'Cấu hình hệ thống', path: '/admin/settings', icon: <Settings className="w-4 h-4 shrink-0" />, perm: 'system:config' },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-page text-ink-900 overflow-x-hidden w-full">
      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* Top Header - Standardized Workspace Shell (56px, Full-width, Zero Debug Clutter) */}
      <header className="h-14 bg-surface border-b border-slate-200/90 sticky top-0 z-30 shadow-xs w-full">
        <div className="w-full px-3 sm:px-5 lg:px-6 h-full flex items-center justify-between gap-3">
          {/* Left: Logo & Product Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-ink-700 hover:bg-surface-subtle touch-target min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5 select-none group">
              <img
                src="/images/logo/dustguard-shield-logo.webp"
                alt="DustGuard VN Shield"
                className="h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
                width={28}
                height={33}
              />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-ink-900 text-sm sm:text-base tracking-tight leading-none">
                    DustGuard <span className="text-dustguard-red">Operations</span>
                  </span>
                  <span className="text-[9px] font-bold text-[#0D6F64] bg-[#0D6F64]/10 border border-[#0D6F64]/20 px-1.5 py-0.5 rounded leading-none uppercase">
                    Side B
                  </span>
                </div>
                <span className="text-[10px] text-ink-500 font-medium block mt-0.5 leading-none">
                  Quản lý Vụ việc & Giám sát Hiện trường
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Input Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs bg-surface-subtle hover:bg-stone-200/70 border border-slate-200/90 rounded-md text-ink-500 transition-colors group cursor-pointer min-h-[36px]"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-ink-400 group-hover:text-ink-600" />
                <span className="truncate">Tìm nhanh vụ việc, nhiệm vụ, điều luật, trạm IoT...</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px] text-ink-500 shadow-2xs">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right: Role Switcher, Actions, Notifications & Profile */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Icon Trigger for < md */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="md:hidden p-2 rounded-lg text-ink-700 hover:bg-surface-subtle touch-target min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Integrated Role Switcher — DEV-ONLY convenience.
                This re-authenticates as another seed account using a well-known
                demo password, so it must never render in a production build
                (it would let any logged-in user one-click-escalate to admin). */}
            {user && import.meta.env.DEV && (
              <div className="relative hidden md:inline-flex items-center">
                <select
                  aria-label="Chuyển đổi vai trò nghiệp vụ (chỉ môi trường phát triển)"
                  value={user.role}
                  onChange={e => switchRole(e.target.value as Role)}
                  className="text-xs font-semibold bg-surface-subtle hover:bg-stone-200/60 text-ink-800 border border-slate-200/90 rounded-md py-1.5 pl-2.5 pr-7 appearance-none cursor-pointer outline-none focus:ring-1 focus:ring-dustguard-red transition-colors min-h-[36px]"
                >
                  {(Object.keys(DEV_ACCOUNTS) as Role[]).map(r => (
                    <option key={r} value={r}>
                      {DEV_ACCOUNTS[r].label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-ink-400 absolute right-2 pointer-events-none" />
              </div>
            )}

            {/* Cross-Side Link to Community Portal (Side A) */}
            <a
              href={import.meta.env.PROD ? '/' : 'http://localhost:3000'}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-surface-subtle hover:bg-stone-200/60 text-ink-700 border border-slate-200/90 transition-colors"
              title="Mở Cổng Cộng đồng & Người dân (Side A)"
            >
              <Users className="w-3.5 h-3.5 text-[#0D6F64]" />
              <span>Cổng Cộng đồng (Side A)</span>
            </a>

            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-lg text-ink-700 hover:bg-surface-subtle hover:text-ink-900 touch-target min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors"
              aria-label="Thông báo"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-dustguard-red text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Current User */}
            {user ? (
              <div className="flex items-center gap-1 sm:gap-2 border-l border-slate-200 pl-1.5 sm:pl-2">
                <Link to="/profile" className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity min-h-[44px] px-1 rounded-md">
                  <div className="w-7.5 h-7.5 rounded-full bg-surface-subtle text-ink-700 flex items-center justify-center font-bold text-xs border border-slate-200 shrink-0">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="hidden min-[1366px]:block">
                    <p className="text-xs font-bold text-ink-900 leading-tight truncate max-w-[120px]">
                      {user.full_name}
                    </p>
                    <p className="text-[10px] text-ink-500 font-medium leading-tight">
                      {getRoleLabel(user.role)}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-ink-500 hover:text-dustguard-red hover:bg-surface-subtle rounded-lg cursor-pointer touch-target min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors"
                  title="Đăng xuất"
                  aria-label="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold bg-dustguard-red text-white px-3 py-1.5 rounded-md hover:bg-dustguard-redHover min-h-[36px] inline-flex items-center"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Layout (Full-width, Responsive Sidebar: 68px / 196px / 216px) */}
      <div className="flex-1 flex w-full min-w-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[68px] min-[1200px]:w-[196px] min-[1440px]:w-[216px] shrink-0 border-r border-slate-200/90 bg-surface min-h-[calc(100vh-3.5rem)] sticky top-14 self-start max-h-[calc(100vh-3.5rem)] overflow-y-auto scrollbar-thin">
          <nav className="p-2 space-y-3">
            {navSections.map((section, sIdx) => {
              const visibleItems = section.items.filter(item => can(item.perm as any));
              if (visibleItems.length === 0) return null;

              return (
                <div key={section.title} className="space-y-0.5">
                  {/* Title in expanded mode */}
                  <div className="hidden min-[1200px]:block px-2 py-1 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                    {section.title}
                  </div>
                  {/* Divider in icon mode (< 1200px) */}
                  {sIdx > 0 && (
                    <div className="min-[1200px]:hidden h-px bg-slate-200/80 my-2 mx-1" />
                  )}

                  {visibleItems.map(item => {
                    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        title={item.label}
                        className={`flex items-center justify-center min-[1200px]:justify-start gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-dustguard-redSoft text-dustguard-red font-bold border-l-3 border-dustguard-red shadow-2xs'
                            : 'text-ink-700 hover:bg-surface-subtle hover:text-ink-900'
                        }`}
                      >
                        <span className={isActive ? 'text-dustguard-red shrink-0' : 'text-ink-400 shrink-0'}>
                          {item.icon}
                        </span>
                        <span className="hidden min-[1200px]:inline truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
            <div
              className="fixed inset-0 bg-ink-900/50 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-[280px] max-w-[calc(100vw-3rem)] bg-surface h-full shadow-2xl border-r border-slate-200 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto z-10 scrollbar-thin">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/logo/dustguard-shield-logo.webp"
                      alt="DustGuard"
                      className="h-6 w-auto object-contain"
                      width={20}
                      height={24}
                    />
                    <span className="font-bold text-ink-900 text-sm">Danh mục chức năng</span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-ink-500 hover:text-ink-900 hover:bg-surface-subtle rounded-lg cursor-pointer touch-target min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors"
                    aria-label="Đóng menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-4">
                  {navSections.map(section => {
                    const visibleItems = section.items.filter(item => can(item.perm as any));
                    if (visibleItems.length === 0) return null;

                    return (
                      <div key={section.title} className="space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-ink-400 uppercase tracking-wider">
                          {section.title}
                        </div>
                        {visibleItems.map(item => {
                          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));
                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold min-h-[44px] transition-colors touch-target ${
                                isActive
                                  ? 'bg-dustguard-redSoft text-dustguard-red font-bold border-l-3 border-dustguard-red shadow-2xs'
                                  : 'text-ink-700 hover:bg-surface-subtle hover:text-ink-900'
                              }`}
                            >
                              <span className={isActive ? 'text-dustguard-red shrink-0' : 'text-ink-400 shrink-0'}>
                                {item.icon}
                              </span>
                              <span className="truncate">{item.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 text-xs font-semibold text-rose-700 w-full min-h-[44px] px-3 py-2.5 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors touch-target"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Đăng xuất tài khoản</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Route Content (Full width fluid canvas) */}
        <main className="flex-1 min-w-0 w-full p-3.5 sm:p-5 lg:p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

    </div>
  );
};
