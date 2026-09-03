import React from 'react';
import {
  Calendar,
  Users,
  Clock,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';
import { NavigationSection } from './SidebarNav';

interface MobileNavProps {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
  lang: Language;
  onToggleLang: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  violationsCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentSection,
  onSelectSection,
  lang,
  onToggleLang,
  onGenerate,
  isGenerating,
  violationsCount,
}) => {
  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-[#e5e7eb] px-3 py-2 flex items-center justify-between shadow-xs">
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono font-bold tracking-tight text-sm text-[#111827]">
            SHIFT
          </span>
          <span className="font-serif italic font-semibold text-base text-[#111827]">
            FLOW
          </span>
          <span className="text-[10px] font-mono text-[#6b7280] ml-1">
            W37
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Generate button */}
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-[#111827] rounded shadow-xs"
          >
            {isGenerating ? (
              <div className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3 h-3 text-amber-300" />
            )}
            <span>{lang === 'es' ? 'Optimizar' : 'Optimize'}</span>
          </button>

          {/* Lang toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="px-2 py-1 text-[10px] font-mono font-bold uppercase rounded border border-[#e5e7eb] text-[#111827] bg-[#f9fafb]"
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#e5e7eb] grid grid-cols-4 px-1 py-1 shadow-lg"
        aria-label="Mobile Bottom Navigation"
      >
        {/* Schedule */}
        <button
          type="button"
          onClick={() => onSelectSection('schedule')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 text-center transition-colors cursor-pointer ${
            currentSection === 'schedule'
              ? 'text-[#111827] font-bold'
              : 'text-[#6b7280] font-medium'
          }`}
        >
          <Calendar className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono leading-tight">
            {t(lang, 'navSchedule')}
          </span>
        </button>

        {/* Team */}
        <button
          type="button"
          onClick={() => onSelectSection('team')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 text-center transition-colors cursor-pointer ${
            currentSection === 'team'
              ? 'text-[#111827] font-bold'
              : 'text-[#6b7280] font-medium'
          }`}
        >
          <Users className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono leading-tight">
            {t(lang, 'navTeam')}
          </span>
        </button>

        {/* Requirements */}
        <button
          type="button"
          onClick={() => onSelectSection('requirements')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 text-center transition-colors cursor-pointer ${
            currentSection === 'requirements'
              ? 'text-[#111827] font-bold'
              : 'text-[#6b7280] font-medium'
          }`}
        >
          <Clock className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono leading-tight">
            {t(lang, 'navRequirements')}
          </span>
        </button>

        {/* Analysis */}
        <button
          type="button"
          onClick={() => onSelectSection('analysis')}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 text-center transition-colors cursor-pointer ${
            currentSection === 'analysis'
              ? 'text-[#111827] font-bold'
              : 'text-[#6b7280] font-medium'
          }`}
        >
          <BarChart3 className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] font-mono leading-tight">
            {t(lang, 'navAnalysis')}
          </span>
          {violationsCount > 0 && (
            <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
          )}
        </button>
      </nav>
    </>
  );
};
