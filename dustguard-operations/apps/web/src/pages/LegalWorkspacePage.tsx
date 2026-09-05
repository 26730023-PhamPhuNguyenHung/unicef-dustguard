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
  ListChecks,
  Plus,
  Trash2,
  CheckSquare,
  Activity,
  Layers,
  FileCheck,
  Check,
  XCircle,
  HelpCircle,
  Calendar,
  Send,
  Lock,
} from 'lucide-react';
import { CaseFact, SemanticType, ConclusionLevel, HumanDecisionType } from '@dustguard-operations/shared';

export const LegalWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, can } = useAuth();
  const { success, error, info } = useToast();

  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Center Pane Tabs: 'matrix' | 'worksheet' | 'checklist'
  const [centerTab, setCenterTab] = useState<'matrix' | 'worksheet' | 'checklist'>('matrix');

  // Left Pane State (Facts)
  const [facts, setFacts] = useState<CaseFact[]>([]);
  const [factsLoading, setFactsLoading] = useState(false);
  const [factFilter, setFactFilter] = useState<'ALL' | 'CLAIM' | 'OBSERVATION' | 'EVIDENCE' | 'TELEMETRY' | 'HUMAN_DECISION'>('ALL');
  const [highlightedFactId, setHighlightedFactId] = useState<string | null>(null);
  const [selectedFactModal, setSelectedFactModal] = useState<CaseFact | null>(null);

  // Analysis & Evidence Matrix State
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // FTS Search State
  const [searchQuery, setSearchQuery] = useState('bụi');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);

  // Human Decision Form State
  const [selectedDecisionType, setSelectedDecisionType] = useState<HumanDecisionType>('ACCEPT_ASSESSMENT');
  const [decisionReason, setDecisionReason] = useState('');
  const [decisionSubmitting, setDecisionSubmitting] = useState(false);
  const [humanDecisionsList, setHumanDecisionsList] = useState<any[]>([]);

  // Task Creation from Missing Fact
  const [creatingTaskFact, setCreatingTaskFact] = useState<string | null>(null);

  // Structured Reasoning Worksheet State
  const [signOfViolation, setSignOfViolation] = useState('Có dấu hiệu phát tán bụi ra môi trường xung quanh do biện pháp che chắn chưa hoàn thiện');
  const [reviewBasis, setReviewBasis] = useState('');

  // Field Checklist Generator State
  const [checklistBefore, setChecklistBefore] = useState<string[]>([
    'Xác định tên công trình và đơn vị chủ đầu tư / nhà thầu thi công',
    'Xác minh địa chỉ và ranh giới tiếp giáp khu dân cư',
    'Kiểm tra hồ sơ đăng ký kế hoạch bảo vệ môi trường đã cấp phép',
    'Chuẩn bị biên bản kiểm tra và thiết bị có định vị GPS',
  ]);
  const [checklistOnsite, setChecklistOnsite] = useState<string[]>([
    'Kiểm tra độ phủ và tình trạng lưới chống bụi toàn bộ chu vi công trình',
    'Kiểm tra hệ thống phun sương / tưới nước dập bụi tại khu vực thi công',
    'Quan sát hiện tượng bụi phát tán ra ngoài ranh giới và lòng đường',
    'Kiểm tra tình trạng xe ben ra/vào (che bạt kín thùng xe)',
    'Kiểm tra hoạt động thực tế của cầu rửa xe tự động hoặc vòi rửa bánh',
    'Kiểm tra bạt che đậy đối với các bãi tập kết cát, đá, vật liệu rời',
  ]);
  const [checklistEvidence, setChecklistEvidence] = useState<string[]>([
    'Chụp ảnh toàn cảnh công trình bao quát hướng phát tán bụi',
    'Chụp ảnh cận cảnh các điểm hở lưới / vật liệu rơi vãi / xe chưa rửa bánh',
    'Ghi nhận chính xác mốc thời gian, hướng gió và điều kiện thời tiết',
  ]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [checklistTargetGroup, setChecklistTargetGroup] = useState<'before' | 'onsite' | 'evidence'>('onsite');
  const [exportingChecklist, setExportingChecklist] = useState(false);

  useEffect(() => {
    if (id) {
      loadWorkspace();
      loadFacts();
      handleFtsSearch('bụi');
    }
  }, [id]);

  const loadWorkspace = async () => {
    try {
      setLoading(true);
      const res = await api.cases.get(id!);
      setCaseData(res);
      setHumanDecisionsList(res.humanDecisions || []);

      // Load previous analysis if available
      try {
        const analysesRes = await api.legal.analyses(id!);
        if (analysesRes.analyses && analysesRes.analyses.length > 0) {
          setAnalysis(analysesRes.analyses[0].output);
        }
      } catch {
        // Optional
      }
    } catch (err: any) {
      error('Lỗi tải dữ liệu hồ sơ', err.detail);
    } finally {
      setLoading(false);
    }
  };

  const loadFacts = async () => {
    try {
      setFactsLoading(true);
      const res = await api.cases.facts(id!);
      setFacts(res.facts || []);
    } catch (err: any) {
      error('Lỗi tải Facts SSOT', err.detail);
    } finally {
      setFactsLoading(false);
    }
  };

  const handleFtsSearch = async (q: string) => {
    if (!q.trim()) return;
    try {
      setSearchLoading(true);
      const res = await api.legal.search(q);
      setSearchResults(res.results || []);
      if (res.results && res.results.length > 0 && !selectedSection) {
        setSelectedSection(res.results[0]);
      }
    } catch (err: any) {
      error('Lỗi tìm kiếm FTS5', err.detail);
    } finally {
      setSearchLoading(false);
    }
  };

  // Run Strict 8-Step Evidence-Grounded Analysis
  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      const res = await api.cases.analysis(id!);
      setAnalysis(res.analysis ? res.analysis.output : res.output);
      await loadFacts(); // Reload facts in case state evolved
      success('Thẩm tra căn cứ hoàn tất', `Đã xác lập kết luận mức "${res.output?.conclusion_level || res.analysis?.output?.conclusion_level}"`);
    } catch (err: any) {
      error('Lỗi thẩm tra căn cứ', err.detail || err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Human Decision Submission
  const handleSubmitHumanDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionReason.trim()) {
      error('Thiếu lý do', 'Vui lòng nhập lý do và căn cứ cho quyết định này.');
      return;
    }

    try {
      setDecisionSubmitting(true);
      const res = await api.cases.submitDecision(id!, {
        decision_type: selectedDecisionType,
        reason: decisionReason.trim(),
        analysis_run_id: analysis?.analysisRunId || undefined,
      });

      success('Ban hành quyết định thành công', `Đã lưu vết quyết định "${selectedDecisionType}" vào CSDL.`);
      setDecisionReason('');
      // Reload workspace & facts
      await loadWorkspace();
      await loadFacts();
      // Re-run analysis to reflect human decision
      await handleRunAnalysis();
    } catch (err: any) {
      error('Lỗi ban hành quyết định', err.detail || err.message);
    } finally {
      setDecisionSubmitting(false);
    }
  };

  // Create Real Task from Missing Fact
  const handleCreateTaskFromMissingFact = async (mf: any) => {
    try {
      setCreatingTaskFact(mf.fact);
      await api.cases.createTaskFromMissingFact(id!, {
        fact: mf.fact,
        reason_needed: mf.reason_needed,
        recommended_verification_action: mf.recommended_verification_action,
        priority: 'HIGH',
      });
      success('Đã tạo nhiệm vụ thực tế', `Nhiệm vụ xác minh đã được thêm vào Hàng đợi (/tasks).`);
    } catch (err: any) {
      error('Lỗi tạo nhiệm vụ', err.detail || err.message);
    } finally {
      setCreatingTaskFact(null);
    }
  };

  // Add Missing Fact to Field Checklist
  const handleAddMissingFactToChecklist = (mf: any) => {
    setChecklistOnsite(prev => [...prev, mf.recommended_verification_action || mf.fact]);
    setCenterTab('checklist');
    success('Đã gắn vào Checklist', 'Tiêu chí đã được thêm vào nhóm "Tại hiện trường".');
  };

  // Export Checklist to Tasks
  const handleExportChecklistToTask = async () => {
    try {
      setExportingChecklist(true);
      const allItems = [...checklistBefore, ...checklistOnsite, ...checklistEvidence];
      const desc = allItems.map((it, idx) => `${idx + 1}. ${it}`).join('\n');

      await api.tasks.create({
        case_id: id,
        title: `Kiểm tra thực địa theo checklist (${allItems.length} tiêu chí)`,
        description: desc,
        task_type: 'FIELD_INSPECTION',
        priority: 'HIGH',
        due_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      });

      success('Đã xuất sang Nhiệm vụ Hiện trường', 'Toàn bộ tiêu chí đã được tạo thành tác vụ kiểm tra tại /tasks.');
    } catch (err: any) {
      error('Lỗi xuất checklist', err.detail || err.message);
    } finally {
      setExportingChecklist(false);
    }
  };

  // Highlight fact when clicking citation chip
  const handleCitationClick = (sourceId: string) => {
    setHighlightedFactId(sourceId);
    const targetFact = facts.find(f => f.id === sourceId || f.source_id === sourceId);
    if (targetFact) {
      setSelectedFactModal(targetFact);
    } else {
      info('Trích dẫn nguồn', `Mã nguồn: ${sourceId}`);
    }
  };

  const filteredFacts = facts.filter(f => {
    if (factFilter === 'ALL') return true;
    if (factFilter === 'EVIDENCE') return f.fact_type === 'EVIDENCE_ASSET';
    return f.semantic_type === factFilter;
  });

  if (loading || !caseData) {
    return (
      <div className="civic-card p-12 text-center text-slate-500 font-medium text-sm animate-pulse">
        Đang nạp Không gian Thẩm tra Pháp lý (Evidence Provenance SSOT)...
      </div>
    );
  }

  const { case: c, evidence = [] } = caseData;

  return (
    <div className="space-y-4 text-slate-900">
      {/* TOP HEADER: Case ID, Title & Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex items-center gap-3">
          <Link to={`/cases/${c.id}`} className="text-slate-500 hover:text-slate-800 p-1 rounded hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-dustguard-red bg-red-50 px-2 py-0.5 rounded border border-red-200">
                {c.case_code}
              </span>
              <StatusBadge status={c.status} />
              <span className="text-xs text-slate-500 font-medium">
                • Không gian Thẩm tra Dữ liệu Thực tế (SOURCE → FACT → EVIDENCE → INFERENCE → HUMAN DECISION)
              </span>
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
            onClick={handleRunAnalysis}
          >
            Chạy Thẩm Tra Căn Cứ Thực Tế
          </Button>
        </div>
      </div>

      {/* 3-COLUMN DESKTOP WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* =================================================================== */}
        {/* CỘT TRÁI (LEFT PANE - 3 cols): Verified Facts / Claims / Evidence   */}
        {/* =================================================================== */}
        <div className="lg:col-span-3 space-y-4">
          <div className="civic-card p-4 space-y-3 border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-dustguard-teal" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  VÙNG 1: DỮ KIỆN THỰC TẾ (FACTS)
                </h3>
              </div>
              <span className="text-[11px] font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-700">
                {facts.length} facts
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1 text-[10px] font-bold">
              {[
                { key: 'ALL', label: 'Tất cả' },
                { key: 'CLAIM', label: 'Claim' },
                { key: 'OBSERVATION', label: 'Hiện trường' },
                { key: 'EVIDENCE', label: 'Bằng chứng' },
                { key: 'TELEMETRY', label: 'IoT' },
                { key: 'HUMAN_DECISION', label: 'Quyết định' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFactFilter(tab.key as any)}
                  className={`px-2 py-1 rounded transition-colors ${
                    factFilter === tab.key
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Facts Scroll List */}
            <div className="space-y-2 max-h-[620px] overflow-y-auto scrollbar-thin pr-1">
              {factsLoading ? (
                <p className="text-xs text-slate-400 text-center py-6 animate-pulse">Đang nạp dữ kiện SQLite...</p>
              ) : filteredFacts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Không có dữ kiện thuộc nhóm này.</p>
              ) : (
                filteredFacts.map(fact => {
                  const isHighlighted = highlightedFactId === fact.id || highlightedFactId === fact.source_id;

                  // Semantic badge styles
                  let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';
                  let semanticLabel: string = fact.semantic_type;

                  if (fact.semantic_type === 'CLAIM') {
                    badgeStyle = 'bg-amber-50 text-amber-900 border-amber-300';
                    semanticLabel = 'CLAIM (Chưa xác minh)';
                  } else if (fact.semantic_type === 'OBSERVATION') {
                    badgeStyle = 'bg-blue-50 text-blue-900 border-blue-300';
                    semanticLabel = 'OBSERVATION (Hiện trường)';
                  } else if (fact.fact_type === 'EVIDENCE_ASSET') {
                    if (fact.integrity_state === 'VERIFIED') {
                      badgeStyle = 'bg-emerald-50 text-emerald-900 border-emerald-300';
                      semanticLabel = 'EVIDENCE (SHA-256 Hợp lệ)';
                    } else {
                      badgeStyle = 'bg-rose-50 text-rose-900 border-rose-300';
                      semanticLabel = `EVIDENCE (${fact.integrity_state})`;
                    }
                  } else if (fact.semantic_type === 'TELEMETRY') {
                    badgeStyle = 'bg-purple-50 text-purple-900 border-purple-300';
                    semanticLabel = 'TELEMETRY (Cảm biến IoT)';
                  } else if (fact.semantic_type === 'HUMAN_DECISION') {
                    badgeStyle = 'bg-red-50 text-dustguard-red border-red-300';
                    semanticLabel = 'HUMAN DECISION (Con người)';
                  }

                  return (
                    <div
                      key={fact.id}
                      onClick={() => setSelectedFactModal(fact)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isHighlighted
                          ? 'border-dustguard-teal bg-teal-50/70 ring-2 ring-dustguard-teal shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-mono font-bold text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded">
                          {fact.id.split('-').slice(0, 3).join('-')}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${badgeStyle}`}>
                          {semanticLabel}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 text-[11px] leading-snug">{fact.title}</p>
                      <p className="text-slate-600 mt-1 line-clamp-2 text-[11px] leading-relaxed font-medium">
                        {fact.value}
                      </p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                        <span>Nguồn: {fact.source_type}</span>
                        <span>{new Date(fact.source_timestamp).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* CỘT GIỮA (CENTER PANE - 5 cols): Evidence Matrix & Reasoning UI     */}
        {/* =================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sub-nav Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setCenterTab('matrix')}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
                centerTab === 'matrix'
                  ? 'bg-dustguard-teal text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ma Trận Bằng Chứng (Evidence Matrix)</span>
            </button>
            <button
              type="button"
              onClick={() => setCenterTab('worksheet')}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
                centerTab === 'worksheet'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Phiếu Lập Luận</span>
            </button>
            <button
              type="button"
              onClick={() => setCenterTab('checklist')}
              className={`flex-1 py-1.5 px-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 transition-colors ${
                centerTab === 'checklist'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5" />
              <span>Tạo Checklist</span>
            </button>
          </div>

          {/* TAB 1: EVIDENCE MATRIX (Core Invariant: Provenance UI) */}
          {centerTab === 'matrix' && (
            <div className="civic-card p-5 space-y-4 border-slate-300">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-dustguard-teal" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      VÙNG 2: MA TRẬN BẰNG CHỨNG (EVIDENCE MATRIX)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Mọi nhận định bắt buộc phải trích dẫn nguồn thực tế từ CSDL
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold bg-teal-50 text-dustguard-teal border border-teal-200 px-2 py-0.5 rounded">
                  Zero Mock Provenance
                </span>
              </div>

              {/* Header Status & Calculated Confidence */}
              {analysis ? (
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-600">Cấp độ kết luận hiện thời:</span>
                    {analysis.conclusion_level === 'HUMAN_CONFIRMED' && (
                      <span className="text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300 px-2.5 py-0.5 rounded-full">
                        HUMAN_CONFIRMED (LÃNH ĐẠO ĐÃ KÝ DUYỆT)
                      </span>
                    )}
                    {analysis.conclusion_level === 'SUPPORTED' && (
                      <span className="text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 px-2.5 py-0.5 rounded-full">
                        SUPPORTED (ĐÃ ĐỐI CHỨNG CHỨNG CỨ)
                      </span>
                    )}
                    {analysis.conclusion_level === 'PRELIMINARY' && (
                      <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full">
                        PRELIMINARY (DẤU HIỆU SƠ BỘ CẦN KIỂM CHỨNG)
                      </span>
                    )}
                    {(!analysis.conclusion_level || analysis.conclusion_level === 'INSUFFICIENT_EVIDENCE') && (
                      <span className="text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300 px-2.5 py-0.5 rounded-full">
                        INSUFFICIENT_EVIDENCE (CHƯA ĐỦ CĂN CỨ)
                      </span>
                    )}
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700">
                      <span>Độ tin cậy dữ liệu thực tế:</span>
                      <span>{Math.round((analysis.confidence || 0.5) * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-dustguard-teal h-full transition-all duration-500 rounded-full"
                        style={{ width: `${Math.round((analysis.confidence || 0.5) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 block">
                      * Tính toán dựa trên tỷ lệ minh chứng đã xác thực SHA-256 đối chiếu với các điều kiện kỹ thuật.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-2">
                  <p className="text-xs text-slate-600 font-medium">Chưa có kết quả phân tích thẩm tra cho hồ sơ này.</p>
                  <Button variant="teal" size="sm" loading={analyzing} onClick={handleRunAnalysis}>
                    Kích hoạt Thẩm tra Dữ liệu Thực tế Ngay
                  </Button>
                </div>
              )}

              {/* Findings Matrix Cards */}
              {analysis?.findings && analysis.findings.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Nhận Định Có Đối Chứng Nguồn ({analysis.findings.length}):
                  </span>

                  {analysis.findings.map((f: any, idx: number) => {
                    // Cấm render statement nếu source_ids rỗng
                    if (!f.source_ids || f.source_ids.length === 0) return null;

                    return (
                      <div key={f.id || idx} className="p-4 rounded-lg border border-slate-300 bg-white space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-bold">
                              {f.id}
                            </span>
                            <span className="text-xs font-bold text-slate-900">{f.statement}</span>
                          </div>
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded shrink-0">
                            Cần con người duyệt
                          </span>
                        </div>

                        {/* Clickable Source Chips */}
                        <div className="space-y-1">
                          <span className="text-[11px] font-bold text-slate-600 block">Bằng chứng nguồn đối chiếu:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {f.source_ids.map((srcId: string) => (
                              <button
                                key={srcId}
                                type="button"
                                onClick={() => handleCitationClick(srcId)}
                                className="font-mono text-[11px] font-bold bg-teal-50 hover:bg-teal-100 text-dustguard-teal border border-teal-200 px-2 py-0.5 rounded transition-colors flex items-center gap-1 cursor-pointer"
                                title="Bấm để xem chi tiết bằng chứng nguồn"
                              >
                                <span>[{srcId}]</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Legal Basis with exact excerpt */}
                        {f.legal_section_ids && f.legal_section_ids.length > 0 && (
                          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1 text-xs">
                            <span className="font-bold text-slate-700 block text-[11px]">Căn cứ pháp quy liên quan:</span>
                            <div className="space-y-1">
                              {f.legal_section_ids.map((secId: string) => (
                                <div key={secId} className="flex items-center gap-1 font-mono text-[11px] text-slate-800">
                                  <Scale className="w-3 h-3 text-slate-500" />
                                  <span>MÃ ĐIỀU: {secId}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}

              {/* Disclaimer */}
              {analysis?.disclaimer && (
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2 leading-relaxed">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{analysis.disclaimer}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: STRUCTURED REASONING WORKSHEET */}
          {centerTab === 'worksheet' && (
            <div className="civic-card p-5 space-y-4 border-slate-300">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-slate-800" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    PHIẾU LẬP LUẬN THẨM TRA (REASONING WORKSHEET)
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded">
                  Chuyên viên xác nhận
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <label className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  1. Dấu hiệu cần xem xét:
                </label>
                <input
                  type="text"
                  value={signOfViolation}
                  onChange={e => setSignOfViolation(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded font-medium text-slate-800 outline-none focus:ring-2 focus:ring-dustguard-teal bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 block uppercase tracking-wider text-[11px]">
                  2. Căn cứ dữ liệu tại hiện trường:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-medium">
                  <li>{evidence.length} tệp ảnh minh chứng hiện trường đã tiếp nhận.</li>
                  <li>{c.source_report_count} lượt phản ánh ghi nhận từ người dân ({c.source}).</li>
                  <li>Công trình: {c.contractor_name || 'Đang xác minh'} tại {c.location_text}.</li>
                </ul>
              </div>

              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  3. Quy định pháp luật liên quan:
                </span>
                <textarea
                  rows={3}
                  value={reviewBasis}
                  onChange={e => setReviewBasis(e.target.value)}
                  placeholder="Chọn điều khoản từ cột Nguồn Pháp Quy (FTS5) bên phải hoặc nhập căn cứ..."
                  className="w-full p-2 border border-slate-300 rounded font-mono text-[11px] text-slate-800 outline-none focus:ring-2 focus:ring-dustguard-teal bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 3: FIELD CHECKLIST GENERATOR */}
          {centerTab === 'checklist' && (
            <div className="civic-card p-5 space-y-4 border-slate-300">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-slate-800" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    BỘ TẠO CHECKLIST THANH TRA HIỆN TRƯỜNG
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-teal-50 text-dustguard-teal border border-teal-200 px-2 py-0.5 rounded">
                  {checklistBefore.length + checklistOnsite.length + checklistEvidence.length} tiêu chí
                </span>
              </div>

              {/* Group 2: Tại hiện trường */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase text-[11px]">
                  <Activity className="w-3.5 h-3.5 text-dustguard-teal" />
                  Tiêu chí kiểm tra tại hiện trường ({checklistOnsite.length})
                </span>
                <div className="space-y-1">
                  {checklistOnsite.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-slate-50 rounded border border-slate-200 text-slate-800">
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => setChecklistOnsite(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add checklist item */}
              <div className="pt-2 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={e => setNewChecklistItem(e.target.value)}
                  placeholder="Thêm tiêu chí kiểm tra mới..."
                  className="flex-1 p-2 border border-slate-300 rounded text-xs outline-none bg-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newChecklistItem.trim()) {
                      setChecklistOnsite(prev => [...prev, newChecklistItem.trim()]);
                      setNewChecklistItem('');
                    }
                  }}
                >
                  + Thêm
                </Button>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  loading={exportingChecklist}
                  icon={<ListChecks className="w-4 h-4" />}
                  onClick={handleExportChecklistToTask}
                >
                  Xuất sang Hàng đợi Nhiệm vụ (/tasks)
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* CỘT PHẢI (RIGHT PANE - 4 cols): Missing Facts & Human Decision     */}
        {/* =================================================================== */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. MISSING FACT ENGINE (Core Feature) */}
          <div className="civic-card p-4 space-y-3 border-amber-300 bg-amber-50/20">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  DỮ KIỆN CÒN THIẾU (MISSING FACTS)
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                {analysis?.missing_facts?.length || 0} mục
              </span>
            </div>

            {analysis?.missing_facts && analysis.missing_facts.length > 0 ? (
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
                {analysis.missing_facts.map((mf: any, idx: number) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-2 shadow-2xs">
                    <div className="flex items-start gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block leading-tight">{mf.fact}</strong>
                        <p className="text-[11px] text-slate-500 mt-1">{mf.reason_needed}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      <Button
                        type="button"
                        variant="teal"
                        size="sm"
                        loading={creatingTaskFact === mf.fact}
                        onClick={() => handleCreateTaskFromMissingFact(mf)}
                      >
                        + Tạo Tác vụ Xác minh (/tasks)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddMissingFactToChecklist(mf)}
                      >
                        + Gắn vào Checklist
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Chưa phát hiện dữ kiện thiếu.</p>
            )}
          </div>

          {/* 2. HUMAN DECISION LAYER (Authoritative Decision SSOT) */}
          <div className="civic-card p-4 space-y-3 border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-dustguard-red" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  QUYẾT ĐỊNH CON NGƯỜI (HUMAN DECISION)
                </h3>
              </div>
              <span className="text-[10px] font-bold bg-red-50 text-dustguard-red px-1.5 py-0.5 rounded border border-red-200">
                Thẩm quyền
              </span>
            </div>

            <form onSubmit={handleSubmitHumanDecision} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">Chọn thao tác quyết định:</label>
                <select
                  value={selectedDecisionType}
                  onChange={e => setSelectedDecisionType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-dustguard-teal"
                >
                  <option value="ACCEPT_ASSESSMENT">1. Chấp thuận thẩm định (Accept Assessment)</option>
                  <option value="REQUEST_MORE_VERIFICATION">2. Yêu cầu xác minh thêm (Request More Verification)</option>
                  <option value="REJECT_ASSESSMENT">3. Bác bỏ thẩm định (Reject Assessment)</option>
                  <option value="SEND_TO_FIELD_INSPECTION">4. Chuyển kiểm tra hiện trường (Send to Field Inspection)</option>
                  <option value="SEND_TO_LEGAL_REVIEW">5. Chuyển rà soát pháp chế (Send to Legal Review)</option>
                  <option value="CLOSE_INSUFFICIENT_EVIDENCE">6. Đóng hồ sơ do chưa đủ chứng cứ (Close Insufficient)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">Căn cứ và lý do quyết định:</label>
                <textarea
                  rows={2}
                  value={decisionReason}
                  onChange={e => setDecisionReason(e.target.value)}
                  placeholder="Nhập nhận xét của cán bộ, căn cứ hồ sơ và lý do phê chuẩn..."
                  className="w-full p-2 border border-slate-300 rounded text-[11px] text-slate-800 outline-none focus:ring-2 focus:ring-dustguard-teal bg-white"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={decisionSubmitting}
                className="w-full"
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Ký Duyệt & Lưu Hồ Sơ Quyết Định
              </Button>
            </form>

            {/* Decision History */}
            {humanDecisionsList.length > 0 && (
              <div className="pt-2 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block uppercase tracking-wider">
                  Lịch sử quyết định đã ký ({humanDecisionsList.length}):
                </span>
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto scrollbar-thin pr-1">
                  {humanDecisionsList.map((dec: any) => (
                    <div key={dec.id} className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-dustguard-red">{dec.decision_type}</span>
                        <span className="text-slate-400">{new Date(dec.created_at).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <p className="text-slate-800 font-medium">{dec.reason}</p>
                      <span className="text-[10px] text-slate-500 block">Ký bởi: {dec.actor_name} ({dec.actor_role})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. FTS5 LEGAL RETRIEVAL PANEL */}
          <div className="civic-card p-4 space-y-3 border-slate-300">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-slate-500" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  VÙNG 3: NGUỒN PHÁP QUY (FTS5)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">SQLite FTS5</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  handleFtsSearch(e.target.value);
                }}
                placeholder="Tra từ khóa: che chắn, rửa xe..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded outline-none focus:ring-2 focus:ring-dustguard-teal bg-white"
              />
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
              {searchLoading ? (
                <p className="text-xs text-slate-400 text-center py-2">Đang tra cứu FTS5...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">Không tìm thấy điều khoản.</p>
              ) : (
                searchResults.slice(0, 5).map(res => (
                  <div
                    key={res.section_id}
                    onClick={() => {
                      setSelectedSection(res);
                      setReviewBasis(prev => prev ? `${prev}; ${res.section_number} - ${res.heading}` : `${res.section_number} - ${res.heading}`);
                    }}
                    className="p-2 rounded border border-slate-200 hover:border-dustguard-teal bg-white text-xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900 text-[11px]">{res.section_number}</strong>
                      <span className="text-[10px] text-dustguard-teal font-bold hover:underline">+ Gắn</span>
                    </div>
                    <p className="text-slate-700 text-[11px] mt-0.5">{res.heading}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FACT DETAIL MODAL */}
      {selectedFactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60">
          <div className="civic-card max-w-lg w-full p-6 space-y-4 shadow-xl border-slate-300 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                  {selectedFactModal.id}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{selectedFactModal.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFactModal(null)}
                className="text-slate-400 hover:text-slate-800 p-1 rounded"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Nội dung dữ kiện thực tế:</span>
                <p className="p-3 bg-slate-50 rounded border border-slate-200 font-medium text-slate-800 leading-relaxed">
                  {selectedFactModal.value}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block">Loại ngữ nghĩa (Semantic Type):</span>
                  <strong className="text-slate-900">{selectedFactModal.semantic_type}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block">Toàn vẹn (Integrity):</span>
                  <strong className={selectedFactModal.integrity_state === 'VERIFIED' ? 'text-emerald-700' : 'text-rose-700'}>
                    {selectedFactModal.integrity_state}
                  </strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block">Mã nguồn DB (Source ID):</span>
                  <strong className="font-mono text-slate-900">{selectedFactModal.source_id}</strong>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-400 block">Thời điểm ghi nhận:</span>
                  <strong className="text-slate-900">
                    {new Date(selectedFactModal.source_timestamp).toLocaleString('vi-VN')}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-200">
              <Button variant="outline" size="sm" onClick={() => setSelectedFactModal(null)}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
