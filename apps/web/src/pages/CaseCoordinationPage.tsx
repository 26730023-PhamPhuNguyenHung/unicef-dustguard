import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { CASE_STATUS_LABELS, CaseStatus } from '@dustguard/shared';
import {
  Layers,
  MapPin,
  Users,
  Eye,
  Sliders,
  X,
  Send,
  ArrowRight
} from 'lucide-react';

export const CaseCoordinationPage: React.FC = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal cập nhật status
  const [editingCase, setEditingCase] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<CaseStatus>('in_progress');
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchCases = () => {
    setLoading(true);
    apiRequest<any>('/cases')
      .then((res) => setCases(Array.isArray(res) ? res : res.cases || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCase) return;
    setUpdating(true);
    try {
      await apiRequest(`/moderator/cases/${editingCase.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          newStatus,
          status: newStatus,
          title: updateTitle || `Chuyển trạng thái sang ${CASE_STATUS_LABELS[newStatus]?.label}`,
          content: updateNote || 'Cập nhật tiến độ xử lý vụ việc từ ban điều phối.'
        })
      });
      setEditingCase(null);
      setUpdateNote('');
      setUpdateTitle('');
      fetchCases();
    } catch (err: any) {
      console.error('Lỗi cập nhật trạng thái:', err);
    } finally {
      setUpdating(false);
    }
  };

  const columns: Array<{ statusKey: CaseStatus; title: string; color: string }> = [
    { statusKey: 'new', title: 'Mới ghi nhận', color: '#B42318' },
    { statusKey: 'community_verifying', title: 'Đang xác minh', color: '#B54708' },
    { statusKey: 'confirmed_signal', title: 'Tín hiệu rõ ràng', color: '#026AA2' },
    { statusKey: 'in_progress', title: 'Đang xử lý', color: '#3538CD' },
    { statusKey: 'resolved', title: 'Đã giải quyết', color: '#027A48' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Điều phối quy trình
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Bảng điều phối vụ việc
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            Theo dõi dòng chảy xử lý từ lúc mới ghi nhận đến khi hoàn thành khắc phục tình trạng bụi.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colCases = cases.filter(
              (c) => c.status === col.statusKey || (col.statusKey === 'in_progress' && c.status === 'forwarded')
            );
            return (
              <div
                key={col.statusKey}
                className="bg-surface-secondary/40 rounded-2xl p-3.5 space-y-3 flex flex-col min-w-[260px] border border-border-subtle"
              >
                <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
                  <span className="text-xs font-bold text-content-main flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    {col.title}
                  </span>
                  <span className="text-[11px] font-bold text-content-sub bg-white px-2 py-0.5 rounded-full border border-border-subtle">
                    {colCases.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                  {colCases.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white p-3.5 rounded-xl border border-border-subtle shadow-xs space-y-2.5 hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-mono text-[11px] font-bold text-primary">
                          {c.case_code || c.caseCode}
                        </span>
                        <button
                          onClick={() => {
                            setEditingCase(c);
                            setNewStatus(c.status);
                          }}
                          className="p-1 rounded text-content-muted hover:text-primary"
                          title="Cập nhật trạng thái"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Link to={`/cases/${c.id}`}>
                        <h4 className="text-xs sm:text-sm font-bold text-content-main hover:text-primary transition-colors line-clamp-2">
                          {c.title}
                        </h4>
                      </Link>

                      <div className="text-[11px] text-content-sub flex items-center gap-1 line-clamp-1">
                        <MapPin className="w-3 h-3 text-primary shrink-0" />
                        <span>{c.district}</span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-border-subtle text-[10px] text-content-sub">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-primary" />
                          {c.confirmationCount || c.signal_count || 0}
                        </span>
                        <Link
                          to={`/cases/${c.id}`}
                          className="font-bold text-primary hover:text-primary-dark inline-flex items-center gap-0.5"
                        >
                          Chi tiết
                          <ArrowRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL CẬP NHẬT TRẠNG THÁI */}
      {editingCase && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-border-subtle">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-content-main">
                Cập nhật trạng thái vụ việc
              </h3>
              <button
                onClick={() => setEditingCase(null)}
                className="p-1 rounded-lg text-content-muted hover:text-content-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-content-sub">
              Vụ việc: <span className="font-semibold text-content-main">{editingCase.title}</span>
            </p>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Trạng thái mới *
                </label>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
                >
                  {Object.entries(CASE_STATUS_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Tiêu đề mốc thời gian
                </label>
                <input
                  type="text"
                  placeholder="VD: Đã chuyển thông tin cho ban chỉ huy công trình"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Ghi chú chi tiết cho cộng đồng
                </label>
                <textarea
                  rows={3}
                  placeholder="VD: Nhà thầu đã tiếp nhận và cam kết rửa đường lúc 17h hàng ngày..."
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-content-sub hover:bg-surface-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-colors shadow-xs"
                >
                  {updating ? 'Đang lưu...' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
