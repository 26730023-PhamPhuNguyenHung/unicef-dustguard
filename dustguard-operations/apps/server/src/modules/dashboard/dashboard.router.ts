import { Router, Response } from 'express';
import { get, query } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';

export const dashboardRouter = Router();

const getDashboardData = (req: AuthRequest, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;

  // 1. Core Operational KPI Metrics
  const openCasesCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status != 'CLOSED'`)?.c || 0;
  const newCasesCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status = 'NEW'`)?.c || 0;
  const pendingLegalCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status = 'LEGAL_REVIEW'`)?.c || 0;
  const pendingInspectionCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status IN ('INSPECTION_PLANNED', 'INSPECTION_IN_PROGRESS')`)?.c || 0;
  const awaitingRemediationCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status IN ('ACTION_REQUIRED', 'REMEDIATION')`)?.c || 0;
  const overdueActionsCount = get<{ c: number }>(
    `SELECT count(*) as c FROM corrective_actions WHERE due_at < datetime('now') AND status NOT IN ('VERIFIED', 'CLOSED')`
  )?.c || 0;
  const pendingReinspectionCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status = 'REINSPECTION'`)?.c || 0;
  const readyToCloseCount = get<{ c: number }>(`SELECT count(*) as c FROM cases WHERE status = 'READY_TO_CLOSE'`)?.c || 0;

  // SLA at risk: cases older than 48 hours still in early/open status or overdue actions
  const slaAtRiskCases = get<{ c: number }>(
    `SELECT count(*) as c FROM cases WHERE status NOT IN ('CLOSED', 'READY_TO_CLOSE') AND created_at < datetime('now', '-48 hours')`
  )?.c || 0;
  const slaAtRiskTotal = Math.max(slaAtRiskCases, overdueActionsCount);

  // 2. PRIORITY QUEUE (Hàng đợi xử lý ưu tiên - Khẩn cấp & Mới nhất)
  const priorityQueue = query(
    `SELECT c.*, u.full_name as assigned_staff_name
     FROM cases c
     LEFT JOIN users u ON c.assigned_staff_id = u.id
     WHERE c.status != 'CLOSED'
     ORDER BY 
       CASE c.priority WHEN 'URGENT' THEN 1 WHEN 'HIGH' THEN 2 WHEN 'NORMAL' THEN 3 ELSE 4 END ASC,
       c.updated_at DESC
     LIMIT 12`
  );

  // 3. MY WORK QUEUE
  const myQueue = query(
    `SELECT c.*, u.full_name as assigned_staff_name
     FROM cases c
     LEFT JOIN users u ON c.assigned_staff_id = u.id
     WHERE c.assigned_staff_id = ? AND c.status != 'CLOSED'
     ORDER BY c.updated_at DESC
     LIMIT 8`,
    [userId]
  );

  // 4. OPERATIONAL PULSE (Nhịp vận hành thời gian thực)
  const latestSignals = query(
    `SELECT id, title, source_type, location_text, observed_at, created_at
     FROM signals
     ORDER BY created_at DESC
     LIMIT 4`
  );

  const incomingEvidence = query(
    `SELECT ea.id, ea.file_name, ea.sha256, ea.integrity_status, ea.created_at, c.case_code
     FROM evidence_assets ea
     LEFT JOIN cases c ON ea.case_id = c.id
     ORDER BY ea.created_at DESC
     LIMIT 4`
  );

  const contractorSubmissions = query(
    `SELECT rs.id, rs.description, rs.review_status, rs.submitted_at, rs.submitted_by, c.case_code
     FROM remediation_submissions rs
     LEFT JOIN cases c ON rs.case_id = c.id
     ORDER BY rs.submitted_at DESC
     LIMIT 4`
  );

  // 5. RECENT CASE ACTIVITY TIMELINE
  const recentActivities = query(
    `SELECT ct.*, c.case_code, c.title as case_title
     FROM case_timeline ct
     JOIN cases c ON ct.case_id = c.id
     ORDER BY ct.created_at DESC
     LIMIT 10`
  );

  // 6. Supervisor Additions
  let supervisorData: any = null;
  if (role === 'supervisor' || role === 'admin') {
    const unassignedCases = query(
      `SELECT * FROM cases WHERE assigned_staff_id IS NULL AND status != 'CLOSED' ORDER BY created_at DESC LIMIT 8`
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
       LIMIT 8`
    );

    supervisorData = {
      unassignedCases,
      staffWorkload,
      overdueCases,
    };
  }

  const payload = {
    metrics: {
      open_cases: openCasesCount,
      sla_at_risk: slaAtRiskTotal,
      pending_inspection: pendingInspectionCount,
      awaiting_remediation: awaitingRemediationCount,
      new_cases: newCasesCount,
      pending_legal: pendingLegalCount,
      overdue_actions: overdueActionsCount,
      pending_reinspection: pendingReinspectionCount,
      ready_to_close: readyToCloseCount,
    },
    priorityQueue,
    operationalPulse: {
      signals: latestSignals,
      evidence: incomingEvidence,
      submissions: contractorSubmissions,
    },
    myQueue,
    recentActivities,
    supervisor: supervisorData,
  };

  res.json(payload);
};

dashboardRouter.get('/', requireAuth, getDashboardData);
dashboardRouter.get('/staff', requireAuth, getDashboardData);
dashboardRouter.get('/supervisor', requireAuth, getDashboardData);
