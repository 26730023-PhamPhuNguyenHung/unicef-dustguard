import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { StatusBadge } from '../components/case/StatusBadge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useToast } from '../context/ToastContext';
import {
  Search,
  Filter,
  MapPin,
  User,
  Plus,
  AlertCircle,
  Clock,
  Shield,
  FileCheck2,
  RefreshCw,
  RotateCcw,
  Building2,
} from 'lucide-react';
import { Case, Project } from '@dustguard-operations/shared';

const TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'new', label: 'Mới tiếp nhận' },
  { id: 'triaged', label: 'Chờ phân loại' },
  { id: 'my_cases', label: 'Được giao cho tôi' },
  { id: 'in_progress', label: 'Đang xử lý' },
  { id: 'pending_legal', label: 'Chờ pháp lý' },
  { id: 'pending_inspection', label: 'Chờ kiểm tra' },
  { id: 'pending_action', label: 'Chờ khắc phục' },
  { id: 'pending_reinspection', label: 'Chờ tái kiểm' },
  { id: 'ready_to_close', label: 'Sẵn sàng đóng' },
  { id: 'closed', label: 'Đã đóng' },
];

export const CaseInboxPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'all';

  const [cases, setCases] = useState<Case[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || '');
  const [selectedFlag, setSelectedFlag] = useState(searchParams.get('flag') || '');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { success, error } = useToast();

  // Form for manual new case creation
  const [newCaseForm, setNewCaseForm] = useState({
    title: '',
    description: '',
    location_text: '',
    district: 'Láng Thượng',
    latitude: 21.0205,
    longitude: 105.8078,
    source: 'MANUAL',
    contractor_name: '',
    priority: 'NORMAL',
    project_id: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCases();
  }, [searchParams]);

  useEffect(() => {
    api.projects.list().then(res => setProjects(res.projects || [])).catch(() => {});
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const res = await api.cases.list({
        tab: searchParams.get('tab') || undefined,
        search: searchParams.get('search') || undefined,
        district: searchParams.get('district') || undefined,
        flag: searchParams.get('flag') || undefined,
      });
      setCases(res.cases);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (searchTerm.trim()) next.set('search', searchTerm.trim());
    else next.delete('search');
    setSearchParams(next);
  };

  const handleTabChange = (tabId: string) => {
    const next = new URLSearchParams(searchParams);
    if (tabId === 'all') next.delete('tab');
    else next.set('tab', tabId);
    setSearchParams(next);
  };

  const handleFlagFilter = (flag: string) => {
    const next = new URLSearchParams(searchParams);
    if (selectedFlag === flag) {
      next.delete('flag');
      setSelectedFlag('');
    } else {
      next.set('flag', flag);
      setSelectedFlag(flag);
    }
    setSearchParams(next);
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.cases.create(newCaseForm);
      success('Tạo vụ việc thành công', `Hồ sơ ${res.case.case_code} đã được ghi nhận vào hệ thống.`);
      setCreateModalOpen(false);
      loadCases();
    } catch (err: any) {
      error('Lỗi tạo hồ sơ', err.detail || 'Vui lòng kiểm tra lại dữ liệu.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hộp việc Vụ việc Môi trường</h1>
          <p className="text-sm text-slate-600">
            Tổng cộng: <strong className="text-slate-800">{total}</strong> hồ sơ đang quản lý
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateModalOpen(true)}
        >
          Tạo Vụ việc Mới
        </Button>
      </div>

      {/* 10 Operational Tabs (Section 8) */}
      <div className="border-b border-slate-200 overflow-x-auto scrollbar-thin">
        <nav className="flex space-x-2 pb-px" aria-label="Tabs">
          {TABS.map(tab => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`whitespace-nowrap px-3.5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors touch-target ${
                  isActive
                    ? 'border-dustguard-red text-dustguard-red'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Search & Operational Flags Bar */}
      <div className="civic-card p-4 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Tìm theo mã DG-2026-XXXX, tên công trình, địa chỉ, nhà thầu..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-dustguard-red focus:border-dustguard-red outline-none"
            />
          </div>

          <Button type="submit" variant="secondary" size="md">
            Tìm kiếm
          </Button>

          {searchParams.toString() && (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => {
                setSearchTerm('');
                setSelectedFlag('');
                setSearchParams(new URLSearchParams());
              }}
            >
              Đặt lại bộ lọc
            </Button>
          )}
        </form>

        {/* Operational Flags (Section 8) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Cờ vận hành:
          </span>

          <button
            type="button"
            onClick={() => handleFlagFilter('unassigned')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              selectedFlag === 'unassigned'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Chưa phân công
          </button>

          <button
            type="button"
            onClick={() => handleFlagFilter('missing_evidence')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              selectedFlag === 'missing_evidence'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Thiếu bằng chứng
          </button>

          <button
            type="button"
            onClick={() => handleFlagFilter('overdue')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              selectedFlag === 'overdue'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Quá hạn xử lý
          </button>

          <button
            type="button"
            onClick={() => handleFlagFilter('open_actions')}
            className={`px-2.5 py-1 rounded-full border transition-colors ${
              selectedFlag === 'open_actions'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            Có yêu cầu đang xử lý
          </button>
        </div>
      </div>

      {/* Case List Table / Cards */}
      {loading ? (
        <div className="civic-card p-12 text-center text-slate-400 animate-pulse text-sm">
          Đang tải danh sách hồ sơ vụ việc...
        </div>
      ) : total === 0 && !searchTerm && !selectedFlag && currentTab === 'all' ? (
        <div className="civic-card p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6 text-dustguard-red" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Chưa có hồ sơ nào</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hệ thống vận hành bằng dữ liệu thực tế và chưa ghi nhận vụ việc môi trường nào. Bắt đầu bằng cách tạo hồ sơ vụ việc đầu tiên hoặc thêm công trình giám sát.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setCreateModalOpen(true)}
              className="font-bold shadow-xs"
            >
              Tạo hồ sơ đầu tiên
            </Button>
            <Link to="/projects">
              <Button variant="outline" size="sm" icon={<Building2 className="w-3.5 h-3.5" />}>
                Thêm công trình
              </Button>
            </Link>
          </div>
        </div>
      ) : cases.length === 0 ? (
        <div className="civic-card p-12 text-center text-slate-500">
          <p className="text-base font-semibold">Không tìm thấy vụ việc phù hợp</p>
          <p className="text-xs text-slate-400 mt-1">Thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.</p>
        </div>
      ) : (
        <div className="civic-card divide-y divide-slate-200 overflow-hidden">
          {cases.map(c => (
            <div
              key={c.id}
              className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-dustguard-red bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    {c.case_code}
                  </span>
                  <StatusBadge status={c.status} />

                  {c.flags?.unassigned && (
                    <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Chưa phân công
                    </span>
                  )}
                  {c.flags?.missing_evidence && (
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Thiếu ảnh
                    </span>
                  )}
                  {c.flags?.overdue && (
                    <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      Quá hạn
                    </span>
                  )}
                </div>

                <Link to={`/cases/${c.id}`}>
                  <h3 className="text-base font-bold text-slate-900 hover:text-dustguard-red transition-colors leading-snug">
                    {c.title}
                  </h3>
                </Link>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{c.location_text} ({c.district})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Thụ lý: <strong>{c.assigned_staff_name || 'Chưa giao'}</strong></span>
                  </div>
                  {c.contractor_name && (
                    <span>Nhà thầu: <strong>{c.contractor_name}</strong></span>
                  )}
                </div>
              </div>

              {/* Action right */}
              <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  {new Date(c.updated_at).toLocaleDateString('vi-VN')}
                </span>
                <Link to={`/cases/${c.id}`}>
                  <Button variant="outline" size="sm" className="font-semibold">
                    Xem chi tiết &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Manual Case */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Tạo Hồ Sơ Vụ Việc Mới"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 text-xs sm:text-sm">
          {/* Liên kết công trình / dự án đã đăng ký */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700">
                Công trình / Dự án liên quan
              </label>
              <Link
                to="/projects"
                className="text-xs text-dustguard-red hover:underline flex items-center gap-1 font-medium"
                onClick={() => setCreateModalOpen(false)}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>+ Thêm công trình mới</span>
              </Link>
            </div>
            <select
              value={newCaseForm.project_id}
              onChange={e => {
                const pId = e.target.value;
                const p = projects.find(proj => proj.id === pId);
                if (p) {
                  setNewCaseForm({
                    ...newCaseForm,
                    project_id: p.id,
                    location_text: p.address,
                    district: p.district,
                    contractor_name: p.contractor_name || newCaseForm.contractor_name,
                    latitude: p.latitude || newCaseForm.latitude,
                    longitude: p.longitude || newCaseForm.longitude,
                  });
                } else {
                  setNewCaseForm({ ...newCaseForm, project_id: '' });
                }
              }}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red bg-white"
            >
              <option value="">-- Chọn công trình đã đăng ký (hoặc nhập tự do bên dưới) --</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.address}, {p.district})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Tiêu đề vụ việc <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newCaseForm.title}
              onChange={e => setNewCaseForm({ ...newCaseForm, title: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
              placeholder="VD: Bụi phát tán từ công trường tháo dỡ..."
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mô tả chi tiết hiện trường <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={newCaseForm.description}
              onChange={e => setNewCaseForm({ ...newCaseForm, description: e.target.value })}
              className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
              placeholder="Mô tả mức độ bụi, ảnh hưởng dân cư kế cận..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Địa chỉ hiện trường <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newCaseForm.location_text}
                onChange={e => setNewCaseForm({ ...newCaseForm, location_text: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
                placeholder="Số nhà, tên đường..."
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phường / Xã (Hà Nội)</label>
              <input
                type="text"
                required
                value={newCaseForm.district}
                onChange={e => setNewCaseForm({ ...newCaseForm, district: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
                placeholder="VD: Láng Thượng"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tên nhà thầu / Đơn vị thi công</label>
              <input
                type="text"
                value={newCaseForm.contractor_name}
                onChange={e => setNewCaseForm({ ...newCaseForm, contractor_name: e.target.value })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red"
                placeholder="VD: Công ty CP Xây dựng..."
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mức độ ưu tiên</label>
              <select
                value={newCaseForm.priority}
                onChange={e => setNewCaseForm({ ...newCaseForm, priority: e.target.value as any })}
                className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-red bg-white"
              >
                <option value="LOW">Thấp (LOW)</option>
                <option value="NORMAL">Bình thường (NORMAL)</option>
                <option value="HIGH">Cao (HIGH)</option>
                <option value="URGENT">Khẩn cấp (URGENT)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCreateModalOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              Tạo và Lưu vào CSDL
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
