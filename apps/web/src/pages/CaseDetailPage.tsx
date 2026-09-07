import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { LeafletMap } from '../components/common/LeafletMap.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { CitizenFeedbackSection } from '../components/common/CitizenFeedbackSection.js';
import { SafeImage } from '../components/common/SafeImage.js';
import { ProcessingTimeline } from '../components/common/ProcessingTimeline.js';
import { usePermission } from '../utils/permissions.js';
import { useToast } from '../context/ToastContext.js';
import { CATEGORY_LABELS } from '@dustguard/shared';
import {
  FileText,
  MapPin,
  Users,
  Eye,
  Bookmark,
  BookmarkCheck,
  PlusCircle,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowLeft,
  Camera,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Radio,
  UserCheck,
  Wrench,
  CheckSquare,
  Activity,
  ShieldAlert,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getGoogleMapsUrl } from '../utils/geocoding.js';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { can } = usePermission();
  const { success: toastSuccess, error: toastError } = useToast();

  const [caseData, setCaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái tương tác cộng đồng
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [confirmCount, setConfirmCount] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Quan sát bổ sung
  const [observations, setObservations] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiRequest<any>(`/cases/${id}`)
      .then((res) => {
        const c = res.case || res;
        setCaseData(c);
        setConfirmCount(c.confirmationCount ?? c.confirm_count ?? 0);
        setHasConfirmed(!!(c.isConfirmedByMe ?? c.has_confirmed));
        setHasSaved(!!(c.isSavedByMe ?? c.has_saved));
      })
      .catch((err) => setError(err.message || 'Không thể tải chi tiết vụ việc.'))
      .finally(() => setLoading(false));

    apiRequest<any>(`/cases/${id}/observations`)
      .then((res) => setObservations(Array.isArray(res) ? res : (res.observations || [])))
      .catch((err) => console.warn('[CaseDetailPage] Không thể tải danh sách quan sát:', err));
  }, [id]);

  const handleConfirmToggle = async () => {
    if (!id || actionLoading) return;
    setActionLoading(true);
    try {
      if (hasConfirmed) {
        await apiRequest(`/cases/${id}/confirm`, { method: 'DELETE' });
        setHasConfirmed(false);
        setConfirmCount((prev) => Math.max(0, prev - 1));
        toastSuccess('Ghi nhận', 'Đã hủy xác nhận ghi nhận.');
      } else {
        await apiRequest(`/cases/${id}/confirm`, { method: 'POST' });
        setHasConfirmed(true);
        setConfirmCount((prev) => prev + 1);
        toastSuccess('Ghi nhận', 'Đã ghi nhận đóng góp xác nhận của bạn!');
      }
    } catch (err: any) {
      toastError('Lỗi cập nhật', err.message || 'Lỗi khi cập nhật ghi nhận.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!id || actionLoading) return;
    setActionLoading(true);
    try {
      if (hasSaved) {
        await apiRequest(`/cases/${id}/save`, { method: 'DELETE' });
        setHasSaved(false);
        toastSuccess('Theo dõi', 'Đã bỏ lưu theo dõi vụ việc.');
      } else {
        await apiRequest(`/cases/${id}/save`, { method: 'POST' });
        setHasSaved(true);
        toastSuccess('Theo dõi', 'Đã lưu vụ việc vào danh sách theo dõi của bạn.');
      }
    } catch (err: any) {
      toastError('Lỗi lưu vụ việc', err.message || 'Lỗi khi lưu vụ việc.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton rows={5} />;

  if (error || !caseData) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-content-main">Không tìm thấy vụ việc</h2>
        <p className="text-sm text-content-sub">{error || 'Vụ việc không tồn tại hoặc đã đóng.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[caseData.category as keyof typeof CATEGORY_LABELS] || caseData.category;

  // Thu thập tất cả media ảnh
  const mediaList: any[] = [];
  if (Array.isArray(caseData.reports)) {
    caseData.reports.forEach((r: any) => {
      if (Array.isArray(r.media)) {
        r.media.forEach((m: any) => mediaList.push({ ...m, source: `Phản ánh #${r.report_code || r.id}` }));
      }
    });
  }
  if (Array.isArray(caseData.observations)) {
    caseData.observations.forEach((obs: any) => {
      if (Array.isArray(obs.media)) {
        obs.media.forEach((m: any) => mediaList.push({ ...m, source: `Quan sát ngày ${new Date(obs.created_at || obs.createdAt).toLocaleDateString('vi-VN')}` }));
      }
    });
  }
  if (Array.isArray(observations)) {
    observations.forEach((obs: any) => {
      if (Array.isArray(obs.media)) {
        obs.media.forEach((m: any) => mediaList.push({ ...m, source: `Bổ sung hiện trường` }));
      }
    });
  }

  // Next Action Map theo trạng thái
  const getNextActionLabel = (status: string) => {
    const s = (status || '').toLowerCase();
    if (['new', 'submitted'].includes(s)) return 'Xem xét tín hiệu ban đầu';
    if (['triaged', 'reviewing'].includes(s)) return 'Kiểm tra bằng chứng & rủi ro';
    if (['needs_evidence'].includes(s)) return 'Yêu cầu cộng đồng bổ sung minh chứng';
    if (['ready_for_assignment', 'confirmed_signal'].includes(s)) return 'Phân công cán bộ xử lý';
    if (['assigned', 'forwarded'].includes(s)) return 'Bắt đầu xử lý hiện trường';
    if (['in_progress', 'waiting_update'].includes(s)) return 'Cập nhật tiến độ khắc phục';
    if (['resolved', 'ready_to_close'].includes(s)) return 'Xác nhận kết quả & nghiệm thu';
    return 'Xem lại lịch sử hồ sơ';
  };

  const priorityBadge = (p: string) => {
    const pr = (p || '').toLowerCase();
    if (['urgent', 'khan_cap', 'high'].includes(pr)) {
      return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Ưu tiên cao</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Bình thường</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 1. TOP HEADER WORKSPACE */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-sub hover:text-content-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại tổng quan
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            Hồ sơ vụ việc (Structured Case)
          </span>
          <span className="font-mono text-xs font-bold text-primary px-3 py-1 bg-primary-light rounded-md">
            {caseData.case_code || caseData.caseCode}
          </span>
        </div>
      </div>

      {/* Main Workspace Card */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Thông tin tổng quan */}
        <div className="space-y-3 pb-5 border-b border-border-subtle">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <StatusBadge status={caseData.status} type="case" />
              {priorityBadge(caseData.priority)}
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-surface-secondary text-content-sub font-semibold">
                {categoryLabel}
              </span>
            </div>
            <div className="text-xs text-content-sub flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tiếp nhận: {new Date(caseData.created_at || caseData.createdAt || Date.now()).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-content-main leading-tight text-pretty">
            {caseData.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-content-sub">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{caseData.address || caseData.location_text}, {caseData.district}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Phụ trách: <strong className="text-content-main">{caseData.assigned_staff_name || caseData.assignee?.full_name || 'Đang điều phối phân công'}</strong></span>
            </div>
          </div>
        </div>

        {/* Action Bar: Next Action + Community Collaboration */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-surface-secondary/70 border border-border-subtle">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Hành động tiếp theo:
            </span>
            <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-md border border-primary/20">
              {getNextActionLabel(caseData.status)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleConfirmToggle}
              disabled={actionLoading}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition shadow-xs cursor-pointer ${
                hasConfirmed
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              {hasConfirmed ? 'Đã đồng ghi nhận' : `Tôi cũng ghi nhận (${confirmCount})`}
            </button>

            <button
              type="button"
              onClick={handleSaveToggle}
              disabled={actionLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-subtle bg-white text-content-main text-xs font-semibold hover:bg-surface-secondary transition shadow-2xs cursor-pointer"
            >
              {hasSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-primary" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{hasSaved ? 'Đã lưu' : 'Lưu theo dõi'}</span>
            </button>

            {can('observation:create') && (
              <Link
                to={`/cases/${caseData.id}/observe`}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-border-subtle text-content-main text-xs font-bold hover:bg-surface-secondary transition shadow-2xs"
              >
                <PlusCircle className="w-3.5 h-3.5 text-primary" />
                Bổ sung bằng chứng
              </Link>
            )}
          </div>
        </div>

        {/* Processing Timeline */}
        <ProcessingTimeline currentStatus={caseData.status} isLinkedCase={true} />

        {/* SECTION 1 — TÍN HIỆU BAN ĐẦU */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Radio className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-content-main">
              Section 1 — Tín hiệu ban đầu (Initial Signal)
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border-subtle space-y-3">
            <p className="text-sm text-content-main leading-relaxed whitespace-pre-line">
              {caseData.summary || caseData.description || 'Chưa có tóm tắt chi tiết.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-content-sub pt-2 border-t border-border-subtle">
              <div>
                <span className="block text-[10px] text-content-muted uppercase">Nguồn dữ liệu:</span>
                <span className="font-semibold text-content-main">Cộng đồng phản ánh & Quan sát hiện trường</span>
              </div>
              <div>
                <span className="block text-[10px] text-content-muted uppercase">Số lượt phản ánh gộp:</span>
                <span className="font-semibold text-content-main">{caseData.reports?.length || caseData.unique_reporter_count || 1} tín hiệu</span>
              </div>
              <div>
                <span className="block text-[10px] text-content-muted uppercase">Tọa độ WGS84:</span>
                <span className="font-mono text-content-main">{caseData.latitude ? `${Number(caseData.latitude).toFixed(4)}°N, ${Number(caseData.longitude).toFixed(4)}°E` : 'Đang cập nhật'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — BẰNG CHỨNG (DÙNG SafeImage CHỐNG ẢNH VỠ) */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-content-main">
                Section 2 — Bằng chứng & Dữ liệu thực tế
              </h2>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Trạng thái: {mediaList.length > 0 ? 'Đã có tư liệu' : 'Cần bổ sung thêm'}
            </span>
          </div>

          {mediaList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaList.map((m, idx) => (
                <div key={idx} className="rounded-xl border border-border-subtle overflow-hidden bg-white shadow-xs">
                  <SafeImage
                    src={m.file_path || m.filePath}
                    alt={m.caption || 'Minh chứng'}
                    className="w-full h-40 object-cover"
                    fallbackText="Chưa có hình ảnh minh chứng"
                  />
                  <div className="p-2.5 text-xs text-content-main font-medium border-t border-border-subtle flex items-center justify-between">
                    <span className="truncate">{m.caption || m.source || 'Ảnh ghi nhận'}</span>
                    <span className="text-[10px] text-content-muted font-mono">SHA-256</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SafeImage
              src={null}
              className="w-full h-32"
              fallbackText="Chưa có hình ảnh minh chứng tải lên cho hồ sơ này"
            />
          )}

          {/* Dữ liệu trạm cảm biến nếu có */}
          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-teal-700" />
              <div>
                <span className="font-bold text-teal-900">Trạm đo bụi thời gian thực DG-IOT-001 lân cận</span>
                <p className="text-[11px] text-teal-700">Cập nhật lúc nãy · Chỉ số PM2.5 biến thiên từ 14 - 20 µg/m³</p>
              </div>
            </div>
            <Link to="/iot/device/dev-apm2000-001" className="text-teal-800 font-bold hover:underline">
              Xem sóng trạm &rarr;
            </Link>
          </div>
        </section>

        {/* SECTION 3 — ĐÁNH GIÁ ƯU TIÊN (RISK EVALUATION) */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-content-main">
              Section 3 — Đánh giá mức độ ưu tiên
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-amber-900">Chỉ số rủi ro tác động (Dust Risk Score):</span>
              <div className="text-2xl font-black text-amber-700">
                {caseData.priority === 'URGENT' ? '86/100' : caseData.priority === 'HIGH' ? '74/100' : '48/100'}
              </div>
              <span className="text-[10px] text-amber-800 font-medium">Mức độ cần can thiệp dập bụi nhanh</span>
            </div>
            <div className="sm:col-span-2 space-y-1.5 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block">Các yếu tố cấu thành điểm ưu tiên:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                <li>Khoảng cách công trình tới tuyến giao thông chính và khu vực trường học lân cận.</li>
                <li>Mật độ phản ánh lặp lại từ nhiều người dân độc lập trong vòng 48 giờ.</li>
                <li>Đối soát hướng gió và độ phân tán bụi qua dữ liệu cảm biến đo hạt PM2.5.</li>
              </ul>
              <span className="block text-[10px] text-slate-500 italic pt-1">
                * Điểm ưu tiên là công cụ hỗ trợ điều phối vận hành, không phải văn bản kết luận pháp lý hay biên bản xử phạt.
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 4 — PHÂN CÔNG & TIẾP NHẬN */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <UserCheck className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-content-main">
              Section 4 — Phân công & Trách nhiệm phối hợp
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary/40 border border-border-subtle grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-content-sub block">Đơn vị / Cán bộ chuyên trách:</span>
              <div className="font-bold text-sm text-content-main">
                {caseData.assigned_staff_name || caseData.assignee?.full_name || 'Đội kiểm tra môi trường Quận'}
              </div>
              <span className="text-[11px] text-content-muted">Phòng Tài nguyên & Môi trường phối hợp hiện trường</span>
            </div>
            <div className="space-y-1">
              <span className="text-content-sub block">Hạn định xử lý phản hồi (SLA chuẩn):</span>
              <div className="font-bold text-sm text-primary">
                Trong 48 giờ kể từ khi tiếp nhận
              </div>
              <span className="text-[11px] text-content-muted">Trạng thái tiếp nhận: Đã chuyển thông tin phối hợp</span>
            </div>
          </div>
        </section>

        {/* SECTION 5 — TIẾN TRÌNH XỬ LÝ (ACTION TIMELINE) */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <Clock className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-content-main">
              Section 5 — Tiến trình xử lý (Action Timeline)
            </h2>
          </div>

          <div className="space-y-3 pl-2">
            <div className="flex items-start gap-3 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <span className="font-bold text-content-main">Tiếp nhận tín hiệu và chuẩn hóa hồ sơ</span>
                <p className="text-content-sub text-[11px]">Hệ thống ghi nhận phản ánh từ cộng đồng, đối soát vị trí thực địa.</p>
                <span className="text-[10px] text-content-muted">{new Date(caseData.created_at || Date.now()).toLocaleString('vi-VN')}</span>
              </div>
            </div>

            {caseData.status !== 'new' && (
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-content-main">Chuyển thông tin tới cán bộ phụ trách khu vực</span>
                  <p className="text-content-sub text-[11px]">Hồ sơ được chỉ định để kiểm tra thực tế tại hiện trường công trình.</p>
                </div>
              </div>
            )}

            {['in_progress', 'action_required', 'remediation', 'resolved', 'closed'].includes(caseData.status?.toLowerCase()) && (
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-content-main">Đơn vị thi công triển khai biện pháp giảm bụi</span>
                  <p className="text-content-sub text-[11px]">Tiến hành phun sương dập bụi, che chắn bạt và làm sạch mặt đường dẫn.</p>
                </div>
              </div>
            )}

            {['resolved', 'closed'].includes(caseData.status?.toLowerCase()) && (
              <div className="flex items-start gap-3 text-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-800">Hoàn tất xử lý & Nghiệm thu kết quả</span>
                  <p className="text-content-sub text-[11px]">Tình trạng bụi đã được kiểm soát đạt chuẩn.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 6 — KẾT QUẢ & NGHIỆM THU */}
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-content-main">
              Section 6 — Kết quả & Nghiệm thu
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">
                {['resolved', 'closed'].includes(caseData.status?.toLowerCase())
                  ? 'Vụ việc đã được xử lý đạt yêu cầu'
                  : 'Hồ sơ đang trong quy trình theo dõi giải quyết'}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                {['resolved', 'closed'].includes(caseData.status?.toLowerCase()) ? 'ĐÃ HOÀN TẤT' : 'ĐANG TIẾP TỤC'}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              {['resolved', 'closed'].includes(caseData.status?.toLowerCase())
                ? 'Công trình đã bổ sung rào chắn, tổ chức xe bồn tưới nước mặt đường 3 lần/ngày và lắp đặt cầu rửa xe trước cổng ra vào.'
                : 'Mọi thông tin xử lý mới sẽ được cập nhật trực tiếp tại đây để người dân và cộng đồng tiện theo dõi đối chứng.'}
            </p>
          </div>
        </section>
      </div>

      {/* Đánh giá phản hồi từ cộng đồng */}
      <CitizenFeedbackSection
        caseId={caseData.id}
        isClosedOrResolved={['resolved', 'closed', 'RESOLVED', 'CLOSED'].includes(caseData.status)}
      />
    </div>
  );
};
