import React, { useState } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Button } from '../common/Button';
import {
  Megaphone,
  MapPin,
  AlertTriangle,
  User,
  Phone,
  X,
  CheckCircle2,
} from 'lucide-react';

interface PublicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (signal: any) => void;
}

export const PublicReportModal: React.FC<PublicReportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationText, setLocationText] = useState('');
  const [district, setDistrict] = useState('Cầu Giấy');
  const [latitude, setLatitude] = useState(21.0285);
  const [longitude, setLongitude] = useState(105.8542);
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [urgency, setUrgency] = useState<'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'>('HIGH');
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !locationText.trim() || !district.trim()) {
      error('Thiếu thông tin', 'Vui lòng điền đầy đủ tiêu đề, vị trí và mô tả phản ánh.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.signals.publicReport({
        title: title.trim(),
        description: description.trim(),
        location_text: locationText.trim(),
        district: district.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
        reporter_name: reporterName.trim() || undefined,
        reporter_phone: reporterPhone.trim() || undefined,
        urgency,
      });

      success(
        'Tiếp nhận phản ánh thành công',
        `Mã phản ánh: ${res.signal.id}. Đã lưu vào cơ sở dữ liệu và chuyển cán bộ thụ lý.`
      );
      if (onSuccess) {
        onSuccess(res.signal);
      }
      onClose();
    } catch (err: any) {
      error('Lỗi gửi phản ánh', err.detail || 'Không thể ghi nhận phản ánh vào hệ thống');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-100">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-dustguard-red flex items-center justify-center">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Gửi Phản ánh Môi trường (Cộng đồng / Người dân)
              </h2>
              <p className="text-[11px] text-slate-500">Cổng tiếp nhận trực tiếp từ người dân không cần đăng nhập</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tiêu đề phản ánh hiện trường *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
              placeholder="ví dụ: Công trường xả bụi mù mịt không che chắn tại đường Xuân Thủy"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ hiện trường *
              </label>
              <input
                type="text"
                required
                value={locationText}
                onChange={e => setLocationText(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                placeholder="Số 136 đường Xuân Thủy"
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

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả chi tiết vi phạm *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
              placeholder="Mô tả hành vi: xe tải cơi nới không rửa lốp, vật liệu xây dựng để lộ thiên, gió thổi bụi dày đặc vào khu dân cư..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Họ tên người phản ánh (Tùy chọn)
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={e => setReporterName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                placeholder="Công dân ẩn danh"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại liên hệ
              </label>
              <input
                type="text"
                value={reporterPhone}
                onChange={e => setReporterPhone(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                placeholder="09xx.xxx.xxx"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mức độ cấp bách
              </label>
              <select
                value={urgency}
                onChange={e => setUrgency(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red bg-white"
              >
                <option value="LOW">Thấp (Theo dõi)</option>
                <option value="NORMAL">Bình thường</option>
                <option value="HIGH">Cao (Cần kiểm tra)</option>
                <option value="URGENT">Khẩn cấp (Gây cản trở giao thông/sức khỏe)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tọa độ GPS (Lat, Lng)
              </label>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={e => setLatitude(Number(e.target.value))}
                  className="px-2 py-1 border border-slate-200 rounded"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={e => setLongitude(Number(e.target.value))}
                  className="px-2 py-1 border border-slate-200 rounded"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
              className="font-semibold bg-dustguard-red hover:bg-red-700 text-white"
            >
              Gửi Phản ánh Hiện trường
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
