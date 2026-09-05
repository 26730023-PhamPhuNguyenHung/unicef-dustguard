import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { LeafletMap } from '../components/common/LeafletMap.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { CitizenFeedbackSection } from '../components/common/CitizenFeedbackSection.js';
import { CATEGORY_LABELS, SEVERITY_LABELS } from '@dustguard/shared';
import {
  FileText,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  Layers,
  Clock,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiRequest<any>(`/reports/${id}`)
      .then((res) => {
        setReport(res.report || res);
      })
      .catch((err) => {
        setError(err.message || 'Không tìm thấy phản ánh.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSkeleton rows={4} />;

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-content-main">Không tìm thấy phản ánh</h2>
        <p className="text-sm text-content-sub">{error || 'Phản ánh không tồn tại hoặc đã bị xóa.'}</p>
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Về danh sách phản ánh
        </Link>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[report.category as keyof typeof CATEGORY_LABELS] || report.category;
  const severityInfo = SEVERITY_LABELS[report.severity_observation as keyof typeof SEVERITY_LABELS] || {
    label: report.severity_observation,
    description: ''
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Back Link & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-sub hover:text-content-main transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={report.status} type="report" />
        </div>
      </div>

      {/* Main Card Header */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-4">
          <span className="font-mono text-sm font-bold text-primary tracking-wider">
            {report.report_code || report.reportCode}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-content-sub">
            <Calendar className="w-3.5 h-3.5" />
            <span>Ghi nhận ngày: {new Date(report.observed_at || report.observedAt).toLocaleDateString('vi-VN')}</span>
          </div>
        </div>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-content-main leading-tight mb-2">
            {report.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-surface-secondary text-content-main font-semibold">
              {categoryLabel}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-primary-light text-primary font-medium">
              Mức độ quan sát: {severityInfo.label}
            </span>
          </div>
        </div>

        {/* Nội dung phản ánh */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-content-sub">
            Nội dung ghi nhận
          </div>
          <p className="text-sm text-content-main leading-relaxed whitespace-pre-line bg-surface-secondary/40 p-4 rounded-xl border border-border-subtle">
            {report.description}
          </p>
        </div>

        {/* Thư viện ảnh bằng chứng */}
        {report.media && report.media.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-content-sub">
                Hình ảnh bằng chứng ({report.media.length})
              </div>
              <div className="text-[11px] text-state-success flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Ảnh đã được ghi nhận vào hệ thống
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.media.map((m: any) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-border-subtle overflow-hidden bg-white shadow-xs"
                >
                  <img
                    src={m.file_path || m.filePath}
                    alt={m.caption || 'Minh chứng'}
                    className="w-full h-44 object-cover"
                  />
                  {m.caption && (
                    <div className="p-2.5 text-xs text-content-main font-medium border-t border-border-subtle">
                      {m.caption}
                    </div>
                  )}
                  {m.sha256_hash && (
                    <div className="px-2.5 pb-2 text-[10px] text-content-muted font-mono truncate" title={m.sha256_hash}>
                      SHA: {m.sha256_hash}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vị trí địa lý & Bản đồ */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-content-sub">
            Vị trí quan sát
          </div>
          <div className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-content-main">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{report.address}, {report.ward ? `${report.ward}, ` : ''}{report.district}</span>
          </div>
          {report.latitude && report.longitude && (
            <div className="h-60 w-full rounded-xl overflow-hidden border border-border-subtle">
              <LeafletMap
                center={[report.latitude, report.longitude]}
                zoom={15}
                height="100%"
                selectedLocation={{ lat: report.latitude, lng: report.longitude }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Vụ việc liên quan (Nếu đã được liên kết với Case) */}
      {report.case_id && report.linkedCase && (
        <div className="bg-white rounded-civic-lg border border-primary/30 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-primary tracking-wider">
                Vụ việc tổng hợp đã liên kết
              </span>
              <h3 className="text-base font-bold text-content-main line-clamp-1 mt-0.5">
                {report.linkedCase.title}
              </h3>
              <p className="text-xs text-content-sub">
                Mã vụ việc: <span className="font-mono font-semibold">{report.linkedCase.case_code || report.linkedCase.caseCode}</span>
              </p>
            </div>
          </div>

          <Link
            to={`/cases/${report.case_id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-colors shrink-0 shadow-xs"
          >
            Xem tiến độ vụ việc
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Phản hồi đánh giá nghiệm thu khi có liên kết vụ việc */}
      {report.case_id && (
        <CitizenFeedbackSection
          caseId={report.case_id}
          isClosedOrResolved={['resolved', 'closed', 'RESOLVED', 'CLOSED', 'accepted'].includes(report.status)}
        />
      )}
    </div>
  );
};
