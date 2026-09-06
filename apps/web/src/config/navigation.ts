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
  badge?: number;
}

export interface NavSectionConfig {
  id: string;
  title: string;
  icon?: LucideIcon;
  items: NavItemConfig[];
}

export const NAVIGATION_CONFIG: NavSectionConfig[] = [
  {
    id: 'monitoring',
    title: 'Phản ánh & Theo dõi',
    items: [
      {
        id: 'dashboard',
        label: 'Trang chủ',
        path: '/dashboard',
        icon: LayoutDashboard,
        permission: 'case:view'
      },
      {
        id: 'reports',
        label: 'Phản ánh môi trường',
        path: '/reports',
        icon: FileText,
        permission: 'report:view'
      },
      {
        id: 'map',
        label: 'Bản đồ môi trường',
        path: '/map',
        icon: Map,
        permission: 'case:view'
      },
      {
        id: 'following',
        label: 'Theo dõi của tôi',
        path: '/following',
        icon: Bookmark,
        permission: 'case:follow'
      }
    ]
  },
  {
    id: 'community_network',
    title: 'Mạng lưới cộng đồng',
    items: [
      {
        id: 'communities',
        label: 'Hoạt động & CLB',
        path: '/communities',
        icon: Users,
        permission: 'community:view'
      },
      {
        id: 'tasks',
        label: 'Nhiệm vụ giám sát',
        path: '/tasks',
        icon: CheckSquare,
        permission: 'task:view'
      },
      {
        id: 'contributions',
        label: 'Dấu ấn đóng góp',
        path: '/contributions',
        icon: Award,
        permission: 'contribution:view'
      }
    ]
  },
  {
    id: 'personal',
    title: 'Cá nhân',
    items: [
      {
        id: 'notifications',
        label: 'Thông báo',
        path: '/notifications',
        icon: Bell,
        permission: 'notification:view'
      },
      {
        id: 'profile',
        label: 'Hồ sơ cá nhân',
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
        label: 'Hộp thư thẩm định',
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
        label: 'Quản lý người dùng',
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
