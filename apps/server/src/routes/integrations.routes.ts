import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { sqliteClient } from '../db/sqlite-client.js';

export const integrationsRouter = Router();

/**
 * Xác thực dịch vụ nội bộ cho các endpoint liên thông hai phía (Cross-Side Integration).
 * Đọc khóa bí mật từ biến môi trường INTEGRATION_SERVICE_KEY (có giá trị mặc định an toàn
 * cho môi trường phát triển cục bộ, không hardcode cho môi trường thực tế).
 * Từ chối với 401 nếu thiếu header hoặc sai khóa.
 */
const INTEGRATION_SERVICE_KEY = process.env.INTEGRATION_SERVICE_KEY || 'dustguard-internal-2026';

function requireServiceKey(req: Request, res: Response, next: NextFunction): void {
  const provided = req.headers['x-service-key'];
  if (!provided || provided !== INTEGRATION_SERVICE_KEY) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED_SERVICE',
        message: 'Thiếu hoặc sai khóa xác thực dịch vụ nội bộ (x-service-key) cho endpoint liên thông hai phía.',
      },
    });
    return;
  }
  next();
}

integrationsRouter.use(requireServiceKey);

/**
 * POST /api/integrations/operations/sync
 * Endpoint nhận sự kiện đồng bộ hai chiều từ DustGuard Operations (Side B)
 * Khi Cán bộ chính quyền chuyển trạng thái vụ việc, ban hành yêu cầu hoặc đóng hồ sơ.
 */
integrationsRouter.post('/operations/sync', (req: Request, res: Response): void => {
  try {
    const {
      external_case_id,
      operations_case_id,
      operations_case_code,
      status: operationsStatus,
      status_label,
      stage,
      actor_name,
      description,
      remediation_status,
      findings_summary,
      contractor_name,
      closure_note,
    } = req.body;

    if (!external_case_id && !operations_case_code) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_PARAMS', message: 'Thiếu external_case_id hoặc operations_case_code.' },
      });
      return;
    }

    // Tìm vụ việc trên Side A theo id hoặc caseCode
    let targetCase = external_case_id
      ? sqliteClient.get<any>('SELECT * FROM cases WHERE id = ?', [external_case_id])
      : null;

    if (!targetCase && operations_case_code) {
      targetCase = sqliteClient.get<any>(
        'SELECT * FROM cases WHERE case_code = ? OR id IN (SELECT case_id FROM case_updates WHERE content LIKE ?)',
        [operations_case_code, `%${operations_case_code}%`]
      );
    }

    if (!targetCase) {
      res.status(404).json({
        success: false,
        error: { code: 'CASE_NOT_FOUND', message: 'Không tìm thấy vụ việc trên Community để đồng bộ.' },
      });
      return;
    }

    // Quy chiếu 12 trạng thái nội bộ Side B sang 6 trạng thái thân thiện của Side A (Mục 21)
    let mappedSideAStatus = targetCase.status;
    let updateTitle = status_label || 'Cập nhật tiến trình từ Cơ quan Quản lý';

    switch (operationsStatus) {
      case 'NEW':
      case 'TRIAGED':
        mappedSideAStatus = 'forwarded';
        updateTitle = 'Cơ quan chức năng đã tiếp nhận hồ sơ';
        break;
      case 'ASSIGNED':
        mappedSideAStatus = 'in_progress';
        updateTitle = `Đã phân công cán bộ thụ lý (${actor_name || 'Cán bộ hiện trường'})`;
        break;
      case 'INSPECTION_PLANNED':
      case 'INSPECTION_IN_PROGRESS':
        mappedSideAStatus = 'in_progress';
        updateTitle = 'Cán bộ đang tiến hành kiểm tra hiện trường';
        break;
      case 'LEGAL_REVIEW':
        mappedSideAStatus = 'in_progress';
        updateTitle = 'Hồ sơ đang được rà soát đối chiếu quy định pháp luật';
        break;
      case 'ACTION_REQUIRED':
        mappedSideAStatus = 'in_progress';
        updateTitle = `Đã ban hành yêu cầu khắc phục cho đơn vị thi công (${contractor_name || 'Nhà thầu'})`;
        break;
      case 'REMEDIATION':
        mappedSideAStatus = 'in_progress';
        updateTitle = 'Đơn vị thi công đã nộp báo cáo khắc phục, đang chờ nghiệm thu';
        break;
      case 'REINSPECTION':
        mappedSideAStatus = 'in_progress';
        updateTitle = 'Cán bộ đang tái kiểm tra hiện trường sau khắc phục';
        break;
      case 'READY_TO_CLOSE':
      case 'CLOSED':
        mappedSideAStatus = 'resolved';
        updateTitle = 'Vụ việc đã được xử lý và nghiệm thu đạt quy chuẩn';
        break;
      case 'REOPENED':
        mappedSideAStatus = 'in_progress';
        updateTitle = 'Hồ sơ vụ việc được mở lại để tái thẩm tra';
        break;
      default:
        break;
    }

    // Bảo vệ chống webhook trễ / ngoài thứ tự (out-of-order): một khi Side A đã ghi nhận
    // "resolved", chỉ chấp nhận cập nhật tiếp theo nếu đó là REOPENED (mở lại hợp lệ) hoặc
    // một xác nhận resolved khác. Bỏ qua các trạng thái vòng đời sớm hơn đến trễ để tránh
    // việc hồ sơ đã đóng bị "hồi sinh" ngược lại in_progress/forwarded do webhook đến muộn.
    if (targetCase.status === 'resolved' && mappedSideAStatus !== 'resolved' && operationsStatus !== 'REOPENED') {
      console.warn(
        `[Cross-Side Sync] Bỏ qua cập nhật ngoài thứ tự (stale) cho vụ việc ${targetCase.case_code}: nhận trạng thái "${operationsStatus}" sau khi đã "resolved".`
      );
      res.json({
        success: true,
        data: {
          case_id: targetCase.id,
          case_code: targetCase.case_code,
          old_status: targetCase.status,
          new_status: targetCase.status,
          update_title: 'Cập nhật ngoài thứ tự bị bỏ qua (hồ sơ đã đóng)',
        },
        message: 'Hồ sơ đã ở trạng thái resolved; cập nhật đến muộn/ngoài thứ tự đã bị bỏ qua để bảo toàn dữ liệu.',
      });
      return;
    }

    const now = new Date().toISOString();

    sqliteClient.transaction(() => {
      // 1. Cập nhật trạng thái vụ việc
      sqliteClient.run(
        `UPDATE cases
         SET status = ?,
             last_activity_at = ?,
             resolved_at = CASE WHEN ? = 'resolved' THEN ? ELSE resolved_at END,
             updated_at = ?
         WHERE id = ?`,
        [mappedSideAStatus, now, mappedSideAStatus, now, now, targetCase.id]
      );

      // 2. Thêm mốc diễn tiến vào Timeline
      const updateId = `cup-${crypto.randomUUID().substring(0, 8)}`;
      const detailContent =
        closure_note ||
        findings_summary ||
        description ||
        `Cập nhật trạng thái vận hành từ mã vụ việc liên kết [${operations_case_code || targetCase.case_code}].`;

      sqliteClient.run(
        `INSERT INTO case_updates (id, case_id, update_type, title, content, old_status, new_status, is_public, created_at)
         VALUES (?, ?, 'status_change', ?, ?, ?, ?, 1, ?)`,
        [updateId, targetCase.id, updateTitle, detailContent, targetCase.status, mappedSideAStatus, now]
      );

      // 3. Tạo thông báo cho người khởi tạo vụ việc
      if (targetCase.created_by) {
        sqliteClient.run(
          `INSERT INTO notifications (id, user_id, type, title, message, entity_type, entity_id, is_read, created_at)
           VALUES (?, ?, 'case_update', ?, ?, 'case', ?, 0, ?)`,
          [
            `notif-${crypto.randomUUID().substring(0, 8)}`,
            targetCase.created_by,
            updateTitle,
            `Vụ việc "${targetCase.title}" đã được cập nhật: ${detailContent}`,
            targetCase.id,
            now,
          ]
        );
      }
    });

    console.log(`[Cross-Side Sync] Thành công: Cập nhật vụ việc ${targetCase.case_code} -> ${mappedSideAStatus}`);

    res.json({
      success: true,
      data: {
        case_id: targetCase.id,
        case_code: targetCase.case_code,
        old_status: targetCase.status,
        new_status: mappedSideAStatus,
        update_title: updateTitle,
      },
      message: 'Đồng bộ hai chiều từ Operations sang Community thành công.',
    });
  } catch (err: any) {
    console.error('[Cross-Side Sync Error]:', err);
    res.status(500).json({
      success: false,
      error: { code: 'SYNC_FAILED', message: err.message || 'Lỗi đồng bộ hai chiều.' },
    });
  }
});

export default integrationsRouter;
