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
