import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import { evaluateYouthCredits, YouthCreditSummary } from '../utils/creditCalculator.js';
import { YouthCertificateModal } from '../components/modals/YouthCertificateModal.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  FileCheck,
  Printer,
  ChevronRight,
  Info,
} from 'lucide-react';

export const YouthCreditsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<YouthCreditSummary | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'pending'>('all');

  useEffect(() => {
    // Tải danh sách phản ánh & đóng góp của người dùng từ API
    apiRequest<any>('/contributions')
      .then((res) => {
        const contributions = Array.isArray(res) ? res : res.contributions || [];
        // Map sang định dạng tính toán
        const mapped = contributions.map((c: any) => ({
          id: c.id,
          code: c.code || `DG-${c.id.slice(0, 6).toUpperCase()}`,
          title: c.title || c.description || 'Hoạt động giám sát môi trường',
          type: c.type || 'report',
          hasEvidence: true,
          hasSiteLinked: true,
          isWithin50m: true,
          isBeforeAfter: c.is_before_after || false,
          status: c.status === 'accepted' ? 'RESOLVED' : c.status === 'rejected' ? 'REJECTED' : 'PENDING',
          createdAt: c.createdAt || c.created_at,
        }));

        const calculated = evaluateYouthCredits(mapped);
        setSummary(calculated);
      })
      .catch((err) => {
        console.warn('Lỗi lấy đóng góp:', err);
        setSummary(evaluateYouthCredits([]));
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredLogs = (summary?.logs || []).filter((log) => {
    if (activeTab === 'verified') return log.isVerified;
    if (activeTab === 'pending') return !log.isVerified;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <section className="bg-surface-card rounded-civic-lg p-6 sm:p-8 border border-border-subtle shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Chương trình Tín chỉ Sinh viên & Thanh niên
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main tracking-tight">
              Ví Tín Chỉ Rèn Luyện & Giờ Tình Nguyện
            </h1>
            <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
              Mỗi hoạt động giám sát, chụp ảnh đối chứng hiện trường và xác minh vi phạm môi trường đều được quy đổi ra giờ tình nguyện chuẩn hóa: <strong>20 giờ tình nguyện = 4.0 tín chỉ rèn luyện</strong>.
            </p>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setIsCertModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white text-xs font-extrabold rounded-civic hover:bg-primary-hover shadow-sm transition"
            >
              <Award className="w-4 h-4" />
              <span>Xem Giấy Chứng Nhận Điện Tử</span>
            </button>
          </div>
        </div>
      </section>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Giờ tình nguyện */}
        <div className="bg-surface-card rounded-civic-lg p-5 border border-border-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-content-sub">Giờ tình nguyện đã duyệt</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">
              {summary?.verifiedHours ?? 0} <span className="text-sm font-bold text-content-muted">/ 20h</span>
            </p>
            <span className="text-[11px] text-content-muted">
              Còn {summary?.hoursToNextMilestone ?? 20}h để đạt tối đa
            </span>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Quy đổi Tín chỉ rèn luyện */}
        <div className="bg-surface-card rounded-civic-lg p-5 border border-border-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-content-sub">Điểm tín chỉ rèn luyện</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-accent-green mt-1">
              {summary?.academicCredits ?? 0} <span className="text-sm font-bold text-content-muted">/ 4.0</span>
            </p>
            <span className="text-[11px] text-content-muted">Chuẩn đánh giá Đoàn / Hội sinh viên</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-accent-green">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Đang chờ thẩm tra */}
        <div className="bg-surface-card rounded-civic-lg p-5 border border-border-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-content-sub">Đang chờ xác minh</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-accent-amber mt-1">
              {summary?.pendingHours ?? 0} <span className="text-sm font-bold text-content-muted">giờ</span>
            </p>
            <span className="text-[11px] text-content-muted">Sẽ tự động cộng khi vụ việc giải quyết</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-accent-amber">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Progress Bar Section */}
      <section className="bg-surface-card rounded-civic-lg p-6 border border-border-subtle shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-content-main">
          <span>Tiến độ hoàn thành chứng nhận 20 giờ ({summary?.progressPercentage ?? 0}%)</span>
          <span className="text-primary">{summary?.verifiedHours ?? 0}h / 20h</span>
        </div>
        <div className="w-full h-3 bg-surface-ground rounded-full overflow-hidden border border-border-subtle">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${summary?.progressPercentage ?? 0}%` }}
          />
        </div>
        <p className="text-[11px] text-content-muted flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
          Điểm rèn luyện được xác nhận tự động bởi chữ ký mật mã Web Crypto SHA-256 đối với mọi ảnh chụp và định vị GPS tại hiện trường.
        </p>
      </section>

      {/* Activity Logs Table */}
      <section className="bg-surface-card rounded-civic-lg p-6 border border-border-subtle shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
          <div>
            <h2 className="text-base font-bold text-content-main">Nhật ký Hoạt động Đã Ghi Nhận</h2>
            <p className="text-xs text-content-sub">Lịch sử từng phản ánh, nhiệm vụ và đối chứng hiện trường của bạn.</p>
          </div>

          <div className="flex gap-2">
            {(['all', 'verified', 'pending'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-ground text-content-sub hover:text-content-main border border-border-subtle'
                }`}
              >
                {tab === 'all' ? 'Tất cả' : tab === 'verified' ? 'Đã xác nhận' : 'Đang duyệt'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-content-muted bg-surface-ground rounded-civic border border-border-subtle">
            Chưa có hoạt động nào trong danh mục này. Hãy nhận nhiệm vụ tại mục "Nhiệm vụ cộng đồng" để tích lũy giờ tình nguyện!
          </div>
        ) : (
          <div className="divide-y divide-border-subtle">
            {filteredLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-surface-ground text-content-main border border-border-subtle">
                      {log.code}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        log.isVerified
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {log.statusText}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-content-main">{log.title}</p>
                  <p className="text-[11px] text-content-muted">
                    Thời gian: {new Date(log.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-black text-primary">+{log.hours} giờ</span>
                  <p className="text-[10px] text-content-muted font-medium">Quy đổi: +{(log.hours * 0.2).toFixed(2)} tín chỉ</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Certificate Modal */}
      <YouthCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        userName={user?.fullName || 'Nguyễn Văn Thanh Niên'}
        userRole="Thanh niên Tình nguyện Môi trường DustGuard"
        verifiedHours={summary?.verifiedHours ?? 0}
        academicCredits={summary?.academicCredits ?? 0}
        totalActivitiesCount={summary?.logs?.length ?? 0}
      />
    </div>
  );
};

export default YouthCreditsPage;
