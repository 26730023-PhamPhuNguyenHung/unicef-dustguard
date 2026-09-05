import React from 'react';

export interface ListWorkspaceProps {
  header?: React.ReactNode;
  filterBar?: React.ReactNode;
  children: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
}

export const ListWorkspace: React.FC<ListWorkspaceProps> = ({
  header,
  filterBar,
  children,
  pagination,
  className = '',
}) => {
  return (
    <div className={`w-full min-w-0 space-y-4 ${className}`}>
      {header}
      {filterBar}
      <div className="w-full min-w-0">{children}</div>
      {pagination}
    </div>
  );
};
