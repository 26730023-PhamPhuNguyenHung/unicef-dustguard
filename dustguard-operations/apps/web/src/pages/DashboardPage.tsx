import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/case/StatusBadge';
import { Button } from '../components/common/Button';
import {
  Inbox,
  Clock,
  ClipboardCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  ChevronRight,
  Shield,
  Layers,
} from 'lucide-react';
import { Case } from '@dustguard-operations/shared';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.dashboard.get();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/4"></div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const { metrics, myQueue, recentActivities, supervisor } = data;

  return (
    <div className="space-y-8">
      {/* Title & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Bàn làm việc Điều hành
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Chào mừng đồng chí <strong className="text-slate-800">{user?.full_name}</strong> ({user?.department})
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/cases">
            <Button variant="outline" size="sm" icon={<Inbox className="w-4 h-4" />}>
              Xem Hộp việc
            </Button>
          </Link>
          <Link to="/legal/library">
            <Button variant="secondary" size="sm" icon={<Shield className="w-4 h-4" />}>
              Tra cứu Pháp lý
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. VIỆC CẦN TÔI XỬ LÝ (Section 10) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            VIỆC CẦN TÔI XỬ LÝ
          </h2>
          <span className="text-xs text-slate-400">Thời gian thực</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Card 1: New Cases */}
          <Link
            to="/cases?tab=new"
            className="civic-card-interactive p-4 border-l-4 border-blue-600 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Mới tiếp nhận</span>
              <Inbox className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700 mt-2">{metrics.new_cases}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Chờ phân loại</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </Link>

          {/* Card 2: Pending Legal */}
          <Link
            to="/cases?tab=pending_legal"
            className="civic-card-interactive p-4 border-l-4 border-amber-500 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Chờ pháp lý</span>
              <Shield className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-700 mt-2">{metrics.pending_legal}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Thẩm tra khung phạt</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </Link>

          {/* Card 3: Pending Inspections */}
          <Link
            to="/inspections"
            className="civic-card-interactive p-4 border-l-4 border-teal-600 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Kiểm tra</span>
              <ClipboardCheck className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-teal-700 mt-2">{metrics.pending_inspection}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Đã lên lịch thực địa</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </Link>

          {/* Card 4: Overdue Actions */}
          <Link
            to="/actions?overdue=true"
            className="civic-card-interactive p-4 border-l-4 border-rose-600 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Action quá hạn</span>
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-2xl font-bold text-rose-700 mt-2">{metrics.overdue_actions}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Chưa nộp khắc phục</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </Link>

          {/* Card 5: Pending Reinspection */}
          <Link
            to="/cases?tab=pending_reinspection"
            className="civic-card-interactive p-4 border-l-4 border-purple-600 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Chờ tái kiểm</span>
              <RotateCcw className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-2">{metrics.pending_reinspection}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Đối chứng hiện trường</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </Link>

          {/* Card 6: Ready To Close */}
          <Link
            to="/cases?tab=ready_to_close"
            className="civic-card-interactive p-4 border-l-4 border-emerald-600 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">Sẵn sàng đóng</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 mt-2">{metrics.ready_to_close}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Đủ 4 điều kiện</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </div>
          </Link>
        </div>
      </section>

      {/* 2. Supervisor Section if applicable */}
      {supervisor && (
        <section className="civic-card p-5 border-amber-200 bg-amber-50/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-700" />
              <h2 className="text-base font-bold text-slate-900">
                Góc Điều phối Lãnh đạo (Supervisor Command)
              </h2>
            </div>
            <Link to="/supervisor/workload" className="text-xs font-semibold text-amber-800 hover:underline">
              Xem chi tiết phân bổ tải &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Unassigned cases */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase">
                  Hồ sơ chưa có cán bộ tiếp nhận ({supervisor.unassignedCases.length})
                </span>
                <Link to="/cases?assignee=unassigned" className="text-xs text-dustguard-red font-medium">
                  Phân công ngay
                </Link>
              </div>
              <div className="space-y-2">
                {supervisor.unassignedCases.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center italic">
                    Không có hồ sơ nào chưa được phân công.
                  </p>
                ) : (
                  supervisor.unassignedCases.slice(0, 3).map((c: Case) => (
                    <div key={c.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between gap-2 text-xs">
                      <div className="min-w-0 flex-1">
                        <span className="font-mono font-bold text-slate-800">{c.case_code}</span>
                        <p className="font-medium text-slate-900 truncate">{c.title}</p>
                      </div>
                      <Link to={`/cases/${c.id}`} className="flex-shrink-0">
                        <Button variant="primary" size="sm" className="h-7 text-xs px-2.5">
                          Giao việc
                        </Button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Staff Workload */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs font-bold text-slate-700 uppercase mb-2 block">
                Tải công việc cán bộ hiện trường
              </span>
              <div className="space-y-2">
                {supervisor.staffWorkload.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center italic">
                    Chưa có tài khoản cán bộ hiện trường nào.
                  </p>
                ) : (
                  supervisor.staffWorkload.slice(0, 4).map((st: any) => (
                    <div key={st.id} className="flex items-center justify-between text-xs p-1.5 border-b border-slate-100 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                          {st.full_name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-800">{st.full_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{st.department}</span>
                        <span className="font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                          {st.active_cases_count} hồ sơ
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. MY WORK QUEUE */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-bold text-slate-900">
              Hàng đợi Xử lý của tôi (My Work Queue)
            </h2>
          </div>
          <Link to="/cases?tab=my_cases" className="text-xs font-semibold text-dustguard-red hover:underline">
            Xem toàn bộ ({myQueue.length}) &rarr;
          </Link>
        </div>

        {myQueue.length === 0 ? (
          <div className="civic-card p-6 text-center text-slate-500 text-xs">
            Hiện tại đồng chí không có vụ việc nào đang chờ xử lý. Hồ sơ sẽ xuất hiện khi có phản ánh hoặc phân công mới.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myQueue.map((c: Case) => (
              <div key={c.id} className="civic-card-interactive p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-dustguard-red bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                      {c.case_code}
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {c.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{c.location_text}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">
                    Cập nhật: {new Date(c.updated_at).toLocaleDateString('vi-VN')}
                  </span>
                  <Link to={`/cases/${c.id}`}>
                    <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                      Xử lý vụ việc &rarr;
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. RECENT CASE ACTIVITY (Timeline stream) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          HOẠT ĐỘNG VỤ VIỆC GẦN ĐÂY TRÊN TOÀN ĐỊA BÀN
        </h2>

        <div className="civic-card divide-y divide-slate-100">
          {recentActivities.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              Chưa có hồ sơ đang xử lý. Dòng thời gian và nhật ký hoạt động sẽ tự động cập nhật khi có phản ánh hoặc vụ việc mới phát sinh.
            </div>
          ) : (
            recentActivities.map((act: any) => (
              <div key={act.id} className="p-3.5 flex items-start gap-3 text-xs hover:bg-slate-50/50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-dustguard-red mt-1.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Link to={`/cases/${act.case_id}`} className="font-bold text-slate-900 hover:text-dustguard-red">
                      [{act.case_code}] {act.description}
                    </Link>
                    <time className="text-slate-400 font-mono text-[11px] flex-shrink-0">
                      {new Date(act.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  </div>
                  <div className="text-slate-500 mt-0.5">
                    Thực hiện bởi <strong>{act.actor_name || 'Hệ thống'}</strong> • Giai đoạn: {act.stage}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
