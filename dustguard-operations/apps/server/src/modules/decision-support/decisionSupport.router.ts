import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { AuthRequest } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';
import { DecisionSupportService } from './decisionSupport.service.js';
import { CaseStateMachine } from './lifecycle/stateMachine.js';
import { ClosureSafetyGate } from './closure/closureSafetyGate.js';
import { get, run, query } from '../../db/connection.js';

export const decisionSupportRouter = Router();

/**
 * GET /api/cases/:id/decision-support
 * Tra cứu phân tích đối soát dữ kiện, chứng cứ, quy chuẩn pháp lý và khuyến nghị hành động
 */
decisionSupportRouter.get('/cases/:id/decision-support', requirePermission('case:view'), (req: AuthRequest, res: Response): void => {
  try {
    const caseId = req.params.id;
    const user = req.user!;

    const result = DecisionSupportService.evaluateCase({
      caseId,
      userId: user.id,
      userRole: user.role,
      userName: user.full_name || user.username,
    });

    res.json(result);
  } catch (err: any) {
    res.status(err.message.includes('Không tìm thấy') ? 404 : 500).json({
      error: 'DECISION_SUPPORT_ERROR',
      message: err.message,
    });
  }
});

/**
 * POST /api/cases/:id/human-decisions
 * Ghi nhận phán quyết / kết luận chính thức của cán bộ chuyên trách (Append-Only)
 */
decisionSupportRouter.post(
  '/cases/:id/human-decisions',
  requirePermission('legal:review'),
  (req: AuthRequest, res: Response): void => {
    try {
      const caseId = req.params.id;
      const user = req.user!;
      const { decisionType, reason, references, supersedesDecisionId } = req.body;

      if (!decisionType || !reason) {
        res.status(400).json({
          error: 'VALIDATION_ERROR',
          message: 'Vui lòng cung cấp loại quyết định (decisionType) và lý do / căn cứ (reason).',
        });
        return;
      }

      const targetCase = get<any>(`SELECT id, case_code FROM cases WHERE id = ?`, [caseId]);
      if (!targetCase) {
        res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy hồ sơ.' });
        return;
      }

      const decisionId = `hd-${crypto.randomUUID().substring(0, 8)}`;
      const now = new Date().toISOString();

      run(
        `INSERT INTO human_decisions (
           id, case_id, decision_type, actor_id, actor_name, actor_role,
           reason, source_snapshot_json, supersedes_decision_id, references_json, created_at
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          decisionId,
          caseId,
          decisionType,
          user.id,
          user.full_name || user.username,
          user.role,
          reason,
          JSON.stringify({ triggeredFrom: 'DECISION_SUPPORT_WORKSPACE' }),
          supersedesDecisionId || null,
          references ? JSON.stringify(references) : null,
          now,
        ]
      );

      // Thêm sự kiện timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'HUMAN_DECISION_RECORDED', ?, ?, ?, 'LEGAL_REVIEW', ?, ?, ?)`,
        [
          `tl-${crypto.randomUUID().substring(0, 8)}`,
          caseId,
          user.id,
          user.full_name || user.username,
          user.role,
          `Cán bộ đã ghi nhận nhận định: ${decisionType}`,
          JSON.stringify({ decisionId, decisionType, reason }),
          now,
        ]
      );

      res.status(201).json({
        id: decisionId,
        caseId,
        decisionType,
        actorName: user.full_name || user.username,
        actorRole: user.role,
        reason,
        supersedesDecisionId,
        createdAt: now,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }
);

/**
 * POST /api/cases/:id/transition
 * Chuyển đổi trạng thái hồ sơ có áp dụng Guard nghiêm ngặt từ State Machine
 */
decisionSupportRouter.post(
  '/cases/:id/transition',
  requirePermission('case:transition'),
  (req: AuthRequest, res: Response): void => {
    try {
      const caseId = req.params.id;
      const user = req.user!;
      const targetStatus = req.body.targetStatus || req.body.to_status;
      const note = req.body.note || req.body.reason;

      if (!targetStatus) {
        res.status(400).json({ error: 'VALIDATION_ERROR', message: 'Thiếu trường targetStatus hoặc to_status.' });
        return;
      }

      const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [caseId]);
      if (!targetCase) {
        res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy hồ sơ.' });
        return;
      }

      // Thu thập context để đánh giá Guard
      const tampered = query<any>(
        `SELECT id FROM evidence_assets WHERE case_id = ? AND (integrity_status = 'TAMPERED' OR integrity_status = 'FILE_MISSING')`,
        [caseId]
      );
      const decisions = query<any>(`SELECT id FROM human_decisions WHERE case_id = ?`, [caseId]);

      const guardCheck = CaseStateMachine.canTransition(targetCase.status, targetStatus, {
        role: user.role,
        hasAssignedStaff: Boolean(targetCase.assigned_staff_id),
        hasTamperedEvidence: tampered.length > 0,
        hasHumanDecision: decisions.length > 0,
      });

      if (!guardCheck.allowed) {
        res.status(422).json({
          error: 'TRANSITION_GUARD_REJECTED',
          message: guardCheck.reason,
        });
        return;
      }

      // Thực thi cập nhật trạng thái
      const now = new Date().toISOString();
      const closedAt = targetStatus === 'CLOSED' ? now : null;

      run(
        `UPDATE cases SET status = ?, updated_at = ?, closed_at = COALESCE(?, closed_at) WHERE id = ?`,
        [targetStatus, now, closedAt, caseId]
      );

      // Thêm timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'STATE_CHANGED', ?, ?, ?, ?, ?, ?, ?)`,
        [
          `tl-${crypto.randomUUID().substring(0, 8)}`,
          caseId,
          user.id,
          user.full_name || user.username,
          user.role,
          targetStatus,
          `Chuyển trạng thái hồ sơ từ "${targetCase.status}" sang "${targetStatus}"`,
          JSON.stringify({ from: targetCase.status, to: targetStatus, note }),
          now,
        ]
      );

      res.json({
        success: true,
        caseId,
        previousStatus: targetCase.status,
        currentStatus: targetStatus,
        updatedAt: now,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
    }
  }
);

/**
 * GET /api/cases/:id/closure-safety-check
 * Kiểm tra trước điều kiện an toàn khi đóng hồ sơ
 */
decisionSupportRouter.get('/cases/:id/closure-safety-check', requirePermission('case:view'), (req: AuthRequest, res: Response): void => {
  try {
    const caseId = req.params.id;
    const check = ClosureSafetyGate.verifyCaseClosureSafety(caseId);
    res.json(check);
  } catch (err: any) {
    res.status(500).json({ error: 'INTERNAL_ERROR', message: err.message });
  }
});
