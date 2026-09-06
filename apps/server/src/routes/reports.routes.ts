import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { ReportRepository, AuditRepository } from '../repositories/index.js';
import { createReportSchema } from '@dustguard/shared';
import { authenticateToken, optionalAuthenticateToken, AuthRequest } from '../middlewares/auth.js';
import { uploadMiddleware, computeFileSha256 } from '../utils/upload.js';
import path from 'path';

const router = Router();

// 1. Kiểm tra trùng lặp thời gian thực
// Ghi chú vá lỗi (Bug P1 - Broken Contract): CreateReportPage.tsx gọi endpoint này với query
// `latitude`/`longitude` trong khi backend trước đây chỉ đọc `lat`/`lon` -> luôn trả 400 và modal
// cảnh báo trùng lặp không bao giờ hiển thị. Đồng thời tên field response không khớp
// (`hasPossibleDuplicate`/`nearbyCase` phía FE vs `hasDuplicate`/`possibleDuplicates` phía BE cũ).
// Nay hỗ trợ cả hai tên query param và trả về cả hai dạng field để tương thích ngược.
router.get('/check-duplicate', (req, res: Response): void => {
  const lat = parseFloat((req.query.latitude ?? req.query.lat) as string);
  const lon = parseFloat((req.query.longitude ?? req.query.lon) as string);

  if (isNaN(lat) || isNaN(lon)) {
    res.status(400).json({
      success: false,
      error: { code: 'INVALID_COORDINATES', message: 'Tọa độ không hợp lệ.' }
    });
    return;
  }

  const nearby = ReportRepository.findNearbyReportsOrCases(lat, lon, 150);
  res.json({
    success: true,
    data: {
      possibleDuplicates: nearby,
      hasDuplicate: nearby.length > 0,
      hasPossibleDuplicate: nearby.length > 0,
      nearbyCase: nearby.length > 0 ? nearby[0] : null
    }
  });
});

// 2. Danh sách phản ánh
router.get('/', optionalAuthenticateToken, (req: AuthRequest, res: Response): void => {
  const status = req.query.status as string;
  const category = req.query.category as string;
  const district = req.query.district as string;
  const search = req.query.search as string;

  const reports = ReportRepository.list({
    status: status === 'all' ? undefined : status,
    category,
    district,
    search,
    currentUserId: req.user?.id,
    currentUserRole: req.user?.role
  });

  res.json({
    success: true,
    data: reports
  });
});

// 3. Xem chi tiết phản ánh
router.get('/:id', optionalAuthenticateToken, (req: AuthRequest, res: Response): void => {
  const report = ReportRepository.findById(req.params.id, req.user?.id, req.user?.role);
  if (!report) {
    res.status(404).json({
      success: false,
      error: { code: 'REPORT_NOT_FOUND', message: 'Không tìm thấy phản ánh.' }
    });
    return;
  }
  if (report === 'FORBIDDEN') {
    res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xem phản ánh này.' }
    });
    return;
  }

  res.json({
    success: true,
    data: report
  });
});

// 4. Tạo phản ánh mới (Hỗ trợ cả người dân vãng lai không cần đăng nhập)
router.post('/', optionalAuthenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    const validated = createReportSchema.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validated.error.errors[0]?.message || 'Thông tin phản ánh không hợp lệ.'
        }
      });
      return;
    }

    const year = new Date().getFullYear();
    const randomCode = crypto.randomInt(1000, 10000);
    const reportCode = `DG-C-${year}-${randomCode}`;
    const reportId = `rep_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
    const reporterId = req.user?.id || 'usr_citizen';

    const newReport = ReportRepository.create({
      id: reportId,
      reportCode,
      reporterId,
      title: validated.data.title,
      description: validated.data.description,
      category: validated.data.category,
      latitude: validated.data.latitude,
      longitude: validated.data.longitude,
      address: validated.data.address,
      ward: validated.data.ward,
      district: validated.data.district,
      city: validated.data.city,
      observedAt: validated.data.observedAt,
      visibility: validated.data.visibility,
      status: 'submitted',
      severityObservation: validated.data.severityObservation,
      source: 'citizen'
    });

    // Thêm media nếu có đính kèm sẵn
    if (validated.data.mediaFiles && validated.data.mediaFiles.length > 0) {
      for (const m of validated.data.mediaFiles) {
        ReportRepository.addMedia({
          id: `med_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
          reportId,
          uploadedBy: reporterId,
          fileName: m.fileName,
          filePath: m.filePath,
          mimeType: m.mimeType,
          fileSize: m.fileSize,
          mediaType: m.mediaType,
          caption: m.caption,
          sha256Hash: m.sha256Hash
        });
      }
    }

    AuditRepository.log({
      actorId: reporterId,
      action: 'CREATE_REPORT',
      entityType: 'report',
      entityId: reportId,
      metadata: { code: reportCode, title: validated.data.title, isAnonymous: !req.user },
      ipAddress: req.ip
    });

    res.status(201).json({
      success: true,
      data: ReportRepository.findByIdRaw(reportId)
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: err.message }
    });
  }
});

// 5. Upload file ảnh minh chứng cho report (Hỗ trợ khách vãng lai)
router.post('/upload', optionalAuthenticateToken, uploadMiddleware.single('file'), (req: AuthRequest, res: Response): void => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'Vui lòng chọn file ảnh để tải lên.' }
    });
    return;
  }

  try {
    const sha256 = computeFileSha256(req.file.path);
    // Chuẩn hóa path tương đối để client dễ hiển thị
    const relativePath = `/uploads/${path.relative(path.resolve(process.cwd(), 'uploads'), req.file.path).replace(/\\/g, '/')}`;

    res.json({
      success: true,
      data: {
        fileName: req.file.originalname,
        filePath: relativePath,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        sha256Hash: sha256
      }
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: 'UPLOAD_ERROR', message: err.message }
    });
  }
});

// 6. Upload ảnh minh chứng trực tiếp cho report (Hỗ trợ khách vãng lai)
router.post('/:id/media', optionalAuthenticateToken, uploadMiddleware.single('file'), (req: AuthRequest, res: Response): void => {
  const report = ReportRepository.findByIdRaw(req.params.id);
  if (!report) {
    res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Không tìm thấy phản ánh.' } });
    return;
  }

  const caption = (req.body.caption as string) || '';
  const sha256Hash = (req.body.sha256Hash as string) || (req.file ? computeFileSha256(req.file.path) : 'sha256_mock_hash');
  const relativePath = req.file
    ? `/uploads/${path.relative(path.resolve(process.cwd(), 'uploads'), req.file.path).replace(/\\/g, '/')}`
    : '/uploads/demo-evidence.jpg';
  const fileName = req.file ? req.file.originalname : 'evidence.jpg';
  const mimeType = req.file ? req.file.mimetype : 'image/jpeg';
  const fileSize = req.file ? req.file.size : 1024;

  const mediaId = `med_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
  ReportRepository.addMedia({
    id: mediaId,
    reportId: report.id,
    uploadedBy: req.user?.id || report.reporter_id || 'usr_citizen',
    fileName,
    filePath: relativePath,
    mimeType,
    fileSize,
    sha256Hash,
    caption
  });

  res.status(201).json({
    success: true,
    data: {
      id: mediaId,
      report_id: report.id,
      file_name: fileName,
      file_path: relativePath,
      sha256_hash: sha256Hash,
      caption
    }
  });
});

export default router;
