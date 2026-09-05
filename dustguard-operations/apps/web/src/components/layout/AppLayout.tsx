import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { DevRoleSwitcher } from '../common/DevRoleSwitcher';
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
  ShieldAlert,
  CheckSquare,
  Cpu,
  FileUp,
  Zap,
  Settings,
  Search,
  BarChart3,
  HardHat,
  Radio,
  FileText,
  Scale,
} from 'lucide-react';
import { getRoleLabel } from '@dustguard-operations/shared';

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
  const { user, logout, can } = useAuth();
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 4 Logical Operational Sections (Section 3 of Specification)
  const navSections: NavSection[] = [
    {
      title: 'VẬN HÀNH',
      items: [
        { label: 'Tổng quan', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, perm: 'dashboard:view' },
        { label: 'Vụ việc', path: '/cases', icon: <Inbox className="w-4 h-4" />, perm: 'case:view' },
        { label: 'Nhiệm vụ', path: '/tasks', icon: <CheckSquare className="w-4 h-4" />, perm: 'task:view' },
        { label: 'Hiện trường', path: '/inspections', icon: <ClipboardCheck className="w-4 h-4" />, perm: 'inspection:perform' },
        { label: 'Khắc phục', path: '/actions', icon: <Wrench className="w-4 h-4" />, perm: 'action:create' },
      ],
    },
    {
      title: 'TRÍ TUỆ PHÁP LÝ',
      items: [
        { label: 'Phân tích pháp lý', path: '/tasks?tab=LEGAL', icon: <Scale className="w-4 h-4" />, perm: 'legal:view' },
        { label: 'Thư viện pháp lý', path: '/legal/library', icon: <BookOpen className="w-4 h-4" />, perm: 'legal:view' },
        { label: 'Nhập văn bản pháp lý', path: '/legal/import', icon: <FileUp className="w-4 h-4" />, perm: 'legal:import' },
      ],
    },
    {
      title: 'GIÁM SÁT',
      items: [
        { label: 'IoT & Cảnh báo', path: '/iot', icon: <Radio className="w-4 h-4" />, perm: 'iot:view' },
        { label: 'Bằng chứng số', path: '/evidence', icon: <ShieldCheck className="w-4 h-4" />, perm: 'evidence:view' },
      ],
    },
    {
      title: 'QUẢN TRỊ & BÁO CÁO',
      items: [
        { label: 'Báo cáo vận hành', path: '/reports', icon: <BarChart3 className="w-4 h-4" />, perm: 'dashboard:view' },
        { label: 'Điều phối tải việc', path: '/supervisor/workload', icon: <Users className="w-4 h-4" />, perm: 'workload:view' },
        { label: 'Tự động hóa', path: '/automations', icon: <Zap className="w-4 h-4" />, perm: 'automation:view' },
        { label: 'Người dùng', path: '/admin/users', icon: <User className="w-4 h-4" />, perm: 'user:manage' },
        { label: 'Nhật ký hệ thống', path: '/admin/audit', icon: <FileCheck2 className="w-4 h-4" />, perm: 'audit:view' },
        { label: 'Cấu hình hệ thống', path: '/admin/settings', icon: <Settings className="w-4 h-4" />, perm: 'system:config' },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink-900">
      {/* Dev Mode Banner */}
      <DevRoleSwitcher />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 touch-target"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-dustguard-red flex items-center justify-center text-white shadow-xs font-bold text-lg">
                DG
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-slate-900 text-base tracking-tight block leading-tight">
                  DustGuard Operations
                </span>
                <span className="text-[11px] text-slate-500 font-medium block">
                  Hệ thống Quản lý Vụ việc & Giám sát Hiện trường
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search Input Trigger */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded-lg text-slate-500 transition-colors group"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                <span>Tìm nhanh vụ việc, nhiệm vụ, điều luật, trạm IoT...</span>
              </span>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px] text-slate-600 shadow-2xs">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Right Header: Notifications & User profile */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Mobile Search Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/notifications"
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 touch-target"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2.5 border-l border-slate-200 pl-2.5">
                <Link to="/profile" className="flex items-center gap-2 text-left hover:opacity-85 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300">
                    {user.full_name.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                      {user.full_name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium leading-tight">
                      {getRoleLabel(user.role)}
                    </p>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 touch-target"
                  title="Đăng xuất"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold bg-dustguard-red text-white px-3 py-1.5 rounded-lg hover:bg-dustguard-redHover"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar (Grouped by 4 Operational Areas) */}
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <nav className="civic-card p-3 space-y-4 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {navSections.map(section => {
              const visibleItems = section.items.filter(item => can(item.perm as any));
              if (visibleItems.length === 0) return null;

              return (
                <div key={section.title} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {section.title}
                  </div>
                  {visibleItems.map(item => {
                    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors touch-target ${
                          isActive
                            ? 'bg-rose-50 text-dustguard-red font-bold border-l-4 border-dustguard-red shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span className={isActive ? 'text-dustguard-red' : 'text-slate-500'}>
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
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 max-w-full bg-white h-full shadow-2xl p-4 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="font-bold text-slate-900 text-sm">Danh mục chức năng</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-4">
                  {navSections.map(section => {
                    const visibleItems = section.items.filter(item => can(item.perm as any));
                    if (visibleItems.length === 0) return null;

                    return (
                      <div key={section.title} className="space-y-1">
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {section.title}
                        </div>
                        {visibleItems.map(item => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            <span className="text-slate-500">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {user && (
                <div className="border-t border-slate-200 pt-4">
                  <p className="text-xs font-bold text-slate-800">{user.full_name}</p>
                  <p className="text-[11px] text-slate-500">{user.email}</p>
                  <button
                    onClick={handleLogout}
                    className="mt-3 flex items-center gap-2 text-xs text-rose-600 font-semibold"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 flex items-center justify-around h-14 shadow-lg px-2">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            location.pathname === '/dashboard' ? 'text-dustguard-red font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Tổng quan</span>
        </Link>
        <Link
          to="/cases"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            location.pathname.startsWith('/cases') ? 'text-dustguard-red font-bold' : 'text-slate-500'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Vụ việc</span>
        </Link>
        <Link
          to="/tasks"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            location.pathname === '/tasks' ? 'text-dustguard-red font-bold' : 'text-slate-500'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Nhiệm vụ</span>
        </Link>
        <Link
          to="/inspections"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            location.pathname.startsWith('/inspections') ? 'text-dustguard-red font-bold' : 'text-slate-500'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Hiện trường</span>
        </Link>
        <Link
          to="/reports"
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            location.pathname.startsWith('/reports') ? 'text-dustguard-red font-bold' : 'text-slate-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] mt-0.5">Báo cáo</span>
        </Link>
      </nav>
    </div>
  );
};
