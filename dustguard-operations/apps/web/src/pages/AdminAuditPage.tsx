import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { ShieldCheck, Search, Filter, Clock, User } from 'lucide-react';
import { AuditLog } from '@dustguard-operations/shared';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, [actionFilter, entityFilter]);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await api.admin.audit({
        action: actionFilter || undefined,
        entity_type: entityFilter || undefined,
      });
      setLogs(res.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nhật ký Kiểm toán Hệ thống (Audit Trail)</h1>
        <p className="text-sm text-slate-600">
          Ghi nhận toàn bộ thao tác thêm, sửa, phân công, chuyển trạng thái và đóng hồ sơ để đối chiếu pháp lý
        </p>
      </div>

      {/* Filter Bar */}
      <div className="civic-card p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            placeholder="Lọc theo hành động (VD: CASE_STATUS_TRANSITION, ASSIGNED...)"
            className="w-full p-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
          />
        </div>

        <div>
          <select
            value={entityFilter}
            onChange={e => setEntityFilter(e.target.value)}
            className="p-2 text-xs border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-dustguard-red w-full sm:w-auto"
          >
            <option value="">Tất cả đối tượng</option>
            <option value="CASE">CASE</option>
            <option value="INSPECTION">INSPECTION</option>
            <option value="CORRECTIVE_ACTION">CORRECTIVE_ACTION</option>
            <option value="REMEDIATION">REMEDIATION</option>
            <option value="LEGAL_REVIEW">LEGAL_REVIEW</option>
            <option value="USER">USER</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="civic-card p-12 text-center text-slate-400 text-sm animate-pulse">
          Đang tải nhật ký kiểm toán...
        </div>
      ) : logs.length === 0 ? (
        <div className="civic-card p-12 text-center text-slate-500 text-sm">
          Không có bản ghi kiểm toán nào phù hợp.
        </div>
      ) : (
        <div className="civic-card divide-y divide-slate-200">
          {logs.map((log: any) => (
            <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors text-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    {log.action}
                  </span>
                  <span className="text-slate-500">
                    Đối tượng: <strong className="text-slate-700">{log.entity_type}</strong> ({log.entity_id})
                  </span>
                </div>
                <time className="text-slate-400 font-mono text-[11px]">
                  {new Date(log.created_at).toLocaleString('vi-VN')}
                </time>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600">
                <span>
                  Thực hiện bởi: <strong>{log.user_name || 'Hệ thống'}</strong>
                  {log.user_role && ` (${log.user_role})`}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">IP: {log.ip_address || '127.0.0.1'}</span>
              </div>

              {log.metadata_json && (
                <pre className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto">
                  {log.metadata_json}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
