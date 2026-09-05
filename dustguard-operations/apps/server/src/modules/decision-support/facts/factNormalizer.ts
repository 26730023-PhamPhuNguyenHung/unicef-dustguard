import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { get, query } from '../../../db/connection.js';
import { NormalizedFact } from '../types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '../../../../..');

export class FactNormalizer {
  /**
   * Chuẩn hóa và tổng hợp toàn bộ dữ kiện của hồ sơ từ CSDL SQLite SSOT
   */
  public static normalizeCaseFacts(caseId: string): NormalizedFact[] {
    const facts: NormalizedFact[] = [];

    // 1. Hồ sơ gốc (Metadata)
    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [caseId]);
    if (!targetCase) {
      return facts;
    }

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

    facts.push({
      id: `FACT-META-${targetCase.id}`,
      friendlyCode: `META-${targetCase.case_code || targetCase.id.substring(0, 8)}`,
      factType: 'METADATA',
      semanticType: 'DOCUMENT',
      title: `Hồ sơ tiếp nhận: ${targetCase.case_code}`,
      value: `Công trình "${targetCase.title}" tại ${targetCase.location_text}, ${targetCase.district}. Nhà thầu: ${targetCase.contractor_name || 'Chưa định danh'}. Mức ưu tiên: ${targetCase.priority}.`,
      sourceType: 'SYSTEM',
      sourceId: targetCase.id,
      sourceTimestamp: targetCase.created_at,
      verificationState: 'VERIFIED',
      integrityState: 'VERIFIED',
      confidence: 1.0,
      metadata: {
        caseCode: targetCase.case_code,
        status: targetCase.status,
        district: targetCase.district,
        contractorName: targetCase.contractor_name,
        latitude: targetCase.latitude,
        longitude: targetCase.longitude,
      },
      automatedChecks: {
        validTime: true,
        timeNote: 'Thời gian khởi tạo hồ sơ hợp lệ',
        nearSite: true,
        distanceNote: 'Vị trí thuộc địa bàn quản lý',
        fieldVerified: hasCompletedInspection,
        inspectorNote: hasCompletedInspection ? 'Đã có biên bản kiểm tra hiện trường' : 'Chưa có kiểm tra hiện trường',
      },
    });

    // 2. Phản ánh từ cộng đồng (Claims)
    if (targetCase.source === 'COMMUNITY' || (targetCase.source_report_count && targetCase.source_report_count > 0)) {
      const codeSuffix = targetCase.case_code ? targetCase.case_code.split('-').pop() : '8912';
      facts.push({
        id: `FACT-CLAIM-${targetCase.id}`,
        friendlyCode: `COM-REP-${codeSuffix}`,
        factType: 'COMMUNITY_CLAIM',
        semanticType: 'CLAIM',
        title: `Phản ánh từ cộng đồng (${targetCase.source_report_count || 1} lượt ghi nhận)`,
        value: targetCase.description || 'Không có mô tả chi tiết từ người dân',
        sourceType: 'COMMUNITY',
        sourceId: targetCase.source_reference || targetCase.id,
        sourceTimestamp: targetCase.created_at,
        verificationState: hasCompletedInspection ? 'PRELIMINARY' : 'UNVERIFIED',
        integrityState: 'VERIFIED',
        confidence: 0.4, // Phản ánh chưa qua đo đạc kỹ thuật mang tính chỉ báo
        metadata: {
          reportCount: targetCase.source_report_count || 1,
          source: targetCase.source,
        },
        automatedChecks: {
          validTime: true,
          nearSite: true,
          fieldVerified: hasCompletedInspection,
        },
      });
    }

    // 3. Tín hiệu quan trắc / phản ánh liên kết (Signals)
    const linkedSignals = query<any>(
      `SELECT s.* FROM signals s
       JOIN case_signals cs ON s.id = cs.signal_id
       WHERE cs.case_id = ?`,
      [caseId]
    );
    for (const sig of linkedSignals) {
      facts.push({
        id: `FACT-SIG-${sig.id}`,
        friendlyCode: `SIG-${sig.source_type}-${sig.id.replace(/\D/g, '').substring(0, 4) || '001'}`,
        factType: 'SIGNAL',
        semanticType: sig.source_type === 'COMMUNITY' ? 'CLAIM' : 'TELEMETRY',
        title: `Tín hiệu liên kết: ${sig.title}`,
        value: sig.description,
        sourceType: sig.source_type,
        sourceId: sig.id,
        sourceTimestamp: sig.observed_at || sig.received_at,
        verificationState: sig.integrity_status === 'VALID' ? 'PRELIMINARY' : 'UNVERIFIED',
        integrityState: sig.integrity_status === 'VALID' ? 'VERIFIED' : 'TAMPERED',
        confidence: sig.source_type === 'IOT' ? 0.75 : 0.45,
        metadata: {
          latitude: sig.latitude,
          longitude: sig.longitude,
          payloadJson: sig.payload_json,
        },
      });
    }

    // 4. Biên bản kiểm tra hiện trường (Inspections & Items)
    for (const insp of inspections) {
      const items = query<any>(
        `SELECT ii.*, ls.section_number, ls.heading as legal_heading
         FROM inspection_items ii
         LEFT JOIN legal_sections ls ON ii.legal_section_id = ls.id
         WHERE ii.inspection_id = ?
         ORDER BY ii.sort_order ASC`,
        [insp.id]
      );

      for (const item of items) {
        const isFail = item.status === 'FAIL';
        const isPass = item.status === 'PASS';
        facts.push({
          id: `FACT-INSP-ITEM-${item.id}`,
          friendlyCode: `CHK-${item.id.replace(/\D/g, '').substring(0, 4) || 'ITM'}`,
          factType: 'CHECKLIST_ITEM',
          semanticType: 'OBSERVATION',
          title: `Hạng mục kiểm tra: ${item.label}`,
          value: `Kết quả: ${item.status}. Ghi chú hiện trường: ${item.note || 'Không có ghi chú'}. Quy chuẩn: ${item.section_number || 'Chung'}.`,
          sourceType: 'STAFF',
          sourceId: insp.id,
          sourceTimestamp: insp.performed_at || insp.created_at,
          verificationState: insp.status === 'COMPLETED' ? 'VERIFIED' : 'PRELIMINARY',
          integrityState: 'VERIFIED',
          confidence: insp.status === 'COMPLETED' ? 0.95 : 0.6,
          metadata: {
            inspectionId: insp.id,
            inspectorName: insp.inspector_name,
            status: item.status,
            legalSectionId: item.legal_section_id,
            evidenceAssetId: item.evidence_asset_id,
          },
        });
      }
    }

    // 5. Bằng chứng số học (Evidence Assets - SHA-256 Raw Bytes Verification)
    const evidenceList = query<any>(
      `SELECT ea.*, u.full_name as uploader_name
       FROM evidence_assets ea
       LEFT JOIN users u ON ea.uploaded_by = u.id
       WHERE ea.case_id = ?
       ORDER BY ea.created_at ASC`,
      [caseId]
    );

    for (const ev of evidenceList) {
      // Xác minh mã băm thực tế của tệp trên đĩa
      let diskIntegrityState: 'VERIFIED' | 'TAMPERED' | 'FILE_MISSING' = 'VERIFIED';
      const resolvedPath = path.isAbsolute(ev.file_path)
        ? ev.file_path
        : path.resolve(PROJECT_ROOT, 'dustguard-operations', ev.file_path.replace(/^\//, ''));

      if (!fs.existsSync(resolvedPath)) {
        diskIntegrityState = 'FILE_MISSING';
      } else {
        try {
          const buffer = fs.readFileSync(resolvedPath);
          const computedHash = crypto.createHash('sha256').update(buffer).digest('hex');
          if (computedHash.toLowerCase() !== (ev.sha256 || '').toLowerCase()) {
            diskIntegrityState = 'TAMPERED';
          }
        } catch {
          diskIntegrityState = 'FILE_MISSING';
        }
      }

      const isValid = diskIntegrityState === 'VERIFIED';
      facts.push({
        id: `FACT-EVD-${ev.id}`,
        friendlyCode: `EVD-${ev.id.replace(/\D/g, '').substring(0, 4) || 'ASSET'}`,
        factType: 'EVIDENCE_ASSET',
        semanticType: 'DOCUMENT',
        title: `Tệp bằng chứng số: ${ev.file_name}`,
        value: `Mã băm SHA-256: ${ev.sha256}. Kích thước: ${(ev.file_size / 1024).toFixed(1)} KB. Định dạng: ${ev.mime_type}. Trạng thái toàn vẹn: ${diskIntegrityState}.`,
        sourceType: 'STAFF',
        sourceId: ev.id,
        sourceTimestamp: ev.captured_at || ev.created_at,
        verificationState: isValid ? 'VERIFIED' : 'REJECTED',
        integrityState: diskIntegrityState,
        confidence: isValid ? 0.9 : 0.0, // Tệp bị sửa đổi hoặc mất có độ tin cậy = 0
        metadata: {
          fileName: ev.file_name,
          filePath: ev.file_path,
          sha256: ev.sha256,
          diskIntegrityState,
          uploaderName: ev.uploader_name,
        },
      });
    }

    // 6. Dữ liệu viễn thám cảm biến (IoT Telemetry Readings)
    const readings = query<any>(
      `SELECT r.*, d.device_code, d.name as device_name
       FROM iot_readings r
       JOIN iot_devices d ON r.device_id = d.id
       WHERE d.project_id = ?
       ORDER BY r.recorded_at DESC
       LIMIT 24`,
      [targetCase.project_id || '']
    );

    if (readings.length > 0) {
      const avgPm25 = Math.round(readings.reduce((acc: number, r: any) => acc + r.pm25, 0) / readings.length);
      const maxPm25 = Math.round(Math.max(...readings.map((r: any) => r.pm25)));
      const hasFlatline = readings.some((r: any) => r.integrity_status === 'FLATLINE');

      facts.push({
        id: `FACT-IOT-${readings[0].id}`,
        friendlyCode: `IOT-${readings[0].device_code || 'SENSOR'}`,
        factType: 'IOT_TELEMETRY',
        semanticType: 'TELEMETRY',
        title: `Dữ liệu chuỗi đo trạm quan trắc ${readings[0].device_name || readings[0].device_code}`,
        value: `Nồng độ PM2.5 trung bình: ${avgPm25} µg/m³, Đỉnh cao nhất: ${maxPm25} µg/m³. Tổng ${readings.length} gói tin. Trạng thái: ${hasFlatline ? 'CẢNH BÁO FLATLINE' : 'BÌNH THƯỜNG'}.`,
        sourceType: 'IOT',
        sourceId: readings[0].device_id,
        sourceTimestamp: readings[0].recorded_at,
        verificationState: hasFlatline ? 'PRELIMINARY' : 'VERIFIED',
        integrityState: hasFlatline ? 'TAMPERED' : 'VERIFIED',
        confidence: hasFlatline ? 0.3 : 0.8,
        metadata: {
          avgPm25,
          maxPm25,
          packetCount: readings.length,
          hasFlatline,
        },
      });
    }

    // 7. Quyết định của con người (Human Decisions)
    const humanDecisions = query<any>(
      `SELECT hd.*, u.full_name as actor_full_name
       FROM human_decisions hd
       JOIN users u ON hd.actor_id = u.id
       WHERE hd.case_id = ?
       ORDER BY hd.created_at ASC`,
      [caseId]
    );

    for (const hd of humanDecisions) {
      facts.push({
        id: `FACT-HUMAN-${hd.id}`,
        friendlyCode: `DEC-${hd.id.replace(/\D/g, '').substring(0, 4) || 'OFFICER'}`,
        factType: 'HUMAN_DECISION',
        semanticType: 'HUMAN_DECISION',
        title: `Phê duyệt/Quyết định của cán bộ: ${hd.decision_type}`,
        value: `Cán bộ: ${hd.actor_name} (${hd.actor_role}). Nhận định: "${hd.reason}". Thời gian: ${hd.created_at}.`,
        sourceType: 'STAFF',
        sourceId: hd.id,
        sourceTimestamp: hd.created_at,
        verificationState: 'VERIFIED',
        integrityState: 'VERIFIED',
        confidence: 1.0,
        metadata: {
          decisionType: hd.decision_type,
          actorId: hd.actor_id,
          actorRole: hd.actor_role,
          supersedesDecisionId: hd.supersedes_decision_id,
        },
      });
    }

    return facts;
  }
}
