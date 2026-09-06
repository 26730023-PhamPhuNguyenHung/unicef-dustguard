import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Calendar, ClipboardCheck, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';

export const InspectionPlanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // caseId from route /cases/:id/inspection/new
  const [searchParams] = useSearchParams();
  const queryCaseId = searchParams.get('case_id') || '';
  const initialCaseId = id || queryCaseId;

  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId);
  const [availableCases, setAvailableCases] = useState<any[]>([]);
  const [caseData, setCaseData] = useState<any>(null);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    template_id: '',
    inspection_type: 'INITIAL',
    scheduled_date: new Date().toISOString().split('T')[0],
    location_text: '',
    note: '',
  });

  // Load templates & case list if needed
  useEffect(() => {
    loadInitial();
  }, []);

  // Load case data whenever selectedCaseId changes
  useEffect(() => {
    if (selectedCaseId) {
      loadCaseData(selectedCaseId);
    } else {
      setCaseData(null);
    }
  }, [selectedCaseId]);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const tmplRes = await api.inspections.templates();
      setTemplates(tmplRes.templates || []);
      if (tmplRes.templates?.length > 0) {
        setForm(prev => ({ ...prev, template_id: tmplRes.templates[0].id }));
      }

      if (!initialCaseId) {
        const casesRes = await api.cases.list({ limit: '100' });
        const list = casesRes.cases || [];
        setAvailableCases(list);
        if (list.length > 0) {
          setSelectedCaseId(list[0].id);
        }
      } else {
        setSelectedCaseId(initialCaseId);
      }
    } catch (err: any) {
      error('Lỗi', err.detail || 'Không thể tải dữ liệu ban đầu');
    } finally {
      setLoading(false);
    }
  };

  const loadCaseData = async (cid: string) => {
    try {
      const caseRes = await api.cases.get(cid);
      if (caseRes?.case) {
        setCaseData(caseRes.case);
        setForm(prev => ({
          ...prev,
          location_text: caseRes.case.location_text || '',
        }));
      }
    } catch (err: any) {
      error('Lỗi tải vụ việc', err.detail);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetCaseId = id || selectedCaseId;
    if (!targetCaseId) {
      error('Thiếu thông tin', 'Vui lòng chọn một vụ việc');
      return;
    }
    setSubmitting(true);
    try {
      await api.inspections.create(targetCaseId, form);
      success('Lập kế hoạch kiểm tra thành công', 'Vụ việc đã chuyển sang trạng thái INSPECTION_PLANNED');
      navigate(`/cases/${targetCaseId}/inspection`);
    } catch (err: any) {
      error('Lỗi tạo lịch kiểm tra', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="civic-card p-12 text-center text-slate-400 text-sm">Đang tải biểu mẫu...</div>;
  }

  const backLink = id ? `/cases/${id}` : (selectedCaseId ? `/cases/${selectedCaseId}` : '/inspections');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={backLink} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          {caseData && (
            <span className="font-mono text-xs font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
              {caseData.case_code}
            </span>
          )}
          <h1 className="text-xl font-bold text-slate-900 mt-1">Lập Kế hoạch Kiểm tra Hiện trường</h1>
        </div>
      </div>

      <div className="civic-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {!id && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Chọn vụ việc cần kiểm tra <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedCaseId}
                onChange={e => setSelectedCaseId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-dustguard-red"
              >
                <option value="">-- Chọn vụ việc --</option>
                {availableCases.map(c => (
                  <option key={c.id} value={c.id}>
                    [{c.case_code}] {c.title || c.location_text || 'Vụ việc không tên'} ({c.status})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Chọn mẫu biên bản kiểm tra <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.template_id}
              onChange={e => setForm({ ...form, template_id: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-dustguard-red"
            >
              {templates.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.items?.length || 0} tiêu chí chuẩn)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Loại đợt kiểm tra <span className="text-red-500">*</span>
              </label>
              <select
                value={form.inspection_type}
                onChange={e => setForm({ ...form, inspection_type: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-dustguard-red"
              >
                <option value="INITIAL">Kiểm tra ban đầu (INITIAL)</option>
                <option value="FOLLOW_UP">Theo dõi giám sát (FOLLOW_UP)</option>
                <option value="REINSPECTION">Tái kiểm tra khắc phục (REINSPECTION)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Ngày dự kiến kiểm tra <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.scheduled_date}
                onChange={e => setForm({ ...form, scheduled_date: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Địa điểm thực địa kiểm tra <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.location_text}
              onChange={e => setForm({ ...form, location_text: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Ghi chú yêu cầu chuẩn bị</label>
            <textarea
              rows={3}
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              placeholder="Yêu cầu mang theo máy đo bụi cá nhân, thiết bị định vị GPS..."
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Link to={backLink}>
              <Button type="button" variant="outline">
                Hủy
              </Button>
            </Link>
            <Button type="submit" variant="primary" loading={submitting}>
              Xác nhận Lập kế hoạch
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
