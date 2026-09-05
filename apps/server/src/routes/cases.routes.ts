import { Router, Response } from 'express';
import crypto from 'node:crypto';
import { CaseRepository, ConfirmationRepository, SavedCaseRepository, ObservationRepository } from '../repositories/index.js';
import { createObservationSchema } from '@dustguard/shared';
import { authenticateToken, optionalAuthenticateToken, AuthRequest } from '../middlewares/auth.js';
import { sqliteClient } from '../db/sqlite-client.js';

const router = Router();

// 1. Danh sách cases
router.get('/', optionalAuthenticateToken, (req: AuthRequest, res: Response): void => {
  const status = req.query.status as string;
  const category = req.query.category as string;
  const district = req.query.district as string;
  const priority = req.query.priority as string;
  const search = req.query.search as string;
  const sort = req.query.sort as 'newest' | 'signals' | 'recent_activity';

  const cases = CaseRepository.list({
    status: status === 'all' ? undefined : status,
    category,
    district,
    priority,
    search,
    sort,
    currentUserId: req.user?.id
  });

  res.json({
    success: true,
    data: cases
  });
});

// 2. Chi tiết case
router.get('/:id', optionalAuthenticateToken, (req: AuthRequest, res: Response): void => {
  const c = CaseRepository.findById(req.params.id, req.user?.id);
  if (!c) {
    res.status(404).json({
      success: false,
      error: { code: 'CASE_NOT_FOUND', message: 'Không tìm thấy vụ việc.' }
    });
    return;
  }

  res.json({
    success: true,
    data: c
  });
});

// 3. Nút "Tôi cũng ghi nhận" (Community confirmation - 1 vote per user)
router.post('/:id/confirm', authenticateToken, (req: AuthRequest, res: Response): void => {
  const c = CaseRepository.findById(req.params.id);
  if (!c) {
    res.status(404).json({
      success: false,
      error: { code: 'CASE_NOT_FOUND', message: 'Không tìm thấy vụ việc.' }
    });
    return;
  }

  const existing = sqliteClient.get('SELECT id FROM confirmations WHERE case_id = ? AND user_id = ?', [c.id, req.user!.id]);
  if (existing) {
    res.status(400).json({
      success: false,
      error: { code: 'ALREADY_CONFIRMED', message: 'Bạn đã ghi nhận tình trạng này trước đó.' }
    });
    return;
  }

  const result = ConfirmationRepository.toggle(c.id, req.user!.id);
  res.json({
    success: true,
    data: {
      confirmed: true,
      newCount: result.newCount,
      message: 'Bạn đã ghi nhận tình trạng này.'
    }
  });
});

// 3b. Hủy "Tôi cũng ghi nhận"
router.delete('/:id/confirm', authenticateToken, (req: AuthRequest, res: Response): void => {
  const c = CaseRepository.findById(req.params.id);
  if (!c) {
    res.status(404).json({
      success: false,
      error: { code: 'CASE_NOT_FOUND', message: 'Không tìm thấy vụ việc.' }
    });
    return;
  }

  sqliteClient.run('DELETE FROM confirmations WHERE case_id = ? AND user_id = ?', [c.id, req.user!.id]);
  const newCount = ConfirmationRepository.countByCaseId(c.id);
  res.json({
    success: true,
    data: {
      confirmed: false,
      newCount,
      message: 'Đã hủy ghi nhận.'
    }
  });
});

// 4. Lưu case
router.post('/:id/save', authenticateToken, (req: AuthRequest, res: Response): void => {
  const c = CaseRepository.findById(req.params.id);
  if (!c) {
    res.status(404).json({
      success: false,
      error: { code: 'CASE_NOT_FOUND', message: 'Không tìm thấy vụ việc.' }
    });
    return;
  }

  sqliteClient.run(`
    INSERT OR IGNORE INTO saved_cases (id, case_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `, [`save_${c.id}_${req.user!.id}`, c.id, req.user!.id, new Date().toISOString()]);

  res.json({
    success: true,
    data: {
      saved: true,
      message: 'Đã lưu vào danh sách theo dõi.'
    }
  });
});

// 4b. Bỏ lưu case
router.delete('/:id/save', authenticateToken, (req: AuthRequest, res: Response): void => {
  const c = CaseRepository.findById(req.params.id);
  if (!c) {
    res.status(404).json({
      success: false,
      error: { code: 'CASE_NOT_FOUND', message: 'Không tìm thấy vụ việc.' }
    });
    return;
  }

  sqliteClient.run('DELETE FROM saved_cases WHERE case_id = ? AND user_id = ?', [c.id, req.user!.id]);
  res.json({
    success: true,
    data: {
      saved: false,
      message: 'Đã xóa khỏi danh sách theo dõi.'
    }
  });
});

// 5. Lấy danh sách quan sát của case
router.get('/:id/observations', (req: AuthRequest, res: Response): void => {
  const observations = ObservationRepository.listByCaseId(req.params.id);
  res.json({
    success: true,
    data: observations
  });
});

// 6. Gửi quan sát mới
router.post('/:id/observations', authenticateToken, (req: AuthRequest, res: Response): void => {
  const c = CaseRepository.findById(req.params.id);
  if (!c) {
    res.status(404).json({
      success: false,
      error: { code: 'CASE_NOT_FOUND', message: 'Không tìm thấy vụ việc.' }
    });
    return;
  }

  const validated = createObservationSchema.safeParse(req.body);
  if (!validated.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: validated.error.errors[0]?.message || 'Dữ liệu quan sát không hợp lệ.'
      }
    });
    return;
  }

  const obsId = `obs_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
  ObservationRepository.create({
    id: obsId,
    caseId: c.id,
    userId: req.user!.id,
    observationType: validated.data.observationType,
    comment: validated.data.comment,
    observedAt: validated.data.observedAt,
    latitude: validated.data.latitude,
    longitude: validated.data.longitude
  });

  if (validated.data.mediaFiles && validated.data.mediaFiles.length > 0) {
    for (const m of validated.data.mediaFiles) {
      ObservationRepository.addMedia({
        id: `obs_med_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`,
        observationId: obsId,
        filePath: m.filePath,
        mimeType: m.mimeType,
        fileSize: m.fileSize,
        sha256Hash: m.sha256Hash
      });
    }
  }

  res.status(201).json({
    success: true,
    data: { id: obsId, observationId: obsId, message: 'Đã gửi quan sát thành công.' }
  });
});

// 7. Gửi đánh giá kết quả giải quyết (Citizen Resolution Feedback Loop)
router.post('/:id/feedback', authenticateToken, (req: AuthRequest, res: Response): void => {
  const c = CaseRepository.findById(req.params.id);
  if (!c) {
    res.status(404).json({
      success: false,
      error: { code: 'CASE_NOT_FOUND', message: 'Không tìm thấy vụ việc.' }
    });
    return;
  }

  // Khởi tạo bảng feedback nếu chưa tồn tại
  sqliteClient.run(`
    CREATE TABLE IF NOT EXISTS case_feedback (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL,
      comment TEXT,
      is_satisfied INTEGER NOT NULL,
      request_reinspection INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    );
  `);

  const { rating = 5, comment = '', isSatisfied = true, requestReinspection = false } = req.body;
  const feedbackId = `fb_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;

  sqliteClient.run(`
    INSERT INTO case_feedback (id, case_id, user_id, rating, comment, is_satisfied, request_reinspection, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `, [
    feedbackId,
    c.id,
    req.user!.id,
    Number(rating),
    comment,
    isSatisfied ? 1 : 0,
    requestReinspection ? 1 : 0
  ]);

  // Ghi nhận cập nhật dòng thời gian vụ việc
  const updateId = `upd_${Date.now()}_${crypto.randomUUID().substring(0, 8)}`;
  sqliteClient.run(`
    INSERT INTO case_updates (id, case_id, update_type, title, content, created_by, is_public, created_at)
    VALUES (?, ?, 'community_update', ?, ?, ?, 1, datetime('now'))
  `, [
    updateId,
    c.id,
    'Người dân gửi phản hồi đánh giá kết quả khắc phục',
    `Đánh giá: ${rating}/5 sao (${isSatisfied ? 'Hài lòng' : 'Chưa hài lòng'})${comment ? ` - "${comment}"` : ''}${requestReinspection ? ' (Yêu cầu phúc tra hiện trường)' : ''}`,
    req.user!.id
  ]);

  // Đồng bộ sang Operations nếu vụ việc đã chuyển tiếp
  const operationsUrl = process.env.OPERATIONS_API_URL || 'http://localhost:4000';
  fetch(`${operationsUrl}/api/integrations/community/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-service-key': 'dustguard-internal-2026',
    },
    body: JSON.stringify({
      external_case_id: c.id,
      case_code: c.case_code,
      rating: Number(rating),
      comment,
      is_satisfied: Boolean(isSatisfied),
      request_reinspection: Boolean(requestReinspection),
      user_name: req.user?.fullName || 'Người dân cộng đồng',
    }),
  }).catch(() => {});

  res.status(201).json({
    success: true,
    data: {
      id: feedbackId,
      message: 'Cảm ơn bạn đã gửi đánh giá kết quả xử lý môi trường.'
    }
  });
});

// 8. Lấy danh sách đánh giá của vụ việc
router.get('/:id/feedback', optionalAuthenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    sqliteClient.run(`
      CREATE TABLE IF NOT EXISTS case_feedback (
        id TEXT PRIMARY KEY,
        case_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT,
        is_satisfied INTEGER NOT NULL,
        request_reinspection INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `);

    const feedbacks = sqliteClient.all(`
      SELECT f.*, u.full_name as user_name
      FROM case_feedback f
      LEFT JOIN users u ON u.id = f.user_id
      WHERE f.case_id = ?
      ORDER BY f.created_at DESC
    `, [req.params.id]);

    res.json({
      success: true,
      data: feedbacks
    });
  } catch (err: any) {
    res.json({ success: true, data: [] });
  }
});

export default router;
