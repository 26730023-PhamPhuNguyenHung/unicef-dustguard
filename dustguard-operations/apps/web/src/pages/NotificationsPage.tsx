import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Bell, Check, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.notifications.list();
      setNotifications(res.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.notifications.markRead(id);
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: 1 } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trung tâm Thông báo Vận hành</h1>
          <p className="text-sm text-slate-600">
            Thông báo điều phối vụ việc mới, yêu cầu thẩm tra pháp lý và nhắc lịch kiểm tra
          </p>
        </div>
      </div>

      {loading ? (
        <div className="civic-card p-12 text-center text-slate-400 text-sm animate-pulse">
          Đang tải thông báo...
        </div>
      ) : notifications.length === 0 ? (
        <div className="civic-card p-12 text-center text-slate-500 text-sm">
          Đồng chí không có thông báo nào.
        </div>
      ) : (
        <div className="civic-card divide-y divide-slate-200">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`p-4 flex items-start justify-between gap-3 text-xs transition-colors ${
                n.read === 0 ? 'bg-amber-50/30' : 'hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                  {n.read === 0 && (
                    <span className="w-2 h-2 rounded-full bg-dustguard-red inline-block" />
                  )}
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {n.type}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">{n.message}</p>
                <time className="text-slate-400 text-[11px] block">
                  {new Date(n.created_at).toLocaleString('vi-VN')}
                </time>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {n.link && (
                  <Link
                    to={n.link}
                    onClick={() => handleMarkRead(n.id)}
                    className="p-2 text-dustguard-red hover:bg-red-50 rounded-lg touch-target"
                    title="Đi tới vụ việc"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}
                {n.read === 0 && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg touch-target"
                    title="Đánh dấu đã đọc"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
