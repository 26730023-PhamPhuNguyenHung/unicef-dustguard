import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Scale,
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  ChevronRight,
  BookOpen,
  Send,
  Info,
  Clock,
  ExternalLink,
  Layers,
  ArrowRight,
  CheckSquare,
} from 'lucide-react';

interface DecisionSupportSectionProps {
  caseId: string;
  onRefreshCase?: () => void;
}

export const DecisionSupportSection: React.FC<DecisionSupportSectionProps> = ({
  caseId,
  onRefreshCase,
}) => {
  const { user, can } = useAuth();
  const { success, error } = useToast();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Explainability Drawer state
  const [selectedRuleTrace, setSelectedRuleTrace] = useState<any>(null);
  const [isExplainDrawerOpen, setIsExplainDrawerOpen] = useState(false);

  // Human Sign-off Form state
  const [decisionType, setDecisionType] = useState('CONFIRM_VIOLATION');
  const [rationale, setRationale] = useState('');
  const [submittingDecision, setSubmittingDecision] = useState(false);

  useEffect(() => {
    loadDecisionSupport();
  }, [caseId]);

  const loadDecisionSupport = async () => {
    try {
      setLoading(true);
      const res = await api.cases.decisionSupport(caseId);
      setData(res);
      if (res.humanReview?.latestDecision) {
        setRationale(res.humanReview.latestDecision.reason || '');
      }
    } catch (err: any) {
      error('Lỗi tải dữ liệu Hỗ trợ thẩm tra', err.detail || 'Không thể tính toán đối soát.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDecision = async () => {
    if (!rationale.trim()) {
      error('Thiếu thông tin', 'Vui lòng nhập lý do và căn cứ pháp lý thẩm tra.');
      return;
    }

    try {
      setSubmittingDecision(true);
      await api.cases.submitHumanDecision(caseId, {
        decisionType,
        reason: rationale,
        supersedesDecisionId: data?.humanReview?.latestDecision?.id || undefined,
        references: data?.legalReferences?.map((l: any) => l.sectionNumber) || [],
      });
      success('Ký nhận định thành công', 'Ý kiến chuyên viên đã được lưu vết bất biến vào hồ sơ vụ việc.');
      await loadDecisionSupport();
      if (onRefreshCase) onRefreshCase();
    } catch (err: any) {
      error('Lỗi ghi nhận quyết định', err.detail || 'Không thể lưu quyết định vào CSDL.');
    } finally {
      setSubmittingDecision(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full mb-3" />
        <p className="text-slate-600 font-medium">Đang đối soát dữ kiện, chứng cứ số và quy chuẩn pháp lý...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
        <Info className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <p className="text-slate-600 font-medium">Chưa có dữ liệu để đánh giá vụ việc này.</p>
      </div>
    );
  }

  const {
    assessment,
    risk,
    facts = [],
    evidenceMatrix = [],
    ruleTrace = [],
    legalReferences = [],
    contradictions = [],
    missingFacts = [],
    recommendedActions = [],
    sensorQuality,
    humanReview,
  } = data;

  return (
    <div className="space-y-6">
      {/* 0. Banner Pháp Lý Minh Bạch (Transparent Legal Banner) */}
      <div className="bg-amber-50 border-l-4 border-amber-600 p-4 rounded-r-lg">
        <div className="flex items-start gap-3">
          <Scale className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-amber-900">Nguyên tắc Hỗ trợ Quyết định Thẩm tra</h4>
            <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
              Hệ thống chỉ hỗ trợ tổng hợp dữ kiện, tra cứu quy chuẩn và đối soát quy tắc. Kết luận cuối cùng thuộc về cán bộ chuyên trách.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Tổng Quan Nhận Định & Điểm Ưu Tiên Rủi Ro (Assessment & Risk Scoring v2) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Nhận định sơ bộ */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Trạng thái đối soát dữ kiện
            </span>
            <span
              className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                assessment.status === 'HUMAN_CONFIRMED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : assessment.status === 'POSSIBLE_NON_COMPLIANCE'
                  ? 'bg-amber-100 text-amber-800'
                  : assessment.status === 'CONTRADICTORY_EVIDENCE'
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {assessment.statusLabel}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{assessment.explanation}</h3>
          <div className="mt-3 flex items-center gap-4 text-xs text-slate-600">
            <div>
              <span className="font-semibold text-slate-700">Độ chắc chắn:</span>{' '}
              <span className="font-bold text-slate-900">{assessment.certaintyLabel}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-700">Dữ kiện đã nạp:</span>{' '}
              <span className="font-bold text-slate-900">{facts.length} mục</span>
            </div>
          </div>
        </div>

        {/* Chỉ số ưu tiên rủi ro */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Chỉ số ưu tiên rủi ro
              </span>
              <span className="text-xs font-bold text-slate-700">
                Độ tin cậy: {Math.round(risk.confidence * 100)}%
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900">{risk.score}</span>
              <span className="text-sm font-semibold text-slate-500">/ 100</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">{risk.label}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-5 gap-1 text-center text-[10px] text-slate-500">
            <div>
              <div className="font-bold text-slate-800">{risk.breakdown?.baseSeverity}</div>
              <div>Cơ bản</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">{risk.breakdown?.spatialProximity}</div>
              <div>Vị trí</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">{risk.breakdown?.temporalDuration}</div>
              <div>Thời gian</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">{risk.breakdown?.recurrence}</div>
              <div>Tái diễn</div>
            </div>
            <div>
              <div className="font-bold text-slate-800">{risk.breakdown?.impactSurface}</div>
              <div>Lan tỏa</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Cảnh Báo Bất Thường / Mâu Thuẫn (Contradiction Warnings) */}
      {contradictions.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Phát hiện {contradictions.length} mâu thuẫn / bất thường trong hồ sơ chứng cứ</span>
          </div>
          <div className="space-y-2 mt-2">
            {contradictions.map((ctr: any) => (
              <div key={ctr.id} className="bg-white p-3 rounded-lg border border-rose-100 text-xs">
                <div className="font-bold text-slate-900">{ctr.title}</div>
                <div className="text-slate-600 mt-0.5">{ctr.description}</div>
                <div className="text-rose-700 font-medium mt-1">
                  Đề xuất xử lý: {ctr.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Bảng Ma Trận Chứng Cứ Đối Chứng (Evidence Matrix Table) */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">Ma trận chứng cứ & Quy chuẩn đối chiếu</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {evidenceMatrix.length} nhận định đã đối soát
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã & Nội dung nhận định</th>
                <th className="px-4 py-3">Nguồn dữ kiện đối chứng</th>
                <th className="px-4 py-3">Căn cứ quy chuẩn pháp luật</th>
                <th className="px-4 py-3">Trạng thái xác minh</th>
                <th className="px-4 py-3 text-right">Độ tin cậy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {evidenceMatrix.map((row: any) => (
                <tr key={row.findingId} className="hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs">
                    <div className="text-[11px] font-mono text-teal-700 font-bold mb-0.5">
                      {row.findingId}
                    </div>
                    <div>{row.statement}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      {row.sources.map((s: any) => (
                        <div key={s.id} className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              s.integrityState === 'VERIFIED'
                                ? 'bg-emerald-500'
                                : 'bg-rose-500'
                            }`}
                          />
                          <span className="text-slate-800 font-medium truncate max-w-[180px]">
                            {s.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {row.legalProvisions.length > 0 ? (
                      row.legalProvisions.map((lp: any) => (
                        <div key={lp.id} className="text-slate-700">
                          <span className="font-bold text-teal-800">{lp.number}:</span>{' '}
                          <span className="text-slate-600">{lp.heading}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">Chưa liên kết quy chuẩn cụ thể</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 font-bold rounded ${
                        row.verificationStatus.includes('TOÀN VẸN')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : row.verificationStatus.includes('CAN THIỆP')
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {row.verificationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-slate-800">
                    {Math.round(row.confidence * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Đối Soát Quy Tắc & Nút Mở Explainability Drawer */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">Đối soát quy tắc kiểm định (Rule Engine Trace)</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Phiên bản tập quy tắc: {data.engineMetadata?.ruleSetVersion}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ruleTrace.map((r: any) => (
            <div
              key={r.ruleId}
              onClick={() => {
                setSelectedRuleTrace(r);
                setIsExplainDrawerOpen(true);
              }}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                r.matched
                  ? 'border-teal-200 bg-teal-50/50 hover:bg-teal-50'
                  : 'border-slate-200 bg-white hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  {r.matched ? (
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-400" />
                  )}
                  {r.ruleTitle}
                </span>
                <span className="text-[10px] text-teal-700 font-bold underline flex items-center">
                  Vì sao? <ChevronRight className="w-3 h-3" />
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{r.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Dữ Kiện Còn Thiếu (Missing Facts) & Bước Xử Lý Đề Xuất (Next Best Action) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dữ kiện còn thiếu */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">Dữ kiện còn thiếu để kết luận</h3>
          </div>
          {missingFacts.length > 0 ? (
            <div className="space-y-2 text-xs">
              {missingFacts.map((mf: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="font-bold text-slate-800">• {mf.fact}</div>
                  <div className="text-slate-600 mt-0.5">Mục đích: {mf.reason_needed}</div>
                  <div className="text-teal-700 font-medium mt-1">
                    Đề xuất: {mf.recommended_verification_action}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-700 font-medium">Hồ sơ đã hội tụ đủ các nhóm dữ kiện cơ bản.</p>
          )}
        </div>

        {/* Bước xử lý đề xuất */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-teal-700" />
            <h3 className="text-sm font-bold text-slate-900">Các bước xử lý ưu tiên tiếp theo</h3>
          </div>
          <div className="space-y-2 text-xs">
            {recommendedActions.map((act: any) => (
              <div key={act.priority} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-teal-700 text-white flex items-center justify-center text-[10px]">
                      {act.priority}
                    </span>
                    {act.title}
                  </div>
                  <div className="text-slate-600 mt-1">{act.description}</div>
                  <div className="text-slate-500 italic mt-0.5">Lý do: {act.reason}</div>
                </div>
                <span className="shrink-0 px-2 py-1 bg-teal-100 text-teal-800 font-bold rounded text-[11px]">
                  {act.buttonLabel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Form Xác Nhận Của Chuyên Viên (Human Review & Sign-Off) */}
      <div className="bg-white p-5 rounded-xl border-2 border-teal-600 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">
              Xác nhận nhận định của Cán bộ Chuyên trách (Human Sign-off)
            </h3>
          </div>
          <span className="text-xs px-2 py-0.5 rounded font-bold bg-teal-50 text-teal-800 border border-teal-200">
            Thẩm quyền: {user?.full_name} ({user?.role})
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Loại nhận định / Quyết định:</label>
            <select
              value={decisionType}
              onChange={e => setDecisionType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            >
              <option value="CONFIRM_VIOLATION">Xác nhận có dấu hiệu vi phạm cần lập biên bản xử lý</option>
              <option value="REQUEST_MORE_VERIFICATION">Yêu cầu khảo sát / bổ sung ảnh chụp thực địa</option>
              <option value="ACCEPT_ASSESSMENT">Chấp thuận kết quả đối soát quy chuẩn môi trường</option>
              <option value="CLOSE_INSUFFICIENT_EVIDENCE">Đóng hồ sơ do không đủ căn cứ chứng cứ</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Căn cứ và Lý do xác nhận:</label>
            <textarea
              rows={3}
              value={rationale}
              onChange={e => setRationale(e.target.value)}
              placeholder="Nhập lý do thẩm tra, căn cứ điều khoản pháp lý và hướng xử lý..."
              className="w-full p-3 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500">
              * Nhận định sẽ được lưu vết bất biến trong Audit Log kèm chữ ký số tài khoản.
            </span>
            <Button
              onClick={handleSubmitDecision}
              disabled={submittingDecision}
              className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              {submittingDecision ? 'Đang lưu...' : 'Ký duyệt nhận định'}
            </Button>
          </div>
        </div>

        {/* Lịch sử quyết định trước đó nếu có */}
        {humanReview?.history && humanReview.history.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
              Lịch sử các lần ký nhận định:
            </h4>
            <div className="space-y-1.5 text-xs">
              {humanReview.history.map((h: any) => (
                <div key={h.id} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{h.actorName}</span>{' '}
                    <span className="text-slate-500">({h.actorRole}):</span>{' '}
                    <span className="text-slate-700 font-medium">{h.reason}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(h.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Explainability Side Drawer (Vì sao hệ thống đưa ra gợi ý này?) */}
      {isExplainDrawerOpen && selectedRuleTrace && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full p-6 shadow-2xl overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-slate-900 text-base">Giải trình đối soát quy tắc</h3>
              </div>
              <button
                onClick={() => setIsExplainDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div>
              <span className="text-xs font-mono text-teal-700 font-bold block mb-1">
                {selectedRuleTrace.ruleId}
              </span>
              <h4 className="text-lg font-bold text-slate-900">{selectedRuleTrace.ruleTitle}</h4>
              <p className="text-xs text-slate-600 mt-1">{selectedRuleTrace.explanation}</p>
            </div>

            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Các điều kiện đã đối soát:
              </h5>
              <div className="space-y-2 text-xs">
                {selectedRuleTrace.conditionsEvaluated?.map((cond: any, i: number) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border ${
                      cond.passed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span>Điều kiện: {cond.field}</span>
                      <span>{cond.passed ? '✓ Thỏa mãn' : '✗ Chưa đạt'}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Giá trị thực tế: <span className="font-mono">{String(cond.actualValue)}</span> | Kỳ vọng:{' '}
                      <span className="font-mono">{String(cond.expected)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
              Quy tắc được nạp từ tệp Declarative Rules SSOT v{selectedRuleTrace.version}, không sử dụng Generative AI đoán mò.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
