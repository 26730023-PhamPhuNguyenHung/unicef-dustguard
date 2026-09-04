import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { get, run } from '../db/connection.js';
import type { Role, User } from '../shared.js';

export interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET || 'dustguard-ops-secret-key-2026';

import crypto from 'node:crypto';

export function createToken(user: { id: string; username: string; role: Role }): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role, jti: crypto.randomUUID() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const devUserId = req.headers['x-user-id'] as string | undefined;

  let userId: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      userId = decoded.id;
    } catch (err) {
      // Check session table fallback
      const session = get<{ user_id: string }>(
        `SELECT user_id FROM sessions WHERE token = ? AND expires_at > datetime('now')`,
        [token]
      );
      if (session) {
        userId = session.user_id;
      }
    }
  } else if (devUserId) {
    // Convenient dev/test header
    userId = devUserId;
  }

  if (userId) {
    const user = get<User>(
      `SELECT id, username, email, full_name, role, department, phone, active, created_at FROM users WHERE id = ? AND active = 1`,
      [userId]
    );
    if (user) {
      req.user = user;
    }
  }

  next();
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      type: 'https://dustguard.gov.vn/errors/unauthorized',
      title: 'Chưa xác thực',
      status: 401,
      detail: 'Vui lòng đăng nhập để thực hiện thao tác này.',
    });
    return;
  }
  next();
}
