import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { usePermission } from '../../utils/permissions.js';
import { NAVIGATION_CONFIG, NavItemConfig, NavSectionConfig } from '../../config/navigation.js';
import { UserRole } from '@dustguard/shared';
import { apiRequest } from '../../api/client.js';
import { OPERATIONS_APP_URL } from '../../config/constants.js';
import {
  LogOut,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  Map,
  Bookmark,
  User,
  Bell,
  Search,
  ChevronDown,
  ShieldCheck
} from 'lucide-react';

const ROLE_LABELS: Record<string, string> = {
  citizen: 'Người dân',
  community_member: 'Thành viên CLB',
  member: 'Thành viên CLB',
  moderator: 'Điều phối viên',
  admin: 'Quản trị viên'
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, devSwitchRole } = useAuth();
  const { can } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (user) {
      apiRequest<any>('/notifications')
        .then((res) => {
          const list = Array.isArray(res) ? res : (res.notifications || []);
          const unread = list.filter((n: any) => !n.is_read && !n.isRead).length;
          setUnreadNotifications(unread);
        })
        .catch(() => {});
    } else {
      setUnreadNotifications(0);
    }
  }, [user, location.pathname]);

  // Đóng mobile menu khi chuyển route
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Khóa cuộn trang nền và lắng nghe Escape khi mở mobile drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) return true;
    if (path === '/reports' && location.pathname === '/reports') return true;
    if (path !== '/dashboard' && path !== '/reports') {
      return location.pathname.startsWith(path);
    }
    return false;
  };

  const navItemClass = (path: string) => `
    flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-civic text-xs font-semibold transition-all select-none
    ${isActive(path)
      ? 'bg-primary-light text-primary font-bold border-l-3 border-primary shadow-xs'
      : 'text-content-sub hover:bg-surface-secondary hover:text-content-main'
    }
  `;

  // Xử lý chuyển đổi Dev Role an toàn kèm revalidation route
  const handleDevSwitchRole = async (targetRole: UserRole) => {
    if (switchLoading) return;
    setSwitchLoading(true);
    try {
      await devSwitchRole(targetRole);

      // Revalidate ngay lập tức route hiện tại nếu quyền hạn thay đổi
      const currentPath = location.pathname;
      if (currentPath.startsWith('/moderator') && targetRole !== 'moderator' && targetRole !== 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (currentPath.startsWith('/admin') && targetRole !== 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (currentPath === '/tasks' && targetRole === 'citizen') {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Lỗi khi chuyển dev role:', err);
    } finally {
      setSwitchLoading(false);
    }
  };

  // Render các section được phân quyền khai báo
  const renderNavSections = (onItemClick?: () => void) => {
    return NAVIGATION_CONFIG.map((section: NavSectionConfig) => {
      const visibleItems = section.items.filter((item: NavItemConfig) => can(item.permission));

      if (visibleItems.length === 0) {
        return null;
      }

      const SectionIcon = section.icon;

      return (
        <div key={section.id} className="pt-3 first:pt-0 space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 flex items-center gap-1.5 text-content-muted">
            {SectionIcon && <SectionIcon className="w-3.5 h-3.5 text-primary" />}
            {section.title}
          </div>

          <div className="space-y-0.5">
            {visibleItems.map((item: NavItemConfig) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onItemClick}
                  className={navItemClass(item.path)}
                >
                  <ItemIcon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col lg:flex-row text-content-main antialiased">
      {/* 1. Sidebar Desktop (240px) */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface-card border-r border-border-subtle shrink-0 h-screen sticky top-0 z-20">
        {/* Brand Header */}
        <div className="p-4 border-b border-border-subtle shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5 select-none group">
            <img
              src="/images/logo/dustguard-shield-logo.webp"
              alt="DustGuard Shield Logo"
              className="h-8 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform"
              width={28}
              height={33}
            />
            <div>
              <div className="font-extrabold text-base tracking-tight text-content-main leading-tight">
                DustGuard
              </div>
              <div className="text-[11px] font-medium text-content-sub leading-none mt-0.5">
                Cộng đồng môi trường
              </div>
            </div>
          </Link>
        </div>

        {/* Dominant Primary Action CTA */}
        <div className="p-3.5 pb-2 shrink-0">
          <Link
            to="/reports/new"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-civic bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-all shadow-xs active:scale-98 cursor-pointer whitespace-nowrap shrink-0"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Gửi phản ánh</span>
          </Link>
        </div>

        {/* Dynamic Navigation Links */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto pb-4 scrollbar-thin">
          {renderNavSections()}
        </nav>

        {/* User Footer Card & Integrated Dev Mode Role Switcher */}
        <div className="p-3 border-t border-border-subtle bg-surface-subtle/80 space-y-2 shrink-0">
          {/* Dev-Only Role Switcher Dropdown (Never renders in Production) */}
          {import.meta.env.DEV === true && (
            <div className="p-1.5 rounded-civic bg-surface-secondary/70 border border-border-subtle flex items-center justify-between text-[11px]">
              <span className="font-extrabold text-[10px] text-content-muted uppercase tracking-wider px-1">
                DEV:
              </span>
              <select
                disabled={switchLoading}
                value={user?.role || 'citizen'}
                onChange={(e) => handleDevSwitchRole(e.target.value as UserRole)}
                className="text-xs font-semibold bg-white text-content-main border border-border-subtle rounded-md py-1 px-2 cursor-pointer outline-none focus:border-primary"
                aria-label="Chọn vai trò thử nghiệm"
              >
                <option value="citizen">Người dân (Citizen)</option>
                <option value="community_member">Thành viên CLB (Member)</option>
                <option value="moderator">Điều phối viên (Moderator)</option>
                <option value="admin">Quản trị viên (Admin)</option>
              </select>
            </div>
          )}

          {user ? (
            <div className="flex items-center justify-between gap-2">
              <Link to="/profile" className="flex items-center gap-2.5 overflow-hidden hover:opacity-85 transition-opacity flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
                  {(user.fullName || (user as any).full_name || user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-content-main truncate">
                    {user.fullName || (user as any).full_name || (user.email ? user.email.split('@')[0] : 'Người dùng')}
                  </div>
                  <div className="text-[10px] text-content-sub font-semibold">
                    {ROLE_LABELS[user.role] || user.role || 'Thành viên'}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 text-content-sub hover:text-primary rounded-md hover:bg-white transition-colors cursor-pointer"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="w-full py-2 text-center text-xs font-bold rounded-civic bg-white border border-border-subtle hover:border-primary text-content-main transition-colors shadow-xs"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Top Header Shell (Desktop & Mobile) */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-surface-card border-b border-border-subtle sticky top-0 z-30 shadow-xs flex items-center justify-between px-3 sm:px-6 shrink-0">
          {/* Mobile brand & toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 lg:hidden shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-content-sub hover:bg-surface-secondary touch-target min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
              aria-label="Mở menu điều hướng"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/dashboard" className="flex items-center gap-1.5 sm:gap-2 select-none shrink-0">
              <img
                src="/images/logo/dustguard-shield-logo.webp"
                alt="DustGuard Shield"
                className="h-7 w-auto object-contain"
                width={24}
                height={28}
              />
              <span className="font-extrabold text-sm tracking-tight text-content-main whitespace-nowrap">
                DustGuard
              </span>
            </Link>
          </div>

          {/* Desktop Left Breadcrumb / Context */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-content-sub font-medium">
            <span className="font-bold text-content-main">Cộng đồng DustGuard VN</span>
            <span>•</span>
            <span className="text-content-muted">Hệ thống Giám sát & Bàn giao Minh bạch Môi trường</span>
          </div>

          {/* Right Utilities: Notifications, Portal Link & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Quick Link to Operations Side B (Transparent Civic Coordination) */}
            <a
              href={OPERATIONS_APP_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold bg-surface-secondary hover:bg-gray-200 text-content-sub border border-border-subtle transition-colors min-h-[40px] whitespace-nowrap"
              title="Mở Cổng Điều hành Chuyên trách (Side B)"
            >
              <ShieldCheck className="w-4 h-4 text-[#0D6F64] shrink-0" />
              <span>Cổng Điều hành (Side B)</span>
            </a>

            {/* Notifications with Real Badge */}
            <Link
              to="/notifications"
              className="relative p-1.5 sm:p-2 rounded-md text-content-sub hover:bg-surface-secondary hover:text-content-main touch-target min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center shrink-0"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </Link>

            {/* Mobile Header CTA */}
            <div className="lg:hidden shrink-0">
              <Link
                to="/reports/new"
                className="p-2 sm:px-3.5 sm:py-2 rounded-civic bg-primary text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs active:scale-95 min-h-[40px] min-w-[40px] whitespace-nowrap shrink-0"
                aria-label="Gửi phản ánh"
                title="Gửi phản ánh"
              >
                <PlusCircle className="w-4 h-4 shrink-0" />
                <span className="hidden min-[360px]:inline whitespace-nowrap">Gửi phản ánh</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Mobile Drawer Menu with Solid Backdrop */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label="Menu điều hướng">
            {/* Solid Dark Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-[#171313]/60 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-out Drawer Panel */}
            <div className="relative w-72 max-w-[85vw] bg-surface-card h-full flex flex-col shadow-2xl z-10 border-r border-border-subtle">
              {/* Drawer Header */}
              <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 select-none"
                >
                  <img
                    src="/images/logo/dustguard-shield-logo.webp"
                    alt="DustGuard Shield"
                    className="h-7 w-auto object-contain"
                    width={24}
                    height={28}
                  />
                  <div>
                    <div className="font-extrabold text-sm tracking-tight text-content-main leading-tight">
                      DustGuard
                    </div>
                    <div className="text-[10px] font-medium text-content-sub leading-none mt-0.5">
                      Cộng đồng môi trường
                    </div>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-content-sub hover:bg-surface-secondary touch-target min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Đóng menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Primary Action CTA */}
              <div className="p-3 border-b border-border-subtle">
                <Link
                  to="/reports/new"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-civic bg-primary text-white font-bold text-xs hover:bg-primary-hover transition-all shadow-xs min-h-[44px]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Gửi phản ánh</span>
                </Link>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="flex-1 px-3 py-2 space-y-2 overflow-y-auto scrollbar-thin">
                {renderNavSections(() => setMobileMenuOpen(false))}

                {/* Mobile Side B Link inside Drawer */}
                <div className="pt-3 border-t border-border-subtle mt-3">
                  <a
                    href={OPERATIONS_APP_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-civic text-xs font-semibold text-content-sub hover:bg-surface-secondary transition-colors min-h-[44px]"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0D6F64] shrink-0" />
                    <span>Cổng Điều hành (Side B)</span>
                  </a>
                </div>
              </nav>

              {/* Drawer Footer with User Info / Dev Role Switcher */}
              <div className="p-3 border-t border-border-subtle bg-surface-subtle pb-safe space-y-2">
                {import.meta.env.DEV === true && (
                  <div className="p-1.5 rounded-civic bg-surface-secondary/70 border border-border-subtle flex items-center justify-between text-[11px]">
                    <span className="font-extrabold text-[10px] text-content-muted uppercase tracking-wider px-1">
                      DEV:
                    </span>
                    <select
                      disabled={switchLoading}
                      value={user?.role || 'citizen'}
                      onChange={(e) => handleDevSwitchRole(e.target.value as UserRole)}
                      className="text-xs font-semibold bg-white text-content-main border border-border-subtle rounded-md py-1.5 px-2 cursor-pointer outline-none focus:border-primary min-h-[38px]"
                      aria-label="Chọn vai trò thử nghiệm"
                    >
                      <option value="citizen">Người dân (Citizen)</option>
                      <option value="community_member">Thành viên CLB (Member)</option>
                      <option value="moderator">Điều phối viên (Moderator)</option>
                      <option value="admin">Quản trị viên (Admin)</option>
                    </select>
                  </div>
                )}

                {user ? (
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 overflow-hidden hover:opacity-85 transition-opacity flex-1 min-w-0 min-h-[44px]"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
                        {(user.fullName || (user as any).full_name || user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-content-main truncate">
                          {user.fullName || (user as any).full_name || (user.email ? user.email.split('@')[0] : 'Người dùng')}
                        </div>
                        <div className="text-[10px] text-content-sub font-semibold">
                          {ROLE_LABELS[user.role] || user.role || 'Thành viên'}
                        </div>
                      </div>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setMobileMenuOpen(false);
                      }}
                      title="Đăng xuất"
                      className="p-2 text-content-sub hover:text-primary rounded-md hover:bg-white transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                      aria-label="Đăng xuất"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-bold rounded-civic bg-white border border-border-subtle hover:border-primary text-content-main transition-colors shadow-xs min-h-[44px] flex items-center justify-center"
                  >
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. Main Content Container (Civic SSOT Page Container) */}
        <main className="flex-1 min-w-0 pb-24 lg:pb-12">
          <div className="civic-container py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>

      {/* 4. Mobile Bottom Navigation Bar (5 Primary Tabs with Safe-Area) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-card border-t border-border-subtle flex items-center justify-around z-30 shadow-lg pb-safe pt-1 px-1">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium touch-target min-h-[44px] min-w-[44px] shrink-0 ${
            isActive('/dashboard') ? 'text-primary font-bold' : 'text-content-sub'
          }`}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Trang chủ</span>
        </Link>
        <Link
          to="/map"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium touch-target min-h-[44px] min-w-[44px] shrink-0 ${
            isActive('/map') ? 'text-primary font-bold' : 'text-content-sub'
          }`}
        >
          <Map className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Bản đồ</span>
        </Link>
        <Link
          to="/reports/new"
          className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-primary touch-target min-h-[44px] min-w-[44px] shrink-0"
          aria-label="Gửi phản ánh mới"
        >
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center -mt-5 shadow-md border-2 border-white active:scale-95 transition-transform shrink-0">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="whitespace-nowrap">Gửi phản ánh</span>
        </Link>
        <Link
          to="/following"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium touch-target min-h-[44px] min-w-[44px] shrink-0 ${
            isActive('/following') ? 'text-primary font-bold' : 'text-content-sub'
          }`}
        >
          <Bookmark className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Theo dõi</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium touch-target min-h-[44px] min-w-[44px] shrink-0 ${
            isActive('/profile') ? 'text-primary font-bold' : 'text-content-sub'
          }`}
        >
          <User className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">Hồ sơ</span>
        </Link>
      </nav>
    </div>
  );
};

export default AppShell;
