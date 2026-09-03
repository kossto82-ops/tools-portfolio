import React, { useState } from 'react';
import {
  CalendarRange,
  RotateCcw,
  Sparkles,
  Download,
  Languages,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import { Language, ScheduleScenario } from '../types';
import { t } from '../i18n/translations';
import { ALL_PRESET_SCENARIOS } from '../data/presetScenarios';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  selectedScenarioId: string;
  onSelectScenario: (scenario: ScheduleScenario) => void;
  onLoadDemo: () => void;
  onGenerate: () => void;
  onReset: () => void;
  onOpenExport: () => void;
  isGenerating: boolean;
  hasManualOverrides: boolean;
  onRevertToAlgorithmic: () => void;
  hasSchedule: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  selectedScenarioId,
  onSelectScenario,
  onLoadDemo,
  onGenerate,
  onReset,
  onOpenExport,
  isGenerating,
  hasManualOverrides,
  onRevertToAlgorithmic,
  hasSchedule,
}) => {
  const [showScenarioDropdown, setShowScenarioDropdown] = useState(false);

  const currentScenario = ALL_PRESET_SCENARIOS.find(s => s.id === selectedScenarioId) || ALL_PRESET_SCENARIOS[0];

  return (
    <header className="bg-white border-b border-[#e5e7eb] sticky top-0 z-30 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2.5 gap-2.5">
          {/* Logo & Product Title */}
          <div className="flex items-center gap-3">
            <div className="bg-[#111827] text-white px-3 py-1 rounded font-bold tracking-tighter text-lg italic shadow-xs">
              ShiftFlow
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#111827]">
                  {t(lang, 'appSubtitle')}
                </span>
                {hasManualOverrides && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    <AlertCircle className="w-3 h-3" />
                    {t(lang, 'whatIfActive')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#6b7280] font-medium">
                {t(lang, 'tagline')}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Scenario Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                id="scenario-menu-button"
                onClick={() => setShowScenarioDropdown(!showScenarioDropdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-[#d1d5db] rounded-md transition-colors shadow-xs"
                title={t(lang, 'selectScenario')}
              >
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span className="max-w-[140px] truncate text-xs">{currentScenario.name}</span>
                <span className="text-slate-400 text-[9px]">▼</span>
              </button>

              {showScenarioDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowScenarioDropdown(false)}
                  />
                  <div className="absolute right-0 mt-1 w-80 bg-white border border-[#e5e7eb] rounded-lg shadow-xl py-1 z-50 text-xs">
                    <div className="px-3 py-1.5 border-b border-[#f3f4f6] text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
                      {t(lang, 'selectScenario')}
                    </div>
                    {ALL_PRESET_SCENARIOS.map(sc => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => {
                          onSelectScenario(sc);
                          setShowScenarioDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 transition-colors flex flex-col gap-0.5 hover:bg-[#f9fafb] ${
                          sc.id === selectedScenarioId ? 'bg-slate-100/80 border-l-2 border-[#111827]' : ''
                        }`}
                      >
                        <span className="font-bold text-slate-900">{sc.name}</span>
                        <span className="text-[11px] text-[#6b7280] line-clamp-1">{sc.description}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Load Demo Scenario button */}
            <button
              type="button"
              id="load-demo-button"
              onClick={onLoadDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-md bg-[#111827] text-white hover:bg-black transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t(lang, 'loadDemo')}</span>
            </button>

            {/* Revert to algorithmic baseline (only shown if manual edits made) */}
            {hasManualOverrides && (
              <button
                type="button"
                id="revert-baseline-button"
                onClick={onRevertToAlgorithmic}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-md transition-colors cursor-pointer"
                title={t(lang, 'revertToGenerated')}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t(lang, 'revertToGenerated')}</span>
              </button>
            )}

            {/* Reset Button */}
            <button
              type="button"
              id="reset-scenario-button"
              onClick={onReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-[#d1d5db] rounded-md transition-colors cursor-pointer"
              title={t(lang, 'resetScenario')}
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">{t(lang, 'resetScenario')}</span>
            </button>

            {/* Export Schedule */}
            {hasSchedule && (
              <button
                type="button"
                id="export-schedule-button"
                onClick={onOpenExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#111827] bg-white hover:bg-slate-50 border border-[#d1d5db] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>{t(lang, 'exportSchedule')}</span>
              </button>
            )}

            {/* Segmented Language Switcher */}
            <div className="flex bg-[#f3f4f6] rounded-md p-0.5 border border-[#e5e7eb]">
              <button
                type="button"
                id="language-toggle-en"
                onClick={lang === 'en' ? undefined : onToggleLang}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white shadow-xs text-[#111827]'
                    : 'text-[#6b7280] hover:text-[#111827]'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                id="language-toggle-es"
                onClick={lang === 'es' ? undefined : onToggleLang}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-all cursor-pointer ${
                  lang === 'es'
                    ? 'bg-white shadow-xs text-[#111827]'
                    : 'text-[#6b7280] hover:text-[#111827]'
                }`}
                title="Español"
              >
                ES
              </button>
            </div>

            {/* Primary Action: Generate / Regenerate Schedule */}
            <button
              type="button"
              id="generate-schedule-button"
              onClick={onGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-[#111827] hover:bg-black active:bg-slate-900 disabled:opacity-50 rounded-md shadow-xs transition-colors cursor-pointer"
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
        </div>
      </div>
    </header>
  );
};
