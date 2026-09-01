/**
 * @dustguard/domain
 * Pure Domain Rules, State Machines & Environmental Calculations
 */

import { CASE_STATUS } from '../../contracts/src/index.js';

/**
 * 7-Step Case Workflow Sequential Hierarchy (SSOT)
 */
export const CASE_STEPS_SEQUENCE = [
  CASE_STATUS.SCREENING,
  CASE_STATUS.PREPARING,
  CASE_STATUS.DECISION_ISSUED,
  CASE_STATUS.ON_SITE,
  CASE_STATUS.REPORTING,
  CASE_STATUS.APPRAISING,
  CASE_STATUS.COMPLETED
];

/**
 * Valid DAG Transitions Table
 */
export const ALLOWED_TRANSITIONS = {
  [CASE_STATUS.SCREENING]: [CASE_STATUS.PREPARING],
  [CASE_STATUS.PREPARING]: [CASE_STATUS.DECISION_ISSUED],
  [CASE_STATUS.DECISION_ISSUED]: [CASE_STATUS.ON_SITE],
  [CASE_STATUS.ON_SITE]: [CASE_STATUS.REPORTING],
  [CASE_STATUS.REPORTING]: [CASE_STATUS.APPRAISING],
  [CASE_STATUS.APPRAISING]: [CASE_STATUS.COMPLETED],
  [CASE_STATUS.COMPLETED]: [] // Terminal State
};

/**
 * Validates DAG Transition with role and terminal invariants
 */
export function validateCaseTransition(currentStatus, targetStatus, context = {}) {
  const { role = 'staff', isAdmin = false } = context;

  if (currentStatus === CASE_STATUS.COMPLETED && !isAdmin) {
    throw new Error('Hồ sơ đã hoàn tất (COMPLETED). Chỉ Admin mới có quyền mở lại.');
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new Error(`Chuyển bước không hợp lệ: Không thể chuyển từ ${currentStatus} sang ${targetStatus}.`);
  }

  return true;
}

/**
 * Calculates SLA Deadline based on priority
 */
export function calculateSlaDeadline(priority, baseDate = new Date()) {
  const prio = String(priority || 'MEDIUM').toUpperCase();
  let hours = 72; // Default Medium

  if (prio === 'CRITICAL' || prio === 'URGENT') hours = 4;
  else if (prio === 'HIGH') hours = 24;
  else if (prio === 'MEDIUM') hours = 72;
  else if (prio === 'LOW') hours = 168;

  const deadline = new Date(baseDate.getTime() + hours * 3600 * 1000);
  return {
    hours,
    deadlineIso: deadline.toISOString(),
    isOverdue: (now = new Date()) => now > deadline
  };
}

/**
 * Haversine Distance (in meters) between two WGS84 coordinates
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Checks if user/contractor is within geofence radius (default 50m)
 */
export function isWithinGeofence(siteLat, siteLon, targetLat, targetLon, radiusMeters = 50) {
  const distance = calculateHaversineDistance(siteLat, siteLon, targetLat, targetLon);
  return {
    withinGeofence: distance <= radiusMeters,
    distanceMeters: distance,
    radiusMeters
  };
}

/**
 * 10 QCVN Inspection Checklist Criteria (SSOT)
 */
export const QCVN_CHECKLIST_CRITERIA = [
  { id: 'CHK-01', category: 'PERIMETER', title: 'Hàng rào bao che xung quanh công trường', standard: 'QCVN 18:2021/BXD', weight: 1.5 },
  { id: 'CHK-02', category: 'PERIMETER', title: 'Lưới chắn bụi tại các tầng cao đang thi công', standard: 'QCVN 18:2021/BXD', weight: 1.5 },
  { id: 'CHK-03', category: 'VEHICLE', title: 'Trạm rửa lốp xe tự động/thủ công tại cổng ra vào', standard: 'QCVN 18:2021/BXD', weight: 2.0 },
  { id: 'CHK-04', category: 'VEHICLE', title: 'Phương tiện vận chuyển phủ bạt kín khít 100%', standard: 'Nghị định 45/2022/NĐ-CP', weight: 2.0 },
  { id: 'CHK-05', category: 'MATERIAL', title: 'Bạt phủ kín bãi tập kết cát, xi măng, xỉ thải', standard: 'QCVN 05:2023/BTNMT', weight: 1.5 },
  { id: 'CHK-06', category: 'SUPPRESSION', title: 'Hệ thống phun sương / tưới nước dập bụi nội bộ', standard: 'QCVN 05:2023/BTNMT', weight: 2.0 },
  { id: 'CHK-07', category: 'WASTE', title: 'Không đốt phế thải, bao bì, rác xây dựng tại chỗ', standard: 'Luật BVMT 2020', weight: 2.5 },
  { id: 'CHK-08', category: 'SURFACE', title: 'Đường nội bộ được quét dọn bùn đất định kỳ', standard: 'QCVN 05:2023/BTNMT', weight: 1.0 },
  { id: 'CHK-09', category: 'MONITORING', title: 'Trạm quan trắc IoT truyền dữ liệu liên tục', standard: 'QCVN 05:2023/BTNMT', weight: 1.0 },
  { id: 'CHK-10', category: 'RESPONSE', title: 'Biện pháp khắc phục trong vòng 24h khi có cảnh báo', standard: 'Quy chế Quản lý Môi trường Đô thị', weight: 1.5 }
];
