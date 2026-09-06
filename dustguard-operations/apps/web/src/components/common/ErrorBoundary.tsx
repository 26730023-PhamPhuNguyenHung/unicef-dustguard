import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[DustGuard Operations UI Error]', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = import.meta.env.BASE_URL || '/operations/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-page text-ink-900 flex flex-col items-center justify-center p-4 sm:p-6 select-text">
          <div className="max-w-md w-full bg-white border-2 border-dustguard-red/30 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-5">
            <div className="w-14 h-14 bg-dustguard-redSoft text-dustguard-red rounded-2xl flex items-center justify-center mx-auto border border-dustguard-redBorder">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-ink-900">
                Đã xảy ra sự cố hiển thị
              </h2>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed text-pretty">
                Hệ thống điều hành ghi nhận bất thường khi xử lý dữ liệu. Vui lòng tải lại hoặc quay về trang chủ.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-surface-subtle border border-slate-200 rounded-xl text-left text-xs font-mono text-ink-700 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full min-h-[44px] py-2.5 px-4 bg-dustguard-red hover:bg-dustguard-redHover text-white text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="w-full min-h-[44px] py-2.5 px-4 bg-surface-subtle hover:bg-slate-200 text-ink-800 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-300 active:scale-98"
              >
                <Home className="w-4 h-4" />
                <span>Về bàn làm việc</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
