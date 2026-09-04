import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { calculateFileSha256 } from '../utils/crypto.js';
import { OBSERVATION_TYPE_LABELS, ObservationType } from '@dustguard/shared';
import {
  Camera,
  Upload,
  Trash2,
  Send,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';

export const SubmitObservationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [caseTitle, setCaseTitle] = useState('');
  const [caseAddress, setCaseAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form state
  const [observationType, setObservationType] = useState<ObservationType>('still_present');
  const [comment, setComment] = useState('');
  const [observedAt, setObservedAt] = useState(() => new Date().toISOString().slice(0, 16));

  // File upload state
  const [mediaList, setMediaList] = useState<Array<{ file: File; previewUrl: string; sha256Hash: string }>>([]);

  useEffect(() => {
    if (!id) return;
    apiRequest<any>(`/cases/${id}`)
      .then((res) => {
        const c = res.case || res;
        setCaseTitle(c.title);
        setCaseAddress(c.address);
      })
      .catch((err) => {
        setErrorMsg('Không tìm thấy thông tin vụ việc.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const previewUrl = URL.createObjectURL(file);
      const hash = await calculateFileSha256(file);
      setMediaList((prev) => [...prev, { file, previewUrl, sha256Hash: hash }]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !comment.trim()) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Tạo observation
      const obsRes = await apiRequest<any>(`/cases/${id}/observations`, {
        method: 'POST',
        body: JSON.stringify({
          observationType,
          comment,
          observedAt: new Date(observedAt).toISOString()
        })
      });

      const obsId = obsRes.id || obsRes.observationId || obsRes.observation?.id;

      // 2. Upload media đính kèm observation (nếu có)
      for (const item of mediaList) {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('sha256Hash', item.sha256Hash);

        await apiRequest(`/cases/${id}/observations/${obsId}/media`, {
          method: 'POST',
          body: formData
        }).catch((err) => console.warn('Lỗi tải ảnh quan sát:', err));
      }

      alert('Đã ghi nhận quan sát hiện trường của bạn thành công!');
      navigate(`/cases/${id}`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi quan sát. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <Link
        to={`/cases/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-sub hover:text-content-main transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại chi tiết vụ việc
      </Link>

      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Cập nhật hiện trường
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-content-main mt-1">
            Bổ sung quan sát thực tế
          </h1>
          {caseTitle && (
            <p className="text-xs text-content-sub mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{caseTitle} ({caseAddress})</span>
            </p>
          )}
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-primary flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lựa chọn loại quan sát */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Hiện trạng bạn vừa quan sát thấy *
            </label>
            <div className="space-y-2">
              {(Object.keys(OBSERVATION_TYPE_LABELS) as ObservationType[]).map((typeKey) => {
                const item = OBSERVATION_TYPE_LABELS[typeKey];
                const isSelected = observationType === typeKey;
                return (
                  <button
                    type="button"
                    key={typeKey}
                    onClick={() => setObservationType(typeKey)}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                      isSelected
                        ? 'border-primary bg-primary-light/50 text-primary shadow-xs'
                        : 'border-border-subtle hover:border-gray-300 bg-white text-content-main'
                    }`}
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold">{item.label}</div>
                      <div className="text-[11px] text-content-sub mt-0.5">{item.hint}</div>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ghi chú chi tiết */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Chi tiết những gì bạn chứng kiến *
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="VD: Lúc 14h tôi đi qua thấy công trình đang tưới nước dập bụi, lượng bụi đã giảm đáng kể so với hôm qua..."
              className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-sm bg-white"
            />
          </div>

          {/* Upload hình ảnh */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Hình ảnh hiện trường mới (nếu có)
            </label>
            <div className="border-2 border-dashed border-border-subtle hover:border-primary rounded-xl p-4 text-center bg-surface-secondary/30 transition-colors">
              <input
                type="file"
                id="obs-media"
                multiple
                accept="image/*"
                onChange={handleFilesSelected}
                className="hidden"
              />
              <label
                htmlFor="obs-media"
                className="cursor-pointer flex flex-col items-center gap-1.5"
              >
                <Camera className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold text-content-main">
                  Tải ảnh chụp hiện trường
                </span>
                <span className="text-[11px] text-content-muted">
                  Hệ thống tự động lưu mã băm SHA-256 để đối chứng
                </span>
              </label>
            </div>

            {mediaList.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {mediaList.map((m, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border border-border-subtle group">
                    <img src={m.previewUrl} alt="Preview" className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-90 hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thời gian */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Thời điểm quan sát
            </label>
            <input
              type="datetime-local"
              value={observedAt}
              onChange={(e) => setObservedAt(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-sm bg-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border-subtle">
            <Link
              to={`/cases/${id}`}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-content-sub hover:bg-surface-secondary"
            >
              Hủy bỏ
            </Link>
            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95"
            >
              {submitting ? 'Đang gửi...' : 'Gửi quan sát'}
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
