import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string; // Default: 'w-full sm:w-[400px] lg:w-[420px]'
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  children,
  footer,
  width = 'w-full sm:w-[400px] lg:w-[420px]',
}) => {
  // Escape key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-ink-900/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label={title}
          className={`${width} bg-surface border-l border-slate-200 shadow-xl flex flex-col transform transition-transform duration-250 ease-out`}
        >
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-slate-200/90 flex items-center justify-between gap-3 bg-surface sticky top-0 z-10">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-ink-900 truncate">
                  {title}
                </h3>
                {badge}
              </div>
              {subtitle && (
                <p className="text-xs text-ink-500 truncate mt-0.5">{subtitle}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-ink-400 hover:text-ink-900 hover:bg-surface-subtle transition-colors cursor-pointer"
              aria-label="Đóng ngăn kéo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
            {children}
          </div>

          {/* Drawer Footer if any */}
          {footer && (
            <div className="p-4 border-t border-slate-200/90 bg-surface-subtle sticky bottom-0 z-10">
              {footer}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
