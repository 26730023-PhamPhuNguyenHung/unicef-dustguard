import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';
import { can, Permission } from '../shared.js';

export function requirePermission(permission: Permission) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        type: 'https://dustguard.gov.vn/errors/unauthorized',
        title: 'Chưa xác thực',
        status: 401,
        detail: 'Vui lòng đăng nhập.',
      });
      return;
    }

    if (!can(req.user.role, permission)) {
      res.status(403).json({
        type: 'https://dustguard.gov.vn/errors/forbidden',
        title: 'Không đủ thẩm quyền',
        status: 403,
        detail: `Tài khoản với vai trò "${req.user.role}" không có quyền "${permission}".`,
      });
      return;
    }

    next();
  };
}

export const requireCapability = requirePermission;

