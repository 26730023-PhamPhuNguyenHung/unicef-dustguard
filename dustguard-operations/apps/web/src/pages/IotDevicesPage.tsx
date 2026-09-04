import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { Cpu, Activity, AlertCircle, Wifi, WifiOff, ShieldCheck, Clock, MapPin, ChevronRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export const IotDevicesPage: React.FC = () => {
  const { addToast } = useToast();
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  useEffect(() => {
    loadDevices();
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mạng lưới Cảm biến Quan trắc Bụi IoT</h1>
        <p className="text-sm text-slate-600">
          Theo dõi trạng thái trạm cảm biến hiện trường ESP32 + APM2000, kiểm soát chữ ký HMAC-SHA256 và phát hiện cảm biến chết lâm sàng (Flatline)
        </p>
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
          <div className="p-12 text-center text-slate-500">
            <p className="font-semibold text-slate-800">Không tìm thấy trạm quan trắc nào</p>
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
                    {dev.location_text || 'Chưa cập nhật vị trí'} ({dev.latitude.toFixed(4)}, {dev.longitude.toFixed(4)})
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
                      PM2.5: <span className="text-rose-600">{dev.latest_pm25 !== null ? dev.latest_pm25 : '--'}</span> µg/m³
                    </span>
                    <span className="text-xs text-slate-600">
                      PM10: {dev.latest_pm10 !== null ? dev.latest_pm10 : '--'}
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
    </div>
  );
};
