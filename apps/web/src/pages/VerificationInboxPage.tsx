import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { StatusBadge } from '../components/common/StatusBadge.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { CATEGORY_LABELS } from '@dustguard/shared';
import {
  FileCheck,
  MapPin,
  Camera,
  ArrowRight,
  AlertTriangle,
  Clock,
  Layers,
  Search,
  Filter
} from 'lucide-react';

export const VerificationInboxPage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'duplicates' | 'verified' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReports = () => {
    setLoading(true);
    apiRequest<any>('/moderator/reports')
      .then((res) => setReports(Array.isArray(res) ? res : (res.reports || [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const pendingCount = reports.filter((r) => r.status === 'submitted' || r.status === 'reviewing').length;
  const duplicatesCount = reports.filter(
    (r) => (r.status === 'submitted' || r.status === 'reviewing') && r.possibleDuplicates && r.possibleDuplicates.length > 0
  ).length;
  const verifiedCount = reports.filter((r) => r.status === 'verified').length;

  const filteredReports = reports.filter((r) => {
    // Lọc theo Tab
    if (activeTab === 'pending') {
      if (r.status !== 'submitted' && r.status !== 'reviewing') return false;
    } else if (activeTab === 'duplicates') {
      if ((r.status !== 'submitted' && r.status !== 'reviewing') || !r.possibleDuplicates || r.possibleDuplicates.length === 0) {
        return false;
      }
    } else if (activeTab === 'verified') {
      if (r.status !== 'verified') return false;
    }

    // Lọc theo Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const code = (r.report_code || r.reportCode || '').toLowerCase();
      const title = (r.title || '').toLowerCase();
      const address = (r.address || '').toLowerCase();
      const district = (r.district || '').toLowerCase();
      return code.includes(q) || title.includes(q) || address.includes(q) || district.includes(q);
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-4">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <FileCheck className="w-4 h-4" />
            Hộp thư điều phối viên
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Xác minh phản ánh mới
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            Thẩm định tính xác thực của các tín hiệu bụi do người dân gửi về, phát hiện trùng lặp để gộp vụ việc hoặc khởi tạo hồ sơ theo dõi mới.
          </p>
        </div>

        {/* Search & Tabs Toolbar */}
        <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* 4 Tabs Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'pending'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-secondary text-content-sub hover:text-content-main hover:bg-gray-200'
              }`}
            >
              Chờ thẩm định ({pendingCount})
            </button>
            <button
              onClick={() => setActiveTab('duplicates')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'duplicates'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-surface-secondary text-content-sub hover:text-content-main hover:bg-gray-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Nghi vấn trùng ({duplicatesCount})
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'verified'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-secondary text-content-sub hover:text-content-main hover:bg-gray-200'
              }`}
            >
              Đã xác thực ({verifiedCount})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`h-9 px-3.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-secondary text-content-sub hover:text-content-main hover:bg-gray-200'
              }`}
            >
              Tất cả ({reports.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-content-muted absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm mã hoặc địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full pl-9 pr-3 rounded-xl border border-border-subtle text-xs bg-white focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Reports List */}
      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : filteredReports.length === 0 ? (
        <EmptyState
          title="Không có phản ánh nào trong danh mục này"
          description="Tất cả các tín hiệu gửi về từ người dân đều đã được kiểm tra hoặc không khớp với bộ lọc."
        />
      ) : (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle overflow-hidden shadow-sm divide-y divide-border-subtle">
          {filteredReports.map((r) => {
            const hasDuplicates = r.possibleDuplicates && r.possibleDuplicates.length > 0;
            const categoryLabel = CATEGORY_LABELS[r.category as keyof typeof CATEGORY_LABELS] || r.category;

            return (
              <div
                key={r.id}
                className="p-5 hover:bg-surface-secondary/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-primary">
                      {r.report_code || r.reportCode}
                    </span>
                    <StatusBadge status={r.status} type="report" />
                    <span className="text-xs px-2 py-0.5 rounded bg-surface-secondary text-content-sub font-semibold">
                      {categoryLabel}
                    </span>
                    <span className="text-[11px] text-content-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(r.created_at || r.createdAt || Date.now()).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <Link to={`/moderator/verification/${r.id}`}>
                    <h3 className="text-sm sm:text-base font-bold text-content-main hover:text-primary transition-colors line-clamp-1">
                      {r.title}
                    </h3>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-content-sub">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {r.address}, {r.district}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Camera className="w-3.5 h-3.5 text-content-muted" />
                      {r.mediaCount || r.media?.length || 0} ảnh đính kèm
                    </span>
                  </div>

                  {hasDuplicates && (
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] font-bold text-amber-700">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Phát hiện {r.possibleDuplicates.length} vụ việc lân cận trong bán kính 150m</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/moderator/verification/${r.id}`}
                    className="h-9 px-4 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all shadow-xs inline-flex items-center gap-1.5 active:scale-95"
                  >
                    Thẩm định
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default VerificationInboxPage;
