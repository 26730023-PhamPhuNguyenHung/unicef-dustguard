import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt?: string;
  className?: string;
  fallbackText?: string;
  aspectRatio?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Minh chứng nghiệp vụ',
  className = 'w-full h-48 object-cover',
  fallbackText = 'Chưa có hình ảnh minh chứng',
  aspectRatio,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || src.trim() === '' || src === 'null' || src === 'undefined' || hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-50 border border-slate-200 rounded-xl p-4 text-center select-none ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
          <Camera className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-slate-700">
          {fallbackText}
        </span>
        <span className="text-[10px] text-slate-500 mt-0.5">
          Tệp gốc không khả dụng hoặc đang cập nhật
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-slate-100 rounded-xl" style={aspectRatio ? { aspectRatio } : undefined}>
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
      {!loaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 animate-pulse text-slate-400 text-xs">
          Đang tải ảnh...
        </div>
      )}
    </div>
  );
};
