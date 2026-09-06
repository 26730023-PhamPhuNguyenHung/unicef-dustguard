import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { resolveCommunityHome } from '../utils/auth-redirect.js';
import { getDefaultRoute, CANONICAL_ROUTES } from '../config/routes.js';
import { LogIn, Mail, Lock, User, AlertCircle, Shield, Building2, CheckCircle2, Sparkles } from 'lucide-react';
import { OPERATIONS_APP_URL } from '../config/constants';

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
        body: JSON.stringify({ username: identifier.trim(), password })
      });

      // Fallback cho local dev nếu proxy khác cổng
      if (response.status === 404 && !import.meta.env.PROD) {
        response = await fetch(`${OPERATIONS_APP_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: identifier.trim(), password })
        });
      }

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        if (response.status >= 500) {
          throw new Error('Hệ thống đang gặp sự cố. Vui lòng thử lại sau.');
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
          throw new Error('Hệ thống đang gặp sự cố. Vui lòng thử lại sau.');
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
      setErrorMsg(err.message || 'Đăng nhập vào Phía Đơn vị Xử lý thất bại.');
    } finally {
      setLoading(false);
    }
  };

  // Nạp tài khoản trải nghiệm nhanh
  const handleQuickLoginCommunity = async (demoEmail: string) => {
    setIdentifier(demoEmail);
    setPassword('DustGuard123!');
    setLoading(true);
    setErrorMsg(null);
    try {
      const loggedInUser = await loginCommunity(demoEmail, 'DustGuard123!');
      const target = resolveCommunityHome(loggedInUser, requestedPath);
      navigate(target, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập trải nghiệm thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginOperations = async (demoUsername: string) => {
    setIdentifier(demoUsername);
    setPassword('Password123!');
    setLoading(true);
    setErrorMsg(null);
    try {
      const opsUrl = import.meta.env.PROD
        ? '/api/operations/auth/login'
        : (import.meta.env.VITE_OPERATIONS_API_URL || `${OPERATIONS_APP_URL}/api/auth/login`);

      let response = await fetch(opsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: demoUsername, password: 'Password123!' })
      });

      if (response.status === 404 && !import.meta.env.PROD) {
        response = await fetch(`${OPERATIONS_APP_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: demoUsername, password: 'Password123!' })
        });
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.title || 'Đăng nhập trải nghiệm thất bại.');
      }

      localStorage.setItem('dustguard_token', data.token);
      const targetPath = getDefaultRoute(data.user?.role, 'operations', requestedPath);

      if (import.meta.env.PROD) {
        window.location.href = targetPath;
      } else {
        window.location.href = `${OPERATIONS_APP_URL}${targetPath.replace(/^\/operations/, '')}`;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập trải nghiệm thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 bg-page">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-7 sm:p-9 max-w-md w-full shadow-sm space-y-6">
        
        {/* Header Thương hiệu Canonical */}
        <div className="text-center space-y-1.5">
          <div className="w-11 h-11 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-xl mx-auto shadow-sm">
            <Shield className="w-6 h-6 fill-white/20" />
          </div>
          <h1 className="text-2xl font-extrabold text-content-main tracking-tight">
            Đăng nhập DustGuard VN
          </h1>
          <p className="text-xs text-content-sub">
            Một nền tảng · Hai phía đồng hành vì đô thị sạch bụi
          </p>
        </div>

        {/* Bộ chuyển đổi 2 phía chuẩn tắc */}
        <div className="grid grid-cols-2 p-1 bg-surface-secondary/70 rounded-xl border border-border-subtle text-xs font-bold">
          <button
            type="button"
            id="tab-community"
            onClick={() => handleTabChange('community')}
            className={`py-2.5 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 touch-target ${
              activeSide === 'community'
                ? 'bg-white text-primary shadow-xs border border-primary/20 font-bold'
                : 'text-content-sub hover:text-content-main'
            }`}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>Phía Cộng đồng</span>
          </button>
          <button
            type="button"
            id="tab-operations"
            onClick={() => handleTabChange('professional')}
            className={`py-2.5 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 touch-target ${
              activeSide === 'professional'
                ? 'bg-white text-teal shadow-xs border border-teal/30 font-bold'
                : 'text-content-sub hover:text-content-main'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>Đơn vị Xử lý</span>
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-primary flex items-start gap-2.5" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
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
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Địa chỉ Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-content-muted absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    id="input-community-email"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="citizen@dustguard.local"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white text-slate-900 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                    Mật khẩu *
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-content-muted absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    id="input-community-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white text-slate-900 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-community-login"
                disabled={loading || !identifier.trim() || !password.trim()}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 touch-target"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập Cộng đồng'}
                <LogIn className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Experience Accounts - Hoạt động trực tiếp với CSDL D1 */}
            {demoMode && (
              <div className="pt-3 border-t border-border-subtle space-y-2 bg-stone-50/70 p-3 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between text-[10px] font-bold text-content-sub uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-primary">
                    <Sparkles className="w-3 h-3" />
                    Tài khoản trải nghiệm
                  </span>
                  <span className="text-[10px] lowercase text-stone-500 font-normal">nhấn để đăng nhập ngay</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickLoginCommunity('citizen@dustguard.local')}
                    className="p-2 rounded-lg border border-border-subtle bg-white hover:bg-red-50 font-semibold text-content-main text-left hover:border-primary/40 transition-colors shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">Người dân</div>
                    <div className="text-[10px] text-slate-500">Citizen</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLoginCommunity('member@dustguard.local')}
                    className="p-2 rounded-lg border border-border-subtle bg-white hover:bg-red-50 font-semibold text-content-main text-left hover:border-primary/40 transition-colors shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">Thanh niên CLB</div>
                    <div className="text-[10px] text-slate-500">Member</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLoginCommunity('moderator@dustguard.local')}
                    className="p-2 rounded-lg border border-border-subtle bg-white hover:bg-red-50 font-semibold text-content-main text-left hover:border-primary/40 transition-colors shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">Điều phối viên</div>
                    <div className="text-[10px] text-slate-500">Moderator</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLoginCommunity('admin@dustguard.local')}
                    className="p-2 rounded-lg border border-border-subtle bg-white hover:bg-red-50 font-semibold text-content-main text-left hover:border-primary/40 transition-colors shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">Quản trị Cộng đồng</div>
                    <div className="text-[10px] text-slate-500">Admin</div>
                  </button>
                </div>
              </div>
            )}

            <div className="text-center text-xs text-content-sub pt-1">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline">
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
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Dành cho Cán bộ thanh tra hiện trường, Lãnh đạo điều phối, Chuyên viên pháp chế và Quản trị viên vận hành.
              </p>
            </div>

            <form onSubmit={handleOperationsSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Tên đăng nhập hoặc Email *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-content-muted absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    id="input-operations-username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="staff1, supervisor1, legal1..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white text-slate-900 focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                    Mật khẩu *
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-content-muted absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    id="input-operations-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white text-slate-900 focus:border-teal focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                id="btn-operations-login"
                disabled={loading || !identifier.trim() || !password.trim()}
                className="w-full py-3 rounded-xl bg-teal text-white font-bold text-sm shadow-sm hover:bg-teal-hover transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2 touch-target"
              >
                {loading ? 'Đang xác thực nghiệp vụ...' : 'Đăng nhập Đơn vị Xử lý'}
                <LogIn className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Accounts for Operations */}
            {demoMode && (
              <div className="pt-3 border-t border-border-subtle space-y-2 bg-stone-50/70 p-3 rounded-xl border border-stone-200/80">
                <div className="flex items-center justify-between text-[10px] font-bold text-content-sub uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-teal">
                    <Sparkles className="w-3 h-3" />
                    Tài khoản trải nghiệm
                  </span>
                  <span className="text-[10px] lowercase text-stone-500 font-normal">nhấn để đăng nhập ngay</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickLoginOperations('staff1')}
                    className="p-2 rounded-lg border border-border-subtle bg-white hover:bg-teal-soft font-semibold text-content-main text-left hover:border-teal/40 transition-colors shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">staff1</div>
                    <div className="text-[10px] text-slate-500">Cán bộ Hiện trường</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLoginOperations('supervisor1')}
                    className="p-2 rounded-lg border border-border-subtle bg-white hover:bg-teal-soft font-semibold text-content-main text-left hover:border-teal/40 transition-colors shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">supervisor1</div>
                    <div className="text-[10px] text-slate-500">Lãnh đạo Điều phối</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLoginOperations('legal1')}
                    className="p-2 rounded-lg border border-border-subtle bg-white hover:bg-teal-soft font-semibold text-content-main text-left hover:border-teal/40 transition-colors shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">legal1</div>
                    <div className="text-[10px] text-slate-500">Chuyên viên Pháp chế</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLoginOperations('admin')}
                    className="p-2 rounded-lg border border-border-subtle bg-white hover:bg-teal-soft font-semibold text-content-main text-left hover:border-teal/40 transition-colors shadow-2xs"
                  >
                    <div className="font-bold text-slate-900">admin</div>
                    <div className="text-[10px] text-slate-500">Quản trị Vận hành</div>
                  </button>
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
