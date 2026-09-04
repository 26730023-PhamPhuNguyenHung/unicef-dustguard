import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { CaseCard } from '../components/common/CaseCard.js';
import { ReportCard } from '../components/common/ReportCard.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { Bookmark, FileText, Award, ArrowRight } from 'lucide-react';

export const MyTrackingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'saved' | 'reports' | 'contributions'>('saved');
  const [loading, setLoading] = useState(true);

  const [savedCases, setSavedCases] = useState<any[]>([]);
  const [myReports, setMyReports] = useState<any[]>([]);
  const [myContributions, setMyContributions] = useState<any[]>([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiRequest<any>('/me/saved').catch(() => []),
      apiRequest<any>('/me/reports').catch(() => []),
      apiRequest<any>('/me/contributions').catch(() => [])
    ])
      .then(([savedRes, repRes, contRes]) => {
        setSavedCases(Array.isArray(savedRes) ? savedRes : (savedRes.cases || []));
        setMyReports(Array.isArray(repRes) ? repRes : (repRes.reports || []));
        setMyContributions(Array.isArray(contRes) ? contRes : (contRes.contributions || []));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-content-main">
          Theo dõi của tôi
        </h1>
        <p className="text-xs sm:text-sm text-content-sub mt-1">
          Quản lý các vụ việc đã lưu, phản ánh bạn đã gửi và lịch sử đóng góp vì cộng đồng.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border-subtle gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Vụ việc đã lưu ({savedCases.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'reports'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          <FileText className="w-4 h-4" />
          Phản ánh đã gửi ({myReports.length})
        </button>
        <button
          onClick={() => setActiveTab('contributions')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'contributions'
              ? 'border-primary text-primary'
              : 'border-transparent text-content-sub hover:text-content-main'
          }`}
        >
          <Award className="w-4 h-4" />
          Lịch sử đóng góp ({myContributions.length})
        </button>
      </div>

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : (
        <div>
          {/* TAB 1: ĐÃ LƯU */}
          {activeTab === 'saved' && (
            <div>
              {savedCases.length === 0 ? (
                <EmptyState
                  title="Chưa có vụ việc nào được lưu"
                  description="Khi xem chi tiết các vấn đề quanh bạn, hãy bấm 'Lưu' để nhận thông báo tiến độ xử lý."
                  ctaText="Xem bản đồ vấn đề"
                  ctaLink="/map"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedCases.map((c) => (
                    <CaseCard key={c.id} caseData={c} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ĐÃ PHẢN ÁNH */}
          {activeTab === 'reports' && (
            <div>
              {myReports.length === 0 ? (
                <EmptyState
                  title="Bạn chưa gửi phản ánh nào"
                  description="Nếu thấy công trình phát sinh bụi mù mịt không che chắn, hãy gửi phản ánh đầu tiên để cộng đồng cùng hỗ trợ."
                  ctaText="Gửi phản ánh mới"
                  ctaLink="/reports/new"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myReports.map((r) => (
                    <ReportCard key={r.id} report={r} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ĐÃ ĐÓNG GÓP */}
          {activeTab === 'contributions' && (
            <div>
              {myContributions.length === 0 ? (
                <EmptyState
                  title="Chưa có ghi nhận đóng góp"
                  description="Mỗi lần bạn bấm 'Tôi cũng ghi nhận', gửi ảnh bổ sung hay hoàn thành nhiệm vụ đều được ghi nhận tại đây."
                />
              ) : (
                <div className="space-y-3">
                  {myContributions.map((ct) => (
                    <div
                      key={ct.id}
                      className="bg-surface-card p-4 rounded-xl border border-border-subtle shadow-xs flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-content-main capitalize">
                          {ct.type === 'confirmation' ? 'Đồng ghi nhận vụ việc' : (ct.type === 'observation' ? 'Bổ sung quan sát hiện trường' : 'Phản ánh ban đầu')}
                        </div>
                        <div className="text-[11px] text-content-sub">
                          Ngày ghi nhận: {new Date(ct.created_at || ct.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-state-success bg-emerald-50 px-2.5 py-1 rounded-md">
                        Đã ghi nhận
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
