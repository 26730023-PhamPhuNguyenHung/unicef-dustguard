import { Router, Response } from 'express';
import { ReportRepository, SavedCaseRepository, UserRepository } from '../repositories/index.js';
import { sqliteClient } from '../db/sqlite-client.js';
import { authenticateToken, AuthRequest } from '../middlewares/auth.js';

const router = Router();

// Phản ánh của tôi
router.get('/reports', authenticateToken, (req: AuthRequest, res: Response): void => {
  const myReports = ReportRepository.list({ reporterId: req.user!.id });
  res.json({ success: true, data: myReports });
});

// Danh sách vụ việc đã lưu
router.get('/saved', authenticateToken, (req: AuthRequest, res: Response): void => {
  const savedCases = SavedCaseRepository.listSavedByUser(req.user!.id);
  res.json({ success: true, data: savedCases });
});

// Lịch sử đóng góp (theo đúng mục 13 và 35: tinh tế, ý nghĩa, không leaderboard)
router.get('/contributions', authenticateToken, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;

  const reportCount = sqliteClient.get('SELECT COUNT(*) as count FROM reports WHERE reporter_id = ?', [userId])?.count || 0;
  const obsCount = sqliteClient.get('SELECT COUNT(*) as count FROM observations WHERE user_id = ?', [userId])?.count || 0;
  const confCount = sqliteClient.get('SELECT COUNT(*) as count FROM confirmations WHERE user_id = ?', [userId])?.count || 0;
  const taskCount = sqliteClient.get('SELECT COUNT(*) as count FROM task_submissions WHERE user_id = ?', [userId])?.count || 0;

  const contributions = sqliteClient.all(`
    SELECT * FROM user_contributions WHERE user_id = ? ORDER BY created_at DESC
  `, [userId]);

  res.json({
    success: true,
    data: {
      stats: {
        totalContributions: reportCount + obsCount + confCount + taskCount,
        reports: reportCount,
        observations: obsCount,
        confirmations: confCount,
        taskVerifications: taskCount
      },
      milestoneMessage: `Bạn đã tham gia bổ sung và xác thực thông tin cho ${reportCount + obsCount} vụ việc tại địa bàn!`,
      timeline: contributions
    }
  });
});

// Cập nhật thông tin và quyền riêng tư (chế độ hiển thị ẩn danh 'anonymous')
router.patch('/profile', authenticateToken, (req: AuthRequest, res: Response): void => {
  const { fullName, district, ward, bio, displayIdentity } = req.body;
  const updated = UserRepository.updateProfile(req.user!.id, {
    fullName,
    district,
    ward,
    bio,
    displayIdentity
  });
  res.json({ success: true, data: updated });
});

export default router;
