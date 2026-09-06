import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { useToast } from '../context/ToastContext.js';
import { UserRole } from '@dustguard/shared';
import {
  Users,
  Search,
  Shield,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Sliders
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { success: toastSuccess, error: toastError } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchUsers = () => {
    setLoading(true);
    let url = '/admin/users?';
    if (roleFilter) url += `role=${roleFilter}&`;
    if (statusFilter) url += `status=${statusFilter}&`;
    if (search) url += `search=${encodeURIComponent(search)}&`;

    apiRequest<any[]>(url)
      .then((res) => setUsers(res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await apiRequest(`/admin/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });
      toastSuccess('Cập nhật vai trò', 'Đã cập nhật vai trò người dùng thành công!');
      fetchUsers();
    } catch (err: any) {
      toastError('Lỗi cập nhật vai trò', err.message || 'Lỗi cập nhật vai trò.');
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await apiRequest(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      toastSuccess('Cập nhật trạng thái', 'Đã cập nhật trạng thái tài khoản thành công!');
      fetchUsers();
    } catch (err: any) {
      toastError('Lỗi cập nhật trạng thái', err.message || 'Lỗi cập nhật trạng thái.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            Tài khoản & Phân quyền
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Quản lý người dùng
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            Danh sách toàn bộ thành viên trong hệ sinh thái, hỗ trợ nâng quyền điều phối viên hoặc tạm khóa tài khoản khi có dấu hiệu vi phạm.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-content-muted absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border-subtle text-xs font-semibold text-content-sub bg-white focus:border-primary focus:outline-none"
          >
            <option value="">Tất cả vai trò</option>
            <option value="citizen">Citizen</option>
            <option value="community_member">Community Member</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border-subtle text-xs font-semibold text-content-sub bg-white focus:border-primary focus:outline-none"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="suspended">Tạm khóa</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : users.length === 0 ? (
        <EmptyState
          title="Không tìm thấy người dùng"
          description="Không có tài khoản nào khớp với bộ lọc tìm kiếm hiện tại."
        />
      ) : (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-surface-secondary/60 text-content-sub uppercase border-b border-border-subtle font-semibold">
                <tr>
                  <th className="py-3 px-4">Người dùng</th>
                  <th className="py-3 px-4">Khu vực</th>
                  <th className="py-3 px-4">Vai trò (Role)</th>
                  <th className="py-3 px-4">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-content-main text-sm">{u.fullName || u.full_name}</div>
                      <div className="text-content-sub text-[11px] flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {u.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-content-sub font-medium">
                      {u.district || 'Chưa cập nhật'}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                        className="px-2 py-1 rounded-lg border border-border-subtle font-semibold text-[11px] bg-white focus:border-primary focus:outline-none"
                      >
                        <option value="citizen">Citizen</option>
                        <option value="community_member">Member</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-state-success'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {u.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.status === 'active' ? (
                        <button
                          onClick={() => handleStatusChange(u.id, 'suspended')}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Khóa
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(u.id, 'active')}
                          className="px-3 py-1 rounded-lg text-xs font-semibold text-state-success hover:bg-emerald-50 transition-colors"
                        >
                          Mở khóa
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
