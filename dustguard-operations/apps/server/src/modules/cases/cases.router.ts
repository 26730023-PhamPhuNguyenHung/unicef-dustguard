import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { get, query, run, transaction } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';
import {
  CaseCreateSchema,
  CaseTransitionSchema,
  CaseAssignSchema,
  canTransitionCase,
  Case,
  CaseStatus,
  CaseTimeline,
  StaffAssignment,
} from '../../shared.js';

export const casesRouter = Router();

// Helper to compute flags and enrich case
function enrichCase(c: any, currentUserId?: string): Case {
  // Check evidence count
  const evCount = get<{ c: number }>(`SELECT count(*) as c FROM evidence_assets WHERE case_id = ?`, [c.id])?.c || 0;
  // Check open actions count
  const openActionsCount = get<{ c: number }>(
    `SELECT count(*) as c FROM corrective_actions WHERE case_id = ? AND status IN ('OPEN', 'IN_PROGRESS', 'SUBMITTED')`,
    [c.id]
  )?.c || 0;

  const createdAtTime = new Date(c.created_at).getTime();
  const now = Date.now();
  const daysDiff = (now - createdAtTime) / (1000 * 60 * 60 * 24);

  return {
    ...c,
    flags: {
      unassigned: !c.assigned_staff_id,
      missing_evidence: evCount === 0,
      pending_legal: c.status === 'LEGAL_REVIEW',
      has_new_reports: c.source_report_count >= 5,
      overdue: daysDiff > 7 && c.status !== 'CLOSED',
      pending_reinspection: c.status === 'REINSPECTION',
      open_actions: openActionsCount > 0,
    },
  };
}

// GET /api/cases - List cases with tabs, search, and multi-faceted filtering
casesRouter.get('/', (req: AuthRequest, res) => {
  const { tab, status, search, district, source, assignee, priority, flag } = req.query;
  const currentUserId = req.user?.id;

  let sql = `
    SELECT c.*, u.full_name as assigned_staff_name
    FROM cases c
    LEFT JOIN users u ON c.assigned_staff_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  // Tab filter
  if (tab) {
    switch (tab) {
      case 'new':
        sql += ` AND c.status = 'NEW'`;
        break;
      case 'triaged':
        sql += ` AND c.status = 'TRIAGED'`;
        break;
      case 'my_cases':
        if (currentUserId) {
          sql += ` AND c.assigned_staff_id = ?`;
          params.push(currentUserId);
        }
        break;
      case 'in_progress':
        sql += ` AND c.status IN ('ASSIGNED', 'INSPECTION_PLANNED', 'INSPECTION_IN_PROGRESS')`;
        break;
      case 'pending_legal':
        sql += ` AND c.status = 'LEGAL_REVIEW'`;
        break;
      case 'pending_inspection':
        sql += ` AND c.status IN ('INSPECTION_PLANNED', 'INSPECTION_IN_PROGRESS')`;
        break;
      case 'pending_action':
        sql += ` AND c.status = 'ACTION_REQUIRED'`;
        break;
      case 'pending_reinspection':
        sql += ` AND c.status = 'REINSPECTION'`;
        break;
      case 'ready_to_close':
        sql += ` AND c.status = 'READY_TO_CLOSE'`;
        break;
      case 'closed':
        sql += ` AND c.status = 'CLOSED'`;
        break;
      case 'all':
      default:
        break;
    }
  }

  // Explicit status filter
  if (status && typeof status === 'string') {
    sql += ` AND c.status = ?`;
    params.push(status);
  }

  // Search filter
  if (search && typeof search === 'string' && search.trim()) {
    const term = `%${search.trim()}%`;
    sql += ` AND (c.case_code LIKE ? OR c.title LIKE ? OR c.location_text LIKE ? OR c.district LIKE ? OR c.contractor_name LIKE ?)`;
    params.push(term, term, term, term, term);
  }

  // District filter
  if (district && typeof district === 'string') {
    sql += ` AND c.district = ?`;
    params.push(district);
  }

  // Source filter
  if (source && typeof source === 'string') {
    sql += ` AND c.source = ?`;
    params.push(source);
  }

  // Assignee filter
  if (assignee && typeof assignee === 'string') {
    if (assignee === 'unassigned') {
      sql += ` AND c.assigned_staff_id IS NULL`;
    } else {
      sql += ` AND c.assigned_staff_id = ?`;
      params.push(assignee);
    }
  }

  // Priority filter
  if (priority && typeof priority === 'string') {
    sql += ` AND c.priority = ?`;
    params.push(priority);
  }

  sql += ` ORDER BY c.updated_at DESC`;

  const rawCases = query(sql, params);
  const enriched = rawCases.map(c => enrichCase(c, currentUserId));

  // Flag filter post-query if requested
  let filtered = enriched;
  if (flag && typeof flag === 'string') {
    if (flag === 'unassigned') filtered = enriched.filter(c => c.flags?.unassigned);
    if (flag === 'missing_evidence') filtered = enriched.filter(c => c.flags?.missing_evidence);
    if (flag === 'overdue') filtered = enriched.filter(c => c.flags?.overdue);
    if (flag === 'open_actions') filtered = enriched.filter(c => c.flags?.open_actions);
  }

  res.json({
    cases: filtered,
    total: filtered.length,
  });
});

// GET /api/cases/:id - Detailed case view with all relations
casesRouter.get('/:id', (req: AuthRequest, res) => {
  const { id } = req.params;

  const rawCase = get<any>(
    `SELECT c.*, u.full_name as assigned_staff_name
     FROM cases c
     LEFT JOIN users u ON c.assigned_staff_id = u.id
     WHERE c.id = ? OR c.case_code = ?`,
    [id, id]
  );

  if (!rawCase) {
    res.status(404).json({
      type: 'https://dustguard.gov.vn/errors/not-found',
      title: 'Không tìm thấy hồ sơ',
      status: 404,
      detail: `Không tìm thấy vụ việc với mã/ID "${id}".`,
    });
    return;
  }

  const caseId = rawCase.id;
  const enriched = enrichCase(rawCase, req.user?.id);

  // Timeline
  const timeline = query<CaseTimeline>(
    `SELECT * FROM case_timeline WHERE case_id = ? ORDER BY created_at DESC`,
    [caseId]
  );

  // Assignments
  const assignments = query<StaffAssignment>(
    `SELECT sa.*, u.full_name as staff_name, u.role as staff_role, a.full_name as assigned_by_name
     FROM staff_assignments sa
     JOIN users u ON sa.staff_user_id = u.id
     JOIN users a ON sa.assigned_by = a.id
     WHERE sa.case_id = ?
     ORDER BY sa.assigned_at DESC`,
    [caseId]
  );

  // Evidence
  const evidence = query(
    `SELECT ea.*, u.full_name as uploaded_by_name
     FROM evidence_assets ea
     JOIN users u ON ea.uploaded_by = u.id
     WHERE ea.case_id = ?
     ORDER BY ea.created_at DESC`,
    [caseId]
  );

  // Legal Reviews
  const legalReviews = query(
    `SELECT lr.*, u.full_name as reviewer_name
     FROM legal_reviews lr
     JOIN users u ON lr.reviewer_id = u.id
     WHERE lr.case_id = ?
     ORDER BY lr.created_at DESC`,
    [caseId]
  );

  // Inspections
  const inspections = query(
    `SELECT i.*, u.full_name as inspector_name, it.name as template_name
     FROM inspections i
     JOIN users u ON i.inspector_id = u.id
     JOIN inspection_templates it ON i.template_id = it.id
     WHERE i.case_id = ?
     ORDER BY i.created_at DESC`,
    [caseId]
  );

  // Corrective Actions
  const actions = query(
    `SELECT ca.*, u.full_name as created_by_name
     FROM corrective_actions ca
     JOIN users u ON ca.created_by = u.id
     WHERE ca.case_id = ?
     ORDER BY ca.created_at DESC`,
    [caseId]
  );

  // Closure info if closed
  const closure = get(
    `SELECT cc.*, u.full_name as closed_by_name
     FROM case_closures cc
     JOIN users u ON cc.closed_by = u.id
     WHERE cc.case_id = ?`,
    [caseId]
  );

  res.json({
    case: enriched,
    timeline,
    assignments,
    evidence,
    legalReviews,
    inspections,
    actions,
    closure,
  });
});

// POST /api/cases - Create manual case
casesRouter.post('/', requireAuth, (req: AuthRequest, res, next) => {
  try {
    const data = CaseCreateSchema.parse(req.body);
    const id = `case-${crypto.randomUUID().substring(0, 8)}`;
    
    // Generate sequential code DG-2026-OP-XXX
    const countRow = get<{ c: number }>(`SELECT count(*) as c FROM cases`);
    const nextNum = (countRow?.c || 0) + 1;
    const case_code = `DG-2026-OP-${String(nextNum).padStart(3, '0')}`;

    transaction(() => {
      run(
        `INSERT INTO cases (id, case_code, title, description, location_text, district, latitude, longitude, source, source_reference, contractor_name, priority, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW', datetime('now'), datetime('now'))`,
        [
          id,
          case_code,
          data.title,
          data.description,
          data.location_text,
          data.district,
          data.latitude,
          data.longitude,
          data.source,
          data.source_reference || null,
          data.contractor_name || null,
          data.priority,
        ]
      );

      // Record timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, created_at)
         VALUES (?, ?, 'CASE_CREATED', ?, ?, ?, 'INTAKE', 'Hồ sơ vụ việc mới được tạo lập trên hệ thống.', datetime('now'))`,
        [`tml-${crypto.randomUUID()}`, id, req.user!.id, req.user!.full_name, req.user!.role]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'CASE_CREATED', 'CASE', ?, ?, ?, datetime('now'))`,
        [`aud-${crypto.randomUUID()}`, req.user!.id, id, JSON.stringify({ case_code, title: data.title }), req.ip || '127.0.0.1']
      );
    });

    const created = get(`SELECT * FROM cases WHERE id = ?`, [id]);
    res.status(201).json({ case: created });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/cases/:id - Update case fields
casesRouter.patch('/:id', requireAuth, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const existing = get(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy vụ việc' });
      return;
    }

    const { title, description, contractor_name, priority, district, location_text } = req.body;

    run(
      `UPDATE cases
       SET title = COALESCE(?, title),
           description = COALESCE(?, description),
           contractor_name = COALESCE(?, contractor_name),
           priority = COALESCE(?, priority),
           district = COALESCE(?, district),
           location_text = COALESCE(?, location_text),
           updated_at = datetime('now')
       WHERE id = ?`,
      [title, description, contractor_name, priority, district, location_text, id]
    );

    run(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
       VALUES (?, ?, 'CASE_UPDATED', 'CASE', ?, ?, ?, datetime('now'))`,
      [`aud-${crypto.randomUUID()}`, req.user!.id, id, JSON.stringify(req.body), req.ip || '127.0.0.1']
    );

    const updated = get(`SELECT * FROM cases WHERE id = ?`, [id]);
    res.json({ case: updated });
  } catch (err) {
    next(err);
  }
});

// POST /api/cases/:id/transition - State machine transition validation & execution
casesRouter.post('/:id/transition', requireAuth, (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { to_status, note, closure_reason, closure_summary, reopen_reason } = CaseTransitionSchema.parse(req.body);

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!targetCase) {
      res.status(404).json({
        type: 'https://dustguard.gov.vn/errors/not-found',
        title: 'Không tìm thấy vụ việc',
        status: 404,
        detail: `Không tìm thấy hồ sơ với ID "${id}".`,
      });
      return;
    }

    const from_status = targetCase.status as CaseStatus;

    // Check completion contexts
    const pendingInspections = get<{ c: number }>(
      `SELECT count(*) as c FROM inspections WHERE case_id = ? AND status != 'COMPLETED'`,
      [id]
    )?.c || 0;
    const totalInspections = get<{ c: number }>(
      `SELECT count(*) as c FROM inspections WHERE case_id = ?`,
      [id]
    )?.c || 0;

    const openActionsCount = get<{ c: number }>(
      `SELECT count(*) as c FROM corrective_actions WHERE case_id = ? AND status IN ('OPEN', 'IN_PROGRESS', 'SUBMITTED')`,
      [id]
    )?.c || 0;

    const legalReviewDone = !!get(
      `SELECT id FROM legal_reviews WHERE case_id = ? AND status = 'REVIEWED'`,
      [id]
    );

    const transitionCheck = canTransitionCase(from_status, to_status, {
      role: req.user?.role,
      hasAssignee: !!targetCase.assigned_staff_id,
      inspectionsCompleted: totalInspections > 0 ? pendingInspections === 0 : true,
      openActionsCount,
      hasLegalReview: legalReviewDone,
      closureSummary: closure_summary || note,
    });

    if (!transitionCheck.allowed) {
      res.status(400).json({
        type: 'https://dustguard.gov.vn/errors/invalid-transition',
        title: 'Chuyển trạng thái không hợp lệ',
        status: 400,
        detail: transitionCheck.reason,
      });
      return;
    }

    transaction(() => {
      // If CLOSING
      if (to_status === 'CLOSED') {
        const closureId = `cls-${crypto.randomUUID()}`;
        run(
          `INSERT INTO case_closures (id, case_id, closed_by, closure_reason, closure_summary, closed_at)
           VALUES (?, ?, ?, ?, ?, datetime('now'))`,
          [
            closureId,
            id,
            req.user!.id,
            closure_reason || 'Đã khắc phục hoàn thành toàn diện',
            closure_summary || note || 'Hồ sơ đã được nghiệm thu và khép kín quy trình.',
          ]
        );

        run(
          `UPDATE cases SET status = ?, closed_at = datetime('now'), updated_at = datetime('now') WHERE id = ?`,
          [to_status, id]
        );
      } else if (to_status === 'REOPENED') {
        run(
          `UPDATE cases SET status = ?, closed_at = NULL, updated_at = datetime('now') WHERE id = ?`,
          [to_status, id]
        );
      } else {
        run(
          `UPDATE cases SET status = ?, updated_at = datetime('now') WHERE id = ?`,
          [to_status, id]
        );
      }

      // Record in timeline
      const desc =
        to_status === 'CLOSED'
          ? `Hồ sơ vụ việc đã được đóng chính thức. Lý do: ${closure_reason || 'Hoàn thành nghiệm thu'}`
          : to_status === 'REOPENED'
          ? `Hồ sơ vụ việc được mở lại để kiểm tra bổ sung. Lý do: ${reopen_reason || note || 'Có phản ánh mới'}`
          : note || `Chuyển trạng thái vụ việc từ "${from_status}" sang "${to_status}".`;

      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'STATUS_TRANSITION', ?, ?, ?, ?, ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          to_status,
          desc,
          JSON.stringify({ from: from_status, to: to_status }),
        ]
      );

      // Record in audit logs
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'CASE_STATUS_TRANSITION', 'CASE', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          id,
          JSON.stringify({ from: from_status, to: to_status, note }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    const updatedCase = get(`SELECT * FROM cases WHERE id = ?`, [id]);
    res.json({
      success: true,
      case: enrichCase(updatedCase, req.user?.id),
      message: `Chuyển trạng thái vụ việc sang ${to_status} thành công.`,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/cases/:id/assign - Assign staff
casesRouter.post('/:id/assign', requirePermission('case:assign'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { staff_user_id, assignment_type, note, due_at } = CaseAssignSchema.parse(req.body);

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!targetCase) {
      res.status(404).json({ error: 'Không tìm thấy vụ việc' });
      return;
    }

    const assignedStaff = get<any>(`SELECT * FROM users WHERE id = ? AND active = 1`, [staff_user_id]);
    if (!assignedStaff) {
      res.status(400).json({ error: 'Cán bộ được phân công không tồn tại hoặc đã bị khóa.' });
      return;
    }

    transaction(() => {
      // Mark existing primary assignments as COMPLETED/REPLACED if changing primary
      if (assignment_type === 'PRIMARY') {
        run(
          `UPDATE staff_assignments SET status = 'REPLACED' WHERE case_id = ? AND assignment_type = 'PRIMARY' AND status = 'ACTIVE'`,
          [id]
        );
        run(
          `UPDATE cases SET assigned_staff_id = ?, updated_at = datetime('now') WHERE id = ?`,
          [staff_user_id, id]
        );
        // If status was NEW or TRIAGED, auto advance to ASSIGNED
        if (targetCase.status === 'NEW' || targetCase.status === 'TRIAGED') {
          run(`UPDATE cases SET status = 'ASSIGNED', updated_at = datetime('now') WHERE id = ?`, [id]);
        }
      }

      const asgnId = `asgn-${crypto.randomUUID()}`;
      run(
        `INSERT INTO staff_assignments (id, case_id, staff_user_id, assigned_by, assignment_type, status, note, assigned_at, due_at)
         VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, datetime('now'), ?)`,
        [asgnId, id, staff_user_id, req.user!.id, assignment_type, note || null, due_at || null]
      );

      // Timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'STAFF_ASSIGNED', ?, ?, ?, 'ASSIGNED', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Phân công đồng chí ${assignedStaff.full_name} đảm nhiệm vai trò ${assignment_type}. Ghi chú: ${note || 'Không có'}`,
          JSON.stringify({ staff_user_id, assignment_type }),
        ]
      );

      // Notification for assigned staff
      run(
        `INSERT INTO notifications (id, user_id, type, title, message, link, read, created_at)
         VALUES (?, ?, 'ASSIGNMENT', 'Bạn được phân công vụ việc mới', ?, ?, 0, datetime('now'))`,
        [
          `notif-${crypto.randomUUID()}`,
          staff_user_id,
          `Bạn vừa được giao phụ trách vụ việc ${targetCase.case_code}: "${targetCase.title}"`,
          `/cases/${targetCase.id}`,
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'CASE_ASSIGNED', 'CASE', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          id,
          JSON.stringify({ staff_user_id, staff_name: assignedStaff.full_name, assignment_type }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    const updated = get(`SELECT c.*, u.full_name as assigned_staff_name FROM cases c LEFT JOIN users u ON c.assigned_staff_id = u.id WHERE c.id = ?`, [id]);
    res.json({ success: true, case: enrichCase(updated, req.user?.id) });
  } catch (err) {
    next(err);
  }
});

// POST /api/cases/:id/reassign - Reassign staff preserving audit trail
casesRouter.post('/:id/reassign', requirePermission('case:reassign'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { staff_user_id, assignment_type, note, due_at } = CaseAssignSchema.parse(req.body);

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [id]);
    if (!targetCase) {
      res.status(404).json({ error: 'Không tìm thấy vụ việc' });
      return;
    }

    const newStaff = get<any>(`SELECT * FROM users WHERE id = ? AND active = 1`, [staff_user_id]);
    if (!newStaff) {
      res.status(400).json({ error: 'Cán bộ mới không tồn tại.' });
      return;
    }

    transaction(() => {
      // Mark all existing active assignments as REPLACED
      run(
        `UPDATE staff_assignments SET status = 'REPLACED', completed_at = datetime('now') WHERE case_id = ? AND status = 'ACTIVE'`,
        [id]
      );

      // Update case assignee
      run(
        `UPDATE cases SET assigned_staff_id = ?, updated_at = datetime('now') WHERE id = ?`,
        [staff_user_id, id]
      );

      // Insert new assignment record
      const asgnId = `asgn-${crypto.randomUUID()}`;
      run(
        `INSERT INTO staff_assignments (id, case_id, staff_user_id, assigned_by, assignment_type, status, note, assigned_at, due_at)
         VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, datetime('now'), ?)`,
        [asgnId, id, staff_user_id, req.user!.id, assignment_type || 'PRIMARY', note || 'Điều chuyển cán bộ xử lý', due_at || null]
      );

      // Timeline
      run(
        `INSERT INTO case_timeline (id, case_id, event_type, actor_id, actor_name, actor_role, stage, description, metadata_json, created_at)
         VALUES (?, ?, 'STAFF_REASSIGNED', ?, ?, ?, 'ASSIGNMENT', ?, ?, datetime('now'))`,
        [
          `tml-${crypto.randomUUID()}`,
          id,
          req.user!.id,
          req.user!.full_name,
          req.user!.role,
          `Điều chuyển quyền thụ lý vụ việc sang đồng chí ${newStaff.full_name}. Lý do: ${note || 'Yêu cầu điều phối công việc'}`,
          JSON.stringify({ new_staff_id: staff_user_id }),
        ]
      );

      // Notification
      run(
        `INSERT INTO notifications (id, user_id, type, title, message, link, read, created_at)
         VALUES (?, ?, 'REASSIGNMENT', 'Tiếp nhận bàn giao vụ việc', ?, ?, 0, datetime('now'))`,
        [
          `notif-${crypto.randomUUID()}`,
          staff_user_id,
          `Bạn được bàn giao thụ lý vụ việc ${targetCase.case_code}: "${targetCase.title}"`,
          `/cases/${targetCase.id}`,
        ]
      );

      // Audit log
      run(
        `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
         VALUES (?, ?, 'CASE_REASSIGNED', 'CASE', ?, ?, ?, datetime('now'))`,
        [
          `aud-${crypto.randomUUID()}`,
          req.user!.id,
          id,
          JSON.stringify({ new_staff_id: staff_user_id, new_staff_name: newStaff.full_name, note }),
          req.ip || '127.0.0.1',
        ]
      );
    });

    const updated = get(`SELECT c.*, u.full_name as assigned_staff_name FROM cases c LEFT JOIN users u ON c.assigned_staff_id = u.id WHERE c.id = ?`, [id]);
    res.json({ success: true, case: enrichCase(updated, req.user?.id) });
  } catch (err) {
    next(err);
  }
});
