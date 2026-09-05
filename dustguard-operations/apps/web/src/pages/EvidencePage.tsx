import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import {
  FileText,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Download,
  ExternalLink,
  Image as ImageIcon,
  CheckCircle2,
  Calendar,
  UserCheck,
  RotateCcw,
  Eye,
  X,
  FileCheck,
  Hash,
  Upload,
  Plus,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '../components/common/Button';

export const EvidencePage: React.FC = () => {
  const { addToast } = useToast();
  const [evidenceList, setEvidenceList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyHash = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    addToast('Đã sao chép toàn bộ mã băm SHA-256 vào clipboard', 'info');
  };

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [availableCases, setAvailableCases] = useState<any[]>([]);
  const [uploadCaseId, setUploadCaseId] = useState('');
  const [uploadSourceType, setUploadSourceType] = useState('CASE');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadEvidence();
  }, [sourceFilter, searchQuery]);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | undefined> = {};
      if (sourceFilter !== 'ALL') params.source_type = sourceFilter;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await api.evidence.all(params);
      setEvidenceList(res.evidence || []);
    } catch (err: any) {
      addToast(err.detail || 'Không thể tải thư viện bằng chứng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openUploadModal = async () => {
    try {
      const res = await api.cases.list({ limit: '100' });
      const cases = res.cases || [];
      setAvailableCases(cases);
      if (cases.length > 0 && !uploadCaseId) {
        setUploadCaseId(cases[0].id);
      }
      setIsUploadModalOpen(true);
    } catch (err: any) {
      addToast('Không thể lấy danh sách vụ việc để gán bằng chứng', 'error');
      setIsUploadModalOpen(true);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadCaseId) {
      addToast('Vui lòng chọn hoặc nhập mã vụ việc liên kết', 'error');
      return;
    }
    if (!uploadFile) {
      addToast('Vui lòng chọn một tệp hình ảnh hoặc tài liệu', 'error');
      return;
    }
    try {
      setUploading(true);
      await api.evidence.upload(uploadCaseId, uploadFile, uploadSourceType);
      addToast('Tải lên bằng chứng và niêm phong SHA-256 thành công!', 'success');
      setIsUploadModalOpen(false);
      setUploadFile(null);
      loadEvidence();
    } catch (err: any) {
      addToast(err.detail || 'Lỗi khi tải lên bằng chứng', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleVerifyHash = async (asset: any) => {
    try {
      setVerifyingId(asset.id);
      const res = await api.evidence.verifyHash(asset.id);
      setVerificationResult(res);
      if (res.verified) {
        addToast(`Xác thực toàn vẹn SHA-256 thành công: Mã băm khớp 100% với tệp trên đĩa.`, 'success');
      } else {
        addToast(`Cảnh báo toàn vẹn: Mã băm không khớp hoặc tệp bị biến đổi!`, 'error');
      }
    } catch (err: any) {
      addToast(err.detail || 'Lỗi kiểm tra toàn vẹn băm', 'error');
    } finally {
      setVerifyingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'INSPECTION':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded">Biên bản thanh tra</span>;
      case 'FINDING':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">Ghi nhận không đạt</span>;
      case 'REMEDIATION':
        return <span className="px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 rounded">Nghiệm thu khắc phục</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded">Hồ sơ ban đầu</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kho Lưu trữ & Xác thực Bằng chứng Số</h1>
            <span className="px-2.5 py-0.5 text-xs font-bold bg-dustguard-teal/10 text-dustguard-teal border border-dustguard-teal/20 rounded-full">
              Chuẩn băm SHA-256
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Trung tâm quản lý, tra cứu và kiểm định tính toàn vẹn của tất cả tài liệu, hình ảnh hiện trường và biên bản giám sát
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={openUploadModal}
            icon={<Upload className="w-4 h-4" />}
          >
            Tải lên bằng chứng
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="civic-card p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên tệp bằng chứng, mã vụ việc (DG-2026-...), hoặc công trình..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-dustguard-teal"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Nguồn:</span>
          </div>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-medium"
          >
            <option value="ALL">Tất cả nguồn bằng chứng</option>
            <option value="CASE">Hồ sơ ban đầu (CASE)</option>
            <option value="INSPECTION">Biên bản thanh tra (INSPECTION)</option>
            <option value="FINDING">Ghi nhận không đạt (FINDING)</option>
            <option value="REMEDIATION">Nghiệm thu khắc phục (REMEDIATION)</option>
          </select>

          {(sourceFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSourceFilter('ALL');
                setSearchQuery('');
              }}
              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 rounded hover:bg-slate-50 flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          )}
        </div>
      </div>

      {/* Evidence Grid */}
      {loading ? (
        <div className="civic-card p-12 text-center text-sm text-slate-500">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-dustguard-teal mb-2"></div>
          <p>Đang tải danh mục bằng chứng số...</p>
        </div>
      ) : evidenceList.length === 0 ? (
        <div className="civic-card p-12 text-center text-slate-500 space-y-4">
          <FileCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">Chưa có tài liệu bằng chứng nào</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hệ thống chưa ghi nhận tệp bằng chứng nào hoặc không có tệp nào phù hợp với bộ lọc tìm kiếm hiện tại.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {(sourceFilter !== 'ALL' || searchQuery) ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSourceFilter('ALL');
                  setSearchQuery('');
                }}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Đặt lại bộ lọc
              </Button>
            ) : null}
            <Button
              variant="primary"
              size="sm"
              onClick={openUploadModal}
              icon={<Upload className="w-3.5 h-3.5" />}
            >
              Tải lên bằng chứng đầu tiên
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceList.map(asset => {
            const isImage = asset.mime_type?.startsWith('image/') || asset.file_name?.match(/\.(png|jpe?g|svg|webp)$/i);

            return (
              <div
                key={asset.id}
                className="civic-card overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow border border-slate-200"
              >
                {/* Preview Thumbnail */}
                <div
                  className="h-44 bg-slate-100 relative cursor-pointer group flex items-center justify-center overflow-hidden border-b border-slate-200"
                  onClick={() => setSelectedAsset(asset)}
                >
                  {isImage ? (
                    <img
                      src={asset.file_path}
                      alt={asset.file_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="p-6 text-center text-slate-400 flex flex-col items-center gap-2">
                      <FileText className="w-12 h-12 text-slate-400" />
                      <span className="text-xs font-mono text-slate-600">{asset.file_name}</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <span className="px-3 py-1.5 bg-white/90 text-slate-900 rounded text-xs font-semibold flex items-center gap-1 shadow-sm">
                      <Eye className="w-3.5 h-3.5" /> Xem chi tiết
                    </span>
                  </div>

                  <div className="absolute top-2 left-2">
                    {getSourceBadge(asset.source_type)}
                  </div>
                </div>

                {/* Content Info */}
                <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4
                      className="font-bold text-slate-900 text-sm hover:text-dustguard-teal cursor-pointer line-clamp-1"
                      onClick={() => setSelectedAsset(asset)}
                      title={asset.file_name}
                    >
                      {asset.file_name}
                    </h4>

                    {asset.case_code && (
                      <Link
                        to={`/cases/${asset.case_id}`}
                        className="inline-flex items-center gap-1 text-xs text-dustguard-teal font-semibold hover:underline"
                      >
                        <FileText className="w-3 h-3" />
                        Vụ việc: {asset.case_code}
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                      </Link>
                    )}
                  </div>

                  {/* Hash info */}
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans">
                      <span className="flex items-center gap-1">
                        <Hash className="w-3 h-3 text-slate-400" />
                        Mã băm SHA-256
                      </span>
                      <span className="text-slate-400">{formatFileSize(asset.file_size)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      <div className="truncate text-slate-800 font-semibold flex-1" title={asset.sha256}>
                        {asset.sha256 ? `${asset.sha256.slice(0, 10)}...${asset.sha256.slice(-8)}` : 'Chưa có băm'}
                      </div>
                      {asset.sha256 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleCopyHash(asset.id, asset.sha256); }}
                          className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors shrink-0"
                          title="Sao chép toàn bộ mã SHA-256"
                        >
                          {copiedId === asset.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Metadata line */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(asset.created_at).toLocaleDateString('vi-VN')}
                    </span>
                    <span>{asset.uploaded_by_name || 'Hệ thống'}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleVerifyHash(asset)}
                      disabled={verifyingId === asset.id}
                      className="px-2.5 py-1 text-xs font-semibold rounded border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-colors touch-target"
                    >
                      {verifyingId === asset.id ? (
                        <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-dustguard-teal" />
                      )}
                      Kiểm định băm
                    </button>

                    <a
                      href={asset.file_path}
                      download={asset.file_name}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 text-xs font-medium rounded border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 flex items-center gap-1 transition-colors touch-target"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Tải về
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EVIDENCE PREVIEW MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-none flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 text-base truncate">{selectedAsset.file_name}</h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span>Dung lượng: {formatFileSize(selectedAsset.file_size)}</span>
                  <span>Định dạng: {selectedAsset.mime_type}</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  setVerificationResult(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Media viewer */}
              <div className="bg-slate-100 rounded-lg p-2 flex items-center justify-center min-h-[260px] border border-slate-200">
                {selectedAsset.mime_type?.startsWith('image/') || selectedAsset.file_name?.match(/\.(png|jpe?g|svg|webp)$/i) ? (
                  <img
                    src={selectedAsset.file_path}
                    alt={selectedAsset.file_name}
                    className="max-h-[420px] max-w-full rounded object-contain"
                  />
                ) : (
                  <div className="text-center p-8 space-y-2">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto" />
                    <p className="font-semibold text-slate-700 text-sm">Tài liệu đính kèm</p>
                    <a
                      href={selectedAsset.file_path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-dustguard-teal font-semibold text-xs hover:underline"
                    >
                      Mở trong tab mới <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Cryptographic Hash Verification Box */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-dustguard-teal" />
                    Chứng chỉ Toàn vẹn Dữ liệu (SHA-256 Digest)
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    loading={verifyingId === selectedAsset.id}
                    onClick={() => handleVerifyHash(selectedAsset)}
                    icon={<ShieldCheck className="w-3.5 h-3.5" />}
                  >
                    Kiểm định lại
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                    <span>Mã băm lưu trữ SSOT:</span>
                    <button
                      type="button"
                      onClick={() => handleCopyHash(selectedAsset.id, selectedAsset.sha256)}
                      className="text-xs text-dustguard-teal hover:underline flex items-center gap-1 font-sans"
                    >
                      {copiedId === selectedAsset.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === selectedAsset.id ? 'Đã sao chép' : 'Sao chép mã băm'}</span>
                    </button>
                  </div>
                  <div className="font-mono text-xs bg-white p-2.5 rounded border border-slate-300 break-all text-slate-800 select-all">
                    {selectedAsset.sha256}
                  </div>
                </div>

                {verificationResult && (
                  <div className={`p-3 rounded border text-xs ${
                    verificationResult.verified
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}>
                    <div className="font-bold flex items-center gap-1.5 mb-1">
                      {verificationResult.verified ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                      )}
                      {verificationResult.verified ? 'Bằng chứng hợp lệ 100%' : 'Cảnh báo sai lệch mã băm!'}
                    </div>
                    <p className="text-[11px] opacity-90">
                      {verificationResult.verified
                        ? 'Tệp nhị phân trên hệ thống lưu trữ trùng khớp hoàn toàn với bản ghi gốc tại thời điểm khởi tạo.'
                        : 'Mã băm tính toán từ tệp hiện tại không khớp với mã băm niêm phong. Có thể tệp đã bị chỉnh sửa hoặc thay thế ngoài luồng.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Case linkage */}
              {selectedAsset.case_code && (
                <div className="p-3 bg-white rounded border border-slate-200 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500">Thuộc vụ việc:</span>{' '}
                    <strong className="text-slate-900 font-bold">{selectedAsset.case_code}</strong>
                    {selectedAsset.case_title && <span className="text-slate-600"> — {selectedAsset.case_title}</span>}
                  </div>
                  <Link
                    to={`/cases/${selectedAsset.case_id}`}
                    className="text-dustguard-teal font-semibold hover:underline flex items-center gap-1 flex-shrink-0"
                  >
                    Đến vụ việc <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
              <a
                href={selectedAsset.file_path}
                download={selectedAsset.file_name}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                <Download className="w-4 h-4" />
                Tải tệp tin gốc
              </a>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedAsset(null);
                  setVerificationResult(null);
                }}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT UPLOAD MODAL */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-none flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full border border-slate-200 animate-in fade-in">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-dustguard-teal" />
                Tải lên Bằng chứng Mới
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Vụ việc liên kết <span className="text-rose-600">*</span>
                </label>
                {availableCases.length > 0 ? (
                  <select
                    value={uploadCaseId}
                    onChange={e => setUploadCaseId(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 font-medium"
                  >
                    <option value="">-- Chọn vụ việc cần đính kèm --</option>
                    {availableCases.map(c => (
                      <option key={c.id} value={c.id}>
                        [{c.code}] {c.title}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={uploadCaseId}
                      onChange={e => setUploadCaseId(e.target.value)}
                      placeholder="Nhập mã ID vụ việc (hoặc tạo vụ việc trước)..."
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-900"
                    />
                    <p className="text-[11px] text-amber-700">
                      Chưa có danh sách vụ việc. Bạn có thể nhập trực tiếp ID vụ việc hoặc qua trang Vụ việc để tạo mới.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Nguồn phát sinh bằng chứng</label>
                <select
                  value={uploadSourceType}
                  onChange={e => setUploadSourceType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded bg-white text-slate-900 font-medium"
                >
                  <option value="CASE">Hồ sơ phản ánh ban đầu (CASE)</option>
                  <option value="INSPECTION">Biên bản thanh tra hiện trường (INSPECTION)</option>
                  <option value="FINDING">Ghi nhận vi phạm không đạt (FINDING)</option>
                  <option value="REMEDIATION">Minh chứng khắc phục (REMEDIATION)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Tệp tin bằng chứng <span className="text-rose-600">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  required
                  className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border file:border-slate-300 file:text-xs file:font-semibold file:bg-slate-100 hover:file:bg-slate-200"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Hệ thống tự động niêm phong toàn vẹn bằng chuẩn băm SHA-256 khi lưu trữ.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsUploadModalOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={uploading}
                  icon={<Upload className="w-3.5 h-3.5" />}
                >
                  Tải lên & Niêm phong
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
