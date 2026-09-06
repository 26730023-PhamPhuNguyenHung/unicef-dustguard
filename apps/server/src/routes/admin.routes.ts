import { Router, Response } from 'express';
import { UserRepository, AuditRepository, DashboardRepository } from '../repositories/index.js';
import { authenticateToken, requireRole, AuthRequest } from '../middlewares/auth.js';
import { adminChangeRoleSchema, adminChangeStatusSchema } from '@dustguard/shared';

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
  // Bug đã vá: trước đây không kiểm tra `role` có nằm trong enum hợp lệ hay không - giá trị rác
  // sẽ vi phạm ràng buộc CHECK ở bảng users và ném lỗi CSDL 500 khó hiểu thay vì 400 rõ ràng.
  const validated = adminChangeRoleSchema.safeParse(req.body);
  if (!validated.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: validated.error.errors[0]?.message || 'Vai trò không hợp lệ.' }
    });
    return;
  }
  const { role } = validated.data;
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
  const validated = adminChangeStatusSchema.safeParse(req.body);
  if (!validated.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: validated.error.errors[0]?.message || 'Trạng thái không hợp lệ.' }
    });
    return;
  }
  const { status } = validated.data;
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

// 6. Trạng thái & Phiên bản hệ thống (Section 45-47)
router.get('/system-status', (req, res: Response): void => {
  res.json({
    success: true,
    data: {
      productName: 'DustGuard VN Community',
      productVersion: '1.0.0',
      buildDate: '2026-09-06',
      schemaVersion: '2.1',
      lastMigration: '2026-09-06T10:30:00Z',
      database: {
        type: 'SQLite / Cloudflare D1 Native WAL SSOT',
        tablesCount: 22,
        status: 'ONLINE'
      },
      crossSideSync: {
        target: 'http://localhost:4000/api',
        protocol: 'Idempotent Webhook (x-service-key)'
      },
      changelog: [
        { version: 'v1.0.0', date: '2026-09-06', type: 'Hardening', note: 'Two-Side Clean Architecture, 50m Geofence Buffer, Zero Mock Elimination' },
        { version: 'v0.9.4', date: '2026-09-04', type: 'Feature', note: 'Đồng bộ trạng thái công dân, Tránh tạo case trùng lặp' }
      ]
    }
  });
});

export default router;
