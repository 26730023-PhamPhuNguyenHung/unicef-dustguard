import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEV_ACCOUNTS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Shield, Lock, User, CheckCircle2 } from 'lucide-react';
import type { Role } from '@dustguard-operations/shared';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('canbo.hientruong');
  const [password, setPassword] = useState('DustGuard@2026');
  const [submitting, setSubmitting] = useState(false);
  const { user, login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to intended target or /dashboard
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(username, password);
      success('Đăng nhập thành công', 'Chào mừng bạn trở lại hệ thống điều hành');
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      error('Đăng nhập thất bại', err.detail || 'Vui lòng kiểm tra lại thông tin tài khoản');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSelect = (accUsername: string) => {
    setUsername(accUsername);
    setPassword('DustGuard@2026');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-dustguard-red text-white flex items-center justify-center font-black text-2xl mx-auto shadow-sm">
          DG
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          DustGuard Operations
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Hệ thống Điều hành & Xử lý Vi phạm Môi trường Đô thị (Side B)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="input-ops-user" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  id="input-ops-user"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 min-h-[44px] border border-slate-300 rounded-lg text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none transition-all"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label htmlFor="input-ops-pass" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  id="input-ops-pass"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 h-11 min-h-[44px] border border-slate-300 rounded-lg text-base sm:text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none transition-all"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={submitting}
              className="w-full mt-2 h-12 min-h-[48px] font-bold shadow-xs cursor-pointer"
            >
              Đăng nhập vào Hệ thống
            </Button>
          </form>

          {/* Quick Demo Accounts Helper */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2.5">
              Chọn nhanh tài khoản mẫu (Mật khẩu: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">DustGuard@2026</code>):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(DEV_ACCOUNTS) as Role[]).map(role => {
                const acc = DEV_ACCOUNTS[role];
                const isSelected = username === acc.username;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleQuickSelect(acc.username)}
                    className={`w-full min-h-[58px] p-2.5 sm:p-3 text-left rounded-xl border text-xs transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'border-dustguard-red bg-red-50/70 text-dustguard-red font-semibold shadow-xs ring-2 ring-dustguard-red/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold flex items-center gap-1.5 text-slate-900">
                        <span className="truncate">{acc.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-soft text-teal font-semibold shrink-0">
                          {acc.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono truncate mt-0.5">@{acc.username}</div>
                    </div>
                    <div className="shrink-0">
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-dustguard-red" />
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] font-medium border border-slate-200">
                          Chọn
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Hệ thống lưu trữ dữ liệu chân thực SSOT SQLite cục bộ.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
