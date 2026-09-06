import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import {
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingUp,
  RotateCcw,
  Activity,
  Layers,
  FileCheck2,
  HardHat,
  Radio,
  FileSpreadsheet,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const ReportsPage: React.FC = () => {
  const { addToast } = useToast();
  const [range, setRange] = useState<string>('30d');
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [range]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const res = await api.reports.overview(range);
      setData(res.data);
    } catch (err: any) {
      addToast(err.detail || 'Không thể tải báo cáo số liệu vận hành', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getSourceLabel = (src: string) => {
    switch (src) {
      case 'COMMUNITY':
        return 'Cộng đồng / Người dân';
      case 'IOT':
        return 'Cảm biến IoT tự động';
      case 'STAFF':
        return 'Cán bộ phát hiện hiện trường';
      case 'IMPORT':
        return 'Tiếp nhận đơn / Cổng dịch vụ công';
      case 'MANUAL':
        return 'Tạo thủ công nội bộ';
      default:
        return src;
    }
  };

  const getStatusLabel = (st: string) => {
    switch (st) {
      case 'NEW': return 'Mới tiếp nhận';
      case 'TRIAGED': return 'Đã phân loại sơ bộ';
      case 'ASSIGNED': return 'Đã phân công thụ lý';
      case 'LEGAL_REVIEW': return 'Đang rà soát pháp lý';
      case 'INSPECTION_PLANNED': return 'Lên lịch kiểm tra';
      case 'INSPECTION_IN_PROGRESS': return 'Đang thanh tra hiện trường';
      case 'ACTION_REQUIRED': return 'Yêu cầu khắc phục';
      case 'REMEDIATION': return 'Đang đôn đốc khắc phục';
      case 'REINSPECTION': return 'Tái kiểm tra hiện trường';
      case 'READY_TO_CLOSE': return 'Đủ điều kiện kết thúc';
      case 'CLOSED': return 'Đã đóng hồ sơ';
      case 'REOPENED': return 'Mở lại vụ việc';
      default: return st;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Báo cáo & Phân tích Vận hành</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-dustguard-teal/10 text-dustguard-teal border border-dustguard-teal/20 rounded-full">
              Dữ liệu Thời gian thực SSOT
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Tổng hợp các chỉ số xử lý vụ việc, kết quả thanh tra hiện trường, tỷ lệ khắc phục và trạng thái mạng lưới quan trắc
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex rounded-lg border border-slate-300 overflow-hidden text-xs font-semibold bg-white shadow-sm">
          {[
            { id: '7d', label: '7 ngày qua' },
            { id: '30d', label: '30 ngày qua' },
            { id: '90d', label: '90 ngày qua' },
            { id: 'all', label: 'Toàn thời gian' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-3.5 py-2 transition-colors ${
                range === r.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="civic-card p-12 text-center text-sm text-slate-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-dustguard-red mb-2"></div>
          <p>Đang tổng hợp báo cáo từ cơ sở dữ liệu vận hành...</p>
        </div>
      ) : !data ? (
        <div className="civic-card p-12 text-center text-slate-500">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
          <p className="font-semibold text-slate-800">Không có dữ liệu báo cáo</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Cases */}
            <div className="civic-card p-4 space-y-2 border-l-4 border-l-dustguard-teal">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Tổng vụ việc thụ lý</span>
                <Layers className="w-4 h-4 text-dustguard-teal" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{data.cases.total}</span>
                <span className="text-xs text-slate-500 font-medium">vụ việc</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Đã xử lý xong: <strong className="text-emerald-700 font-bold">{data.cases.closed}</strong> vụ việc
              </p>
            </div>

            {/* Card 2: Avg Resolution Time */}
            <div className="civic-card p-4 space-y-2 border-l-4 border-l-blue-600">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Thời gian xử lý TB</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{data.cases.avg_resolution_days}</span>
                <span className="text-xs text-slate-500 font-medium">ngày / vụ</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Tính từ tiếp nhận đến ban hành quyết định đóng hồ sơ
              </p>
            </div>

            {/* Card 3: Remediation Compliance */}
            <div className="civic-card p-4 space-y-2 border-l-4 border-l-emerald-600">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Tỷ lệ khắc phục hợp lệ</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">{data.remediation.compliance_rate}%</span>
                <span className="text-xs text-slate-500 font-medium">đạt chuẩn</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Đã nghiệm thu: <strong className="text-slate-800">{data.remediation.verified}</strong> / {data.remediation.total} yêu cầu
              </p>
            </div>

            {/* Card 4: IoT Monitoring Health */}
            <div className="civic-card p-4 space-y-2 border-l-4 border-l-purple-600">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Mạng lưới IoT</span>
                <Radio className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-slate-900">
                  {data.iot.online_devices}/{data.iot.total_devices}
                </span>
                <span className="text-xs text-emerald-700 font-bold">trạm online</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Đã thu thập <strong className="text-slate-800">{data.iot.total_readings}</strong> bản ghi dữ liệu bụi
              </p>
            </div>
          </div>

          {/* Section 2: Funnel of Stages & Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Stage Funnel */}
            <div className="civic-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-dustguard-red" />
                  Phân bố Vụ việc theo Giai đoạn Quy trình
                </h3>
                <span className="text-xs text-slate-500">{data.cases.by_stage.length} trạng thái</span>
              </div>

              <div className="space-y-2.5">
                {data.cases.by_stage.map((st: any) => {
                  const percentage = data.cases.total > 0 ? Math.round((st.count / data.cases.total) * 100) : 0;
                  return (
                    <Link to={`/cases?status=${st.status}`} key={st.status} className="block space-y-1 hover:bg-slate-50 p-1 rounded transition-colors group">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700 group-hover:text-dustguard-red">{getStatusLabel(st.status)}</span>
                        <span className="font-bold text-slate-900 group-hover:text-dustguard-red">
                          {st.count} vụ ({percentage}%) &rarr;
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-dustguard-teal h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(percentage, 4)}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Source Breakdown */}
            <div className="civic-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-dustguard-teal" />
                  Cơ cấu Nguồn phát hiện & Tiếp nhận
                </h3>
                <span className="text-xs text-slate-500">{data.cases.by_source.length} nguồn</span>
              </div>

              <div className="space-y-3">
                {data.cases.by_source.map((src: any) => {
                  const percentage = data.cases.total > 0 ? Math.round((src.count / data.cases.total) * 100) : 0;
                  return (
                    <Link to={`/cases?source=${src.source}`} key={src.source} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-between transition-colors group">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-dustguard-teal">{getSourceLabel(src.source)}</div>
                        <div className="text-[11px] text-slate-500 font-mono">SOURCE_KEY: {src.source}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-bold text-slate-900 group-hover:text-dustguard-teal">{src.count} vụ &rarr;</div>
                        <div className="text-[11px] text-dustguard-teal font-semibold">{percentage}% tổng số</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Inspections & Remediation Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inspections Summary */}
            <div className="civic-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HardHat className="w-4 h-4 text-amber-600" />
                  Công tác Thanh tra Hiện trường & Dấu hiệu Vi phạm
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
                  <span className="text-xs text-slate-500">Tổng đợt kiểm tra</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{data.inspections.total}</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-center">
                  <span className="text-xs text-emerald-800 font-medium">Đã hoàn thành</span>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">{data.inspections.completed}</div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-700">Phân loại mức độ vi phạm ghi nhận:</h4>
                <div className="space-y-1.5">
                  {data.inspections.findings_severity.map((f: any) => (
                    <div key={f.severity} className="flex items-center justify-between p-2 rounded bg-slate-50 text-xs">
                      <span className={`font-semibold ${
                        f.severity === 'HIGH' ? 'text-rose-700' : f.severity === 'MEDIUM' ? 'text-amber-700' : 'text-slate-700'
                      }`}>
                        Mức độ {f.severity === 'HIGH' ? 'Nghiêm trọng (HIGH)' : f.severity === 'MEDIUM' ? 'Trung bình (MEDIUM)' : 'Nhẹ (LOW)'}
                      </span>
                      <strong className="text-slate-900 font-bold">{f.count} phát hiện</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Remediation Compliance Details */}
            <div className="civic-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  Đôn đốc & Nghiệm thu Biện pháp Khắc phục
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[11px] text-slate-500">Yêu cầu ban hành</span>
                  <div className="text-xl font-bold text-slate-900 mt-1">{data.remediation.total}</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                  <span className="text-[11px] text-emerald-800">Đã nghiệm thu</span>
                  <div className="text-xl font-bold text-emerald-900 mt-1">{data.remediation.verified}</div>
                </div>
                <div className="p-3 bg-rose-50 rounded border border-rose-200">
                  <span className="text-[11px] text-rose-800">Quá hạn xử lý</span>
                  <div className="text-xl font-bold text-rose-900 mt-1">{data.remediation.overdue}</div>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="font-bold text-slate-900">Quy tắc Nghiệm thu & Chế tài:</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Mọi biện pháp khắc phục ô nhiễm bụi phải được xác minh đối chứng ảnh chụp Before/After, kiểm định dấu thời gian và kiểm tra thực tế hiện trường trước khi được phép đóng vụ việc.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
