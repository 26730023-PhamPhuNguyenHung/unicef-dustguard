import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, DEV_ACCOUNTS } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Shield, Lock, User, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { Role } from '@dustguard-operations/shared';
import { api } from '../api/client';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [setupChecked, setSetupChecked] = useState(false);
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.auth
      .setupStatus()
      .then(res => {
        setIsInitialized(res.is_initialized);
        if (!res.is_initialized) {
          setUsername('admin');
        } else if (res.user_count > 0) {
          setUsername('admin');
        }
      })
      .catch(() => {
        setIsInitialized(true);
      })
      .finally(() => {
        setSetupChecked(true);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      success('Đăng nhập thành công', `Chào mừng quay trở lại hệ thống`);
      navigate('/dashboard');
    } catch (err: any) {
      error('Đăng nhập thất bại', err.detail || 'Vui lòng kiểm tra lại thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (accUsername: string) => {
    setUsername(accUsername);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-14 h-14 rounded-2xl bg-dustguard-red text-white flex items-center justify-center font-black text-2xl mx-auto shadow-sm">
          DG
        </div>
        <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          DustGuard Operations
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Hệ thống Điều hành & Xử lý Vi phạm Môi trường Đô thị
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        {isInitialized === false && (
          <div className="mb-4 bg-amber-50 border-2 border-amber-300 rounded-xl p-4 shadow-sm text-slate-800">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-amber-900">Cơ sở dữ liệu mới (Chưa có tài khoản)</h3>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  Hệ thống vừa khởi động từ cơ sở dữ liệu trống. Bạn cần kích hoạt tài khoản Quản trị viên Tối cao lần đầu để bắt đầu vận hành.
                </p>
                <Link to="/setup" className="inline-block mt-3">
                  <Button variant="primary" size="sm" className="font-bold bg-amber-700 hover:bg-amber-800 text-white border-amber-800">
                    Khởi tạo Hệ thống Ngay (/setup)
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="civic-card p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Tên đăng nhập
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none"
                  placeholder="Nhập tên đăng nhập"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full mt-2 font-semibold shadow-sm"
            >
              Đăng nhập vào Hệ thống
            </Button>
          </form>

          {/* Quick Demo Accounts Helper - only shown when initialized */}
          {isInitialized !== false && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-600 mb-2.5">
                Chọn nhanh tài khoản mẫu (Mật khẩu mặc định: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">password123</code>):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(DEV_ACCOUNTS) as Role[]).map(role => {
                  const acc = DEV_ACCOUNTS[role];
                  const isSelected = username === acc.username;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleQuickSelect(acc.username)}
                      className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                        isSelected
                          ? 'border-dustguard-red bg-red-50/50 text-dustguard-red font-semibold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{acc.username}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-dustguard-red" />}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{acc.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Hệ thống lưu trữ dữ liệu chân thực SSOT SQLite cục bộ.
        </p>
      </div>
    </div>
  );
};

