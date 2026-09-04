import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { get, query, run, transaction } from '../../db/connection.js';
import { CommunityCaseImportSchema } from '../../shared.js';

export const integrationsRouter = Router();

// POST /api/integrations/community/cases - Idempotent Case Intake from DustGuard Community
integrationsRouter.post('/community/cases', (req, res, next) => {
  try {
    const data = CommunityCaseImportSchema.parse(req.body);

    const payloadString = JSON.stringify(data);
    const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');

    // Check if external_case_id already imported
    const existingCase = get<any>(
      `SELECT * FROM cases WHERE source = 'COMMUNITY' AND source_reference = ?`,
      [data.external_case_id]
    );

    const logId = `int-${crypto.randomUUID().substring(0, 8)}`;

    if (existingCase) {
      // Idempotency: Update safe fields only, do not create duplicate
      transaction(() => {
        run(
          `UPDATE cases
           SET source_report_count = source_report_count + ?,
               contractor_name = COALESCE(?, contractor_name),
               updated_at = datetime('now')
           WHERE id = ?`,
          [data.report_count, data.contractor_name || null, existingCase.id]
        );

        // Record timeline for updated reports
        run(
          `INSERT INTO case_timeline (id, case_id, event_type, actor_name, actor_role, stage, description, metadata_json, created_at)
           VALUES (?, ?, 'COMMUNITY_UPDATE', 'Cộng đồng DustGuard', 'system', 'INTAKE', ?, ?, datetime('now'))`,
          [
            `tml-${crypto.randomUUID()}`,
            existingCase.id,
            `Cập nhật thêm ${data.report_count} phản ánh xác nhận mới từ cộng đồng. Tổng phản ánh: ${existingCase.source_report_count + data.report_count}`,
            JSON.stringify({ external_case_id: data.external_case_id }),
          ]
        );

        // Record integration log
        run(
          `INSERT INTO integration_logs (id, source, external_id, status, payload_hash, processed_at)
           VALUES (?, 'COMMUNITY', ?, 'SUCCESS', ?, datetime('now'))`,
          [logId, data.external_case_id, payloadHash]
        );
      });

      res.status(200).json({
        success: true,
        action: 'UPDATED',
        case_id: existingCase.id,
        case_code: existingCase.case_code,
        message: 'Hồ sơ đã tồn tại, hệ thống đã cập nhật tăng số lượt phản ánh an toàn.',
      });
      return;
    }

    // New case creation
    const newCaseId = `case-${crypto.randomUUID().substring(0, 8)}`;
    const countRow = get<{ c: number }>(`SELECT count(*) as c FROM cases`);
    const nextNum = (countRow?.c || 0) + 1;
    const case_code = data.case_code || `DG-2026-OP-${String(nextNum).padStart(3, '0')}`;

    transaction(() => {
      run(
        `INSERT INTO cases (id, case_code, title, description, location_text, district, latitude, longitude, source, source_reference, source_report_count, status, contractor_name, priority, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'TP.HCM', ?, ?, 'COMMUNITY', ?, ?, 'NEW', ?, 'HIGH', datetime('now'), datetime('now'))`,
        [
          newCaseId,
          case_code,
          data.title,
          data.description || data.summary || '',
          data.location || data.location_text || 'TP.HCM',
          data.latitude ?? data.lat ?? 10.7769,
          data.longitude ?? data.lng ?? 106.7009,
          data.external_case_id,
          data.report_count ?? (data.reports?.length || 1),
          data.contractor_name || null,
        ]
      );

      // Intake timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'CASE_IMPORTED', 'Cổng Tích Hợp DustGuard Community', 'integration', 'INTAKE', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          newCaseId,
          `Tiếp nhận tự động vụ việc từ DustGuard Community (Mã tham chiếu: ${data.external_case_id}) với ${data.report_count} phản ánh người dân.`,
          JSON.stringify({ external_case_id: data.external_case_id, confirmations: data.confirmation_count }),
        ]
      );

      // Attached initial evidence if any
      if (Array.isArray(data.evidence)) {
        for (const ev of data.evidence) {
          if (ev.file_path) {
            run(
              `INSERT INTO evidence_assets (id, case_id, source_type, file_path, file_name, mime_type, file_size, sha256, uploaded_by, created_at)
               VALUES (?, ?, 'CASE', ?, 'community_evidence.jpg', ?, 102400, ?, 'usr-admin-1', datetime('now'))`,
              [`evd-${crypto.randomUUID()}`, newCaseId, ev.file_path, ev.mime_type || 'image/jpeg', ev.sha256 || payloadHash]
            );
          }
        }
      }

      // Integration log
      run(
        `INSERT INTO integration_logs (id, source, external_id, status, payload_hash, processed_at)
         VALUES (?, 'COMMUNITY', ?, 'SUCCESS', ?, datetime('now'))`,
        [logId, data.external_case_id, payloadHash]
      );
    });

    res.status(200).json({
      success: true,
      action: 'CREATED_NEW',
      case_id: newCaseId,
      case_code,
      message: 'Hồ sơ vụ việc mới từ Community đã được tạo lập thành công trên DustGuard Operations.',
    });
  } catch (err) {
    next(err);
  }
});
