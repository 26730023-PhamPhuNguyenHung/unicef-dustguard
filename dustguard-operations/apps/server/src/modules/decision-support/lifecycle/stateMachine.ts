export type CaseStatus =
  | 'NEW'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'INSPECTION_PLANNED'
  | 'INSPECTION_IN_PROGRESS'
  | 'LEGAL_REVIEW'
  | 'ACTION_REQUIRED'
  | 'REMEDIATION'
  | 'REINSPECTION'
  | 'READY_TO_CLOSE'
  | 'CLOSED'
  | 'REOPENED';

export interface TransitionContext {
  role?: string;
  hasAssignedStaff?: boolean;
  hasInspectionPlanned?: boolean;
  hasInspectionCompleted?: boolean;
  hasActionIssued?: boolean;
  hasRemediationApproved?: boolean;
  hasHumanDecision?: boolean;
  hasTamperedEvidence?: boolean;
}

export class CaseStateMachine {
  // Bảng chuyển đổi trạng thái hợp lệ
  private static readonly VALID_TRANSITIONS: Record<string, string[]> = {
    NEW: ['TRIAGED', 'ASSIGNED', 'CLOSED'],
    TRIAGED: ['ASSIGNED', 'CLOSED'],
    ASSIGNED: ['INSPECTION_PLANNED', 'LEGAL_REVIEW', 'CLOSED'],
    INSPECTION_PLANNED: ['INSPECTION_IN_PROGRESS', 'ASSIGNED', 'CLOSED'],
    INSPECTION_IN_PROGRESS: ['LEGAL_REVIEW', 'ACTION_REQUIRED', 'READY_TO_CLOSE', 'CLOSED'],
    LEGAL_REVIEW: ['ACTION_REQUIRED', 'READY_TO_CLOSE', 'CLOSED', 'ASSIGNED'],
    ACTION_REQUIRED: ['REMEDIATION', 'READY_TO_CLOSE', 'CLOSED'],
    REMEDIATION: ['REINSPECTION', 'READY_TO_CLOSE', 'ACTION_REQUIRED'],
    REINSPECTION: ['READY_TO_CLOSE', 'ACTION_REQUIRED'],
    READY_TO_CLOSE: ['CLOSED', 'REOPENED'],
    CLOSED: ['REOPENED'],
    REOPENED: ['ASSIGNED', 'TRIAGED'],
  };

  /**
   * Kiểm tra điều kiện tiên quyết và tính hợp lệ của việc chuyển đổi trạng thái hồ sơ
   */
  public static canTransition(
    from: string,
    to: string,
    context: TransitionContext = {}
  ): { allowed: boolean; reason?: string } {
    if (from === to) {
      return { allowed: true };
    }

    const allowedNext = this.VALID_TRANSITIONS[from];
    if (!allowedNext || !allowedNext.includes(to)) {
      return {
        allowed: false,
        reason: `Không thể chuyển trạng thái từ "${from}" sang "${to}". Luồng nghiệp vụ không hỗ trợ bước này.`,
      };
    }

    // Guards cụ thể theo từng đích đến
    if (to === 'ASSIGNED' && !context.hasAssignedStaff) {
      return {
        allowed: false,
        reason: 'Không thể chuyển sang trạng thái "Đã phân công" khi chưa chọn cán bộ thụ lý.',
      };
    }

    if (to === 'CLOSED') {
      if (context.hasTamperedEvidence) {
        return {
          allowed: false,
          reason: 'Không thể đóng hồ sơ khi còn tệp chứng cứ bị sửa đổi (TAMPERED) chưa được giải quyết.',
        };
      }
      if (!context.hasHumanDecision) {
        return {
          allowed: false,
          reason: 'Bắt buộc phải có xác nhận / phê duyệt của cán bộ chuyên trách trước khi đóng hồ sơ.',
        };
      }
    }

    return { allowed: true };
  }
}
