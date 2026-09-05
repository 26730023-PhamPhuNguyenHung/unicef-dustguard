import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import { get, run } from '../../db/connection.js';
import { AuthRequest, createToken } from '../../middleware/auth.js';
import { LoginSchema, ROLE_PERMISSIONS, User } from '../../shared.js';

export const authRouter = Router();

authRouter.post('/login', (req, res, next) => {
  try {
    const { username, password } = LoginSchema.parse(req.body);

    const user = get<User & { password_hash: string }>(
      `SELECT * FROM users WHERE username = ? AND active = 1`,
      [username]
    );

    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      res.status(401).json({
        type: 'https://dustguard.gov.vn/errors/invalid-credentials',
        title: 'Đăng nhập thất bại',
        status: 401,
        detail: 'Tên đăng nhập hoặc mật khẩu không chính xác.',
      });
      return;
    }

    const token = createToken({ id: user.id, username: user.username, role: user.role });
    const sessionId = `ses-${crypto.randomUUID()}`;

    run(
      `INSERT OR REPLACE INTO sessions (id, user_id, token, expires_at, created_at)
       VALUES (?, ?, ?, datetime('now', '+7 days'), datetime('now'))`,
      [sessionId, user.id, token]
    );

    // Audit log
    run(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
       VALUES (?, ?, 'USER_LOGIN', 'USER', ?, ?, ?, datetime('now'))`,
      [`aud-${crypto.randomUUID()}`, user.id, user.id, JSON.stringify({ role: user.role }), req.ip || '127.0.0.1']
    );

    const { password_hash, ...safeUser } = user;
    res.json({
      user: safeUser,
      token,
      permissions: ROLE_PERMISSIONS[user.role] || [],
    });
  } catch (err) {
    next(err);
  }
});

authRouter.get('/me', (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401).json({
      type: 'https://dustguard.gov.vn/errors/unauthorized',
      title: 'Chưa đăng nhập',
      status: 401,
      detail: 'Chưa có phiên làm việc.',
    });
    return;
  }

  res.json({
    user: req.user,
    permissions: ROLE_PERMISSIONS[req.user.role] || [],
  });
});

authRouter.post('/logout', (req: AuthRequest, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    run(`DELETE FROM sessions WHERE token = ?`, [token]);
  }
  res.json({ success: true, message: 'Đăng xuất thành công.' });
});

// GET /api/auth/setup-status - Check if system needs initial bootstrap
authRouter.get('/setup-status', (req, res) => {
  const countRow = get<{ c: number }>(`SELECT count(*) as c FROM users`);
  const userCount = countRow?.c || 0;
  const legalCorpusCount = get<{ c: number }>(`SELECT count(*) as c FROM legal_documents`)?.c || 0;
  const templateCount = get<{ c: number }>(`SELECT count(*) as c FROM inspection_templates`)?.c || 0;

  res.json({
    is_initialized: userCount > 0,
    user_count: userCount,
    role_count: 6,
    template_count: templateCount,
    legal_corpus_count: legalCorpusCount,
  });
});

// POST /api/auth/bootstrap - First-run administrator initialization
authRouter.post('/bootstrap', (req, res, next) => {
  try {
    const countRow = get<{ c: number }>(`SELECT count(*) as c FROM users`);
    const userCount = countRow?.c || 0;

    if (userCount > 0) {
      res.status(403).json({
        type: 'https://dustguard.gov.vn/errors/system-already-initialized',
        title: 'Khởi tạo bị từ chối',
        status: 403,
        detail: 'Hệ thống đã có tài khoản người dùng. Tính năng khởi tạo ban đầu (Bootstrap) bị khóa vĩnh viễn vì lý do bảo mật.',
      });
      return;
    }

    const { username, password, full_name, email, department, phone } = req.body;
    if (!username || !password || !full_name || !email) {
      res.status(400).json({ error: 'Tên đăng nhập, mật khẩu, họ tên và email là bắt buộc.' });
      return;
    }

    const userId = `usr-admin-${crypto.randomUUID().substring(0, 8)}`;
    const hash = bcrypt.hashSync(password, 8);

    run(
      `INSERT INTO users (id, username, password_hash, full_name, email, role, department, phone, active, created_at)
       VALUES (?, ?, ?, ?, ?, 'admin', ?, ?, 1, datetime('now'))`,
      [userId, username.trim(), hash, full_name.trim(), email.trim(), department || 'Trung tâm Vận hành CNTT', phone || null]
    );

    const token = createToken({ id: userId, username, role: 'admin' });
    const sessionId = `ses-${crypto.randomUUID()}`;

    run(
      `INSERT OR REPLACE INTO sessions (id, user_id, token, expires_at, created_at)
       VALUES (?, ?, ?, datetime('now', '+7 days'), datetime('now'))`,
      [sessionId, userId, token]
    );

    // Audit log
    run(
      `INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata_json, ip_address, created_at)
       VALUES (?, ?, 'SYSTEM_BOOTSTRAP', 'USER', ?, ?, ?, datetime('now'))`,
      [`aud-${crypto.randomUUID()}`, userId, userId, JSON.stringify({ username, role: 'admin' }), req.ip || '127.0.0.1']
    );

    const createdUser = get<User>(`SELECT id, username, email, full_name, role, department, phone, active, created_at FROM users WHERE id = ?`, [userId]);

    res.status(201).json({
      success: true,
      message: 'Khởi tạo hệ thống thành công! Bạn hiện là Quản trị viên tối cao.',
      user: createdUser,
      token,
      permissions: ROLE_PERMISSIONS['admin'] || [],
    });
  } catch (err) {
    next(err);
  }
});

