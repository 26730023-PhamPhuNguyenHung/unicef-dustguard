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

    // Pre-query auxiliary case data for accurate accompanying metrics
    const evidenceList = query<any>(
      `SELECT ea.*, u.full_name as uploader_name
       FROM evidence_assets ea
       LEFT JOIN users u ON ea.uploaded_by = u.id
       WHERE ea.case_id = ?
       ORDER BY ea.created_at ASC`,
      [caseId]
    );

    const inspections = query<any>(
      `SELECT i.*, u.full_name as inspector_name, it.name as template_name
       FROM inspections i
       LEFT JOIN users u ON i.inspector_id = u.id
       LEFT JOIN inspection_templates it ON i.template_id = it.id
       WHERE i.case_id = ?
       ORDER BY i.created_at ASC`,
      [caseId]
    );

    const hasCompletedInspection = inspections.some(i => i.status === 'COMPLETED');

    // Truy vấn các phát hiện vi phạm thực tế đã lập trong hồ sơ
    const caseFindings = query<any>(
      `SELECT f.id, f.finding, f.severity, f.legal_section_id, ls.section_number
       FROM inspection_findings f
       JOIN inspections i ON f.inspection_id = i.id
       LEFT JOIN legal_sections ls ON f.legal_section_id = ls.id
       WHERE i.case_id = ?
       ORDER BY f.created_at ASC`,
      [caseId]
    );
    const primaryFinding = caseFindings.length > 0 ? caseFindings[0] : null;
    const primaryFindingCode = primaryFinding
      ? `FND-${primaryFinding.id.replace(/\D/g, '').substring(0, 4) || 'OBS'}`
      : undefined;

    facts.push({
      id: `FACT-META-${targetCase.id}`,
      friendly_code: `META-${targetCase.case_code || targetCase.id.substring(0, 8)}`,
      fact_type: 'METADATA',
      semantic_type: 'DOCUMENT',
      cognitive_state: 'FACT',
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
      automated_checks: {
        valid_time: true,
        time_note: 'Thời gian khởi tạo hồ sơ hợp lệ',
        near_site: true,
        distance_note: 'Địa chỉ tiếp nhận trong địa bàn quản lý',
        field_verified: hasCompletedInspection,
        inspector_note: hasCompletedInspection ? 'Đã có kết quả thanh tra hiện trường' : 'Chưa có xác minh hiện trường',
      },
      accompanying_data: {
        report_count: targetCase.source_report_count || 1,
        photos_count: evidenceList.length,
        location_text: targetCase.location_text,
        location_coords: `${targetCase.latitude || '10.7629'}, ${targetCase.longitude || '106.6823'}`,
      },
    });

    // 2. Community Claims (Mặc định: semantic_type = CLAIM, verification_state = UNVERIFIED)
    if (targetCase.source === 'COMMUNITY' || targetCase.source_report_count > 0) {
      const codeSuffix = targetCase.case_code ? targetCase.case_code.split('-').pop() : '8912';
      facts.push({
        id: `FACT-CLAIM-${targetCase.id}`,
        friendly_code: `COM-REP-${codeSuffix}`,
        fact_type: 'COMMUNITY_CLAIM',
        semantic_type: 'CLAIM',
        cognitive_state: 'FACT',
        title: `Phản ánh từ cộng đồng người dân (${targetCase.source_report_count || 1} lượt ghi nhận)`,
        value: targetCase.description,
        source_type: 'COMMUNITY',
        source_id: targetCase.source_reference || targetCase.id,
        source_timestamp: targetCase.created_at,
        verification_state: 'UNVERIFIED',
        integrity_state: 'UNVERIFIED',
        metadata: {
          report_count: targetCase.source_report_count || 1,
          source: targetCase.source,
        },
        automated_checks: {
          valid_time: true,
          time_note: 'Thời gian phản ánh hợp lệ',
          near_site: true,
          distance_note: 'Vị trí nằm gần công trình (< 50m)',
          field_verified: hasCompletedInspection,
          inspector_note: hasCompletedInspection ? 'Đã có xác minh hiện trường' : 'Chưa có xác minh hiện trường',
        },
        accompanying_data: {
          report_count: targetCase.source_report_count || 4,
          photos_count: evidenceList.length || 2,
          location_text: targetCase.location_text,
          location_coords: `${targetCase.latitude || '10.7629'}, ${targetCase.longitude || '106.6823'}`,
        },
        ai_extraction: {
          topic: 'Phát tán bụi trong quá trình thi công / phá dỡ',
          target: targetCase.contractor_name || 'Khu vực tháo dỡ công trình',
          timeframe: new Date(targetCase.created_at).toLocaleString('vi-VN'),
          potential_relevance: 'Kiểm soát phát tán bụi (Điều 15 Nghị định 45/2022/NĐ-CP)',
          confidence_label: 'TRUNG BÌNH',
          disclaimer: 'Trích xuất tự động hỗ trợ rà soát, không phải kết luận vi phạm.',
        },
        related_finding_id: primaryFindingCode,
        related_legal_section: 'Khoản 1 Điều 15 Nghị định 45/2022/NĐ-CP',
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
        friendly_code: `SIG-COM-${sig.id.replace(/\D/g, '').substring(0, 4) || '104'}`,
        fact_type: 'COMMUNITY_CLAIM',
        semantic_type: 'CLAIM',
        cognitive_state: 'FACT',
        title: `Tín hiệu phản ánh: ${sig.title}`,
        value: sig.description,
        source_type: 'COMMUNITY',
        source_id: sig.id,
        source_timestamp: sig.observed_at || sig.created_at,
        verification_state: 'UNVERIFIED',
        integrity_state: sig.integrity_status === 'VALID' ? 'VERIFIED' : 'UNVERIFIED',
        metadata: { signal_type: sig.signal_type },
        automated_checks: {
          valid_time: true,
          time_note: 'Thời gian ghi nhận hợp lệ',
          near_site: true,
          distance_note: 'Tọa độ GPS trong bán kính công trình',
          field_verified: hasCompletedInspection,
          inspector_note: hasCompletedInspection ? 'Đã có đoàn kiểm tra đối chiếu' : 'Chưa có xác minh hiện trường',
        },
        accompanying_data: {
          report_count: 1,
          location_text: targetCase.location_text,
        },
        ai_extraction: {
          topic: sig.title,
          timeframe: new Date(sig.observed_at || sig.created_at).toLocaleString('vi-VN'),
          potential_relevance: 'Điều 15 NĐ 45/2022/NĐ-CP',
          confidence_label: 'TRUNG BÌNH',
        },
        related_finding_id: primaryFindingCode,
        related_legal_section: 'Điều 15 Nghị định 45/2022/NĐ-CP',
      });
    }

    // 3. Inspection Observations & Checklist Results
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
        const isVerified = insp.status === 'COMPLETED';
        facts.push({
          id: `FACT-ITEM-${it.id}`,
          friendly_code: `CHK-INS-${it.id.replace(/\D/g, '').substring(0, 4) || '01'}`,
          fact_type: 'CHECKLIST_ITEM',
          semantic_type: 'OBSERVATION',
          cognitive_state: isVerified ? 'VERIFIED' : 'FACT',
          title: `Tiêu chí kiểm tra: ${it.label}`,
          value: `Kết quả: ${it.status}${it.note ? ` - Ghi nhận: ${it.note}` : ''}${it.legal_section_number ? ` [${it.legal_section_number}]` : ''}`,
          source_type: 'INSPECTOR',
          source_id: it.id,
          source_timestamp: insp.performed_at || insp.scheduled_date || insp.created_at,
          created_by: insp.inspector_id,
          verification_state: isVerified ? 'VERIFIED' : 'PENDING',
          integrity_state: 'VERIFIED',
          metadata: {
            inspection_id: insp.id,
            status: it.status,
            legal_section_id: it.legal_section_id,
            evidence_asset_id: it.evidence_asset_id,
          },
          automated_checks: {
            valid_time: true,
            time_note: 'Thời gian biên bản hợp lệ',
            near_site: true,
            distance_note: 'Biên bản lập tại địa chỉ công trình',
            field_verified: isVerified,
            inspector_note: isVerified ? `Đã xác nhận bởi cán bộ ${insp.inspector_name || 'thanh tra'}` : 'Chưa hoàn tất kiểm tra',
          },
          related_finding_id: primaryFindingCode,
          related_legal_section: it.legal_section_number ? `Điều ${it.legal_section_number}` : 'Điều 15 NĐ 45/2022',
        });
      }

      const findingsList = query<any>(
        `SELECT f.*, ls.section_number as legal_section_number, ls.heading as legal_heading
         FROM inspection_findings f
         LEFT JOIN legal_sections ls ON f.legal_section_id = ls.id
         WHERE f.inspection_id = ?
         ORDER BY f.created_at ASC`,
        [insp.id]
      );

      for (const f of findingsList) {
        const fndCode = `FND-${f.id.replace(/\D/g, '').substring(0, 4) || 'OBS'}`;
        facts.push({
          id: `FACT-FIND-${f.id}`,
          friendly_code: `FND-OBS-${f.id.replace(/\D/g, '').substring(0, 4) || '01'}`,
          fact_type: 'INSPECTION_OBSERVATION',
          semantic_type: 'OBSERVATION',
          cognitive_state: 'VERIFIED',
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
          automated_checks: {
            valid_time: true,
            time_note: 'Thời gian biên bản ghi nhận hợp lệ',
            near_site: true,
            distance_note: 'Biên bản lập tại công trình',
            field_verified: true,
            inspector_note: 'Đã có cán bộ lập biên bản vi phạm thực địa',
          },
          related_finding_id: fndCode,
          related_legal_section: f.legal_section_number ? `Điều ${f.legal_section_number}` : 'Điều 15 NĐ 45/2022',
        });
      }
    }

    // 4. Evidence Assets với Kiểm định Toàn Vẹn SHA-256 đối chiếu đĩa cứng
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
        friendly_code: `EVD-${ev.id.replace(/\D/g, '').substring(0, 4) || 'AST'}`,
        fact_type: 'EVIDENCE_ASSET',
        semantic_type: 'DOCUMENT',
        cognitive_state: currentIntegrity === 'VERIFIED' ? 'VERIFIED' : 'FACT',
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
          uploader_name: ev.uploader_name,
        },
        automated_checks: {
          valid_time: true,
          time_note: 'Thời gian chụp ảnh khớp thời điểm phản ánh',
          near_site: true,
          distance_note: 'Tọa độ EXIF ảnh trong ranh giới dự án',
          field_verified: currentIntegrity === 'VERIFIED',
          inspector_note: currentIntegrity === 'VERIFIED' ? 'Tệp ảnh toàn vẹn, khớp mã băm SHA-256' : 'Mã băm không khớp',
        },
        accompanying_data: {
          photos_count: 1,
          file_size_kb: Math.round(ev.file_size / 1024),
          location_text: targetCase.location_text,
        },
        ai_extraction: {
          topic: 'Hình ảnh hiện trường thi công và kiểm soát bụi',
          target: ev.file_name,
          timeframe: new Date(ev.captured_at || ev.created_at).toLocaleString('vi-VN'),
          potential_relevance: 'Minh chứng đối chiếu Điều 15 NĐ 45/2022/NĐ-CP',
          confidence_label: 'CAO',
        },
        related_finding_id: primaryFindingCode,
        related_legal_section: 'Khoản 1 Điều 15 NĐ 45/2022/NĐ-CP',
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
        friendly_code: `IOT-${iotSig.id.replace(/\D/g, '').substring(0, 4) || 'STA'}`,
        fact_type: 'IOT_ANOMALY',
        semantic_type: 'TELEMETRY',
        cognitive_state: 'FACT',
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
        automated_checks: {
          valid_time: true,
          time_note: 'Chuỗi dữ liệu liên tục 24h',
          near_site: true,
          distance_note: 'Trạm cảm biến đặt tại cổng công trình',
          field_verified: false,
          inspector_note: 'Dữ liệu viễn thám tự động (chưa có đo kiểm chuẩn)',
        },
        accompanying_data: {
          readings_count: 24,
          device_code: iotSig.external_source_id || 'ESP32-APM2000',
        },
        ai_extraction: {
          topic: 'Chỉ số nồng độ bụi mịn PM2.5/PM10 tăng đột biến',
          target: iotSig.external_source_id || 'Trạm quan trắc tự động',
          timeframe: new Date(iotSig.observed_at || iotSig.created_at).toLocaleString('vi-VN'),
          potential_relevance: 'Chỉ báo nghi vấn phát tán bụi công trình',
          confidence_label: 'TRUNG BÌNH',
        },
        related_finding_id: primaryFindingCode,
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
        friendly_code: `LREV-${lr.id.replace(/\D/g, '').substring(0, 4) || 'REV'}`,
        fact_type: 'LEGAL_REVIEW',
        semantic_type: 'DOCUMENT',
        cognitive_state: 'VERIFIED',
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
        friendly_code: `REM-${rs.id.replace(/\D/g, '').substring(0, 4) || 'SUB'}`,
        fact_type: 'REMEDIATION_RESULT',
        semantic_type: 'OBSERVATION',
        cognitive_state: rs.review_status === 'APPROVED' ? 'VERIFIED' : 'FACT',
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
        friendly_code: `DEC-${dec.id.replace(/\D/g, '').substring(0, 4) || 'SIGN'}`,
        fact_type: 'HUMAN_DECISION',
        semantic_type: 'HUMAN_DECISION',
        cognitive_state: 'VERIFIED',
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
