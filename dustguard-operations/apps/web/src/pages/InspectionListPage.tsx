import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { ClipboardCheck, Plus, Calendar, MapPin, User, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const InspectionListPage: React.FC = () => {
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadInspections();
  }, [statusFilter]);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const res = await api.inspections.list({ status: statusFilter || undefined });
      setInspections(res.inspections);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Quản lý Đợt Kiểm tra Hiện trường</h1>
          <p className="text-sm text-slate-600">
            Theo dõi kế hoạch thanh tra thực địa, checklist tiêu chí môi trường và kết quả xử lý
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-xs bg-white outline-none focus:ring-2 focus:ring-dustguard-red"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PLANNED">Đã lên lịch (PLANNED)</option>
            <option value="IN_PROGRESS">Đang thực hiện (IN_PROGRESS)</option>
            <option value="COMPLETED">Đã hoàn thành (COMPLETED)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="civic-card p-12 text-center text-slate-400 text-sm animate-pulse">
          Đang tải danh sách đợt kiểm tra...
        </div>
      ) : inspections.length === 0 ? (
        <div className="civic-card p-12 text-center text-slate-500 text-sm">
          Không có đợt kiểm tra nào trong danh mục.
        </div>
      ) : (
        <div className="civic-card divide-y divide-slate-200">
          {inspections.map((insp: any) => (
            <div key={insp.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {insp.case_code}
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold ${
                    insp.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {insp.status}
                  </span>
                  <span className="text-slate-500 font-medium">Loại: {insp.inspection_type}</span>
                </div>

                <Link to={`/cases/${insp.case_id}`}>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-dustguard-red">
                    {insp.case_title}
                  </h3>
                </Link>

                <p className="text-slate-600 font-medium">Mẫu áp dụng: {insp.template_name}</p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Lịch hẹn: {insp.scheduled_date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" /> Cán bộ: {insp.inspector_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {insp.location_text}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Link to={`/inspections/${insp.id}`}>
                  <Button variant="primary" size="sm">
                    {insp.status === 'COMPLETED' ? 'Biên bản kết quả' : 'Mở Field Checklist'} &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
