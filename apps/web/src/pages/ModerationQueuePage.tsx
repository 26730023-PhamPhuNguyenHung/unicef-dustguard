import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { Sliders, AlertTriangle, Check, EyeOff, Trash2, Clock } from 'lucide-react';

export const ModerationQueuePage: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueue = () => {
    setLoading(true);
    apiRequest<any[]>('/moderator/content')
      .then((res) => setReports(res || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (id: string, action: 'dismiss' | 'hide' | 'delete') => {
    try {
      await apiRequest(`/moderator/content/${id}/action`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      alert('Đã xử lý nội dung báo cáo thành công!');
      fetchQueue();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xử lý kiểm duyệt.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-surface-card rounded-civic-lg border border-border-subtle p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
            <Sliders className="w-4 h-4" />
            Hàng đợi kiểm duyệt
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-main">
            Kiểm duyệt nội dung bị báo cáo
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            Xem xét các bài viết hoặc bình luận bị cộng đồng gắn cờ nghi ngờ spam, ngôn từ tiêu cực hoặc vi phạm tính trung thực.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : reports.length === 0 ? (
        <EmptyState
          title="Hàng đợi trống"
          description="Hiện không có nội dung nào bị báo cáo hoặc cần điều phối viên can thiệp."
        />
      ) : (
        <div className="space-y-4">
          {reports.map((item) => (
            <div
              key={item.id}
              className="bg-surface-card rounded-civic border border-border-subtle p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 font-bold uppercase">
                  Lý do: {item.reason}
                </span>
                <span className="text-content-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(item.created_at || item.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-content-sub font-semibold">
                  Đối tượng bị báo cáo: <span className="text-content-main font-bold capitalize">{item.entity_type} (#{item.entity_id})</span>
                </div>
                {item.description && (
                  <p className="text-xs text-content-main bg-surface-secondary/50 p-3 rounded-lg border border-border-subtle">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-border-subtle flex items-center justify-end gap-2 text-xs">
                <button
                  onClick={() => handleAction(item.id, 'dismiss')}
                  className="px-3.5 py-2 rounded-xl text-content-sub hover:bg-surface-secondary font-semibold transition-colors inline-flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Bỏ qua
                </button>
                <button
                  onClick={() => handleAction(item.id, 'hide')}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold transition-colors inline-flex items-center gap-1"
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  Ẩn nội dung
                </button>
                <button
                  onClick={() => handleAction(item.id, 'delete')}
                  className="px-3.5 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-bold transition-colors inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa bỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
