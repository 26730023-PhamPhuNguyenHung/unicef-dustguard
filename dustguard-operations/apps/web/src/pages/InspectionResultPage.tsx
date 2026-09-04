import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Button } from '../components/common/Button';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Wrench,
  FileCheck2,
  MapPin,
  Calendar,
} from 'lucide-react';

export const InspectionResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // inspectionId
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.inspections.get(id).then(setData).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !data) {
    return <div className="civic-card p-12 text-center text-slate-400 text-sm">Đang tải kết quả...</div>;
  }

  const { inspection, items, findings } = data;

  const passCount = items.filter((i: any) => i.status === 'PASS').length;
  const failCount = items.filter((i: any) => i.status === 'FAIL').length;
  const naCount = items.filter((i: any) => i.status === 'NOT_APPLICABLE').length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={`/cases/${inspection.case_id}`} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="font-mono text-xs font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
            {inspection.case_code}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Biên Bản Kết Quả Kiểm Tra Thực Địa</h1>
        </div>
      </div>

      {/* Summary Matrix */}
      <div className="civic-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">{inspection.template_name}</h2>
            <p className="text-xs text-slate-500">Cán bộ thực hiện: {inspection.inspector_name}</p>
          </div>
          <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            ĐÃ HOÀN THÀNH
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <span className="text-2xl font-bold text-emerald-700">{passCount}</span>
            <span className="text-xs text-emerald-800 block font-semibold mt-1">ĐẠT CHUẨN</span>
          </div>
          <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
            <span className="text-2xl font-bold text-rose-700">{failCount}</span>
            <span className="text-xs text-rose-800 block font-semibold mt-1">KHÔNG ĐẠT</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-2xl font-bold text-slate-700">{naCount}</span>
            <span className="text-xs text-slate-800 block font-semibold mt-1">BỎ QUA / N.A</span>
          </div>
        </div>

        {inspection.note && (
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-700">
            <strong>Ghi chú kết luận cán bộ:</strong> {inspection.note}
          </div>
        )}

        {inspection.override_reason && (
          <div className="p-3 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
            <strong>Lý do ngoại lệ (Override):</strong> {inspection.override_reason}
          </div>
        )}
      </div>

      {/* Generated Findings (Section 24) */}
      <div className="civic-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Phát hiện vi phạm tại hiện trường ({findings.length})
          </h3>
          <span className="text-xs text-slate-400">Phân loại vận hành</span>
        </div>

        {findings.length === 0 ? (
          <div className="text-center py-6 text-emerald-700 text-sm font-medium bg-emerald-50 rounded border border-emerald-200">
            Tuyệt vời! Không ghi nhận vi phạm nào tại hiện trường.
          </div>
        ) : (
          <div className="space-y-3">
            {findings.map((f: any) => (
              <div key={f.id} className="p-4 rounded-lg border border-rose-200 bg-rose-50/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-900 text-sm">{f.finding}</span>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    f.severity === 'HIGH' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    MỨC ĐỘ: {f.severity}
                  </span>
                </div>
                <p className="text-slate-700">{f.staff_note}</p>
                {f.legal_section_number && (
                  <span className="inline-block text-[11px] font-mono text-dustguard-teal bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Đối chiếu: {f.legal_section_number} - {f.legal_heading}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <Link to={`/cases/${inspection.case_id}`}>
            <Button variant="outline">
              &larr; Về Hồ Sơ Vụ Việc
            </Button>
          </Link>

          {failCount > 0 && (
            <Link to={`/cases/${inspection.case_id}`}>
              <Button variant="primary" icon={<Wrench className="w-4 h-4" />}>
                Ban Hành Yêu Cầu Khắc Phục
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
