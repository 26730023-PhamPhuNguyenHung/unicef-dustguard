import { Router, Response } from 'express';
import { NotificationRepository } from '../repositories/index.js';
import { authenticateToken, AuthRequest } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res: Response): void => {
  const list = NotificationRepository.listByUserId(req.user!.id);
  res.json({ success: true, data: list });
});

router.patch('/:id/read', authenticateToken, (req: AuthRequest, res: Response): void => {
  NotificationRepository.markAsRead(req.params.id, req.user!.id);
  res.json({ success: true, data: { message: 'Đã đánh dấu đã đọc.' } });
});

router.post('/read-all', authenticateToken, (req: AuthRequest, res: Response): void => {
  NotificationRepository.markAllAsRead(req.user!.id);
  res.json({ success: true, data: { message: 'Đã đánh dấu tất cả đã đọc.' } });
});

export default router;
