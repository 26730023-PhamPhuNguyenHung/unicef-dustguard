import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { CommunityDashboardData } from '@dustguard/shared';
import { StatCard } from '../components/common/StatCard.js';
import { CaseCard } from '../components/common/CaseCard.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { FilePlus, MapPin, Clock, ArrowRight, ShieldAlert, CheckCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<CommunityDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest<CommunityDashboardData>('/dashboard/community')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <LoadingSkeleton rows={3} />;
  }

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary text-white rounded-civic-lg p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <span className="inline-block bg-white/20 text-white font-semibold text-xs px-3 py-1 rounded-full mb-3 backdrop-blur-none">
            Cộng đồng cùng hành động vì không khí sạch
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Không khí sạch bắt đầu từ tín hiệu nhỏ.
          </h1>
          <p className="text-white/90 text-sm sm:text-base mb-6 font-normal">
            Xem vấn đề đang được cộng đồng ghi nhận quanh bạn, cùng xác minh và theo dõi tiến độ xử lý minh bạch.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/reports/new"
              className="inline-flex items-center gap-2 bg-white text-primary font-bold text-sm px-5 py-2.5 rounded-lg shadow-sm hover:bg-surface-bg transition-colors"
            >
              <FilePlus className="w-4 h-4" />
              Gửi phản ánh
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 bg-primary-dark text-white border border-white/30 font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Xem bản đồ
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          label="Phản ánh mới"
          value={data.stats.newReports}
          accentColor="#D92D20"
          hint="Chờ đối chiếu thực địa"
        />
        <StatCard
          label="Đang xác minh"
          value={data.stats.verifyingCases}
          accentColor="#B54708"
          hint="Cần cộng đồng bổ sung"
        />
        <StatCard
          label="Đang xử lý"
          value={data.stats.inProgressCases}
          accentColor="#3538CD"
          hint="Đơn vị đã tiếp nhận"
        />
        <StatCard
          label="Đã cập nhật"
          value={data.stats.updatedToday}
          accentColor="#12B76A"
          hint="Tiến độ trong 24 giờ qua"
        />
      </div>

      {/* Grid: Gần bạn & Hoạt động gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Gần bạn (2 phần) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-content-main">Vấn đề gần bạn</h2>
              <p className="text-xs text-content-sub">Các điểm phát sinh bụi được ghi nhận tại địa bàn TP.HCM</p>
            </div>
            <Link
              to="/cases"
              className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1"
            >
              Xem tất cả
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.nearbyCases.slice(0, 4).map((c) => (
              <CaseCard key={c.id} caseData={c} />
            ))}
          </div>

          {/* Vụ việc ưu tiên đang xử lý */}
          <div className="pt-4">
            <h3 className="text-lg font-bold text-content-main mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-primary" />
              Cộng đồng đang theo dõi xử lý
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.priorityCases.map((c) => (
                <CaseCard key={c.id} caseData={c} />
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Hoạt động gần đây (1 phần) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-content-main">Hoạt động gần đây</h2>
          <div className="bg-surface-card rounded-civic border border-border-subtle p-5 shadow-sm space-y-4">
            {data.recentActivity.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs pb-3 border-b border-border-subtle last:border-0 last:pb-0">
                <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-content-main line-clamp-1">{act.title}</div>
                  <div className="text-content-sub line-clamp-2 mt-0.5">{act.description}</div>
                  <div className="text-[10px] text-content-muted mt-1">
                    {new Date(act.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {new Date(act.time).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tip card cộng đồng */}
          <div className="bg-surface-secondary/70 rounded-civic p-5 border border-border-subtle text-xs space-y-2">
            <div className="font-bold text-content-main flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-state-success" />
              Nguyên tắc đồng hành văn minh
            </div>
            <p className="text-content-sub leading-relaxed">
              Mỗi hình ảnh và nhận định thực địa của bạn giúp bức tranh chất lượng không khí trở nên chính xác và thuyết phục hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
