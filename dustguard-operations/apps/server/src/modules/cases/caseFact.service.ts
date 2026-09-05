import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { get, query } from '../../db/connection.js';
import { CaseFact, SemanticType, FactType, VerificationState, IntegrityState } from '../../shared.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../..');

/**
 * CaseFactService: Fact Aggregation Engine
 * Nguyên tắc: SOURCE -> FACT -> EVIDENCE -> INFERENCE -> HUMAN DECISION
 * Không sinh fact bằng AI. Toàn bộ facts được tổng hợp trực tiếp từ SQLite SSOT.
 */
export class CaseFactService {
  /**
   * Aggregate toàn bộ facts của một case từ SQLite và kiểm tra tính toàn vẹn mật mã học
   */
  public static aggregateCaseFacts(caseId: string): CaseFact[] {
    const facts: CaseFact[] = [];

    // 1. Case Metadata
    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [caseId]);
    if (!targetCase) {
      return facts;
    }

    facts.push({
      id: `FACT-META-${targetCase.id}`,
      fact_type: 'METADATA',
      semantic_type: 'DOCUMENT',
      title: `Hồ sơ tiếp nhận: ${targetCase.case_code}`,
      value: `Công trình "${targetCase.title}" tại ${targetCase.location_text}, ${targetCase.district}. Nhà thầu: ${targetCase.contractor_name || 'Chưa xác định'}. Mức ưu tiên: ${targetCase.priority}.`,
      source_type: 'SYSTEM',
      source_id: targetCase.id,
      source_timestamp: targetCase.created_at,
      verification_state: 'VERIFIED',
      integrity_state: 'VERIFIED',
      metadata: {
        case_code: targetCase.case_code,
        status: targetCase.status,
        district: targetCase.district,
        contractor_name: targetCase.contractor_name,
      },
    });

    // 2. Community Claims (Mặc định: semantic_type = CLAIM, verification_state = UNVERIFIED)
    if (targetCase.source === 'COMMUNITY' || targetCase.source_report_count > 0) {
      facts.push({
        id: `FACT-CLAIM-${targetCase.id}`,
        fact_type: 'COMMUNITY_CLAIM',
        semantic_type: 'CLAIM',
        title: `Phản ánh từ cộng đồng người dân (${targetCase.source_report_count} lượt ghi nhận)`,
        value: targetCase.description,
        source_type: 'COMMUNITY',
        source_id: targetCase.source_reference || targetCase.id,
        source_timestamp: targetCase.created_at,
        verification_state: 'UNVERIFIED',
        integrity_state: 'UNVERIFIED',
        metadata: {
          report_count: targetCase.source_report_count,
          source: targetCase.source,
        },
      });
    }

    // Community Signals liên kết
    const communitySignals = query<any>(
      `SELECT s.* FROM signals s
       JOIN case_signals cs ON s.id = cs.signal_id
       WHERE cs.case_id = ? AND s.source_type = 'COMMUNITY'`,
      [caseId]
    );

    for (const sig of communitySignals) {
      facts.push({
        id: `FACT-SIG-${sig.id}`,
        fact_type: 'COMMUNITY_CLAIM',
        semantic_type: 'CLAIM',
        title: `Tín hiệu phản ánh: ${sig.title}`,
        value: sig.description,
        source_type: 'COMMUNITY',
        source_id: sig.id,
        source_timestamp: sig.observed_at || sig.created_at,
        verification_state: 'UNVERIFIED',
        integrity_state: sig.integrity_status === 'VALID' ? 'VERIFIED' : 'UNVERIFIED',
        metadata: { signal_type: sig.signal_type },
      });
    }

    // 3. Inspection Observations & Checklist Results
    const inspections = query<any>(
      `SELECT i.*, u.full_name as inspector_name, it.name as template_name
       FROM inspections i
       LEFT JOIN users u ON i.inspector_id = u.id
       LEFT JOIN inspection_templates it ON i.template_id = it.id
       WHERE i.case_id = ?
       ORDER BY i.created_at ASC`,
      [caseId]
    );

    for (const insp of inspections) {
      const items = query<any>(
        `SELECT ii.*, ls.section_number as legal_section_number, ls.heading as legal_heading
         FROM inspection_items ii
         LEFT JOIN legal_sections ls ON ii.legal_section_id = ls.id
         WHERE ii.inspection_id = ?
         ORDER BY ii.sort_order ASC`,
        [insp.id]
      );

      for (const it of items) {
        facts.push({
          id: `FACT-ITEM-${it.id}`,
          fact_type: 'CHECKLIST_ITEM',
          semantic_type: 'OBSERVATION',
          title: `Tiêu chí kiểm tra: ${it.label}`,
          value: `Kết quả: ${it.status}${it.note ? ` - Ghi nhận: ${it.note}` : ''}${it.legal_section_number ? ` [${it.legal_section_number}]` : ''}`,
          source_type: 'INSPECTOR',
          source_id: it.id,
          source_timestamp: insp.performed_at || insp.scheduled_date || insp.created_at,
          created_by: insp.inspector_id,
          verification_state: insp.status === 'COMPLETED' ? 'VERIFIED' : 'PENDING',
          integrity_state: 'VERIFIED',
          metadata: {
            inspection_id: insp.id,
            status: it.status,
            legal_section_id: it.legal_section_id,
            evidence_asset_id: it.evidence_asset_id,
          },
        });
      }

      const findings = query<any>(
        `SELECT f.*, ls.section_number as legal_section_number, ls.heading as legal_heading
         FROM inspection_findings f
         LEFT JOIN legal_sections ls ON f.legal_section_id = ls.id
         WHERE f.inspection_id = ?
         ORDER BY f.created_at ASC`,
        [insp.id]
      );

      for (const f of findings) {
        facts.push({
          id: `FACT-FIND-${f.id}`,
          fact_type: 'INSPECTION_OBSERVATION',
          semantic_type: 'OBSERVATION',
          title: `Ghi nhận hiện trường không đạt chuẩn: ${f.finding}`,
          value: `${f.staff_note || f.finding} (Mức độ ảnh hưởng: ${f.severity})${f.legal_section_number ? ` [${f.legal_section_number}]` : ''}`,
          source_type: 'INSPECTOR',
          source_id: f.id,
          source_timestamp: f.created_at,
          created_by: insp.inspector_id,
          verification_state: 'VERIFIED',
          integrity_state: 'VERIFIED',
          metadata: {
            severity: f.severity,
            legal_section_id: f.legal_section_id,
            evidence_asset_id: f.evidence_asset_id,
          },
        });
      }
    }

    // 4. Evidence Assets với Kiểm định Toàn Vẹn SHA-256 đối chiếu đĩa cứng
    const evidenceList = query<any>(
      `SELECT ea.*, u.full_name as uploader_name
       FROM evidence_assets ea
       LEFT JOIN users u ON ea.uploaded_by = u.id
       WHERE ea.case_id = ?
       ORDER BY ea.created_at ASC`,
      [caseId]
    );

    for (const ev of evidenceList) {
      let currentIntegrity: IntegrityState = 'UNVERIFIED';
      const fullPath = path.join(PROJECT_ROOT, ev.file_path);

      if (!fs.existsSync(fullPath)) {
        currentIntegrity = 'FILE_MISSING';
      } else {
        try {
          const fileContent = fs.readFileSync(fullPath);
          const computedHash = crypto.createHash('sha256').update(fileContent).digest('hex');
          if (computedHash.toLowerCase() === (ev.sha256 || '').toLowerCase()) {
            currentIntegrity = 'VERIFIED';
          } else {
            currentIntegrity = 'TAMPERED';
          }
        } catch {
          currentIntegrity = 'INVALID';
        }
      }

      facts.push({
        id: `FACT-EV-${ev.id}`,
        fact_type: 'EVIDENCE_ASSET',
        semantic_type: 'DOCUMENT',
        title: `Tệp minh chứng: ${ev.file_name}`,
        value: `Định dạng ${ev.mime_type}, kích thước ${(ev.file_size / 1024).toFixed(1)} KB. Mã SHA-256: ${ev.sha256.substring(0, 16)}... Trạng thái toàn vẹn: ${currentIntegrity}.`,
        source_type: 'EVIDENCE',
        source_id: ev.id,
        source_timestamp: ev.captured_at || ev.created_at,
        created_by: ev.uploaded_by,
        verification_state: currentIntegrity === 'VERIFIED' ? 'VERIFIED' : 'REJECTED',
        integrity_state: currentIntegrity,
        metadata: {
          file_path: ev.file_path,
          file_name: ev.file_name,
          source_type: ev.source_type,
          sha256: ev.sha256,
        },
      });
    }

    // 5. IoT Telemetry Facts (Chỉ coi là Telemetry Fact, cấm tự suy luận thành vi phạm pháp luật)
    const iotSignals = query<any>(
      `SELECT s.* FROM signals s
       JOIN case_signals cs ON s.id = cs.signal_id
       WHERE cs.case_id = ? AND s.source_type = 'IOT'`,
      [caseId]
    );

    for (const iotSig of iotSignals) {
      facts.push({
        id: `FACT-IOT-${iotSig.id}`,
        fact_type: 'IOT_ANOMALY',
        semantic_type: 'TELEMETRY',
        title: `Quan trắc viễn thám IoT: ${iotSig.title}`,
        value: `${iotSig.description} (Dữ liệu quan trắc viễn thám chỉ mang giá trị định hướng rà soát thực địa, không thay thế phép đo kiểm chuẩn và quyết định của con người).`,
        source_type: 'IOT',
        source_id: iotSig.id,
        source_timestamp: iotSig.observed_at || iotSig.created_at,
        verification_state: 'VERIFIED',
        integrity_state: iotSig.integrity_status === 'VALID' ? 'VERIFIED' : 'INVALID',
        metadata: {
          device_code: iotSig.external_source_id,
          integrity_status: iotSig.integrity_status,
        },
      });
    }

    // 6. Legal Reviews
    const legalReviews = query<any>(
      `SELECT lr.*, u.full_name as reviewer_name
       FROM legal_reviews lr
       LEFT JOIN users u ON lr.reviewer_id = u.id
       WHERE lr.case_id = ?
       ORDER BY lr.created_at ASC`,
      [caseId]
    );

    for (const lr of legalReviews) {
      facts.push({
        id: `FACT-LREV-${lr.id}`,
        fact_type: 'LEGAL_REVIEW',
        semantic_type: 'DOCUMENT',
        title: `Thẩm tra pháp lý cán bộ: ${lr.status}`,
        value: `${lr.summary}${lr.legal_basis_note ? ` (Căn cứ viện dẫn: ${lr.legal_basis_note})` : ''}`,
        source_type: 'STAFF',
        source_id: lr.id,
        source_timestamp: lr.reviewed_at || lr.created_at,
        created_by: lr.reviewer_id,
        verification_state: lr.status === 'REVIEWED' ? 'VERIFIED' : 'PENDING',
        integrity_state: 'VERIFIED',
        metadata: { status: lr.status },
      });
    }

    // 7. Remediation Verifications
    const remedSubmissions = query<any>(
      `SELECT rs.*, u.full_name as reviewer_name
       FROM remediation_submissions rs
       LEFT JOIN users u ON rs.reviewed_by = u.id
       WHERE rs.case_id = ?
       ORDER BY rs.submitted_at ASC`,
      [caseId]
    );

    for (const rs of remedSubmissions) {
      facts.push({
        id: `FACT-REMED-${rs.id}`,
        fact_type: 'REMEDIATION_RESULT',
        semantic_type: 'OBSERVATION',
        title: `Hồ sơ khắc phục của đơn vị: ${rs.review_status}`,
        value: `${rs.description}${rs.review_note ? ` (Ý kiến nghiệm thu: ${rs.review_note})` : ''}`,
        source_type: 'STAFF',
        source_id: rs.id,
        source_timestamp: rs.reviewed_at || rs.submitted_at,
        created_by: rs.reviewed_by,
        verification_state: rs.review_status === 'APPROVED' ? 'VERIFIED' : 'PENDING',
        integrity_state: 'VERIFIED',
        metadata: { review_status: rs.review_status },
      });
    }

    // 8. Existing Human Decisions (semantic_type = HUMAN_DECISION)
    const decisions = query<any>(
      `SELECT * FROM human_decisions WHERE case_id = ? ORDER BY created_at ASC`,
      [caseId]
    );

    for (const dec of decisions) {
      facts.push({
        id: `FACT-DEC-${dec.id}`,
        fact_type: 'HUMAN_DECISION',
        semantic_type: 'HUMAN_DECISION',
        title: `Quyết định con người: ${dec.decision_type}`,
        value: `${dec.reason} (Ký duyệt bởi: ${dec.actor_name} - ${dec.actor_role}).`,
        source_type: 'SUPERVISOR',
        source_id: dec.id,
        source_timestamp: dec.created_at,
        created_by: dec.actor_id,
        verification_state: 'VERIFIED',
        integrity_state: 'VERIFIED',
        metadata: { decision_type: dec.decision_type },
      });
    }

    return facts;
  }
}
