import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { ShieldCheck, Lock, User, Mail, Building, Phone, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const SetupPage: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const [alreadyInitialized, setAlreadyInitialized] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('Quản trị viên Hệ thống');
  const [email, setEmail] = useState('admin@dustguard.gov.vn');
  const [department, setDepartment] = useState('Ban Quản trị & Điều hành Hệ thống');
  const [phone, setPhone] = useState('024.3825.6868');
  const [loading, setLoading] = useState(false);

  const { success, error } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    api.auth
      .setupStatus()
      .then(res => {
        setStatusData(res);
        if (res.is_initialized) {
          setAlreadyInitialized(true);
        }
      })
      .catch(err => {
        console.error('Không thể kiểm tra trạng thái khởi tạo', err);
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      error('Mật khẩu quá ngắn', 'Mật khẩu quản trị viên tối thiểu phải từ 6 ký tự trở lên.');
      return;
    }
    if (password !== confirmPassword) {
      error('Mật khẩu không khớp', 'Vui lòng kiểm tra lại xác nhận mật khẩu.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.bootstrap({
        username: username.trim(),
        password,
        full_name: fullName.trim(),
        email: email.trim(),
        department: department.trim(),
        phone: phone.trim() || undefined,
      });

      if (res.token) {
        localStorage.setItem('dustguard_token', res.token);
      }
      success('Khởi tạo thành công', `Hệ thống DustGuard đã được kích hoạt cho quản trị viên ${res.user.full_name}`);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      error('Khởi tạo thất bại', err.detail || 'Không thể thiết lập hệ thống lần đầu.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center text-slate-600 text-sm">
        Đang kiểm tra trạng thái cơ sở dữ liệu...
      </div>
    );
  }

  if (alreadyInitialized) {
    return (
      <div className="min-h-screen bg-cream flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="civic-card p-6 sm:p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Hệ thống đã hoàn tất khởi tạo</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cơ sở dữ liệu đã có tài khoản quản trị ({statusData?.user_count || 1} tài khoản). Chức năng khởi tạo lần đầu đã tự động khóa để bảo mật hệ thống.
            </p>
            <div className="pt-2">
              <Link to="/login">
                <Button variant="primary" className="w-full">
                  Quay lại Trang Đăng nhập
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Khởi động Lần Đầu (First-Run Bootstrap)
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Khởi tạo Hệ thống DustGuard Operations
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Thiết lập tài khoản Quản trị viên tối cao từ cơ sở dữ liệu trống. Không yêu cầu dữ liệu mẫu (Zero Seed).
          </p>
        </div>

        {/* System Config Integrity Check Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-xs">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Trạng thái Cấu hình Hệ thống (System Configuration)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <div className="text-[11px] text-slate-500">Quy chuẩn Pháp luật</div>
              <div className="font-semibold text-emerald-700 mt-0.5">
                {statusData?.legal_corpus_count || 0} văn bản sẵn sàng
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100">
              <div className="text-[11px] text-slate-500">Mẫu Kiểm tra Hiện trường</div>
              <div className="font-semibold text-emerald-700 mt-0.5">
                {statusData?.template_count || 0} biểu mẫu chuẩn hóa
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded border border-slate-100 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-slate-500">Phân quyền Vận hành</div>
              <div className="font-semibold text-emerald-700 mt-0.5">
                {statusData?.role_count || 6} vai trò RBAC
              </div>
            </div>
          </div>
        </div>

        {/* Admin Registration Form */}
        <div className="civic-card p-6 sm:p-8">
          <form className="space-y-4" onSubmit={handleBootstrap}>
            <div className="border-b border-slate-100 pb-3 mb-2">
              <h2 className="text-sm font-bold text-slate-900">1. Thông tin Tài khoản Quản trị Tối cao (Super Admin)</h2>
              <p className="text-xs text-slate-500">Tài khoản này có toàn quyền phân quyền, tạo cán bộ và điều hành hệ thống.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đăng nhập *
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
                    placeholder="ví dụ: admin"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên Cán bộ *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none"
                  placeholder="ví dụ: Nguyễn Văn A"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mật khẩu khởi tạo *
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
                    placeholder="Tối thiểu 6 ký tự"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-slate-100 pb-3 pt-2 mb-2">
              <h2 className="text-sm font-bold text-slate-900">2. Cơ quan & Liên hệ Công tác</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email công vụ *
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none"
                    placeholder="admin@dustguard.gov.vn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Số điện thoại
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none"
                    placeholder="024.3825.xxxx"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cơ quan / Đơn vị quản lý *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Building className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none"
                  placeholder="ví dụ: Chi cục Bảo vệ Môi trường Hà Nội"
                />
              </div>
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full font-bold shadow-sm text-sm"
              >
                Kích hoạt Hệ thống & Đăng nhập Quản trị
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-xs text-slate-500 hover:text-slate-800 underline">
            Đã có tài khoản cán bộ? Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
