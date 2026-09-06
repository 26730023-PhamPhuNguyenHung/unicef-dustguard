import React from 'react';
import { Permission } from '@dustguard/shared';
import {
  LayoutDashboard,
  Map,
  FileText,
  Bookmark,
  Users,
  CheckSquare,
  Bell,
  Award,
  User,
  ShieldCheck,
  Sliders,
  FileCheck,
  Layers,
  BarChart2,
  Lock,
  LucideIcon
} from 'lucide-react';

export interface NavItemConfig {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  permission: Permission;
}

export interface NavSectionConfig {
  id: string;
  title: string;
  icon?: LucideIcon;
  items: NavItemConfig[];
}

export const NAVIGATION_CONFIG: NavSectionConfig[] = [
  {
    id: 'community',
    title: 'Cộng đồng',
    items: [
      {
        id: 'dashboard',
        label: 'Tổng quan',
        path: '/dashboard',
        icon: LayoutDashboard,
        permission: 'case:view'
      },
      {
        id: 'map',
        label: 'Bản đồ',
        path: '/map',
        icon: Map,
        permission: 'case:view'
      },
      {
        id: 'reports',
        label: 'Phản ánh',
        path: '/reports',
        icon: FileText,
        permission: 'report:view'
      },
      {
        id: 'following',
        label: 'Theo dõi',
        path: '/following',
        icon: Bookmark,
        permission: 'case:follow'
      },
      {
        id: 'communities',
        label: 'Cộng đồng',
        path: '/communities',
        icon: Users,
        permission: 'community:view'
      },
      {
        id: 'tasks',
        label: 'Nhiệm vụ',
        path: '/tasks',
        icon: CheckSquare,
        permission: 'task:view'
      },
      {
        id: 'notifications',
        label: 'Thông báo',
        path: '/notifications',
        icon: Bell,
        permission: 'notification:view'
      },
      {
        id: 'credits',
        label: 'Tín chỉ thanh niên',
        path: '/credits',
        icon: Award,
        permission: 'contribution:view'
      },
      {
        id: 'profile',
        label: 'Hồ sơ',
        path: '/profile',
        icon: User,
        permission: 'profile:manage'
      }
    ]
  },
  {
    id: 'moderator',
    title: 'Điều phối viên',
    icon: ShieldCheck,
    items: [
      {
        id: 'moderator_inbox',
        label: 'Hộp thư xác minh',
        path: '/moderator/inbox',
        icon: FileCheck,
        permission: 'moderator:inbox'
      },
      {
        id: 'moderator_cases',
        label: 'Điều phối vụ việc',
        path: '/moderator/cases',
        icon: Layers,
        permission: 'moderator:coordinate_cases'
      },
      {
        id: 'moderator_content',
        label: 'Kiểm duyệt nội dung',
        path: '/moderator/content',
        icon: Sliders,
        permission: 'moderator:moderate_content'
      },
      {
        id: 'moderator_stats',
        label: 'Thống kê điều phối',
        path: '/moderator/dashboard',
        icon: BarChart2,
        permission: 'moderator:stats'
      }
    ]
  },
  {
    id: 'admin',
    title: 'Quản trị hệ thống',
    icon: Lock,
    items: [
      {
        id: 'admin_overview',
        label: 'Tổng quan hệ thống',
        path: '/admin/overview',
        icon: BarChart2,
        permission: 'admin:stats'
      },
      {
        id: 'admin_users',
        label: 'Người dùng',
        path: '/admin/users',
        icon: Users,
        permission: 'admin:users'
      },
      {
        id: 'admin_audit',
        label: 'Nhật ký kiểm toán',
        path: '/admin/audit',
        icon: FileText,
        permission: 'admin:audit'
      }
    ]
  }
];
