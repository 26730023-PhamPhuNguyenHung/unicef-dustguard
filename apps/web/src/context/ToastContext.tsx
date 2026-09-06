import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toast: (title: string, message?: string, type?: ToastType) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((title: string, message?: string, type: ToastType = 'info') => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `tst-${Date.now()}`;
    setToasts(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => toast(title, message, 'success'), [toast]);
  const error = useCallback((title: string, message?: string) => toast(title, message, 'error'), [toast]);
  const info = useCallback((title: string, message?: string) => toast(title, message, 'info'), [toast]);
  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const title = type === 'error' ? 'Lỗi hệ thống' : type === 'success' ? 'Thành công' : 'Thông báo';
    toast(title, message, type);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4" role="region" aria-live="polite">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto p-4 rounded-lg shadow-lg border flex items-start gap-3 transition-all transform duration-200 ease-out ${
              t.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : t.type === 'error'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : 'bg-stone-50 border-stone-300 text-stone-950'
            }`}
          >
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-stone-700 flex-shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className="font-bold text-sm">{t.title}</p>
              {t.message && <p className="text-xs mt-0.5 opacity-90">{t.message}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-stone-400 hover:text-stone-700 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center rounded"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
