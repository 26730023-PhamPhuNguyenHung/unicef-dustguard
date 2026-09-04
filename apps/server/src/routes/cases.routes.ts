import { Router, Response } from 'express';
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

  const obsId = `obs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
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
        id: `obs_med_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
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

export default router;
