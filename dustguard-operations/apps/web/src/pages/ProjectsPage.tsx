import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import {
  HardHat,
  Plus,
  Search,
  Building2,
  MapPin,
  Calendar,
  X,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { Project, Contractor } from '@dustguard-operations/shared';
import { PageHeader } from '../components/workspace';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Cầu Giấy');
  const [contractorId, setContractorId] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [latitude, setLatitude] = useState(21.0285);
  const [longitude, setLongitude] = useState(105.8542);
  const [status, setStatus] = useState<'PLANNING' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED'>('ACTIVE');
  const [notes, setNotes] = useState('');

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const [projRes, contRes] = await Promise.all([
        api.projects.list({ search: search.trim() || undefined }),
        api.contractors.list(),
      ]);
      setProjects(projRes.projects || []);
      setContractors(contRes.contractors || []);
    } catch (err: any) {
      error('Lỗi tải dữ liệu', err.detail || 'Không thể tải danh sách công trình');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !district.trim()) {
      error('Thiếu thông tin bắt buộc', 'Vui lòng nhập đầy đủ tên công trình, địa chỉ và quận/huyện.');
      return;
    }

    setSubmitting(true);
    try {
      await api.projects.create({
        name: name.trim(),
        code: code.trim() || undefined,
        address: address.trim(),
        district: district.trim(),
        province: 'Hà Nội',
        contractor_id: contractorId || undefined,
        owner_name: ownerName.trim() || undefined,
        latitude: Number(latitude),
        longitude: Number(longitude),
        status,
        notes: notes.trim() || undefined,
      });

      success('Tạo công trình thành công', `Đã thêm công trình "${name}" vào hệ thống.`);
      setModalOpen(false);
      // Reset form
      setName('');
      setCode('');
      setAddress('');
      setOwnerName('');
      setNotes('');
      loadData();
    } catch (err: any) {
      error('Lỗi tạo công trình', err.detail || 'Không thể lưu công trình vào cơ sở dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (st: string) => {
    switch (st) {
      case 'ACTIVE':
        return <span className="civic-badge bg-emerald-100 text-emerald-800 border-emerald-200">Đang thi công</span>;
      case 'PLANNING':
        return <span className="civic-badge bg-blue-100 text-blue-800 border-blue-200">Chuẩn bị</span>;
      case 'SUSPENDED':
        return <span className="civic-badge bg-red-100 text-red-800 border-red-200">Tạm đình chỉ</span>;
      case 'COMPLETED':
        return <span className="civic-badge bg-slate-100 text-slate-700 border-slate-200">Đã hoàn thành</span>;
      default:
        return <span className="civic-badge bg-slate-100 text-slate-700">{st}</span>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Standardized Page Header */}
      <PageHeader
        title="Quản lý Công trình & Dự án Xây dựng"
        description="Danh mục công trường xây dựng, nguồn phát sinh bụi và đối tượng giám sát theo thời gian thực."
        badge={
          <span className="p-1.5 rounded-md bg-dustguard-redSoft text-dustguard-red">
            <HardHat className="w-4 h-4" />
          </span>
        }
        actions={
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
            className="font-semibold shadow-xs"
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm công trình
          </Button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="civic-card p-3 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm kiếm công trình theo tên, mã hoặc địa chỉ..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-dustguard-red"
          />
        </div>
        <div className="text-xs text-slate-500 shrink-0">
          Tổng số: <strong className="text-slate-800">{projects.length}</strong> công trình
        </div>
      </div>

      {/* Projects Table / Empty State */}
      <div className="civic-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Đang tải dữ liệu công trình...</div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <HardHat className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Chưa có công trình nào</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cơ sở dữ liệu chưa có công trường xây dựng. Hãy đăng ký công trình đầu tiên để liên kết với phản ánh người dân, kế hoạch kiểm tra hiện trường và thiết bị đo IoT.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} className="font-semibold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Thêm công trình ngay
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3">Mã / Tên công trình</th>
                  <th className="py-2.5 px-3">Địa chỉ & Quận</th>
                  <th className="py-2.5 px-3">Nhà thầu thi công</th>
                  <th className="py-2.5 px-3">Chủ đầu tư</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3">Tọa độ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {projects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{p.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.code || p.id}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{p.address}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{p.district}, {p.province || 'Hà Nội'}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      {p.contractor_name ? (
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{p.contractor_name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Chưa chỉ định</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {p.owner_name || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      {getStatusBadge(p.status)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {p.latitude && p.longitude ? `${p.latitude.toFixed(4)}, ${p.longitude.toFixed(4)}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-dustguard-red" />
                Thêm Công trình Xây dựng Mới
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên công trình / Dự án *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                  placeholder="ví dụ: Dự án Cải tạo Thoát nước & Hạ tầng Cầu Giấy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã dự án (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="ví dụ: DA-CG-2026-01"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái thi công
                  </label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red bg-white"
                  >
                    <option value="ACTIVE">Đang thi công (ACTIVE)</option>
                    <option value="PLANNING">Chuẩn bị (PLANNING)</option>
                    <option value="SUSPENDED">Tạm đình chỉ (SUSPENDED)</option>
                    <option value="COMPLETED">Đã hoàn thành (COMPLETED)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa chỉ hiện trường *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="Số 123 đường Xuân Thủy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quận / Huyện *
                  </label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="Cầu Giấy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Đơn vị thi công / Nhà thầu
                  </label>
                  <select
                    value={contractorId}
                    onChange={e => setContractorId(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red bg-white"
                  >
                    <option value="">-- Chưa chỉ định nhà thầu --</option>
                    {contractors.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chủ đầu tư (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="Ban Quản lý Dự án Đô thị"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vĩ độ (Latitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={e => setLatitude(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-dustguard-red"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kinh độ (Longitude)
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={e => setLongitude(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-dustguard-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú hiện trường
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                  placeholder="Quy mô công trường, biện pháp che chắn bụi hiện có..."
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={submitting}
                  className="font-semibold"
                >
                  Lưu Công trình
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
