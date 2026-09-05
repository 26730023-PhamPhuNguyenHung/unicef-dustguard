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
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  Users,
  Shield,
  Radio,
  FileCheck,
  Wrench,
  ChevronRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Case } from '@dustguard-operations/shared';

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
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Khẩn cấp</span>;
      case 'HIGH':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Cao</span>;
      case 'NORMAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">Bình thường</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-200">Thấp</span>;
    }
  };

  const getNextActionInfo = (c: any) => {
    switch (c.status) {
      case 'NEW':
        return { label: 'Thụ lý & Phân loại', path: `/cases/${c.id}` };
      case 'TRIAGED':
        return { label: 'Phân công cán bộ', path: `/cases/${c.id}` };
      case 'ASSIGNED':
      case 'INSPECTION_PLANNED':
        return { label: 'Kiểm tra hiện trường', path: `/cases/${c.id}/inspection/new` };
      case 'ACTION_REQUIRED':
        return { label: 'Ban hành khắc phục', path: `/cases/${c.id}` };
      case 'REMEDIATION':
        return { label: 'Nghiệm thu báo cáo', path: `/cases/${c.id}` };
      case 'READY_TO_CLOSE':
        return { label: 'Đóng vụ việc', path: `/cases/${c.id}` };
      default:
        return { label: 'Xem chi tiết', path: `/cases/${c.id}` };
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-xl"></div>
          <div className="h-96 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const { metrics, priorityQueue = [], operationalPulse = {}, recentActivities = [], supervisor } = data;
  const { signals = [], evidence = [], submissions = [] } = operationalPulse;

  const isZeroSeed =
    (priorityQueue.length === 0) &&
    (recentActivities.length === 0) &&
    (metrics.open_cases === 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header (Standardized Pattern: Title, Context, Clear Dominant Action) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-dustguard-red uppercase tracking-wider bg-dustguard-redSoft px-2 py-0.5 rounded border border-dustguard-redBorder">
              Side B • Điều Hành Chuyên Trách
            </span>
            <span className="text-xs text-ink-400">•</span>
            <span className="text-xs text-ink-500 font-medium">Thời gian thực</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink-900 tracking-tight mt-1">
            Bàn Làm Việc Điều Hành
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-0.5">
            Cán bộ: <strong className="text-ink-800">{user?.full_name}</strong> • Đơn vị: {user?.department || 'Sở Tài nguyên & Môi trường'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/cases">
            <Button variant="primary" size="sm" icon={<Inbox className="w-4 h-4" />}>
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
              Pháp lý FTS5
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
                Cơ sở dữ liệu sẵn sàng vận hành (Zero-Seed Clean Database)
              </h3>
              <p className="text-xs text-slate-700 mt-0.5">
                Chưa có vụ việc phát sinh. Mọi chỉ số KPI phản ánh số 0 trung thực từ D1 SSOT. Hãy tạo phản ánh cộng đồng hoặc đăng ký công trình đầu tiên.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/cases">
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

      {/* 3. ROW 1: 4 Dominant Operational KPI Focus Cards */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Open Cases */}
          <Link
            to="/cases"
            className="civic-card-interactive p-4 sm:p-5 border-l-4 border-slate-700 flex flex-col justify-between bg-surface shadow-xs hover:border-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-600 uppercase tracking-wider">Vụ việc đang mở</span>
              <Inbox className="w-4.5 h-4.5 text-slate-700" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-ink-900 mt-2">
              {metrics.open_cases || 0}
            </div>
            <div className="text-[11px] text-ink-500 mt-1 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Đang trong tiến trình</span>
              <ArrowRight className="w-3 h-3 text-ink-400" />
            </div>
          </Link>

          {/* Card 2: SLA At Risk */}
          <Link
            to="/actions?overdue=true"
            className="civic-card-interactive p-4 sm:p-5 border-l-4 border-dustguard-red flex flex-col justify-between bg-surface shadow-xs hover:bg-dustguard-redSoft/30"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-dustguard-red uppercase tracking-wider">SLA cần xử lý gấp</span>
              <AlertTriangle className="w-4.5 h-4.5 text-dustguard-red" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-dustguard-red mt-2">
              {metrics.sla_at_risk || 0}
            </div>
            <div className="text-[11px] text-dustguard-red font-semibold mt-1 flex items-center justify-between pt-2 border-t border-red-100">
              <span>Hạn định 48h luật định</span>
              <ArrowRight className="w-3 h-3 text-dustguard-red" />
            </div>
          </Link>

          {/* Card 3: Pending Inspection */}
          <Link
            to="/inspections"
            className="civic-card-interactive p-4 sm:p-5 border-l-4 border-dustguard-teal flex flex-col justify-between bg-surface shadow-xs hover:border-teal-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-dustguard-teal uppercase tracking-wider">Chờ thanh tra</span>
              <ClipboardCheck className="w-4.5 h-4.5 text-dustguard-teal" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-dustguard-teal mt-2">
              {metrics.pending_inspection || 0}
            </div>
            <div className="text-[11px] text-ink-500 mt-1 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>10 Tiêu chuẩn QCVN 18</span>
              <ArrowRight className="w-3 h-3 text-ink-400" />
            </div>
          </Link>

          {/* Card 4: Awaiting Remediation */}
          <Link
            to="/cases?tab=remediation"
            className="civic-card-interactive p-4 sm:p-5 border-l-4 border-amber-600 flex flex-col justify-between bg-surface shadow-xs hover:border-amber-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Chờ nhà thầu nộp</span>
              <Wrench className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-2">
              {metrics.awaiting_remediation || 0}
            </div>
            <div className="text-[11px] text-ink-500 mt-1 flex items-center justify-between pt-2 border-t border-slate-100">
              <span>Khắc phục hiện trường</span>
              <ArrowRight className="w-3 h-3 text-ink-400" />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. MAIN WORKSPACE: Priority Queue (70%) + Operational Pulse (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Queue (Command Center) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="civic-card p-5 bg-surface border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                  <span>Hàng Đợi Xử Lý Ưu Tiên (Priority Queue)</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-ink-700">
                    {priorityQueue.length}
                  </span>
                </h2>
                <p className="text-xs text-ink-500 mt-0.5">
                  Tập trung giải quyết các vụ việc có rủi ro cao và thời hạn SLA khẩn cấp
                </p>
              </div>

              <Link to="/cases" className="text-xs font-semibold text-dustguard-red hover:underline flex items-center gap-1">
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
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-ink-400 font-bold border-b border-slate-100">
                      <th className="py-2.5 px-2">MỨC ĐỘ</th>
                      <th className="py-2.5 px-3">MÃ & TÊN VỤ VIỆC</th>
                      <th className="py-2.5 px-3">ĐỊA BÀN</th>
                      <th className="py-2.5 px-3">PHỤ TRÁCH</th>
                      <th className="py-2.5 px-3 text-right">HÀNH ĐỘNG KẾ TIẾP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {priorityQueue.map((c: any) => {
                      const nextAct = getNextActionInfo(c);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                          {/* Severity */}
                          <td className="py-3 px-2 align-middle">
                            {getSeverityBadge(c.priority)}
                          </td>

                          {/* Case Info */}
                          <td className="py-3 px-3 align-middle">
                            <Link to={`/cases/${c.id}`} className="font-bold text-ink-900 hover:text-dustguard-red block line-clamp-1">
                              {c.case_code || c.id}
                            </Link>
                            <span className="text-[11px] text-ink-500 block truncate max-w-xs mt-0.5">
                              {c.title}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="py-3 px-3 align-middle text-ink-600 whitespace-nowrap">
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-ink-400 shrink-0" />
                              <span className="truncate max-w-[120px]">{c.district || 'Hà Nội'}</span>
                            </span>
                          </td>

                          {/* Assigned Staff */}
                          <td className="py-3 px-3 align-middle whitespace-nowrap">
                            {c.assigned_staff_name ? (
                              <span className="font-medium text-ink-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                                {c.assigned_staff_name}
                              </span>
                            ) : (
                              <span className="text-rose-600 font-semibold text-[11px]">Chưa giao</span>
                            )}
                          </td>

                          {/* Next Action 1-Click CTA */}
                          <td className="py-3 px-3 align-middle text-right whitespace-nowrap">
                            <Link to={nextAct.path}>
                              <Button variant="primary" size="sm" className="text-xs h-7.5 px-2.5 shadow-2xs font-semibold">
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
                    Góc Điều Phối Lãnh Đạo (Supervisor Workload)
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

        {/* Right 1 Col: Operational Pulse (Nhịp vận hành thời gian thực) */}
        <aside className="space-y-6">
          {/* Operational Pulse Card */}
          <div className="civic-card p-5 bg-surface border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-ink-900 flex items-center gap-2">
                <Radio className="w-4 h-4 text-dustguard-red animate-pulse" />
                <span>Nhịp Vận Hành (Live Pulse)</span>
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Trực tuyến
              </span>
            </div>

            {/* Pulse Feeds */}
            <div className="space-y-3.5 text-xs">
              {/* 1. Signals Feed */}
              <div>
                <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider block mb-1.5">
                  Phản ánh dân cư mới nhất:
                </span>
                {signals.length === 0 ? (
                  <p className="text-ink-400 italic">Chưa có phản ánh mới.</p>
                ) : (
                  <div className="space-y-1.5">
                    {signals.slice(0, 2).map((s: any) => (
                      <div key={s.id} className="p-2.5 rounded-lg bg-surface-subtle border border-slate-200/80">
                        <span className="font-bold text-ink-900 block truncate">{s.title}</span>
                        <div className="flex items-center justify-between text-[11px] text-ink-500 mt-1">
                          <span>{s.location_text}</span>
                          <span className="font-medium text-dustguard-red">
                            {new Date(s.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Evidence Feed */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider block mb-1.5">
                  Bằng chứng số & Niêm phong băm:
                </span>
                {evidence.length === 0 ? (
                  <p className="text-ink-400 italic">Chưa có tệp minh chứng tải lên.</p>
                ) : (
                  <div className="space-y-1.5">
                    {evidence.slice(0, 2).map((e: any) => (
                      <div key={e.id} className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200/80">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-900 truncate max-w-[140px]">{e.file_name}</span>
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                            {e.integrity_status || 'VERIFIED'}
                          </span>
                        </div>
                        <p className="text-[10px] text-teal-700 font-mono mt-1">
                          SHA-256: {e.sha256?.substring(0, 16)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Remediation Submissions */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider block mb-1.5">
                  Báo cáo khắc phục nhà thầu:
                </span>
                {submissions.length === 0 ? (
                  <p className="text-ink-400 italic">Chưa có báo cáo nộp mới.</p>
                ) : (
                  <div className="space-y-1.5">
                    {submissions.slice(0, 2).map((sub: any) => (
                      <div key={sub.id} className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/80">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 truncate max-w-[140px]">{sub.case_code || 'Vụ việc'}</span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                            {sub.review_status === 'APPROVED' ? 'Đã duyệt' : 'Chờ duyệt'}
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800 line-clamp-1 mt-1">{sub.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="civic-card p-4 bg-surface border border-slate-200/90 shadow-xs space-y-2 text-xs">
            <h4 className="font-bold text-ink-800 text-xs">Truy Cập Nhanh</h4>
            <div className="space-y-1">
              <Link to="/inspections/new" className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle text-ink-700 font-medium">
                <span>Lập lịch thanh tra hiện trường</span>
                <ChevronRight className="w-3.5 h-3.5 text-ink-400" />
              </Link>
              <Link to="/legal/import" className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle text-ink-700 font-medium">
                <span>Nhập văn bản pháp lý mới</span>
                <ChevronRight className="w-3.5 h-3.5 text-ink-400" />
              </Link>
              <Link to="/reports" className="flex items-center justify-between p-2 rounded hover:bg-surface-subtle text-ink-700 font-medium">
                <span>Báo cáo vận hành tổng hợp</span>
                <ChevronRight className="w-3.5 h-3.5 text-ink-400" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* 5. BOTTOM: Recent Case Activity Timeline */}
      <section className="civic-card p-5 bg-surface border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-dustguard-red" />
            <span>Nhật Ký Hoạt Động Vụ Việc Gần Đây (Activity Timeline)</span>
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
