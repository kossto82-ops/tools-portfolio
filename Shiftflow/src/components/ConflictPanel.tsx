import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Clock,
  CalendarX,
  UserX,
  CheckCircle2,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { ConstraintSeverity, ConstraintViolation, Language } from '../types';
import { t } from '../i18n/translations';

interface ConflictPanelProps {
  violations: ConstraintViolation[];
  lang: Language;
  onInspectShift: (requirementId: string) => void;
}

export const ConflictPanel: React.FC<ConflictPanelProps> = ({
  violations,
  lang,
  onInspectShift,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<'all' | ConstraintSeverity>('all');

  const filteredViolations = violations.filter(v => {
    if (filterSeverity === 'all') return true;
    return v.severity === filterSeverity;
  });

  const hardCount = violations.filter(v => v.severity === 'hard').length;
  const softCount = violations.filter(v => v.severity === 'soft').length;

  const getViolationIcon = (type: ConstraintViolation['type']) => {
    switch (type) {
      case 'UNAVAILABLE':
        return <CalendarX className="w-4 h-4 text-rose-600" />;
      case 'OVERLAPPING_SHIFT':
        return <Clock className="w-4 h-4 text-rose-600" />;
      case 'MAX_HOURS_EXCEEDED':
        return <AlertOctagon className="w-4 h-4 text-rose-600" />;
      case 'UNDERSTAFFED':
        return <UserX className="w-4 h-4 text-amber-600" />;
      case 'ROLE_MISMATCH':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'PREFERENCE_MISMATCH':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'UNBALANCED_HOURS':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-xs overflow-hidden">
      {/* Header and Filter Controls */}
      <div className="p-3 sm:p-4 border-b border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-serif italic text-lg text-[#111827]">
            {t(lang, 'tabConflicts')}
          </h3>
          <p className="text-xs text-[#6b7280] mt-0.5">
            {lang === 'es'
              ? 'Detección exhaustiva de restricciones duras (críticas) y blandas (preferencias y equilibrio).'
              : 'Real-time constraint auditor separating non-negotiable operational rules from preference trade-offs.'}
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#f3f4f6] rounded-md text-xs font-mono">
          <button
            type="button"
            onClick={() => setFilterSeverity('all')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              filterSeverity === 'all'
                ? 'bg-white text-[#111827] shadow-xs border border-[#e5e7eb]'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            {t(lang, 'allConflicts')} ({violations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('hard')}
            className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer ${
              filterSeverity === 'hard'
                ? 'bg-rose-50 text-rose-800 border border-rose-200 shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            <span>Hard</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-100 text-rose-800">
              {hardCount}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity('soft')}
            className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer ${
              filterSeverity === 'soft'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            <span>Soft</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800">
              {softCount}
            </span>
          </button>
        </div>
      </div>

      {/* Conflicts List */}
      <div className="p-3 sm:p-4">
        {filteredViolations.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5 border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111827]">
              {t(lang, 'noConflictsMessage')}
            </h4>
            <p className="text-xs text-[#6b7280] mt-1 max-w-md">
              {lang === 'es'
                ? 'Todos los requisitos de cobertura están cumplidos y ninguna restricción dura ha sido vulnerada.'
                : 'All staffing coverage goals are fulfilled and no hard operational limits have been breached.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredViolations.map(violation => {
              const isHard = violation.severity === 'hard';
              return (
                <div
                  key={violation.id}
                  className={`p-3 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 ${
                    isHard
                      ? 'bg-red-50/20 border-red-200 ring-1 ring-red-400/80 text-slate-900'
                      : 'bg-amber-50/25 border-amber-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded shrink-0 mt-0.5 ${
                        isHard ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {getViolationIcon(violation.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                            isHard
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : 'bg-amber-100 text-amber-900 border-amber-200'
                          }`}
                        >
                          {isHard ? 'Hard Constraint' : 'Soft Constraint'}
                        </span>
                        <h4 className="text-xs font-bold text-[#111827]">
                          {violation.title}
                        </h4>
                      </div>
                      <p className="text-xs font-medium text-slate-800 mt-1">
                        {violation.message}
                      </p>
                      {violation.details && (
                        <p className="text-[11px] text-[#6b7280] mt-0.5 font-mono">
                          {violation.details}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  {violation.requirementId && (
                    <button
                      type="button"
                      onClick={() => onInspectShift(violation.requirementId!)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-white border border-[#e5e7eb] hover:bg-[#f9fafb] text-[#111827] shadow-xs shrink-0 self-start sm:self-center cursor-pointer transition-colors"
                    >
                      <span>{t(lang, 'resolveAction')}</span>
                      <ExternalLink className="w-3 h-3 text-[#6b7280]" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
