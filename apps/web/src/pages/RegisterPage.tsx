import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import { UserPlus, Mail, Lock, User, MapPin, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('Quận 7');
  const [ward, setWard] = useState('Tân Phú');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      await register({
        fullName,
        email,
        password,
        district,
        ward,
        role: 'citizen'
      });
      alert('Đăng ký tài khoản thành công!');
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể đăng ký tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-8 sm:p-10 max-w-md w-full shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl mx-auto shadow-sm">
            🛡️
          </div>
          <h1 className="text-2xl font-extrabold text-content-main">
            Đăng ký tài khoản
          </h1>
          <p className="text-xs text-content-sub">
            Tham gia giám sát và cải thiện không khí cộng đồng
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
              Họ và tên *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-content-muted absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn An"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>

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
                placeholder="nguyenvanan@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Mật khẩu *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-content-muted absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                Quận / Huyện
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="Quận 7"
                className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs bg-white focus:border-primary focus:outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                Phường / Xã
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="Tân Phú"
                className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs bg-white focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !fullName.trim() || !email.trim() || !password.trim()}
            className="w-full py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            <UserPlus className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-content-sub pt-2 border-t border-border-subtle">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
