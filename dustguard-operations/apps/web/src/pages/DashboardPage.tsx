import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/case/StatusBadge';
import { Button } from '../components/common/Button';
import {
  Inbox,
  Clock,
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Users,
  Shield,
  Wrench,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      console.error('Lỗi khi tải dữ liệu bàn làm việc:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Khẩn cấp
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Cao
          </span>
        );
      case 'NORMAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Bình thường
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
            Thấp
          </span>
        );
    }
  };

  const getNextActionInfo = (c: any) => {
    switch (c.status) {
      case 'NEW':
        return { label: 'Xem tín hiệu & Chuẩn hóa', path: `/cases/${c.id}` };
      case 'TRIAGED':
        return { label: 'Kiểm tra bằng chứng', path: `/cases/${c.id}` };
      case 'NEEDS_EVIDENCE':
        return { label: 'Yêu cầu bổ sung minh chứng', path: `/cases/${c.id}` };
      case 'READY_FOR_ASSIGNMENT':
        return { label: 'Phân công cán bộ', path: `/cases/${c.id}` };
      case 'ASSIGNED':
        return { label: 'Bắt đầu xử lý hiện trường', path: `/cases/${c.id}` };
      case 'IN_PROGRESS':
      case 'INSPECTION_IN_PROGRESS':
        return { label: 'Cập nhật tiến độ', path: `/cases/${c.id}` };
      case 'ACTION_REQUIRED':
      case 'WAITING_UPDATE':
        return { label: 'Đôn đốc khắc phục', path: `/cases/${c.id}` };
      case 'REMEDIATION':
        return { label: 'Nghiệm thu báo cáo', path: `/cases/${c.id}` };
      case 'RESOLVED':
      case 'READY_TO_CLOSE':
        return { label: 'Xác nhận kết quả & Đóng', path: `/cases/${c.id}` };
      case 'CLOSED':
        return { label: 'Xem lại lịch sử', path: `/cases/${c.id}` };
      default:
        return { label: 'Xem hồ sơ', path: `/cases/${c.id}` };
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  const { metrics = {} as any, priorityQueue = [], recentActivities = [], supervisor = {} as any } = data || {};

  const isZeroSeed =
    priorityQueue.length === 0 &&
    recentActivities.length === 0 &&
    (metrics?.open_cases ?? 0) === 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-dustguard-red uppercase tracking-wider bg-dustguard-redSoft px-2 py-0.5 rounded border border-dustguard-redBorder">
              Side B • Điều Hành Chuyên Trách
            </span>
            <span className="text-xs text-ink-400">•</span>
            <span className="text-xs text-ink-500 font-medium">Hệ thống thực tế</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight mt-1">
            Bàn Làm Việc Điều Hành
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-0.5">
            Cán bộ: <strong className="text-ink-800">{user?.full_name}</strong> • Đơn vị: {user?.department || 'Sở Tài nguyên & Môi trường'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
          <Link to="/cases?create=1" className="w-full sm:w-auto">
            <Button variant="primary" size="sm" icon={<Inbox className="w-4 h-4" />} className="w-full sm:w-auto">
              Tạo vụ việc mới
            </Button>
          </Link>
          <Link to="/projects">
            <Button variant="outline" size="sm">
              Công trình
            </Button>
          </Link>
          <Link to="/legal/library">
            <Button variant="secondary" size="sm" icon={<Shield className="w-4 h-4" />}>
              Tra cứu pháp lý
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Zero-Seed / Clean Database Guidance Banner */}
      {isZeroSeed && (
        <div className="p-4 sm:p-5 bg-amber-50/90 rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-900 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Cơ sở dữ liệu sẵn sàng vận hành (Hệ thống sạch SSOT)
              </h3>
              <p className="text-xs text-slate-700 mt-0.5">
                Chưa có vụ việc phát sinh. Mọi chỉ số phản ánh trung thực từ cơ sở dữ liệu SQLite. Hãy tạo phản ánh cộng đồng hoặc đăng ký công trình đầu tiên.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/cases?create=1">
              <Button variant="primary" size="sm" icon={<Inbox className="w-4 h-4" />}>
                Tạo hồ sơ đầu tiên
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" size="sm">
                Thêm công trình
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 3. ROW 1: 4 Dominant Operational KPI Focus Cards (Trả Lời 4 Câu Hỏi Tác Nghiệp Thực Tế) */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Câu hỏi 1: Có bao nhiêu tín hiệu mới cần xem? */}
          <Link
            to="/cases?tab=new"
            className="civic-card-interactive p-3.5 sm:p-5 border-l-4 border-blue-600 flex flex-col justify-between bg-surface shadow-xs hover:bg-blue-50/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-blue-800 uppercase tracking-wider line-clamp-1">
                1. Tín hiệu mới cần xem
              </span>
              <Inbox className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-ink-900 mt-2">
              {metrics.new_signals ?? metrics.open_cases ?? 0}
            </div>
            <div className="text-[11px] text-ink-500 mt-1 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="truncate">Cần đối soát & lập hồ sơ</span>
              <ArrowRight className="w-3 h-3 text-ink-400 shrink-0" />
            </div>
          </Link>

          {/* Câu hỏi 2: Hồ sơ nào cần ưu tiên trước? */}
          <Link
            to="/cases?tab=urgent"
            className="civic-card-interactive p-3.5 sm:p-5 border-l-4 border-dustguard-red flex flex-col justify-between bg-surface shadow-xs hover:bg-dustguard-redSoft/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-dustguard-red uppercase tracking-wider line-clamp-1">
                2. Cần ưu tiên trước
              </span>
              <AlertTriangle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-dustguard-red shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-dustguard-red mt-2">
              {metrics.sla_at_risk ?? metrics.urgent_cases ?? 0}
            </div>
            <div className="text-[11px] text-dustguard-red font-semibold mt-1 flex items-center justify-between pt-2 border-t border-red-100">
              <span className="truncate">Rủi ro cao / Bụi đậm đặc</span>
              <ArrowRight className="w-3 h-3 text-dustguard-red shrink-0" />
            </div>
          </Link>

          {/* Câu hỏi 3: Hồ sơ nào chưa có người phụ trách? */}
          <Link
            to="/cases?tab=unassigned"
            className="civic-card-interactive p-3.5 sm:p-5 border-l-4 border-amber-500 flex flex-col justify-between bg-surface shadow-xs hover:bg-amber-50/40"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider line-clamp-1">
                3. Chưa có người phụ trách
              </span>
              <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-2">
              {metrics.unassigned_cases ?? Math.max(0, (metrics.open_cases || 0) - (metrics.assigned_cases || 0))}
            </div>
            <div className="text-[11px] text-ink-500 mt-1 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="truncate">Chờ chỉ định cán bộ</span>
              <ArrowRight className="w-3 h-3 text-ink-400 shrink-0" />
            </div>
          </Link>

          {/* Câu hỏi 4: Hồ sơ nào đang bị chậm hoặc cần cập nhật? */}
          <Link
            to="/cases?tab=overdue"
            className="civic-card-interactive p-3.5 sm:p-5 border-l-4 border-slate-700 flex flex-col justify-between bg-surface shadow-xs hover:bg-slate-100/60"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider line-clamp-1">
                4. Đang chậm / Cần cập nhật
              </span>
              <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 shrink-0" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {metrics.awaiting_remediation ?? 0}
            </div>
            <div className="text-[11px] text-ink-500 mt-1 flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="truncate">Cần đôn đốc hiện trường</span>
              <ArrowRight className="w-3 h-3 text-ink-400 shrink-0" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. MAIN WORKSPACE: Priority Queue (Full 100% Width) */}
      <section className="w-full space-y-4">
        <div className="civic-card p-5 bg-surface border border-slate-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                <span>Hàng Đợi Xử Lý Ưu Tiên</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-ink-700 border border-slate-200">
                  {priorityQueue.length}
                </span>
              </h2>
              <p className="text-xs text-ink-500 mt-0.5">
                Tập trung giải quyết các vụ việc có rủi ro cao và thời hạn xử lý khẩn cấp
              </p>
            </div>

            <Link
              to="/cases"
              className="text-xs font-semibold text-dustguard-red hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              Xem tất cả vụ việc &rarr;
            </Link>
          </div>

          {/* Priority Rows Table */}
          {priorityQueue.length === 0 ? (
            <div className="py-12 text-center text-ink-400 text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500/70 mb-2" />
              <p className="font-semibold text-ink-700 text-sm">Hiện không có vụ việc tồn đọng!</p>
              <p className="text-ink-400 mt-0.5">Tất cả vụ việc đã được giải quyết hoặc chưa có vi phạm mới.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[880px]">
                <thead>
                  <tr className="text-ink-500 font-bold border-b border-slate-200/80 bg-slate-50/50">
                    <th className="py-2.5 px-2.5 w-24 whitespace-nowrap">MỨC ĐỘ</th>
                    <th className="py-2.5 px-2.5 w-32 whitespace-nowrap">MÃ VỤ VIỆC</th>
                    <th className="py-2.5 px-2.5 min-w-[180px]">TÊN VỤ VIỆC</th>
                    <th className="py-2.5 px-2.5 w-28 whitespace-nowrap">ĐỊA BÀN</th>
                    <th className="py-2.5 px-2.5 w-32 whitespace-nowrap">PHỤ TRÁCH</th>
                    <th className="py-2.5 px-2.5 w-32 whitespace-nowrap">TRẠNG THÁI</th>
                    <th className="py-2.5 px-2.5 w-36 text-right whitespace-nowrap">HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {priorityQueue.map((c: any) => {
                    const nextAct = getNextActionInfo(c);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* Severity */}
                        <td className="py-2.5 px-2.5 align-middle whitespace-nowrap">
                          {getSeverityBadge(c.priority)}
                        </td>

                        {/* Case Code */}
                        <td className="py-2.5 px-2.5 align-middle whitespace-nowrap">
                          <Link
                            to={`/cases/${c.id}`}
                            className="font-mono font-bold text-dustguard-red hover:underline block"
                          >
                            {c.case_code || c.id}
                          </Link>
                        </td>

                        {/* Title */}
                        <td className="py-2.5 px-2.5 align-middle" title={c.title}>
                          <Link
                            to={`/cases/${c.id}`}
                            className="font-medium text-ink-900 hover:text-dustguard-red block line-clamp-1 max-w-xs lg:max-w-md"
                          >
                            {c.title}
                          </Link>
                        </td>

                        {/* Location */}
                        <td className="py-2.5 px-2.5 align-middle text-ink-600 whitespace-nowrap">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-ink-400 shrink-0" />
                            <span className="truncate max-w-[110px]">{c.district || 'Hà Nội'}</span>
                          </span>
                        </td>

                        {/* Assigned Staff */}
                        <td className="py-2.5 px-2.5 align-middle whitespace-nowrap">
                          {c.assigned_staff_name ? (
                            <span className="font-medium text-ink-800 bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                              {c.assigned_staff_name}
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold text-[11px] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                              Chưa giao
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-2.5 align-middle whitespace-nowrap">
                          <StatusBadge status={c.status} />
                        </td>

                        {/* Next Action 1-Click CTA */}
                        <td className="py-2.5 px-2.5 align-middle text-right whitespace-nowrap">
                          <Link to={nextAct.path}>
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs h-7.5 px-2.5 shadow-2xs font-semibold"
                            >
                              {nextAct.label}
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Supervisor Panel (If applicable) */}
        {supervisor && (
          <div className="civic-card p-5 bg-amber-50/30 border border-amber-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4.5 h-4.5 text-amber-800" />
                <h3 className="text-sm font-bold text-ink-900">
                  Góc Điều Phối Lãnh Đạo
                </h3>
              </div>
              <Link to="/supervisor/workload" className="text-xs font-semibold text-amber-800 hover:underline">
                Xem chi tiết phân bổ tải &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-lg border border-amber-200">
                <span className="text-ink-500 font-semibold block">Hồ sơ chưa có cán bộ thụ lý:</span>
                <span className="text-xl font-bold text-amber-900 block mt-1">
                  {supervisor.unassignedCases?.length || 0} vụ việc
                </span>
                <Link to="/cases?assignee=none" className="text-amber-700 font-bold hover:underline block mt-1">
                  Phân công ngay &rarr;
                </Link>
              </div>
              <div className="bg-white p-3.5 rounded-lg border border-amber-200">
                <span className="text-ink-500 font-semibold block">Vụ việc tồn đọng quá 7 ngày:</span>
                <span className="text-xl font-bold text-rose-700 block mt-1">
                  {supervisor.overdueCases?.length || 0} vụ việc
                </span>
                <Link to="/cases?flag=overdue" className="text-rose-700 font-bold hover:underline block mt-1">
                  Đôn đốc xử lý &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. BOTTOM: Recent Case Activity Timeline */}
      <section className="civic-card p-5 bg-surface border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-dustguard-red" />
            <span>Nhật Ký Hoạt Động Vụ Việc Gần Đây</span>
          </h2>
          <span className="text-xs text-ink-400">Minh bạch & Bất biến</span>
        </div>

        {recentActivities.length === 0 ? (
          <p className="text-xs text-ink-400 italic py-4 text-center">Chưa có lịch sử hoạt động ghi nhận trên hệ thống.</p>
        ) : (
          <div className="space-y-3">
            {recentActivities.map((act: any) => (
              <div key={act.id} className="flex items-start gap-3 text-xs p-2.5 rounded-lg hover:bg-surface-subtle transition-colors">
                <div className="w-2 h-2 rounded-full bg-dustguard-red mt-1.5 shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/cases/${act.case_id}`} className="font-bold text-ink-900 hover:text-dustguard-red">
                      [{act.case_code || act.case_id}]
                    </Link>
                    <span className="font-semibold text-ink-800">{act.stage || act.event_type}</span>
                    <span className="text-ink-400">•</span>
                    <span className="text-ink-500 font-medium">{act.actor_name || 'Hệ thống'}</span>
                    <span className="text-ink-400">•</span>
                    <span className="text-ink-400">
                      {new Date(act.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-ink-600 mt-1 leading-relaxed">
                    {act.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
