import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Cpu, Activity, AlertCircle, Wifi, WifiOff, ShieldCheck, Clock, MapPin, ChevronRight, Plus, X } from 'lucide-react';
import { Button } from '../components/common/Button';

export const IotDevicesPage: React.FC = () => {
  const { addToast, success, error } = useToast();
  const [devices, setDevices] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [deviceCode, setDeviceCode] = useState('');
  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [locationText, setLocationText] = useState('');
  const [latitude, setLatitude] = useState(21.0285);
  const [longitude, setLongitude] = useState(105.8542);

  useEffect(() => {
    loadDevices();
    api.projects.list().then(res => setProjects(res.projects || [])).catch(() => {});
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const res: any = await api.iot.devices();
      const list = Array.isArray(res) ? res : res.devices || res.data || [];
      setDevices(list);
    } catch (err: any) {
      addToast(err.detail || 'Không thể tải danh sách trạm quan trắc IoT', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filtered = devices.filter(d => {
    if (filterStatus === 'ALL') return true;
    return d.status === filterStatus;
  });

  const countOnline = devices.filter(d => d.status === 'ONLINE').length;
  const countFaulty = devices.filter(d => d.status === 'FAULTY' || d.status === 'DEGRADED').length;
  const countOffline = devices.filter(d => d.status === 'OFFLINE').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Đang hoạt động
          </span>
        );
      case 'FAULTY':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Cảnh báo Flatline
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            Suy giảm tín hiệu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <WifiOff className="w-3.5 h-3.5 text-slate-500" />
            Mất kết nối
          </span>
        );
    }
  };

  const handleRegisterDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceCode.trim() || !name.trim() || !locationText.trim()) {
      error('Thiếu thông tin', 'Vui lòng nhập mã thiết bị, tên trạm đo và vị trí lắp đặt.');
      return;
    }

    setSubmitting(true);
    try {
      await api.iot.registerDevice({
        device_code: deviceCode.trim(),
        name: name.trim(),
        project_id: projectId || undefined,
        location_text: locationText.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
      });

      success('Đăng ký thành công', `Thiết bị ${deviceCode} đã được kết nối vào hệ thống.`);
      setModalOpen(false);
      setDeviceCode('');
      setName('');
      setLocationText('');
      loadDevices();
    } catch (err: any) {
      error('Lỗi đăng ký thiết bị', err.detail || 'Không thể tạo thiết bị IoT.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Cpu className="w-6 h-6 text-dustguard-teal" />
              Mạng lưới Cảm biến Quan trắc Bụi IoT
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Thử nghiệm Hiện trường (Hardware Pilot)
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Giai đoạn thử nghiệm kết nối thiết bị cảm biến bụi PM2.5 / PM10 (ESP32 + APM2000), kiểm soát xác thực chữ ký và cảnh báo suy giảm tín hiệu thực tế.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto font-bold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Đăng ký thiết bị IoT
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="civic-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Tổng thiết bị</p>
            <p className="text-xl font-bold text-slate-900">{devices.length}</p>
          </div>
        </div>

        <div className="civic-card p-4 flex items-center gap-3 border-l-4 border-l-emerald-500">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Wifi className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Trực tuyến</p>
            <p className="text-xl font-bold text-emerald-700">{countOnline}</p>
          </div>
        </div>

        <div className="civic-card p-4 flex items-center gap-3 border-l-4 border-l-rose-500">
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Lỗi / Flatline</p>
            <p className="text-xl font-bold text-rose-700">{countFaulty}</p>
          </div>
        </div>

        <div className="civic-card p-4 flex items-center gap-3 border-l-4 border-l-slate-400">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
            <WifiOff className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Mất tín hiệu</p>
            <p className="text-xl font-bold text-slate-700">{countOffline}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="civic-card p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Lọc trạng thái:</span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs">
            {['ALL', 'ONLINE', 'FAULTY', 'OFFLINE'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 font-medium transition-colors ${
                  filterStatus === st ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {st === 'ALL' ? 'Tất cả' : st === 'ONLINE' ? 'Trực tuyến' : st === 'FAULTY' ? 'Lỗi' : 'Mất kết nối'}
              </button>
            ))}
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Hiển thị <strong>{filtered.length}</strong> / {devices.length} trạm
        </div>
      </div>

      {/* Device Cards Table */}
      <div className="civic-card divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Đang tải danh sách trạm quan trắc...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800">Chưa có thiết bị IoT được kết nối</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hệ thống hỗ trợ kết nối mạng lưới trạm cảm biến đo bụi PM2.5/PM10 ngoài hiện trường và xác thực khóa chữ ký HMAC. Dữ liệu quan trắc được thu thập theo thời gian thực để đối chứng vi phạm.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={() => setModalOpen(true)} className="font-semibold">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Đăng ký thiết bị IoT ngay
              </Button>
            </div>
          </div>
        ) : (
          filtered.map(dev => (
            <div key={dev.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                    {dev.device_code}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{dev.name}</h3>
                  {getStatusBadge(dev.status)}
                  {dev.is_simulated === 1 ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded">
                      Mô phỏng phát triển
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-300 rounded">
                      Phần cứng thật
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {dev.location_text || 'Chưa cập nhật vị trí'} ({dev.latitude?.toFixed(4)}, {dev.longitude?.toFixed(4)})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Nhận gói tin cuối: {dev.last_seen_at ? new Date(dev.last_seen_at).toLocaleString('vi-VN') : 'Chưa có'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end md:self-center">
                <div className="text-right">
                  <p className="text-xs text-slate-500">Mẫu đọc gần nhất</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      PM2.5: <span className="text-rose-600">{dev.latest_pm25 !== null && dev.latest_pm25 !== undefined ? dev.latest_pm25 : 'N/A'}</span> µg/m³
                    </span>
                    <span className="text-xs text-slate-600">
                      PM10: {dev.latest_pm10 !== null && dev.latest_pm10 !== undefined ? dev.latest_pm10 : 'N/A'}
                    </span>
                  </div>
                </div>

                <Link to={`/iot/devices/${dev.id}`}>
                  <Button variant="outline" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                    Chi tiết
                  </Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Registration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-dustguard-teal" />
                Đăng ký Trạm Quan trắc IoT Mới
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterDevice} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã thiết bị (Device Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={deviceCode}
                    onChange={e => setDeviceCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="ví dụ: IOT-VN-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên trạm quan trắc *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                    placeholder="ví dụ: Trạm đo Cổng 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Công trình xây dựng liên kết
                </label>
                <select
                  value={projectId}
                  onChange={e => setProjectId(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red bg-white"
                >
                  <option value="">-- Chọn công trình (Tùy chọn) --</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vị trí lắp đặt chi tiết *
                </label>
                <input
                  type="text"
                  required
                  value={locationText}
                  onChange={e => setLocationText(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-dustguard-red"
                  placeholder="Cổng phụ hướng Tây đường Xuân Thủy"
                />
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
                  Lưu & Đăng ký Thiết bị
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
