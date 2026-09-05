import React from 'react';
import { useAuth, DEV_ACCOUNTS } from '../../context/AuthContext';
import { Role } from '@dustguard-operations/shared';
import { ShieldAlert, UserCheck } from 'lucide-react';

export const DevRoleSwitcher: React.FC = () => {
  // Only render in DEV mode (Section 41)
  if (!(import.meta as any).env?.DEV) {
    return null;
  }

  const { user, switchRole, loading } = useAuth();

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex flex-wrap items-center justify-between text-xs text-amber-900 gap-2">
      <div className="flex items-center gap-1.5 font-medium">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
        <span>Chế độ Nhà phát triển (Dev Mode) — Đổi vai trò nhanh:</span>
        {user && (
          <span className="bg-amber-200/80 px-2 py-0.5 rounded text-amber-950 font-bold ml-1">
            {user.full_name} ({user.role})
          </span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {(Object.keys(DEV_ACCOUNTS) as Role[]).map(role => {
          const acc = DEV_ACCOUNTS[role];
          const isActive = user?.role === role;
          return (
            <button
              key={role}
              onClick={() => switchRole(role)}
              disabled={loading || isActive}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                isActive
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {acc.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
