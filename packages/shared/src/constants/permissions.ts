import { UserRole } from '../types/index.js';

export type Permission =
  // Citizen
  | 'report:create'
  | 'report:view'
  | 'case:view'
  | 'case:confirm'
  | 'case:follow'
  | 'community:view'
  | 'notification:view'
  | 'profile:manage'
  // Member
  | 'task:view'
  | 'task:claim'
  | 'task:submit'
  | 'observation:create'
  | 'contribution:view'
  // Moderator
  | 'moderator:inbox'
  | 'moderator:verify'
  | 'moderator:reject'
  | 'moderator:merge'
  | 'moderator:create_case'
  | 'moderator:coordinate_cases'
  | 'moderator:update_case_status'
  | 'moderator:moderate_content'
  | 'moderator:stats'
  // Admin
  | 'admin:users'
  | 'admin:roles'
  | 'admin:status'
  | 'admin:audit'
  | 'admin:config'
  | 'admin:stats';

// Mapping chuẩn capabilities cho từng role
// Lưu ý: member và community_member là alias tương thích
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  citizen: [
    'report:create',
    'report:view',
    'case:view',
    'case:confirm',
    'case:follow',
    'community:view',
    'notification:view',
    'profile:manage'
  ],
  member: [
    // Toàn bộ quyền của Citizen
    'report:create',
    'report:view',
    'case:view',
    'case:confirm',
    'case:follow',
    'community:view',
    'notification:view',
    'profile:manage',
    // Năng lực mở rộng của Member
    'task:view',
    'task:claim',
    'task:submit',
    'observation:create',
    'contribution:view'
  ],
  community_member: [
    // Alias của member
    'report:create',
    'report:view',
    'case:view',
    'case:confirm',
    'case:follow',
    'community:view',
    'notification:view',
    'profile:manage',
    'task:view',
    'task:claim',
    'task:submit',
    'observation:create',
    'contribution:view'
  ],
  moderator: [
    // Toàn bộ quyền của Member
    'report:create',
    'report:view',
    'case:view',
    'case:confirm',
    'case:follow',
    'community:view',
    'notification:view',
    'profile:manage',
    'task:view',
    'task:claim',
    'task:submit',
    'observation:create',
    'contribution:view',
    // Năng lực mở rộng của Moderator
    'moderator:inbox',
    'moderator:verify',
    'moderator:reject',
    'moderator:merge',
    'moderator:create_case',
    'moderator:coordinate_cases',
    'moderator:update_case_status',
    'moderator:moderate_content',
    'moderator:stats'
  ],
  admin: [
    // Toàn bộ quyền của Moderator
    'report:create',
    'report:view',
    'case:view',
    'case:confirm',
    'case:follow',
    'community:view',
    'notification:view',
    'profile:manage',
    'task:view',
    'task:claim',
    'task:submit',
    'observation:create',
    'contribution:view',
    'moderator:inbox',
    'moderator:verify',
    'moderator:reject',
    'moderator:merge',
    'moderator:create_case',
    'moderator:coordinate_cases',
    'moderator:update_case_status',
    'moderator:moderate_content',
    'moderator:stats',
    // Năng lực độc quyền của Admin
    'admin:users',
    'admin:roles',
    'admin:status',
    'admin:audit',
    'admin:config',
    'admin:stats'
  ]
};

/**
 * Kiểm tra xem một role có permission cụ thể hay không.
 * Nếu không có role (người dùng vãng lai chưa đăng nhập), chỉ cấp quyền xem công khai nếu có.
 */
export function can(role: string | null | undefined, permission: Permission): boolean {
  if (!role) {
    // Khách vãng lai chỉ có thể xem phản ánh/vụ việc công khai
    const publicPermissions: Permission[] = ['report:view', 'case:view', 'community:view'];
    return publicPermissions.includes(permission);
  }

  const normalizedRole = role.toLowerCase().trim();
  const permissions = ROLE_PERMISSIONS[normalizedRole];
  if (!permissions) return false;

  return permissions.includes(permission);
}
