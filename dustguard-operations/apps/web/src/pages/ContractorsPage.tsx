import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import {
  Building2,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';
import { PageHeader } from '../components/workspace';
import { Contractor } from '@dustguard-operations/shared';

export const ContractorsPage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxId, setTaxId] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const { success, error } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.contractors.list({ search: search.trim() || undefined });
      setContractors(res.contractors || []);
    } catch (err: any) {
      error('Lỗi tải dữ liệu', err.detail || 'Không thể tải danh sách nhà thầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      error('Thiếu tên nhà thầu', 'Vui lòng nhập tên công ty hoặc đơn vị thi công.');
      return;
    }

    setSubmitting(true);
    try {
      await api.contractors.create({
        name: name.trim(),
        contact_person: contactPerson.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        tax_id: taxId.trim() || undefined,
        address: address.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      success('Tạo nhà thầu thành công', `Đã thêm đơn vị "${name}" vào danh bạ.`);
      setModalOpen(false);
      setName('');
      setContactPerson('');
      setPhone('');
      setEmail('');
      setTaxId('');
      setAddress('');
      setNotes('');
      loadData();
    } catch (err: any) {
      error('Lỗi lưu nhà thầu', err.detail || 'Không thể lưu nhà thầu vào cơ sở dữ liệu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Standardized Page Header */}
      <PageHeader
        title="Danh bạ Đơn vị Thi công & Nhà thầu"
        description="Đơn vị chịu trách nhiệm tuân thủ quy chuẩn bảo vệ môi trường và thực hiện các biện pháp khắc phục vi phạm."
        badge={
          <span className="p-1.5 rounded-md bg-dustguard-redSoft text-dustguard-red">
            <Building2 className="w-4 h-4" />
          </span>
        }
        actions={
          <Button
            variant="primary"
            onClick={() => setModalOpen(true)}
            className="font-semibold shadow-xs"
            icon={<Plus className="w-4 h-4" />}
          >
            Thêm nhà thầu
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
            placeholder="Tìm kiếm nhà thầu theo tên, mã số thuế hoặc người liên hệ..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-dustguard-red"
          />
        </div>
        <div className="text-xs text-slate-500 shrink-0">
          Tổng số: <strong className="text-slate-800">{contractors.length}</strong> đơn vị
        </div>
      </div>

      {/* Table / Empty State */}
      <div className="civic-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Đang tải danh bạ nhà thầu...</div>
        ) : contractors.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Chưa có nhà thầu nào</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Cơ sở dữ liệu chưa có đơn vị thi công. Hãy đăng ký nhà thầu đầu tiên để phục vụ việc giao trách nhiệm pháp lý và ban hành biện pháp khắc phục môi trường.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} className="font-semibold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Thêm nhà thầu ngay
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3">Tên đơn vị / Doanh nghiệp</th>
                  <th className="py-2.5 px-3">Người liên hệ</th>
                  <th className="py-2.5 px-3">Điện thoại / Email</th>
                  <th className="py-2.5 px-3">Mã số thuế</th>
                  <th className="py-2.5 px-3">Địa chỉ trụ sở</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {contractors.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{c.id}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {c.contact_person || '—'}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="space-y-0.5">
                        {c.phone && (
                           <div className="flex items-center gap-1 text-slate-700">
                            <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{c.phone}</span>
                          </div>
                        )}
                        {c.email && (
                          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{c.email}</span>
                          </div>
                        )}
                        {!c.phone && !c.email && <span className="text-slate-400">—</span>}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      {c.tax_id || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {c.address ? (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{c.address}</span>
                        </div>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link to={`/cases?search=${encodeURIComponent(c.name)}`}>
                          <Button variant="outline" size="sm" className="text-[11px] h-7 px-2">
                            Xem vụ việc
                          </Button>
                        </Link>
                        <Link to={`/actions?status=OPEN`}>
                          <Button variant="secondary" size="sm" className="text-[11px] h-7 px-2">
                            Khắc phục
                          </Button>
                        </Link>
                      </div>
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 p-0 sm:p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] sm:max-h-[85vh] animate-in fade-in zoom-in-95 duration-100">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-dustguard-teal" />
                Thêm Nhà thầu / Đơn vị Mới
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg cursor-pointer"
                aria-label="Đóng cửa sổ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên đơn vị / Doanh nghiệp thi công *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                  placeholder="ví dụ: Công ty Cổ phần Xây dựng Thăng Long"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Người đại diện / Phụ trách
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="ví dụ: Trần Văn B"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã số thuế / ĐKKD
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={e => setTaxId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="0101234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="0912.345.xxx"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="contact@thanglong.vn"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Địa chỉ trụ sở chính
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                  placeholder="Số 45 phố Hoàng Quốc Việt, Cầu Giấy, Hà Nội"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                  placeholder="Lĩnh vực thi công, ghi chú liên lạc nội bộ..."
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 shrink-0 bg-white sticky bottom-0">
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
                  Lưu Nhà thầu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
