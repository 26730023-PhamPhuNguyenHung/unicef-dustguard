import React from 'react';

export interface RecordWorkspaceProps {
  children: React.ReactNode;
  className?: string;
}

export const RecordContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full min-w-0 ${className}`}>
      {children}
    </div>
  );
};

export const RecordWorkspace: React.FC<RecordWorkspaceProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full min-w-0 space-y-4 sm:space-y-5 ${className}`}>
      {children}
    </div>
  );
};
