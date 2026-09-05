import { WorkflowRecommendation, NormalizedFact, MissingFactItem, Contradiction } from '../types.js';

export interface WorkflowPlannerInput {
  caseStatus: string;
  assignedStaffId?: string;
  facts: NormalizedFact[];
  missingFacts: MissingFactItem[];
  contradictions: Contradiction[];
  hasCompletedInspection: boolean;
  hasVerifiedEvidence: boolean;
  hasTamperedEvidence: boolean;
  hasHumanDecision: boolean;
}

export class WorkflowRecommender {
  /**
   * Deterministic Planner xác định các bước hành động ưu tiên tiếp theo (Next Best Action)
   */
  public static planNextActions(input: WorkflowPlannerInput): WorkflowRecommendation[] {
    const recommendations: WorkflowRecommendation[] = [];

    const failedObservations = input.facts.filter(
      f => f.semanticType === 'OBSERVATION' && (f.value || '').includes('FAIL')
    );

    // Ưu tiên 1: Tệp chứng cứ bị sửa đổi / mất
    if (input.hasTamperedEvidence) {
      recommendations.push({
        priority: 1,
        actionType: 'REQUEST_EVIDENCE',
        title: 'Xác minh tệp bằng chứng số',
        description: 'Phát hiện tệp đính kèm không khớp mã băm SHA-256 gốc hoặc bị xóa khỏi kho lưu trữ. Yêu cầu tải lại ảnh hiện trường gốc.',
        buttonLabel: 'Yêu cầu bằng chứng',
        actionKind: 'EVIDENCE',
        reason: 'Toàn vẹn chứng cứ số là điều kiện tiên quyết trước khi tiến hành thẩm tra pháp lý.',
        requiresHumanApproval: false,
      });
    }

    // Ưu tiên 2: Chưa phân công cán bộ thụ lý
    if (!input.assignedStaffId) {
      recommendations.push({
        priority: recommendations.length + 1,
        actionType: 'ASSIGN_OFFICER',
        title: 'Phân công cán bộ thụ lý hiện trường',
        description: 'Chỉ định cán bộ môi trường phụ trách địa bàn tiến hành khảo sát và lập biên bản kiểm tra.',
        buttonLabel: 'Phân công',
        actionKind: 'TASK',
        reason: 'Hồ sơ cần cán bộ chuyên trách chịu trách nhiệm xác minh thực địa.',
        requiresHumanApproval: true,
      });
    }

    // Ưu tiên 3: Chưa có biên bản kiểm tra thực địa
    if (!input.hasCompletedInspection) {
      recommendations.push({
        priority: recommendations.length + 1,
        actionType: 'SCHEDULE_INSPECTION',
        title: 'Lập kế hoạch thanh tra thực địa',
        description: 'Tổ chức đoàn kiểm tra hiện trường theo biểu mẫu quy chuẩn QCVN 18:2021/BXD và Điều 15 NĐ 45/2022/NĐ-CP.',
        buttonLabel: 'Tạo lịch kiểm tra',
        actionKind: 'INSPECTION',
        reason: 'Dữ liệu phản ánh hoặc viễn thám chỉ là căn cứ ban đầu, bắt buộc phải có biên bản kiểm tra hiện trường.',
        requiresHumanApproval: true,
      });
    }

    // Ưu tiên 4: Đã có biên bản kiểm tra không đạt -> Ban hành thông báo khắc phục
    if (failedObservations.length > 0 && input.caseStatus !== 'ACTION_REQUIRED') {
      recommendations.push({
        priority: recommendations.length + 1,
        actionType: 'ISSUE_CORRECTIVE_ACTION',
        title: 'Ban hành yêu cầu khắc phục (SLA 48h)',
        description: `Ghi nhận ${failedObservations.length} hạng mục không tuân thủ. Yêu cầu nhà thầu thực hiện biện pháp giảm thiểu bụi trong vòng 48 giờ.`,
        buttonLabel: 'Ban hành yêu cầu',
        actionKind: 'ACTION',
        reason: 'Cần thiết lập nghĩa vụ pháp lý và thời hạn khắc phục đối với đơn vị thi công.',
        requiresHumanApproval: true,
      });
    }

    // Ưu tiên 5: Đã đủ bằng chứng -> Chuyển sang ký duyệt chuyên viên
    if (input.hasCompletedInspection && input.hasVerifiedEvidence && !input.hasTamperedEvidence && !input.hasHumanDecision) {
      recommendations.push({
        priority: recommendations.length + 1,
        actionType: 'READY_FOR_HUMAN_DECISION',
        title: 'Trình lãnh đạo / Chuyên viên thẩm tra ký nhận định',
        description: 'Bộ hồ sơ đã hội tụ đủ căn cứ dữ kiện và chứng cứ số học nguyên vẹn, sẵn sàng để chuyên viên pháp chế ký kết luận.',
        buttonLabel: 'Ký nhận định',
        actionKind: 'LEGAL',
        reason: 'Hệ thống đã hoàn tất đối soát quy chuẩn, kết luận cuối cùng thuộc về thẩm quyền con người.',
        requiresHumanApproval: true,
      });
    }

    // Đảm bảo luôn có ít nhất 1 recommendation
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 1,
        actionType: 'REQUEST_EVIDENCE',
        title: 'Tiếp tục theo dõi và thu thập chứng cứ',
        description: 'Duy trì kết nối cảm biến và giám sát phản ánh cộng đồng.',
        buttonLabel: 'Kiểm tra',
        actionKind: 'EVIDENCE',
        reason: 'Hồ sơ đang trong quy trình theo dõi ổn định.',
        requiresHumanApproval: false,
      });
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }
}
