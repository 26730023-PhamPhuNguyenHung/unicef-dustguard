import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { UserCheck, UserX, Plus, Shield, Mail, Phone, Building2 } from 'lucide-react';
import { Role, getRoleLabel } from '@dustguard-operations/shared';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { success, error } = useToast();

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    full_name: '',
    email: '',
    role: 'staff' as Role,
    department: 'Đội Kiểm tra Hiện trường Số 1',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.admin.users();
      setUsers(res.users);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (u: any) => {
    const nextActive = u.active === 1 ? 0 : 1;
    try {
      await api.admin.updateUser(u.id, { active: nextActive });
      success('Cập nhật trạng thái thành công', `Đã ${nextActive === 1 ? 'mở khóa' : 'khóa'} tài khoản ${u.username}`);
      loadUsers();
    } catch (err: any) {
      error('Lỗi', err.detail);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.admin.createUser(newUser);

      success('Tạo cán bộ thành công', `Tài khoản ${newUser.username} đã được cấp phát.`);
      setCreateModalOpen(false);
      loadUsers();
    } catch (err: any) {
      error('Lỗi tạo tài khoản', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản trị Cán bộ & Người dùng Hệ thống</h1>
          <p className="text-sm text-slate-600">
            Cấp quyền, kích hoạt và quản lý vai trò cán bộ hiện trường, pháp chế và điều phối
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Thêm Cán bộ Mới
        </Button>
      </div>

      {loading ? (
        <div className="civic-card p-12 text-center text-slate-400 text-sm animate-pulse">
          Đang tải danh sách cán bộ...
        </div>
      ) : (
        <div className="civic-card divide-y divide-slate-200 overflow-hidden">
          {users.map((u: any) => (
            <div key={u.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                  {u.full_name.charAt(0)}
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{u.full_name}</h3>
                    <span className="font-mono text-slate-400">@{u.username}</span>
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      {getRoleLabel(u.role)}
                    </span>
                  </div>
                  <p className="text-slate-500">{u.department} • {u.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-slate-500">
                  Thụ lý: <strong>{u.assigned_cases_count} Case</strong>
                </span>

                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  u.active === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {u.active === 1 ? 'HOẠT ĐỘNG' : 'ĐÃ KHÓA'}
                </span>

                <Button
                  variant={u.active === 1 ? 'outline' : 'primary'}
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => handleToggleActive(u)}
                >
                  {u.active === 1 ? 'Khóa' : 'Kích hoạt'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create User Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Thêm Mới Cán Bộ Vận Hành"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Họ và tên cán bộ</label>
            <input
              type="text"
              required
              value={newUser.full_name}
              onChange={e => setNewUser({ ...newUser, full_name: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
              placeholder="VD: Lê Thị Hồng"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên đăng nhập</label>
              <input
                type="text"
                required
                value={newUser.username}
                onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
                placeholder="staff6"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mật khẩu</label>
              <input
                type="password"
                required
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email công vụ</label>
            <input
              type="email"
              required
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
              placeholder="canbo@dustguard.gov.vn"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vai trò hệ thống</label>
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none"
              >
                <option value="staff">Cán bộ hiện trường (staff)</option>
                <option value="supervisor">Lãnh đạo điều phối (supervisor)</option>
                <option value="legal_reviewer">Chuyên viên pháp chế (legal_reviewer)</option>
                <option value="admin">Quản trị hệ thống (admin)</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phòng ban / Đội</label>
              <input
                type="text"
                value={newUser.department}
                onChange={e => setNewUser({ ...newUser, department: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Tạo Tài Khoản
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
