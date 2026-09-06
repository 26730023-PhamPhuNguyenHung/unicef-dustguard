/**
 * creditCalculator.ts — Bộ tính toán Thời gian & Dấu ấn Đóng góp Cộng đồng (DustGuard Contribution Engine)
 * Tinh thần: Ghi nhận thực tế, minh bạch, không chấm điểm, không quy đổi tín chỉ học thuật.
 */

export interface VolunteerContribution {
  id: string;
  code?: string;
  title?: string;
  type?: 'report' | 'observation' | 'task' | 'verification' | 'confirmation' | 'before_after';
  typeLabel?: string;
  hasEvidence?: boolean;
  hasSiteLinked?: boolean;
  isWithin50m?: boolean;
  isBeforeAfter?: boolean;
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED' | 'REJECTED' | 'submitted' | 'accepted' | 'rejected' | 'completed' | 'confirmed';
  statusText?: string;
  outcome?: string;
  district?: string;
  role?: string;
  hours?: number;
  createdAt?: string;
  caseId?: string;
  caseStatus?: string;
}

export interface ContributionActivityLog {
  id: string;
  code: string;
  title: string;
  type: string;
  typeLabel: string;
  hours: number;
  isVerified: boolean;
  statusText: string;
  outcome: string;
  district: string;
  role: string;
  createdAt: string;
  caseId?: string;
  caseStatus?: string;
}

export interface ContributionSummary {
  totalActivities: number;
  totalHours: number;
  verifiedHours: number;
  pendingHours: number;
  verifiedCount: number;
  pendingCount: number;
  locationsCount: number;
  locations: string[];
  resolvedCasesCount: number;
  logs: ContributionActivityLog[];

  // Thuộc tính giữ tương thích ngược nếu cần
  academicCredits?: number;
  progressPercentage?: number;
  hoursToNextMilestone?: number;
}

// Alias tương thích ngược
export type YouthCreditSummary = ContributionSummary;
export type VolunteerLog = ContributionActivityLog;

/**
 * Tính toán thời gian đóng góp thực tế cho một hoạt động
 */
export function calculateItemHours(item: VolunteerContribution): number {
  let baseHours = 1.0;
  if (item.type === 'report') baseHours = 1.5;
  if (item.type === 'task' || item.type === 'verification') baseHours = 2.0;
  if (item.type === 'confirmation') baseHours = 0.5;

  let bonusHours = 0;
  if (item.hasEvidence) bonusHours += 0.5; // Chụp ảnh minh chứng thực tế
  if (item.hasSiteLinked) bonusHours += 0.5; // Xác định công trình liên quan
  if (item.isWithin50m) bonusHours += 0.5; // Trực tiếp tại hiện trường 50m
  if (item.isBeforeAfter) bonusHours += 1.0; // Đối chứng trước & sau khắc phục

  let weight = 1.0;
  const s = String(item.status).toUpperCase();
  if (s === 'RESOLVED' || s === 'VERIFIED' || s === 'ACCEPTED' || s === 'COMPLETED' || s === 'CONFIRMED') {
    weight = 1.0;
  } else if (s === 'PENDING' || s === 'SUBMITTED' || s === 'REVIEWING') {
    weight = 0.8; // Đang xử lý vẫn được ghi nhận thời gian thực địa
  } else if (s === 'REJECTED') {
    weight = 0;
  }

  return Number(((baseHours + bonusHours) * weight).toFixed(1));
}

/**
 * Tổng hợp toàn bộ hồ sơ đóng góp cộng đồng của người dùng
 */
export function evaluateContributionSummary(contributions: VolunteerContribution[]): ContributionSummary {
  let totalHours = 0;
  let verifiedHours = 0;
  let pendingHours = 0;
  let verifiedCount = 0;
  let pendingCount = 0;

  const locationSet = new Set<string>();
  const resolvedCaseIds = new Set<string>();

  const logs: ContributionActivityLog[] = contributions.map((item) => {
    const hours = item.hours !== undefined ? item.hours : calculateItemHours(item);
    totalHours += hours;

    const s = String(item.status).toUpperCase();
    const isVerified = (
      s === 'RESOLVED' ||
      s === 'VERIFIED' ||
      s === 'ACCEPTED' ||
      s === 'COMPLETED' ||
      s === 'CONFIRMED'
    );

    if (isVerified) {
      verifiedHours += hours;
      verifiedCount += 1;
    } else {
      pendingHours += hours;
      pendingCount += 1;
    }

    const district = item.district || 'TP. Hồ Chí Minh';
    if (district) locationSet.add(district);

    if (item.caseId && (item.caseStatus === 'resolved' || item.caseStatus === 'closed' || s === 'RESOLVED')) {
      resolvedCaseIds.add(item.caseId);
    }

    let typeLabel = item.typeLabel;
    if (!typeLabel) {
      if (item.type === 'report') typeLabel = 'Phản ánh vi phạm';
      else if (item.type === 'observation') typeLabel = 'Quan sát hiện trường';
      else if (item.type === 'task' || item.type === 'verification') typeLabel = 'Xác minh nhiệm vụ';
      else if (item.type === 'confirmation') typeLabel = 'Cùng ghi nhận';
      else typeLabel = 'Đóng góp cộng đồng';
    }

    let outcome = item.outcome;
    if (!outcome) {
      if (item.caseStatus === 'resolved' || s === 'RESOLVED') {
        outcome = 'Vấn đề đã được khắc phục & xử lý dứt điểm.';
      } else if (isVerified) {
        outcome = 'Thông tin đã được xác thực và đưa vào hồ sơ theo dõi.';
      } else {
        outcome = 'Hoạt động này đang được theo dõi. DustGuard sẽ cập nhật khi có kết quả.';
      }
    }

    return {
      id: item.id,
      code: item.code || `DG-${item.id.slice(0, 6).toUpperCase()}`,
      title: item.title || 'Đóng góp giám sát môi trường cộng đồng',
      type: item.type || 'report',
      typeLabel,
      hours,
      isVerified,
      statusText: item.statusText || (isVerified ? 'Đã xác minh' : s === 'REJECTED' ? 'Từ chối' : 'Đang xử lý'),
      outcome,
      district,
      role: item.role || (item.type === 'report' ? 'Người phản ánh' : 'Tình nguyện viên'),
      createdAt: item.createdAt || new Date().toISOString(),
      caseId: item.caseId,
      caseStatus: item.caseStatus
    };
  });

  const locations = Array.from(locationSet);
  const verifiedRounded = Number(verifiedHours.toFixed(1));
  const totalRounded = Number(totalHours.toFixed(1));
  const pendingRounded = Number(pendingHours.toFixed(1));

  return {
    totalActivities: contributions.length,
    totalHours: totalRounded,
    verifiedHours: verifiedRounded,
    pendingHours: pendingRounded,
    verifiedCount,
    pendingCount,
    locationsCount: locations.length,
    locations,
    resolvedCasesCount: resolvedCaseIds.size,
    logs,
    academicCredits: 0,
    progressPercentage: 0,
    hoursToNextMilestone: 0
  };
}

/**
 * Hàm backward compatible với YouthCreditsPage cũ
 */
export function evaluateYouthCredits(contributions: VolunteerContribution[]): ContributionSummary {
  return evaluateContributionSummary(contributions);
}
