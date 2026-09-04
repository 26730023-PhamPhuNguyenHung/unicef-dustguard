import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { LeafletMap } from '../components/common/LeafletMap.js';
import { calculateFileSha256 } from '../utils/crypto.js';
import { CATEGORY_LABELS, SEVERITY_LABELS } from '@dustguard/shared';
import {
  FileText,
  MapPin,
  Camera,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Trash2,
  AlertTriangle,
  Send,
  Eye,
  Crosshair,
  ShieldCheck
} from 'lucide-react';

interface UploadedMediaItem {
  file: File;
  previewUrl: string;
  caption: string;
  sha256Hash: string;
}

export const CreateReportPage: React.FC = () => {
  const navigate = useNavigate();

  // Wizard step: 1 -> 4, 5 là success
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dữ liệu phản ánh
  const [category, setCategory] = useState<string>('dust');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severityObservation, setSeverityObservation] = useState<string>('medium');

  // Vị trí
  const [latitude, setLatitude] = useState<number>(10.7769);
  const [longitude, setLongitude] = useState<number>(106.7009);
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Quận 7');
  const [ward, setWard] = useState('Tân Phú');

  // Bằng chứng
  const [mediaList, setMediaList] = useState<UploadedMediaItem[]>([]);
  const [observedAt, setObservedAt] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });

  // Kiểm tra trước khi gửi
  const [visibility, setVisibility] = useState<'public' | 'community' | 'private'>('public');
  const [createdReportCode, setCreatedReportCode] = useState<string | null>(null);
  const [createdReportId, setCreatedReportId] = useState<string | null>(null);

  // Duplicate Warning Modal
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [nearbyCase, setNearbyCase] = useState<any | null>(null);

  // Lấy vị trí GPS hiện tại
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        setLatitude(lat);
        setLongitude(lng);
        checkNearbyDuplicates(lat, lng);
      },
      (err) => {
        console.warn('Không lấy được GPS:', err.message);
        alert('Không thể truy cập GPS. Bạn hãy nhấp vào bản đồ để ghim vị trí.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Kiểm tra duplicate vụ việc gần đó (bán kính 150m)
  const checkNearbyDuplicates = async (lat: number, lng: number) => {
    try {
      const res = await apiRequest<{ hasPossibleDuplicate: boolean; nearbyCase?: any }>(
        `/reports/check-duplicate?latitude=${lat}&longitude=${lng}`
      );
      if (res.hasPossibleDuplicate && res.nearbyCase) {
        setNearbyCase(res.nearbyCase);
        setDuplicateModalOpen(true);
      }
    } catch (e) {
      // Bỏ qua lỗi kiểm tra trùng, không chặn luồng gửi
    }
  };

  // Khi click map chọn vị trí
  const handleMapLocationSelect = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    checkNearbyDuplicates(lat, lng);
  };

  // Xử lý upload ảnh
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;
      const previewUrl = URL.createObjectURL(file);
      const sha256Hash = await calculateFileSha256(file);
      setMediaList((prev) => [
        ...prev,
        {
          file,
          previewUrl,
          caption: '',
          sha256Hash
        }
      ]);
    }
  };

  const removeMedia = (index: number) => {
    setMediaList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMediaCaption = (index: number, caption: string) => {
    setMediaList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, caption } : item))
    );
  };

  // Xử lý submit cuối cùng
  const handleSubmitReport = async () => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      // 1. Tạo report
      const reportRes = await apiRequest<any>('/reports', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          category,
          latitude,
          longitude,
          address: address || 'Vị trí ghim trên bản đồ',
          district,
          ward,
          observedAt: new Date(observedAt).toISOString(),
          visibility,
          severityObservation
        })
      });

      const rep = reportRes.report || reportRes;
      const repId = rep.id;
      const repCode = rep.report_code || rep.reportCode;

      // 2. Upload các file ảnh minh chứng (nếu có)
      for (const item of mediaList) {
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('caption', item.caption);
        formData.append('sha256Hash', item.sha256Hash);
        formData.append('latitude', latitude.toString());
        formData.append('longitude', longitude.toString());

        await apiRequest(`/reports/${repId}/media`, {
          method: 'POST',
          body: formData
        });
      }

      setCreatedReportId(repId);
      setCreatedReportCode(repCode);
      setStep(5); // Bước hoàn thành
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi phản ánh. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Wizard Header */}
      {step <= 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-content-main">
                Gửi phản ánh môi trường
              </h1>
              <p className="text-xs sm:text-sm text-content-sub mt-1">
                Tín hiệu của bạn giúp cộng đồng cùng xác minh và thúc đẩy đơn vị xử lý.
              </p>
            </div>
            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary-light rounded-full">
              Bước {step}/4
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 1, label: 'Thông tin' },
              { id: 2, label: 'Vị trí' },
              { id: 3, label: 'Bằng chứng' },
              { id: 4, label: 'Gửi' }
            ].map((s) => (
              <div key={s.id} className="space-y-1">
                <div
                  className={`h-2 rounded-full transition-all ${
                    step >= s.id ? 'bg-primary' : 'bg-surface-secondary'
                  }`}
                />
                <div className="text-[11px] font-medium text-content-sub text-center hidden sm:block">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-primary flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* BƯỚC 1: BẠN ĐANG THẤY ĐIỀU GÌ? */}
      {step === 1 && (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-content-main mb-1">
              Bạn đang thấy vấn đề gì?
            </h2>
            <p className="text-xs text-content-sub">
              Chọn nhóm nguồn phát để cộng đồng dễ dàng tổng hợp thông tin.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Phân loại nguồn bụi *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => (
                <button
                  type="button"
                  key={catKey}
                  onClick={() => setCategory(catKey)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    category === catKey
                      ? 'border-primary bg-primary-light text-primary font-semibold shadow-sm'
                      : 'border-border-subtle hover:border-gray-300 bg-white text-content-main'
                  }`}
                >
                  <span className="text-sm">{catLabel}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Tiêu đề phản ánh ngắn gọn *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Bụi phát sinh từ công trình thi công đường số 7"
              className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-sm bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Mô tả chi tiết quan sát *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả cụ thể thời gian phát tán bụi, xe tải ra vào có che chắn không, có vòi xịt nước hay không..."
              className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-sm bg-white"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Mức độ bụi quan sát được sơ bộ
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['low', 'medium', 'high'].map((sev) => (
                <button
                  type="button"
                  key={sev}
                  onClick={() => setSeverityObservation(sev)}
                  className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                    severityObservation === sev
                      ? 'border-primary bg-primary-light text-primary font-bold shadow-sm'
                      : 'border-border-subtle bg-white text-content-sub hover:border-gray-300'
                  }`}
                >
                  {SEVERITY_LABELS[sev as keyof typeof SEVERITY_LABELS]?.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={!title.trim() || !description.trim()}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95"
            >
              Tiếp tục: Chọn vị trí
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* BƯỚC 2: Ở ĐÂU? */}
      {step === 2 && (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-content-main mb-1">
                Vị trí bạn quan sát ở đâu?
              </h2>
              <p className="text-xs text-content-sub">
                Nhấp trực tiếp lên bản đồ để ghim tọa độ chính xác.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-secondary text-content-main text-xs font-semibold hover:bg-gray-200 transition-colors"
            >
              <Crosshair className="w-4 h-4 text-primary" />
              Lấy GPS của tôi
            </button>
          </div>

          <div className="h-72 w-full rounded-xl overflow-hidden border border-border-subtle">
            <LeafletMap
              center={[latitude, longitude]}
              zoom={14}
              height="100%"
              selectedLocation={{ lat: latitude, lng: longitude }}
              onLocationSelect={handleMapLocationSelect}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                Địa chỉ chi tiết hoặc tên đoạn đường *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="VD: Trước số 235 đường Nguyễn Văn Linh, đoạn gần cầu..."
                className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-sm bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                Quận / Huyện *
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="VD: Quận 7"
                className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-sm bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                Phường / Xã
              </label>
              <input
                type="text"
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                placeholder="VD: Phường Tân Phú"
                className="w-full px-4 py-2.5 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-sm bg-white"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-content-sub hover:bg-surface-secondary text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <button
              type="button"
              disabled={!address.trim()}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95"
            >
              Tiếp tục: Bằng chứng
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* BƯỚC 3: THÊM BẰNG CHỨNG */}
      {step === 3 && (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-content-main mb-1">
              Thêm bằng chứng ảnh tại hiện trường
            </h2>
            <p className="text-xs text-content-sub">
              Hình ảnh thực tế giúp tăng tính tin cậy của phản ánh. Hệ thống sẽ tự động xác thực mã băm SHA-256 nguyên bản.
            </p>
          </div>

          {/* Upload Dropzone */}
          <div className="border-2 border-dashed border-border-subtle hover:border-primary rounded-2xl p-6 text-center bg-surface-secondary/40 transition-colors">
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              onChange={handleFilesSelected}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-content-main">
                Nhấp vào đây hoặc kéo thả ảnh vào đây
              </div>
              <div className="text-xs text-content-muted">
                Hỗ trợ định dạng JPG, PNG, WEBP (tối đa 10MB mỗi ảnh)
              </div>
            </label>
          </div>

          {/* Danh sách ảnh đã chọn */}
          {mediaList.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-content-sub">
                Đã chọn {mediaList.length} ảnh
              </div>
              <div className="space-y-3">
                {mediaList.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border-subtle bg-white shadow-xs"
                  >
                    <img
                      src={item.previewUrl}
                      alt="Minh chứng"
                      className="w-16 h-16 object-cover rounded-lg shrink-0 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <input
                        type="text"
                        placeholder="Thêm chú thích cho bức ảnh này..."
                        value={item.caption}
                        onChange={(e) => updateMediaCaption(index, e.target.value)}
                        className="w-full text-xs px-3 py-1.5 rounded-lg border border-border-subtle focus:border-primary focus:outline-none"
                      />
                      <div className="text-[10px] text-content-muted font-mono truncate">
                        SHA-256: {item.sha256Hash}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="p-2 text-content-muted hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Xóa ảnh"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Thời điểm bạn quan sát thấy tình trạng này
            </label>
            <input
              type="datetime-local"
              value={observedAt}
              onChange={(e) => setObservedAt(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-xl border border-border-subtle focus:border-primary focus:outline-none text-sm bg-white"
            />
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-content-sub hover:bg-surface-secondary text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-all active:scale-95"
            >
              Kiểm tra trước khi gửi
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* BƯỚC 4: KIỂM TRA TRƯỚC KHI GỬI */}
      {step === 4 && (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-content-main mb-1">
              Kiểm tra lại thông tin
            </h2>
            <p className="text-xs text-content-sub">
              Sau khi gửi, thông tin sẽ được đưa vào kênh theo dõi cộng đồng để xác minh độc lập.
            </p>
          </div>

          {/* Summary Card */}
          <div className="p-5 rounded-2xl bg-surface-secondary/60 border border-border-subtle space-y-3.5 text-sm">
            <div>
              <span className="text-xs text-content-sub font-semibold">Tiêu đề:</span>
              <div className="font-bold text-content-main text-base mt-0.5">{title}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-content-sub font-semibold">Phân loại:</span>
                <div className="font-medium text-content-main mt-0.5">
                  {CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}
                </div>
              </div>
              <div>
                <span className="text-xs text-content-sub font-semibold">Mức độ sơ bộ:</span>
                <div className="font-medium text-content-main mt-0.5 capitalize">
                  {SEVERITY_LABELS[severityObservation as keyof typeof SEVERITY_LABELS]?.label}
                </div>
              </div>
            </div>

            <div>
              <span className="text-xs text-content-sub font-semibold">Địa chỉ:</span>
              <div className="font-medium text-content-main mt-0.5 flex items-start gap-1">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{address}, {ward ? `${ward}, ` : ''}{district}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-content-sub font-semibold">Nội dung quan sát:</span>
              <p className="text-xs sm:text-sm text-content-main mt-0.5 whitespace-pre-line bg-white p-3 rounded-lg border border-border-subtle">
                {description}
              </p>
            </div>

            <div>
              <span className="text-xs text-content-sub font-semibold">Ảnh bằng chứng:</span>
              <div className="text-xs text-content-main mt-1">
                {mediaList.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {mediaList.map((m, i) => (
                      <img
                        key={i}
                        src={m.previewUrl}
                        alt="Evidence"
                        className="w-16 h-16 object-cover rounded-lg border border-border-subtle shrink-0"
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-content-muted italic">Không kèm ảnh</span>
                )}
              </div>
            </div>
          </div>

          {/* Privacy Options */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
              Cài đặt danh tính hiển thị
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  visibility === 'public'
                    ? 'border-primary bg-primary-light text-primary font-semibold'
                    : 'border-border-subtle bg-white text-content-main'
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === 'public'}
                  onChange={() => setVisibility('public')}
                  className="text-primary"
                />
                <span className="text-xs">Hiển thị công khai với cộng đồng</span>
              </label>
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  visibility === 'community'
                    ? 'border-primary bg-primary-light text-primary font-semibold'
                    : 'border-border-subtle bg-white text-content-main'
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value="community"
                  checked={visibility === 'community'}
                  onChange={() => setVisibility('community')}
                  className="text-primary"
                />
                <span className="text-xs">Chỉ thành viên xác minh nội bộ</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-content-sub hover:bg-surface-secondary text-sm font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitReport}
              className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-md hover:bg-primary-dark transition-all disabled:opacity-50 active:scale-95"
            >
              {submitting ? 'Đang gửi...' : 'Gửi phản ánh ngay'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* BƯỚC 5: THÀNH CÔNG */}
      {step === 5 && (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-state-success flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-content-main">
              Phản ánh đã được ghi nhận!
            </h2>
            <p className="text-sm text-content-sub">
              Cảm ơn bạn đã đóng góp tín hiệu vì bầu không khí chung. Hệ thống đã tạo mã phản ánh để cộng đồng cùng theo dõi.
            </p>
          </div>

          <div className="inline-block p-4 rounded-xl bg-surface-secondary border border-border-subtle">
            <span className="text-xs text-content-sub font-semibold block mb-1">
              Mã phản ánh của bạn:
            </span>
            <span className="font-mono font-bold text-lg text-primary tracking-wider">
              {createdReportCode || 'DG-C-2026-XXXX'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {createdReportId && (
              <Link
                to={`/reports/${createdReportId}`}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm shadow-sm hover:bg-primary-dark transition-colors"
              >
                <Eye className="w-4 h-4" />
                Theo dõi phản ánh này
              </Link>
            )}
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-surface-secondary text-content-main font-semibold text-sm hover:bg-gray-200 transition-colors"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      )}

      {/* MODAL CẢNH BÁO TRÙNG VỤ VIỆC (Mục 38 trong prompt) */}
      {duplicateModalOpen && nearbyCase && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-border-subtle">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-content-main">
                  Có thể vấn đề này đã được ghi nhận
                </h3>
                <p className="text-xs text-content-sub mt-0.5">
                  Tại vị trí cách đây {nearbyCase.distanceMeters || 'gần'} mét, cộng đồng đã ghi nhận một vấn đề tương tự:
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-secondary text-xs space-y-1.5 border border-border-subtle">
              <div className="font-bold text-content-main line-clamp-2">
                {nearbyCase.title}
              </div>
              <div className="text-content-sub flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>{nearbyCase.address}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <Link
                to={`/cases/${nearbyCase.id}`}
                className="text-center py-2 px-3 rounded-lg border border-border-subtle text-xs font-semibold text-content-main hover:bg-surface-secondary transition-colors"
              >
                Xem vụ việc
              </Link>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await apiRequest(`/cases/${nearbyCase.id}/confirm`, { method: 'POST' });
                    alert('Bạn đã xác nhận cùng ghi nhận vụ việc này!');
                    navigate(`/cases/${nearbyCase.id}`);
                  } catch (e: any) {
                    alert(e.message || 'Lỗi xác nhận');
                  }
                }}
                className="text-center py-2 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shadow-xs"
              >
                Tôi cũng ghi nhận
              </button>
              <button
                type="button"
                onClick={() => setDuplicateModalOpen(false)}
                className="text-center py-2 px-3 rounded-lg text-content-sub hover:bg-gray-100 text-xs font-medium"
              >
                Vẫn gửi mới
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
