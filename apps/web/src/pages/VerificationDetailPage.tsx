import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { CATEGORY_LABELS } from '@dustguard/shared';
import {
  FileCheck,
  MapPin,
  Camera,
  Layers,
  CheckCircle2,
  XCircle,
  FolderPlus,
  Merge,
  ArrowLeft,
  AlertTriangle,
  Send,
  Eye,
  X,
  Clock,
  User,
  ShieldAlert,
  Hash,
  ExternalLink,
  ChevronRight,
  Maximize2
} from 'lucide-react';

// Hàm tính khoảng cách địa lý xấp xỉ giữa 2 tọa độ (Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // mét
}

export const VerificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<any | null>(null);
  const [nearbyCases, setNearbyCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast thông báo trực quan (thay thế window.alert)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Selected case để merge
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');

  // Lightbox xem ảnh to
  const [activeImage, setActiveImage] = useState<{ src: string; caption?: string; hash?: string } | null>(null);
  // Danh sách ảnh bị lỗi load
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // Reject modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Create Case modal
  const [createCaseModalOpen, setCreateCaseModalOpen] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseSummary, setNewCaseSummary] = useState('');
  const [newCasePriority, setNewCasePriority] = useState<'normal' | 'attention' | 'urgent'>('normal');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const fetchVerificationDetail = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const repRes = await apiRequest<any>(`/reports/${id}`);
      const rep = repRes.report || repRes;
      setReport(rep);
      setNewCaseTitle(rep.title);
      setNewCaseSummary(rep.description);

      // Tìm nearby cases
      if (rep.latitude && rep.longitude) {
        const dupRes = await apiRequest<any>(
          `/cases?district=${encodeURIComponent(rep.district)}`
        ).catch(() => []);
        const rawCases = Array.isArray(dupRes) ? dupRes : (dupRes.cases || []);

        // Tính khoảng cách và làm giàu dữ liệu đối chiếu
        const enrichedCases = rawCases.map((c: any) => {
          let dist = 0;
          if (c.latitude && c.longitude) {
            dist = calculateDistance(rep.latitude, rep.longitude, c.latitude, c.longitude);
          }
          return {
            ...c,
            distanceMeters: dist,
            similarityReason:
              dist < 200
                ? 'Cách dưới 200m — Nghi vấn trùng cùng một nguồn phát tán'
                : dist < 500
                ? 'Cách dưới 500m — Cùng cụm hạ tầng khu vực'
                : 'Cùng địa bàn phường/quận'
          };
        });

        // Sắp xếp theo khoảng cách gần nhất
        enrichedCases.sort((a: any, b: any) => a.distanceMeters - b.distanceMeters);

        setNearbyCases(enrichedCases);
        if (enrichedCases.length > 0) {
          setSelectedCaseId(enrichedCases[0].id);
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi tải chi tiết phản ánh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationDetail();
  }, [id]);

  // 1. Xác nhận & tạo vụ việc mới
  const handleConfirmAndCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newCaseTitle.trim() || actionLoading) return;
    setActionLoading(true);
    try {
      const res = await apiRequest<any>('/moderator/cases', {
        method: 'POST',
        body: JSON.stringify({
          reportId: id,
          title: newCaseTitle,
          summary: newCaseSummary || report.description,
          category: report.category,
          latitude: report.latitude,
          longitude: report.longitude,
          address: report.address,
          district: report.district,
          ward: report.ward,
          priority: newCasePriority
        })
      });

      showToast('success', 'Đã khởi tạo hồ sơ vụ việc cộng đồng mới thành công!');
      setCreateCaseModalOpen(false);
      const newCase = res.case || res;
      setTimeout(() => {
        navigate(`/cases/${newCase.id}`);
      }, 1000);
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi tạo vụ việc mới.');
    } finally {
      setActionLoading(false);
    }
  };

  // 2. Gộp vào vụ việc đã chọn
  const handleMergeToCase = async (targetId?: string) => {
    const mergeCaseId = targetId || selectedCaseId;
    if (!id || !mergeCaseId || actionLoading) return;
    setActionLoading(true);
    try {
      await apiRequest(`/moderator/reports/${id}/merge`, {
        method: 'POST',
        body: JSON.stringify({ targetCaseId: mergeCaseId })
      });
      showToast('success', 'Đã gộp phản ánh vào vụ việc thành công!');
      setTimeout(() => {
        navigate(`/cases/${mergeCaseId}`);
      }, 1000);
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi gộp phản ánh.');
    } finally {
      setActionLoading(false);
    }
  };

  // 3. Từ chối phản ánh
  const handleRejectReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !rejectReason.trim() || actionLoading) return;
    setActionLoading(true);
    try {
      await apiRequest(`/moderator/reports/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason: rejectReason })
      });
      showToast('success', 'Đã lưu quyết định từ chối phản ánh.');
      setRejectModalOpen(false);
      setTimeout(() => {
        navigate('/moderator/verification');
      }, 1000);
    } catch (err: any) {
      showToast('error', err.message || 'Lỗi khi từ chối phản ánh.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;
  if (!report) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-content-main">Không tìm thấy phản ánh</h2>
        <Link
          to="/moderator/verification"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Về hộp thư xác minh
        </Link>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[report.category as keyof typeof CATEGORY_LABELS] || report.category;

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Toast Feedback Notification */}
      {toast && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between shadow-md transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-state-success border border-emerald-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/moderator/verification"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-content-sub hover:text-content-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Về hộp thư xác minh
        </Link>

        <span className="font-mono text-xs font-extrabold text-primary bg-primary-light px-3 py-1 rounded-full border border-primary/20">
          MÃ PHẢN ÁNH: {report.report_code || report.reportCode}
        </span>
      </div>

      {/* WORKFLOW 1: HIỂU SIGNAL (Signal Context & Header) */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-[280px]">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={report.status} type="report" />
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-surface-secondary text-content-sub font-semibold">
                {categoryLabel}
              </span>
              <span className="text-[11px] text-content-muted flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Gửi lúc: {new Date(report.created_at || report.createdAt || Date.now()).toLocaleString('vi-VN')}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-content-main leading-snug">
              {report.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-content-sub">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {report.address}, {report.district} {report.ward ? `(Phường ${report.ward})` : ''}
              </span>
              <span className="flex items-center gap-1 font-medium bg-surface-secondary px-2 py-0.5 rounded">
                <User className="w-3.5 h-3.5 text-content-muted" />
                Người gửi: {report.reporterName || 'Người dân cộng đồng'}
              </span>
            </div>
          </div>
        </div>

        {/* Nội dung chi tiết */}
        <div className="space-y-2 pt-2 border-t border-border-subtle">
          <span className="text-xs font-extrabold uppercase tracking-wider text-content-sub block">
            Nội dung phản ánh từ người dân
          </span>
          <p className="text-xs sm:text-sm text-content-main bg-surface-secondary/40 p-4 rounded-xl border border-border-subtle whitespace-pre-line leading-relaxed font-normal">
            {report.description}
          </p>
        </div>
      </div>

      {/* WORKFLOW 2: NHÌN EVIDENCE (Evidence Viewer & Lightbox) */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-content-main flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              Minh chứng hiện trường ({report.media?.length || 0})
            </h2>
            <p className="text-xs text-content-sub mt-0.5">
              Click vào ảnh để phóng to kiểm tra chi tiết và đối chiếu mã băm SHA-256.
            </p>
          </div>
        </div>

        {(!report.media || report.media.length === 0) ? (
          <div className="p-8 text-center bg-surface-secondary/30 rounded-xl border border-dashed border-border-subtle text-xs text-content-muted">
            Phản ánh này không đính kèm tệp hình ảnh minh chứng.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {report.media.map((m: any, idx: number) => {
              const filePath = m.file_path || m.filePath;
              const isBroken = brokenImages[m.id || idx];

              return (
                <div
                  key={m.id || idx}
                  className="rounded-xl border border-border-subtle overflow-hidden bg-white shadow-xs group relative flex flex-col"
                >
                  <div className="relative aspect-video bg-surface-secondary flex items-center justify-center overflow-hidden">
                    {!isBroken ? (
                      <img
                        src={filePath}
                        alt={m.caption || 'Minh chứng'}
                        onError={() => setBrokenImages((prev) => ({ ...prev, [m.id || idx]: true }))}
                        className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-200"
                        onClick={() =>
                          setActiveImage({
                            src: filePath,
                            caption: m.caption,
                            hash: m.sha256_hash || m.sha256Hash
                          })
                        }
                      />
                    ) : (
                      // Fallback an toàn khi file ảnh mất/lỗi
                      <div className="p-4 text-center space-y-1.5 text-content-muted">
                        <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto" />
                        <div className="text-xs font-bold text-content-sub">Ảnh không khả dụng</div>
                        <div className="text-[10px]">Tệp không thể tải từ máy chủ</div>
                      </div>
                    )}

                    {!isBroken && (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveImage({
                            src: filePath,
                            caption: m.caption,
                            hash: m.sha256_hash || m.sha256Hash
                          })
                        }
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Phóng to ảnh"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="p-3 space-y-1 bg-white flex-1">
                    <div className="text-xs font-bold text-content-main truncate">
                      {m.caption || `Hình ảnh minh chứng #${idx + 1}`}
                    </div>
                    {(m.sha256_hash || m.sha256Hash) && (
                      <div
                        className="text-[10px] text-content-muted font-mono truncate flex items-center gap-1"
                        title={m.sha256_hash || m.sha256Hash}
                      >
                        <Hash className="w-3 h-3 text-primary shrink-0" />
                        <span>SHA: {m.sha256_hash || m.sha256Hash}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WORKFLOW 3: XEM DUPLICATE CANDIDATES (Đối chiếu trùng lặp) */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <h2 className="text-base font-bold text-content-main flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Các vụ việc lân cận & Ứng viên gộp tín hiệu ({nearbyCases.length})
          </h2>
          <p className="text-xs text-content-sub mt-0.5">
            Đối chiếu khoảng cách và bối cảnh để xác định phản ánh này có thuộc về một công trình hoặc tuyến đường đang xử lý hay không.
          </p>
        </div>

        {nearbyCases.length === 0 ? (
          <div className="p-6 text-center bg-surface-secondary/30 rounded-xl border border-border-subtle text-xs text-content-muted">
            Không phát hiện vụ việc nào khác trong khu vực {report.district}. Bạn có thể thẩm định và tạo vụ việc mới ở bên dưới.
          </div>
        ) : (
          <div className="space-y-3">
            {nearbyCases.map((c) => {
              const isSelected = selectedCaseId === c.id;
              return (
                <div
                  key={c.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-primary bg-primary-light/40 shadow-xs'
                      : 'border-border-subtle hover:bg-surface-secondary/40 bg-white'
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0">
                    <input
                      type="radio"
                      name="selectedCase"
                      value={c.id}
                      checked={isSelected}
                      onChange={() => setSelectedCaseId(c.id)}
                      className="mt-1 text-primary focus:ring-primary h-4 w-4"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-extrabold text-primary">
                          {c.case_code || c.caseCode}
                        </span>
                        <StatusBadge status={c.status} type="case" />
                        <span className="text-[11px] font-bold text-primary bg-white px-2 py-0.5 rounded-full border border-primary/20">
                          {c.distanceMeters !== undefined ? `Cách ~${c.distanceMeters}m` : 'Cùng địa bàn'}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-content-main hover:text-primary transition-colors">
                        {c.title}
                      </h4>

                      <p className="text-xs text-content-sub flex items-center gap-1 truncate">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{c.address}</span>
                      </p>

                      <div className="text-[11px] text-amber-700 font-semibold pt-0.5">
                        💡 {c.similarityReason}
                      </div>
                    </div>
                  </label>

                  <div className="flex items-center gap-2 shrink-0 sm:self-center pl-7 sm:pl-0">
                    <Link
                      to={`/cases/${c.id}`}
                      target="_blank"
                      className="px-3 py-2 rounded-xl text-xs font-bold text-content-sub hover:text-content-main hover:bg-white border border-transparent hover:border-border-subtle transition-all inline-flex items-center gap-1"
                      title="Mở tab mới xem hồ sơ vụ việc"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Xem hồ sơ
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleMergeToCase(c.id)}
                      disabled={actionLoading}
                      className="px-3.5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all inline-flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <Merge className="w-3.5 h-3.5" />
                      Gộp vào đây
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* WORKFLOW 4: DECISION AREA (Khu vực đưa ra quyết định) */}
      <div className="bg-surface-card rounded-civic-lg border-2 border-primary/30 p-6 sm:p-8 shadow-sm space-y-5 sticky bottom-4 z-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
          <div>
            <h3 className="text-base font-extrabold text-content-main flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" />
              Khu vực quyết định thẩm định
            </h3>
            <p className="text-xs text-content-sub mt-0.5">
              Chọn 1 trong 3 hành động điều phối bên dưới để cập nhật tình trạng phản ánh.
            </p>
          </div>

          <span className="text-xs font-semibold text-content-muted">
            Trạng thái hiện tại: <strong className="text-content-main uppercase">{report.status}</strong>
          </span>
        </div>

        {/* 3 Decision Actions (Đồng nhất chiều cao h-10, Primary CTA nổi bật nhất) */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
          {/* Action 3: Từ chối phản ánh (Destructive nhưng tinh tế, không nổi hơn primary) */}
          <button
            type="button"
            onClick={() => setRejectModalOpen(true)}
            disabled={actionLoading}
            className="h-10 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <XCircle className="w-4 h-4" />
            Từ chối phản ánh
          </button>

          {/* Action 2: Gộp vào vụ việc đã chọn (Secondary) */}
          <button
            type="button"
            onClick={() => handleMergeToCase()}
            disabled={!selectedCaseId || actionLoading}
            className="h-10 px-4 rounded-xl border border-border-subtle bg-surface-secondary hover:bg-gray-200 text-content-main font-bold text-xs transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
          >
            <Merge className="w-4 h-4 text-primary" />
            Gộp vào vụ việc đã chọn
          </button>

          {/* Action 1: Xác nhận & Tạo vụ việc mới (Dominant Primary CTA) */}
          <button
            type="button"
            onClick={() => setCreateCaseModalOpen(true)}
            disabled={actionLoading}
            className="h-10 px-5 rounded-xl bg-primary text-white font-extrabold text-xs hover:bg-primary-dark transition-all inline-flex items-center gap-2 shadow-sm active:scale-95 disabled:opacity-50"
          >
            <FolderPlus className="w-4 h-4" />
            Xác nhận & Tạo vụ việc mới
          </button>
        </div>
      </div>

      {/* LIGHTBOX MODAL PHÓNG TO ẢNH */}
      {activeImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-border-subtle space-y-3 p-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="text-xs font-bold text-content-main">
                {activeImage.caption || 'Chi tiết hình ảnh minh chứng'}
              </span>
              <button
                onClick={() => setActiveImage(null)}
                className="p-1 rounded-lg text-content-muted hover:text-content-main hover:bg-surface-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[70vh] flex items-center justify-center overflow-hidden bg-surface-secondary rounded-xl">
              <img
                src={activeImage.src}
                alt="Enlarged"
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>

            {activeImage.hash && (
              <div className="text-[11px] text-content-muted font-mono bg-surface-secondary/60 p-2.5 rounded-lg border border-border-subtle flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate">Mã băm toàn vẹn (SHA-256): {activeImage.hash}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL TẠO VỤ VIỆC MỚI TỪ PHẢN ÁNH */}
      {createCaseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50" role="dialog" aria-modal="true">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl border border-border-subtle max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-content-main flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-primary" />
                Xác nhận & Khởi tạo vụ việc mới
              </h3>
              <button
                type="button"
                onClick={() => setCreateCaseModalOpen(false)}
                className="p-2 text-content-muted hover:text-content-main rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAndCreateCase} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Tiêu đề vụ việc *
                </label>
                <input
                  type="text"
                  required
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Tóm tắt tình trạng ghi nhận *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newCaseSummary}
                  onChange={(e) => setNewCaseSummary(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-content-sub">
                  Mức độ ưu tiên xử lý
                </label>
                <select
                  value={newCasePriority}
                  onChange={(e: any) => setNewCasePriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none font-semibold"
                >
                  <option value="normal">Bình thường (Normal)</option>
                  <option value="attention">Cần chú ý (Attention)</option>
                  <option value="urgent">Khẩn cấp (Urgent)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setCreateCaseModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-content-sub hover:bg-surface-secondary transition-colors min-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !newCaseTitle.trim()}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs hover:bg-primary-dark transition-all shadow-xs min-h-[44px] flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Đang tạo vụ việc...' : 'Xác nhận tạo vụ việc'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TỪ CHỐI KÈM LÝ DO */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50" role="dialog" aria-modal="true">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl border border-border-subtle max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-red-600 flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5" />
                Từ chối tiếp nhận phản ánh
              </h3>
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="p-2 text-content-muted hover:text-content-main rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-content-sub leading-relaxed">
              Vui lòng nhập lý do từ chối cụ thể. Lý do này sẽ được lưu vào nhật ký kiểm toán và thông báo trực tiếp cho người dân.
            </p>

            <form onSubmit={handleRejectReport} className="space-y-4">
              <textarea
                required
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="VD: Không xác minh được vị trí thực tế, hình ảnh không thể hiện dấu hiệu phát tán bụi..."
                className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs sm:text-sm bg-white focus:border-primary focus:outline-none"
              />

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-content-sub hover:bg-surface-secondary min-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !rejectReason.trim()}
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 transition-colors shadow-xs min-h-[44px] flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {actionLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default VerificationDetailPage;
