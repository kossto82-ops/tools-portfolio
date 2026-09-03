import React from 'react';
import {
  Calendar,
  Users,
  Clock,
  BarChart3,
  Sparkles,
  Sliders,
  RotateCcw,
} from 'lucide-react';
import { Language, ScheduleScenario } from '../types';
import { t } from '../i18n/translations';
import { ALL_PRESET_SCENARIOS } from '../data/presetScenarios';

export type NavigationSection = 'schedule' | 'team' | 'requirements' | 'analysis';

interface SidebarNavProps {
  currentSection: NavigationSection;
  onSelectSection: (section: NavigationSection) => void;
  lang: Language;
  onToggleLang: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasSchedule: boolean;
  violationsCount: number;
  hardViolationsCount: number;
  employeesCount: number;
  requirementsCount: number;
  selectedScenarioId: string;
  onSelectScenario: (scenario: ScheduleScenario) => void;
  onReset: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  currentSection,
  onSelectSection,
  lang,
  onToggleLang,
  onGenerate,
  isGenerating,
  hasSchedule,
  violationsCount,
  hardViolationsCount,
  employeesCount,
  requirementsCount,
  selectedScenarioId,
  onSelectScenario,
  onReset,
}) => {
  const currentScenario =
    ALL_PRESET_SCENARIOS.find(s => s.id === selectedScenarioId) ||
    ALL_PRESET_SCENARIOS[0];

  return (
    <aside className="hidden md:flex flex-col justify-between w-56 lg:w-60 shrink-0 bg-white border-r border-[#e5e7eb] min-h-screen sticky top-0 z-30 p-3 sm:p-4 select-none">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Brand identity: SHIFT FLOW */}
        <div className="pt-1 pb-1">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono font-bold tracking-tighter text-base text-[#111827]">
              SHIFT
            </span>
            <span className="font-serif italic font-semibold text-lg text-[#111827]">
              FLOW
            </span>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#6b7280] mt-0.5">
            Workforce Planning
          </p>
        </div>

        <div className="border-t border-[#e5e7eb]" />

        {/* WORKSPACE Navigation Section */}
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9ca3af] px-2 mb-1.5">
            {t(lang, 'navWorkspace')}
          </div>

          <nav className="space-y-0.5" aria-label="Workspace Navigation">
            {/* Schedule - Dominant workspace */}
            <button
              type="button"
              id="nav-schedule"
              onClick={() => onSelectSection('schedule')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs transition-colors cursor-pointer rounded-r text-left ${
                currentSection === 'schedule'
                  ? 'font-bold text-[#111827] bg-[#f3f4f6] border-l-2 border-[#111827]'
                  : 'font-medium text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className={`w-3.5 h-3.5 ${currentSection === 'schedule' ? 'text-[#111827]' : 'text-[#9ca3af]'}`} />
                <span className={currentSection === 'schedule' ? 'font-semibold' : ''}>
                  {t(lang, 'navSchedule')}
                </span>
              </div>
              <span className="text-[9px] font-mono text-[#9ca3af]">
                W37
              </span>
            </button>

            {/* Team */}
            <button
              type="button"
              id="nav-team"
              onClick={() => onSelectSection('team')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs transition-colors cursor-pointer rounded-r text-left ${
                currentSection === 'team'
                  ? 'font-bold text-[#111827] bg-[#f3f4f6] border-l-2 border-[#111827]'
                  : 'font-medium text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className={`w-3.5 h-3.5 ${currentSection === 'team' ? 'text-[#111827]' : 'text-[#9ca3af]'}`} />
                <span>{t(lang, 'navTeam')}</span>
              </div>
              <span className="text-[10px] font-mono text-[#6b7280] font-semibold">
                {employeesCount}
              </span>
            </button>

            {/* Requirements */}
            <button
              type="button"
              id="nav-requirements"
              onClick={() => onSelectSection('requirements')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs transition-colors cursor-pointer rounded-r text-left ${
                currentSection === 'requirements'
                  ? 'font-bold text-[#111827] bg-[#f3f4f6] border-l-2 border-[#111827]'
                  : 'font-medium text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className={`w-3.5 h-3.5 ${currentSection === 'requirements' ? 'text-[#111827]' : 'text-[#9ca3af]'}`} />
                <span>{t(lang, 'navRequirements')}</span>
              </div>
              <span className="text-[10px] font-mono text-[#6b7280] font-semibold">
                {requirementsCount}
              </span>
            </button>
          </nav>
        </div>

        <div className="border-t border-[#e5e7eb]" />

        {/* INSIGHTS Navigation Section */}
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9ca3af] px-2 mb-1.5">
            {t(lang, 'navInsights')}
          </div>

          <nav className="space-y-0.5" aria-label="Insights Navigation">
            {/* Analysis */}
            <button
              type="button"
              id="nav-analysis"
              onClick={() => onSelectSection('analysis')}
              className={`w-full flex items-center justify-between px-2.5 py-2 text-xs transition-colors cursor-pointer rounded-r text-left ${
                currentSection === 'analysis'
                  ? 'font-bold text-[#111827] bg-[#f3f4f6] border-l-2 border-[#111827]'
                  : 'font-medium text-[#6b7280] hover:text-[#111827] hover:bg-[#f9fafb] border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className={`w-3.5 h-3.5 ${currentSection === 'analysis' ? 'text-[#111827]' : 'text-[#9ca3af]'}`} />
                <span>{t(lang, 'navAnalysis')}</span>
              </div>
              {violationsCount > 0 && (
                <span
                  className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                    hardViolationsCount > 0
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {violationsCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="border-t border-[#e5e7eb]" />

        {/* Primary Action: Generate Schedule */}
        <div>
          <button
            type="button"
            id="sidebar-generate-button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white bg-[#111827] hover:bg-black active:bg-slate-900 disabled:opacity-50 rounded shadow-xs cursor-pointer transition-colors"
          >
            {isGenerating ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{t(lang, 'regenerating')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {hasSchedule ? t(lang, 'regenerateSchedule') : t(lang, 'generateSchedule')}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Planning Period Context Block */}
        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded p-2.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#9ca3af] block">
            {t(lang, 'planningPeriod')}
          </span>
          <div className="text-xs font-bold text-[#111827] mt-0.5">
            {t(lang, 'currentWeekLabel')}
          </div>
          <div className="text-[11px] font-mono text-[#6b7280]">
            {t(lang, 'currentWeekRange')}
          </div>
        </div>
      </div>

      {/* Bottom Area: Scenario Switcher & Language Controls */}
      <div className="space-y-2 pt-3 border-t border-[#e5e7eb]">
        {/* Scenario dropdown selector */}
        <div className="relative">
          <label
            htmlFor="scenario-select"
            className="block text-[10px] font-mono font-bold text-[#9ca3af] uppercase tracking-wider mb-1"
          >
            {lang === 'es' ? 'Escenario' : 'Scenario'}
          </label>
          <div className="flex items-center gap-1">
            <select
              id="scenario-select"
              value={selectedScenarioId}
              onChange={e => {
                const sc = ALL_PRESET_SCENARIOS.find(s => s.id === e.target.value);
                if (sc) onSelectScenario(sc);
              }}
              className="w-full text-[11px] font-medium py-1 px-1.5 bg-white border border-[#e5e7eb] rounded text-[#111827] focus:border-[#111827] focus:outline-hidden truncate"
            >
              {ALL_PRESET_SCENARIOS.map(sc => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onReset}
              title={t(lang, 'resetScenario')}
              className="p-1 rounded text-[#6b7280] hover:text-[#111827] border border-[#e5e7eb] hover:bg-[#f9fafb] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Language switch */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[10px] font-mono text-[#9ca3af] uppercase tracking-wider">
            Language
          </span>
          <div className="flex bg-[#f3f4f6] rounded p-0.5 border border-[#e5e7eb]">
            <button
              type="button"
              onClick={lang === 'en' ? undefined : onToggleLang}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${
                lang === 'en'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={lang === 'es' ? undefined : onToggleLang}
              className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded cursor-pointer transition-all ${
                lang === 'es'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
