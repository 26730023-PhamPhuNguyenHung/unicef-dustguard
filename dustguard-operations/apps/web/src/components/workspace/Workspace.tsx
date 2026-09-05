import React from 'react';

export interface WorkspaceProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'compact' | 'normal' | 'loose';
}

export const Workspace: React.FC<WorkspaceProps> = ({
  children,
  className = '',
  spacing = 'normal',
}) => {
  const spacingClasses = {
    compact: 'space-y-3',
    normal: 'space-y-4 sm:space-y-5',
    loose: 'space-y-6',
  };

  return (
    <div className={`w-full min-w-0 max-w-full ${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};
