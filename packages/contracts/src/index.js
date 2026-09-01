/**
 * @dustguard/contracts
 * SSOT TypeScript Contracts, DTOs & RFC 7807 Error Models
 */

/**
 * Case Status 7-Step Workflow Hierarchy
 */
export const CASE_STATUS = {
  SCREENING: 'SCREENING',               // 1. Tiếp nhận
  PREPARING: 'PREPARING',               // 2. Xác minh
  DECISION_ISSUED: 'DECISION_ISSUED',   // 3. Thông báo
  ON_SITE: 'ON_SITE',                   // 4. Khảo sát
  REPORTING: 'REPORTING',               // 5. Đề xuất
  APPRAISING: 'APPRAISING',             // 6. Thẩm định
  COMPLETED: 'COMPLETED'                // 7. Hoàn tất
};

/**
 * Alert Severities
 */
export const ALERT_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

/**
 * Inspection Outcome
 */
export const INSPECTION_RESULT = {
  PASS: 'PASS',
  FAIL: 'FAIL',
  NA: 'NA'
};

/**
 * Remediation Action Status
 */
export const REMEDIATION_STATUS = {
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED',
  REVISION_REQUESTED: 'REVISION_REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

/**
 * RFC 7807 Problem Details Formatter
 */
export function formatRfc7807(status, code, title, detail, instance, errors) {
  return {
    type: `https://dustguard.vn/errors/${code.toLowerCase()}`,
    title,
    status,
    detail,
    instance: instance || undefined,
    code,
    errors: errors || undefined,
    timestamp: new Date().toISOString()
  };
}

/**
 * Standard API Response Envelope
 */
export function successResponse(data, meta) {
  return {
    data,
    meta: meta || { timestamp: new Date().toISOString() }
  };
}
