/**
 * BẢNG ĐỊNH TUYẾN CHUẨN TẮC (CANONICAL ROUTE CONFIGURATION)
 * DustGuard VN — Kiến trúc Một nền tảng · Hai phía
 */

export const CANONICAL_ROUTES = {
  // Public & Auth
  HOME: '/',
  LANDING: '/landing',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Side A: Cộng đồng (Community)
  COMMUNITY: {
    DASHBOARD: '/dashboard',
    MAP: '/map',
    REPORTS: '/reports',
    REPORT_NEW: '/reports/new',
    REPORT_DETAIL: (id: string) => `/reports/${id}`,
    CASE_DETAIL: (id: string) => `/cases/${id}`,
    OBSERVE_CASE: (id: string) => `/cases/${id}/observe`,
    FOLLOWING: '/following',
    COMMUNITIES: '/communities',
    COMMUNITY_DETAIL: (slug: string) => `/communities/${slug}`,
    TASKS: '/tasks',
    NOTIFICATIONS: '/notifications',
    CONTRIBUTIONS: '/contributions',
    CREDITS: '/credits',
    PROFILE: '/profile',
    FORBIDDEN: '/forbidden',

    // Moderator
    MODERATOR_INBOX: '/moderator/inbox',
    MODERATOR_CASES: '/moderator/cases',
    MODERATOR_CONTENT: '/moderator/content',
    MODERATOR_DASHBOARD: '/moderator/dashboard',

    // Community Admin
    ADMIN_OVERVIEW: '/admin/overview',
    ADMIN_USERS: '/admin/users',
    ADMIN_AUDIT: '/admin/audit',

    // Contractor Portal
    CONTRACTOR_PORTAL: '/contractor/portal',
    CONTRACTOR_REMEDIATION: (id: string) => `/contractor/remediation/${id}`
  },

  // Side B: Đơn vị Xử lý (Operations)
  OPERATIONS: {
    ROOT: '/operations',
    DASHBOARD: '/operations/dashboard',
    CASES: '/operations/cases',
    CASE_DETAIL: (id: string) => `/operations/cases/${id}`,
    PROJECTS: '/operations/projects',
    CONTRACTORS: '/operations/contractors',
    TASKS: '/operations/tasks',
    INSPECTIONS: '/operations/inspections',
    INSPECTION_PLAN: '/operations/inspections/new',
    FIELD_INSPECTION: (id: string) => `/operations/inspections/${id}`,
    ACTIONS: '/operations/actions',
    LEGAL_LIBRARY: '/operations/legal/library',
    LEGAL_IMPORT: '/operations/legal/import',
    IOT: '/operations/iot',
    AUTOMATIONS: '/operations/automations',
    EVIDENCE: '/operations/evidence',
    REPORTS: '/operations/reports',
    SUPERVISOR_WORKLOAD: '/operations/supervisor/workload',
    ADMIN_USERS: '/operations/admin/users',
    ADMIN_AUDIT: '/operations/admin/audit',
    ADMIN_SETTINGS: '/operations/admin/settings'
  }
} as const;

/**
 * Phân giải trang chủ chuẩn tắc sau đăng nhập (Single SSOT Redirect Resolver)
 */
export function getDefaultRoute(role?: string, side: 'community' | 'operations' = 'community', requestedPath?: string | null): string {
  // Ưu tiên bảo toàn deep-link nếu hợp lệ
  if (requestedPath && requestedPath !== '/login' && requestedPath !== '/register' && requestedPath !== '/' && requestedPath !== '/operations/login') {
    return requestedPath;
  }

  const r = (role || '').toLowerCase();

  if (side === 'operations') {
    if (r === 'supervisor') return CANONICAL_ROUTES.OPERATIONS.SUPERVISOR_WORKLOAD;
    if (r === 'legal_reviewer') return CANONICAL_ROUTES.OPERATIONS.CASES;
    if (r === 'admin') return CANONICAL_ROUTES.OPERATIONS.ADMIN_USERS;
    if (r === 'staff') return CANONICAL_ROUTES.OPERATIONS.INSPECTIONS;
    return CANONICAL_ROUTES.OPERATIONS.DASHBOARD;
  }

  // Side A: Community
  if (r === 'admin') return CANONICAL_ROUTES.COMMUNITY.ADMIN_OVERVIEW;
  if (r === 'moderator') return CANONICAL_ROUTES.COMMUNITY.MODERATOR_DASHBOARD;
  if (r === 'member' || r === 'community_member') return CANONICAL_ROUTES.COMMUNITY.TASKS;
  return CANONICAL_ROUTES.COMMUNITY.DASHBOARD;
}
