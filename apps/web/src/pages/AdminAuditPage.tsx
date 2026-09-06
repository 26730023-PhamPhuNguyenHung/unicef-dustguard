import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { FileText, Shield, Clock, Filter, Terminal } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    let url = '/admin/audit?';
    if (actionFilter) url += `action=${actionFilter}&`;

    apiRequest<any[]>(url)
      .then((res) => setLogs(res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Shield className="w-4 h-4" />
            Vết tích bảo mật & Kiểm toán
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Nhật ký kiểm toán hệ thống
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            Lưu vết toàn bộ các hành động tạo, xác thực, gộp phản ánh, đổi trạng thái vụ việc và cập nhật quyền hạn trong hệ thống.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-6 flex flex-wrap gap-3">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-border-subtle text-xs font-semibold text-content-sub bg-white focus:border-primary focus:outline-none"
          >
            <option value="">Tất cả hành động</option>
            <option value="LOGIN">LOGIN (Đăng nhập)</option>
            <option value="CREATE_REPORT">CREATE_REPORT (Tạo phản ánh)</option>
            <option value="VERIFY_REPORT">VERIFY_REPORT (Xác nhận phản ánh)</option>
            <option value="CHANGE_CASE_STATUS">CHANGE_CASE_STATUS (Cập nhật tiến độ)</option>
            <option value="CHANGE_USER_ROLE">CHANGE_USER_ROLE (Đổi quyền)</option>
            <option value="SUSPEND_USER">SUSPEND_USER (Khóa tài khoản)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : logs.length === 0 ? (
        <EmptyState
          title="Không có nhật ký nào"
          description="Chưa có hành động nào được ghi nhận khớp với bộ lọc."
        />
      ) : (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[680px]">
              <thead className="bg-surface-secondary/60 text-content-sub uppercase border-b border-border-subtle font-semibold">
                <tr>
                  <th className="py-3 px-4">Thời gian</th>
                  <th className="py-3 px-4">Người thực hiện</th>
                  <th className="py-3 px-4">Hành động</th>
                  <th className="py-3 px-4">Đối tượng</th>
                  <th className="py-3 px-4">Chi tiết / Dữ liệu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-secondary/20 transition-colors">
                    <td className="py-3 px-4 text-content-muted whitespace-nowrap">
                      {new Date(log.created_at || log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 font-bold text-content-main">
                      {log.actorName || log.actor_id || 'System'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-primary-light text-primary font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-content-sub">
                      {log.entity_type} {log.entity_id ? `(#${log.entity_id})` : ''}
                    </td>
                    <td className="py-3 px-4 text-content-muted text-[11px] max-w-xs truncate">
                      {log.metadata_json || '-'}
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
