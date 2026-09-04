import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Users, UserCheck, AlertTriangle, ArrowRight, Layers, MapPin } from 'lucide-react';
import { Case } from '@dustguard-operations/shared';

export const SupervisorWorkloadPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkload();
  }, []);

  const loadWorkload = async () => {
    try {
      setLoading(true);
      const res = await api.dashboard.get();
      setData(res.supervisor);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return <div className="civic-card p-12 text-center text-slate-400 text-sm animate-pulse">Đang tải phân bổ nhân lực...</div>;
  }

  const { unassignedCases, staffWorkload, overdueCases } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Điều phối Nhân lực & Tải Công việc</h1>
        <p className="text-sm text-slate-600">
          Theo dõi số lượng hồ sơ đang thụ lý của từng cán bộ và phân công các vụ việc chưa có người phụ trách
        </p>
      </div>

      {/* Staff Workload Grid */}
      <div className="civic-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-dustguard-red" />
            <h2 className="text-base font-bold text-slate-900">
              Phân bổ Tải công việc Cán bộ Hiện trường
            </h2>
          </div>
          <span className="text-xs text-slate-400">Đơn vị: Hồ sơ đang xử lý</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffWorkload.map((st: any) => {
            const isHeavy = st.active_cases_count >= 5;
            return (
              <div
                key={st.id}
                className={`p-4 rounded-lg border flex flex-col justify-between space-y-3 ${
                  isHeavy ? 'bg-amber-50/40 border-amber-200' : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                      {st.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{st.full_name}</h3>
                      <p className="text-[11px] text-slate-500">{st.department}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                    isHeavy ? 'bg-amber-200 text-amber-950' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {st.active_cases_count} Case
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    {isHeavy ? 'Tải công việc cao' : 'Khả dụng nhận thêm'}
                  </span>
                  <Link to={`/cases?assignee=${st.id}`} className="text-dustguard-red font-semibold hover:underline">
                    Xem hồ sơ &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unassigned Cases Table */}
      <div className="civic-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Vụ việc chưa phân công cán bộ ({unassignedCases.length})
            </h2>
          </div>
        </div>

        {unassignedCases.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Hiện tại không có vụ việc nào bị tồn đọng chưa phân công.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {unassignedCases.map((c: Case) => (
              <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      {c.case_code}
                    </span>
                    <span className="text-slate-400">Nguồn: {c.source} ({c.source_report_count} phản ánh)</span>
                  </div>
                  <Link to={`/cases/${c.id}`}>
                    <h3 className="font-bold text-slate-900 hover:text-dustguard-red text-sm mt-1">
                      {c.title}
                    </h3>
                  </Link>
                  <p className="text-slate-500 mt-0.5">{c.location_text} ({c.district})</p>
                </div>

                <Link to={`/cases/${c.id}`}>
                  <Button variant="primary" size="sm">
                    Phân công ngay &rarr;
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overdue cases section */}
      <div className="civic-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h2 className="text-base font-bold text-slate-900">
            Hồ sơ Quá hạn cần đôn đốc ({overdueCases.length})
          </h2>
        </div>

        {overdueCases.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Không có hồ sơ nào quá hạn trên 7 ngày.
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {overdueCases.map((c: any) => (
              <div key={c.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-rose-700">{c.case_code}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{c.title}</h4>
                  <p className="text-slate-500">Cán bộ phụ trách: <strong>{c.assigned_staff_name || 'Chưa phân công'}</strong></p>
                </div>
                <Link to={`/cases/${c.id}`}>
                  <Button variant="outline" size="sm">
                    Kiểm tra & Chỉ đạo &rarr;
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
