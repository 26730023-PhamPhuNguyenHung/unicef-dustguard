import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.js';
import { usePermission } from '../../utils/permissions.js';
import { Permission } from '@dustguard/shared';
import { ForbiddenPage } from '../../pages/ForbiddenPage.js';
import { LoadingSkeleton } from '../common/LoadingSkeleton.js';

interface ProtectedRouteProps {
  permission?: Permission;
  allowedRoles?: string[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  permission,
  allowedRoles,
  children
}) => {
  const { user, isLoading } = useAuth();
  const { can } = usePermission();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  // 1. Chưa đăng nhập (401 Unauthorized) -> Chuyển hướng về /login và lưu lại trang đang muốn vào
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Đã đăng nhập nhưng thiếu Permission (403 Forbidden)
  if (permission && !can(permission)) {
    return <ForbiddenPage requiredPermission={permission} />;
  }

  // 2. Kiểm tra allowedRoles nếu có
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role ? user.role.toLowerCase() : '';
    // Hỗ trợ map member <-> community_member
    const normalizedUserRoles = [userRole];
    if (userRole === 'member') normalizedUserRoles.push('community_member');
    if (userRole === 'community_member') normalizedUserRoles.push('member');

    const hasRole = allowedRoles.some((r) => normalizedUserRoles.includes(r.toLowerCase()));
    if (!hasRole) {
      return (
        <ForbiddenPage
          customMessage={`Khu vực này chỉ dành cho vai trò: ${allowedRoles.join(', ')}.`}
        />
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
