import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'teal';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-md transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed touch-target select-none cursor-pointer';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs min-h-[44px] sm:min-h-[36px] gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm min-h-[44px] gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base min-h-[48px] gap-2.5',
  };

  const variantStyles = {
    // Primary: Solid DustGuard Seal Red #B42318
    primary:
      'bg-dustguard-red text-white hover:bg-dustguard-redHover focus:ring-dustguard-red shadow-xs border border-dustguard-red active:translate-y-px',
    // Secondary: Clean White surface with subtle border (Secondary Outlined)
    secondary:
      'bg-white text-ink-900 hover:bg-surface-subtle border border-slate-200 focus:ring-slate-300 shadow-xs active:translate-y-px',
    // Outline: Transparent with border
    outline:
      'bg-transparent text-ink-700 hover:bg-surface-subtle border border-slate-300 focus:ring-slate-300 active:translate-y-px',
    // Danger: Red destructive
    danger:
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-xs border border-transparent active:translate-y-px',
    // Ghost: Subtle hover, transparent background
    ghost:
      'bg-transparent text-ink-600 hover:bg-surface-subtle hover:text-ink-900 border border-transparent',
    // Deep Teal #0D6F64 Solid
    teal:
      'bg-dustguard-teal text-white hover:bg-dustguard-tealHover focus:ring-dustguard-teal shadow-xs border border-dustguard-teal active:translate-y-px',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="inline-flex shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
