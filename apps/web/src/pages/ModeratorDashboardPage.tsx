import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { StatCard } from '../components/common/StatCard.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { CASE_STATUS_LABELS, CaseStatus } from '@dustguard/shared';
import {
  BarChart2,
  FileCheck,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Clock,
  TrendingUp,
  MapPin
} from 'lucide-react';

export const ModeratorDashboardPage: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/dashboard/moderator')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <LoadingSkeleton rows={4} />;

  const { stats, charts } = data;

  return (
    <div className="space-y-6">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4" />
            Điều hành & Thống kê
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Thống kê điều phối cộng đồng
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            Dữ liệu giám sát thời gian thực phục vụ công tác thẩm định, phân luồng và đánh giá hiệu quả giải quyết phản ánh.
          </p>
        </div>
      </div>

      {/* 5 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <StatCard
          title="Phản ánh hôm nay"
          value={stats.reportsToday}
          icon={Clock}
          color="#B42318"
        />
        <StatCard
          title="Cần thẩm định"
          value={stats.needsReview}
          icon={FileCheck}
          color="#B54708"
        />
        <StatCard
          title="Nghi vấn trùng"
          value={stats.possibleDuplicates}
          icon={AlertTriangle}
          color="#F79009"
        />
        <StatCard
          title="Vụ việc theo dõi"
          value={stats.activeCases}
          icon={Layers}
          color="#026AA2"
        />
        <StatCard
          title="Giải quyết tuần này"
          value={stats.resolvedThisWeek}
          icon={CheckCircle2}
          color="#027A48"
        />
      </div>

      {/* Bảng phân bổ theo quận huyện & Trạng thái */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Phân bổ theo Quận Huyện */}
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 shadow-sm space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-content-main flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Tình hình hoạt động theo địa bàn
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/60 text-content-sub uppercase border-b border-border-subtle">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Quận / Huyện</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Phản ánh</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Vụ việc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {charts.districtActivity && charts.districtActivity.map((d: any, idx: number) => (
                  <tr key={idx} className="hover:bg-surface-secondary/20">
                    <td className="py-2.5 px-3 font-bold text-content-main">{d.district}</td>
                    <td className="py-2.5 px-3 text-center text-primary font-semibold">{d.reports || 0}</td>
                    <td className="py-2.5 px-3 text-center text-content-sub font-semibold">{d.cases || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Phân bổ trạng thái vụ việc */}
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 shadow-sm space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-content-main flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Phân bổ trạng thái các vụ việc
          </h3>

          <div className="space-y-3 pt-2">
            {charts.statusDistribution && charts.statusDistribution.map((item: any, idx: number) => {
              const statusCfg = CASE_STATUS_LABELS[item.status as CaseStatus] || {
                label: item.status,
                color: '#475467',
                bg: '#F2F4F7'
              };
              return (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/40">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: statusCfg.color }} />
                    <span className="text-xs font-bold text-content-main">{statusCfg.label}</span>
                  </div>
                  <span className="text-xs font-extrabold text-content-main font-mono">
                    {item.count} vụ việc
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
