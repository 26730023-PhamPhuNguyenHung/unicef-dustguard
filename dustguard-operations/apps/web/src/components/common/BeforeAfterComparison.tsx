import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Columns, SplitSquareVertical, ShieldCheck, Clock, MapPin } from 'lucide-react';

export interface BeforeAfterComparisonProps {
  beforeUrl?: string | null;
  afterUrl?: string | null;
  beforeLabel?: string;
  afterLabel?: string;
  beforeSha256?: string | null;
  afterSha256?: string | null;
  beforeTimestamp?: string | null;
  afterTimestamp?: string | null;
  siteLocationText?: string | null;
  initialPosition?: number;
  className?: string;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Hiện trường lúc phát hiện vi phạm (Trước)',
  afterLabel = 'Hiện trường sau khi đã xử lý (Sau)',
  beforeSha256 = null,
  afterSha256 = null,
  beforeTimestamp = null,
  afterTimestamp = null,
  siteLocationText = null,
  initialPosition = 50,
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'slider' | 'split'>('slider');
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const width = rect.width;
    if (width <= 0) return;
    const percentage = Math.max(0, Math.min(100, (x / width) * 100));
    setSliderPosition(Math.round(percentage * 10) / 10);
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !e.touches || e.touches.length === 0) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handlePointerUp]);

  // Case 1: Missing both photos
  if (!beforeUrl && !afterUrl) {
    return (
      <div className={`p-8 bg-slate-50 rounded-2xl border border-slate-200 text-center ${className}`}>
        <div className="w-12 h-12 mx-auto rounded-full bg-slate-200 flex items-center justify-center text-slate-500 mb-2">
          <Columns className="w-6 h-6" />
        </div>
        <p className="text-xs font-bold text-slate-800">Chưa có ảnh đối chứng hiện trường</p>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Hình ảnh vi phạm ban đầu và minh chứng khắc phục sẽ hiển thị tại đây khi được tải lên.
        </p>
      </div>
    );
  }

  // Case 2: Only Before photo
  if (beforeUrl && !afterUrl) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-red-800 bg-red-50 border border-red-200 px-2.5 py-1 rounded-md">
            1. {beforeLabel}
          </span>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
            Đang chờ đơn vị thi công nộp ảnh khắc phục
          </span>
        </div>
        <div className="relative aspect-video bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
          <img src={beforeUrl} alt={beforeLabel} className="w-full h-full object-cover" />
        </div>
        {beforeSha256 && (
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
            <span className="font-bold flex items-center gap-1.5 text-slate-900 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Mã băm SHA-256 niêm phong:
            </span>
            <span className="break-all select-all text-slate-600 font-semibold">{beforeSha256}</span>
          </div>
        )}
      </div>
    );
  }

  // Case 3: Both Before & After photos exist (Interactive Slider or Split-View)
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200">
            Đối chứng Thực tế
          </span>
          {siteLocationText && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-600">
              <MapPin className="w-3 h-3 text-slate-400" /> {siteLocationText}
            </span>
          )}
        </div>

        <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-white shadow-3xs">
          <button
            type="button"
            onClick={() => setViewMode('slider')}
            className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'slider' ? 'bg-seal-600 text-white shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SplitSquareVertical className="w-3.5 h-3.5" /> Thanh trượt
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-colors ${
              viewMode === 'split' ? 'bg-seal-600 text-white shadow-3xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" /> Chia đôi
          </button>
        </div>
      </div>

      {viewMode === 'slider' ? (
        /* INTERACTIVE SLIDER MODE */
        <div
          ref={containerRef}
          className="relative aspect-video rounded-xl border border-slate-300 overflow-hidden select-none touch-none cursor-ew-resize bg-slate-900"
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          {/* After Photo (Base Layer) */}
          <img
            src={afterUrl!}
            alt={afterLabel}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-white/95 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-sm pointer-events-none">
            {afterLabel}
          </div>

          {/* Before Photo (Clipped Overlay Layer) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            <img
              src={beforeUrl!}
              alt={beforeLabel}
              className="absolute inset-0 w-full h-full object-cover max-w-none"
              style={{
                width: containerRef.current?.getBoundingClientRect().width || '100%',
                height: '100%',
              }}
              draggable={false}
            />
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 text-red-800 border border-red-300 text-xs font-bold shadow-sm pointer-events-none">
              {beforeLabel}
            </div>
          </div>

          {/* Vertical Slider Handle Line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-2 border-seal-600 shadow-md flex items-center justify-center text-slate-800">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
                <polyline points="9 18 3 12 9 6" />
              </svg>
            </div>
          </div>
        </div>
      ) : (
        /* SIDE-BY-SIDE SPLIT MODE */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Before Card */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-800 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                1. {beforeLabel}
              </span>
              {beforeTimestamp && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(beforeTimestamp).toLocaleString('vi-VN')}
                </span>
              )}
            </div>
            <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              <img src={beforeUrl!} alt={beforeLabel} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* After Card */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                2. {afterLabel}
              </span>
              {afterTimestamp && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(afterTimestamp).toLocaleString('vi-VN')}
                </span>
              )}
            </div>
            <div className="aspect-video bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              <img src={afterUrl!} alt={afterLabel} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic SHA-256 Hashes Display */}
      {(beforeSha256 || afterSha256) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
          {beforeSha256 && (
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-red-600" /> Băm SHA-256 ảnh vi phạm:
              </span>
              <p className="break-all select-all text-slate-600 font-medium">{beforeSha256}</p>
            </div>
          )}
          {afterSha256 && (
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-0.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Băm SHA-256 ảnh khắc phục:
              </span>
              <p className="break-all select-all text-slate-600 font-medium">{afterSha256}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
