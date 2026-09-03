import React from 'react';
import {
  Calendar,
  Grid,
  Users,
  Plus,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Language } from '../types';
import { t } from '../i18n/translations';

export type ScheduleViewMode = 'weekly-grid' | 'employee-matrix';

interface ScheduleHeaderProps {
  viewMode: ScheduleViewMode;
  onChangeViewMode: (mode: ScheduleViewMode) => void;
  onOpenAddShift: () => void;
  onOpenExport: () => void;
  hasManualOverrides: boolean;
  onRevertToAlgorithmic: () => void;
  lang: Language;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  viewMode,
  onChangeViewMode,
  onOpenAddShift,
  onOpenExport,
  hasManualOverrides,
  onRevertToAlgorithmic,
  lang,
}) => {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 sm:p-4 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Title & Planning Period Context */}
        <div>
          <div className="flex items-baseline gap-2.5">
            <h1 className="font-serif italic text-2xl text-[#111827] tracking-tight">
              {t(lang, 'navSchedule')}
            </h1>
            <span className="text-xs font-mono font-bold text-[#6b7280] uppercase tracking-wider">
              {t(lang, 'planningPeriod')}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6b7280] font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#9ca3af]" />
            <span className="text-[#111827] font-semibold">
              {t(lang, 'currentWeekRange')}
            </span>
            <span>•</span>
            <span>{lang === 'es' ? 'Ciclo Semanal' : 'Weekly Cycle'}</span>
            {hasManualOverrides && (
              <>
                <span>•</span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                  {lang === 'es' ? 'Simulación Manual Activa' : 'What-If Active'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Primary Actions Area */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Switcher: Weekly Roster vs Workload Matrix */}
          <div className="flex bg-[#f3f4f6] p-0.5 rounded border border-[#e5e7eb]">
            <button
              type="button"
              onClick={() => onChangeViewMode('weekly-grid')}
              className={`px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'weekly-grid'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{t(lang, 'viewWeeklyGrid')}</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('employee-matrix')}
              className={`px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'employee-matrix'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#6b7280] hover:text-[#111827]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{t(lang, 'viewWorkloadMatrix')}</span>
            </button>
          </div>

          {/* Add Shift Action */}
          <button
            type="button"
            onClick={onOpenAddShift}
            className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb] cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Añadir Turno' : 'Add Shift'}</span>
          </button>

          {/* Export Action */}
          <button
            type="button"
            onClick={onOpenExport}
            className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded border border-[#e5e7eb] bg-white text-[#111827] hover:bg-[#f9fafb] cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t(lang, 'exportSchedule')}</span>
          </button>

          {/* Revert to algorithmic if overrides exist */}
          {hasManualOverrides && (
            <button
              type="button"
              onClick={onRevertToAlgorithmic}
              className="px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 cursor-pointer transition-colors flex items-center gap-1 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>{t(lang, 'revertToGenerated')}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
