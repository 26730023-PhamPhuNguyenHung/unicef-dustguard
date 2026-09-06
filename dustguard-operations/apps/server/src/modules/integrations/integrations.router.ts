import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { get, query, run, transaction } from '../../db/connection.js';
import { CommunityCaseImportSchema, CommunityFeedbackSchema } from '../../shared.js';

export const integrationsRouter = Router();

// Cross-side service auth: requires x-service-key to match INTEGRATION_SERVICE_KEY
// (env var, with a documented local-dev default -- never hardcode a production secret here).
const INTEGRATION_SERVICE_KEY = process.env.INTEGRATION_SERVICE_KEY || 'dustguard-internal-2026';

function requireServiceKey(req: Request, res: Response, next: NextFunction): void {
  const provided = req.headers['x-service-key'];
  if (!provided || provided !== INTEGRATION_SERVICE_KEY) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED_SERVICE',
        message: 'Missing or invalid x-service-key header for cross-side integration endpoint.',
      },
    });
    return;
  }
  next();
}

integrationsRouter.use(requireServiceKey);

// Ensure a normalized contractor row exists for a free-text contractor name,
// mirroring cases.router.ts's ensureContractorId so cross-side intake stays
// linked instead of leaving contractor_name as an orphaned string.
function ensureContractorId(name?: string | null): string | null {
  if (!name || !name.trim()) return null;
  const trimmed = name.trim();
  const existing = get<{ id: string }>(`SELECT id FROM contractors WHERE name = ?`, [trimmed]);
  if (existing) return existing.id;
  const newId = `ctr-${crypto.randomUUID().substring(0, 8)}`;
  run(
    `INSERT INTO contractors (id, name, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'))`,
    [newId, trimmed]
  );
  return newId;
}

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
      const updateContractorId = data.contractor_name ? ensureContractorId(data.contractor_name) : null;
      transaction(() => {
        run(
          `UPDATE cases
           SET source_report_count = source_report_count + ?,
               contractor_name = COALESCE(?, contractor_name),
               contractor_id = COALESCE(?, contractor_id),
               updated_at = datetime('now')
           WHERE id = ?`,
          [data.report_count, data.contractor_name || null, updateContractorId, existingCase.id]
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

    const newContractorId = data.contractor_name ? ensureContractorId(data.contractor_name) : null;

    transaction(() => {
      run(
        `INSERT INTO cases (id, case_code, title, description, location_text, district, latitude, longitude, source, source_reference, source_report_count, status, contractor_name, contractor_id, priority, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'TP.HCM', ?, ?, 'COMMUNITY', ?, ?, 'NEW', ?, ?, 'HIGH', datetime('now'), datetime('now'))`,
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
          newContractorId,
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

// POST /api/integrations/community/feedback - Receive citizen feedback from Community
integrationsRouter.post('/community/feedback', (req, res, next) => {
  try {
    const { external_case_id, case_code, rating, comment, is_satisfied, request_reinspection, user_name } =
      CommunityFeedbackSchema.parse(req.body);

    // Tìm vụ việc trên Operations
    let targetCase = external_case_id
      ? get<any>(`SELECT * FROM cases WHERE source_reference = ?`, [external_case_id])
      : null;

    if (!targetCase && case_code) {
      targetCase = get<any>(`SELECT * FROM cases WHERE case_code = ?`, [case_code]);
    }

    if (!targetCase) {
      res.status(200).json({ success: true, message: 'Vụ việc chưa liên kết trên Operations, bỏ qua.' });
      return;
    }

    transaction(() => {
      const feedbackNote = `Đánh giá từ người dân: ${rating}/5 sao (${is_satisfied ? 'Hài lòng' : 'Chưa hài lòng'})${comment ? ` - "${comment}"` : ''}${request_reinspection ? ' [YÊU CẦU PHÚC TRA]' : ''}`;

      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'CITIZEN_FEEDBACK', ?, 'citizen', 'CLOSURE', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          targetCase.id,
          user_name || 'Người dân cộng đồng',
          feedbackNote,
          JSON.stringify({ rating, comment, is_satisfied, request_reinspection }),
        ]
      );

      // Nếu có yêu cầu phúc tra và vụ việc đã đóng hoặc đang đóng -> chuyển sang REOPENED
      if (request_reinspection) {
        run(
          `UPDATE cases SET status = 'REOPENED', updated_at = datetime('now') WHERE id = ?`,
          [targetCase.id]
        );
      }
    });

    res.status(200).json({ success: true, message: 'Đã nhận và lưu phản hồi của người dân vào hồ sơ Operations.' });
  } catch (err) {
    next(err);
  }
});
