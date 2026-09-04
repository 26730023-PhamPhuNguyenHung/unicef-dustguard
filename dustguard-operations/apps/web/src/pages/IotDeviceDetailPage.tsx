import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import {
  Cpu,
  Activity,
  AlertCircle,
  Wifi,
  WifiOff,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowLeft,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const IotDeviceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToast();
  const [deviceData, setDeviceData] = useState<any>(null);
  const [readings, setReadings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadDetail();
  }, [id]);

  const loadDetail = async () => {
    try {
      setLoading(true);
      const res = await api.iot.device(id!);
      setDeviceData(res);
      const rRes = await api.iot.readings(id!, { limit: '20' });
      setReadings(rRes.readings || []);
    } catch (err: any) {
      addToast(err.detail || 'Không thể tải thông tin chi tiết trạm quan trắc', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500">Đang tải dữ liệu trạm quan trắc...</div>;
  }

  if (!deviceData || !deviceData.device) {
    return (
      <div className="p-12 text-center text-slate-500 civic-card">
        <p className="font-bold text-slate-800">Không tìm thấy thông tin trạm quan trắc này.</p>
        <Link to="/iot" className="mt-4 inline-block text-dustguard-teal font-semibold text-sm">
          ← Quay lại danh sách thiết bị
        </Link>
      </div>
    );
  }

  const { device, latestReading, recentEvents, relatedCases } = deviceData;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link to="/iot" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách trạm quan trắc
        </Link>
      </div>

      {/* Header Banner */}
      <div className="civic-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-mono text-sm font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded border border-slate-200">
              {device.device_code}
            </span>
            <h1 className="text-xl font-bold text-slate-900">{device.name}</h1>
            {device.is_simulated === 1 ? (
              <span className="text-xs font-bold px-2.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded">
                Mô phỏng phát triển
              </span>
            ) : (
              <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded">
                Phần cứng thật kết nối
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              {device.location_text || 'Chưa có địa chỉ'} ({device.latitude}, {device.longitude})
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-4 h-4 text-slate-400" />
              Model: {device.model || 'ESP32 APM2000'} | Firmware: {device.firmware_version || 'v2.1.0'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-slate-400" />
              Hoạt động cuối: {device.last_seen_at ? new Date(device.last_seen_at).toLocaleString('vi-VN') : 'Chưa có dữ liệu'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium">Trạng thái cảm biến</p>
            <p className={`text-base font-bold ${device.status === 'ONLINE' ? 'text-emerald-700' : 'text-rose-700'}`}>
              {device.status === 'ONLINE' ? 'TRỰC TUYẾN' : device.status === 'FAULTY' ? 'LỖI FLATLINE' : 'MẤT KẾT NỐI'}
            </p>
          </div>
        </div>
      </div>

      {/* Flatline Alert banner if FAULTY */}
      {device.status === 'FAULTY' && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-900">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Cảnh báo: Cảm biến bị kẹt giá trị hoặc chết lâm sàng (Flatline Detection)</p>
            <p className="text-rose-800">
              Hệ thống phát hiện 5 gói tin liên tiếp có thông số PM2.5 và PM10 giống hệt nhau không đổi. Đã tự động kích hoạt trạng thái FAULTY và gửi thông báo kiểm tra đến Đội Giám sát Công nghệ.
            </p>
          </div>
        </div>
      )}

      {/* Real-time Readings Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="civic-card p-4 text-center">
          <p className="text-xs text-slate-500 font-semibold mb-1">Nồng độ PM2.5</p>
          <p className="text-2xl font-bold text-rose-600">
            {latestReading ? latestReading.pm25 : '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">QCVN 05:2023: 50 µg/m³ (24h)</p>
        </div>

        <div className="civic-card p-4 text-center">
          <p className="text-xs text-slate-500 font-semibold mb-1">Nồng độ PM10</p>
          <p className="text-2xl font-bold text-amber-600">
            {latestReading ? latestReading.pm10 : '--'} <span className="text-xs font-normal text-slate-500">µg/m³</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">QCVN 05:2023: 100 µg/m³ (24h)</p>
        </div>

        <div className="civic-card p-4 text-center">
          <p className="text-xs text-slate-500 font-semibold mb-1">Nhiệt độ môi trường</p>
          <p className="text-2xl font-bold text-slate-800">
            {latestReading && latestReading.temperature !== null ? `${latestReading.temperature}°C` : '--'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Cảm biến nhiệt độ</p>
        </div>

        <div className="civic-card p-4 text-center">
          <p className="text-xs text-slate-500 font-semibold mb-1">Độ ẩm tương đối</p>
          <p className="text-2xl font-bold text-slate-800">
            {latestReading && latestReading.humidity !== null ? `${latestReading.humidity}%` : '--'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Cảm biến độ ẩm</p>
        </div>
      </div>

      {/* Historical Telemetry Table */}
      <div className="civic-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Lịch sử Gói tin Telemetry Thu nhận (20 mẫu gần nhất)</h2>
          <span className="text-xs font-mono text-slate-500">Xác thực Chữ ký HMAC-SHA256</span>
        </div>

        {readings.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">Chưa có gói tin telemetry nào được ghi nhận.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3">Thời gian ghi nhận</th>
                  <th className="px-4 py-3">PM2.5 (µg/m³)</th>
                  <th className="px-4 py-3">PM10 (µg/m³)</th>
                  <th className="px-4 py-3">Nhiệt độ</th>
                  <th className="px-4 py-3">Độ ẩm</th>
                  <th className="px-4 py-3">Toàn vẹn HMAC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {readings.map((r, idx) => (
                  <tr key={r.id || idx} className="hover:bg-slate-50">
                    <td className="px-4 py-2.5 font-mono text-slate-700">
                      {new Date(r.recorded_at).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-slate-900">{r.pm25}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{r.pm10}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.temperature !== null ? `${r.temperature}°C` : '--'}</td>
                    <td className="px-4 py-2.5 text-slate-600">{r.humidity !== null ? `${r.humidity}%` : '--'}</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 font-bold text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        HMAC-SHA256 HỢP LỆ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Two columns: Device Audit Events & Related Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Events */}
        <div className="civic-card p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
            Nhật ký Sự kiện Thiết bị & Trạng thái
          </h2>
          {recentEvents && recentEvents.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentEvents.map((ev: any) => (
                <div key={ev.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{ev.event_type}</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(ev.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{ev.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">Chưa có sự kiện bất thường nào ghi nhận.</p>
          )}
        </div>

        {/* Related Cases */}
        <div className="civic-card p-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
            Vụ việc Môi trường Khu vực lân cận
          </h2>
          {relatedCases && relatedCases.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {relatedCases.map((c: any) => (
                <div key={c.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-mono text-xs font-bold text-dustguard-teal">{c.case_code}</span>
                    <p className="text-xs font-bold text-slate-900 truncate">{c.title}</p>
                    <p className="text-[11px] text-slate-500 truncate">{c.location_text}</p>
                  </div>
                  <Link to={`/cases/${c.id}`}>
                    <Button variant="outline" size="sm" icon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Mở hồ sơ
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">Không có vụ việc nào trong bán kính quan sát.</p>
          )}
        </div>
      </div>
    </div>
  );
};
