import { query, get } from '../../../db/connection.js';

export interface ClosureSafetyGateResult {
  canClose: boolean;
  reasons: string[];
}

export class ClosureSafetyGate {
  /**
   * Kiểm định an toàn tuyệt đối trước khi đóng hồ sơ vụ việc
   */
  public static verifyCaseClosureSafety(caseId: string): ClosureSafetyGateResult {
    const reasons: string[] = [];

    const targetCase = get<any>(`SELECT * FROM cases WHERE id = ?`, [caseId]);
    if (!targetCase) {
      return { canClose: false, reasons: ['Hồ sơ không tồn tại.'] };
    }

    // 1. Kiểm tra bằng chứng bị can thiệp / mất tệp
    const tampered = query<any>(
      `SELECT id, file_name, integrity_status FROM evidence_assets
       WHERE case_id = ? AND (integrity_status = 'TAMPERED' OR integrity_status = 'FILE_MISSING')`,
      [caseId]
    );
    if (tampered.length > 0) {
      reasons.push(`Còn ${tampered.length} tệp chứng cứ bị sai lệch mã băm SHA-256 hoặc mất file.`);
    }

    // 2. Kiểm tra lệnh khắc phục còn mở chưa nghiệm thu
    const openActions = query<any>(
      `SELECT id, title, status FROM corrective_actions
       WHERE case_id = ? AND status IN ('OPEN', 'IN_PROGRESS', 'SUBMITTED', 'REJECTED')`,
      [caseId]
    );
    if (openActions.length > 0) {
      reasons.push(`Còn ${openActions.length} biện pháp khắc phục chưa được xác minh hoàn tất.`);
    }

    // 3. Kiểm tra quyết định / xác nhận của cán bộ chuyên trách
    const humanDecisions = query<any>(
      `SELECT id, decision_type FROM human_decisions WHERE case_id = ?`,
      [caseId]
    );
    if (humanDecisions.length === 0) {
      reasons.push('Chưa có xác nhận hoặc kết luận của cán bộ chuyên trách trong mục Hỗ trợ thẩm tra.');
    }

    return {
      canClose: reasons.length === 0,
      reasons,
    };
  }
}
