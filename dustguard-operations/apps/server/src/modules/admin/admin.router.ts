import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { get, query, run } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';
import { requirePermission } from '../../middleware/rbac.js';

export const adminRouter = Router();

// GET /api/admin/users - List users with active workload
adminRouter.get('/users', requireAuth, (req, res) => {
  const users = query(
    `SELECT u.id, u.username, u.email, u.full_name, u.role, u.department, u.phone, u.active, u.created_at,
            count(c.id) as assigned_cases_count
     FROM users u
     LEFT JOIN cases c ON u.id = c.assigned_staff_id AND c.status != 'CLOSED'
     GROUP BY u.id
     ORDER BY u.role, u.created_at ASC`
  );

  res.json({ users });
});

// POST /api/admin/users - Create new user
adminRouter.post('/users', requirePermission('user:manage'), (req: AuthRequest, res, next) => {
  try {
    const { username, password, full_name, email, role, department, phone } = req.body;
    if (!username || !password || !full_name || !email || !role) {
      res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc.' });
      return;
    }

    const existing = get(`SELECT id FROM users WHERE username = ? OR email = ?`, [username, email]);
    if (existing) {
      res.status(400).json({ error: 'Tên đăng nhập hoặc email đã tồn tại trên hệ thống.' });
      return;
    }

    const userId = `usr-${crypto.randomUUID().substring(0, 8)}`;
    const hash = bcrypt.hashSync(password, 8);

    run(
      `INSERT INTO users (id, username, password_hash, full_name, email, role, department, phone, active, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, datetime('now'))`,
      [userId, username, hash, full_name, email, role, department || 'Bộ phận chuyên môn', phone || null]
    );

    // Audit log
    run(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
       VALUES (?, ?, 'USER_CREATED', 'USER', ?, ?, ?, datetime('now'))`,
      [`aud-${crypto.randomUUID()}`, req.user!.id, userId, JSON.stringify({ username, role }), req.ip || '127.0.0.1']
    );

    const user = get(`SELECT id, username, email, full_name, role, department, phone, active, created_at FROM users WHERE id = ?`, [userId]);
    res.status(201).json({ user });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/users/:id - Update user status or details
adminRouter.patch('/users/:id', requirePermission('user:manage'), (req: AuthRequest, res, next) => {
  try {
    const { id } = req.params;
    const { active, role, department, phone, full_name } = req.body;

    const existing = get(`SELECT id FROM users WHERE id = ?`, [id]);
    if (!existing) {
      res.status(404).json({ error: 'Không tìm thấy người dùng' });
      return;
    }

    run(
      `UPDATE users
       SET active = COALESCE(?, active),
           role = COALESCE(?, role),
           department = COALESCE(?, department),
           phone = COALESCE(?, phone),
           full_name = COALESCE(?, full_name)
       WHERE id = ?`,
      [active, role, department, phone, full_name, id]
    );

    // Audit log
    run(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
       VALUES (?, ?, 'USER_UPDATED', 'USER', ?, ?, ?, datetime('now'))`,
      [`aud-${crypto.randomUUID()}`, req.user!.id, id, JSON.stringify(req.body), req.ip || '127.0.0.1']
    );

    const updated = get(`SELECT id, username, email, full_name, role, department, phone, active, created_at FROM users WHERE id = ?`, [id]);
    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/audit - Audit trail viewer
adminRouter.get('/audit', requirePermission('audit:view'), (req, res) => {
  const { action, entity_type, limit } = req.query;

  let sql = `
    SELECT al.*, u.full_name as user_name, u.role as user_role
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE 1=1
  `;
  const params: any[] = [];

  if (action && typeof action === 'string') {
    sql += ` AND al.action LIKE ?`;
    params.push(`%${action}%`);
  }
  if (entity_type && typeof entity_type === 'string') {
    sql += ` AND al.entity_type = ?`;
    params.push(entity_type);
  }

  sql += ` ORDER BY al.created_at DESC LIMIT ?`;
  params.push(limit ? parseInt(limit as string, 10) : 50);

  const logs = query(sql, params);
  res.json({ logs });
});

// GET /api/admin/configs
adminRouter.get('/configs', requirePermission('system:config'), (req, res) => {
  const configs = query(`SELECT * FROM system_configs`);
  res.json({ configs });
});

// PATCH /api/admin/configs/:key
adminRouter.patch('/configs/:key', requirePermission('system:config'), (req: AuthRequest, res) => {
  const { key } = req.params;
  const { value_json, description } = req.body;

  run(
    `UPDATE system_configs SET value_json = ?, description = COALESCE(?, description), updated_at = datetime('now') WHERE key = ?`,
    [typeof value_json === 'string' ? value_json : JSON.stringify(value_json), description, key]
  );

  const updated = get(`SELECT * FROM system_configs WHERE key = ?`, [key]);
  res.json({ config: updated });
});
