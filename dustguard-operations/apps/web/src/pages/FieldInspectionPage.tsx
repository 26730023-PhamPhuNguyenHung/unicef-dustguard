import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { saveDraft, loadDraft, clearDraft } from '../utils/draftStorage';
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

  // Arrival Confirmation State (Section 13 C)
  const [arrivalTime, setArrivalTime] = useState(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
  const [arrivalGps, setArrivalGps] = useState('');
  const [arrivalOverrideReason, setArrivalOverrideReason] = useState('');
  const [gettingGps, setGettingGps] = useState(false);

  // Measurements & In-situ Data (Section 13 B & 14)
  const [pm25Measured, setPm25Measured] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('Nắng nhẹ, gió thoảng');
  const [contractorRep, setContractorRep] = useState('');

  // Draft Save State (Section 13 E)
  const [draftSavedAt, setDraftSavedAt] = useState('');

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

      // Check local draft with TTL
      if (id) {
        const draftRes = loadDraft<any>(`dustguard_draft_inspection_${id}`, user?.id);
        if (draftRes && draftRes.data) {
          const draft = draftRes.data;
          if (draft.items && draft.items.length > 0) {
            setItems(draft.items);
            if (draft.inspectionNote) setInspectionNote(draft.inspectionNote);
            if (draft.arrivalTime) setArrivalTime(draft.arrivalTime);
            if (draft.arrivalGps) setArrivalGps(draft.arrivalGps);
            if (draft.arrivalOverrideReason) setArrivalOverrideReason(draft.arrivalOverrideReason);
            if (draft.pm25Measured) setPm25Measured(draft.pm25Measured);
            if (draft.weatherCondition) setWeatherCondition(draft.weatherCondition);
            if (draft.contractorRep) setContractorRep(draft.contractorRep);
            if (draftRes.updatedAt) setDraftSavedAt(new Date(draftRes.updatedAt).toLocaleTimeString('vi-VN'));
          }
        }
      }
    } catch (err: any) {
      error('Lỗi', err.detail);
    } finally {
      setLoading(false);
    }
  };

  // Auto-save draft to localStorage (Section 13 E & Section 22)
  useEffect(() => {
    if (id && items.length > 0 && !loading) {
      const draft = {
        items,
        inspectionNote,
        arrivalTime,
        arrivalGps,
        arrivalOverrideReason,
        pm25Measured,
        weatherCondition,
        contractorRep,
      };
      saveDraft(`dustguard_draft_inspection_${id}`, draft, {
        schema: 'inspection_draft',
        version: '1.0',
        ttlMs: 7 * 24 * 60 * 60 * 1000,
        owner: user?.id,
      });
      setDraftSavedAt(new Date().toLocaleTimeString('vi-VN'));
    }
  }, [id, items, inspectionNote, arrivalTime, arrivalGps, arrivalOverrideReason, pm25Measured, weatherCondition, contractorRep, loading, user?.id]);

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      setArrivalOverrideReason('Thiết bị không hỗ trợ Geolocation HTML5');
      return;
    }
    setGettingGps(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setArrivalGps(`${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`);
        setGettingGps(false);
        success('Định vị thành công', 'Đã ghi nhận tọa độ GPS tại hiện trường');
      },
      () => {
        setGettingGps(false);
        setArrivalOverrideReason('Không thể lấy tín hiệu GPS thực địa (mất sóng/từ chối quyền)');
      },
      { timeout: 8000 }
    );
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
      const compositeNote = [
        inspectionNote,
        `--- THÔNG SỐ ĐO & THỰC ĐỊA ---`,
        `Giờ đến: ${arrivalTime} | Tọa độ GPS: ${arrivalGps || 'Xác nhận thủ công: ' + arrivalOverrideReason}`,
        pm25Measured ? `Nồng độ bụi đo tại chỗ (TSP/PM2.5): ${pm25Measured} µg/m³` : '',
        `Thời tiết: ${weatherCondition}`,
        contractorRep ? `Đại diện nhà thầu làm việc: ${contractorRep}` : '',
      ].filter(Boolean).join('\n');

      await api.inspections.submit(id!, {
        items: items.map(it => ({
          item_id: it.id,
          status: it.status,
          note: it.note,
          evidence_asset_id: it.evidence_asset_id,
        })),
        note: compositeNote,
        override_reason: overrideReason || undefined,
      });

      // Clear draft on successful submission
      if (id) {
        clearDraft(`dustguard_draft_inspection_${id}`);
      }

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
          <div className="text-right">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full block">
              {completedCount}/{items.length} xong
            </span>
            {draftSavedAt && (
              <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
                ✓ Đã lưu nháp {draftSavedAt}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-dustguard-red h-full transition-all duration-300"
            style={{ width: `${(completedCount / Math.max(1, items.length)) * 100}%` }}
          />
        </div>
      </div>

      {data.status === 'COMPLETED' && (
        <div className="civic-card p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-sm">Đợt kiểm tra này đã hoàn tất</p>
              <p className="text-xs text-emerald-700">Biên bản thực địa đã được nộp và ghi nhận vào hồ sơ vụ việc.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link to={`/inspections/${id}/result`} className="flex-1 sm:flex-none">
              <Button variant="primary" size="sm" className="w-full">
                Xem kết quả biên bản
              </Button>
            </Link>
            <Link to={`/inspections/${id}/export`} className="flex-1 sm:flex-none">
              <Button variant="outline" size="sm" className="w-full">
                Xuất văn bản A4
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Arrival Confirmation & In-situ Measurements (Section 13 C & B) */}
      <div className="civic-card p-4 space-y-3 bg-white border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-dustguard-red" />
            Xác nhận có mặt tại hiện trường (Arrival Check-in)
          </span>
          <span className="text-[11px] font-mono text-slate-500">Giờ: {arrivalTime}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Tọa độ GPS hiện trường:</label>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={arrivalGps}
                onChange={e => setArrivalGps(e.target.value)}
                placeholder="10.8231, 106.6297"
                className="flex-1 p-2 border border-slate-300 rounded text-xs font-mono outline-none"
              />
              <Button type="button" variant="outline" size="sm" loading={gettingGps} onClick={handleGetGps}>
                Lấy GPS
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">Xác nhận thủ công (nếu mất GPS):</label>
            <input
              type="text"
              value={arrivalOverrideReason}
              onChange={e => setArrivalOverrideReason(e.target.value)}
              placeholder="VD: Cán bộ đã có mặt tại cổng chính công trình..."
              className="w-full p-2 border border-slate-300 rounded text-xs outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-100">
          <div>
            <label className="block text-slate-600 font-medium mb-1">Đo nhanh bụi TSP/PM2.5:</label>
            <input
              type="number"
              value={pm25Measured}
              onChange={e => setPm25Measured(e.target.value)}
              placeholder="µg/m³ (tùy chọn)"
              className="w-full p-2 border border-slate-300 rounded text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Thời tiết / Hướng gió:</label>
            <input
              type="text"
              value={weatherCondition}
              onChange={e => setWeatherCondition(e.target.value)}
              placeholder="VD: Gió cấp 3, nắng gắt"
              className="w-full p-2 border border-slate-300 rounded text-xs outline-none"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-medium mb-1">Đại diện đơn vị thi công:</label>
            <input
              type="text"
              value={contractorRep}
              onChange={e => setContractorRep(e.target.value)}
              placeholder="Họ tên, SĐT liên hệ"
              className="w-full p-2 border border-slate-300 rounded text-xs outline-none"
            />
          </div>
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
        {data.status === 'COMPLETED' ? (
          <Link to={`/inspections/${id}/result`} className="block">
            <Button
              variant="primary"
              size="lg"
              className="w-full font-bold shadow-md"
            >
              Xem Kết Quả & Biên Bản Đã Nộp &rarr;
            </Button>
          </Link>
        ) : (
          <Button
            variant="primary"
            size="lg"
            loading={submitting}
            onClick={() => handleSubmitInspection(false)}
            className="w-full font-bold shadow-md"
          >
            Hoàn Thành & Nộp Biên Bản Thực Địa
          </Button>
        )}
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
