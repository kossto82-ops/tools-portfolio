import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ThumbsUp,
  Scale,
  AlertOctagon,
  Percent,
} from 'lucide-react';
import { Language, ScheduleQuality } from '../types';
import { t } from '../i18n/translations';

interface ScheduleQualityBannerProps {
  quality: ScheduleQuality;
  lang: Language;
  hasSchedule: boolean;
}

export const ScheduleQualityBanner: React.FC<ScheduleQualityBannerProps> = ({
  quality,
  lang,
  hasSchedule,
}) => {
  if (!hasSchedule) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 text-center">
        <p className="text-sm text-slate-500 font-medium">
          {lang === 'es'
            ? 'No hay cuadrante generado. Pulse "Generar Cuadrante" o cargue un escenario demo.'
            : 'No schedule has been generated yet. Click "Generate Schedule" or load a demo scenario to begin.'}
        </p>
      </div>
    );
  }

  // Determine overall badge color
  const scoreBadgeColor =
    quality.score >= 90
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : quality.score >= 75
      ? 'bg-blue-50 text-blue-700 border-blue-200'
      : quality.score >= 60
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';

  const fairnessKey =
    quality.fairnessRating === 'Excellent'
      ? 'fairnessExcellent'
      : quality.fairnessRating === 'Good'
      ? 'fairnessGood'
      : quality.fairnessRating === 'Fair'
      ? 'fairnessFair'
      : 'fairnessPoor';

  return (
    <div className="space-y-3">
      {/* Mathematical Impossibility Alert Banner */}
      {quality.isMathematicallyImpossible && (
        <div className="bg-rose-50 border-l-4 border-rose-600 p-3.5 rounded-r-lg flex items-start gap-3 text-rose-900 shadow-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <h4 className="font-semibold text-rose-900 text-sm">
              {t(lang, 'impossibleAlertTitle')}
            </h4>
            <p className="text-rose-700 mt-0.5">
              {quality.impossibleReason || t(lang, 'impossibleAlertDesc')}
            </p>
          </div>
        </div>
      )}

      {/* Main KPI Bar */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#f3f4f6]">
          {/* Overall Health Score */}
          <div className="pt-2 sm:pt-0 sm:pr-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
              <span>{t(lang, 'scheduleQuality')}</span>
              <Percent className="w-3 h-3 text-[#9ca3af]" />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-light italic font-serif leading-none text-[#111827]">
                {quality.score}%
              </span>
              <span className={`text-[10px] font-bold font-mono px-1.5 py-0.5 rounded border uppercase ${scoreBadgeColor}`}>
                {quality.score >= 85 ? 'Healthy' : quality.score >= 60 ? 'Warning' : 'Critical'}
              </span>
            </div>
          </div>

          {/* Coverage KPI */}
          <div className="pt-2 sm:pt-0 sm:px-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
              <span>{t(lang, 'coverageLabel')}</span>
              {quality.coveragePercentage === 100 ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-3 h-3 text-amber-500" />
              )}
            </div>
            <div className="mt-1">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-2xl font-light tracking-tight text-[#111827] font-mono">
                  {quality.coveragePercentage}%
                </span>
                <span className="text-[11px] text-[#6b7280] font-mono">
                  {quality.coveredSlotsCount}/{quality.totalRequiredSlots}
                </span>
              </div>
              <div className="w-full bg-[#f3f4f6] rounded-full h-1 mt-1.5 overflow-hidden">
                <div
                  className={`h-full ${
                    quality.coveragePercentage === 100 ? 'bg-green-500' : 'bg-orange-400'
                  }`}
                  style={{ width: `${quality.coveragePercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Hard Constraints */}
          <div className="pt-2 sm:pt-0 sm:px-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
              <span>{t(lang, 'hardConstraintsLabel')}</span>
              {quality.hardViolationsCount === 0 ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              ) : (
                <AlertOctagon className="w-3 h-3 text-rose-600" />
              )}
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`text-2xl font-light tracking-tight font-mono ${
                  quality.hardViolationsCount === 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {quality.hardViolationsCount}
              </span>
              <span className="text-[11px] text-[#6b7280] font-mono">
                {quality.hardViolationsCount === 0
                  ? t(lang, 'zeroViolations')
                  : t(lang, 'violationsCount', { count: quality.hardViolationsCount })}
              </span>
            </div>
          </div>

          {/* Preferences */}
          <div className="pt-2 sm:pt-0 sm:px-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
              <span>{t(lang, 'preferencesLabel')}</span>
              <ThumbsUp className="w-3 h-3 text-blue-500" />
            </div>
            <div className="mt-1">
              <div className="flex items-baseline justify-between gap-1">
                <span className="text-2xl font-light tracking-tight text-[#111827] font-mono">
                  {quality.preferenceSatisfactionPercentage}%
                </span>
                <span className="text-[11px] text-[#6b7280] font-sans">
                  {lang === 'es' ? 'cumplidas' : 'satisfied'}
                </span>
              </div>
              <div className="w-full bg-[#f3f4f6] rounded-full h-1 mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-orange-400"
                  style={{ width: `${quality.preferenceSatisfactionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Scheduled Hours */}
          <div className="pt-2 sm:pt-0 sm:px-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
              <span>{t(lang, 'totalHoursLabel')}</span>
              <Clock className="w-3 h-3 text-[#9ca3af]" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-light tracking-tight text-[#111827] font-mono">
                {quality.totalScheduledHours}h
              </span>
              <span className="text-xs text-[#6b7280] font-mono">
                / {quality.totalRequiredHours}h
              </span>
            </div>
          </div>

          {/* Fairness */}
          <div className="pt-2 sm:pt-0 sm:pl-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
              <span>{t(lang, 'fairnessLabel')}</span>
              <Scale className="w-3 h-3 text-slate-700" />
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-base font-bold text-[#111827] font-sans">
                {t(lang, fairnessKey)}
              </span>
              <span className="text-[11px] text-[#9ca3af] font-mono">
                (±{quality.fairnessVariance}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
