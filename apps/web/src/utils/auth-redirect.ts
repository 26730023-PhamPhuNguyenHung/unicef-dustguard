import { UserDto } from '@dustguard/shared';

/**
 * Bộ phân giải đích đến sau đăng nhập chuẩn tắc (SSOT Redirect Resolver) cho Side A (Community)
 * Tuân thủ nguyên tắc:
 * 1. Ưu tiên bảo toàn Deep-link mà người dùng yêu cầu trước khi đăng nhập.
 * 2. Nếu không có deep-link, phân giải dựa trên Capabilities / Năng lực của vai trò.
 * 3. Tuyệt đối không hardcode link legacy.
 */
export function resolveCommunityHome(user: UserDto | null, requestedPath?: string | null): string {
  // 1. Kiểm tra Deep-link hợp lệ
  if (requestedPath && requestedPath !== '/login' && requestedPath !== '/register' && requestedPath !== '/') {
    return requestedPath;
  }

  if (!user) {
    return '/dashboard';
  }

  const role = user.role ? user.role.toLowerCase() : 'citizen';

  // 2. Phân giải theo Năng lực chính của vai trò
  if (role === 'admin') {
    return '/admin/overview';
  }

  if (role === 'moderator') {
    return '/moderator/dashboard';
  }

  if (role === 'member' || role === 'community_member') {
    return '/tasks';
  }

  // Mặc định cho Citizen (Người dân)
  return '/dashboard';
}

/**
 * Phân giải cho Side B (Operations)
 */
export function resolveOperationsHome(role?: string, requestedPath?: string | null): string {
  if (requestedPath && requestedPath !== '/login' && requestedPath !== '/') {
    return requestedPath;
  }

  const r = (role || 'staff').toLowerCase();
  if (r === 'supervisor') {
    return '/supervisor/workload';
  }
  if (r === 'legal_reviewer') {
    return '/cases';
  }
  if (r === 'admin') {
    return '/admin/users';
  }
  return '/dashboard';
}
