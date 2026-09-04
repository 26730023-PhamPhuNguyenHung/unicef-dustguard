export type Role = 'staff' | 'supervisor' | 'legal_reviewer' | 'admin';

export type Permission =
  | 'case:view'
  | 'case:create'
  | 'case:update'
  | 'case:triage'
  | 'case:assign'
  | 'case:reassign'
  | 'case:transition'
  | 'case:close'
  | 'case:reopen'
  | 'task:view'
  | 'task:update'
  | 'inspection:create'
  | 'inspection:perform'
  | 'inspection:review'
  | 'inspection:submit'
  | 'action:create'
  | 'action:update'
  | 'action:verify'
  | 'remediation:submit'
  | 'remediation:review'
  | 'legal:view'
  | 'legal:import'
  | 'legal:search'
  | 'legal:analyze'
  | 'legal:review'
  | 'legal:approve'
  | 'evidence:upload'
  | 'evidence:view'
  | 'iot:view'
  | 'iot:manage'
  | 'automation:view'
  | 'automation:manage'
  | 'dashboard:view'
  | 'workload:view'
  | 'admin:users'
  | 'admin:audit'
  | 'admin:config'
  | 'user:manage'
  | 'audit:view'
  | 'system:config'
  | '*';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  staff: [
    'case:view',
    'case:create',
    'case:update',
    'case:triage',
    'case:transition',
    'task:view',
    'task:update',
    'inspection:create',
    'inspection:perform',
    'inspection:submit',
    'action:create',
    'action:update',
    'remediation:submit',
    'remediation:review',
    'legal:view',
    'legal:search',
    'legal:analyze',
    'evidence:upload',
    'evidence:view',
    'iot:view',
    'dashboard:view',
  ],
  supervisor: [
    'case:view',
    'case:create',
    'case:update',
    'case:triage',
    'case:assign',
    'case:reassign',
    'case:transition',
    'case:close',
    'case:reopen',
    'task:view',
    'task:update',
    'inspection:create',
    'inspection:perform',
    'inspection:review',
    'inspection:submit',
    'action:create',
    'action:update',
    'action:verify',
    'remediation:review',
    'legal:view',
    'legal:search',
    'legal:analyze',
    'evidence:upload',
    'evidence:view',
    'iot:view',
    'iot:manage',
    'automation:view',
    'automation:manage',
    'dashboard:view',
    'workload:view',
    'audit:view',
  ],
  legal_reviewer: [
    'case:view',
    'legal:view',
    'legal:import',
    'legal:search',
    'legal:analyze',
    'legal:review',
    'legal:approve',
    'evidence:view',
    'dashboard:view',
  ],
  admin: ['*'],
};

export function can(role: Role | undefined | null, permission: Permission): boolean {
  if (!role) return false;
  const userPerms = ROLE_PERMISSIONS[role];
  if (!userPerms) return false;
  if (userPerms.includes('*')) return true;
  return userPerms.includes(permission);
}

export function getRoleLabel(role: Role): string {
  switch (role) {
    case 'staff':
      return 'Cán bộ hiện trường';
    case 'supervisor':
      return 'Lãnh đạo điều phối';
    case 'legal_reviewer':
      return 'Chuyên viên pháp chế';
    case 'admin':
      return 'Quản trị hệ thống';
    default:
      return role;
  }
}
