import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../../api/client.js';
import { calculateFileSha256 } from '../../utils/crypto.js';
import { evaluateGeofenceBuffer, GeofenceResult } from '../../utils/geofence.js';
import { BeforeAfterComparison } from '../../components/common/BeforeAfterComparison.js';
import { useToast } from '../../context/ToastContext.js';
import { saveDraft, loadDraft, clearDraft } from '../../utils/draftStorage.js';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Camera,
  MapPin,
  ShieldCheck,
  Building2,
  Upload,
  Sparkles,
  Info,
} from 'lucide-react';

export const ContractorRemediationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // actionId
  const navigate = useNavigate();
  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  const [loading, setLoading] = useState(true);
  const [actionData, setActionData] = useState<any>(null);
  const [caseData, setCaseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [description, setDescription] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);

  // Photo & Hash states
  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoSha256, setPhotoSha256] = useState<string | null>(null);
  const [calculatingHash, setCalculatingHash] = useState(false);

  // Geolocation & 50m Geofence states
  const [gettingLocation, setGettingLocation] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geofenceResult, setGeofenceResult] = useState<GeofenceResult | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiRequest(`/contractor/actions/${id}`)
      .then((res) => {
        setActionData(res.action);
        setCaseData(res.case);
        if (res.action?.responsible_party) {
          setContractorName(res.action.responsible_party);
        }

        // Restore local draft with TTL check
        if (id) {
          const draftRes = loadDraft<any>(`dustguard_draft_remediation_${id}`);
          if (draftRes && draftRes.data) {
            const d = draftRes.data;
            if (d.description) setDescription(d.description);
            if (d.contractorName) setContractorName(d.contractorName);
            if (draftRes.updatedAt) setDraftSavedAt(new Date(draftRes.updatedAt).toLocaleTimeString('vi-VN'));
          }
        }
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải thông tin yêu cầu khắc phục.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Auto-save draft
  useEffect(() => {
    if (id && (description || contractorName) && !loading && !successSubmitted) {
      const timer = setTimeout(() => {
        const draft = {
          description,
          contractorName,
        };
        saveDraft(`dustguard_draft_remediation_${id}`, draft, {
          schema: 'remediation_draft',
          version: '1.0',
          ttlMs: 7 * 24 * 60 * 60 * 1000,
        });
        setDraftSavedAt(new Date().toLocaleTimeString('vi-VN'));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [id, description, contractorName, loading, successSubmitted]);

  // Handle Photo selection & calculate SHA-256 immediately
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setPhotoPreview(previewUrl);

    setCalculatingHash(true);
    try {
      const hash = await calculateFileSha256(selectedFile);
      setPhotoSha256(hash);
    } catch (err) {
      console.warn('Không thể tính mã băm SHA-256:', err);
    } finally {
      setCalculatingHash(false);
    }
  };

  // Get current GPS and evaluate 50m Geofence
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toastError('Không hỗ trợ GPS', 'Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentCoords(coords);

        // Site coordinates from case
        const siteCoords =
          caseData?.latitude && caseData?.longitude
            ? { lat: Number(caseData.latitude), lng: Number(caseData.longitude) }
            : { lat: 21.0205, lng: 105.8078 }; // Default fallback center (Hanoi SSOT)

        const result = evaluateGeofenceBuffer(coords, siteCoords, 50);
        setGeofenceResult(result);
        setGettingLocation(false);
        if (result.isWithinGeofence) {
          toastSuccess('Định vị hiện trường', `Hợp lệ: Cách tâm công trường ${result.distanceMeters}m (trong vùng đệm 50m)`);
        } else {
          toastInfo('Định vị hiện trường', `Cách tâm công trường ${result.distanceMeters}m (>50m). Vẫn có thể nộp giải trình kèm theo.`);
        }
      },
      (err) => {
        console.warn('Lỗi định vị:', err);
        toastInfo('Định vị GPS', 'Không thể truy xuất vị trí GPS tự động. Bạn vẫn có thể gửi báo cáo.');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Submit Remediation Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toastError('Thiếu thông tin', 'Vui lòng nhập mô tả các biện pháp khắc phục đã thực hiện.');
      return;
    }

    setSubmitting(true);
    try {
      // In production, file would be uploaded to /api/evidence; we pass the local preview / mock path + SHA256
      const evidenceAssetIds: string[] = [];
      if (photoSha256) {
        evidenceAssetIds.push(`evd-rem-${photoSha256.substring(0, 8)}`);
      }

      const res = await apiRequest(`/contractor/actions/${id}/remediation`, {
        method: 'POST',
        body: JSON.stringify({
          description: description.trim(),
          contractor_name: contractorName.trim() || 'Đơn vị thi công',
          evidence_asset_ids: evidenceAssetIds,
          latitude: currentCoords?.lat,
          longitude: currentCoords?.lng,
          site_latitude: caseData?.latitude,
          site_longitude: caseData?.longitude,
        }),
      });

      if (id) {
        clearDraft(`dustguard_draft_remediation_${id}`);
        setDraftSavedAt(null);
      }
      toastSuccess('Nộp thành công', 'Báo cáo khắc phục đã được chuyển tới cơ quan chuyên trách nghiệm thu.');
      setSuccessSubmitted(true);
    } catch (err: any) {
      toastError('Lỗi gửi báo cáo', err.message || 'Lỗi khi nộp báo cáo khắc phục.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <p className="text-xs font-semibold text-content-muted">Đang nạp hồ sơ yêu cầu khắc phục...</p>
      </div>
    );
  }

  if (error || !actionData) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-red-50 border border-red-200 rounded-civic-lg text-center space-y-3">
        <AlertTriangle className="w-8 h-8 text-accent-red mx-auto" />
        <h2 className="text-base font-bold text-content-main">Không tìm thấy yêu cầu khắc phục</h2>
        <p className="text-xs text-content-sub">{error || 'Yêu cầu không tồn tại hoặc đã được xử lý xong.'}</p>
        <Link to="/contractor" className="inline-block px-4 py-2 bg-primary text-white rounded-civic text-xs font-bold">
          Quay lại Cổng Nhà thầu
        </Link>
      </div>
    );
  }

  if (successSubmitted) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-surface-card rounded-civic-lg border border-border-subtle text-center space-y-4 shadow-sm animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-50 text-accent-green rounded-full flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-content-main">Đã nộp Báo cáo Khắc phục thành công!</h2>
        <p className="text-xs text-content-sub leading-relaxed">
          Hệ thống đã chuyển giao hồ sơ nghiệm thu tới Cơ quan Quản lý môi trường. Cán bộ thụ lý sẽ kiểm tra đối chiếu và phản hồi trong thời gian sớm nhất.
        </p>

        {photoSha256 && (
          <div className="p-3 bg-surface-ground rounded-lg border border-border-subtle text-[11px] font-mono text-content-main text-left space-y-1">
            <span className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Mã băm niêm phong bằng chứng:
            </span>
            <p className="break-all select-all text-content-sub">{photoSha256}</p>
          </div>
        )}

        <div className="pt-2">
          <Link
            to="/contractor"
            className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-primary text-white text-xs font-extrabold rounded-civic hover:bg-primary-hover transition shadow-sm"
          >
            Quay lại Danh sách công việc
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link to="/contractor" className="text-content-sub hover:text-content-main p-1 rounded-md">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Báo cáo Biện pháp Xử lý Ô nhiễm
            </span>
            {draftSavedAt && (
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Đã lưu nháp lúc {draftSavedAt}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-content-main mt-0.5">
            {actionData.title}
          </h1>
        </div>
      </div>

      {/* Action Context Box */}
      <div className="bg-surface-card rounded-civic-lg p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-surface-ground text-content-main border border-border-subtle">
            Mã vụ việc: {actionData.case_code || 'Vụ việc môi trường'}
          </span>
          <span className="text-xs font-semibold text-content-sub flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-accent-amber" /> Hạn chót:{' '}
            {actionData.due_at ? new Date(actionData.due_at).toLocaleString('vi-VN') : 'Trong vòng 48 giờ'}
          </span>
        </div>

        <div className="p-3.5 bg-surface-ground rounded-civic border border-border-subtle space-y-1.5 text-xs">
          <span className="font-bold text-content-main">Nội dung yêu cầu từ Cơ quan Quản lý:</span>
          <p className="text-content-sub leading-relaxed">{actionData.description}</p>
        </div>

        {caseData?.location_text && (
          <div className="text-xs text-content-muted flex items-center gap-1.5 pt-1">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Địa điểm công trình: {caseData.location_text}</span>
          </div>
        )}
      </div>

      {/* Before/After Preview Section */}
      {photoPreview && (
        <div className="bg-surface-card rounded-civic-lg p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-content-main">
            Đối chứng Thực tế (Ảnh vi phạm & Ảnh sau khắc phục)
          </h2>
          <BeforeAfterComparison
            afterUrl={photoPreview}
            afterLabel="Hiện trường sau khi nhà thầu đã xử lý"
            afterSha256={photoSha256}
            afterTimestamp={new Date().toISOString()}
            siteLocationText={caseData?.location_text}
          />
        </div>
      )}

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="bg-surface-card rounded-civic-lg p-6 sm:p-7 border border-border-subtle shadow-sm space-y-5">
        <h2 className="text-base font-bold text-content-main border-b border-border-subtle pb-3">
          Nộp Minh chứng Khắc phục Hiện trường
        </h2>

        {/* 1. Geofence 50m Verification */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-content-main">
            1. Xác thực Vị trí Có mặt tại Công trường (Ràng buộc Bán kính 50m) <span className="text-accent-red">*</span>
          </label>

          <div className="p-4 rounded-civic border border-border-subtle bg-surface-ground space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-content-sub">
                {currentCoords ? (
                  <span>
                    Tọa độ thiết bị: <strong>{currentCoords.lat.toFixed(5)}, {currentCoords.lng.toFixed(5)}</strong>
                  </span>
                ) : (
                  <span>Bấm nút bên dưới để kiểm định bạn đang chụp ảnh trực tiếp tại công trường.</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-white text-content-main border border-border-subtle rounded-civic hover:bg-surface-card transition shadow-sm shrink-0"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {gettingLocation ? 'Đang định vị...' : 'Lấy vị trí GPS hiện tại'}
              </button>
            </div>

            {/* Geofence Status Badge */}
            {geofenceResult && (
              <div
                className={`p-3 rounded-md text-xs font-medium border flex items-center gap-2 ${
                  geofenceResult.valid
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                    : geofenceResult.matchStatus === 'NEARBY_WARNING'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : 'bg-rose-50 text-rose-900 border-rose-200'
                }`}
              >
                {geofenceResult.valid ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-accent-amber shrink-0" />
                )}
                <span>{geofenceResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Photo Upload with SHA-256 Seal */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-content-main">
            2. Hình ảnh Minh chứng Hiện trường Đã Khắc phục <span className="text-accent-red">*</span>
          </label>

          <div className="border-2 border-dashed border-border-subtle rounded-civic-lg p-6 text-center hover:border-primary/50 transition bg-surface-ground">
            <input
              type="file"
              id="remediation-photo-input"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <label
              htmlFor="remediation-photo-input"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <div className="w-12 h-12 rounded-full bg-surface-card flex items-center justify-center text-primary shadow-sm border border-border-subtle">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-primary">
                {file ? file.name : 'Chụp ảnh hoặc Chọn ảnh từ máy'}
              </span>
              <span className="text-[11px] text-content-muted">
                Tự động tạo mã băm SHA-256 niêm phong ngay trên thiết bị
              </span>
            </label>
          </div>

          {calculatingHash && (
            <p className="text-[11px] font-semibold text-primary animate-pulse">
              Đang tính toán mã băm SHA-256 bảo đảm tính toàn vẹn...
            </p>
          )}

          {photoSha256 && (
            <div className="p-2.5 bg-surface-ground rounded-lg border border-border-subtle text-[11px] font-mono text-content-main flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
              <span className="font-bold flex items-center gap-1.5 text-content-main shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Mã băm SHA-256 niêm phong:
              </span>
              <span className="break-all select-all text-content-sub font-semibold">{photoSha256}</span>
            </div>
          )}
        </div>

        {/* 3. Description of Actions Taken */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-content-main">
            3. Mô tả Chi tiết Biện pháp đã Khắc phục <span className="text-accent-red">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ví dụ: Đã bố trí cầu rửa xe hoạt động liên tục 100% chuyến xe tải, che phủ bạt kín các đống vật liệu xây dựng, định kỳ tưới ẩm đường nội bộ 4 lần/ngày..."
            className="w-full p-3 bg-surface-ground border border-border-subtle rounded-civic text-xs sm:text-sm text-content-main placeholder:text-content-muted focus:outline-none focus:border-primary"
          />
        </div>

        {/* 4. Contractor Name / Representative */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-content-main">
            4. Họ tên Cán bộ / Chỉ huy trưởng Đại diện Đơn vị Thi công
          </label>
          <input
            type="text"
            value={contractorName}
            onChange={(e) => setContractorName(e.target.value)}
            className="w-full p-2.5 bg-surface-ground border border-border-subtle rounded-civic text-xs sm:text-sm text-content-main focus:outline-none focus:border-primary"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-3">
          <Link
            to="/contractor"
            className="px-4 py-2 text-xs font-bold text-content-sub hover:text-content-main border border-border-subtle rounded-civic bg-surface-ground transition"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 bg-primary text-white text-xs font-extrabold rounded-civic hover:bg-primary-hover shadow-sm transition disabled:opacity-50"
          >
            {submitting ? 'Đang gửi...' : 'Gửi Báo Cáo Khắc Phục'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContractorRemediationPage;
