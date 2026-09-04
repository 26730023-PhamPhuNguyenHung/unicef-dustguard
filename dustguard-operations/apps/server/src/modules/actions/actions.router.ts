import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { get, query, run, transaction } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';
import {
  CorrectiveActionCreateSchema,
  RemediationSubmitSchema,
  RemediationReviewSchema,
  CorrectiveAction,
  RemediationSubmission,
} from '../../shared.js';

export const actionsRouter = Router();

// GET /api/actions - List corrective actions with filters
actionsRouter.get('/', requireAuth, (req, res) => {
  const { status, case_id, overdue } = req.query;

  let sql = `
    SELECT ca.*, c.case_code, c.title as case_title, u.full_name as created_by_name
    FROM corrective_actions ca
    JOIN cases c ON ca.case_id = c.id
    JOIN users u ON ca.created_by = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (status && typeof status === 'string') {
    sql += ` AND ca.status = ?`;
    params.push(status);
  }
  if (case_id && typeof case_id === 'string') {
    sql += ` AND ca.case_id = ?`;
    params.push(case_id);
  }
  if (overdue === 'true') {
    sql += ` AND ca.due_at < datetime('now') AND ca.status NOT IN ('VERIFIED', 'CLOSED')`;
  }

  sql += ` ORDER BY ca.due_at ASC`;

  const actions = query<CorrectiveAction>(sql, params);

  // Attach submissions to each action
  const enriched = actions.map(act => {
    const submissions = query<RemediationSubmission>(
      `SELECT rs.*, u.full_name as reviewed_by_name
       FROM remediation_submissions rs
       LEFT JOIN users u ON rs.reviewed_by = u.id
       WHERE rs.corrective_action_id = ?
       ORDER BY rs.submitted_at DESC`,
      [act.id]
    );
    return { ...act, submissions };
  });

  res.json({ actions: enriched });
});

// POST /api/cases/:id/actions - Create corrective action
actionsRouter.post('/:id/actions', requirePermission('action:create'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const data = CorrectiveActionCreateSchema.parse({ ...req.body, case_id: id });

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!targetCase) {
      res.status(404).json({ error: 'Không tìm thấy hồ sơ' });
      return;
    }

    const actionId = `act-${crypto.randomUUID().substring(0, 8)}`;

    transaction(() => {
      run(
        `INSERT INTO corrective_actions (id, case_id, inspection_id, finding_id, title, description, responsible_party, due_at, status, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN', ?, datetime('now'))`,
        [
          actionId,
          id,
          data.inspection_id || null,
          data.finding_id || null,
          data.title,
          data.description,
          data.responsible_party,
          data.due_at,
          req.user!.id,
        ]
      );

      // Advance case to ACTION_REQUIRED if not already
      if (!['ACTION_REQUIRED', 'REMEDIATION', 'REINSPECTION', 'CLOSED'].includes(targetCase.status)) {
        run(`UPDATE cases SET status = 'ACTION_REQUIRED', updated_at = datetime('now') WHERE id = ?`, [id]);
      }

      // Timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'ACTION_ISSUED', ?, ?, ?, 'ACTION', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Ban hành Yêu cầu khắc phục: "${data.title}". Đơn vị chịu trách nhiệm: ${data.responsible_party}. Hạn chót: ${data.due_at}`,
          JSON.stringify({ action_id: actionId, due_at: data.due_at }),
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'ACTION_CREATED', 'CORRECTIVE_ACTION', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          actionId,
          JSON.stringify({ title: data.title, responsible_party: data.responsible_party }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    const created = get(`SELECT * FROM corrective_actions WHERE id = ?`, [actionId]);
    res.status(201).json({ action: created });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/actions/:id - Update action status
actionsRouter.patch('/:id', requirePermission('action:update'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { status, title, description, responsible_party, due_at } = req.body;

    const action = get(`SELECT * FROM corrective_actions WHERE id = ?`, [id]);
    if (!action) {
      res.status(404).json({ error: 'Không tìm thấy yêu cầu khắc phục' });
      return;
    }

    run(
      `UPDATE corrective_actions
       SET status = COALESCE(?, status),
           title = COALESCE(?, title),
           description = COALESCE(?, description),
           responsible_party = COALESCE(?, responsible_party),
           due_at = COALESCE(?, due_at),
           completed_at = CASE WHEN ? IN ('VERIFIED', 'CLOSED') THEN datetime('now') ELSE completed_at END
       WHERE id = ?`,
      [status, title, description, responsible_party, due_at, status, id]
    );

    const updated = get(`SELECT * FROM corrective_actions WHERE id = ?`, [id]);
    res.json({ action: updated });
  } catch (err) {
    next(err);
  }
});

// POST /api/actions/:id/remediation - Submit remediation report
actionsRouter.post('/:id/remediation', requireAuth, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { description, evidence_asset_ids } = RemediationSubmitSchema.parse(req.body);

    const action = get<any>(`SELECT * FROM corrective_actions WHERE id = ?`, [id]);
    if (!action) {
      res.status(404).json({ error: 'Không tìm thấy yêu cầu khắc phục' });
      return;
    }

    const subId = `rem-${crypto.randomUUID().substring(0, 8)}`;

    transaction(() => {
      run(
        `INSERT INTO remediation_submissions (id, corrective_action_id, case_id, submitted_by, description, evidence_asset_ids, review_status, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?, 'PENDING', datetime('now'))`,
        [
          subId,
          id,
          action.case_id,
          req.user!.full_name,
          description,
          typeof evidence_asset_ids === 'string' ? evidence_asset_ids : JSON.stringify(evidence_asset_ids || []),
        ]
      );

      // Update action status to SUBMITTED
      run(`UPDATE corrective_actions SET status = 'SUBMITTED' WHERE id = ?`, [id]);

      // Update case status to REMEDIATION
      run(`UPDATE cases SET status = 'REMEDIATION', updated_at = datetime('now') WHERE id = ?`, [action.case_id]);

      // Timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'REMEDIATION_SUBMITTED', ?, ?, ?, 'REMEDIATION', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          action.case_id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Đã nộp báo cáo khắc phục cho yêu cầu "${action.title}". Nội dung: ${description}`,
          JSON.stringify({ action_id: id, submission_id: subId }),
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'REMEDIATION_SUBMITTED', 'REMEDIATION', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          subId,
          JSON.stringify({ action_id: id, case_id: action.case_id }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    const created = get(`SELECT * FROM remediation_submissions WHERE id = ?`, [subId]);
    res.status(201).json({ submission: created });
  } catch (err) {
    next(err);
  }
});

// POST /api/remediation/:id/review - Review remediation submission
actionsRouter.post('/:id/review', requirePermission('remediation:review'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { review_status, review_note } = RemediationReviewSchema.parse(req.body);

    const submission = get<any>(`SELECT * FROM remediation_submissions WHERE id = ?`, [id]);
    if (!submission) {
      res.status(404).json({ error: 'Không tìm thấy báo cáo khắc phục' });
      return;
    }

    transaction(() => {
      run(
        `UPDATE remediation_submissions
         SET review_status = ?, review_note = ?, reviewed_by = ?, reviewed_at = datetime('now')
         WHERE id = ?`,
        [review_status, review_note, req.user!.id, id]
      );

      // If APPROVED -> Action becomes VERIFIED
      if (review_status === 'APPROVED') {
        run(
          `UPDATE corrective_actions SET status = 'VERIFIED', completed_at = datetime('now') WHERE id = ?`,
          [submission.corrective_action_id]
        );

        // Check if all actions in this case are now verified/closed
        const remainingOpen = get<{ c: number }>(
          `SELECT count(*) as c FROM corrective_actions WHERE case_id = ? AND status IN ('OPEN', 'IN_PROGRESS', 'SUBMITTED')`,
          [submission.case_id]
        )?.c || 0;

        if (remainingOpen === 0) {
          run(`UPDATE cases SET status = 'READY_TO_CLOSE', updated_at = datetime('now') WHERE id = ?`, [submission.case_id]);
        }
      } else if (review_status === 'REJECTED') {
        run(
          `UPDATE corrective_actions SET status = 'REJECTED' WHERE id = ?`,
          [submission.corrective_action_id]
        );
        // Can trigger REINSPECTION or stay ACTION_REQUIRED
        run(`UPDATE cases SET status = 'REINSPECTION', updated_at = datetime('now') WHERE id = ?`, [submission.case_id]);
      }

      // Timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'REMEDIATION_REVIEWED', ?, ?, ?, 'REMEDIATION', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          submission.case_id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Thẩm duyệt báo cáo khắc phục: Kết quả "${review_status}". Nhận xét: ${review_note}`,
          JSON.stringify({ submission_id: id, status: review_status }),
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'REMEDIATION_REVIEWED', 'REMEDIATION', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          id,
          JSON.stringify({ review_status, review_note }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    const updated = get(`SELECT * FROM remediation_submissions WHERE id = ?`, [id]);
    res.json({ success: true, submission: updated });
  } catch (err) {
    next(err);
  }
});
