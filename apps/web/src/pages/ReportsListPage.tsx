import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { ReportDto } from '@dustguard/shared';
import { ReportCard } from '../components/common/ReportCard.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ReportsListPage: React.FC = () => {
  const [reports, setReports] = useState<ReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'submitted' | 'reviewing' | 'verified' | 'merged'>('all');
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('');

  const fetchReports = () => {
    setLoading(true);
    const query = new URLSearchParams();
    if (activeTab !== 'all') query.set('status', activeTab);
    if (district) query.set('district', district);
    if (search.trim()) query.set('search', search.trim());

    apiRequest<ReportDto[]>(`/reports?${query.toString()}`)
      .then(setReports)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, [activeTab, district]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReports();
  };

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'submitted', label: 'Mới gửi' },
    { id: 'reviewing', label: 'Đang kiểm tra' },
    { id: 'verified', label: 'Đã xác thực' },
    { id: 'merged', label: 'Đã gộp vụ việc' }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-content-main">Danh sách phản ánh từ cộng đồng</h1>
          <p className="text-xs text-content-sub">Các tín hiệu bụi phát sinh do người dân ghi nhận tại hiện trường</p>
        </div>
        <Link
          to="/reports/new"
          className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-primary-dark transition-colors self-start shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Gửi phản ánh mới
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border-subtle overflow-x-auto pb-px">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === t.id
                ? 'border-primary text-primary'
                : 'border-transparent text-content-sub hover:text-content-main'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-content-sub absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tiêu đề, địa chỉ hoặc mã phản ánh..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-card border border-border-subtle text-xs sm:text-sm text-content-main placeholder:text-content-muted focus:outline-none focus:border-primary shadow-sm"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 bg-surface-card border border-border-subtle px-3 py-2 rounded-lg shadow-sm text-xs w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-content-sub" />
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="bg-transparent font-medium text-content-main focus:outline-none cursor-pointer w-full sm:w-auto"
            >
              <option value="">Tất cả địa bàn (Hà Nội)</option>
              <option value="Láng Thượng">Phường Láng Thượng</option>
              <option value="Láng Hạ">Phường Láng Hạ</option>
              <option value="Thành Công">Phường Thành Công</option>
              <option value="Giảng Võ">Phường Giảng Võ</option>
              <option value="Ngọc Khánh">Phường Ngọc Khánh</option>
              <option value="Trung Hòa">Phường Trung Hòa</option>
              <option value="Dịch Vọng">Phường Dịch Vọng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : reports.length === 0 ? (
        <EmptyState
          title="Chưa có phản ánh nào"
          description="Hiện tại chưa có phản ánh nào phù hợp với bộ lọc đã chọn. Bạn có thể gửi phản ánh đầu tiên tại đây."
          actionText="Gửi phản ánh mới"
          actionLink="/reports/new"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((r) => (
            <ReportCard key={r.id} report={r} />
          ))}
        </div>
      )}
    </div>
  );
};
