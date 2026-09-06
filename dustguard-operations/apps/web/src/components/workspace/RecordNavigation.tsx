import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface RecordNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const RecordNavigation: React.FC<RecordNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-1 overflow-x-auto bg-surface p-1 rounded-lg border border-slate-200/90 shadow-2xs scrollbar-thin select-none ${className}`}
    >
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 shrink-0 px-3 py-2 text-xs font-semibold rounded-md whitespace-nowrap transition-all cursor-pointer touch-target min-h-[44px] ${
              isActive
                ? 'bg-dustguard-redSoft text-dustguard-red border-b-2 border-dustguard-red font-bold shadow-2xs'
                : 'text-ink-700 hover:text-ink-900 hover:bg-surface-subtle'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? 'bg-dustguard-red text-white'
                    : 'bg-surface-subtle text-ink-500'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
