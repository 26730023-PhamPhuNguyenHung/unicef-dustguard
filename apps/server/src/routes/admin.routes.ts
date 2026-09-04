import { Router, Response } from 'express';
import { UserRepository, AuditRepository, DashboardRepository } from '../repositories/index.js';
import { authenticateToken, requireRole, AuthRequest } from '../middlewares/auth.js';

const router = Router();

// Middleware chỉ cho Admin
router.use(authenticateToken, requireRole('admin'));

// 1. Quản lý người dùng
router.get('/users', (req, res: Response): void => {
  const role = req.query.role as string;
  const status = req.query.status as string;
  const search = req.query.search as string;
  const users = UserRepository.list({ role, status, search });
  res.json({ success: true, data: users });
});

// 2. Đổi role người dùng
router.patch('/users/:id/role', (req: AuthRequest, res: Response): void => {
  const { role } = req.body;
  const updated = UserRepository.updateRole(req.params.id, role);
  AuditRepository.log({
    actorId: req.user!.id,
    action: 'CHANGE_USER_ROLE',
    entityType: 'user',
    entityId: req.params.id,
    metadata: { newRole: role },
    ipAddress: req.ip
  });
  res.json({ success: true, data: updated });
});

// 3. Tạm khóa / Kích hoạt tài khoản
router.patch('/users/:id/status', (req: AuthRequest, res: Response): void => {
  const { status } = req.body;
  const updated = UserRepository.updateStatus(req.params.id, status);
  AuditRepository.log({
    actorId: req.user!.id,
    action: status === 'suspended' ? 'SUSPEND_USER' : 'REACTIVATE_USER',
    entityType: 'user',
    entityId: req.params.id,
    metadata: { status },
    ipAddress: req.ip
  });
  res.json({ success: true, data: updated });
});

// 4. Nhật ký kiểm toán hệ thống
router.get('/audit', (req, res: Response): void => {
  const actorId = req.query.actorId as string;
  const action = req.query.action as string;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
  const logs = AuditRepository.list({ actorId, action, limit });
  res.json({ success: true, data: logs });
});

// 5. Thống kê hệ thống
router.get('/stats', (req, res: Response): void => {
  const stats = DashboardRepository.getAdminDashboard();
  res.json({ success: true, data: stats });
});

export default router;
