import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Upload,
  Calendar,
  User,
} from 'lucide-react';
import { CorrectiveAction } from '@dustguard-operations/shared';

export const ActionsListPage: React.FC = () => {
  const { can } = useAuth();
  const { success, error } = useToast();
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [overdueOnly, setOverdueOnly] = useState(false);

  // Remediation submit modal for demo / staff assisting contractor
  const [remediationModalOpen, setRemediationModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<CorrectiveAction | null>(null);
  const [remediationDesc, setRemediationDesc] = useState('');
  const [submittingRemediation, setSubmittingRemediation] = useState(false);

  useEffect(() => {
    loadActions();
  }, [statusFilter, overdueOnly]);

  const loadActions = async () => {
    try {
      setLoading(true);
      const res = await api.actions.list({
        status: statusFilter || undefined,
        overdue: overdueOnly ? 'true' : undefined,
      });
      setActions(res.actions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRemediationModal = (act: CorrectiveAction) => {
    setSelectedAction(act);
    setRemediationDesc('');
    setRemediationModalOpen(true);
  };

  const handleSubmitRemediation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAction) return;
    setSubmittingRemediation(true);
    try {
      await api.actions.submitRemediation(selectedAction.id, {
        description: remediationDesc,
      });
      success('Đã nộp báo cáo khắc phục', 'Hồ sơ đã chuyển sang trạng thái REMEDIATION');
      setRemediationModalOpen(false);
      loadActions();
    } catch (err: any) {
      error('Lỗi', err.detail);
    } finally {
      setSubmittingRemediation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Yêu cầu Khắc phục & Nghiệm thu</h1>
          <p className="text-sm text-slate-600">
            Giám sát thời hạn khắc phục của nhà thầu và thẩm duyệt minh chứng thực địa
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-dustguard-red"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="OPEN">Đang mở (OPEN)</option>
            <option value="IN_PROGRESS">Đang xử lý (IN_PROGRESS)</option>
            <option value="SUBMITTED">Đã nộp báo cáo (SUBMITTED)</option>
            <option value="VERIFIED">Đã nghiệm thu (VERIFIED)</option>
            <option value="CLOSED">Đã đóng (CLOSED)</option>
          </select>

          <button
            type="button"
            onClick={() => setOverdueOnly(!overdueOnly)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              overdueOnly
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {overdueOnly ? 'Đang lọc: Quá hạn' : 'Lọc Quá Hạn'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="civic-card p-12 text-center text-slate-400 text-sm animate-pulse">
          Đang tải yêu cầu khắc phục...
        </div>
      ) : actions.length === 0 ? (
        <div className="civic-card p-12 text-center text-slate-500 text-sm">
          Không tìm thấy yêu cầu khắc phục nào.
        </div>
      ) : (
        <div className="civic-card divide-y divide-slate-200">
          {actions.map(act => {
            const isOverdue = new Date(act.due_at).getTime() < Date.now() && !['VERIFIED', 'CLOSED'].includes(act.status);
            const hasSubmissions = act.submissions && act.submissions.length > 0;

            return (
              <div key={act.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {act.case_code}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      act.status === 'VERIFIED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : act.status === 'SUBMITTED'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {act.status}
                    </span>

                    {isOverdue && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        QUÁ HẠN
                      </span>
                    )}
                  </div>

                  <Link to={`/cases/${act.case_id}`}>
                    <h3 className="text-base font-bold text-slate-900 hover:text-dustguard-red">
                      {act.title}
                    </h3>
                  </Link>

                  <p className="text-slate-700 leading-relaxed font-medium">
                    {act.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
                    <span>Đơn vị: <strong className="text-slate-800">{act.responsible_party}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Hạn chót: <strong className={isOverdue ? 'text-rose-600' : 'text-slate-700'}>{act.due_at}</strong>
                    </span>
                    <span>Cán bộ giám sát: {act.created_by_name}</span>
                  </div>

                  {/* Submissions list if any */}
                  {hasSubmissions && (
                    <div className="mt-3 p-3 bg-blue-50/40 rounded-lg border border-blue-200 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-blue-900 text-[11px]">
                        <span>Báo cáo khắc phục mới nhất: ({act.submissions![0].review_status})</span>
                        <span>{act.submissions![0].submitted_by}</span>
                      </div>
                      <p className="text-slate-700">{act.submissions![0].description}</p>
                    </div>
                  )}
                </div>

                {/* Right CTA */}
                <div className="flex flex-wrap items-center gap-2 self-end md:self-center flex-shrink-0">
                  {act.status === 'SUBMITTED' && hasSubmissions && (
                    <Link to={`/actions/${act.submissions![0].id}/remediation`}>
                      <Button variant="teal" size="sm">
                        Thẩm duyệt báo cáo &rarr;
                      </Button>
                    </Link>
                  )}

                  {['OPEN', 'IN_PROGRESS'].includes(act.status) && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Upload className="w-4 h-4" />}
                      onClick={() => handleOpenRemediationModal(act)}
                    >
                      Nộp khắc phục
                    </Button>
                  )}

                  <Link to={`/cases/${act.case_id}`}>
                    <Button variant="outline" size="sm">
                      Chi tiết hồ sơ
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Submit Remediation */}
      <Modal
        isOpen={remediationModalOpen}
        onClose={() => setRemediationModalOpen(false)}
        title="Nộp Báo Cáo Khắc Phục Hiện Trường"
      >
        <form onSubmit={handleSubmitRemediation} className="space-y-4 text-xs sm:text-sm">
          <div>
            <p className="font-bold text-slate-900 text-sm mb-1">{selectedAction?.title}</p>
            <p className="text-slate-500 text-xs">Đơn vị: {selectedAction?.responsible_party}</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mô tả biện pháp và kết quả đã khắc phục <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={remediationDesc}
              onChange={e => setRemediationDesc(e.target.value)}
              placeholder="VD: Đã lắp đặt bổ sung 30 béc phun sương tự động và giăng lưới 3 lớp phủ kín mặt tiền công trình..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setRemediationModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submittingRemediation}>
              Gửi Báo Cáo Khắc Phục
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
