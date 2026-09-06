import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { StatCard } from '../components/common/StatCard.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import {
  Users,
  FileText,
  Layers,
  CheckCircle2,
  HardDrive,
  ShieldAlert,
  BarChart2,
  TrendingUp,
  Database,
  Server,
  GitBranch
} from 'lucide-react';

export const AdminOverviewPage: React.FC = () => {
  const [statsData, setStatsData] = useState<any | null>(null);
  const [systemStatus, setSystemStatus] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest('/admin/stats').catch(console.error),
      apiRequest('/admin/system-status').catch(console.error)
    ])
      .then(([stats, sys]) => {
        if (stats) setStatsData(stats);
        if (sys) setSystemStatus(sys);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !statsData) return <LoadingSkeleton rows={4} />;

  const { stats, charts } = statsData;

  return (
    <div className="space-y-6">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4" />
            Bảng điều khiển hệ thống
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Tổng quan quản trị
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            Giám sát toàn diện người dùng, khối lượng dữ liệu phản ánh, tình trạng lưu trữ tệp và an toàn vận hành.
          </p>
        </div>
      </div>

      {/* 6 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Tổng người dùng"
          value={stats.totalUsers}
          icon={Users}
          color="#026AA2"
        />
        <StatCard
          title="Tổng phản ánh"
          value={stats.totalReports}
          icon={FileText}
          color="#B42318"
        />
        <StatCard
          title="Vụ việc đang theo dõi"
          value={stats.activeCases}
          icon={Layers}
          color="#F79009"
        />
        <StatCard
          title="Vụ việc đã giải quyết"
          value={stats.resolvedCases}
          icon={CheckCircle2}
          color="#027A48"
        />
        <StatCard
          title="Dung lượng tệp tải lên"
          value="14.5 MB"
          icon={HardDrive}
          color="#475467"
        />
        <StatCard
          title="Hàng đợi kiểm duyệt"
          value={stats.moderationBacklogCount || 0}
          icon={ShieldAlert}
          color="#D92D20"
        />
      </div>

      {/* Tăng trưởng người dùng & Hoạt động phản ánh */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 shadow-sm space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-content-main flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            Tăng trưởng người dùng tham gia
          </h3>

          <div className="space-y-3 pt-2">
            {charts.userGrowth && charts.userGrowth.map((g: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/40">
                <span className="text-xs font-bold text-content-main">Tháng {g.month}</span>
                <span className="text-xs font-extrabold text-primary font-mono">{g.users} tài khoản</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 shadow-sm space-y-4">
          <h3 className="text-sm sm:text-base font-bold text-content-main flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Khối lượng tín hiệu theo tháng
          </h3>

          <div className="space-y-3 pt-2">
            {charts.reportActivity && charts.reportActivity.map((r: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-surface-secondary/40">
                <span className="text-xs font-bold text-content-main">Tháng {r.month}</span>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-primary">{r.reports} phản ánh</span>
                  <span className="text-content-sub">{r.cases} vụ việc</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thông tin Trạng thái Hệ thống & Phiên bản (Mục 45-47) */}
      {systemStatus && (
        <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Trạng thái nền tảng Civic Tech
              </span>
              <h3 className="text-lg font-bold text-content-main mt-0.5">
                {systemStatus.productName} — Phiên bản {systemStatus.productVersion}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                ● CSDL {systemStatus.database?.status || 'ONLINE'}
              </span>
              <span className="text-xs font-mono text-content-sub bg-surface-secondary px-2 py-1 rounded">
                Build: {systemStatus.buildDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-lg border border-border-subtle bg-surface-secondary/30 space-y-1">
              <div className="text-xs font-semibold text-content-sub flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-primary" />
                Cơ sở dữ liệu SSOT
              </div>
              <div className="text-sm font-bold text-content-main">{systemStatus.database?.type}</div>
              <div className="text-xs text-content-sub font-mono">{systemStatus.database?.tablesCount} bảng quan hệ chuẩn hóa</div>
            </div>

            <div className="p-3.5 rounded-lg border border-border-subtle bg-surface-secondary/30 space-y-1">
              <div className="text-xs font-semibold text-content-sub flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-primary" />
                Đồng bộ liên thông Side B
              </div>
              <div className="text-sm font-bold text-content-main">Operations Webhook</div>
              <div className="text-xs text-content-sub font-mono">{systemStatus.crossSideSync?.protocol}</div>
            </div>

            <div className="p-3.5 rounded-lg border border-border-subtle bg-surface-secondary/30 space-y-1">
              <div className="text-xs font-semibold text-content-sub flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-primary" />
                Phiên bản cấu trúc (Schema)
              </div>
              <div className="text-sm font-bold text-content-main">Schema v{systemStatus.schemaVersion}</div>
              <div className="text-xs text-content-sub font-mono">Di chuyển lần cuối: {systemStatus.lastMigration?.substring(0, 10)}</div>
            </div>
          </div>

          {/* Changelog */}
          {systemStatus.changelog && systemStatus.changelog.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-content-sub mb-3">
                Lịch sử phiên bản phát hành (Changelog)
              </h4>
              <div className="space-y-2">
                {systemStatus.changelog.map((log: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-border-subtle bg-surface-secondary/20 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                        {log.version}
                      </span>
                      <span className="font-semibold text-content-main">{log.note}</span>
                    </div>
                    <div className="flex items-center gap-2 text-content-sub mt-1 sm:mt-0 font-mono">
                      <span>{log.type}</span>
                      <span>•</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
