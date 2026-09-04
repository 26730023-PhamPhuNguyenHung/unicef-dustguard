import { Router, Response } from 'express';
import { get, query } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';

export const dashboardRouter = Router();

dashboardRouter.get('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  // 1. VIỆC CẦN TÔI XỬ LÝ / Key operational counts
  const newCasesCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status = 'NEW'`)?.c || 0;
  const pendingLegalCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status = 'LEGAL_REVIEW'`)?.c || 0;
  const pendingInspectionCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status IN ('INSPECTION_PLANNED', 'INSPECTION_IN_PROGRESS')`)?.c || 0;
  const overdueActionsCount = get<{ c: number }>(
    `SELECT count(*) as c FROM corrective_actions WHERE due_at < datetime('now') AND status NOT IN ('VERIFIED', 'CLOSED')`
  )?.c || 0;
  const pendingReinspectionCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status = 'REINSPECTION'`)?.c || 0;
  const readyToCloseCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status = 'READY_TO_CLOSE'`)?.c || 0;

  // 2. MY WORK QUEUE
  const myQueue = query(
    `SELECT c.*, u.full_name as assigned_staff_name
     FROM cases c
     LEFT JOIN users u ON c.assigned_staff_id = u.id
     WHERE c.assigned_staff_id = ? AND c.status != 'CLOSED'
     ORDER BY c.updated_at DESC
     LIMIT 10`,
    [userId]
  );

  // 3. RECENT CASE ACTIVITY
  const recentActivities = query(
    `SELECT ct.*, c.case_code, c.title as case_title
     FROM case_timeline ct
     JOIN cases c ON ct.case_id = c.id
     ORDER BY ct.created_at DESC
     LIMIT 12`
  );

  // 4. Supervisor additions
  let supervisorData: any = null;
  if (role === 'supervisor' || role === 'admin') {
    const unassignedCases = query(
      `SELECT * FROM cases WHERE assigned_staff_id IS NULL AND status != 'CLOSED' ORDER BY created_at DESC LIMIT 10`
    );

    const staffWorkload = query(
      `SELECT u.id, u.full_name, u.role, u.department,
              count(c.id) as active_cases_count
       FROM users u
       LEFT JOIN cases c ON u.id = c.assigned_staff_id AND c.status != 'CLOSED'
       WHERE u.role = 'staff' AND u.active = 1
       GROUP BY u.id
       ORDER BY active_cases_count DESC`
    );

    const overdueCases = query(
      `SELECT c.*, u.full_name as assigned_staff_name
       FROM cases c
       LEFT JOIN users u ON c.assigned_staff_id = u.id
       WHERE c.status != 'CLOSED' AND c.created_at < datetime('now', '-7 days')
       ORDER BY c.created_at ASC
       LIMIT 10`
    );

    supervisorData = {
      unassignedCases,
      staffWorkload,
      overdueCases,
    };
  }

  res.json({
    metrics: {
      new_cases: newCasesCount,
      pending_legal: pendingLegalCount,
      pending_inspection: pendingInspectionCount,
      overdue_actions: overdueActionsCount,
      pending_reinspection: pendingReinspectionCount,
      ready_to_close: readyToCloseCount,
    },
    myQueue,
    recentActivities,
    supervisor: supervisorData,
  });
});
