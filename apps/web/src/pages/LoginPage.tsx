import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await login(email, password);
      navigate('/dashboard');
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
      await login(demoEmail, 'DustGuard123!');
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Đăng nhập demo không thành công.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-8 sm:p-10 max-w-md w-full shadow-sm space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
            🛡️
          </div>
          <h1 className="text-2xl font-extrabold text-content-main">
            Đăng nhập DustGuard
          </h1>
          <p className="text-xs text-content-sub">
            Cộng đồng cùng hành động vì không khí trong lành
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-primary flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
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
            {loading ? 'Đang xác thực...' : 'Đăng nhập'}
            <LogIn className="w-4 h-4" />
          </button>
        </form>

        {/* 4 Demo Quick Login Buttons */}
        <div className="pt-4 border-t border-border-subtle space-y-2">
          <div className="text-[11px] font-bold text-content-sub text-center uppercase tracking-wider">
            Đăng nhập nhanh tài khoản thử nghiệm
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickLogin('citizen@dustguard.local')}
              className="p-2 rounded-lg border border-border-subtle bg-surface-secondary/60 hover:bg-surface-secondary font-semibold text-content-main text-center"
            >
              1. Người dân (Citizen)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('member@dustguard.local')}
              className="p-2 rounded-lg border border-border-subtle bg-surface-secondary/60 hover:bg-surface-secondary font-semibold text-content-main text-center"
            >
              2. Thành viên (Member)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('moderator@dustguard.local')}
              className="p-2 rounded-lg border border-border-subtle bg-surface-secondary/60 hover:bg-surface-secondary font-semibold text-content-main text-center"
            >
              3. Điều phối (Mod)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@dustguard.local')}
              className="p-2 rounded-lg border border-border-subtle bg-surface-secondary/60 hover:bg-surface-secondary font-semibold text-content-main text-center"
            >
              4. Quản trị (Admin)
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-content-sub">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
