import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { StatusBadge } from '../components/case/StatusBadge';
import {
  Shield,
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  ArrowLeft,
  Info,
  Scale,
  ExternalLink,
} from 'lucide-react';
import { LegalAIOutput } from '@dustguard-operations/shared';

export const LegalWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, can } = useAuth();
  const { success, error } = useToast();

  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // FTS Search State (Right Pane)
  const [searchQuery, setSearchQuery] = useState('bụi');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);

  // AI Assistant Analysis State (Center Pane)
  const [analysis, setAnalysis] = useState<LegalAIOutput | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Human Legal Review Form State
  const [reviewStatus, setReviewStatus] = useState<'NOT_STARTED' | 'IN_REVIEW' | 'NEEDS_INFO' | 'REVIEWED'>('REVIEWED');
  const [reviewSummary, setReviewSummary] = useState('');
  const [reviewBasis, setReviewBasis] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkspace();
      handleFtsSearch('bụi');
    }
  }, [id]);

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      const res = await api.cases.get(id!);
      setCaseData(res);

      // Load existing review if present
      if (res.legalReviews && res.legalReviews.length > 0) {
        const lr = res.legalReviews[0];
        setReviewStatus(lr.status);
        setReviewSummary(lr.summary);
        setReviewBasis(lr.legal_basis_note || '');
      }

      // Check if previous analysis exists
      const analysesRes = await api.legal.analyses(id!);
      if (analysesRes.analyses && analysesRes.analyses.length > 0) {
        setAnalysis(analysesRes.analyses[0].output);
      }
    } catch (err: any) {
      error('Lỗi tải dữ liệu', err.detail);
    } finally {
      setLoading(false);
    }
  };

  const handleFtsSearch = async (q: string) => {
    if (!q.trim()) return;
    try {
      setSearchLoading(true);
      const res = await api.legal.search(q);
      setSearchResults(res.results);
      if (res.results.length > 0 && !selectedSection) {
        setSelectedSection(res.results[0]);
      }
    } catch (err: any) {
      error('Lỗi tìm kiếm FTS', err.detail);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    try {
      setAnalyzing(true);
      const res = await api.legal.analyze(id!);
      setAnalysis(res.analysis.output);
      success('Phân tích pháp lý hoàn tất', 'Đã đối chiếu các quy chuẩn môi trường thành công');
    } catch (err: any) {
      error('Lỗi phân tích', err.detail);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!can('legal:review')) {
      error('Thẩm quyền', 'Chỉ chuyên viên pháp chế mới có quyền xác nhận thẩm tra.');
      return;
    }

    try {
      setReviewSubmitting(true);
      await api.legal.review(id!, {
        status: reviewStatus,
        summary: reviewSummary,
        legal_basis_note: reviewBasis,
      });
      success('Lưu thẩm tra thành công', 'Kết luận pháp lý đã được ghi nhận vào hồ sơ');
      loadWorkspace();
    } catch (err: any) {
      error('Lỗi lưu thẩm tra', err.detail);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleInsertBasis = (sec: any) => {
    const citation = `${sec.section_number} - ${sec.heading} (${sec.document_number})`;
    setReviewBasis(prev => (prev ? `${prev}; ${citation}` : citation));
    success('Đã gắn căn cứ pháp lý', citation);
  };

  if (loading || !caseData) {
    return (
      <div className="civic-card p-12 text-center text-slate-400 animate-pulse text-sm">
        Đang nạp Không gian Pháp lý (Legal Workspace)...
      </div>
    );
  }

  const { case: c, evidence } = caseData;

  return (
    <div className="space-y-4">
      {/* Top breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3">
          <Link to={`/cases/${c.id}`} className="text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {c.case_code}
              </span>
              <StatusBadge status={c.status} />
              <span className="text-xs text-slate-500">• Không gian Thẩm tra Pháp lý (3 Vùng SSOT)</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">{c.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="teal"
            size="sm"
            loading={analyzing}
            icon={<Sparkles className="w-4 h-4" />}
            onClick={handleRunAiAnalysis}
          >
            Chạy Trợ lý Pháp lý AI
          </Button>
        </div>
      </div>

      {/* 3-PANE DESKTOP WORKSPACE (Section 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* LEFT PANE: Case Context (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="civic-card p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 tracking-wider">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>VÙNG 1: BỐI CẢNH VỤ VIỆC</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block">Địa chỉ hiện trường:</span>
                <p className="font-semibold text-slate-800">{c.location_text}</p>
                <p className="text-slate-500 text-[11px]">{c.district}</p>
              </div>

              <div>
                <span className="text-slate-400 block">Đơn vị thi công:</span>
                <p className="font-semibold text-slate-800">{c.contractor_name || 'Chưa xác định'}</p>
              </div>

              <div>
                <span className="text-slate-400 block">Nội dung phản ánh:</span>
                <p className="text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed font-medium">
                  {c.description}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block">Số lượt phản ánh:</span>
                <p className="font-bold text-slate-800">{c.source_report_count} lượt ({c.source})</p>
              </div>
            </div>
          </div>

          {/* Evidence Snapshots */}
          <div className="civic-card p-4 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase block">Minh chứng ảnh hiện trường ({evidence.length})</span>
            {evidence.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Chưa có ảnh minh chứng.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {evidence.slice(0, 4).map((ev: any) => (
                  <div key={ev.id} className="rounded border border-slate-200 overflow-hidden aspect-video bg-slate-100">
                    <img src={ev.file_path} alt={ev.file_name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER PANE: Legal Analysis & Human Review (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* AI Assistive Box */}
          <div className="civic-card p-5 space-y-4 border-l-4 border-dustguard-teal">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-dustguard-teal" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  VÙNG 2: PHÂN TÍCH PHÁP LÝ (ASSISTIVE)
                </h3>
              </div>
              <span className="text-[11px] font-bold bg-teal-50 text-dustguard-teal border border-teal-200 px-2 py-0.5 rounded">
                Căn cứ chuẩn Zod
              </span>
            </div>

            {analysis ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-teal-50/50 rounded border border-teal-100">
                  <span className="font-bold text-teal-900 block mb-1">Tóm tắt phân tích đối chiếu:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{analysis.summary}</p>
                </div>

                {/* Potential Issues */}
                <div>
                  <span className="font-bold text-slate-700 block mb-1.5 uppercase tracking-wider text-[11px]">
                    Dấu hiệu cần xác minh nghiệp vụ:
                  </span>
                  <div className="space-y-1.5">
                    {analysis.potentialIssues.map((iss, i) => (
                      <div key={i} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                        <p className="font-bold text-slate-900">{iss.title}</p>
                        <p className="text-slate-600 mt-0.5">{iss.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Citation-First Legal References (Section 18) */}
                <div>
                  <span className="font-bold text-slate-700 block mb-1.5 uppercase tracking-wider text-[11px]">
                    Căn cứ pháp lý viện dẫn (Citation-First):
                  </span>
                  <div className="space-y-1.5">
                    {analysis.relevantProvisions.map((prov, i) => (
                      <div key={i} className="p-2 bg-white rounded border border-slate-200 flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-bold">
                            {prov.legalSectionId ? `MÃ ĐIỀU: ${prov.legalSectionId}` : 'CHƯA XÁC MINH NGUỒN'}
                          </span>
                          <p className="text-slate-700 mt-1">{prov.reason}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReviewBasis(prev => `${prev ? prev + '; ' : ''}${prov.reason}`)}
                          className="text-[11px] text-dustguard-teal font-bold hover:underline flex-shrink-0"
                        >
                          + Gắn
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer (Section 14 & 16) */}
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-1.5">
                  <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{analysis.disclaimer}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded border border-slate-200 space-y-2">
                <p>Chưa có kết quả phân tích AI cho vụ việc này.</p>
                <Button variant="outline" size="sm" onClick={handleRunAiAnalysis}>
                  Kích hoạt Phân tích Đối chiếu Ngay
                </Button>
              </div>
            )}
          </div>

          {/* Human Legal Review Decision Form (Section 19) */}
          <div className="civic-card p-5 space-y-4 border-slate-300">
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-slate-800" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                THẨM TRA PHÁP LÝ CHÍNH THỨC (HUMAN REVIEW)
              </h3>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kết luận Thẩm tra Pháp lý <span className="text-red-500">*</span>
                </label>
                <select
                  value={reviewStatus}
                  onChange={e => setReviewStatus(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-dustguard-teal"
                >
                  <option value="NOT_STARTED">Chưa bắt đầu (NOT_STARTED)</option>
                  <option value="IN_REVIEW">Đang thụ lý thẩm tra (IN_REVIEW)</option>
                  <option value="NEEDS_INFO">Cần bổ sung tài liệu hiện trường (NEEDS_INFO)</option>
                  <option value="REVIEWED">Đã thẩm tra xong & Có căn cứ xử lý (REVIEWED)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Ý kiến kết luận của chuyên viên pháp chế <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewSummary}
                  onChange={e => setReviewSummary(e.target.value)}
                  placeholder="VD: Xác định hành vi vi phạm Điểm a Khoản 1 Điều 15 NĐ 45/2022 do không che chắn..."
                  className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-teal font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Căn cứ pháp lý viện dẫn (Click từ cột phải để gắn nhanh):
                </label>
                <textarea
                  rows={2}
                  value={reviewBasis}
                  onChange={e => setReviewBasis(e.target.value)}
                  placeholder="Khoản 1 Điều 64 Luật BVMT 2020; Điểm a Khoản 1 Điều 15 NĐ 45/2022/NĐ-CP"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono text-[11px] text-slate-800 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="teal" size="sm" loading={reviewSubmitting}>
                  Ký & Xác Nhận Thẩm Tra Pháp Lý
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT PANE: Relevant Legal Sources (FTS5 Search) (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="civic-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 tracking-wider">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>VÙNG 3: NGUỒN PHÁP QUY (FTS5)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">SQLite FTS5</span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  handleFtsSearch(e.target.value);
                }}
                placeholder="Tra từ khóa: che chắn, rửa xe, bụi mịn..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-dustguard-teal"
              />
            </div>

            {/* Search Results List */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto scrollbar-thin pr-1">
              {searchLoading ? (
                <p className="text-xs text-slate-400 text-center py-4">Đang tra cứu FTS5...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Không tìm thấy điều khoản phù hợp.</p>
              ) : (
                searchResults.map(res => (
                  <div
                    key={res.section_id}
                    onClick={() => setSelectedSection(res)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                      selectedSection?.section_id === res.section_id
                        ? 'border-dustguard-teal bg-teal-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-bold text-slate-900">{res.section_number}</span>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleInsertBasis(res);
                        }}
                        className="text-[10px] bg-slate-100 hover:bg-teal-100 text-slate-700 hover:text-teal-900 px-1.5 py-0.5 rounded font-semibold border border-slate-200"
                        title="Gắn vào căn cứ thẩm tra"
                      >
                        + Viện dẫn
                      </button>
                    </div>
                    <p className="font-semibold text-slate-700 mt-0.5">{res.heading}</p>
                    <span className="text-[10px] text-slate-400 block mt-1">{res.document_number}</span>
                    <p className="text-slate-600 mt-1 line-clamp-2 text-[11px] leading-relaxed">
                      {res.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Section Viewer */}
          {selectedSection && (
            <div className="civic-card p-4 space-y-2 border-teal-200 bg-teal-50/20 text-xs">
              <span className="font-bold text-dustguard-teal block">Chi tiết điều khoản tra cứu:</span>
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedSection.section_number}: {selectedSection.heading}
              </h4>
              <p className="text-[11px] text-slate-500">Thuộc văn bản: {selectedSection.document_title} ({selectedSection.document_number})</p>
              <div className="p-3 bg-white rounded border border-slate-200 leading-relaxed text-slate-800 mt-2 font-medium">
                {selectedSection.content}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
