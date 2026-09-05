import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { ReportRepository, CaseRepository, AuditRepository, NotificationRepository } from '../repositories/index.js';
import { sqliteClient } from '../db/sqlite-client.js';
import { updateCaseStatusSchema, moderatorRejectReportSchema } from '@dustguard/shared';
import { authenticateToken, requireRole, AuthRequest } from '../middlewares/auth.js';
import { forwardCaseToOperations } from '../utils/handoff.js';

const router = Router();

// Middleware chỉ cho moderator và admin
router.use(authenticateToken, requireRole('moderator', 'admin'));

// 1. Hộp thư thẩm định phản ánh
router.get('/reports', (req: AuthRequest, res: Response): void => {
  const reports = sqliteClient.all(`
    SELECT r.*, u.full_name as reporterName,
           (SELECT COUNT(*) FROM report_media WHERE report_id = r.id) as mediaCount
    FROM reports r
    LEFT JOIN users u ON r.reporter_id = u.id
    WHERE r.status IN ('submitted', 'reviewing')
    ORDER BY r.created_at DESC
  `);

  // Bổ sung kiểm tra trùng lặp cho từng report
  const enriched = reports.map((r: any) => {
    const nearby = ReportRepository.findNearbyReportsOrCases(r.latitude, r.longitude, 150);
    return {
      ...r,
      possibleDuplicates: nearby
    };
  });

  res.json({ success: true, data: enriched });
});

// 2. Xác thực phản ánh (Hỗ trợ: verify_only, link_existing, hoặc create_case)
router.post('/reports/:id/verify', (req: AuthRequest, res: Response): void => {
  const report = ReportRepository.findById(req.params.id);
  if (!report) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy phản ánh.' } });
    return;
  }

  const { action, existingCaseId, caseTitle, caseSummary, priority } = req.body;

  if (action === 'link_existing' && existingCaseId) {
    CaseRepository.linkReport(existingCaseId, report.id, req.user!.id);
    ReportRepository.updateStatus(report.id, 'verified', existingCaseId);

    NotificationRepository.create({
      userId: report.reporter_id,
      type: 'case_update',
      title: 'Phản ánh của bạn đã được xác thực',
      message: 'Phản ánh đã được tổng hợp vào hồ sơ theo dõi vụ việc chung của khu vực.',
      entityType: 'case',
      entityId: existingCaseId
    });

    AuditRepository.log({
      actorId: req.user!.id,
      action: 'VERIFY_REPORT',
      entityType: 'report',
      entityId: report.id,
      metadata: { action: 'link_existing', caseId: existingCaseId },
      ipAddress: req.ip
    });

    res.json({ success: true, data: { message: 'Đã liên kết phản ánh vào vụ việc thành công.' } });
  } else if (action === 'create_case' || caseTitle) {
    // Tạo case mới
    const year = new Date().getFullYear();
    const caseCode = `DG-C-${year}-${crypto.randomInt(1000, 10000)}`;
    const caseId = `case_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;

    const newCase = CaseRepository.create({
      id: caseId,
      caseCode,
      title: caseTitle || report.title,
      summary: caseSummary || report.description,
      category: report.category,
      latitude: report.latitude,
      longitude: report.longitude,
      address: report.address,
      ward: report.ward,
      district: report.district,
      city: report.city || 'TP. Hồ Chí Minh',
      status: 'confirmed_signal',
      priority: priority || 'normal',
      createdBy: req.user!.id
    });

    CaseRepository.linkReport(caseId, report.id, req.user!.id);
    ReportRepository.updateStatus(report.id, 'verified', caseId);

    NotificationRepository.create({
      userId: report.reporter_id,
      type: 'case_update',
      title: 'Phản ánh của bạn đã được tiếp nhận và tạo hồ sơ vụ việc',
      message: `Hồ sơ ${caseCode} đã được khởi tạo để theo dõi tiến độ xử lý.`,
      entityType: 'case',
      entityId: caseId
    });

    AuditRepository.log({
      actorId: req.user!.id,
      action: 'CREATE_CASE',
      entityType: 'case',
      entityId: caseId,
      metadata: { code: caseCode, title: newCase.title },
      ipAddress: req.ip
    });

    res.status(201).json({ success: true, data: newCase });
  } else {
    // Mặc định hoặc action === 'verify_only': Xác nhận tín hiệu hợp lệ
    ReportRepository.updateStatus(report.id, 'verified');

    NotificationRepository.create({
      userId: report.reporter_id,
      type: 'system',
      title: 'Phản ánh đã được điều phối viên xác nhận hợp lệ',
      message: 'Cộng đồng ghi nhận thông tin đóng góp chính xác từ bạn.',
      entityType: 'report',
      entityId: report.id
    });

    AuditRepository.log({
      actorId: req.user!.id,
      action: 'VERIFY_REPORT',
      entityType: 'report',
      entityId: report.id,
      metadata: { action: 'verify_only' },
      ipAddress: req.ip
    });

    res.json({
      success: true,
      data: {
        message: 'Đã xác nhận phản ánh hợp lệ.',
        report: { ...report, status: 'verified' }
      }
    });
  }
});

// 2b. Tạo vụ việc mới độc lập hoặc từ phản ánh
router.post('/cases', (req: AuthRequest, res: Response): void => {
  const { reportId, title, summary, category, latitude, longitude, address, district, ward, city, priority } = req.body;

  if (!title || !address || !district) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Vui lòng cung cấp đầy đủ tiêu đề, địa chỉ và quận huyện.' }
    });
    return;
  }

  const year = new Date().getFullYear();
  const caseCode = `DG-C-${year}-${crypto.randomInt(1000, 10000)}`;
  const caseId = `case_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;

  const newCase = CaseRepository.create({
    id: caseId,
    caseCode,
    title,
    summary: summary || '',
    category: category || 'dust',
    latitude: latitude || 10.7769,
    longitude: longitude || 106.7009,
    address,
    ward: ward || '',
    district,
    city: city || 'TP. Hồ Chí Minh',
    status: 'confirmed_signal',
    priority: priority || 'normal',
    createdBy: req.user!.id
  });

  if (reportId) {
    CaseRepository.linkReport(caseId, reportId, req.user!.id);
    ReportRepository.updateStatus(reportId, 'verified', caseId);

    const report = ReportRepository.findById(reportId);
    if (report) {
      NotificationRepository.create({
        userId: report.reporter_id,
        type: 'case_update',
        title: 'Phản ánh của bạn đã được chuyển thành vụ việc cộng đồng',
        message: `Vụ việc ${caseCode} đã được khởi tạo để theo dõi tiến độ.`,
        entityType: 'case',
        entityId: caseId
      });
    }
  }

  AuditRepository.log({
    actorId: req.user!.id,
    action: 'CREATE_CASE',
    entityType: 'case',
    entityId: caseId,
    metadata: { code: caseCode, title: newCase.title, reportId },
    ipAddress: req.ip
  });

  res.status(201).json({ success: true, data: newCase });
});

// 3. Từ chối phản ánh (kèm lý do)
router.post('/reports/:id/reject', (req: AuthRequest, res: Response): void => {
  const validated = moderatorRejectReportSchema.safeParse(req.body);
  if (!validated.success) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validated.error.errors[0]?.message } });
    return;
  }

  const report = ReportRepository.findById(req.params.id);
  if (!report) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy phản ánh.' } });
    return;
  }

  ReportRepository.updateStatus(report.id, 'rejected');

  NotificationRepository.create({
    userId: report.reporter_id,
    type: 'system',
    title: 'Phản ánh không đủ điều kiện xác thực',
    message: `Lý do: ${validated.data.reason}`,
    entityType: 'report',
    entityId: report.id
  });

  AuditRepository.log({
    actorId: req.user!.id,
    action: 'REJECT_REPORT',
    entityType: 'report',
    entityId: report.id,
    metadata: { reason: validated.data.reason },
    ipAddress: req.ip
  });

  res.json({ success: true, data: { message: 'Đã từ chối phản ánh.' } });
});

// 4. Gộp phản ánh vào case (Hỗ trợ cả targetCaseId và caseId)
router.post('/reports/:id/merge', (req: AuthRequest, res: Response): void => {
  const targetCaseId = req.body.targetCaseId || req.body.caseId;
  if (!targetCaseId) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Vui lòng chọn vụ việc cần gộp.' }
    });
    return;
  }

  const report = ReportRepository.findById(req.params.id);
  if (!report) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy phản ánh.' } });
    return;
  }

  const targetCase = CaseRepository.findById(targetCaseId);
  if (!targetCase) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Vụ việc mục tiêu không tồn tại.' } });
    return;
  }

  CaseRepository.linkReport(targetCaseId, report.id, req.user!.id);
  ReportRepository.updateStatus(report.id, 'merged', targetCaseId);

  // Tăng signal count cho vụ việc mục tiêu
  sqliteClient.run('UPDATE cases SET signal_count = signal_count + 1 WHERE id = ?', [targetCaseId]);

  NotificationRepository.create({
    userId: report.reporter_id,
    type: 'case_update',
    title: 'Phản ánh của bạn đã được gộp vào vụ việc theo dõi chung',
    message: `Thông tin đã được liên kết với vụ việc ${targetCase.case_code || targetCase.caseCode}.`,
    entityType: 'case',
    entityId: targetCaseId
  });

  AuditRepository.log({
    actorId: req.user!.id,
    action: 'MERGE_REPORT',
    entityType: 'report',
    entityId: report.id,
    metadata: { targetCaseId },
    ipAddress: req.ip
  });

  res.json({ success: true, data: { message: 'Đã gộp phản ánh thành công.', targetCaseId } });
});

// 5. Cập nhật trạng thái case (cho Kanban điều phối) - Hỗ trợ cả PATCH và PUT
const handleCaseStatusUpdate = (req: AuthRequest, res: Response): void => {
  const newStatus = req.body.newStatus || req.body.status;
  const rawBody = {
    ...req.body,
    newStatus,
    title: req.body.title || `Cập nhật trạng thái: ${newStatus}`,
    content: req.body.content || req.body.reason || `Vụ việc được chuyển trạng thái sang ${newStatus}`,
    isPublic: req.body.isPublic !== undefined ? req.body.isPublic : true
  };
  const validated = updateCaseStatusSchema.safeParse(rawBody);
  if (!validated.success) {
    res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: validated.error.errors[0]?.message } });
    return;
  }

  const updatedCase = CaseRepository.updateStatus(
    req.params.id,
    validated.data.newStatus,
    validated.data.title,
    validated.data.content,
    req.user!.id,
    validated.data.isPublic
  );

  // Bắn thông báo cho những người đang lưu/theo dõi case này
  const followers = sqliteClient.all('SELECT user_id FROM saved_cases WHERE case_id = ?', [req.params.id]);
  for (const f of followers) {
    NotificationRepository.create({
      userId: f.user_id,
      type: 'case_update',
      title: `Vụ việc ${updatedCase.case_code} vừa có cập nhật tiến độ`,
      message: validated.data.title,
      entityType: 'case',
      entityId: req.params.id
    });
  }

  AuditRepository.log({
    actorId: req.user!.id,
    action: 'CHANGE_CASE_STATUS',
    entityType: 'case',
    entityId: req.params.id,
    metadata: { newStatus: validated.data.newStatus },
    ipAddress: req.ip
  });

  // Tự động kích hoạt bàn giao có trách nhiệm sang Side B (Operations) nếu trạng thái là forwarded
  if (validated.data.newStatus === 'forwarded') {
    forwardCaseToOperations(updatedCase).then((result) => {
      if (result.success) {
        AuditRepository.log({
          actorId: req.user!.id,
          action: 'INSTITUTIONAL_HANDOFF',
          entityType: 'case',
          entityId: req.params.id,
          metadata: { target: 'Operations Service', externalCaseId: updatedCase.id },
          ipAddress: req.ip
        });
      }
    }).catch((err) => {
      console.warn('[Handoff Background Error]', err);
    });
  }

  res.json({ success: true, data: updatedCase });
};

router.patch('/cases/:id/status', handleCaseStatusUpdate);
router.put('/cases/:id/status', handleCaseStatusUpdate);

// 6. Hàng đợi kiểm duyệt nội dung bị báo cáo
router.get('/content', (req, res: Response): void => {
  const queue = sqliteClient.all(`
    SELECT cr.*, u.full_name as reporterName
    FROM content_reports cr
    LEFT JOIN users u ON cr.reporter_id = u.id
    WHERE cr.status = 'pending'
    ORDER BY cr.created_at DESC
  `);
  res.json({ success: true, data: queue });
});

// 7. Xử lý báo cáo nội dung
router.post('/content/:id/action', (req: AuthRequest, res: Response): void => {
  const { action } = req.body; // 'dismiss' | 'hide' | 'delete'
  const now = new Date().toISOString();

  if (action === 'dismiss') {
    sqliteClient.run('UPDATE content_reports SET status = \'dismissed\', reviewed_by = ?, reviewed_at = ? WHERE id = ?', [req.user!.id, now, req.params.id]);
  } else {
    sqliteClient.run('UPDATE content_reports SET status = \'actioned\', reviewed_by = ?, reviewed_at = ? WHERE id = ?', [req.user!.id, now, req.params.id]);
  }

  res.json({ success: true, data: { message: 'Đã xử lý yêu cầu kiểm duyệt.' } });
});

export default router;
