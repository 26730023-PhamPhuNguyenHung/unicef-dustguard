import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Settings, Save, ShieldCheck, Database, Cpu, Clock, Bot, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AdminSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [configs, setConfigs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const res = await api.admin.configs();
      setConfigs(res.configs || []);
      const initial: Record<string, string> = {};
      (res.configs || []).forEach((c: any) => {
        initial[c.key] = typeof c.value_json === 'string' ? c.value_json : JSON.stringify(c.value_json);
      });
      setEditValues(initial);
    } catch (err: any) {
      addToast(err.detail || 'Không thể tải cấu hình hệ thống', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (key: string) => {
    try {
      setSavingKey(key);
      const val = editValues[key];
      await api.admin.updateConfig(key, { value_json: val });
      addToast(`Đã lưu cấu hình tham số "${key}"`, 'success');
      loadConfigs();
    } catch (err: any) {
      addToast(err.detail || 'Không thể cập nhật cấu hình', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Cấu hình Hệ thống & Tham số Vận hành</h1>
        <p className="text-sm text-slate-600">
          Quản lý các ngưỡng cảnh báo nồng độ bụi thời gian thực, thời hạn giải quyết hồ sơ vụ việc, quy tắc đối soát pháp điển và tham số điều hành
        </p>
      </div>

      <div className="civic-card divide-y divide-slate-100">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải danh mục tham số cấu hình...</div>
        ) : configs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Không có cấu hình nào trong CSDL.</div>
        ) : (
          configs.map(cfg => (
            <div key={cfg.key} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-mono">{cfg.key}</h3>
                  <p className="text-xs text-slate-500">{cfg.description || 'Tham số hệ thống'}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  loading={savingKey === cfg.key}
                  onClick={() => handleSaveConfig(cfg.key)}
                  icon={<Save className="w-3.5 h-3.5" />}
                >
                  Lưu thay đổi
                </Button>
              </div>

              <div>
                <input
                  type="text"
                  value={editValues[cfg.key] || ''}
                  onChange={e => setEditValues({ ...editValues, [cfg.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono bg-slate-50 text-slate-900 focus:bg-white focus:ring-2 focus:ring-dustguard-red outline-none"
                />
              </div>

              <div className="text-[11px] text-slate-400">
                Cập nhật lần cuối: {cfg.updated_at ? new Date(cfg.updated_at).toLocaleString('vi-VN') : 'Mặc định'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
