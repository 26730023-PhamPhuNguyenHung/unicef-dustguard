import React from 'react';
import { useAuth } from '../context/AuthContext';
import type { Permission } from '@dustguard-operations/shared';

export function usePermission(permission: Permission): boolean {
  const { can } = useAuth();
  return can(permission);
}

export const RequirePermission: React.FC<{
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}> = ({ permission, fallback = null, children }) => {
  const hasPermission = usePermission(permission);
  if (!hasPermission) {
    return React.createElement(React.Fragment, null, fallback);
  }
  return React.createElement(React.Fragment, null, children);
};
