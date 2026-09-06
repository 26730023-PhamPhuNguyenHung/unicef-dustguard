import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import { evaluateContributionSummary, ContributionSummary, ContributionActivityLog } from '../utils/creditCalculator.js';
import { ContributionSummaryModal } from '../components/modals/ContributionSummaryModal.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import {
  Sparkles,
  Share2,
  Clock,
  CheckCircle2,
  Activity,
  MapPin,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  Filter,
  Check,
  Calendar,
  AlertCircle,
  FileText,
  ShieldCheck,
  Flame
} from 'lucide-react';

export const YouthCreditsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ContributionSummary | null>(null);
  const [backendStats, setBackendStats] = useState<any>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending'>('all');

  useEffect(() => {
    // Tải dữ liệu đóng góp thực tế từ API /me/contributions
    apiRequest<any>('/me/contributions')
      .then((res) => {
        const rawList = Array.isArray(res) ? res : res.timeline || res.contributions || [];
        const stats = res?.stats || null;
        setBackendStats(stats);

        // Map sang định dạng của Contribution Engine
        const mapped = rawList.map((c: any) => ({
          id: c.id,
          code: c.code || (c.id ? `DG-${c.id.slice(0, 6).toUpperCase()}` : 'DG-ACT-01'),
          title: c.title || c.comment || c.description || 'Hoạt động giám sát môi trường',
          type: c.type || 'report',
          typeLabel: c.typeLabel,
          hasEvidence: true,
          hasSiteLinked: true,
          isWithin50m: true,
          status: c.status || 'submitted',
          statusText: c.statusText,
          outcome: c.outcome,
          district: c.district || 'TP. Hồ Chí Minh',
          role: c.role,
          hours: c.contributionHours,
          createdAt: c.createdAt || c.created_at || new Date().toISOString(),
          caseId: c.caseId || c.case_id,
          caseStatus: c.caseStatus || c.case_status
        }));

        const calculated = evaluateContributionSummary(mapped);
        setSummary(calculated);
      })
      .catch((err) => {
        console.warn('Không thể tải lịch sử đóng góp:', err);
        setSummary(evaluateContributionSummary([]));
      })
      .finally(() => setLoading(false));
  }, []);

  const logs = summary?.logs || [];
  const filteredLogs = logs.filter((log) => {
    if (activeTab === 'verified') return log.isVerified;
    if (activeTab === 'pending') return !log.isVerified;
    return true;
  });

  // Số liệu hiển thị ưu tiên từ backend hoặc tính toán
  const totalActivitiesCount = backendStats?.totalActivities ?? summary?.totalActivities ?? 0;
  const contributionHoursCount = backendStats?.contributionHours ?? summary?.totalHours ?? 0;
  const verifiedActivitiesCount = backendStats?.verifiedActivities ?? summary?.verifiedCount ?? 0;
  const locationsCount = backendStats?.locationsCount ?? summary?.locationsCount ?? (summary?.locations?.length || 1);
  const resolvedCasesCount = backendStats?.resolvedCasesCount ?? summary?.resolvedCasesCount ?? 0;
  const locationsList = backendStats?.locations ?? summary?.locations ?? [];

  const handleScrollToActivities = () => {
    const el = document.getElementById('activities-log');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-200 pb-12">
      {/* 1. HERO SECTION MỚI — Tinh thần ghi nhận & tự hào cống hiến */}
      <section className="bg-white rounded-2xl p-6 sm:p-9 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0d6f64] bg-teal-50 px-3 py-1 rounded-full border border-teal-200/80 inline-flex items-center gap-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" /> DẤU ẤN CỦA BẠN CÙNG DUSTGUARD
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Bạn đã góp một phần vào những thay đổi này
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              DustGuard ghi lại những hoạt động bạn đã tham gia — từ gửi phản ánh, hỗ trợ xác minh đến các hoạt động cộng đồng — để bạn có thể nhìn lại và chia sẻ hành trình đóng góp của mình.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0d6f64] text-white text-xs font-bold rounded-xl hover:bg-[#0b5e55] shadow-xs transition min-h-[44px]"
            >
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ hành trình</span>
            </button>
            <button
              type="button"
              onClick={handleScrollToActivities}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100 transition min-h-[44px]"
            >
              <span>Xem hoạt động</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4 THẺ KPI ĐÓNG GÓP THỰC TẾ — Không /20h, Không /4.0, Không chấm điểm */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hoạt động đã tham gia */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Hoạt động đã tham gia</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Activity className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : `${totalActivitiesCount} hoạt động`}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">
              Phản ánh, xác minh và nhiệm vụ cộng đồng
            </p>
          </div>
        </div>

        {/* Card 2: Thời gian đóng góp */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Thời gian đóng góp</span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
              <Clock className="w-4 h-4 text-[#0d6f64]" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0d6f64] tracking-tight">
              {loading ? '...' : `${contributionHoursCount} giờ`}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">
              Thời gian được ghi nhận từ hoạt động thực tế
            </p>
          </div>
        </div>

        {/* Card 3: Đóng góp đã xác nhận */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Đóng góp đã xác nhận</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-emerald-800 tracking-tight">
              {loading ? '...' : `${verifiedActivitiesCount}`}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium">
              Hoạt động đã được hệ thống hoặc cộng đồng xác minh
            </p>
          </div>
        </div>

        {/* Card 4: Khu vực đã góp sức */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Khu vực đã góp sức</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <MapPin className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : `${locationsCount} địa bàn`}
            </p>
            <p className="text-[11px] text-slate-600 mt-1 font-medium truncate">
              {locationsList.length > 0 ? locationsList.join(', ') : 'Khu vực bạn đã tham gia thực tế'}
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION HÀNH TRÌNH CỦA BẠN — Reflection & Milestones thay thế Progress Bar */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3.5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Hành trình của bạn</h2>
            <p className="text-xs text-slate-600">
              Nhìn lại từng chặng đường bạn đã cùng DustGuard hành động vì môi trường.
            </p>
          </div>
          <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#0d6f64]" />
            <span>Hoạt động ghi nhận theo thời gian</span>
          </div>
        </div>

        {/* Milestone Steps Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className={`p-4 rounded-xl border transition ${
            totalActivitiesCount >= 1 ? 'bg-teal-50/70 border-teal-200 text-teal-950' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1">Mốc 1</span>
            <p className="text-xs font-bold text-slate-900">Bắt đầu tham gia</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Khởi tạo tài khoản & đồng hành cùng cộng đồng</p>
          </div>

          <div className={`p-4 rounded-xl border transition ${
            totalActivitiesCount >= 2 ? 'bg-teal-50/70 border-teal-200 text-teal-950' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1">Mốc 2</span>
            <p className="text-xs font-bold text-slate-900">Phản ánh đầu tiên</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Ghi lại nguồn bụi & ảnh chụp hiện trường</p>
          </div>

          <div className={`p-4 rounded-xl border transition ${
            totalActivitiesCount >= 4 ? 'bg-teal-50/70 border-teal-200 text-teal-950' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1">Mốc 3</span>
            <p className="text-xs font-bold text-slate-900">Đóng góp hiện trường</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Quan sát thực địa & đối chứng giải pháp</p>
          </div>

          <div className={`p-4 rounded-xl border transition ${
            verifiedActivitiesCount >= 5 ? 'bg-teal-50/70 border-teal-200 text-teal-950' : 'bg-slate-50 border-slate-200 text-slate-500'
          }`}>
            <span className="text-[10px] font-extrabold uppercase tracking-wider block mb-1">Mốc 4</span>
            <p className="text-xs font-bold text-slate-900">Cộng tác viên tích cực</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Từ 5 hoạt động được xác minh thực tế</p>
          </div>
        </div>

        {/* Tóm tắt tháng này */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#0d6f64]" />
            <span className="text-slate-800 font-semibold">Ghi nhận tháng này:</span>
            <span className="text-slate-600">
              <strong className="text-slate-900">{totalActivitiesCount} hoạt động</strong> · <strong className="text-[#0d6f64]">+{contributionHoursCount}h đóng góp</strong>
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">
            {resolvedCasesCount > 0
              ? `${resolvedCasesCount} vấn đề môi trường đã được xử lý xong!`
              : 'Đang tiếp tục theo dõi các tín hiệu hiện trường.'}
          </span>
        </div>
      </section>

      {/* 4. SECTION TỪ ĐÓNG GÓP ĐẾN TÁC ĐỘNG — Điểm WOW tôn vinh Outcome */}
      <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Từ đóng góp đến tác động</h2>
          <p className="text-xs text-slate-600">
            Những chuyển biến cụ thể mà các hoạt động của bạn đã góp phần thúc đẩy.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {backendStats?.reports ?? logs.filter(l => l.type === 'report').length}
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">Phản ánh đã gửi</p>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Phát hiện nguồn phát tán</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-2xl sm:text-3xl font-black text-emerald-800">
              {verifiedActivitiesCount}
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">Đã được xác minh</p>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Đủ căn cứ kỹ thuật</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#9f241f]">
              {resolvedCasesCount}
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">Vấn đề đã xử lý</p>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Khắc phục xong tại chỗ</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <p className="text-2xl sm:text-3xl font-black text-[#0d6f64]">
              {locationsCount}
            </p>
            <p className="text-xs font-bold text-slate-700 mt-1">Khu vực đã tham gia</p>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Phạm vi tác động</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic text-center sm:text-left pt-1">
          Dữ liệu hoàn toàn dựa trên các sự kiện và vụ việc thực tế ghi nhận qua hệ thống đối soát của DustGuard.
        </p>
      </section>

      {/* 5. NHẬT KÝ HOẠT ĐỘNG: NHỮNG VIỆC BẠN ĐÃ GÓP SỨC */}
      <section id="activities-log" className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3.5">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Những việc bạn đã góp sức</h2>
            <p className="text-xs text-slate-600">Mỗi hoạt động dưới đây là một phần trong hành trình đóng góp của bạn.</p>
          </div>

          {/* Filter tabs: Tất cả, Đã xác minh, Đang xử lý */}
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
            {[
              { key: 'all', label: 'Tất cả' },
              { key: 'verified', label: 'Đã xác minh' },
              { key: 'pending', label: 'Đang xử lý' }
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-slate-700">Chưa có hoạt động nào trong danh mục này</p>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
              Hãy tham gia gửi phản ánh hoặc nhận nhiệm vụ khảo sát thực địa để ghi nhận đóng góp của bạn vào hồ sơ!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredLogs.map((log) => {
              const targetUrl = log.caseId
                ? `/cases/${log.caseId}`
                : (log.type === 'report' && log.id ? `/reports/${log.id}` : null);

              return (
                <div key={log.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {log.code}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-[#0d6f64] border border-teal-200">
                        {log.typeLabel}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.isVerified
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {log.statusText}
                      </span>
                      {log.district && (
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                          <MapPin className="w-3 h-3 text-slate-400" /> {log.district}
                        </span>
                      )}
                    </div>

                    {targetUrl ? (
                      <Link
                        to={targetUrl}
                        className="text-sm font-bold text-slate-900 hover:text-[#0d6f64] hover:underline leading-snug inline-flex items-center gap-1 group"
                        title="Xem chi tiết hồ sơ"
                      >
                        <span>{log.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#0d6f64] opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                    ) : (
                      <p className="text-sm font-bold text-slate-900 leading-snug">
                        {log.title}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      <span className="text-slate-400 font-normal">Kết quả: </span>
                      {log.outcome || 'Đang được theo dõi và cập nhật tiến độ.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span>Thời gian: {new Date(log.createdAt).toLocaleString('vi-VN')}</span>
                      <span>·</span>
                      <span>Vai trò: {log.role}</span>
                      {targetUrl && (
                        <>
                          <span>·</span>
                          <Link to={targetUrl} className="text-[#0d6f64] font-semibold hover:underline">
                            Xem chi tiết →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0 pt-1 sm:pt-0">
                    <span className="text-base font-black text-[#0d6f64]">+{log.hours} giờ</span>
                    <p className="text-[10px] text-slate-500 font-medium">Thời gian đóng góp thực tế</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 6. MODAL BẢN TỔNG KẾT ĐÓNG GÓP — Sharing Card & Privacy Controls */}
      <ContributionSummaryModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        userName={user?.fullName || 'Thành viên DustGuard'}
        userRole={user?.role === 'citizen' ? 'Công dân giám sát môi trường' : 'Tình nguyện viên DustGuard'}
        totalActivities={totalActivitiesCount}
        contributionHours={contributionHoursCount}
        verifiedActivities={verifiedActivitiesCount}
        resolvedCasesCount={resolvedCasesCount}
        locationsCount={locationsCount}
        locations={locationsList}
        recentActivities={logs.map(l => ({
          code: l.code,
          typeLabel: l.typeLabel,
          title: l.title,
          district: l.district,
          hours: l.hours,
          isVerified: l.isVerified,
          createdAt: l.createdAt
        }))}
      />
    </div>
  );
};

export default YouthCreditsPage;
