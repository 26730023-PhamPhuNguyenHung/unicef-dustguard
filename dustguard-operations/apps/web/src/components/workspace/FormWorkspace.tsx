import React from 'react';

export interface FormWorkspaceProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // default: 'max-w-4xl'
  className?: string;
}

export const FormWorkspace: React.FC<FormWorkspaceProps> = ({
  header,
  children,
  footer,
  maxWidth = 'max-w-4xl',
  className = '',
}) => {
  return (
    <div className={`w-full ${maxWidth} mx-auto space-y-5 ${className}`}>
      {header}
      <div className="w-full bg-surface border border-slate-200/90 rounded-lg p-5 sm:p-6 shadow-xs">
        {children}
      </div>
      {footer}
    </div>
  );
};
