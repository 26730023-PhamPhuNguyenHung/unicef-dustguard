export type CaseStatus =
  | 'NEW'
  | 'TRIAGED'
  | 'ASSIGNED'
  | 'LEGAL_REVIEW'
  | 'INSPECTION_PLANNED'
  | 'INSPECTION_IN_PROGRESS'
  | 'ACTION_REQUIRED'
  | 'REMEDIATION'
  | 'REINSPECTION'
  | 'READY_TO_CLOSE'
  | 'CLOSED'
  | 'REOPENED';

export interface TransitionContext {
  role?: string;
  hasAssignee?: boolean;
  inspectionsCompleted?: boolean;
  openActionsCount?: number;
  hasLegalReview?: boolean;
  closureSummary?: string;
  overrideReason?: string;
}

export interface TransitionResult {
  allowed: boolean;
  reason?: string;
}

export const VALID_TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  NEW: ['TRIAGED'],
  TRIAGED: ['ASSIGNED'],
  ASSIGNED: ['LEGAL_REVIEW', 'INSPECTION_PLANNED'],
  LEGAL_REVIEW: ['INSPECTION_PLANNED', 'ACTION_REQUIRED', 'READY_TO_CLOSE'],
  INSPECTION_PLANNED: ['INSPECTION_IN_PROGRESS', 'LEGAL_REVIEW'],
  INSPECTION_IN_PROGRESS: ['ACTION_REQUIRED', 'READY_TO_CLOSE', 'LEGAL_REVIEW'],
  ACTION_REQUIRED: ['REMEDIATION', 'INSPECTION_PLANNED'],
  REMEDIATION: ['REINSPECTION', 'READY_TO_CLOSE', 'ACTION_REQUIRED'],
  REINSPECTION: ['ACTION_REQUIRED', 'READY_TO_CLOSE'],
  READY_TO_CLOSE: ['CLOSED', 'ACTION_REQUIRED'],
  CLOSED: ['REOPENED'],
  REOPENED: ['TRIAGED', 'ASSIGNED', 'INSPECTION_PLANNED', 'LEGAL_REVIEW'],
};

export function canTransitionCase(
  from: CaseStatus,
  to: CaseStatus,
  context: TransitionContext = {}
): TransitionResult {
  const allowedNext = VALID_TRANSITIONS[from];
  if (!allowedNext || !allowedNext.includes(to)) {
    return {
      allowed: false,
      reason: `Không thể chuyển trạng thái từ "${from}" sang "${to}".`,
    };
  }

  // Specific operational business rules
  if (to === 'ASSIGNED' && !context.hasAssignee) {
    return {
      allowed: false,
      reason: 'Cần chỉ định cán bộ tiếp nhận trước khi chuyển sang trạng thái ĐÃ PHÂN CÔNG.',
    };
  }

  if (to === 'CLOSED') {
    if (context.role !== 'supervisor' && context.role !== 'admin') {
      return {
        allowed: false,
        reason: 'Chỉ Lãnh đạo điều phối (Supervisor) hoặc Quản trị viên mới có quyền đóng hồ sơ.',
      };
    }
    if ((context.openActionsCount ?? 0) > 0) {
      return {
        allowed: false,
        reason: `Còn ${context.openActionsCount} yêu cầu khắc phục chưa hoàn tất. Không thể đóng vụ việc.`,
      };
    }
    if (context.inspectionsCompleted === false) {
      return {
        allowed: false,
        reason: 'Chưa hoàn tất các đợt kiểm tra hiện trường bắt buộc.',
      };
    }
    if (context.hasLegalReview === false) {
      return {
        allowed: false,
        reason: 'Hồ sơ chưa có kết luận thẩm tra pháp lý.',
      };
    }
    if (!context.closureSummary || context.closureSummary.trim().length < 5) {
      return {
        allowed: false,
        reason: 'Bắt buộc cung cấp tóm tắt lý do kết thúc vụ việc.',
      };
    }
  }

  if (to === 'REOPENED') {
    if (context.role !== 'supervisor' && context.role !== 'admin') {
      return {
        allowed: false,
        reason: 'Chỉ Lãnh đạo điều phối mới có quyền mở lại hồ sơ đã đóng.',
      };
    }
  }

  return { allowed: true };
}

export const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  NEW: 'Mới tiếp nhận',
  TRIAGED: 'Đã phân loại',
  ASSIGNED: 'Đã phân công',
  LEGAL_REVIEW: 'Chờ pháp lý',
  INSPECTION_PLANNED: 'Lập lịch kiểm tra',
  INSPECTION_IN_PROGRESS: 'Đang kiểm tra',
  ACTION_REQUIRED: 'Chờ khắc phục',
  REMEDIATION: 'Đã nộp khắc phục',
  REINSPECTION: 'Chờ tái kiểm',
  READY_TO_CLOSE: 'Sẵn sàng đóng',
  CLOSED: 'Đã đóng',
  REOPENED: 'Đã mở lại',
};

export const CASE_STATUS_COLORS: Record<CaseStatus, { bg: string; text: string; border: string }> = {
  NEW: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  TRIAGED: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  ASSIGNED: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  LEGAL_REVIEW: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  INSPECTION_PLANNED: { bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' },
  INSPECTION_IN_PROGRESS: { bg: '#fff7ed', text: '#c2410c', border: '#ffedd5' },
  ACTION_REQUIRED: { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  REMEDIATION: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  REINSPECTION: { bg: '#fffbeb', text: '#b45309', border: '#fef3c7' },
  READY_TO_CLOSE: { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
  CLOSED: { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' },
  REOPENED: { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' },
};
