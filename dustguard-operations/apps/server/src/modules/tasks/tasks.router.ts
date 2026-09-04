import { Router, Request, Response } from 'express';
import { query, queryOne, run } from '../../db/connection.js';
import { requireAuth } from '../../middleware/auth.js';
import { requireCapability } from '../../middleware/rbac.js';

export const tasksRouter = Router();

// 1. List Tasks
tasksRouter.get('/', requireAuth, requireCapability('task:view'), (req: Request, res: Response) => {
  const { assigned_to, status, priority, case_id, source } = req.query;

  let sql = `
    SELECT t.*, c.case_code, c.title as case_title, u.full_name as assigned_to_name
    FROM tasks t
    LEFT JOIN cases c ON t.case_id = c.id
    LEFT JOIN users u ON t.assigned_to = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (assigned_to) {
    sql += ` AND t.assigned_to = ?`;
    params.push(assigned_to);
  }
  if (status) {
    sql += ` AND t.status = ?`;
    params.push(status);
  }
  if (priority) {
    sql += ` AND t.priority = ?`;
    params.push(priority);
  }
  if (case_id) {
    sql += ` AND t.case_id = ?`;
    params.push(case_id);
  }
  if (source) {
    sql += ` AND t.source = ?`;
    params.push(source);
  }

  sql += ` ORDER BY CASE WHEN t.status = 'OPEN' THEN 0 ELSE 1 END, t.due_at ASC, t.created_at DESC`;

  const tasks = query<any>(sql, params);
  res.json({ success: true, data: tasks });
});

// 2. Create Task
tasksRouter.post('/', requireAuth, requireCapability('task:update'), (req: Request, res: Response) => {
  const {
    case_id,
    title,
    description = '',
    source = 'MANUAL',
    source_entity_type,
    source_entity_id,
    assigned_to,
    priority = 'NORMAL',
    due_at,
  } = req.body;

  if (!title || !due_at || !assigned_to) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Tiêu đề, hạn xử lý và người phụ trách là bắt buộc' },
    });
    return;
  }

  const id = `task-${Date.now()}`;
  run(
    `INSERT INTO tasks (id, case_id, title, description, source, source_entity_type, source_entity_id, assigned_to, status, priority, due_at, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'OPEN', ?, ?, datetime('now'))`,
    [id, case_id || null, title, description, source, source_entity_type || null, source_entity_id || null, assigned_to, priority, due_at]
  );

  run(
    `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
     VALUES (?, ?, 'CREATE_TASK', 'TASK', ?, ?, ?, datetime('now'))`,
    [`aud-${Date.now()}`, req.user?.id, id, JSON.stringify({ title, assigned_to }), req.ip || '127.0.0.1']
  );

  const created = queryOne<any>(
    `SELECT t.*, c.case_code, u.full_name as assigned_to_name
     FROM tasks t
     LEFT JOIN cases c ON t.case_id = c.id
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.id = ?`,
    [id]
  );

  res.status(201).json({ success: true, data: created });
});

// 3. Update Task Status
tasksRouter.patch('/:id', requireAuth, requireCapability('task:update'), (req: Request, res: Response) => {
  const { id } = req.params;
  const task = queryOne<any>(`SELECT * FROM tasks WHERE id = ?`, [id]);
  if (!task) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy tác vụ' } });
    return;
  }

  const { status, priority, due_at, assigned_to } = req.body;
  const newStatus = status || task.status;
  const newPriority = priority || task.priority;
  const newDueAt = due_at || task.due_at;
  const newAssignedTo = assigned_to || task.assigned_to;
  const completedAt = newStatus === 'COMPLETED' ? new Date().toISOString() : task.completed_at;

  run(
    `UPDATE tasks
     SET status = ?, priority = ?, due_at = ?, assigned_to = ?, completed_at = ?
     WHERE id = ?`,
    [newStatus, newPriority, newDueAt, newAssignedTo, completedAt, id]
  );

  run(
    `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
     VALUES (?, ?, 'UPDATE_TASK', 'TASK', ?, ?, ?, datetime('now'))`,
    [`aud-${Date.now()}`, req.user?.id, id, JSON.stringify({ oldStatus: task.status, newStatus }), req.ip || '127.0.0.1']
  );

  const updated = queryOne<any>(
    `SELECT t.*, c.case_code, u.full_name as assigned_to_name
     FROM tasks t
     LEFT JOIN cases c ON t.case_id = c.id
     LEFT JOIN users u ON t.assigned_to = u.id
     WHERE t.id = ?`,
    [id]
  );

  res.json({ success: true, data: updated });
});
