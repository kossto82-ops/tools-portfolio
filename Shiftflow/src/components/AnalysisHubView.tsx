import React, { useState } from 'react';
import {
  AlertTriangle,
  Terminal,
  Activity,
  CheckCircle2,
  AlertOctagon,
  Percent,
  Scale,
  Clock,
} from 'lucide-react';
import {
  ConstraintViolation,
  CoverageRequirement,
  Language,
  ScheduleQuality,
  SlotAssignmentReasoning,
} from '../types';
import { t } from '../i18n/translations';
import { ConflictPanel } from './ConflictPanel';
import { AlgorithmTransparencyView } from './AlgorithmTransparencyView';

type AnalysisSubTab = 'conflicts' | 'transparency' | 'quality';

interface AnalysisHubViewProps {
  violations: ConstraintViolation[];
  reasoningList: SlotAssignmentReasoning[];
  requirements: CoverageRequirement[];
  quality: ScheduleQuality;
  lang: Language;
  onInspectShift: (requirementId: string) => void;
}

export const AnalysisHubView: React.FC<AnalysisHubViewProps> = ({
  violations,
  reasoningList,
  requirements,
  quality,
  lang,
  onInspectShift,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<AnalysisSubTab>('conflicts');

  const hardCount = violations.filter(v => v.severity === 'hard').length;
  const softCount = violations.filter(v => v.severity === 'soft').length;

  return (
    <div className="space-y-3">
      {/* Editorial Header Bar */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-serif italic text-xl text-[#111827]">
              {t(lang, 'navAnalysis')}
            </h2>
            <span className="text-xs font-mono uppercase text-[#6b7280]">
              Operational Intelligence
            </span>
          </div>
          <p className="text-xs text-[#6b7280] mt-0.5">
            {lang === 'es'
              ? 'Auditoría integral de restricciones, puntuaciones del algoritmo heurístico y equidad laboral.'
              : 'Comprehensive auditing of scheduling constraints, heuristic algorithmic scores, and workload fairness.'}
          </p>
        </div>

        {/* Sub-tab Switcher: Subtle left rule and restrained background */}
        <div className="flex bg-[#f3f4f6] p-0.5 rounded border border-[#e5e7eb] self-start sm:self-auto overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab('conflicts')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'conflicts'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t(lang, 'subAnalysisConflicts')}</span>
            {violations.length > 0 && (
              <span
                className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                  hardCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {violations.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('transparency')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'transparency'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>{t(lang, 'subAnalysisTransparency')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('quality')}
            className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeSubTab === 'quality'
                ? 'bg-white text-[#111827] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t(lang, 'subAnalysisQuality')}</span>
          </button>
        </div>
      </div>

      {/* View Content */}
      {activeSubTab === 'conflicts' && (
        <ConflictPanel
          violations={violations}
          lang={lang}
          onInspectShift={onInspectShift}
        />
      )}

      {activeSubTab === 'transparency' && (
        <AlgorithmTransparencyView
          reasoningList={reasoningList}
          requirements={requirements}
          lang={lang}
        />
      )}

      {activeSubTab === 'quality' && (
        <div className="space-y-3">
          {/* Detailed Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Score */}
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b7280]">
                {t(lang, 'scheduleQuality')} Score
              </span>
              <div className="text-2xl font-bold font-mono text-[#111827] mt-1">
                {quality.score}
                <span className="text-sm text-[#9ca3af] font-normal"> / 100</span>
              </div>
              <p className="text-[11px] text-[#6b7280] mt-1">
                {quality.score >= 85
                  ? (lang === 'es' ? 'Solución óptima y equilibrada' : 'Optimal balanced solution')
                  : (lang === 'es' ? 'Requiere ajustes operacionales' : 'Operational adjustments advised')}
              </p>
            </div>

            {/* Coverage */}
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b7280]">
                {t(lang, 'coverageLabel')}
              </span>
              <div className="text-2xl font-bold font-mono text-[#111827] mt-1">
                {quality.coveragePercentage}%
              </div>
              <p className="text-[11px] text-[#6b7280] mt-1">
                {quality.coveredSlotsCount} / {quality.totalRequiredSlots} {lang === 'es' ? 'turnos cubiertos' : 'slots filled'}
              </p>
            </div>

            {/* Fairness */}
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b7280]">
                {t(lang, 'fairnessLabel')}
              </span>
              <div className="text-2xl font-bold font-mono text-[#111827] mt-1">
                {quality.fairnessRating}
              </div>
              <p className="text-[11px] text-[#6b7280] mt-1 font-mono">
                σ² variance: {quality.fairnessVariance.toFixed(1)}h
              </p>
            </div>

            {/* Preference rate */}
            <div className="bg-white border border-[#e5e7eb] rounded-lg p-3.5 shadow-xs">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#6b7280]">
                {t(lang, 'preferencesLabel')}
              </span>
              <div className="text-2xl font-bold font-mono text-[#111827] mt-1">
                {quality.preferenceSatisfactionPercentage}%
              </div>
              <p className="text-[11px] text-[#6b7280] mt-1">
                {lang === 'es' ? 'Preferencia horaria respetada' : 'Shift preference aligned'}
              </p>
            </div>
          </div>

          {/* Mathematical Feasibility Audit */}
          <div className="bg-white border border-[#e5e7eb] rounded-lg p-4 shadow-xs">
            <h3 className="font-serif italic text-base text-[#111827] mb-2">
              {lang === 'es' ? 'Auditoría de Capacidad y Factibilidad Matemática' : 'Capacity & Mathematical Feasibility Audit'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded">
                <span className="text-[#6b7280] block text-[10px] uppercase">
                  {lang === 'es' ? 'Horas Requeridas por Demanda' : 'Demand Hours Required'}
                </span>
                <span className="text-lg font-bold text-[#111827]">
                  {quality.totalRequiredHours.toFixed(1)}h
                </span>
              </div>
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded">
                <span className="text-[#6b7280] block text-[10px] uppercase">
                  {lang === 'es' ? 'Horas Totales Programadas' : 'Total Scheduled Hours'}
                </span>
                <span className="text-lg font-bold text-[#111827]">
                  {quality.totalScheduledHours.toFixed(1)}h
                </span>
              </div>
              <div className="p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded">
                <span className="text-[#6b7280] block text-[10px] uppercase">
                  {lang === 'es' ? 'Restricciones Incumplidas' : 'Unsatisfied Constraints'}
                </span>
                <span className={`text-lg font-bold ${hardCount > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {hardCount} Hard • {softCount} Soft
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
