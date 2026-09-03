import React from 'react';
import {
  Calendar,
  Users,
  AlertTriangle,
  UserCheck,
  Clock,
  Terminal,
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';

export type ActiveTab =
  | 'weekly-grid'
  | 'employee-matrix'
  | 'conflicts'
  | 'staff'
  | 'requirements'
  | 'transparency';

interface ViewTabsProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  lang: Language;
  hardViolationsCount: number;
  softViolationsCount: number;
}

export const ViewTabs: React.FC<ViewTabsProps> = ({
  activeTab,
  onChangeTab,
  lang,
  hardViolationsCount,
  softViolationsCount,
}) => {
  const totalViolations = hardViolationsCount + softViolationsCount;

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number; badgeType?: 'danger' | 'warning' }[] = [
    {
      id: 'weekly-grid',
      label: t(lang, 'tabWeeklyGrid'),
      icon: Calendar,
    },
    {
      id: 'employee-matrix',
      label: t(lang, 'tabEmployeeMatrix'),
      icon: Users,
    },
    {
      id: 'conflicts',
      label: t(lang, 'tabConflicts'),
      icon: AlertTriangle,
      badge: totalViolations > 0 ? totalViolations : undefined,
      badgeType: hardViolationsCount > 0 ? 'danger' : 'warning',
    },
    {
      id: 'staff',
      label: t(lang, 'tabEmployees'),
      icon: UserCheck,
    },
    {
      id: 'requirements',
      label: t(lang, 'tabRequirements'),
      icon: Clock,
    },
    {
      id: 'transparency',
      label: t(lang, 'tabTransparency'),
      icon: Terminal,
    },
  ];

  return (
    <div className="border-b border-[#e5e7eb] bg-white sticky top-[57px] z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar" aria-label="Tabs">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 py-2.5 px-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 cursor-pointer ${
                  isActive
                    ? 'text-[#111827] border-[#111827] bg-[#f9fafb]'
                    : 'text-[#6b7280] border-transparent hover:text-[#111827] hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#111827]' : 'text-[#9ca3af]'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      tab.badgeType === 'danger'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
