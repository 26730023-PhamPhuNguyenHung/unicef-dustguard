/**
 * creditCalculator.ts — Bộ máy tính Giờ Tình nguyện & Tín chỉ Rèn luyện Thanh niên
 * Chuẩn đánh giá rèn luyện sinh viên: 20 giờ tình nguyện = 4.0 tín chỉ rèn luyện
 */

export interface VolunteerContribution {
  id: string;
  code?: string;
  title?: string;
  type?: 'report' | 'observation' | 'task' | 'before_after';
  hasEvidence?: boolean;
  hasSiteLinked?: boolean;
  isWithin50m?: boolean;
  isBeforeAfter?: boolean;
  status: 'PENDING' | 'VERIFIED' | 'RESOLVED' | 'REJECTED';
  createdAt?: string;
}

export interface VolunteerLog {
  id: string;
  code: string;
  title: string;
  type: string;
  hours: number;
  isVerified: boolean;
  statusText: string;
  createdAt: string;
}

export interface YouthCreditSummary {
  totalHours: number;
  verifiedHours: number;
  pendingHours: number;
  academicCredits: number; // Max 4.0
  progressPercentage: number; // 0 - 100% of 20h
  hoursToNextMilestone: number;
  logs: VolunteerLog[];
}

/**
 * Tính toán giờ tình nguyện cho một hoạt động cụ thể
 */
export function calculateItemHours(item: VolunteerContribution): number {
  let baseHours = 1.5; // Định mức cơ bản: 1.5 giờ / phản ánh hoặc nhiệm vụ
  let bonusHours = 0;

  if (item.hasEvidence) bonusHours += 0.5; // +0.5h chụp ảnh minh chứng thực tế
  if (item.hasSiteLinked) bonusHours += 0.5; // +0.5h xác định chính xác công trình
  if (item.isWithin50m) bonusHours += 0.5; // +0.5h có mặt trực tiếp trong bán kính 50m
  if (item.isBeforeAfter) bonusHours += 1.0; // +1.0h đối chứng trước và sau khắc phục

  let weight = 0;
  if (item.status === 'RESOLVED' || item.status === 'VERIFIED') {
    weight = 1.0;
  } else if (item.status === 'PENDING') {
    weight = 0.5; // Đang chờ xác minh được tạm tính 50%
  } else {
    weight = 0;
  }

  return Number(((baseHours + bonusHours) * weight).toFixed(1));
}

/**
 * Tổng hợp toàn bộ hoạt động của thanh niên & quy đổi ra Tín chỉ rèn luyện
 */
export function evaluateYouthCredits(contributions: VolunteerContribution[]): YouthCreditSummary {
  let totalHours = 0;
  let verifiedHours = 0;
  let pendingHours = 0;

  const logs: VolunteerLog[] = contributions.map((item) => {
    const hours = calculateItemHours(item);
    totalHours += hours;

    const isVerified = item.status === 'RESOLVED' || item.status === 'VERIFIED';
    if (isVerified) {
      verifiedHours += hours;
    } else if (item.status === 'PENDING') {
      pendingHours += hours;
    }

    return {
      id: item.id,
      code: item.code || `DG-${item.id.slice(0, 6).toUpperCase()}`,
      title: item.title || 'Đóng góp giám sát môi trường cộng đồng',
      type: item.type || 'report',
      hours,
      isVerified,
      statusText: isVerified ? 'Đã xác nhận' : item.status === 'PENDING' ? 'Đang thẩm tra' : 'Từ chối',
      createdAt: item.createdAt || new Date().toISOString(),
    };
  });

  const verifiedRounded = Number(verifiedHours.toFixed(1));
  // Công thức: 20 giờ = 4.0 tín chỉ (tương ứng 0.2 tín chỉ / giờ, tối đa 4.0)
  const academicCredits = Math.min(4.0, Number(((verifiedRounded / 20) * 4.0).toFixed(1)));
  const progressPercentage = Math.min(100, Math.round((verifiedRounded / 20) * 100));
  const hoursToNextMilestone = Math.max(0, Number((20 - verifiedRounded).toFixed(1)));

  return {
    totalHours: Number(totalHours.toFixed(1)),
    verifiedHours: verifiedRounded,
    pendingHours: Number(pendingHours.toFixed(1)),
    academicCredits,
    progressPercentage,
    hoursToNextMilestone,
    logs,
  };
}
