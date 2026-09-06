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

// Lịch sử đóng góp & Dấu ấn cộng đồng (Dữ liệu thật từ SQLite SSOT)
router.get('/contributions', authenticateToken, (req: AuthRequest, res: Response): void => {
  const userId = req.user!.id;

  // 1. Phản ánh do người dùng gửi
  const userReports = sqliteClient.all(`
    SELECT r.id, r.report_code, r.title, r.district, r.ward, r.status, r.created_at,
           c.id as case_id, c.status as case_status, c.title as case_title
    FROM reports r
    LEFT JOIN cases c ON r.case_id = c.id
    WHERE r.reporter_id = ?
    ORDER BY r.created_at DESC
  `, [userId]) as any[];

  // 2. Quan sát hiện trường do người dùng đóng góp
  const userObservations = sqliteClient.all(`
    SELECT o.id, o.case_id, o.comment, o.created_at,
           c.title as case_title, c.case_code, c.district, c.status as case_status
    FROM observations o
    LEFT JOIN cases c ON o.case_id = c.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `, [userId]) as any[];

  // 3. Lượt cùng ghi nhận (confirmations)
  const userConfirmations = sqliteClient.all(`
    SELECT cf.id, cf.case_id, cf.created_at,
           c.title as case_title, c.case_code, c.district, c.status as case_status
    FROM confirmations cf
    LEFT JOIN cases c ON cf.case_id = c.id
    WHERE cf.user_id = ?
    ORDER BY cf.created_at DESC
  `, [userId]) as any[];

  // 4. Nhiệm vụ xác minh hiện trường (task submissions)
  const userTasks = sqliteClient.all(`
    SELECT ts.id, ts.task_id, ts.result, ts.note, ts.submitted_at as created_at,
           vt.title as task_title, vt.task_type,
           c.id as case_id, c.title as case_title, c.district, c.status as case_status
    FROM task_submissions ts
    LEFT JOIN verification_tasks vt ON ts.task_id = vt.id
    LEFT JOIN cases c ON vt.case_id = c.id
    WHERE ts.user_id = ?
    ORDER BY ts.submitted_at DESC
  `, [userId]) as any[];

  // 5. Chuẩn hóa thành danh sách hoạt động đóng góp thực tế
  const activities: any[] = [];

  userReports.forEach((r) => {
    const isVerified = ['verified', 'merged', 'resolved', 'closed'].includes(r.status);
    let outcome = 'Hoạt động này đang được theo dõi. DustGuard sẽ cập nhật khi có kết quả.';
    if (r.case_status === 'resolved' || r.status === 'resolved') {
      outcome = 'Vấn đề đã được khắc phục & xử lý dứt điểm.';
    } else if (r.status === 'verified' || r.status === 'merged') {
      outcome = 'Phản ánh đã được xác thực và chuyển giao đơn vị phụ trách.';
    } else if (r.status === 'reviewing') {
      outcome = 'Điều phối viên đang thẩm tra thông tin.';
    }

    activities.push({
      id: r.id,
      code: r.report_code || `DG-REP-${r.id.slice(0, 6).toUpperCase()}`,
      type: 'report',
      typeLabel: 'Phản ánh vi phạm',
      title: r.title || 'Phản ánh nguồn bụi phát tán',
      district: r.district || 'Hà Nội',
      role: 'Người phản ánh',
      isVerified,
      status: r.status,
      statusText: isVerified ? 'Đã xác minh' : (r.status === 'rejected' ? 'Từ chối' : 'Đang xử lý'),
      outcome,
      contributionHours: isVerified ? 1.5 : 1.0,
      createdAt: r.created_at,
      caseId: r.case_id,
      caseStatus: r.case_status
    });
  });

  userObservations.forEach((o) => {
    let outcome = 'Thông tin và hình ảnh thực địa đã được bổ sung vào hồ sơ.';
    if (o.case_status === 'resolved') {
      outcome = 'Vấn đề đã được khắc phục & xử lý dứt điểm.';
    } else if (o.case_status === 'in_progress') {
      outcome = 'Đơn vị thi công đang triển khai biện pháp giảm bụi.';
    }

    activities.push({
      id: o.id,
      code: `DG-OBS-${o.id.slice(0, 6).toUpperCase()}`,
      type: 'observation',
      typeLabel: 'Quan sát hiện trường',
      title: o.case_title ? `Khảo sát: ${o.case_title}` : (o.comment || 'Cập nhật hiện trường'),
      district: o.district || 'Hà Nội',
      role: 'Tình nguyện viên hiện trường',
      isVerified: true,
      status: 'verified',
      statusText: 'Đã xác minh',
      outcome,
      contributionHours: 1.0,
      createdAt: o.created_at,
      caseId: o.case_id,
      caseStatus: o.case_status
    });
  });

  userTasks.forEach((ts) => {
    activities.push({
      id: ts.id,
      code: `DG-TSK-${ts.id.slice(0, 6).toUpperCase()}`,
      type: 'verification',
      typeLabel: 'Xác minh nhiệm vụ',
      title: ts.task_title || (ts.case_title ? `Xác minh: ${ts.case_title}` : 'Nhiệm vụ kiểm tra hiện trường'),
      district: ts.district || 'Hà Nội',
      role: 'Cộng tác viên xác minh',
      isVerified: true,
      status: 'completed',
      statusText: 'Đã xác minh',
      outcome: 'Kết quả kiểm tra tại chỗ đã được đối soát vào hồ sơ cộng đồng.',
      contributionHours: 2.0,
      createdAt: ts.created_at,
      caseId: ts.case_id,
      caseStatus: ts.case_status
    });
  });

  userConfirmations.forEach((cf) => {
    let outcome = 'Tín hiệu đã giúp tăng mức độ ưu tiên của vụ việc.';
    if (cf.case_status === 'resolved') {
      outcome = 'Vấn đề đã được khắc phục & xử lý dứt điểm.';
    }

    activities.push({
      id: cf.id,
      code: `DG-CFM-${cf.id.slice(0, 6).toUpperCase()}`,
      type: 'confirmation',
      typeLabel: 'Cùng ghi nhận',
      title: cf.case_title ? `Đồng thuận: ${cf.case_title}` : 'Cùng ghi nhận vấn đề môi trường',
      district: cf.district || 'Hà Nội',
      role: 'Công dân đồng hành',
      isVerified: true,
      status: 'confirmed',
      statusText: 'Đã xác minh',
      outcome,
      contributionHours: 0.5,
      createdAt: cf.created_at,
      caseId: cf.case_id,
      caseStatus: cf.case_status
    });
  });

  // Sắp xếp theo thời gian mới nhất
  activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Thống kê địa bàn
  const locationSet = new Set<string>();
  activities.forEach(a => {
    if (a.district && a.district.trim()) locationSet.add(a.district.trim());
  });
  const locations = Array.from(locationSet);

  // Thống kê vụ việc đã được giải quyết liên quan tới user
  const resolvedCaseIds = new Set<string>();
  activities.forEach(a => {
    if (a.caseId && (a.caseStatus === 'resolved' || a.caseStatus === 'closed' || a.status === 'resolved')) {
      resolvedCaseIds.add(a.caseId);
    }
  });

  const totalActivities = activities.length;
  const verifiedActivities = activities.filter(a => a.isVerified).length;
  const inProgressActivities = totalActivities - verifiedActivities;
  const contributionHours = Number(activities.reduce((sum, a) => sum + (a.contributionHours || 0.5), 0).toFixed(1));

  res.json({
    success: true,
    data: {
      stats: {
        totalActivities,
        totalContributions: totalActivities,
        contributionHours,
        volunteerHours: contributionHours, // Tương thích ngược
        verifiedActivities,
        inProgressActivities,
        resolvedCasesCount: resolvedCaseIds.size,
        locationsCount: locations.length,
        locations,
        reports: userReports.length,
        observations: userObservations.length,
        confirmations: userConfirmations.length,
        taskVerifications: userTasks.length
      },
      milestoneMessage: `Bạn đã tham gia ${totalActivities} hoạt động tại ${locations.length} địa bàn, góp phần xử lý ${resolvedCaseIds.size} vấn đề môi trường!`,
      timeline: activities,
      contributions: activities
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
