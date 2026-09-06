import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
      {/* Opaque solid backdrop without glassmorphism blur */}
      <div
        className="fixed inset-0 bg-ink-900/50 transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4 text-center">
        <div
          className={`relative transform rounded-t-2xl sm:rounded-xl bg-surface text-left shadow-2xl transition-all w-full ${maxWidthStyles[maxWidth]} border border-slate-200/90 max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/90 px-4 py-3.5 sm:px-5 sm:py-4 bg-surface-subtle shrink-0">
            <h3 className="text-sm sm:text-base font-bold text-ink-900 tracking-tight leading-snug">{title}</h3>
            <button
              onClick={onClose}
              className="text-ink-400 hover:text-ink-800 rounded-lg p-2 hover:bg-surface touch-target min-h-[44px] min-w-[44px] inline-flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Đóng hộp thoại"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 overflow-y-auto scrollbar-thin flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
};
