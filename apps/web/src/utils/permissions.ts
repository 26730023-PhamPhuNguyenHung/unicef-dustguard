import React from 'react';
import { useAuth } from '../context/AuthContext.js';
import { can as canCheck, Permission, ROLE_PERMISSIONS } from '@dustguard/shared';

export { canCheck as can, ROLE_PERMISSIONS };
export type { Permission };

/**
 * Hook tiện ích kiểm tra quyền của người dùng hiện tại
 */
export function usePermission() {
  const { user } = useAuth();
  const role = user?.role || null;

  const check = (permission: Permission): boolean => {
    return canCheck(role, permission);
  };

  const hasAny = (permissions: Permission[]): boolean => {
    return permissions.some((p) => canCheck(role, p));
  };

  const hasAll = (permissions: Permission[]): boolean => {
    return permissions.every((p) => canCheck(role, p));
  };

  return {
    can: check,
    hasAny,
    hasAll,
    role,
    user
  };
}

interface RequirePermissionProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Component điều kiện render theo quyền
 */
export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const { can } = usePermission();

  if (!can(permission)) {
    return React.createElement(React.Fragment, null, fallback);
  }

  return React.createElement(React.Fragment, null, children);
};
