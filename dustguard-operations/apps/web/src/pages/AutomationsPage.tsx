import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Bot, CheckCircle2, XCircle, Clock, Zap, Shield, ToggleLeft, ToggleRight, AlertTriangle } from 'lucide-react';
import { Button } from '../components/common/Button';

export const AutomationsPage: React.FC = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'RULES' | 'RUNS'>('RULES');
  const [rules, setRules] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'RULES') loadRules();
    else loadRuns();
  }, [activeTab]);

  const loadRules = async () => {
    try {
      setLoading(true);
      const res: any = await api.automations.rules();
      const list = Array.isArray(res) ? res : res.rules || res.data || [];
      setRules(list);
    } catch (err: any) {
      addToast(err.detail || 'Không thể tải quy tắc tự động', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRuns = async () => {
    try {
      setLoading(true);
      const res: any = await api.automations.runs();
      const list = Array.isArray(res) ? res : res.runs || res.data || [];
      setRuns(list);
    } catch (err: any) {
      addToast(err.detail || 'Không thể tải nhật ký chạy quy tắc tự động', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRule = async (rule: any) => {
    try {
      const nextState = !rule.enabled;
      await api.automations.toggleRule(rule.id, nextState);
      addToast(`Đã ${nextState ? 'kích hoạt' : 'tạm dừng'} quy tắc "${rule.name}"`, 'success');
      loadRules();
    } catch (err: any) {
      addToast(err.detail || 'Không thể thay đổi trạng thái quy tắc', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trung tâm Tự động hóa Vận hành</h1>
        <p className="text-sm text-slate-600">
          Cấu hình quy tắc phản ứng tự động theo sự kiện nghiệp vụ (SLA 48h, thông báo quá hạn, cảnh báo trạm quan trắc mất kết nối)
        </p>
      </div>

      {/* Philosophy banner */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-emerald-950">
        <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold">Nguyên tắc Bất biến về Thẩm quyền và Trách nhiệm</p>
          <p className="text-emerald-800">
            Hệ thống tự động hóa chỉ được phép thực thi các hành động an toàn (Tạo nhiệm vụ rà soát, gửi thông báo hạn ngạch, kích hoạt bản nháp). <strong>Tuyệt đối không tự động ra phán quyết vi phạm pháp luật</strong> hoặc đóng hồ sơ thay con người.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('RULES')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'RULES'
              ? 'border-dustguard-red text-dustguard-red'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          Quy tắc kích hoạt ({rules.length})
        </button>

        <button
          onClick={() => setActiveTab('RUNS')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'RUNS'
              ? 'border-dustguard-red text-dustguard-red'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Nhật ký thực thi gần nhất
        </button>
      </div>

      {/* Content */}
      {activeTab === 'RULES' ? (
        <div className="civic-card divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Đang tải danh sách quy tắc...</div>
          ) : rules.length === 0 ? (
            <div className="p-12 text-center text-slate-500">Chưa có quy tắc tự động nào được thiết lập.</div>
          ) : (
            rules.map(r => {
              let actions: any[] = [];
              try {
                actions = typeof r.actions_json === 'string' ? JSON.parse(r.actions_json) : r.actions_json || [];
              } catch {}

              return (
                <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-sm font-bold text-slate-900">{r.name}</h3>
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded">
                        Sự kiện: {r.event_type}
                      </span>
                      {r.enabled ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded">
                          Đang bật
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded">
                          Đã tắt
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">{r.description}</p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <span className="text-slate-500 font-semibold">Hành động tự động:</span>
                      {actions.map((act: any, idx: number) => (
                        <span key={idx} className="font-mono text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {act.type}: {act.title || act.note || JSON.stringify(act)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <button
                      onClick={() => handleToggleRule(r)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors touch-target ${
                        r.enabled
                          ? 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {r.enabled ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                      {r.enabled ? 'Đang bật' : 'Tạm dừng'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="civic-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3">Quy tắc tự động</th>
                  <th className="px-4 py-3">Thực thể kích hoạt</th>
                  <th className="px-4 py-3">Kết quả thực thi</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Đang tải lịch sử thực thi...
                    </td>
                  </tr>
                ) : runs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Chưa có sự kiện tự động nào được ghi nhận.
                    </td>
                  </tr>
                ) : (
                  runs.map(run => (
                    <tr key={run.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {new Date(run.started_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900">{run.rule_name || run.rule_id}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">
                        {run.trigger_entity_type}: {run.trigger_entity_id}
                      </td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs truncate">
                        {run.result_json || 'Thực thi thành công tác vụ an toàn'}
                      </td>
                      <td className="px-4 py-3">
                        {run.status === 'SUCCESS' ? (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            THÀNH CÔNG
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-[10px] text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            THẤT BẠI
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
