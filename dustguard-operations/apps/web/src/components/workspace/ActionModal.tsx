import React, { useState, useEffect } from 'react';
import {
  X,
  ListTodo,
  UserCheck,
  FileQuestion,
  CheckCircle2,
  Calendar,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { CaseFact } from '@dustguard-operations/shared';
import { api } from '../../api/client';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'CREATE_VERIFICATION_TASK' | 'ASSIGN_OFFICER' | 'REQUEST_SUPPLEMENT' | 'VERIFY_EVIDENCE' | 'REJECT_EVIDENCE';
  fact?: CaseFact | null;
  caseId?: string;
  caseCode?: string;
  onSubmit: (actionData: any) => Promise<void>;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  isOpen,
  onClose,
  mode = 'CREATE_VERIFICATION_TASK',
  fact,
  caseId,
  caseCode,
  onSubmit,
}) => {
  const [taskContent, setTaskContent] = useState('');
  const [reason, setReason] = useState('');
  const [assignee, setAssignee] = useState('');
  const [staffMembers, setStaffMembers] = useState<Array<{ id: string; full_name: string; role: string }>>([]);
  const [dueDate, setDueDate] = useState('');
  const [checklist, setChecklist] = useState({
    photo: true,
    gps: true,
    time: true,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.admin
        .users()
        .then(res => {
          const active = (res.users || []).filter((u: any) => u.active === 1);
          setStaffMembers(active);
          if (active.length > 0 && !assignee) {
            setAssignee(active[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Default 48h from now (SLA statutory standard)
      const d = new Date();
      d.setDate(d.getDate() + 2);
      setDueDate(d.toISOString().split('T')[0]);

      if (fact) {
        if (fact.value.toLowerCase().includes('rửa xe') || fact.title.toLowerCase().includes('rửa xe')) {
          setTaskContent('Kiểm tra ảnh chụp cầu/trạm rửa xe tại cổng ra vào công trình');
          setReason('Chưa có dữ kiện chứng minh yêu cầu kiểm soát bùn đất và rửa bánh xe theo Điều 15 NĐ 45/2022.');
        } else if (fact.semantic_type === 'CLAIM') {
          setTaskContent(`Xác minh phản ánh cộng đồng: ${fact.friendly_code || fact.id}`);
          setReason(`Cần thị sát trực tiếp tại hiện trường để kiểm chứng nội dung: "${fact.value.substring(0, 80)}..."`);
        } else {
          setTaskContent(`Khảo sát hiện trường xác minh: ${fact.title}`);
          setReason('Bổ sung minh chứng số đối soát với số liệu viễn thám và tài liệu nhà thầu.');
        }
      } else {
        setTaskContent('Kiểm tra hiện trường biện pháp kiểm soát phát tán bụi công trình');
        setReason('Cần thu thập thêm ảnh chụp bao quát và biên bản ghi nhận thực tế.');
      }
    }
  }, [isOpen, fact]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const checklistItems: string[] = [];
      if (checklist.photo) checklistItems.push('Chụp ảnh toàn cảnh và cận cảnh');
      if (checklist.gps) checklistItems.push('Ghi nhận tọa độ GPS tại thực địa');
      if (checklist.time) checklistItems.push('Xác nhận chính xác mốc thời gian kiểm tra');

      await onSubmit({
        mode,
        title: taskContent,
        reason,
        assignee_id: assignee,
        due_date: dueDate,
        checklist: checklistItems,
        fact_id: fact?.id,
        case_id: caseId,
      });
      onClose();
    } catch {
      // Error handled by caller
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-3 sm:p-4 z-50 animate-fade-in"
      style={{ scrollbarGutter: 'stable' }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white rounded-xl max-w-lg w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col"
        style={{ textWrap: 'pretty' }}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-white rounded-md border border-slate-200 shadow-2xs text-red-700">
              <ListTodo className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wide">
                TẠO TÁC VỤ XÁC MINH HIỆN TRƯỜNG
              </h3>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {caseCode ? `Hồ sơ: ${caseCode}` : 'Nhiệm vụ kiểm định thực địa'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Cần xác minh */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800 text-xs">
              Cần xác minh:
            </label>
            <input
              type="text"
              required
              value={taskContent}
              onChange={e => setTaskContent(e.target.value)}
              placeholder="VD: Ảnh cầu/trạm rửa xe tại cổng công trình..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600"
            />
          </div>

          {/* Lý do */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-800 text-xs">
              Lý do nghiệp vụ:
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Chưa có dữ kiện chứng minh yêu cầu kiểm soát bụi..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 leading-relaxed"
            />
          </div>

          {/* Giao cho & Hạn xử lý Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-800 text-xs">
                Giao cho cán bộ:
              </label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">-- Chưa chỉ định (Đưa vào hàng đợi chung) --</option>
                {staffMembers.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.full_name} ({st.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block font-bold text-slate-800 text-xs flex items-center justify-between">
                <span>Hạn xử lý (SLA 48h):</span>
                <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  48 giờ
                </span>
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          {/* Checklist xác thực */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
              Tiêu chí kiểm tra bắt buộc (Checklist):
            </span>

            <div className="space-y-2 text-xs font-medium">
              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.photo}
                  onChange={e => setChecklist(prev => ({ ...prev, photo: e.target.checked }))}
                  className="rounded text-red-600 focus:ring-red-600 w-4 h-4"
                />
                <span>Chụp ảnh toàn cảnh và góc phát tán bụi</span>
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.gps}
                  onChange={e => setChecklist(prev => ({ ...prev, gps: e.target.checked }))}
                  className="rounded text-red-600 focus:ring-red-600 w-4 h-4"
                />
                <span>Ghi nhận tọa độ GPS tại cổng công trình</span>
              </label>

              <label className="flex items-center gap-2 text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.time}
                  onChange={e => setChecklist(prev => ({ ...prev, time: e.target.checked }))}
                  className="rounded text-red-600 focus:ring-red-600 w-4 h-4"
                />
                <span>Xác nhận thời gian và điều kiện thời tiết thực tế</span>
              </label>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
              className="font-bold shadow-xs"
            >
              Tạo tác vụ
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
