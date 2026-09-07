import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { resolveCommunityHome } from '../utils/auth-redirect.js';
import { getDefaultRoute, CANONICAL_ROUTES } from '../config/routes.js';
import { LogIn, Mail, Lock, User, AlertCircle, Shield, Building2, CheckCircle2, Sparkles, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { OPERATIONS_APP_URL } from '../config/constants';

const COMMUNITY_DEMO_ACCOUNTS = [
  {
    name: 'Nguyễn Văn Dân',
    roleLabel: 'Người dân',
    email: 'citizen@dustguard.local',
    initials: 'VD'
  },
  {
    name: 'Trần Thị Tình Nguyện',
    roleLabel: 'Thành viên CLB',
    email: 'member@dustguard.local',
    initials: 'TN'
  },
  {
    name: 'Lê Hoàng Điều Phối',
    roleLabel: 'Điều phối viên',
    email: 'moderator@dustguard.local',
    initials: 'ĐP'
  },
  {
    name: 'Phạm Quản Trị',
    roleLabel: 'Quản trị cộng đồng',
    email: 'admin@dustguard.local',
    initials: 'QT'
  }
];

const OPERATIONS_DEMO_ACCOUNTS = [
  {
    name: 'Nguyễn Minh Anh',
    roleLabel: 'Cán bộ hiện trường',
    username: 'canbo.hientruong',
    initials: 'MA'
  },
  {
    name: 'Trần Quốc Minh',
    roleLabel: 'Lãnh đạo điều phối',
    username: 'lanhdao.dieuphoi',
    initials: 'QM'
  },
  {
    name: 'Lê Thanh Hà',
    roleLabel: 'Chuyên viên pháp chế',
    username: 'chuyenvien.phapche',
    initials: 'TH'
  },
  {
    name: 'Quản trị DustGuard',
    roleLabel: 'Quản trị vận hành',
    username: 'quantri.dustguard',
    initials: 'DG'
  }
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginCommunity } = useAuth();

  // Đọc query parameters và location state
  const queryParams = new URLSearchParams(location.search);
  const initialSide = queryParams.get('side') === 'operations' ? 'professional' : 'community';
  const requestedPath = (location.state as any)?.from?.pathname || queryParams.get('returnTo') || null;

  const [activeSide, setActiveSide] = useState<'community' | 'professional'>(initialSide);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Chế độ trải nghiệm nhanh: Luôn sẵn sàng cho Ban Giám khảo và đối tác đánh giá
  const [demoMode] = useState<boolean>(true);

  // Tự động chuyển tab nếu URL thay đổi
  useEffect(() => {
    const side = new URLSearchParams(location.search).get('side');
    if (side === 'operations') {
      setActiveSide('professional');
    }
  }, [location.search]);

  // Reset form khi chuyển tab
  const handleTabChange = (side: 'community' | 'professional') => {
    setActiveSide(side);
    setErrorMsg(null);
    setIdentifier('');
    setPassword('');
  };

  // Đăng nhập Phía Cộng đồng
  const handleCommunitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const loggedInUser = await loginCommunity(identifier, password);
      const target = resolveCommunityHome(loggedInUser, requestedPath);
      navigate(target, { replace: true });
    } catch (err: any) {
      if (err.status === 401) {
        setErrorMsg('Email hoặc mật khẩu chưa đúng.');
      } else if (err.status === 403) {
        setErrorMsg(err.message || 'Tài khoản này thuộc Đơn vị Xử lý. Vui lòng chuyển sang tab Đơn vị Xử lý.');
      } else if (err.status === 429) {
        setErrorMsg('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.');
      } else if (err.status >= 500) {
        setErrorMsg('Hệ thống đang gặp sự cố. Vui lòng thử lại sau.');
      } else if (err.code === 'NETWORK_ERROR') {
        setErrorMsg('Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.');
      } else {
        setErrorMsg(err.message || 'Email hoặc mật khẩu chưa đúng.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Đăng nhập Phía Đơn vị Xử lý (Operations)
  const handleOperationsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const opsUrl = import.meta.env.PROD
        ? '/api/operations/auth/login'
        : (import.meta.env.VITE_OPERATIONS_API_URL || `${OPERATIONS_APP_URL}/api/auth/login`);

      let response = await fetch(opsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: identifier.trim(),
          email: identifier.trim(),
          identifier: identifier.trim(),
          password
        })
      });

      // Fallback cho local dev nếu proxy khác cổng
      if (response.status === 404 && !import.meta.env.PROD) {
        response = await fetch(`${OPERATIONS_APP_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: identifier.trim(),
            email: identifier.trim(),
            identifier: identifier.trim(),
            password
          })
        });
      }

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        if (response.status >= 500) {
          throw new Error('Không thể kết nối hệ thống lúc này. Vui lòng thử lại.');
        }
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Tên đăng nhập hoặc mật khẩu chưa đúng.');
        } else if (response.status === 403) {
          throw new Error(data.detail || data.title || 'Tài khoản này thuộc Phía Cộng đồng. Vui lòng chuyển sang tab Phía Cộng đồng.');
        } else if (response.status === 429) {
          throw new Error('Bạn đã thử quá nhiều lần. Vui lòng thử lại sau.');
        } else if (response.status >= 500) {
          throw new Error('Không thể kết nối hệ thống lúc này. Vui lòng thử lại.');
        }
        throw new Error(data.detail || data.title || 'Tên đăng nhập hoặc mật khẩu chưa đúng.');
      }

      if (!data.token) {
        throw new Error('Máy chủ không trả về mã xác thực phiên.');
      }

      // Lưu token vào localStorage (dùng chung domain với Side B)
      localStorage.setItem('dustguard_token', data.token);

      // Phân giải trang đích chuẩn tắc cho vai trò
      const targetPath = getDefaultRoute(data.user?.role, 'operations', requestedPath);

      // Điều hướng trực tiếp sang Side B
      if (import.meta.env.PROD) {
        window.location.href = targetPath;
      } else {
        window.location.href = `${OPERATIONS_APP_URL}${targetPath.replace(/^\/operations/, '')}`;
      }
    } catch (err: any) {
      if (err.message && (err.message.includes('fetch') || err.name === 'TypeError')) {
        setErrorMsg('Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng.');
      } else {
        setErrorMsg(err.message || 'Đăng nhập vào Phía Đơn vị Xử lý thất bại.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Nạp tài khoản trải nghiệm (chỉ điền form, không tự động submit để người dùng kiểm soát)
  const handleSelectCommunityCard = (demoEmail: string) => {
    setIdentifier(demoEmail);
    setPassword('DustGuard@2026');
    setErrorMsg(null);
    const btn = document.getElementById('btn-community-login');
    if (btn) btn.focus();
  };

  const handleSelectOperationsCard = (demoUsername: string) => {
    setIdentifier(demoUsername);
    setPassword('DustGuard@2026');
    setErrorMsg(null);
    const btn = document.getElementById('btn-operations-login');
    if (btn) btn.focus();
  };

  return (
    <div className="min-h-[85vh] sm:min-h-screen flex items-center justify-center py-6 sm:py-12 px-4 sm:px-6 bg-page pb-safe">
      <div className="bg-surface-card rounded-2xl border border-border-subtle p-4 sm:p-8 max-w-[480px] w-full shadow-sm space-y-5">
        
        {/* Header Thương hiệu Canonical */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
            <Shield className="w-6 h-6 fill-white/20" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-content-main tracking-tight">
            Đăng nhập DustGuard VN
          </h1>
          <p className="text-xs text-content-sub text-pretty">
            Một nền tảng · Hai phía đồng hành vì đô thị sạch bụi
          </p>
        </div>

        {/* Bộ chuyển đổi 2 phía chuẩn tắc */}
        <div role="tablist" aria-label="Chọn cổng đăng nhập" className="grid grid-cols-2 p-1 bg-surface-secondary/80 rounded-xl border border-border-subtle text-xs font-bold gap-1">
          <button
            type="button"
            role="tab"
            id="tab-community"
            aria-selected={activeSide === 'community'}
            onClick={() => handleTabChange('community')}
            className={`py-2.5 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer ${
              activeSide === 'community'
                ? 'bg-white text-primary shadow-xs border border-primary/20 font-bold'
                : 'text-content-sub hover:text-content-main'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Phía Cộng đồng</span>
          </button>
          <button
            type="button"
            role="tab"
            id="tab-operations"
            aria-selected={activeSide === 'professional'}
            onClick={() => handleTabChange('professional')}
            className={`py-2.5 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer ${
              activeSide === 'professional'
                ? 'bg-white text-teal shadow-xs border border-teal/30 font-bold'
                : 'text-content-sub hover:text-content-main'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Đơn vị Xử lý</span>
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-primary flex items-start gap-2.5" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Cảnh báo trang yêu cầu xác thực */}
        {requestedPath && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            Vui lòng đăng nhập để tiếp tục truy cập: <code className="font-bold">{requestedPath}</code>
          </div>
        )}

        {/* ================================================================= */}
        {/* PHÍA CỘNG ĐỒNG: FORM ĐĂNG NHẬP                                     */}
        {/* ================================================================= */}
        {activeSide === 'community' ? (
          <div className="space-y-5">
            <form onSubmit={handleCommunitySubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="input-community-email" className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Địa chỉ Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    id="input-community-email"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="citizen@dustguard.local"
                    className={`w-full pl-10 pr-4 h-11 min-h-[44px] rounded-xl border text-base sm:text-sm bg-white text-slate-900 focus:outline-none transition-all ${
                      errorMsg ? 'border-red-300 focus:border-primary focus:ring-2 focus:ring-primary/20' : 'border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/15'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-community-password" className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                    Mật khẩu *
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline min-h-[36px] inline-flex items-center -my-1 py-1"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="input-community-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 h-11 min-h-[44px] rounded-xl border text-base sm:text-sm bg-white text-slate-900 focus:outline-none transition-all ${
                      errorMsg ? 'border-red-300 focus:border-primary focus:ring-2 focus:ring-primary/20' : 'border-border-subtle focus:border-primary focus:ring-2 focus:ring-primary/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-content-muted hover:text-content-main rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-community-login"
                disabled={loading || !identifier.trim() || !password.trim()}
                className="w-full h-12 min-h-[48px] rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập Cộng đồng</span>
                    <LogIn className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Experience Accounts - Hoạt động trực tiếp với CSDL D1 */}
            {demoMode && (
              <div className="pt-3 border-t border-border-subtle space-y-2.5 bg-stone-50/80 p-3 sm:p-3.5 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-content-sub uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-primary">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    Tài khoản trải nghiệm
                  </span>
                  <span className="text-[10px] lowercase text-stone-500 font-normal">chạm để điền thông tin</span>
                </div>

                {/* ONE COLUMN ON MOBILE, CLEAN LIST */}
                <div className="flex flex-col gap-2">
                  {COMMUNITY_DEMO_ACCOUNTS.map((acc) => {
                    const isSelected = identifier === acc.email;
                    return (
                      <div
                        key={acc.email}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectCommunityCard(acc.email)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectCommunityCard(acc.email); }}
                        className={`w-full min-h-[64px] p-2.5 sm:p-3 rounded-xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-red-50/90 border-primary ring-2 ring-primary/25 shadow-2xs'
                            : 'bg-white hover:bg-stone-50 border-border-subtle hover:border-primary/40'
                        }`}
                      >
                        {/* Avatar Badge */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected ? 'bg-primary text-white shadow-xs' : 'bg-stone-100 text-slate-700'
                        }`}>
                          {acc.initials}
                        </div>

                        {/* Information: Name, Role Badge, Email */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                              {acc.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              isSelected
                                ? 'bg-primary text-white'
                                : 'bg-red-50 text-primary border border-red-100'
                            }`}>
                              {acc.roleLabel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-full mt-0.5">
                            {acc.email}
                          </div>
                        </div>

                        {/* Action Button Indicator */}
                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="h-8 px-2.5 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs">
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Đã chọn</span>
                            </span>
                          ) : (
                            <span className="h-8 px-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center border border-border-subtle">
                              Chọn
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center text-[11px] text-slate-500 pt-1">
                  Mật khẩu trải nghiệm: <code className="font-mono font-bold text-slate-700 bg-stone-200/80 px-1.5 py-0.5 rounded">DustGuard@2026</code>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-content-sub pt-1">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline min-h-[36px] inline-flex items-center">
                Đăng ký thành viên
              </Link>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* PHÍA ĐƠN VỊ XỬ LÝ: FORM ĐĂNG NHẬP TRỰC TIẾP                       */
          /* ================================================================= */
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-teal-soft border border-teal-border text-left space-y-1">
              <div className="flex items-center gap-1.5 text-teal font-bold text-xs">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Cổng Tác chiến Đơn vị Xử lý</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed text-pretty">
                Dành cho Cán bộ thanh tra hiện trường, Lãnh đạo điều phối, Chuyên viên pháp chế và Quản trị viên vận hành.
              </p>
            </div>

            <form onSubmit={handleOperationsSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="input-operations-username" className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Tên đăng nhập hoặc Email *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    id="input-operations-username"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="canbo.hientruong, lanhdao.dieuphoi..."
                    className={`w-full pl-10 pr-4 h-11 min-h-[44px] rounded-xl border text-base sm:text-sm bg-white text-slate-900 focus:outline-none transition-all ${
                      errorMsg ? 'border-red-300 focus:border-teal focus:ring-2 focus:ring-teal/20' : 'border-border-subtle focus:border-teal focus:ring-2 focus:ring-teal/15'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="input-operations-password" className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                    Mật khẩu *
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-content-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    id="input-operations-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 h-11 min-h-[44px] rounded-xl border text-base sm:text-sm bg-white text-slate-900 focus:outline-none transition-all ${
                      errorMsg ? 'border-red-300 focus:border-teal focus:ring-2 focus:ring-teal/20' : 'border-border-subtle focus:border-teal focus:ring-2 focus:ring-teal/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 text-content-muted hover:text-content-main rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="btn-operations-login"
                disabled={loading || !identifier.trim() || !password.trim()}
                className="w-full h-12 min-h-[48px] rounded-xl bg-teal hover:bg-teal-hover text-white font-bold text-sm shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang đăng nhập...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập Đơn vị Xử lý</span>
                    <LogIn className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Accounts for Operations */}
            {demoMode && (
              <div className="pt-3 border-t border-border-subtle space-y-2.5 bg-stone-50/80 p-3 sm:p-3.5 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between text-[11px] font-bold text-content-sub uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-teal">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    Tài khoản trải nghiệm
                  </span>
                  <span className="text-[10px] lowercase text-stone-500 font-normal">nhấn để điền thông tin</span>
                </div>

                {/* ONE COLUMN ON MOBILE, CLEAN LIST */}
                <div className="flex flex-col gap-2">
                  {OPERATIONS_DEMO_ACCOUNTS.map((acc) => {
                    const isSelected = identifier === acc.username;
                    return (
                      <div
                        key={acc.username}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectOperationsCard(acc.username)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectOperationsCard(acc.username); }}
                        className={`w-full min-h-[64px] p-2.5 sm:p-3 rounded-xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-teal-50/90 border-teal ring-2 ring-teal/25 shadow-2xs'
                            : 'bg-white hover:bg-stone-50 border-border-subtle hover:border-teal/40'
                        }`}
                      >
                        {/* Avatar Badge */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected ? 'bg-teal text-white shadow-xs' : 'bg-stone-100 text-slate-700'
                        }`}>
                          {acc.initials}
                        </div>

                        {/* Information: Name, Role Badge, Username */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                              {acc.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              isSelected
                                ? 'bg-teal text-white'
                                : 'bg-teal-soft text-teal border border-teal-border'
                            }`}>
                              {acc.roleLabel}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate max-w-full mt-0.5">
                            @{acc.username}
                          </div>
                        </div>

                        {/* Action Button Indicator */}
                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="h-8 px-2.5 bg-teal text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs">
                              <Check className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Đã chọn</span>
                            </span>
                          ) : (
                            <span className="h-8 px-2.5 bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center justify-center border border-border-subtle">
                              Chọn
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center text-[11px] text-slate-500 pt-1">
                  Mật khẩu trải nghiệm: <code className="font-mono font-bold text-slate-700 bg-stone-200/80 px-1.5 py-0.5 rounded">DustGuard@2026</code>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-content-sub pt-1">
              Cần cấp tài khoản chuyên trách?{' '}
              <span className="font-semibold text-slate-700">Liên hệ Quản trị viên cơ quan</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
