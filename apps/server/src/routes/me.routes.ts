import { Router, Response } from 'express';
import { ReportRepository, SavedCaseRepository, UserRepository } from '../repositories/index.js';
import { sqliteClient } from '../db/sqlite-client.js';
import { authenticateToken, AuthRequest } from '../middlewares/auth.js';
import { updateProfileSchema } from '@dustguard/shared';

const router = Router();

// Phản ánh của tôi
router.get('/reports', authenticateToken, (req: AuthRequest, res: Response): void => {
  const myReports = ReportRepository.list({ reporterId: req.user!.id, currentUserId: req.user!.id, currentUserRole: req.user!.role });
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
  // Bug đã vá: trước đây không có validation nào - bio/fullName không giới hạn độ dài, và
  // displayIdentity có thể bị set thành 1 chuỗi tùy ý bất chấp ràng buộc CHECK('name','anonymous')
  // ở CSDL, khiến request bị lỗi CSDL 500 khó hiểu thay vì lỗi 400 rõ ràng.
  const validated = updateProfileSchema.safeParse(req.body);
  if (!validated.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: validated.error.errors[0]?.message || 'Dữ liệu hồ sơ không hợp lệ.' }
    });
    return;
  }
  const { fullName, district, ward, bio, displayIdentity } = validated.data;
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
