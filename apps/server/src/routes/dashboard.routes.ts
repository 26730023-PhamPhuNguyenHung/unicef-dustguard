import { Router, Response } from 'express';
import { DashboardRepository } from '../repositories/index.js';
import { authenticateToken, requireRole } from '../middlewares/auth.js';

const router = Router();

// Dashboard cộng đồng công khai
router.get('/', (req, res: Response): void => {
  const data = DashboardRepository.getCommunityDashboard();
  res.json({ success: true, data });
});

router.get('/community', (req, res: Response): void => {
  const data = DashboardRepository.getCommunityDashboard();
  res.json({ success: true, data });
});

// Dashboard điều phối viên
router.get('/moderator', authenticateToken, requireRole('moderator', 'admin'), (req, res: Response): void => {
  const data = DashboardRepository.getModeratorDashboard();
  res.json({ success: true, data });
});

// Dashboard quản trị hệ thống
router.get('/admin', authenticateToken, requireRole('admin'), (req, res: Response): void => {
  const data = DashboardRepository.getAdminDashboard();
  res.json({ success: true, data });
});

export default router;
