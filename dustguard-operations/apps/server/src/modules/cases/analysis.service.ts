import crypto from 'node:crypto';
import { get, query, run } from '../../db/connection.js';
import { CaseFactService } from './caseFact.service.js';
import {
  CaseFact,
  ConclusionLevel,
  AnalysisFinding,
  MissingFact,
  AnalysisRecommendedAction,
  EvidenceMatrixRow,
  AnalysisOutput,
  AnalysisOutputSchema,
} from '../../shared.js';

export interface RunAnalysisOptions {
  caseId: string;
  userId: string;
  userRole?: string;
  userName?: string;
  forceModel?: string;
}

export class CaseAnalysisService {
  /**
   * Chạy pipeline phân tích nghiêm ngặt 8 bước
   */
  public static runAnalysis(options: RunAnalysisOptions): {
    analysisRunId: string;
    output: AnalysisOutput;
    provider: string;
    created_at: string;
  } {
    const { caseId, userId } = options;

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [caseId]);
    if (!targetCase) {
      throw new Error(`Không tìm thấy hồ sơ với ID: ${caseId}`);
    }

    // -------------------------------------------------------------------------
    // BƯỚC A: Aggregate facts từ SQLite SSOT (Zero-AI)
    // -------------------------------------------------------------------------
    const facts = CaseFactService.aggregateCaseFacts(caseId);

    // -------------------------------------------------------------------------
    // BƯỚC B: Retrieve legal provisions từ SQLite / FTS5 (Không được invent citation)
    // -------------------------------------------------------------------------
    // Tìm kiếm các điều khoản liên quan đến bụi, công trình, rửa xe, che chắn
    let matchedSections: any[] = [];
    try {
      matchedSections = query(
        `SELECT s.id, s.section_number, s.heading, s.content, d.title as document_title, d.document_number
         FROM legal_sections_fts fts
         JOIN legal_sections s ON fts.id = s.id
         JOIN legal_documents d ON s.document_id = d.id
         WHERE legal_sections_fts MATCH 'bụi OR "che chắn" OR "rửa xe" OR "phun sương" OR "vận chuyển"'
         ORDER BY rank
         LIMIT 6`
      );
    } catch {
      matchedSections = query(
        `SELECT s.id, s.section_number, s.heading, s.content, d.title as document_title, d.document_number
         FROM legal_sections s
         JOIN legal_documents d ON s.document_id = d.id
         WHERE s.content LIKE '%bụi%' OR s.heading LIKE '%bụi%'
         LIMIT 6`
      );
    }

    // Map các điều khoản vào map để tra cứu
    const legalMap = new Map<string, any>();
    for (const sec of matchedSections) {
      legalMap.set(sec.id, sec);
    }

    // -------------------------------------------------------------------------
    // BƯỚC C & D: Phân tích Dữ kiện, Xác định Missing Facts & Evidence Matrix
    // -------------------------------------------------------------------------
    const claims = facts.filter(f => f.semantic_type === 'CLAIM');
    const observations = facts.filter(f => f.semantic_type === 'OBSERVATION');
    const evidenceAssets = facts.filter(f => f.fact_type === 'EVIDENCE_ASSET');
    const telemetry = facts.filter(f => f.semantic_type === 'TELEMETRY');
    const humanDecisions = facts.filter(f => f.semantic_type === 'HUMAN_DECISION');

    const verifiedEvidence = evidenceAssets.filter(
      e => e.integrity_state === 'VERIFIED' && e.verification_state === 'VERIFIED'
    );
    const tamperedEvidence = evidenceAssets.filter(
      e => e.integrity_state === 'TAMPERED' || e.integrity_state === 'FILE_MISSING'
    );

    const findings: AnalysisFinding[] = [];
    const missingFacts: MissingFact[] = [];
    const recommendedActions: AnalysisRecommendedAction[] = [];
    const evidenceMatrix: EvidenceMatrixRow[] = [];

    // 1. Kiểm tra Missing Facts (Tính năng quan trọng)
    const hasCompletedInspection = observations.some(
      o => o.fact_type === 'CHECKLIST_ITEM' && o.verification_state === 'VERIFIED'
    );

    if (!hasCompletedInspection) {
      missingFacts.push({
        fact: 'Biên bản kiểm tra hiện trường chính thức của đoàn thanh tra',
        reason_needed: 'Cần xác minh trực tiếp tại thực địa các biện pháp giảm thiểu bụi và hoạt động thi công',
        recommended_verification_action: 'Lập kế hoạch thanh tra hiện trường và phân công cán bộ khảo sát',
      });
    }

    // Kiểm tra thiếu ảnh chụp trạm rửa xe
    const mentionsWash = facts.some(f => f.value.toLowerCase().includes('rửa xe') || f.title.toLowerCase().includes('rửa xe'));
    const hasWashEvidence = verifiedEvidence.some(e => e.title.toLowerCase().includes('wash') || e.title.toLowerCase().includes('rửa xe'));
    if (mentionsWash && !hasWashEvidence) {
      missingFacts.push({
        fact: 'Ảnh chụp xác thực hoạt động của cầu/trạm rửa xe tự động áp lực cao tại cổng ra vào',
        reason_needed: 'Điều 15 NĐ 45/2022 yêu cầu phương tiện phải làm sạch bùn đất trước khi ra đường công cộng',
        recommended_verification_action: 'Yêu cầu cán bộ thanh tra chụp ảnh cận cảnh hệ thống rửa bánh xe khi thị sát',
      });
    }

    // Kiểm tra thiếu ảnh chụp che chắn lưới
    const hasMeshEvidence = verifiedEvidence.some(e => e.title.toLowerCase().includes('mesh') || e.title.toLowerCase().includes('lưới') || e.title.toLowerCase().includes('che chắn'));
    if (!hasMeshEvidence) {
      missingFacts.push({
        fact: 'Ảnh chụp kiểm tra độ phủ và tình trạng lưới chống bụi toàn bộ chu vi công trình',
        reason_needed: 'Xác định mức độ che chắn theo quy chuẩn kỹ thuật xây dựng và môi trường',
        recommended_verification_action: 'Chụp ảnh toàn cảnh bao quát các mặt tiếp giáp khu dân cư',
      });
    }

    // Cảnh báo nếu có bằng chứng bị can thiệp/mất tệp
    if (tamperedEvidence.length > 0) {
      missingFacts.push({
        fact: `Xác thực lại ${tamperedEvidence.length} tệp chứng cứ bị mất hoặc sai lệch mã băm SHA-256`,
        reason_needed: 'Toàn vẹn chứng cứ số học bị gián đoạn, không thể sử dụng tệp bị can thiệp làm căn cứ pháp lý',
        recommended_verification_action: 'Yêu cầu cán bộ hiện trường tải lại tệp gốc kèm chữ ký số',
      });
    }

    // 2. Xây dựng Findings có Grounding trực tiếp từ Facts
    // FINDING 1: Từ Quan sát hiện trường hoặc Phản ánh cộng đồng
    const failedItems = observations.filter(
      o => o.value.includes('FAIL') || o.fact_type === 'INSPECTION_OBSERVATION'
    );

    const hasHumanViolationConfirm = humanDecisions.some(
      h => h.value.includes('CONFIRM_VIOLATION') || h.title.includes('CONFIRM_VIOLATION')
    );

    if (failedItems.length > 0) {
      // Có quan sát thực địa không đạt
      const failedSources = failedItems.map(f => f.id);
      const relevantEvIds = verifiedEvidence.map(e => e.id);
      const combinedSourceIds = [...failedSources, ...relevantEvIds];

      const matchedLaw = matchedSections[0];
      const legalIds = matchedLaw ? [matchedLaw.id] : [];

      const statement = hasHumanViolationConfirm
        ? `Đã xác lập kết luận có hành vi không tuân thủ quy chuẩn kiểm soát bụi tại công trình ${targetCase.contractor_name || targetCase.title}`
        : `Dữ liệu thanh tra hiện trường ghi nhận ${failedItems.length} hạng mục có dấu hiệu chưa đạt chuẩn kiểm soát bụi`;

      const fId = `FND-01`;
      findings.push({
        id: fId,
        statement,
        source_ids: combinedSourceIds,
        legal_section_ids: legalIds,
        confidence: verifiedEvidence.length > 0 ? 0.85 : 0.65,
        requires_human_review: true,
      });

      evidenceMatrix.push({
        finding_id: fId,
        statement,
        sources: facts
          .filter(f => combinedSourceIds.includes(f.id))
          .map(f => ({
            id: f.id,
            title: f.title,
            semantic_type: f.semantic_type,
            verification_state: f.verification_state,
            integrity_state: f.integrity_state,
          })),
        legal_provisions: matchedLaw
          ? [
              {
                id: matchedLaw.id,
                number: `${matchedLaw.section_number} (${matchedLaw.document_number})`,
                heading: matchedLaw.heading,
                excerpt: matchedLaw.content.substring(0, 150) + '...',
              },
            ]
          : [],
        verification_status: verifiedEvidence.length > 0 ? 'ĐÃ ĐỐI CHỨNG CHỨNG CỨ SỐ' : 'CẦN XÁC MINH HIỆN TRƯỜNG',
        missing_items: missingFacts.map(m => m.fact),
        confidence: verifiedEvidence.length > 0 ? 0.85 : 0.65,
        requires_human_review: true,
      });
    } else if (claims.length > 0 || telemetry.length > 0) {
      // Chỉ có Claim hoặc Telemetry, CHƯA có inspection observation
      const claimSources = [...claims.map(c => c.id), ...telemetry.map(t => t.id)];
      const matchedLaw = matchedSections[0];
      const legalIds = matchedLaw ? [matchedLaw.id] : [];

      const statement = telemetry.length > 0
        ? `Cảm biến quan trắc ghi nhận chỉ số bất thường kết hợp ${claims.length} phản ánh cộng đồng, cần tổ chức đoàn kiểm tra xác minh`
        : `Ghi nhận ${claims.length} phản ánh cộng đồng về phát tán bụi (chưa qua xác minh kiểm tra thực địa)`;

      const fId = `FND-CLAIM-01`;
      findings.push({
        id: fId,
        statement,
        source_ids: claimSources,
        legal_section_ids: legalIds,
        confidence: 0.35, // Độ tin cậy thấp do chỉ là Claim/Telemetry
        requires_human_review: true,
      });

      evidenceMatrix.push({
        finding_id: fId,
        statement,
        sources: facts
          .filter(f => claimSources.includes(f.id))
          .map(f => ({
            id: f.id,
            title: f.title,
            semantic_type: f.semantic_type,
            verification_state: f.verification_state,
            integrity_state: f.integrity_state,
          })),
        legal_provisions: matchedLaw
          ? [
              {
                id: matchedLaw.id,
                number: `${matchedLaw.section_number} (${matchedLaw.document_number})`,
                heading: matchedLaw.heading,
                excerpt: matchedLaw.content.substring(0, 150) + '...',
              },
            ]
          : [],
        verification_status: 'CHƯA XÁC MINH (UNVERIFIED CLAIM / TELEMETRY)',
        missing_items: missingFacts.map(m => m.fact),
        confidence: 0.35,
        requires_human_review: true,
      });
    } else {
      // Chỉ có Metadata
      const metaSources = facts.filter(f => f.fact_type === 'METADATA').map(f => f.id);
      const fId = `FND-META-01`;
      findings.push({
        id: fId,
        statement: 'Chưa đủ dữ liệu hiện trường để đánh giá tuân thủ quy chuẩn môi trường',
        source_ids: metaSources.length > 0 ? metaSources : [`FACT-META-${caseId}`],
        legal_section_ids: [],
        confidence: 0.1,
        requires_human_review: true,
      });
    }

    // 3. Recommended Actions
    if (!hasCompletedInspection) {
      recommendedActions.push({
        action_type: 'SCHEDULE_FIELD_INSPECTION',
        reason: 'Hồ sơ chưa có biên bản kiểm tra hiện trường để kiểm chứng phản ánh',
        source_ids: claims.map(c => c.id),
        requires_human_approval: true,
      });
    }

    if (failedItems.length > 0) {
      recommendedActions.push({
        action_type: 'ISSUE_CORRECTIVE_ACTION',
        reason: 'Đã có ghi nhận không đạt chuẩn tại thực địa, cần ban hành thông báo yêu cầu nhà thầu khắc phục trong 48h',
        source_ids: failedItems.map(f => f.id),
        requires_human_approval: true,
      });
    }

    if (missingFacts.length > 0) {
      recommendedActions.push({
        action_type: 'REQUEST_VERIFICATION_EVIDENCE',
        reason: 'Còn các điều kiện quy chuẩn chưa có ảnh hoặc tài liệu đối chứng',
        source_ids: facts.map(f => f.id).slice(0, 2),
        requires_human_approval: false,
      });
    }

    // -------------------------------------------------------------------------
    // BƯỚC E: Tính toán Dynamic Confidence & Conclusion Level
    // -------------------------------------------------------------------------
    let conclusion_level: ConclusionLevel = 'INSUFFICIENT_EVIDENCE';

    if (hasHumanViolationConfirm) {
      conclusion_level = 'HUMAN_CONFIRMED';
    } else if (failedItems.length > 0 && verifiedEvidence.length > 0) {
      conclusion_level = 'SUPPORTED';
    } else if (failedItems.length > 0 || (telemetry.length > 0 && claims.length > 0)) {
      conclusion_level = 'PRELIMINARY';
    } else {
      conclusion_level = 'INSUFFICIENT_EVIDENCE';
    }

    // Tính toán confidence dựa trên tỷ lệ bằng chứng VERIFIED trên tổng số yêu cầu
    const totalRequiredCheckpoints = 3; // Lưới, rửa xe, biên bản
    const validEvidenceScore = verifiedEvidence.length >= 2 ? 0.9 : (verifiedEvidence.length === 1 ? 0.6 : 0.2);
    const inspectionScore = hasCompletedInspection ? 0.8 : 0.1;
    const computedConfidence = Math.min(
      0.95,
      Math.max(0.1, Math.round(((validEvidenceScore * 0.6 + inspectionScore * 0.4) * 100)) / 100)
    );

    // Cập nhật confidence vào findings
    for (const f of findings) {
      f.confidence = computedConfidence;
    }

    // -------------------------------------------------------------------------
    // BƯỚC F & G: Strict Schema & Citation Validation
    // -------------------------------------------------------------------------
    // 1. Reject bất kỳ finding nào có source_ids rỗng
    for (const f of findings) {
      if (!f.source_ids || f.source_ids.length === 0) {
        throw new Error(`Kiểm định thất bại: Finding "${f.id}" không có source_id trích dẫn.`);
      }
    }

    // 2. Reject nếu legal_section_ids không tồn tại trong DB
    for (const f of findings) {
      for (const secId of f.legal_section_ids) {
        const check = get(`SELECT id FROM legal_sections WHERE id = ?`, [secId]);
        if (!check) {
          throw new Error(`Kiểm định thất bại: Viện dẫn điều khoản pháp luật không tồn tại trong CSDL: ${secId}`);
        }
      }
    }

    // 3. Cấm AI / Rule Engine khẳng định vượt quá evidence
    for (const f of findings) {
      const lower = f.statement.toLowerCase();
      if (
        (lower.includes('chắc chắn vi phạm') ||
          lower.includes('đã vi phạm hoàn toàn') ||
          lower.includes('phải xử phạt') ||
          lower.includes('mức phạt chính xác')) &&
        !hasHumanViolationConfirm
      ) {
        throw new Error(`Kiểm định an toàn: Phát hiện từ ngữ phán quyết trái phép khi chưa có quyết định con người.`);
      }
    }

    const output: AnalysisOutput = {
      conclusion_level,
      findings,
      missing_facts: missingFacts,
      recommended_actions: recommendedActions,
      evidence_matrix: evidenceMatrix,
      disclaimer:
        'Lưu ý nghiệp vụ: Phân tích của Trợ lý Pháp lý chỉ mang tính chất tham vấn hỗ trợ chuyên môn, không thay thế kết luận thẩm tra của cán bộ pháp chế và kết quả thanh tra thực tế tại hiện trường.',
    };

    // Strict validation bằng Zod
    const validated = AnalysisOutputSchema.parse(output);

    // -------------------------------------------------------------------------
    // BƯỚC H: Lưu Snapshot bất biến vào bảng analysis_runs
    // -------------------------------------------------------------------------
    const runId = `ar-${crypto.randomUUID().substring(0, 8)}`;
    const now = new Date().toISOString();

    run(
      `INSERT INTO analysis_runs (id, case_id, created_at, created_by, model, prompt_version, fact_snapshot_json, legal_snapshot_json, output_json, validation_status)
       VALUES (?, ?, ?, ?, 'DUSTGUARD_LOCAL_ENGINE', 'provenance-v2.0', ?, ?, ?, 'VALID')`,
      [
        runId,
        caseId,
        now,
        userId,
        JSON.stringify(facts),
        JSON.stringify(matchedSections),
        JSON.stringify(validated),
      ]
    );

    return {
      analysisRunId: runId,
      output: {
        ...validated,
        evidence_matrix: evidenceMatrix,
      },
      provider: 'DUSTGUARD_LOCAL_ENGINE (Rule-Based Provenance SSOT)',
      created_at: now,
    };
  }
}
