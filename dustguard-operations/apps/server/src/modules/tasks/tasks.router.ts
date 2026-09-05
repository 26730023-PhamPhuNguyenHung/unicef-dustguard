import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import { query, queryOne, run } from '../../db/connection.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCapability } from '../../middleware/rbac.js';

export const tasksRouter = Router();

// 1. List Tasks with Rich Filters & Normalization
tasksRouter.get('/', requireAuth, requireCapability('task:view'), (req: Request, res: Response) => {
  const { assigned_to, status, priority, case_id, source, task_type, filter, q } = req.query as Record<string, string | undefined>;
  const currentUserId = (req as any).user?.id;

  let sql = `
    SELECT t.*, c.case_code, c.title as case_title, u.full_name as assigned_to_name, u.role as assigned_to_role
    FROM tasks t
    LEFT JOIN cases c ON t.case_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  // Semantic Filter Tab
  if (filter) {
    switch (filter.toUpperCase()) {
      case 'MINE':
        if (currentUserId) {
          sql += ` AND t.assigned_to = ?`;
          params.push(currentUserId);
        }
        break;
      case 'UNASSIGNED':
        sql += ` AND (t.assigned_to IS NULL OR t.assigned_to = '')`;
        break;
      case 'OVERDUE':
        sql += ` AND t.due_at < datetime('now') AND t.status NOT IN ('DONE', 'COMPLETED', 'CANCELLED')`;
        break;
      case 'TODAY':
        sql += ` AND date(t.due_at) = date('now')`;
        break;
      case 'LEGAL':
        sql += ` AND (t.task_type = 'LEGAL_REVIEW' OR t.source = 'LEGAL')`;
        break;
      case 'FIELD':
        sql += ` AND (t.task_type IN ('FIELD_INSPECTION', 'CHECKLIST_PREP', 'REINSPECTION') OR t.source = 'INSPECTION')`;
        break;
      case 'FOLLOWUP':
        sql += ` AND (t.task_type = 'REMEDIATION_FOLLOWUP' OR t.source_entity_type = 'CORRECTIVE_ACTION')`;
        break;
      case 'COMPLETED':
      case 'DONE':
        sql += ` AND t.status IN ('DONE', 'COMPLETED')`;
        break;
      case 'TEAM':
      case 'ALL':
      default:
        break;
    }
  }

  // Direct Assignee
  if (assigned_to) {
    sql += ` AND t.assigned_to = ?`;
    params.push(assigned_to);
  }

  // Status Filter with Bidirectional Normalization (TODO <-> OPEN, DONE <-> COMPLETED)
  if (status && status !== 'ALL') {
    const st = status.toUpperCase();
    if (st === 'TODO' || st === 'OPEN') {
      sql += ` AND t.status IN ('TODO', 'OPEN')`;
    } else if (st === 'DONE' || st === 'COMPLETED') {
      sql += ` AND t.status IN ('DONE', 'COMPLETED')`;
    } else {
      sql += ` AND t.status = ?`;
      params.push(st);
    }
  }

  // Priority Filter
  if (priority && priority !== 'ALL') {
    sql += ` AND t.priority = ?`;
    params.push(priority.toUpperCase());
  }

  // Task Type Filter
  if (task_type && task_type !== 'ALL') {
    sql += ` AND t.task_type = ?`;
    params.push(task_type);
  }

  // Case ID Filter
  if (case_id) {
    sql += ` AND t.case_id = ?`;
    params.push(case_id);
  }

  // Source Filter
  if (source) {
    sql += ` AND t.source = ?`;
    params.push(source);
  }

  // Keyword Search
  if (q && q.trim()) {
    sql += ` AND (t.title LIKE ? OR t.description LIKE ? OR c.case_code LIKE ?)`;
    const searchPattern = `%${q.trim()}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  // Ordering: active tasks first, then by priority (URGENT -> HIGH -> NORMAL -> LOW), then due date
  sql += `
    ORDER BY 
      CASE WHEN t.status IN ('DONE', 'COMPLETED', 'CANCELLED') THEN 1 ELSE 0 END,
      CASE t.priority 
        WHEN 'URGENT' THEN 0 
        WHEN 'HIGH' THEN 1 
        WHEN 'NORMAL' THEN 2 
        ELSE 3 
      END,
      t.due_at ASC, 
      t.created_at DESC
  `;

  const rawTasks = query<any>(sql, params);

  const tasks = rawTasks.map(t => {
    let normalizedStatus = t.status;
    if (t.status === 'OPEN') normalizedStatus = 'TODO';
    if (t.status === 'COMPLETED') normalizedStatus = 'DONE';

    return {
      ...t,
      status: normalizedStatus,
      raw_status: t.status,
      is_done: ['DONE', 'COMPLETED'].includes(t.status),
      is_overdue:
        t.due_at &&
        new Date(t.due_at).getTime() < Date.now() &&
        !['DONE', 'COMPLETED', 'CANCELLED'].includes(t.status),
    };
  });

  res.json({
    success: true,
    tasks,
    data: tasks,
    total: tasks.length,
  });
});

// 2. Create Task
tasksRouter.post('/', requireAuth, requireCapability('task:update'), (req: Request, res: Response) => {
  const {
    case_id,
    title,
    description = '',
    task_type = 'GENERAL',
    source = 'MANUAL',
    source_entity_type,
    source_entity_id,
    assigned_to,
    priority = 'NORMAL',
    due_at,
  } = req.body;

  if (!title) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Tiêu đề nhiệm vụ là bắt buộc' },
    });
    return;
  }

  const id = `task-${Date.now()}-${crypto.randomUUID().substring(0, 6)}`;
  const finalDueAt = due_at || new Date(Date.now() + 2 * 86400000).toISOString();
  const initialStatus = 'OPEN';

  run(
    `INSERT INTO tasks (
      id, case_id, title, description, task_type, source, source_entity_type, 
      source_entity_id, assigned_to, status, priority, due_at, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      id,
      case_id || null,
      title,
      description,
      task_type,
      source,
      source_entity_type || null,
      source_entity_id || null,
      assigned_to || null,
      initialStatus,
      priority,
      finalDueAt,
    ]
  );

  run(
    `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
     VALUES (?, ?, 'CREATE_TASK', 'TASK', ?, ?, ?, datetime('now'))`,
    [
      `aud-${Date.now()}`,
      (req as any).user?.id,
      id,
      JSON.stringify({ title, task_type, priority, assigned_to }),
      req.ip || '127.0.0.1',
    ]
  );

  const created = queryOne<any>(
    `SELECT t.*, c.case_code, c.title as case_title, u.full_name as assigned_to_name
     FROM tasks t
     LEFT JOIN cases c ON t.case_id = c.id
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.id = ?`,
    [id]
  );

  res.status(201).json({
    success: true,
    task: created,
    data: created,
  });
});

// 3. Update Task (Status, Assignee, Priority, Details)
tasksRouter.patch('/:id', requireAuth, requireCapability('task:update'), (req: Request, res: Response) => {
  const { id } = req.params;
  const task = queryOne<any>(`SELECT * FROM tasks WHERE id = ?`, [id]);
  if (!task) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy tác vụ' } });
    return;
  }

  const { status, priority, due_at, assigned_to, title, description, task_type } = req.body;

  let newStatus = task.status;
  if (status) {
    const st = status.toUpperCase();
    if (st === 'TODO' || st === 'OPEN') newStatus = 'OPEN';
    else if (st === 'DONE' || st === 'COMPLETED') newStatus = 'COMPLETED';
    else newStatus = st;
  }

  const newPriority = priority || task.priority;
  const newDueAt = due_at || task.due_at;
  const newAssignedTo = assigned_to !== undefined ? assigned_to : task.assigned_to;
  const newTitle = title || task.title;
  const newDesc = description !== undefined ? description : task.description;
  const newTaskType = task_type || task.task_type || 'GENERAL';

  let completedAt = task.completed_at;
  if (newStatus === 'DONE' || newStatus === 'COMPLETED') {
    completedAt = completedAt || new Date().toISOString();
  } else if (newStatus === 'TODO' || newStatus === 'OPEN' || newStatus === 'IN_PROGRESS') {
    completedAt = null;
  }

  run(
    `UPDATE tasks
     SET title = ?, description = ?, task_type = ?, status = ?, priority = ?, due_at = ?, assigned_to = ?, completed_at = ?
     WHERE id = ?`,
    [newTitle, newDesc, newTaskType, newStatus, newPriority, newDueAt, newAssignedTo, completedAt, id]
  );

  run(
    `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
     VALUES (?, ?, 'UPDATE_TASK', 'TASK', ?, ?, ?, datetime('now'))`,
    [
      `aud-${Date.now()}`,
      (req as any).user?.id,
      id,
      JSON.stringify({ oldStatus: task.status, newStatus, assigned_to: newAssignedTo }),
      req.ip || '127.0.0.1',
    ]
  );

  const updated = queryOne<any>(
    `SELECT t.*, c.case_code, c.title as case_title, u.full_name as assigned_to_name
     FROM tasks t
     LEFT JOIN cases c ON t.case_id = c.id
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.id = ?`,
    [id]
  );

  let normalizedStatus = updated.status;
  if (updated.status === 'OPEN') normalizedStatus = 'TODO';
  if (updated.status === 'COMPLETED') normalizedStatus = 'DONE';

  const formatted = {
    ...updated,
    status: normalizedStatus,
    raw_status: updated.status,
    is_done: ['DONE', 'COMPLETED'].includes(updated.status),
  };

  res.json({
    success: true,
    task: formatted,
    data: formatted,
  });
});

// 4. Delete / Cancel Task
tasksRouter.delete('/:id', requireAuth, requireCapability('task:update'), (req: Request, res: Response) => {
  const { id } = req.params;
  const task = queryOne<any>(`SELECT * FROM tasks WHERE id = ?`, [id]);
  if (!task) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy tác vụ' } });
    return;
  }

  run(`DELETE FROM tasks WHERE id = ?`, [id]);

  run(
    `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
     VALUES (?, ?, 'DELETE_TASK', 'TASK', ?, ?, ?, datetime('now'))`,
    [`aud-${Date.now()}`, (req as any).user?.id, id, JSON.stringify({ title: task.title }), req.ip || '127.0.0.1']
  );

  res.json({ success: true, message: 'Đã xóa nhiệm vụ thành công' });
});
