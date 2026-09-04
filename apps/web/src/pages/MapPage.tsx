import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { CaseDto } from '@dustguard/shared';
import { LeafletMap } from '../components/common/LeafletMap.js';
import { CaseCard } from '../components/common/CaseCard.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { Filter, Layers } from 'lucide-react';

export const MapPage: React.FC = () => {
  const [cases, setCases] = useState<CaseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseDto | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams();
    if (statusFilter !== 'all') query.set('status', statusFilter);
    if (categoryFilter !== 'all') query.set('category', categoryFilter);

    apiRequest<CaseDto[]>(`/cases?${query.toString()}`)
      .then((data) => {
        setCases(data);
        if (data.length > 0 && !selectedCase) {
          setSelectedCase(data[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [statusFilter, categoryFilter]);

  return (
    <div className="space-y-4">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border-subtle">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-content-main">Bản đồ phản ánh cộng đồng</h1>
          <p className="text-xs text-content-sub">Các điểm nóng và tiến độ xử lý bụi phát tán tại TP. Hồ Chí Minh</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-surface-card border border-border-subtle px-3 py-1.5 rounded-lg shadow-sm">
            <Filter className="w-3.5 h-3.5 text-content-sub" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-content-main focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Mới ghi nhận</option>
              <option value="community_verifying">Đang xác minh</option>
              <option value="confirmed_signal">Tín hiệu rõ ràng</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-surface-card border border-border-subtle px-3 py-1.5 rounded-lg shadow-sm">
            <Layers className="w-3.5 h-3.5 text-content-sub" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-medium text-content-main focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả danh mục</option>
              <option value="dust">Bụi công trình</option>
              <option value="construction_material">Vật liệu tập kết</option>
              <option value="road_dust">Bụi đường xe vận chuyển</option>
              <option value="illegal_dumping">Chất thải lộ thiên</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={2} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Cột trái: Danh sách vụ việc và vụ việc được chọn */}
          <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-1">
            <div className="text-xs font-bold text-content-sub uppercase tracking-wider">
              {cases.length} Điểm nóng ghi nhận
            </div>

            {selectedCase && (
              <div className="border-2 border-primary rounded-civic shadow-sm">
                <div className="bg-primary-light px-3 py-1.5 text-[11px] font-bold text-primary flex justify-between items-center">
                  <span>ĐANG CHỌN TRÊN BẢN ĐỒ</span>
                  <span className="font-mono">{(selectedCase as any).case_code || selectedCase.caseCode}</span>
                </div>
                <CaseCard caseData={selectedCase} />
              </div>
            )}

            <div className="space-y-3">
              {cases
                .filter((c) => c.id !== selectedCase?.id)
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className="cursor-pointer transition-transform hover:-translate-y-0.5"
                  >
                    <CaseCard caseData={c} />
                  </div>
                ))}
            </div>
          </div>

          {/* Cột phải: Bản đồ Leaflet tương tác */}
          <div className="lg:col-span-2">
            <LeafletMap
              cases={cases}
              height="600px"
              center={selectedCase ? [selectedCase.latitude, selectedCase.longitude] : [10.7769, 106.7009]}
              zoom={selectedCase ? 14 : 12}
              onMarkerClick={(c) => setSelectedCase(c)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
