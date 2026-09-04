import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { User, Shield, Phone, Mail, Building2, LogOut, CheckCircle2 } from 'lucide-react';
import { getRoleLabel } from '@dustguard-operations/shared';

export const ProfilePage: React.FC = () => {
  const { user, permissions, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hồ sơ Cán bộ Vận hành</h1>
        <p className="text-sm text-slate-600">Thông tin tài khoản và thẩm quyền chức năng trong hệ thống</p>
      </div>

      <div className="civic-card p-6 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-2xl border-2 border-slate-300">
            {user.full_name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user.full_name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-semibold text-white bg-dustguard-red px-2.5 py-0.5 rounded-full">
                {getRoleLabel(user.role)}
              </span>
              <span className="text-xs font-mono text-slate-500">@{user.username}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <Mail className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-xs">Email công vụ:</span>
              <strong className="text-slate-800">{user.email}</strong>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <Building2 className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-xs">Phòng ban / Đội:</span>
              <strong className="text-slate-800">{user.department}</strong>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <Phone className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-xs">Số điện thoại liên hệ:</span>
              <strong className="text-slate-800">{user.phone || 'Chưa cập nhật'}</strong>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
            <Shield className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block text-xs">Trạng thái công tác:</span>
              <span className="font-bold text-emerald-700">Đang hoạt động (ACTIVE)</span>
            </div>
          </div>
        </div>

        {/* Permissions list */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Thẩm quyền chức năng được cấp phát ({permissions.length})
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {permissions.map((p, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {p}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <Button variant="danger" size="sm" icon={<LogOut className="w-4 h-4" />} onClick={logout}>
            Đăng xuất phiên làm việc
          </Button>
        </div>
      </div>
    </div>
  );
};
