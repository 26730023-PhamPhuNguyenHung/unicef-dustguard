import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Calendar, ClipboardCheck, MapPin } from 'lucide-react';
import { Button } from '../components/common/Button';

export const InspectionPlanPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // caseId
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

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

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [caseRes, tmplRes] = await Promise.all([
        id ? api.cases.get(id) : Promise.resolve(null),
        api.inspections.templates(),
      ]);

      if (caseRes) {
        setCaseData(caseRes.case);
        setForm(prev => ({
          ...prev,
          location_text: caseRes.case.location_text,
          template_id: tmplRes.templates[0]?.id || '',
        }));
      }
      setTemplates(tmplRes.templates);
    } catch (err: any) {
      error('Lỗi', err.detail);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      const res = await api.inspections.create(id, form);
      success('Lập kế hoạch kiểm tra thành công', 'Vụ việc đã chuyển sang trạng thái INSPECTION_PLANNED');
      navigate(`/cases/${id}`);
    } catch (err: any) {
      error('Lỗi tạo lịch kiểm tra', err.detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !caseData) {
    return <div className="civic-card p-12 text-center text-slate-400 text-sm">Đang tải...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to={`/cases/${id}`} className="text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <span className="font-mono text-xs font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
            {caseData.case_code}
          </span>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Lập Kế hoạch Kiểm tra Hiện trường</h1>
        </div>
      </div>

      <div className="civic-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
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
            <Link to={`/cases/${id}`}>
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
