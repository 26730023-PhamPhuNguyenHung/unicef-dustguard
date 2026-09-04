import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';

interface ForbiddenPageProps {
  requiredPermission?: string;
  customMessage?: string;
}

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({
  requiredPermission,
  customMessage
}) => {
  const { user } = useAuth();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-card border border-border-subtle rounded-civic-lg p-6 sm:p-8 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-xs border border-red-100">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-red-600 uppercase tracking-widest px-2.5 py-1 bg-red-50 rounded-full">
            Lỗi 403 — Quyền truy cập bị hạn chế
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-content-main">
            Khu vực không thuộc phạm vi vai trò
          </h1>
          <p className="text-xs sm:text-sm text-content-sub leading-relaxed">
            {customMessage || (
              user ? (
                <>
                  Tài khoản của bạn hiện đang ở vai trò{' '}
                  <strong className="text-content-main font-bold capitalize">
                    {user.role.replace('_', ' ')}
                  </strong>
                  , không có thẩm quyền truy cập vào chức năng này.
                </>
              ) : (
                'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập để tiếp tục.'
              )
            )}
          </p>
        </div>

        {requiredPermission && (
          <div className="text-[11px] text-content-muted font-mono bg-surface-secondary/60 p-2.5 rounded-lg border border-border-subtle">
            Yêu cầu năng lực: <span className="font-semibold text-content-main">{requiredPermission}</span>
          </div>
        )}

        <div className="pt-3 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-dark transition-all shadow-xs active:scale-95"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>

          {!user && (
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-subtle bg-white text-content-main font-bold text-xs hover:bg-surface-secondary transition-all"
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
export default ForbiddenPage;
