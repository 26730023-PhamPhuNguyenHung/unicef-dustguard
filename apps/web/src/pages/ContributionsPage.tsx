import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { ContributionSummaryModal } from '../components/modals/ContributionSummaryModal.js';
import { Award, CheckCircle2, FileText, Eye, ShieldCheck, Sparkles, Share2 } from 'lucide-react';

export const ContributionsPage: React.FC = () => {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  useEffect(() => {
    apiRequest<any>('/me/contributions')
      .then((res) => setContributions(Array.isArray(res) ? res : (res.timeline || res.contributions || [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalReports = contributions.filter((c) => c.type === 'report').length;
  const totalConfirms = contributions.filter((c) => c.type === 'confirmation').length;
  const totalObs = contributions.filter((c) => c.type === 'observation').length;
  const totalTasks = contributions.filter((c) => c.type === 'verification' || c.type === 'task').length;

  // Giờ tình nguyện quy đổi: mỗi phản ánh / quan sát / nhiệm vụ đóng góp thời gian
  const estimatedHours = Number(((totalReports * 1.5) + (totalConfirms * 0.2) + (totalObs * 1.0) + (totalTasks * 2.0)).toFixed(1));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Recognition Hero Banner */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Ghi nhận hành trình cộng đồng
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main mt-1">
              Hành trình đóng góp của bạn
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsCertModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-xs font-bold rounded-civic hover:bg-primary-hover shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Award className="w-4 h-4" />
            <span>Xem chứng nhận đóng góp</span>
          </button>
        </div>

        <div className="p-4 rounded-civic bg-surface-secondary/70 border border-border-subtle text-xs sm:text-sm text-content-main font-medium leading-relaxed">
          {contributions.length > 0 ? (
            <span>
              Cảm ơn bạn! Bạn đã tham gia đóng góp <strong className="text-primary font-bold">{contributions.length} tín hiệu</strong> xác thực với tổng cộng khoảng <strong className="text-primary font-bold">{estimatedHours} giờ</strong> tình nguyện ghi nhận, giúp cộng đồng có thêm căn cứ bảo vệ không khí sạch.
            </span>
          ) : (
            <span>
              Mỗi hành động nhỏ như gửi ảnh, bấm ghi nhận hay xác minh hiện trường đều mang lại giá trị thiết thực cho môi trường sống của chúng ta.
            </span>
          )}
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-civic bg-surface-secondary/50 border border-border-subtle text-center">
            <span className="text-[11px] font-semibold text-content-sub block mb-1">
              Phản ánh gửi đi
            </span>
            <div className="text-2xl font-extrabold text-content-main">{totalReports}</div>
          </div>
          <div className="p-4 rounded-civic bg-surface-secondary/50 border border-border-subtle text-center">
            <span className="text-[11px] font-semibold text-content-sub block mb-1">
              Lượt cùng ghi nhận
            </span>
            <div className="text-2xl font-extrabold text-primary">{totalConfirms}</div>
          </div>
          <div className="p-4 rounded-civic bg-surface-secondary/50 border border-border-subtle text-center">
            <span className="text-[11px] font-semibold text-content-sub block mb-1">
              Quan sát hiện trường
            </span>
            <div className="text-2xl font-extrabold text-content-main">{totalObs}</div>
          </div>
          <div className="p-4 rounded-civic bg-surface-secondary/50 border border-border-subtle text-center">
            <span className="text-[11px] font-semibold text-content-sub block mb-1">
              Nhiệm vụ hoàn thành
            </span>
            <div className="text-2xl font-extrabold text-[#1B7A4B]">{totalTasks}</div>
          </div>
        </div>
      </div>

      {/* Timeline đóng góp */}
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-content-main">
          Dòng thời gian đóng góp
        </h2>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : contributions.length === 0 ? (
          <EmptyState
            title="Chưa có dữ liệu đóng góp"
            description="Hãy tham gia gửi phản ánh hoặc bấm 'Tôi cũng ghi nhận' tại các vụ việc quanh bạn."
            ctaText="Xem bản đồ vấn đề"
            ctaLink="/map"
          />
        ) : (
          <div className="relative pl-6 border-l-2 border-border-subtle space-y-5 ml-2">
            {contributions.map((ct) => (
              <div key={ct.id} className="relative">
                <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-primary" />
                <div className="text-[11px] text-content-muted">
                  {new Date(ct.created_at || ct.createdAt).toLocaleString('vi-VN')}
                </div>
                <div className="text-sm font-bold text-content-main mt-0.5">
                  {ct.type === 'confirmation'
                    ? 'Đã bấm "Tôi cũng ghi nhận" một vấn đề môi trường'
                    : ct.type === 'observation'
                    ? 'Đã bổ sung hình ảnh & quan sát tại hiện trường'
                    : ct.type === 'report'
                    ? 'Đã tạo một phản ánh nguồn bụi mới'
                    : 'Đã hoàn thành xác minh nhiệm vụ cộng đồng'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Certificate Modal */}
      <ContributionSummaryModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        userName={user?.fullName || 'Thành viên Cộng đồng'}
        userRole={user?.role ? (user.role === 'community_member' ? 'Thành viên CLB Môi Trường' : 'Cư dân Tích cực') : 'Thành viên Cộng đồng'}
        totalActivities={contributions.length}
        contributionHours={estimatedHours}
        verifiedActivities={totalReports + totalObs + totalTasks}
        resolvedCasesCount={totalTasks}
        locationsCount={1}
      />
    </div>
  );
};

export default ContributionsPage;
