import React from 'react';
import { useAuth, DEV_ACCOUNTS } from '../../context/AuthContext';
import { Role } from '@dustguard-operations/shared';
import { Terminal } from 'lucide-react';

export const DevRoleSwitcher: React.FC = () => {
  // Only render in DEV mode
  if (!(import.meta as any).env?.DEV) {
    return null;
  }

  const { user, switchRole, loading } = useAuth();

  return (
    <aside
      aria-label="Công cụ phát triển: chuyển đổi vai trò"
      className="bg-stone-100/95 border-b border-stone-200 px-3 sm:px-6 py-1 flex items-center justify-between text-[11px] text-ink-600 gap-2 select-none z-40 relative w-full max-w-full overflow-hidden"
    >
      <div className="flex items-center gap-1.5 font-medium shrink-0">
        <Terminal className="w-3 h-3 text-ink-400 shrink-0" />
        <span className="font-semibold text-ink-700 hidden sm:inline">Dev:</span>
        {user && (
          <span className="text-ink-600 truncate hidden md:inline max-w-[120px]">
            {user.full_name}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 overflow-x-auto min-w-0 max-w-full py-0.5 scrollbar-thin">
        {(Object.keys(DEV_ACCOUNTS) as Role[]).map(role => {
          const acc = DEV_ACCOUNTS[role];
          const isActive = user?.role === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => switchRole(role)}
              disabled={loading || isActive}
              className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-dustguard-red text-white font-bold shadow-xs'
                  : 'bg-white hover:bg-stone-200 text-ink-700 border border-stone-300 hover:border-stone-400 font-medium'
              }`}
            >
              {acc.label}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
