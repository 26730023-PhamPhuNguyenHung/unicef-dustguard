import React from 'react';

export interface InvestigationWorkspaceProps {
  children: React.ReactNode;
  className?: string;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full min-w-0 space-y-4 ${className}`}>
      {children}
    </div>
  );
};

export const MainLegalCanvas: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full min-w-0 space-y-4 ${className}`}>
      {children}
    </div>
  );
};
