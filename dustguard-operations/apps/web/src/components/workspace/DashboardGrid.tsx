import React from 'react';

export interface DashboardGridProps {
  metrics?: React.ReactNode;
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  metrics,
  children,
  columns = 2,
  className = '',
}) => {
  const colClasses = {
    2: 'grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-5',
    3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5',
    4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5',
  };

  return (
    <div className={`w-full min-w-0 space-y-4 sm:space-y-5 ${className}`}>
      {metrics && <div className="w-full min-w-0">{metrics}</div>}
      <div className={colClasses[columns]}>{children}</div>
    </div>
  );
};
