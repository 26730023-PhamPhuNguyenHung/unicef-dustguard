import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { TASK_TYPE_LABELS, TASK_STATUS_LABELS, TaskType, TaskStatus } from '@dustguard/shared';
import {
  CheckSquare,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  X,
  UserCheck
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'claimed'>('all');

  // Modal nộp nhiệm vụ
  const [submittingTask, setSubmittingTask] = useState<any | null>(null);
  const [submissionResult, setSubmissionResult] = useState<'confirmed' | 'not_found' | 'changed' | 'unable'>('confirmed');
  const [submissionNote, setSubmissionNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = () => {
    setLoading(true);
    apiRequest<any>('/tasks')
      .then((res) => setTasks(Array.isArray(res) ? res : (res.tasks || [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleClaimTask = async (taskId: string) => {
    try {
      await apiRequest(`/tasks/${taskId}/claim`, { method: 'POST' });
      alert('Bạn đã nhận nhiệm vụ thành công! Hãy đến hiện trường khi có dịp để kiểm tra.');
      fetchTasks();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi nhận nhiệm vụ.');
    }
  };

  const handleSubmitTaskResult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask || !submissionNote.trim()) return;

    setSubmitting(true);
    try {
      await apiRequest(`/tasks/${submittingTask.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          result: submissionResult,
          note: submissionNote
        })
      });
      alert('Đã gửi kết quả xác minh hiện trường thành công!');
      setSubmittingTask(null);
      setSubmissionNote('');
      fetchTasks();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi nộp kết quả nhiệm vụ.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeFilter === 'open') return t.status === 'open';
    if (activeFilter === 'claimed') return t.status === 'claimed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Hành động tại hiện trường
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Nhiệm vụ cộng đồng
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            Nhận các yêu cầu kiểm tra ngắn gần nơi bạn sinh sống hoặc trên đường đi làm để hỗ trợ cộng đồng xác minh độ tin cậy của phản ánh.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-surface-secondary text-content-sub hover:text-content-main'
            }`}
          >
            Tất cả ({tasks.length})
          </button>
          <button
            onClick={() => setActiveFilter('open')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'open'
                ? 'bg-primary text-white'
                : 'bg-surface-secondary text-content-sub hover:text-content-main'
            }`}
          >
            Chờ người nhận ({tasks.filter((t) => t.status === 'open').length})
          </button>
          <button
            onClick={() => setActiveFilter('claimed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'claimed'
                ? 'bg-primary text-white'
                : 'bg-surface-secondary text-content-sub hover:text-content-main'
            }`}
          >
            Đang thực hiện ({tasks.filter((t) => t.status === 'claimed').length})
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="Không có nhiệm vụ nào"
          description="Hiện tại các điểm phát sinh bụi đều đã có người kiểm tra hoặc chưa cần xác minh thêm."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((t) => {
            const taskTypeLabel = TASK_TYPE_LABELS[t.task_type as TaskType] || t.task_type;
            const taskStatus = TASK_STATUS_LABELS[t.status as TaskStatus] || {
              label: t.status,
              color: '#475467',
              bg: '#F2F4F7'
            };

            return (
              <div
                key={t.id}
                className="bg-surface-card rounded-civic border border-border-subtle p-5 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      {taskTypeLabel}
                    </span>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                      style={{ color: taskStatus.color, backgroundColor: taskStatus.bg }}
                    >
                      {taskStatus.label}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-content-main">
                    {t.title}
                  </h3>

                  <p className="text-xs text-content-sub leading-relaxed">
                    {t.description}
                  </p>

                  <div className="text-xs text-content-sub flex items-start gap-1.5 pt-1">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium">{t.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-[11px] text-content-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Hạn: {t.due_at ? new Date(t.due_at).toLocaleDateString('vi-VN') : 'Trong 48h'}
                  </span>

                  {t.status === 'open' && (
                    <button
                      onClick={() => handleClaimTask(t.id)}
                      className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs shadow-xs hover:bg-primary-dark transition-colors"
                    >
                      Nhận nhiệm vụ
                    </button>
                  )}

                  {t.status === 'claimed' && (
                    <button
                      onClick={() => setSubmittingTask(t)}
                      className="px-4 py-2 rounded-xl bg-state-success text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Nộp kết quả
                    </button>
                  )}

                  {t.status === 'completed' && (
                    <span className="text-xs font-bold text-state-success flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      Đã hoàn thành
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL NỘP KẾT QUẢ NHIỆM VỤ */}
      {submittingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-border-subtle">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-content-main">
                Nộp kết quả xác minh hiện trường
              </h3>
              <button
                onClick={() => setSubmittingTask(null)}
                className="p-1 rounded-lg text-content-muted hover:text-content-main"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-content-sub">
              Nhiệm vụ: <span className="font-semibold text-content-main">{submittingTask.title}</span>
            </p>

            <form onSubmit={handleSubmitTaskResult} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Kết luận thực tế tại vị trí
                </label>
                <select
                  value={submissionResult}
                  onChange={(e: any) => setSubmissionResult(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
                >
                  <option value="confirmed">Xác nhận đúng như phản ánh (Vẫn còn bụi)</option>
                  <option value="changed">Tình trạng đã thay đổi (Đã giảm/Đang che chắn)</option>
                  <option value="not_found">Không phát hiện nguồn bụi như phản ánh</option>
                  <option value="unable">Không thể tiếp cận hiện trường</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Ghi chú quan sát chi tiết *
                </label>
                <textarea
                  required
                  rows={3}
                  value={submissionNote}
                  onChange={(e) => setSubmissionNote(e.target.value)}
                  placeholder="Mô tả cụ thể những gì bạn ghi nhận được..."
                  className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setSubmittingTask(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-content-sub hover:bg-surface-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting || !submissionNote.trim()}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-colors shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Đang gửi...' : 'Nộp kết quả'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
