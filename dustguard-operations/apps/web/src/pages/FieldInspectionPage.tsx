import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  MinusCircle,
  Camera,
  MapPin,
  Calendar,
  AlertTriangle,
  Upload,
} from 'lucide-react';
import { InspectionItemStatus } from '@dustguard-operations/shared';

export const FieldInspectionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // inspectionId
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [data, setData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Overall notes and override reason
  const [inspectionNote, setInspectionNote] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);

  useEffect(() => {
    if (id) loadInspection();
  }, [id]);

  const loadInspection = async () => {
    try {
      setLoading(true);
      const res = await api.inspections.get(id!);
      setData(res.inspection);
      setItems(res.items);
      setInspectionNote(res.inspection.note || '');
    } catch (err: any) {
      error('Lỗi', err.detail);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (itemId: string, status: InspectionItemStatus) => {
    setItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, status } : it))
    );
  };

  const handleNoteChange = (itemId: string, note: string) => {
    setItems(prev =>
      prev.map(it => (it.id === itemId ? { ...it, note } : it))
    );
  };

  const handleSubmitInspection = async (override = false) => {
    // Check required items
    const requiredUnanswered = items.filter(
      it => (it.required === 1 || it.required === undefined) && it.status === 'UNKNOWN'
    );

    if (requiredUnanswered.length > 0 && !override && !overrideReason) {
      setOverrideModalOpen(true);
      return;
    }

    setSubmitting(true);
    try {
      await api.inspections.submit(id!, {
        items: items.map(it => ({
          item_id: it.id,
          status: it.status,
          note: it.note,
          evidence_asset_id: it.evidence_asset_id,
        })),
        note: inspectionNote,
        override_reason: overrideReason || undefined,
      });

      success('Hoàn thành kiểm tra', 'Biên bản thực địa đã được ghi nhận vào hệ thống');
      navigate(`/inspections/${id}/result`);
    } catch (err: any) {
      error('Lỗi nộp biên bản', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !data) {
    return <div className="civic-card p-12 text-center text-slate-400 text-sm">Đang nạp dữ liệu kiểm tra hiện trường...</div>;
  }

  // Count answered items
  const completedCount = items.filter(it => it.status !== 'UNKNOWN').length;

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-12">
      {/* Mobile-Friendly Topbar Header */}
      <div className="civic-card p-4 space-y-2 sticky top-16 z-20 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to={`/cases/${data.case_id}`} className="p-1 text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="font-mono text-xs font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {data.case_code}
              </span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 mt-0.5">
                {data.case_title}
              </h1>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {completedCount}/{items.length} xong
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-dustguard-red h-full transition-all duration-300"
            style={{ width: `${(completedCount / Math.max(1, items.length)) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist items list - Large Touch Targets (>= 44px) */}
      <div className="space-y-4">
        {items.map((item, index) => {
          const isPass = item.status === 'PASS';
          const isFail = item.status === 'FAIL';
          const isNA = item.status === 'NOT_APPLICABLE';
          const isUnknown = item.status === 'UNKNOWN';

          return (
            <div
              key={item.id}
              className={`civic-card p-4 space-y-3 transition-colors ${
                isFail ? 'border-rose-300 bg-rose-50/20' : isPass ? 'border-emerald-300 bg-emerald-50/10' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400">Tiêu chí {index + 1}:</span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.label}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                  )}
                  {item.legal_section_number && (
                    <span className="inline-block text-[10px] font-mono text-dustguard-teal bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                      Căn cứ: {item.legal_section_number}
                    </span>
                  )}
                </div>

                {item.required === 1 && (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 flex-shrink-0">
                    BẮT BUỘC
                  </span>
                )}
              </div>

              {/* 4 Large Touch Buttons (>= 44px) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'PASS')}
                  className={`touch-target rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isPass
                      ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1'
                      : 'bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" /> ĐẠT
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'FAIL')}
                  className={`touch-target rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isFail
                      ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600 ring-offset-1'
                      : 'bg-white text-rose-800 border border-rose-300 hover:bg-rose-50'
                  }`}
                >
                  <XCircle className="w-4 h-4" /> KHÔNG ĐẠT
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'UNKNOWN')}
                  className={`touch-target rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isUnknown
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600 ring-offset-1'
                      : 'bg-white text-amber-800 border border-amber-300 hover:bg-amber-50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" /> CHƯA RÕ
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange(item.id, 'NOT_APPLICABLE')}
                  className={`touch-target rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isNA
                      ? 'bg-slate-700 text-white shadow-sm ring-2 ring-slate-700 ring-offset-1'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <MinusCircle className="w-4 h-4" /> BỎ QUA
                </button>
              </div>

              {/* Note / observation input */}
              <div>
                <input
                  type="text"
                  value={item.note || ''}
                  onChange={e => handleNoteChange(item.id, e.target.value)}
                  placeholder="Nhập nhận xét / bằng chứng ghi nhận tại chỗ..."
                  className="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red bg-white"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall inspection notes */}
      <div className="civic-card p-4 space-y-2">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          Kết luận & Ghi chú chung của cán bộ kiểm tra:
        </label>
        <textarea
          rows={3}
          value={inspectionNote}
          onChange={e => setInspectionNote(e.target.value)}
          placeholder="Tóm tắt tình hình trật tự thi công, thời tiết, sự phối hợp của đại diện nhà thầu..."
          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
        />
      </div>

      {/* Bottom Submit Action - Big Button >= 44px */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          loading={submitting}
          onClick={() => handleSubmitInspection(false)}
          className="w-full font-bold shadow-md"
        >
          Hoàn Thành & Nộp Biên Bản Thực Địa
        </Button>
      </div>

      {/* Override Reason Modal if required items skipped */}
      <Modal
        isOpen={overrideModalOpen}
        onClose={() => setOverrideModalOpen(false)}
        title="Xác Nhận Ngoại Lệ (Override Reason)"
      >
        <div className="space-y-4 text-xs sm:text-sm">
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Còn tiêu chí bắt buộc chưa được đánh giá!</p>
              <p className="text-xs mt-0.5">
                Theo quy định, cán bộ cần nhập lý do hợp lệ khi bỏ qua các tiêu chí kiểm tra bắt buộc (VD: công trình đang tạm dừng thi công hoặc khu vực nguy hiểm không tiếp cận được).
              </p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Lý do ngoại lệ <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              placeholder="VD: Cổng phụ bị khóa không thể tiếp cận trạm rửa xe..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOverrideModalOpen(false)}>
              Quay lại hoàn thành
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={!overrideReason.trim()}
              onClick={() => {
                setOverrideModalOpen(false);
                handleSubmitInspection(true);
              }}
            >
              Xác nhận nộp ngoại lệ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
