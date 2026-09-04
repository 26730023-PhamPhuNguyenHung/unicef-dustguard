import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { usePermission } from '../../utils/permissions.js';
import { NAVIGATION_CONFIG, NavItemConfig, NavSectionConfig } from '../../config/navigation.js';
import { UserRole } from '@dustguard/shared';
import {
  LogOut,
  PlusCircle,
  Menu,
  X,
  LayoutDashboard,
  Map,
  Bookmark,
  User
} from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, devSwitchRole } = useAuth();
  const { can } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchLoading, setSwitchLoading] = useState(false);

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  const navItemClass = (path: string) => `
    flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all
    ${isActive(path)
      ? 'bg-primary-light text-primary font-bold shadow-xs'
      : 'text-content-sub hover:bg-surface-secondary hover:text-content-main'
    }
  `;

  // Xử lý chuyển đổi Dev Role an toàn kèm revalidation route
  const handleDevSwitchRole = async (targetRole: UserRole) => {
    if (switchLoading) return;
    setSwitchLoading(true);
    try {
      await devSwitchRole(targetRole);

      // Revalidate ngay lập tức route hiện tại
      const currentPath = location.pathname;
      if (currentPath.startsWith('/moderator') && targetRole !== 'moderator' && targetRole !== 'admin') {
        navigate('/dashboard', { replace: true });
      } else if (currentPath.startsWith('/admin') && targetRole !== 'admin') {
        navigate('/dashboard', { replace: true });
      } else if ((currentPath === '/tasks' || currentPath === '/contributions') && targetRole === 'citizen') {
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
      // Lọc các item thỏa mãn capability permission
      const visibleItems = section.items.filter((item: NavItemConfig) => can(item.permission));

      // BẮT BUỘC: Section không có item visible thì KHÔNG render section header
      if (visibleItems.length === 0) {
        return null;
      }

      const SectionIcon = section.icon;

      return (
        <div key={section.id} className="pt-3 first:pt-0 space-y-1">
          <div className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1.5 flex items-center gap-1.5 text-content-muted">
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
    <div className="min-h-screen bg-surface-bg flex flex-col lg:flex-row text-content-main">
      {/* 1. Sidebar Desktop (240px) */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface-card border-r border-border-subtle shrink-0 h-screen sticky top-0 overflow-y-auto">
        {/* Brand */}
        <div className="p-5 border-b border-border-subtle">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🛡️
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-content-main leading-none">
                DustGuard
              </div>
              <div className="text-[10px] font-extrabold tracking-widest text-primary uppercase mt-0.5">
                COMMUNITY
              </div>
            </div>
          </Link>
        </div>

        {/* Primary CTA */}
        <div className="p-4">
          <Link
            to="/reports/new"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all shadow-xs active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Gửi phản ánh
          </Link>
        </div>

        {/* Dynamic Navigation Links based on Permissions */}
        <nav className="flex-1 px-3 space-y-3 overflow-y-auto pb-6">
          {renderNavSections()}
        </nav>

        {/* User Footer */}
        <div className="p-3 border-t border-border-subtle bg-surface-secondary/40">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-xs shrink-0 border border-primary/20">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-content-main truncate">{user.fullName}</div>
                  <div className="text-[11px] text-content-sub font-semibold capitalize">
                    {user.role.replace('_', ' ')}
                  </div>
                </div>
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 text-content-sub hover:text-red-600 rounded-lg hover:bg-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to="/login"
                className="w-full py-2 text-center text-xs font-bold rounded-xl bg-white border border-border-subtle hover:border-primary text-content-main transition-colors shadow-xs"
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Mobile Top Bar */}
      <header className="lg:hidden bg-surface-card border-b border-border-subtle p-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <span className="font-extrabold text-sm tracking-tight text-content-main">
            DustGuard <span className="text-primary font-bold">COMMUNITY</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/reports/new"
            className="p-2 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Gửi tin</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-border-subtle text-content-sub hover:bg-surface-secondary transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-14 bg-white z-40 p-4 overflow-y-auto space-y-4 shadow-xl">
          <div className="space-y-4">
            {renderNavSections(() => setMobileMenuOpen(false))}
          </div>
        </div>
      )}

      {/* 3. Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-12">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1180px] w-full mx-auto">
          {children}
        </div>
      </main>

      {/* 4. Mobile Bottom Navigation (5 tabs) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface-card border-t border-border-subtle flex items-center justify-around py-2 px-1 z-30 shadow-lg">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            isActive('/dashboard') ? 'text-primary font-bold' : 'text-content-sub'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Trang chủ</span>
        </Link>
        <Link
          to="/map"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            isActive('/map') ? 'text-primary font-bold' : 'text-content-sub'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Bản đồ</span>
        </Link>
        <Link
          to="/reports/new"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-primary"
        >
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center -mt-5 shadow-md border-2 border-white active:scale-95 transition-transform">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span>Gửi tin</span>
        </Link>
        <Link
          to="/following"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            isActive('/following') ? 'text-primary font-bold' : 'text-content-sub'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Theo dõi</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${
            isActive('/profile') ? 'text-primary font-bold' : 'text-content-sub'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Hồ sơ</span>
        </Link>
      </nav>

      {/* 5. Dev Mode Quick Role Switcher Bar (CHỈ RENDER KHI import.meta.env.DEV === true) */}
      {import.meta.env.DEV === true && (
        <div className="fixed bottom-16 lg:bottom-4 right-4 bg-white border border-border-subtle rounded-2xl shadow-lg p-2 flex items-center gap-1.5 z-50 text-xs">
          <span className="font-extrabold text-[10px] text-content-sub uppercase tracking-wider px-1.5 hidden sm:inline">
            DEV ROLE:
          </span>
          <button
            type="button"
            disabled={switchLoading}
            onClick={() => handleDevSwitchRole('citizen')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              user?.role === 'citizen'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-secondary text-content-main hover:bg-gray-200'
            }`}
          >
            Citizen
          </button>
          <button
            type="button"
            disabled={switchLoading}
            onClick={() => handleDevSwitchRole('community_member')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              user?.role === 'community_member' || (user?.role as string) === 'member'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-secondary text-content-main hover:bg-gray-200'
            }`}
          >
            Member
          </button>
          <button
            type="button"
            disabled={switchLoading}
            onClick={() => handleDevSwitchRole('moderator')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              user?.role === 'moderator'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-secondary text-content-main hover:bg-gray-200'
            }`}
          >
            Moderator
          </button>
          <button
            type="button"
            disabled={switchLoading}
            onClick={() => handleDevSwitchRole('admin')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              user?.role === 'admin'
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-secondary text-content-main hover:bg-gray-200'
            }`}
          >
            Admin
          </button>
        </div>
      )}
    </div>
  );
};
export default AppShell;
