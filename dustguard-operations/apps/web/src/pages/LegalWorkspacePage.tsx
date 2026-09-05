import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { StatusBadge } from '../components/case/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import {
  SideDrawer,
  BottomActionBar,
  DecisionModal,
  RecordNavigation,
} from '../components/workspace';
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
  ChevronDown,
  ChevronUp,
  FileSearch,
} from 'lucide-react';
import { CaseFact, SemanticType, ConclusionLevel, HumanDecisionType } from '@dustguard-operations/shared';

export const LegalWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, can } = useAuth();
  const { success, error, info } = useToast();

  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Active Workspace Tab: 'matrix' | 'worksheet' | 'checklist' | 'decision'
  const [activeTab, setActiveTab] = useState<'matrix' | 'worksheet' | 'checklist' | 'decision'>('matrix');

  // Drawers state (Workspace-first overlay pattern)
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isMissingDrawerOpen, setIsMissingDrawerOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);

  // Facts state
  const [facts, setFacts] = useState<CaseFact[]>([]);
  const [factsLoading, setFactsLoading] = useState(false);
  const [factFilter, setFactFilter] = useState<'ALL' | 'CLAIM' | 'OBSERVATION' | 'EVIDENCE' | 'TELEMETRY' | 'HUMAN_DECISION'>('ALL');
  const [highlightedFactId, setHighlightedFactId] = useState<string | null>(null);
  const [selectedFactModal, setSelectedFactModal] = useState<CaseFact | null>(null);

  // Analysis & Evidence Matrix state
  const [analysis, setAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // FTS5 Legal Retrieval state
  const [searchQuery, setSearchQuery] = useState('bụi');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSection, setSelectedSection] = useState<any>(null);
  const [showFtsPanel, setShowFtsPanel] = useState(false);

  // Human Decision state
  const [decisionSubmitting, setDecisionSubmitting] = useState(false);
  const [humanDecisionsList, setHumanDecisionsList] = useState<any[]>([]);

  // Task creation from missing fact
  const [creatingTaskFact, setCreatingTaskFact] = useState<string | null>(null);

  // Reasoning worksheet state
  const [signOfViolation, setSignOfViolation] = useState('Có dấu hiệu phát tán bụi ra môi trường xung quanh do biện pháp che chắn chưa hoàn thiện');
  const [reviewBasis, setReviewBasis] = useState('');

  // Field checklist generator state
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

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      const res = await api.legal.analyze(id!);
      const outputData = res.analysis?.output || res.analysis;
      setAnalysis(outputData);
      success('Thẩm tra thành công', `Đã liên kết ${outputData.findings?.length || 0} nhận định và ${outputData.missing_facts?.length || 0} dữ kiện còn thiếu.`);
    } catch (err: any) {
      error('Lỗi phân tích căn cứ thực tế', err.detail || err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCitationClick = (sourceId: string) => {
    setHighlightedFactId(sourceId);
    const targetFact = facts.find(f => f.id === sourceId || f.source_id === sourceId);
    if (targetFact) {
      setSelectedFactModal(targetFact);
    } else {
      setIsEvidenceDrawerOpen(true);
      info('Bằng chứng thực tế', `Nguồn xác thực: ${sourceId}`);
    }
  };

  const handleSubmitDecisionFromModal = async (decisionType: HumanDecisionType, reason: string) => {
    try {
      setDecisionSubmitting(true);
      await api.cases.submitDecision(id!, {
        decision_type: decisionType,
        reason,
        conclusion_level: analysis?.conclusion_level || 'HUMAN_CONFIRMED',
        legal_section_ids: selectedSection ? [selectedSection.id] : [],
      });

      success('Phê duyệt thành công', 'Quyết định của cán bộ đã được ký duyệt và ghi nhận bền vững vào hồ sơ.');
      setIsDecisionModalOpen(false);
      await loadWorkspace();
      await loadFacts();
      setActiveTab('decision');
    } catch (err: any) {
      error('Lỗi lưu quyết định', err.detail || err.message);
    } finally {
      setDecisionSubmitting(false);
    }
  };

  const handleCreateTaskFromMissingFact = async (mf: any) => {
    try {
      setCreatingTaskFact(mf.fact);
      const res = await api.cases.createTaskFromMissingFact(id!, {
        missing_fact: mf.fact,
        reason_needed: mf.reason_needed,
        target_role: 'INSPECTOR',
      });
      success('Đã tạo tác vụ', `Tác vụ [${res.task.task_code}] đã được đẩy vào Hàng đợi Nhiệm vụ.`);
    } catch (err: any) {
      error('Lỗi tạo tác vụ', err.detail || err.message);
    } finally {
      setCreatingTaskFact(null);
    }
  };

  const handleAddMissingFactToChecklist = (mf: any) => {
    setChecklistOnsite(prev => [...prev, `[Cần xác minh] ${mf.fact}`]);
    success('Đã gắn vào Checklist', 'Dữ kiện còn thiếu đã được thêm vào tiêu chí kiểm tra hiện trường.');
    setActiveTab('checklist');
    setIsMissingDrawerOpen(false);
  };

  const handleExportChecklistToTask = async () => {
    try {
      setExportingChecklist(true);
      const allItems = [
        ...checklistBefore.map(i => `[Chuẩn bị] ${i}`),
        ...checklistOnsite.map(i => `[Hiện trường] ${i}`),
        ...checklistEvidence.map(i => `[Minh chứng] ${i}`),
      ];

      await api.tasks.create({
        case_id: id,
        title: `Kiểm tra hiện trường theo Checklist thẩm tra: ${caseData?.case?.case_code || id}`,
        description: `Danh sách tiêu chí kiểm tra hiện trường (${allItems.length} mục):\n\n${allItems.join('\n')}`,
        type: 'INSPECTION',
        priority: 'MEDIUM',
        target_role: 'INSPECTOR',
      });

      success('Xuất Checklist thành công', 'Checklist đã được chuyển thành nhiệm vụ giao cho cán bộ hiện trường.');
    } catch (err: any) {
      error('Lỗi xuất Checklist', err.detail || err.message);
    } finally {
      setExportingChecklist(false);
    }
  };

  // Helper to format clean, human-friendly evidence source tags
  const getFriendlySourceTag = (srcId: string, idx: number) => {
    const fact = facts.find(f => f.id === srcId || f.source_id === srcId);
    if (fact) {
      if (fact.semantic_type === 'OBSERVATION') return `Hiện trường ${idx + 1}`;
      if (fact.semantic_type === 'TELEMETRY') return `IoT ${idx + 1}`;
      if (fact.semantic_type === 'CLAIM') return `Claim ${idx + 1}`;
      if (fact.fact_type === 'EVIDENCE_ASSET' || (fact.semantic_type as string) === 'DOCUMENT') return `Bằng chứng ${idx + 1}`;
      if (fact.semantic_type === 'HUMAN_DECISION') return `Quyết định ${idx + 1}`;
    }
    if (srcId.includes('OBSERVATION') || srcId.includes('inspection')) return `Hiện trường ${idx + 1}`;
    if (srcId.includes('TELEMETRY') || srcId.includes('iot')) return `IoT ${idx + 1}`;
    if (srcId.includes('EVIDENCE') || srcId.includes('asset')) return `Bằng chứng ${idx + 1}`;
    return `Hồ sơ ${idx + 1}`;
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-ink-500 animate-pulse text-sm">
        Đang nạp không gian thẩm tra pháp lý...
      </div>
    );
  }

  const c = caseData?.case || {};
  const evidence = caseData?.evidence || [];
  const missingFacts = analysis?.missing_facts || [];

  const filteredFacts = facts.filter(f => {
    if (factFilter === 'ALL') return true;
    if (factFilter === 'EVIDENCE') {
      return f.fact_type === 'EVIDENCE_ASSET' || (f.semantic_type as string) === 'DOCUMENT';
    }
    return f.semantic_type === (factFilter as any);
  });

  const confidencePercent = Math.round((analysis?.confidence || 0.44) * 100);

  return (
    <div className="w-full min-w-0 space-y-4 pb-16">
      {/* =================================================================== */}
      {/* 1. LEGAL HEADER (Clean, Compact, Dominant Red CTA & Triggers)       */}
      {/* =================================================================== */}
      <div className="bg-surface border border-slate-200/90 rounded-lg p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Top row: Back link, Case Code, Status Badge, Missing Data Trigger */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/cases/${id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-ink-600 hover:text-dustguard-red transition-colors mr-1 cursor-pointer"
                title="Quay lại chi tiết vụ việc"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Chi tiết</span>
              </Link>
              <span className="font-mono text-xs font-bold text-dustguard-red bg-dustguard-redSoft border border-dustguard-redBorder px-2 py-0.5 rounded">
                {c.case_code || id}
              </span>
              <StatusBadge status={c.status} />

              {/* Missing Data Drawer Trigger */}
              {missingFacts.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsMissingDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded hover:bg-amber-100 transition-colors cursor-pointer"
                  title="Mở bảng dữ kiện còn thiếu"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Thiếu {missingFacts.length} dữ kiện</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Đủ dữ kiện</span>
                </span>
              )}
            </div>

            {/* Case Title */}
            <h1 className="text-lg sm:text-xl font-bold text-ink-900 leading-snug">
              {c.title || 'Hồ sơ thẩm tra căn cứ thực tế'}
            </h1>

            {/* Subtle Subtitle */}
            <div className="flex flex-wrap items-center gap-x-2 text-xs text-ink-500 pt-0.5">
              <span>Thẩm tra dữ liệu thực tế</span>
              <span className="text-ink-300">•</span>
              <span className="font-medium text-ink-600">
                SOURCE → FACT → EVIDENCE → INFERENCE → HUMAN DECISION
              </span>
            </div>
          </div>

          {/* Right Header Actions: Evidence Drawer Trigger & Run Analysis CTA */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Evidence Drawer Trigger Button */}
            <Button
              type="button"
              variant="secondary"
              size="md"
              icon={<Layers className="w-4 h-4 text-dustguard-red" />}
              onClick={() => setIsEvidenceDrawerOpen(true)}
              className="font-semibold shadow-2xs"
              title="Mở danh sách dữ kiện hồ sơ"
            >
              Bằng chứng · {facts.length}
            </Button>

            {/* Dominant Primary CTA */}
            <Button
              variant="primary"
              size="md"
              loading={analyzing}
              icon={<Sparkles className="w-4 h-4" />}
              onClick={handleRunAnalysis}
              className="shadow-xs font-semibold"
            >
              Chạy thẩm tra căn cứ thực tế
            </Button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. LEGAL NAVIGATION TABS (Horizontal, High Contrast)                */}
      {/* =================================================================== */}
      <RecordNavigation
        tabs={[
          {
            id: 'matrix',
            label: 'Ma trận bằng chứng',
            icon: <Sparkles className="w-4 h-4" />,
            count: analysis?.findings?.length,
          },
          {
            id: 'worksheet',
            label: 'Phiếu lập luận',
            icon: <Scale className="w-4 h-4" />,
          },
          {
            id: 'checklist',
            label: 'Checklist',
            icon: <ListChecks className="w-4 h-4" />,
            count: checklistBefore.length + checklistOnsite.length + checklistEvidence.length,
          },
          {
            id: 'decision',
            label: 'Quyết định',
            icon: <FileCheck className="w-4 h-4" />,
            count: humanDecisionsList.length,
          },
        ]}
        activeTab={activeTab}
        onTabChange={tabId => setActiveTab(tabId as any)}
      />

      {/* =================================================================== */}
      {/* 3. MAIN LEGAL CANVAS (Single Wide Canvas >= 800px)                 */}
      {/* =================================================================== */}
      <div className="w-full min-w-0">
        {/* TAB 1: MA TRẬN BẰNG CHỨNG */}
        {activeTab === 'matrix' && (
          <div className="civic-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between border-b border-slate-100 pb-3.5 gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-ink-900">
                  Ma trận bằng chứng & nhận định đối chứng
                </h2>
                <p className="text-xs text-ink-500 mt-0.5">
                  Mỗi nhận định nghiệp vụ được chứng minh qua nguồn chứng cứ số và đối chiếu căn cứ pháp lý.
                </p>
              </div>
              <Badge variant="success" size="sm" className="shrink-0 self-start">
                Nguồn dữ liệu thật (D1 SSOT)
              </Badge>
            </div>

            {!analysis ? (
              <EmptyState
                icon={<Sparkles className="w-6 h-6 text-dustguard-red" />}
                title="Chưa có kết quả thẩm tra"
                description="Bấm 'Chạy thẩm tra căn cứ thực tế' để đối chiếu dữ kiện viễn thám IoT, ảnh hiện trường và căn cứ pháp quy."
                actionLabel="Chạy thẩm tra ngay"
                onAction={handleRunAnalysis}
                actionLoading={analyzing}
              />
            ) : (
              <div className="space-y-5">
                {/* Top Summary: Conclusion Status, Confidence Bar & Metrics */}
                <div className="p-4 bg-surface-subtle rounded-lg border border-slate-200/90 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink-700">Trạng thái kết luận:</span>
                      {analysis.conclusion_level === 'HUMAN_CONFIRMED' && (
                        <Badge variant="red" size="md">Lãnh đạo đã ký duyệt</Badge>
                      )}
                      {analysis.conclusion_level === 'SUPPORTED' && (
                        <Badge variant="success" size="md">Đã đối chứng đầy đủ</Badge>
                      )}
                      {analysis.conclusion_level === 'PRELIMINARY' && (
                        <Badge variant="warning" size="md">Dấu hiệu sơ bộ (Cần xác minh)</Badge>
                      )}
                      {(!analysis.conclusion_level || analysis.conclusion_level === 'INSUFFICIENT_EVIDENCE') && (
                        <Badge variant="neutral" size="md">Chưa đủ căn cứ</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-ink-600">
                        Nhận định đã đối chứng: <strong className="text-ink-900">{analysis.findings?.length || 0}</strong>
                      </span>
                      <span className="text-ink-300">•</span>
                      <span className="font-semibold text-ink-600">
                        Dữ kiện còn thiếu: <strong className="text-amber-800">{missingFacts.length}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-bold text-ink-800">
                      <span>Độ tin cậy dữ liệu (Data Confidence):</span>
                      <span className="text-dustguard-red">{confidencePercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-dustguard-red h-full transition-all duration-500 rounded-full"
                        style={{ width: `${confidencePercent}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-ink-500 pt-0.5">
                      * Đối chứng trực tiếp mã băm SHA-256 tệp ảnh, định vị GPS hiện trường và chuỗi số liệu IoT.
                    </p>
                  </div>
                </div>

                {/* Finding Cards */}
                {analysis?.findings && analysis.findings.length > 0 ? (
                  <div className="space-y-3.5">
                    <h3 className="text-xs font-bold text-ink-800 uppercase tracking-wider">
                      Danh sách nhận định ({analysis.findings.length}):
                    </h3>

                    {analysis.findings.map((f: any, idx: number) => {
                      if (!f.source_ids || f.source_ids.length === 0) return null;

                      return (
                        <div
                          key={f.id || idx}
                          className="p-4 rounded-lg border border-slate-200/90 bg-white space-y-3 shadow-xs hover:border-slate-300 transition-colors"
                        >
                          {/* Finding Top Row */}
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex items-start gap-2.5">
                              <span className="font-mono text-xs bg-ink-900 text-white px-2 py-0.5 rounded font-bold shrink-0 mt-0.5">
                                {f.id}
                              </span>
                              <p className="text-sm font-bold text-ink-900 leading-snug">
                                {f.statement}
                              </p>
                            </div>
                            <Badge variant="warning" size="sm" className="shrink-0 self-start">
                              Cần cán bộ duyệt
                            </Badge>
                          </div>

                          {/* Evidence Sources (Clean Friendly Tags) */}
                          <div className="space-y-1.5 pt-1">
                            <span className="text-xs font-semibold text-ink-600 block">Nguồn chứng cứ đối chiếu:</span>
                            <div className="flex flex-wrap items-center gap-2">
                              {f.source_ids.map((srcId: string, sIdx: number) => {
                                const tagLabel = getFriendlySourceTag(srcId, sIdx);
                                return (
                                  <button
                                    key={srcId}
                                    type="button"
                                    onClick={() => handleCitationClick(srcId)}
                                    className="px-2.5 py-1 rounded text-xs font-semibold bg-surface-subtle hover:bg-dustguard-redSoft text-ink-800 hover:text-dustguard-red border border-slate-200/90 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                                    title="Bấm để xem chi tiết chứng cứ"
                                  >
                                    <span>[{tagLabel}]</span>
                                    <ExternalLink className="w-3 h-3 text-ink-400" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Legal Basis */}
                          {f.legal_section_ids && f.legal_section_ids.length > 0 && (
                            <div className="p-3 bg-surface-subtle rounded-md border border-slate-200/80 text-xs space-y-1.5">
                              <span className="font-semibold text-ink-700 block">Căn cứ pháp lý viện dẫn:</span>
                              <div className="space-y-1">
                                {f.legal_section_ids.map((secId: string) => {
                                  const label = secId.includes('15')
                                    ? 'Khoản 1 Điều 15 Nghị định 45/2022/NĐ-CP (Quy định kiểm soát bụi công trình)'
                                    : `Căn cứ pháp quy [${secId}]`;
                                  return (
                                    <div key={secId} className="flex items-center gap-2 text-ink-800 font-medium">
                                      <Scale className="w-3.5 h-3.5 text-dustguard-red shrink-0" />
                                      <span>{label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Actions: Xem bằng chứng & Đối chiếu căn cứ */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 justify-end">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                if (f.source_ids[0]) {
                                  handleCitationClick(f.source_ids[0]);
                                } else {
                                  setIsEvidenceDrawerOpen(true);
                                }
                              }}
                              icon={<Layers className="w-3.5 h-3.5" />}
                            >
                              Xem bằng chứng
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setActiveTab('worksheet');
                                setShowFtsPanel(true);
                              }}
                              icon={<Scale className="w-3.5 h-3.5" />}
                            >
                              Đối chiếu căn cứ
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : null}

                {/* Disclaimer */}
                {analysis?.disclaimer && (
                  <div className="p-3.5 bg-amber-50/80 rounded-md border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5 leading-relaxed">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>{analysis.disclaimer}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PHIẾU LẬP LUẬN */}
        {activeTab === 'worksheet' && (
          <div className="civic-card p-5 sm:p-6 space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base sm:text-lg font-bold text-ink-900">
                Phiếu lập luận thẩm tra thực tế
              </h2>
              <p className="text-xs text-ink-500 mt-0.5">
                Cấu trúc lập luận: Dấu hiệu vi phạm → Căn cứ dữ liệu thực tế → Điều khoản pháp quy tương ứng.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="block font-bold text-ink-800 text-xs">
                  1. Dấu hiệu cần xem xét:
                </label>
                <input
                  type="text"
                  value={signOfViolation}
                  onChange={e => setSignOfViolation(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-md font-medium text-ink-900 outline-none focus:ring-2 focus:ring-dustguard-red bg-white text-xs"
                />
              </div>

              <div className="p-4 bg-surface-subtle border border-slate-200/90 rounded-md space-y-2 text-xs">
                <span className="font-bold text-ink-800 block text-xs">
                  2. Căn cứ dữ liệu tại hiện trường:
                </span>
                <ul className="list-disc list-inside space-y-1 text-ink-700 font-medium">
                  <li>{evidence.length} tệp ảnh minh chứng hiện trường đã tiếp nhận và băm SHA-256.</li>
                  <li>{c.source_report_count || 1} lượt phản ánh ghi nhận từ người dân ({c.source || 'Cộng đồng'}).</li>
                  <li>Công trình: {c.contractor_name || 'Đang xác minh'} tại {c.location_text || 'Địa bàn quận'}.</li>
                  <li>{facts.length} dữ kiện hồ sơ đã được đồng bộ vào hệ thống.</li>
                </ul>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink-800 block text-xs">
                    3. Quy định pháp luật liên quan:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFtsPanel(!showFtsPanel)}
                    className="text-xs font-semibold text-dustguard-red hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{showFtsPanel ? 'Thu gọn tra cứu' : 'Tra cứu quy định (FTS5)'}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={reviewBasis}
                  onChange={e => setReviewBasis(e.target.value)}
                  placeholder="Nhập điều khoản hoặc chọn từ công cụ Tra cứu pháp quy bên dưới..."
                  className="w-full p-2.5 border border-slate-300 rounded-md text-xs text-ink-900 outline-none focus:ring-2 focus:ring-dustguard-red bg-white font-mono"
                />
              </div>

              {/* FTS5 Search Panel */}
              {showFtsPanel && (
                <div className="p-4 bg-surface-subtle rounded-md border border-slate-200/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink-800 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-dustguard-red" />
                      <span>Tra cứu pháp quy toàn văn (SQLite FTS5)</span>
                    </span>
                    <span className="text-[10px] text-ink-400 font-mono">BM25 RANKED</span>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-ink-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => {
                        setSearchQuery(e.target.value);
                        handleFtsSearch(e.target.value);
                      }}
                      placeholder="Tra từ khóa: che chắn, rửa xe, bụi, công trình..."
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md outline-none focus:ring-2 focus:ring-dustguard-red bg-white"
                    />
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto scrollbar-thin pr-1">
                    {searchResults.map((sec: any) => (
                      <div
                        key={sec.id}
                        onClick={() => {
                          setSelectedSection(sec);
                          setReviewBasis(prev => prev ? `${prev}\n• [${sec.section_number}] ${sec.document_title}: ${sec.title}` : `• [${sec.section_number}] ${sec.document_title}: ${sec.title}`);
                          success('Đã gắn căn cứ', `Điều khoản [${sec.section_number}] đã được gắn vào phiếu lập luận.`);
                        }}
                        className="p-2.5 rounded-md border border-slate-200 hover:border-dustguard-red bg-white text-xs cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-ink-900">{sec.section_number} - {sec.document_title}</span>
                          <span className="text-xs text-dustguard-red font-bold hover:underline">+ Gắn vào lập luận</span>
                        </div>
                        <p className="text-ink-600 text-xs line-clamp-2 mt-1">{sec.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: CHECKLIST */}
        {activeTab === 'checklist' && (
          <div className="civic-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-ink-900">
                  Bộ tạo Checklist thanh tra hiện trường
                </h2>
                <p className="text-xs text-ink-500 mt-0.5">
                  Xuất danh sách tiêu chí kiểm tra trực tiếp cho cán bộ hiện trường theo chuẩn nghiệp vụ.
                </p>
              </div>
              <Badge variant="default" size="sm">
                {checklistBefore.length + checklistOnsite.length + checklistEvidence.length} tiêu chí
              </Badge>
            </div>

            {/* Checklist Groups */}
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-ink-800 flex items-center gap-1.5 text-xs">
                  <Activity className="w-4 h-4 text-dustguard-red" />
                  <span>Tiêu chí kiểm tra tại hiện trường ({checklistOnsite.length})</span>
                </span>
                <div className="space-y-1.5">
                  {checklistOnsite.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 p-2.5 bg-surface-subtle rounded-md border border-slate-200/80 text-ink-800">
                      <span>• {item}</span>
                      <button
                        type="button"
                        onClick={() => setChecklistOnsite(prev => prev.filter((_, i) => i !== idx))}
                        className="text-ink-400 hover:text-dustguard-red p-1 cursor-pointer"
                        title="Xóa tiêu chí"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add checklist item */}
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={e => setNewChecklistItem(e.target.value)}
                  placeholder="Thêm tiêu chí kiểm tra mới..."
                  className="flex-1 p-2.5 border border-slate-300 rounded-md text-xs outline-none bg-white focus:ring-2 focus:ring-dustguard-red"
                />
                <Button
                  type="button"
                  variant="secondary"
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

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  loading={exportingChecklist}
                  icon={<ListChecks className="w-4 h-4" />}
                  onClick={handleExportChecklistToTask}
                >
                  Xuất sang Hàng đợi Nhiệm vụ (/tasks)
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: QUYẾT ĐỊNH CÁN BỘ & LỊCH SỬ KÝ DUYỆT */}
        {activeTab === 'decision' && (
          <div className="civic-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-ink-900">
                  Quyết định cán bộ & Lịch sử ký duyệt
                </h2>
                <p className="text-xs text-ink-500 mt-0.5">
                  AI và hệ thống chỉ đưa ra đề xuất căn cứ; cán bộ có thẩm quyền là người ra quyết định pháp lý cuối cùng.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Send className="w-3.5 h-3.5" />}
                onClick={() => setIsDecisionModalOpen(true)}
              >
                Ra quyết định mới
              </Button>
            </div>

            {humanDecisionsList.length === 0 ? (
              <EmptyState
                icon={<Lock className="w-6 h-6 text-dustguard-red" />}
                title="Chưa có quyết định nào được ký duyệt"
                description="Bấm 'Ra quyết định mới' hoặc sử dụng thanh tác vụ bên dưới để ký duyệt và ban hành quyết định xử lý."
                actionLabel="Ký duyệt quyết định"
                onAction={() => setIsDecisionModalOpen(true)}
              />
            ) : (
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-ink-800 uppercase tracking-wider">
                  Lịch sử quyết định đã ban hành ({humanDecisionsList.length}):
                </h3>
                <div className="space-y-3">
                  {humanDecisionsList.map((dec: any) => (
                    <div
                      key={dec.id}
                      className="p-4 bg-white rounded-lg border border-slate-200/90 shadow-xs space-y-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-dustguard-red text-sm">{dec.decision_type}</span>
                          <Badge variant="red" size="sm">Đã có hiệu lực</Badge>
                        </div>
                        <span className="text-xs text-ink-400 font-mono">
                          {new Date(dec.created_at).toLocaleString('vi-VN')}
                        </span>
                      </div>

                      <p className="text-ink-800 text-xs font-medium leading-relaxed">
                        {dec.reason}
                      </p>

                      <div className="flex items-center justify-between text-xs text-ink-500 pt-2 border-t border-slate-100">
                        <span>Cán bộ ký duyệt: <strong className="text-ink-700">{dec.actor_name}</strong></span>
                        <span className="font-mono text-[11px] text-ink-400">ID: {dec.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 4. STICKY BOTTOM ACTION BAR (Decision Flow)                        */}
      {/* =================================================================== */}
      <BottomActionBar
        conclusionLevel={analysis?.conclusion_level || 'PRELIMINARY'}
        confidencePercent={confidencePercent}
        secondaryLabel="Yêu cầu xác minh"
        onSecondaryAction={() => {
          setIsMissingDrawerOpen(true);
        }}
        primaryLabel="Ra quyết định →"
        onPrimaryAction={() => setIsDecisionModalOpen(true)}
      />

      {/* =================================================================== */}
      {/* 5. EVIDENCE DRAWER (Right Slide-over 380-420px)                     */}
      {/* =================================================================== */}
      <SideDrawer
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        title="Dữ kiện hồ sơ"
        subtitle="Hồ sơ dữ kiện chân thực SSOT"
        badge={
          <Badge variant="neutral" size="sm">
            {facts.length} mục
          </Badge>
        }
      >
        <div className="space-y-3">
          {/* Segmented Filter Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-surface-subtle border border-slate-200/80 rounded-md text-[11px] font-medium text-ink-600">
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
                className={`py-1 px-2 rounded text-center transition-all cursor-pointer whitespace-nowrap ${
                  factFilter === tab.key
                    ? 'bg-white text-dustguard-red font-bold shadow-xs'
                    : 'hover:text-ink-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Compact Evidence Cards */}
          <div className="space-y-2.5">
            {factsLoading ? (
              <p className="text-xs text-ink-400 text-center py-8 animate-pulse">Đang nạp dữ kiện D1...</p>
            ) : filteredFacts.length === 0 ? (
              <p className="text-xs text-ink-400 text-center py-8">Không có dữ kiện thuộc nhóm này.</p>
            ) : (
              filteredFacts.map((fact, idx) => {
                const isHighlighted = highlightedFactId === fact.id || highlightedFactId === fact.source_id;

                let badgeVariant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'red' = 'default';
                let semanticLabel: string = fact.semantic_type;

                if (fact.semantic_type === 'CLAIM') {
                  badgeVariant = 'warning';
                  semanticLabel = 'Claim dân cư';
                } else if (fact.semantic_type === 'OBSERVATION') {
                  badgeVariant = 'info';
                  semanticLabel = 'Hiện trường';
                } else if (fact.fact_type === 'EVIDENCE_ASSET') {
                  if (fact.integrity_state === 'VERIFIED') {
                    badgeVariant = 'success';
                    semanticLabel = 'Bằng chứng (SHA-256)';
                  } else {
                    badgeVariant = 'danger';
                    semanticLabel = 'Bằng chứng (Chờ)';
                  }
                } else if (fact.semantic_type === 'TELEMETRY') {
                  badgeVariant = 'default';
                  semanticLabel = 'IoT Sensor';
                } else if (fact.semantic_type === 'HUMAN_DECISION') {
                  badgeVariant = 'red';
                  semanticLabel = 'Quyết định';
                }

                return (
                  <div
                    key={fact.id}
                    onClick={() => setSelectedFactModal(fact)}
                    className={`p-3 rounded-md border text-xs cursor-pointer transition-all ${
                      isHighlighted
                        ? 'bg-dustguard-redSoft border-dustguard-redBorder border-l-3 border-l-dustguard-red shadow-xs'
                        : 'border-slate-200/90 bg-white hover:bg-surface-subtle hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono font-semibold text-[10px] text-ink-500 bg-surface-subtle px-1.5 py-0.5 rounded border border-slate-200/60">
                        {fact.id.split('-').slice(0, 3).join('-')}
                      </span>
                      <Badge variant={badgeVariant} size="sm">
                        {semanticLabel}
                      </Badge>
                    </div>

                    <p className="font-semibold text-ink-900 text-xs leading-snug">
                      {fact.title}
                    </p>

                    <p className="text-ink-600 mt-1 line-clamp-2 text-[11px] leading-relaxed font-normal">
                      {fact.value}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-ink-400">
                      <span>Nguồn: {fact.source_type}</span>
                      <span>{new Date(fact.source_timestamp).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </SideDrawer>

      {/* =================================================================== */}
      {/* 6. MISSING DATA DRAWER (Right Slide-over 380-420px)                  */}
      {/* =================================================================== */}
      <SideDrawer
        isOpen={isMissingDrawerOpen}
        onClose={() => setIsMissingDrawerOpen(false)}
        title="Dữ kiện còn thiếu"
        subtitle="Các dữ kiện nghiệp vụ cần bổ sung để đủ căn cứ ra quyết định"
        badge={
          <Badge variant="warning" size="sm">
            {missingFacts.length} mục
          </Badge>
        }
      >
        <div className="space-y-3">
          {missingFacts.length === 0 ? (
            <div className="p-4 flex items-center gap-2.5 text-xs text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Đầy đủ dữ kiện, không phát hiện thiếu sót.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {missingFacts.map((mf: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-lg border border-amber-200/80 text-xs space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-ink-900 block leading-tight text-xs">{mf.fact}</strong>
                      <p className="text-[11px] text-ink-600 mt-1 leading-relaxed">{mf.reason_needed}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      loading={creatingTaskFact === mf.fact}
                      onClick={() => handleCreateTaskFromMissingFact(mf)}
                      className="font-semibold"
                    >
                      + Tạo tác vụ xác minh
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddMissingFactToChecklist(mf)}
                    >
                      + Gắn checklist
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SideDrawer>

      {/* =================================================================== */}
      {/* 7. DECISION MODAL (Human-in-the-loop Signing Modal)                 */}
      {/* =================================================================== */}
      <DecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        onSubmitDecision={handleSubmitDecisionFromModal}
        submitting={decisionSubmitting}
        caseCode={c.case_code || id || ''}
        caseTitle={c.title || ''}
        conclusionLevel={analysis?.conclusion_level || 'PRELIMINARY'}
        confidencePercent={confidencePercent}
        findingsCount={analysis?.findings?.length || 0}
        missingFacts={missingFacts}
        selectedLegalBasis={selectedSection ? `${selectedSection.section_number}: ${selectedSection.title}` : undefined}
      />

      {/* =================================================================== */}
      {/* 8. FACT DETAIL MODAL (SHA-256 Inspection)                           */}
      {/* =================================================================== */}
      {selectedFactModal && (
        <div className="fixed inset-0 bg-ink-900/50 flex items-center justify-center p-4 z-50 animate-fade-in select-none">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-ink-600 bg-surface-subtle px-2 py-0.5 rounded">
                  {selectedFactModal.id}
                </span>
                <Badge variant="red" size="sm">
                  {selectedFactModal.semantic_type}
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFactModal(null)}
                className="p-1 text-ink-400 hover:text-ink-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <h4 className="text-sm font-bold text-ink-900">{selectedFactModal.title}</h4>
            <div className="p-3 bg-surface-subtle rounded border border-slate-200 text-xs leading-relaxed text-ink-800">
              {selectedFactModal.value}
            </div>

            <div className="text-[11px] text-ink-500 space-y-1">
              <div>Nguồn trích xuất: <strong className="text-ink-700">{selectedFactModal.source_type}</strong> ({selectedFactModal.source_id})</div>
              <div>Thời gian ghi nhận: {new Date(selectedFactModal.source_timestamp).toLocaleString('vi-VN')}</div>
              {(selectedFactModal.metadata?.stored_sha256 || selectedFactModal.metadata?.sha256 || (selectedFactModal as any).integrity_hash) && (
                <div className="font-mono text-[10px] text-ink-400 truncate">
                  SHA-256: {selectedFactModal.metadata?.stored_sha256 || selectedFactModal.metadata?.sha256 || (selectedFactModal as any).integrity_hash}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedFactModal(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
