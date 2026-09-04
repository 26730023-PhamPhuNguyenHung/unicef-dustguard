import { Router, Response } from 'express';
import { TaskRepository } from '../repositories/index.js';
import { submitTaskSchema } from '@dustguard/shared';
import { authenticateToken, requireRole, AuthRequest } from '../middlewares/auth.js';

const router = Router();

// Danh sách nhiệm vụ xác minh
router.get('/', (req, res: Response): void => {
  const status = req.query.status as string;
  const taskType = req.query.taskType as string;
  const tasks = TaskRepository.list({ status, taskType });
  res.json({ success: true, data: tasks });
});

// Chi tiết nhiệm vụ
router.get('/:id', (req, res: Response): void => {
  const task = TaskRepository.findById(req.params.id);
  if (!task) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy nhiệm vụ.' } });
    return;
  }
  res.json({ success: true, data: task });
});

// Nhận nhiệm vụ (Chỉ dành cho Member, Moderator, Admin)
router.post(
  '/:id/claim',
  authenticateToken,
  requireRole('community_member', 'member', 'moderator', 'admin'),
  (req: AuthRequest, res: Response): void => {
    const task = TaskRepository.claim(req.params.id, req.user!.id);
    if (!task) {
      res.status(400).json({ success: false, error: { code: 'CANNOT_CLAIM', message: 'Nhiệm vụ này đã được nhận hoặc không còn khả dụng.' } });
      return;
    }
    res.json({ success: true, data: task });
  }
);

// Nộp kết quả xác minh nhiệm vụ (Chỉ dành cho Member, Moderator, Admin)
router.post(
  '/:id/submit',
  authenticateToken,
  requireRole('community_member', 'member', 'moderator', 'admin'),
  (req: AuthRequest, res: Response): void => {
    const validated = submitTaskSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validated.error.errors[0]?.message } });
      return;
    }

    const updatedTask = TaskRepository.submit(req.params.id, req.user!.id, validated.data.result, validated.data.note);
    res.json({ success: true, data: updatedTask });
  }
);

export default router;
