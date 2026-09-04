import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, Clock, AlertTriangle, Plus, Filter, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '../components/common/Button';

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('NORMAL');
  const [newDueAt, setNewDueAt] = useState('');
  const [newCaseId, setNewCaseId] = useState('');

  useEffect(() => {
    loadTasks();
  }, [statusFilter, priorityFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | undefined> = {};
      if (statusFilter !== 'ALL') params.status = statusFilter;
      if (priorityFilter !== 'ALL') params.priority = priorityFilter;
      const res = await api.tasks.list(params);
      setTasks(res.tasks || []);
    } catch (err: any) {
      addToast(err.detail || 'Không thể tải danh sách nhiệm vụ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (task: any) => {
    try {
      const nextStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
      await api.tasks.update(task.id, { status: nextStatus });
      addToast(`Đã chuyển nhiệm vụ sang "${nextStatus === 'DONE' ? 'Hoàn thành' : 'Chưa hoàn thành'}"`, 'success');
      loadTasks();
    } catch (err: any) {
      addToast(err.detail || 'Lỗi cập nhật nhiệm vụ', 'error');
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      addToast('Vui lòng nhập tiêu đề nhiệm vụ', 'error');
      return;
    }
    try {
      setCreating(true);
      await api.tasks.create({
        title: newTitle.trim(),
        description: newDesc.trim() || undefined,
        priority: newPriority,
        due_at: newDueAt ? new Date(newDueAt).toISOString() : undefined,
        case_id: newCaseId.trim() || undefined,
        source: 'MANUAL',
      });
      addToast('Tạo nhiệm vụ công việc thành công', 'success');
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewDueAt('');
      setNewCaseId('');
      loadTasks();
    } catch (err: any) {
      addToast(err.detail || 'Không thể tạo nhiệm vụ', 'error');
    } finally {
      setCreating(false);
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'URGENT':
        return <span className="px-2 py-0.5 text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 rounded">Khẩn cấp</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 rounded">Ưu tiên cao</span>;
      case 'NORMAL':
        return <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 rounded">Bình thường</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 rounded">Thấp</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hàng đợi Nhiệm vụ Vận hành</h1>
          <p className="text-sm text-slate-600">
            Quản lý công việc điều tra, rà soát pháp lý và xác minh hiện trường được tạo tự động hoặc phân công thủ công
          </p>
        </div>
        <Button variant="danger" onClick={() => setShowCreateModal(true)} icon={<Plus className="w-4 h-4" />}>
          Thêm nhiệm vụ mới
        </Button>
      </div>

      {/* Filter bar */}
      <div className="civic-card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" />
            <span>Trạng thái:</span>
          </div>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
            {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  statusFilter === st ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {st === 'ALL' ? 'Tất cả' : st === 'TODO' ? 'Cần làm' : st === 'IN_PROGRESS' ? 'Đang làm' : 'Đã xong'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Mức ưu tiên:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800"
          >
            <option value="ALL">Tất cả mức độ</option>
            <option value="URGENT">Khẩn cấp</option>
            <option value="HIGH">Ưu tiên cao</option>
            <option value="NORMAL">Bình thường</option>
            <option value="LOW">Thấp</option>
          </select>
        </div>
      </div>

      {/* Task list */}
      <div className="civic-card divide-y divide-slate-100">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải danh sách nhiệm vụ...</div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-60" />
            <p className="font-semibold text-slate-800">Không có nhiệm vụ nào trong danh mục này</p>
            <p className="text-xs text-slate-500 mt-1">Mọi công việc đã được xử lý hoặc không có bộ lọc phù hợp.</p>
          </div>
        ) : (
          tasks.map(t => (
            <div key={t.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button
                  onClick={() => handleToggleStatus(t)}
                  className={`mt-0.5 p-1 rounded transition-colors touch-target ${
                    t.status === 'DONE' ? 'text-emerald-600 hover:text-emerald-700' : 'text-slate-400 hover:text-slate-600'
                  }`}
                  title={t.status === 'DONE' ? 'Đánh dấu chưa xong' : 'Đánh dấu đã hoàn thành'}
                >
                  <CheckCircle2 className={`w-5 h-5 ${t.status === 'DONE' ? 'fill-emerald-100' : ''}`} />
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-sm font-bold ${t.status === 'DONE' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {t.title}
                    </span>
                    {getPriorityBadge(t.priority)}
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {t.source}
                    </span>
                  </div>

                  {t.description && (
                    <p className={`text-xs ${t.status === 'DONE' ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>
                      {t.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    {t.due_at && (
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Hạn: {new Date(t.due_at).toLocaleDateString('vi-VN')}
                      </span>
                    )}
                    <span>Giao cho: <strong className="text-slate-700">{t.assigned_to_name || 'Chưa phân công'}</strong></span>
                    {t.case_code && (
                      <Link
                        to={`/cases/${t.case_id}`}
                        className="inline-flex items-center gap-1 text-dustguard-teal font-semibold hover:underline"
                      >
                        Vụ việc {t.case_code}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleToggleStatus(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors touch-target ${
                    t.status === 'DONE'
                      ? 'border-slate-300 text-slate-700 hover:bg-slate-100'
                      : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  {t.status === 'DONE' ? 'Mở lại' : 'Hoàn thành'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Giao nhiệm vụ công việc mới</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề nhiệm vụ *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Kiểm tra biên bản xử phạt công trường Thảo Điền"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả hướng dẫn thực hiện</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="Ghi chú chi tiết cho cán bộ..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức ưu tiên</label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white"
                  >
                    <option value="LOW">Thấp</option>
                    <option value="NORMAL">Bình thường</option>
                    <option value="HIGH">Ưu tiên cao</option>
                    <option value="URGENT">Khẩn cấp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn hoàn thành</label>
                  <input
                    type="date"
                    value={newDueAt}
                    onChange={e => setNewDueAt(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Liên kết ID Vụ việc (Tùy chọn)</label>
                <input
                  type="text"
                  value={newCaseId}
                  onChange={e => setNewCaseId(e.target.value)}
                  placeholder="Ví dụ: case-001 hoặc DG-2026-OP-001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red outline-none font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Hủy bỏ
                </Button>
                <Button type="submit" variant="danger" loading={creating}>
                  Tạo nhiệm vụ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
