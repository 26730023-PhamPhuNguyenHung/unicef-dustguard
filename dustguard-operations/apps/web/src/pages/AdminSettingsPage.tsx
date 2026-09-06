import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Settings, Save, ShieldCheck, Database, Cpu, Clock, Bot, AlertCircle, Server, GitBranch } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AdminSettingsPage: React.FC = () => {
  const { addToast } = useToast();
  const [configs, setConfigs] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [configRes, statusRes] = await Promise.all([
        api.admin.configs().catch(() => ({ configs: [] })),
        api.admin.systemStatus().catch(() => null)
      ]);
      setConfigs(configRes.configs || []);
      if (statusRes) setSystemStatus(statusRes);
      const initial: Record<string, string> = {};
      (configRes.configs || []).forEach((c: any) => {
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
      loadData();
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

      {/* Thông tin Trạng thái Hệ thống & Phiên bản (Mục 45-47) */}
      {systemStatus && (
        <div className="civic-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-dustguard-red flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5" />
                Trung tâm Chỉ huy Vận hành
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {systemStatus.productName} — Phiên bản {systemStatus.productVersion}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                ● CSDL {systemStatus.database?.status || 'ONLINE'}
              </span>
              <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                Build: {systemStatus.buildDate}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-dustguard-red" />
                Cơ sở dữ liệu SSOT
              </div>
              <div className="text-sm font-bold text-slate-900">{systemStatus.database?.type}</div>
              <div className="text-xs text-slate-500 font-mono">{systemStatus.database?.tablesCount} bảng quan hệ chuẩn hóa</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-dustguard-red" />
                Đồng bộ liên thông Side A
              </div>
              <div className="text-sm font-bold text-slate-900">Community Webhook</div>
              <div className="text-xs text-slate-500 font-mono">{systemStatus.crossSideSync?.protocol}</div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1">
              <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-dustguard-red" />
                Phiên bản cấu trúc (Schema)
              </div>
              <div className="text-sm font-bold text-slate-900">Schema v{systemStatus.schemaVersion}</div>
              <div className="text-xs text-slate-500 font-mono">Di chuyển: {systemStatus.lastMigration?.substring(0, 10)}</div>
            </div>
          </div>

          {/* Changelog */}
          {systemStatus.changelog && systemStatus.changelog.length > 0 && (
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Lịch sử phiên bản phát hành (Changelog)
              </h4>
              <div className="space-y-2">
                {systemStatus.changelog.map((log: any, idx: number) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/30 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-dustguard-red px-2 py-0.5 rounded bg-red-50">
                        {log.version}
                      </span>
                      <span className="font-semibold text-slate-800">{log.note}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 mt-1 sm:mt-0 font-mono">
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
