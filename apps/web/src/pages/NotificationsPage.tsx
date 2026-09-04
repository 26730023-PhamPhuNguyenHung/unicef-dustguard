import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton.js';
import { EmptyState } from '../components/common/EmptyState.js';
import { Bell, Check, CheckCheck, Clock, Layers, MessageSquare, AlertCircle } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    setLoading(true);
    apiRequest<any>('/notifications')
      .then((res) => setNotifications(Array.isArray(res) ? res : (res.notifications || [])))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1, isRead: true } : n))
      );
    } catch (err) {
      console.warn('Lỗi đánh dấu đã đọc:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiRequest('/notifications/read-all', { method: 'POST' });
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: 1, isRead: true }))
      );
    } catch (err) {
      console.warn('Lỗi đánh dấu tất cả đã đọc:', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read && !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-content-main">
            Thông báo cộng đồng
          </h1>
          <p className="text-xs sm:text-sm text-content-sub mt-0.5">
            Cập nhật tiến độ các vụ việc và nhiệm vụ bạn đang theo dõi.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-gray-200 text-content-main text-xs font-semibold transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-primary" />
            Đọc tất cả ({unreadCount})
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : notifications.length === 0 ? (
        <EmptyState
          title="Không có thông báo nào"
          description="Khi vụ việc bạn lưu hoặc phản ánh có diễn biến mới, bạn sẽ nhận được thông tin tại đây."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => {
            const isRead = !!(n.is_read || n.isRead);
            const targetLink =
              n.entity_type === 'case'
                ? `/cases/${n.entity_id}`
                : n.entity_type === 'report'
                ? `/reports/${n.entity_id}`
                : n.entity_type === 'task'
                ? '/tasks'
                : '/dashboard';

            return (
              <div
                key={n.id}
                className={`p-4 rounded-civic border transition-all flex items-start justify-between gap-3 ${
                  isRead
                    ? 'bg-surface-card border-border-subtle opacity-80'
                    : 'bg-white border-primary/30 shadow-xs ring-1 ring-primary/10'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isRead ? 'bg-surface-secondary text-content-sub' : 'bg-primary-light text-primary'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <Link to={targetLink} onClick={() => handleMarkAsRead(n.id)}>
                      <h3 className="text-sm font-bold text-content-main hover:text-primary transition-colors">
                        {n.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-content-sub leading-relaxed">
                      {n.message}
                    </p>
                    <div className="text-[10px] text-content-muted flex items-center gap-1 pt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(n.created_at || n.createdAt).toLocaleString('vi-VN')}
                    </div>
                  </div>
                </div>

                {!isRead && (
                  <button
                    onClick={(e) => handleMarkAsRead(n.id, e)}
                    className="p-1 text-content-muted hover:text-primary"
                    title="Đánh dấu đã đọc"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
