import React from 'react';

interface StatCardProps {
  label?: string;
  title?: string;
  value: number | string;
  icon?: any;
  hint?: string;
  trend?: string;
  accentColor?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  title,
  value,
  icon: IconComponent,
  hint,
  trend,
  accentColor = '#9F241F',
  color
}) => {
  const displayLabel = label || title || '';
  const finalColor = color || accentColor;

  return (
    <div className="bg-surface-card p-5 rounded-civic border border-border-subtle shadow-xs flex flex-col justify-between transition-all hover:border-border-strong">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-content-sub text-pretty">{displayLabel}</span>
        {IconComponent && (
          <div
            className="p-2 rounded-lg shrink-0"
            style={{ backgroundColor: `${finalColor}15`, color: finalColor }}
          >
            {React.isValidElement(IconComponent) ? (
              IconComponent
            ) : typeof IconComponent === 'function' || (typeof IconComponent === 'object' && IconComponent !== null) ? (
              <IconComponent className="w-5 h-5" />
            ) : null}
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-black text-content-main tracking-tight">
          {value}
        </div>
        {hint && <p className="text-xs text-content-sub mt-1 text-pretty">{hint}</p>}
        {trend && (
          <span className="inline-block text-xs font-semibold text-state-success mt-1">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
