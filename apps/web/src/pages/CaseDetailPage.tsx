import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { LeafletMap } from '../components/common/LeafletMap.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { CitizenFeedbackSection } from '../components/common/CitizenFeedbackSection.js';
import { usePermission } from '../utils/permissions.js';
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
  AlertCircle
} from 'lucide-react';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { can } = usePermission();

  const [caseData, setCaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Trạng thái tương tác
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const [confirmCount, setConfirmCount] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Active tab: 'overview' | 'evidence' | 'timeline'
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'timeline'>('overview');

  const fetchCaseDetail = async () => {
    if (!id) return;
    try {
      const res = await apiRequest<any>(`/cases/${id}`);
      const c = res.case || res;
      setCaseData(c);
      setConfirmCount(c.signal_count || c.confirmationCount || 0);
      setHasConfirmed(!!(c.hasConfirmed ?? c.isConfirmedByMe));
      setHasSaved(!!(c.hasSaved ?? c.isSavedByMe));
    } catch (err: any) {
      setError(err.message || 'Không tìm thấy vụ việc.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetail();
  }, [id]);

  // Xử lý "Tôi cũng ghi nhận"
  const handleConfirmToggle = async () => {
    if (!id || actionLoading) return;
    setActionLoading(true);
    try {
      if (hasConfirmed) {
        await apiRequest(`/cases/${id}/confirm`, { method: 'DELETE' });
        setHasConfirmed(false);
        setConfirmCount((prev) => Math.max(0, prev - 1));
      } else {
        await apiRequest(`/cases/${id}/confirm`, { method: 'POST' });
        setHasConfirmed(true);
        setConfirmCount((prev) => prev + 1);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi cập nhật ghi nhận.');
    } finally {
      setActionLoading(false);
    }
  };

  // Xử lý "Lưu vụ việc"
  const handleSaveToggle = async () => {
    if (!id || actionLoading) return;
    setActionLoading(true);
    try {
      if (hasSaved) {
        await apiRequest(`/cases/${id}/save`, { method: 'DELETE' });
        setHasSaved(false);
      } else {
        await apiRequest(`/cases/${id}/save`, { method: 'POST' });
        setHasSaved(true);
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu vụ việc.');
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

  // Lấy tất cả media từ reports và observations
  const allMedia: any[] = [];
  if (caseData.reports) {
    caseData.reports.forEach((r: any) => {
      if (r.media) {
        r.media.forEach((m: any) => allMedia.push({ ...m, source: `Phản ánh #${r.report_code || r.id}` }));
      }
    });
  }
  if (caseData.observations) {
    caseData.observations.forEach((obs: any) => {
      if (obs.media) {
        obs.media.forEach((m: any) => allMedia.push({ ...m, source: `Quan sát ngày ${new Date(obs.created_at || obs.createdAt).toLocaleDateString('vi-VN')}` }));
      }
    });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Button & Case Code */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-sub hover:text-content-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại tổng quan
        </Link>
        <span className="font-mono text-xs font-bold text-primary px-3 py-1 bg-primary-light rounded-full">
          MÃ VỤ VIỆC: {caseData.case_code || caseData.caseCode}
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 flex-1 min-w-[280px]">
            <div className="flex items-center gap-2">
              <StatusBadge status={caseData.status} type="case" />
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-surface-secondary text-content-sub font-semibold">
                {categoryLabel}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-content-main leading-snug">
              {caseData.title}
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-content-sub font-medium">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{caseData.address}, {caseData.district}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleConfirmToggle}
              disabled={actionLoading}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                hasConfirmed
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-primary text-white hover:bg-primary-dark active:scale-95'
              }`}
            >
              <Users className="w-4 h-4" />
              {hasConfirmed ? 'Đã ghi nhận' : 'Tôi cũng ghi nhận'}
            </button>

            <button
              onClick={handleSaveToggle}
              disabled={actionLoading}
              className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                hasSaved
                  ? 'border-primary bg-primary-light text-primary font-bold'
                  : 'border-border-subtle bg-white text-content-main hover:bg-surface-secondary'
              }`}
              title={hasSaved ? 'Bỏ lưu vụ việc' : 'Lưu vụ việc để theo dõi'}
            >
              {hasSaved ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
              <span>{hasSaved ? 'Đã lưu' : 'Lưu'}</span>
            </button>

            {can('observation:create') && (
              <Link
                to={`/cases/${caseData.id}/observe`}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-secondary hover:bg-gray-200 text-content-main text-xs font-bold transition-colors shadow-xs"
              >
                <PlusCircle className="w-4 h-4 text-primary" />
                Bổ sung quan sát
              </Link>
            )}
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-border-subtle">
          <div className="p-3.5 rounded-xl bg-surface-secondary/60">
            <span className="text-[11px] text-content-sub font-semibold block mb-1">
              Phản ánh gộp
            </span>
            <div className="text-xl font-extrabold text-content-main">
              {caseData.reports?.length || caseData.unique_reporter_count || 1}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-secondary/60">
            <span className="text-[11px] text-content-sub font-semibold block mb-1">
              Cùng ghi nhận
            </span>
            <div className="text-xl font-extrabold text-primary">
              {confirmCount}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-secondary/60">
            <span className="text-[11px] text-content-sub font-semibold block mb-1">
              Quan sát thực tế
            </span>
            <div className="text-xl font-extrabold text-content-main">
              {caseData.observations?.length || 0}
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-surface-secondary/60">
            <span className="text-[11px] text-content-sub font-semibold block mb-1">
              Ghi nhận ban đầu
            </span>
            <div className="text-xs font-bold text-content-main mt-1">
              {new Date(caseData.first_reported_at || caseData.firstReportedAt || Date.now()).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-border-subtle gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          Tổng quan & Bản đồ
        </button>
        <button
          onClick={() => setActiveTab('evidence')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'evidence'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          Bằng chứng cộng đồng
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-surface-secondary text-content-main">
            {allMedia.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          Diễn biến tiến độ
          <span className="px-2 py-0.5 text-[10px] rounded-full bg-surface-secondary text-content-main">
            {caseData.updates?.length || 0}
          </span>
        </button>
      </div>

      {/* TAB 1: TỔNG QUAN & BẢN ĐỒ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 space-y-4 shadow-sm">
            <h2 className="text-base font-bold text-content-main">
              Tóm tắt tình trạng ghi nhận
            </h2>
            <p className="text-sm text-content-main leading-relaxed whitespace-pre-line bg-surface-secondary/40 p-4 rounded-xl border border-border-subtle">
              {caseData.summary || 'Chưa có thông tin tóm tắt bổ sung.'}
            </p>

            {/* Vị trí & Bản đồ */}
            <div className="space-y-2 pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-content-sub">
                Vị trí trên bản đồ
              </div>
              {caseData.latitude && caseData.longitude && (
                <div className="h-72 w-full rounded-xl overflow-hidden border border-border-subtle">
                  <LeafletMap
                    center={[caseData.latitude, caseData.longitude]}
                    zoom={15}
                    height="100%"
                    cases={[caseData]}
                  />
                </div>
              )}
            </div>
          </div>

          {/* CTA: Bạn có đang ở gần đây? */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-primary/20 rounded-civic-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Bạn có đang ở gần khu vực này?
              </div>
              <h3 className="text-base font-bold text-content-main">
                Cập nhật tình trạng hiện trường hôm nay
              </h3>
              <p className="text-xs text-content-sub">
                Bổ sung ảnh hoặc thông báo tình trạng đã giảm bớt / vẫn còn để điều phối viên có thêm căn cứ.
              </p>
            </div>
            {can('observation:create') ? (
              <Link
                to={`/cases/${caseData.id}/observe`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all shrink-0 shadow-sm"
              >
                <Camera className="w-4 h-4" />
                Cập nhật tình hình
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleConfirmToggle}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all shrink-0 shadow-sm"
              >
                <Users className="w-4 h-4" />
                {hasConfirmed ? 'Đã ghi nhận' : 'Tôi cũng ghi nhận'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BẰNG CHỨNG CỘNG ĐỒNG */}
      {activeTab === 'evidence' && (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-content-main">
                Hình ảnh và bằng chứng đã ghi nhận
              </h2>
              <p className="text-xs text-content-sub mt-0.5">
                Tổng hợp từ {caseData.reports?.length || 1} phản ánh ban đầu và {caseData.observations?.length || 0} lần quan sát hiện trường.
              </p>
            </div>
            <Link
              to={`/cases/${caseData.id}/observe`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary text-content-main text-xs font-semibold hover:bg-gray-200"
            >
              <PlusCircle className="w-4 h-4 text-primary" />
              Thêm ảnh mới
            </Link>
          </div>

          {allMedia.length === 0 ? (
            <div className="py-12 text-center text-content-muted text-xs">
              Chưa có hình ảnh bằng chứng nào được tải lên cho vụ việc này.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allMedia.map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="rounded-xl border border-border-subtle overflow-hidden bg-white shadow-xs"
                >
                  <img
                    src={m.file_path || m.filePath}
                    alt={m.caption || 'Minh chứng'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 space-y-1">
                    <div className="text-xs font-semibold text-content-main line-clamp-1">
                      {m.caption || 'Hình ảnh hiện trường'}
                    </div>
                    <div className="text-[11px] text-content-sub">{m.source}</div>
                    {m.sha256_hash && (
                      <div className="text-[10px] text-content-muted font-mono truncate" title={m.sha256_hash}>
                        SHA: {m.sha256_hash}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DIỄN BIẾN TIẾN ĐỘ */}
      {activeTab === 'timeline' && (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-content-main">
              Diễn biến quá trình tiếp nhận & xử lý
            </h2>
            <p className="text-xs text-content-sub mt-0.5">
              Lịch sử các mốc sự kiện được ghi nhận minh bạch và không thể sửa đổi trái phép.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-border-subtle space-y-6 ml-2">
            {caseData.updates && caseData.updates.length > 0 ? (
              caseData.updates.map((up: any) => (
                <div key={up.id} className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-white border-4 border-primary" />
                  <div className="text-[11px] text-content-muted font-semibold">
                    {new Date(up.created_at || up.createdAt).toLocaleString('vi-VN')}
                  </div>
                  <div className="text-sm font-bold text-content-main mt-0.5">
                    {up.title}
                  </div>
                  <div className="text-xs text-content-sub mt-1 leading-relaxed bg-surface-secondary/40 p-3 rounded-lg border border-border-subtle">
                    {up.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-content-muted py-4">
                Chưa có cập nhật nào được ghi nhận trên dòng thời gian.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Đánh giá phản hồi nghiệm thu của cộng đồng */}
      <CitizenFeedbackSection
        caseId={caseData.id}
        isClosedOrResolved={['resolved', 'closed', 'RESOLVED', 'CLOSED'].includes(caseData.status)}
      />
    </div>
  );
};
