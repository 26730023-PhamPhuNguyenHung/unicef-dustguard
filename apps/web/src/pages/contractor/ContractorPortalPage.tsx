import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../../api/client.js';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton.js';
import {
  Building2,
  HardHat,
  ClipboardList,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Search,
  ExternalLink,
  MapPin,
  RefreshCw,
  Phone,
} from 'lucide-react';

export const ContractorPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const query = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await apiRequest(`/contractor/dashboard${query}`);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu cổng nhà thầu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const contractor = data?.contractor || null;

  const actions: any[] = data?.actions || [];
  const openCount = data?.open_actions ?? actions.filter((a) => a.status === 'OPEN' || a.status === 'IN_PROGRESS').length;
  const submittedCount = data?.submitted_actions ?? actions.filter((a) => a.status === 'SUBMITTED').length;
  const verifiedCount = data?.verified_actions ?? actions.filter((a) => a.status === 'VERIFIED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Contractor Identity Card */}
      <section className="bg-surface-card rounded-civic-lg p-6 sm:p-7 border border-border-subtle shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5" /> Cổng Đơn vị Thi công
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-surface-ground text-content-sub border border-border-subtle">
                MST: {contractor?.tax_id || 'Đang cập nhật'}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-content-main leading-snug">
              {contractor?.name || 'Cổng Thông Tin Đơn Vị Thi Công & Giám Sát'}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-content-sub pt-1">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-content-muted" /> Đại diện: {contractor?.contact_person || 'Ban Chỉ huy Công trường'}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-content-muted" /> Hotline: {contractor?.phone || '1900 6868'}
              </span>
            </div>
          </div>

          {/* Quick Search Box */}
          <div className="flex items-center gap-2 bg-surface-ground p-1.5 rounded-civic border border-border-subtle w-full lg:w-80">
            <Search className="w-4 h-4 text-content-muted ml-2 shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadData(searchTerm)}
              placeholder="Tìm theo nhà thầu, MST, công trình..."
              className="bg-transparent border-none text-xs text-content-main placeholder:text-content-muted focus:outline-none w-full"
            />
            <button
              type="button"
              onClick={() => loadData(searchTerm)}
              className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-md hover:bg-primary-hover transition shrink-0"
            >
              Tìm
            </button>
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-card rounded-civic-lg p-5 border border-border-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-content-sub">Cần xử lý gấp</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-accent-red mt-1">{openCount}</p>
            <span className="text-[11px] text-content-muted">Yêu cầu chưa hoàn thành</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-accent-red">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface-card rounded-civic-lg p-5 border border-border-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-content-sub">Đang chờ nghiệm thu</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-accent-amber mt-1">{submittedCount}</p>
            <span className="text-[11px] text-content-muted">Đã nộp báo cáo khắc phục</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-accent-amber">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-surface-card rounded-civic-lg p-5 border border-border-subtle shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-content-sub">Đã nghiệm thu đạt</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-accent-green mt-1">{verifiedCount}</p>
            <span className="text-[11px] text-content-muted">Tuân thủ cam kết bảo vệ môi trường</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-accent-green">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Corrective Actions Workspace */}
      <section className="bg-surface-card rounded-civic-lg p-6 sm:p-7 border border-border-subtle shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
          <div>
            <h2 className="text-lg font-bold text-content-main flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" /> Yêu cầu khắc phục từ Cơ quan Quản lý
            </h2>
            <p className="text-xs text-content-sub mt-0.5">
              Đơn vị thi công có trách nhiệm nộp minh chứng xử lý đúng bán kính công trình trước hạn chót.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadData(searchTerm)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-content-sub hover:text-content-main border border-border-subtle rounded-md bg-surface-ground transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Làm mới
          </button>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : actions.length === 0 ? (
          <div className="p-8 text-center text-content-muted text-xs bg-surface-ground rounded-civic border border-border-subtle">
            Hiện tại không có yêu cầu khắc phục nào đang tồn đọng. Công trường đang tuân thủ tốt quy chuẩn môi trường!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {actions.map((act) => {
              const isOverdue = act.due_at && new Date(act.due_at) < new Date() && act.status !== 'VERIFIED';
              const isVerified = act.status === 'VERIFIED';
              const isSubmitted = act.status === 'SUBMITTED';

              return (
                <div
                  key={act.id}
                  className="p-5 rounded-civic-lg border border-border-subtle bg-white hover:border-primary/40 transition shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-surface-ground text-content-main border border-border-subtle">
                          {act.case_code || 'Vụ việc môi trường'}
                        </span>
                        {isVerified ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> ĐÃ NGHIỆM THU ĐẠT
                          </span>
                        ) : isSubmitted ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> ĐÃ NỘP BÁO CÁO (CHỜ DUYỆT)
                          </span>
                        ) : isOverdue ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> QUÁ HẠN XỬ LÝ
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-800 border border-red-200">
                            CẦN KHẮC PHỤC NGAY
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-content-main pt-1">{act.title}</h3>
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0">
                      {isVerified ? (
                        <Link
                          to={`/contractor/remediation/${act.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-civic text-xs font-bold bg-surface-ground text-content-sub hover:text-content-main border border-border-subtle transition"
                        >
                          <span>Xem kết quả</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <Link
                          to={`/contractor/remediation/${act.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-civic text-xs font-extrabold bg-primary text-white hover:bg-primary-hover shadow-sm transition"
                        >
                          <span>{isSubmitted ? 'Bổ sung minh chứng' : 'Nộp Báo cáo Khắc phục'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
                    {act.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-subtle text-xs text-content-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Hạn chót: {act.due_at ? new Date(act.due_at).toLocaleString('vi-VN') : 'Không quy định'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" /> Đơn vị chịu trách nhiệm: {act.responsible_party}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default ContractorPortalPage;
