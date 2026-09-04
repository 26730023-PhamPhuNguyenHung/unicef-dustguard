import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { get, query, run, transaction } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';
import { CaseClosureSchema, CaseReopenSchema } from '../../shared.js';

export const closuresRouter = Router();

// POST /api/cases/:id/close - Close case with 4-condition validation
closuresRouter.post('/:id/close', requirePermission('case:close'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { closure_reason, closure_summary } = CaseClosureSchema.parse(req.body);

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!targetCase) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
      return;
    }

    if (targetCase.status === 'CLOSED') {
      res.status(400).json({ error: 'Vụ việc này đã được đóng trước đó.' });
      return;
    }

    // Check Condition 1: Inspections completed
    const pendingInspections = get<{ c: number }>(
      `SELECT count(*) as c FROM inspections WHERE case_id = ? AND status != 'COMPLETED'`,
      [id]
    )?.c || 0;
    if (pendingInspections > 0) {
      res.status(400).json({
        type: 'https://dustguard.gov.vn/errors/closure-inspections-incomplete',
        title: 'Chưa đủ điều kiện đóng hồ sơ',
        status: 400,
        detail: `Còn ${pendingInspections} đợt kiểm tra hiện trường chưa hoàn thành biên bản.`,
      });
      return;
    }

    // Check Condition 2: Open corrective actions = 0
    const openActions = get<{ c: number }>(
      `SELECT count(*) as c FROM corrective_actions WHERE case_id = ? AND status IN ('OPEN', 'IN_PROGRESS', 'SUBMITTED')`,
      [id]
    )?.c || 0;
    if (openActions > 0) {
      res.status(400).json({
        type: 'https://dustguard.gov.vn/errors/closure-actions-pending',
        title: 'Chưa đủ điều kiện đóng hồ sơ',
        status: 400,
        detail: `Còn ${openActions} yêu cầu khắc phục chưa được nghiệm thu xác nhận hoàn thành.`,
      });
      return;
    }

    // Check Condition 3: Legal review exists and REVIEWED
    const reviewedCount = get<{ c: number }>(
      `SELECT count(*) as c FROM legal_reviews WHERE case_id = ? AND status = 'REVIEWED'`,
      [id]
    )?.c || 0;
    if (reviewedCount === 0) {
      res.status(400).json({
        type: 'https://dustguard.gov.vn/errors/closure-legal-incomplete',
        title: 'Chưa đủ điều kiện đóng hồ sơ',
        status: 400,
        detail: 'Vụ việc chưa có kết luận thẩm tra pháp lý hoàn tất từ chuyên viên pháp chế.',
      });
      return;
    }

    const closureId = `cls-${crypto.randomUUID().substring(0, 8)}`;

    transaction(() => {
      run(
        `INSERT INTO case_closures (id, case_id, closed_by, closure_reason, closure_summary, closed_at)
         VALUES (?, ?, ?, ?, ?, datetime('now'))`,
        [closureId, id, req.user!.id, closure_reason, closure_summary]
      );

      run(
        `UPDATE cases
         SET status = 'CLOSED', closed_at = datetime('now'), updated_at = datetime('now')
         WHERE id = ?`,
        [id]
      );

      // Timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'CASE_CLOSED', ?, ?, ?, 'CLOSED', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Đóng hồ sơ vụ việc. Lý do: ${closure_reason}. Tóm tắt: ${closure_summary}`,
          JSON.stringify({ closure_id: closureId }),
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'CASE_CLOSED', 'CASE', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          id,
          JSON.stringify({ closure_id: closureId, closure_reason }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    const closure = get(`SELECT * FROM case_closures WHERE id = ?`, [closureId]);
    res.json({ success: true, closure, message: 'Đã đóng hồ sơ vụ việc thành công.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/cases/:id/reopen - Reopen case
closuresRouter.post('/:id/reopen', requirePermission('case:reopen'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { reopen_reason } = CaseReopenSchema.parse(req.body);

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!targetCase) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
      return;
    }

    if (targetCase.status !== 'CLOSED') {
      res.status(400).json({ error: 'Chỉ có thể mở lại hồ sơ đang ở trạng thái ĐÃ ĐÓNG (CLOSED).' });
      return;
    }

    transaction(() => {
      run(
        `UPDATE cases SET status = 'REOPENED', closed_at = NULL, updated_at = datetime('now') WHERE id = ?`,
        [id]
      );

      // Timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'CASE_REOPENED', ?, ?, ?, 'REOPENED', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Mở lại hồ sơ vụ việc. Lý do: ${reopen_reason}`,
          JSON.stringify({ reopen_reason }),
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'CASE_REOPENED', 'CASE', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          id,
          JSON.stringify({ reopen_reason }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    res.json({ success: true, message: 'Hồ sơ vụ việc đã được mở lại thành công.' });
  } catch (err) {
    next(err);
  }
});
