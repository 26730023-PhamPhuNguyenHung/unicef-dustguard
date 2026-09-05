import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { resolveCommunityHome } from '../utils/auth-redirect.js';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Shield, Building2, ExternalLink } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user: currentUser } = useAuth();

  const [activeSide, setActiveSide] = useState<'community' | 'professional'>('community');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Trang mà người dùng đã yêu cầu trước khi bị chặn vào /login
  const requestedPath = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const loggedInUser = await login(email, password);
      const target = resolveCommunityHome(loggedInUser, requestedPath);
      navigate(target, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập không thành công.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('DustGuard123!');
    setLoading(true);
    setErrorMsg(null);
    try {
      const loggedInUser = await login(demoEmail, 'DustGuard123!');
      const target = resolveCommunityHome(loggedInUser, requestedPath);
      navigate(target, { replace: true });
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập demo không thành công.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 bg-[#FBF9F5]">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-7 sm:p-9 max-w-md w-full shadow-sm space-y-6">
        
        {/* Brand */}
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

        {/* 2-Side Selector Tabs (Không hỏi 5 role) */}
        <div className="grid grid-cols-2 p-1 bg-surface-secondary/70 rounded-xl border border-border-subtle text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveSide('community')}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeSide === 'community'
                ? 'bg-white text-primary shadow-xs'
                : 'text-content-sub hover:text-content-main'
            }`}
          >
            <span>Phía Cộng đồng</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSide('professional')}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
              activeSide === 'professional'
                ? 'bg-white text-[#0369A1] shadow-xs'
                : 'text-content-sub hover:text-content-main'
            }`}
          >
            <span>Đơn vị Xử lý</span>
          </button>
        </div>

        {/* SIDE A: PHÍA CỘNG ĐỒNG */}
        {activeSide === 'community' ? (
          <div className="space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-primary flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {requestedPath && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Vui lòng đăng nhập để tiếp tục truy cập: <code className="font-bold">{requestedPath}</code>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Địa chỉ Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-content-muted absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@dustguard.local"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !password.trim()}
                className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập Cộng đồng'}
                <LogIn className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Login Accounts */}
            <div className="pt-3 border-t border-border-subtle space-y-2">
              <div className="text-[10px] font-bold text-content-sub text-center uppercase tracking-wider">
                Tài khoản trải nghiệm nhanh (Cộng đồng)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('citizen@dustguard.local')}
                  className="p-2 rounded-lg border border-border-subtle bg-surface-secondary/60 hover:bg-surface-secondary font-semibold text-content-main text-center hover:border-primary/40 transition-colors"
                >
                  Người dân (Citizen)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('member@dustguard.local')}
                  className="p-2 rounded-lg border border-border-subtle bg-surface-secondary/60 hover:bg-surface-secondary font-semibold text-content-main text-center hover:border-primary/40 transition-colors"
                >
                  Thanh niên CLB (Member)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('moderator@dustguard.local')}
                  className="p-2 rounded-lg border border-border-subtle bg-surface-secondary/60 hover:bg-surface-secondary font-semibold text-content-main text-center hover:border-primary/40 transition-colors"
                >
                  Điều phối viên (Moderator)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin@dustguard.local')}
                  className="p-2 rounded-lg border border-border-subtle bg-surface-secondary/60 hover:bg-surface-secondary font-semibold text-content-main text-center hover:border-primary/40 transition-colors"
                >
                  Quản trị Cộng đồng
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-content-sub pt-1">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="font-bold text-primary hover:underline">
                Đăng ký thành viên
              </Link>
            </div>
          </div>
        ) : (
          /* SIDE B: PHÍA CHUYÊN TRÁCH / CƠ QUAN XỬ LÝ */
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 space-y-2 text-left">
              <div className="flex items-center gap-2 text-[#0369A1] font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Không gian Nghiệp vụ Chuyên trách</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khu vực dành riêng cho Cán bộ thanh tra môi trường, Giám sát viên, Chuyên viên pháp lý và Đại diện đơn vị thi công xử lý hồ sơ.
              </p>
              <ul className="text-[11px] text-slate-600 space-y-1 pt-1 list-disc pl-4 font-medium">
                <li>Tiếp nhận & điều phối hồ sơ từ cộng đồng</li>
                <li>Checklist thanh tra 10 tiêu chuẩn QCVN 18</li>
                <li>Trí tuệ Pháp lý FTS5 & Giám sát khắc phục</li>
              </ul>
            </div>

            <a
              href="http://localhost:3002/login"
              className="w-full py-3 rounded-xl bg-[#0369A1] hover:bg-[#0284C7] text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Chuyển sang Cổng Điều hành (Operations)</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="text-[11px] text-content-sub">
              Mã cổng vận hành nội bộ: <code className="font-mono font-bold text-[#0369A1]">Port 3002</code>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPage;
