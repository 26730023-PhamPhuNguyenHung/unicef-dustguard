import { Router, Response } from 'express';
import { get, query, run } from '../../db/connection.js';
import { AuthRequest, requireAuth } from '../../middleware/auth.js';

export const notificationsRouter = Router();

// GET /api/notifications - List user's notifications
notificationsRouter.get('/', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const notifications = query(
    `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30`,
    [userId]
  );
  const unreadCount = get<{ c: number }>(
    `SELECT count(*) as c FROM notifications WHERE user_id = ? AND read = 0`,
    [userId]
  )?.c || 0;

  res.json({ notifications, unreadCount });
});

// POST /api/notifications/:id/read - Mark single as read
notificationsRouter.post('/:id/read', requireAuth, (req: AuthRequest, res) => {
  const { id } = req.params;
  const userId = req.user!.id;

  run(`UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?`, [id, userId]);
  res.json({ success: true });
});

// POST /api/notifications/read-all - Mark all as read
notificationsRouter.post('/read-all', requireAuth, (req: AuthRequest, res) => {
  const userId = req.user!.id;
  run(`UPDATE notifications SET read = 1 WHERE user_id = ?`, [userId]);
  res.json({ success: true });
});
