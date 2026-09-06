import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'red' | 'teal' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-dustguard-redSoft text-dustguard-red border-dustguard-redBorder font-semibold',
    red: 'bg-dustguard-redSoft text-dustguard-red border-dustguard-redBorder font-semibold',
    teal: 'bg-teal-50 text-teal-800 border-teal-200 font-semibold',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-blue-50 text-blue-900 border-blue-200',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px] leading-none',
    md: 'px-2 py-0.5 text-xs font-semibold leading-normal',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border font-semibold select-none whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
