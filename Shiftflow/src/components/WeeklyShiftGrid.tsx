import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  AlertOctagon,
  Clock,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import {
  CoverageItemStatus,
  CoverageRequirement,
  DayOfWeek,
  DAYS_OF_WEEK,
  Employee,
  Language,
  ShiftAssignment,
  ConstraintViolation,
} from '../types';
import { calculateDurationHours, DAY_LABELS } from '../utils/time';
import { t } from '../i18n/translations';

interface WeeklyShiftGridProps {
  requirements: CoverageRequirement[];
  employees: Employee[];
  assignments: ShiftAssignment[];
  coverage: CoverageItemStatus[];
  violations: ConstraintViolation[];
  lang: Language;
  onOpenSlotEditor: (requirementId: string) => void;
  onOpenAddShift?: (day?: DayOfWeek) => void;
}

export const WeeklyShiftGrid: React.FC<WeeklyShiftGridProps> = ({
  requirements,
  employees,
  assignments,
  coverage,
  violations,
  lang,
  onOpenSlotEditor,
  onOpenAddShift,
}) => {
  // Mobile day selector state
  const [activeMobileDay, setActiveMobileDay] = useState<DayOfWeek>('monday');

  const employeesMap = new Map<string, Employee>(employees.map(e => [e.id, e]));
  const coverageMap = new Map<string, CoverageItemStatus>(coverage.map(c => [c.requirementId, c]));

  // Find violations associated with specific employees and assignments
  const employeeHasViolation = (employeeId: string, requirementId: string) => {
    return violations.some(
      v =>
        v.severity === 'hard' &&
        v.employeeId === employeeId &&
        (v.requirementId === requirementId || !v.requirementId)
    );
  };

  const getDayRequirements = (day: DayOfWeek) => {
    return requirements
      .filter(r => r.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const activeMobileIndex = DAYS_OF_WEEK.indexOf(activeMobileDay);
  const handlePrevDay = () => {
    const nextIdx = (activeMobileIndex - 1 + 7) % 7;
    setActiveMobileDay(DAYS_OF_WEEK[nextIdx]);
  };
  const handleNextDay = () => {
    const nextIdx = (activeMobileIndex + 1) % 7;
    setActiveMobileDay(DAYS_OF_WEEK[nextIdx]);
  };

  return (
    <div className="space-y-3">
      {/* Subheader Bar with High Density Typographic Styling */}
      <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-[#e5e7eb] rounded-lg shadow-xs gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-serif italic text-lg sm:text-xl text-[#111827]">
            Weekly Roster:{' '}
            <span className="font-sans not-italic font-bold text-xs sm:text-sm text-[#6b7280]">
              Operational Cycle
            </span>
          </h2>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-[#eff6ff] text-[#1d4ed8] text-[10px] font-bold font-mono rounded uppercase border border-blue-200">
              {employees.length} {lang === 'es' ? 'Empleados' : 'Employees'}
            </span>
            <span className="px-2 py-0.5 bg-[#f0fdf4] text-[#166534] text-[10px] font-bold font-mono rounded uppercase border border-green-200">
              {coverage.every(c => c.isFullyCovered) ? (lang === 'es' ? '100% Cubierto' : 'Operational') : (lang === 'es' ? 'Ajustes Requeridos' : 'Deficit Alert')}
            </span>
          </div>
        </div>

        <div className="text-[11px] text-[#6b7280] font-mono">
          {requirements.length} {lang === 'es' ? 'requisitos de cobertura' : 'coverage requirements'}
        </div>
      </div>

      {/* Mobile Day Navigation Bar (visible < lg) */}
      <div className="lg:hidden bg-white border border-[#e5e7eb] rounded-lg p-2.5 flex items-center justify-between shadow-xs">
        <button
          type="button"
          onClick={handlePrevDay}
          className="p-1.5 rounded-md text-[#6b7280] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="text-center">
          <div className="text-sm font-bold text-[#111827]">
            {DAY_LABELS[lang][activeMobileDay].full}
          </div>
          <div className="text-[10px] text-[#6b7280] font-mono">
            {getDayRequirements(activeMobileDay).length} {lang === 'es' ? 'turnos' : 'shifts'}
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextDay}
          className="p-1.5 rounded-md text-[#6b7280] hover:text-[#111827] hover:bg-slate-100 cursor-pointer"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2">
        {/* Desktop 7-Column Layout */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-3 w-full min-w-[1020px]">
          {DAYS_OF_WEEK.map(day => {
            const dayReqs = getDayRequirements(day);
            const dayCoverageItems = dayReqs.map(r => coverageMap.get(r.id)).filter(Boolean);
            const dayDeficit = dayCoverageItems.reduce((acc, c) => acc + (c?.deficit || 0), 0);

            return (
              <div
                key={day}
                className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-lg flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="bg-white p-2.5 border-b border-[#e5e7eb] rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#6b7280] uppercase tracking-wider font-mono">
                      {DAY_LABELS[lang][day].short}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {dayDeficit > 0 ? (
                        <span className="inline-flex items-center text-[10px] font-bold font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          -{dayDeficit}
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-[10px] text-[#9ca3af] font-mono">
                          {dayReqs.length} reqs
                        </span>
                      )}
                      {onOpenAddShift && (
                        <button
                          type="button"
                          onClick={() => onOpenAddShift(day)}
                          title={lang === 'es' ? `Añadir turno a ${DAY_LABELS[lang][day].full}` : `Add shift to ${DAY_LABELS[lang][day].full}`}
                          className="p-0.5 rounded text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-xs font-bold text-[#111827] mt-0.5">
                    {DAY_LABELS[lang][day].full}
                  </div>
                </div>

                {/* Shifts List for Day */}
                <div className="p-2 space-y-2 flex-1">
                  {dayReqs.length === 0 ? (
                    <div className="h-28 flex flex-col items-center justify-center text-center p-3 text-[11px] text-[#9ca3af] border border-dashed border-[#e5e7eb] rounded-md font-mono gap-1.5">
                      <span>{t(lang, 'noShiftsForDay')}</span>
                      {onOpenAddShift && (
                        <button
                          type="button"
                          onClick={() => onOpenAddShift(day)}
                          className="text-[10px] text-[#111827] font-bold hover:underline cursor-pointer"
                        >
                          {lang === 'es' ? '+ Añadir turno' : '+ Add shift'}
                        </button>
                      )}
                    </div>
                  ) : (
                    dayReqs.map(req => {
                      const cov = coverageMap.get(req.id);
                      const slotAssignments = assignments.filter(a => a.requirementId === req.id);
                      const duration = calculateDurationHours(req.startTime, req.endTime);
                      const isCovered = cov?.isFullyCovered;
                      const isUnder = cov?.isUnderstaffed;

                      return (
                        <div
                          key={req.id}
                          onClick={() => onOpenSlotEditor(req.id)}
                          className={`group bg-white border rounded-md p-2.5 transition-all shadow-xs hover:border-[#111827] hover:shadow-sm cursor-pointer flex flex-col justify-between ${
                            isUnder
                              ? 'border-amber-300 bg-amber-50/15'
                              : 'border-[#e5e7eb]'
                          }`}
                        >
                          <div>
                            {/* Shift Header: Line 1 - Time Interval & Status Badge */}
                            <div className="flex items-center justify-between gap-1.5 mb-1">
                              <div className="flex items-center gap-1 min-w-0">
                                <Clock className="w-3 h-3 text-[#9ca3af] shrink-0" />
                                <span className="font-mono text-xs font-bold text-[#111827] whitespace-nowrap tracking-tight">
                                  {req.startTime}–{req.endTime}
                                </span>
                              </div>

                              {/* Coverage Status Badge */}
                              {isUnder ? (
                                <span
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-100 text-amber-900 border border-amber-300 shrink-0 whitespace-nowrap"
                                  title={lang === 'es' ? 'Turno con plazas vacantes' : 'Understaffed shift'}
                                >
                                  <AlertTriangle className="w-2.5 h-2.5 text-amber-700 shrink-0" />
                                  <span>{cov?.assigned}/{cov?.required}</span>
                                </span>
                              ) : (
                                <span
                                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 shrink-0 whitespace-nowrap"
                                  title={lang === 'es' ? 'Turno completamente cubierto' : 'Fully covered shift'}
                                >
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                                  <span>{cov?.assigned}/{cov?.required}</span>
                                </span>
                              )}
                            </div>

                            {/* Shift Header: Line 2 - Label & Duration */}
                            <div className="flex items-center justify-between gap-1 text-[10px] mb-1.5">
                              <span
                                className="font-medium text-[#4b5563] truncate leading-tight"
                                title={req.label || (lang === 'es' ? 'Turno' : 'Shift')}
                              >
                                {req.label || (lang === 'es' ? 'Turno general' : 'General shift')}
                              </span>
                              <span className="font-mono text-[#9ca3af] shrink-0 font-medium">
                                {duration}h
                              </span>
                            </div>

                            {/* Shift Header: Line 3 - Role Tag if present */}
                            {req.requiredRole && (
                              <div className="mb-2">
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono font-semibold uppercase tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                  <Briefcase className="w-2.5 h-2.5 shrink-0 text-slate-500" />
                                  <span className="truncate max-w-[110px]">{req.requiredRole}</span>
                                </span>
                              </div>
                            )}

                            {/* Assigned Employees List */}
                            <div className="space-y-1">
                              {slotAssignments.map(asg => {
                                const emp = employeesMap.get(asg.employeeId);
                                if (!emp) return null;
                                const hasConflict = employeeHasViolation(emp.id, req.id);

                                return (
                                  <div
                                    key={asg.id}
                                    className={`flex items-center justify-between px-1.5 py-1 rounded text-[11px] border transition-colors ${
                                      hasConflict
                                        ? 'bg-rose-50 border-rose-300 text-rose-900 ring-1 ring-rose-400'
                                        : asg.isManualOverride
                                        ? 'bg-slate-100 border-[#d1d5db] text-[#111827]'
                                        : 'bg-blue-50/70 border-blue-200/80 text-blue-900'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 truncate min-w-0">
                                      <span
                                        className="w-2 h-2 rounded-full shrink-0"
                                        style={{ backgroundColor: emp.color || '#111827' }}
                                      />
                                      <span className="font-semibold truncate">{emp.name}</span>
                                      {asg.isManualOverride && (
                                        <span
                                          className="text-[9px] font-bold text-indigo-700 uppercase shrink-0"
                                          title={t(lang, 'manualOverrideBadge')}
                                        >
                                          *
                                        </span>
                                      )}
                                    </div>

                                    {hasConflict && (
                                      <AlertOctagon
                                        className="w-3.5 h-3.5 text-rose-600 shrink-0 ml-1"
                                        title={lang === 'es' ? 'Infracción detectada en este turno' : 'Constraint violation detected on this shift'}
                                      />
                                    )}
                                  </div>
                                );
                              })}

                              {/* Unassigned placeholder slots */}
                              {Array.from({
                                length: Math.max(0, req.requiredEmployees - slotAssignments.length),
                              }).map((_, idx) => (
                                <div
                                  key={`empty-${idx}`}
                                  className="flex items-center justify-between px-1.5 py-1 rounded text-[10px] border border-dashed border-amber-300 bg-amber-50/40 text-amber-800"
                                >
                                  <span className="italic font-mono truncate">{t(lang, 'unassignedSlot')}</span>
                                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0 ml-1" />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer Action */}
                          <div className="mt-2.5 pt-1.5 border-t border-[#f3f4f6] flex items-center justify-between text-[10px] font-mono">
                            <span className="text-[#9ca3af] group-hover:text-[#6b7280] transition-colors">
                              {slotAssignments.length}/{req.requiredEmployees} {lang === 'es' ? 'pers.' : 'staff'}
                            </span>
                            <span className="inline-flex items-center gap-1 font-bold text-[#111827] group-hover:text-blue-700 transition-colors uppercase tracking-wider">
                              <UserPlus className="w-3 h-3" />
                              <span>{lang === 'es' ? 'Gestionar' : 'Manage'}</span>
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  {dayReqs.length > 0 && onOpenAddShift && (
                    <button
                      type="button"
                      onClick={() => onOpenAddShift(day)}
                      className="w-full mt-1.5 py-1 text-[10px] font-mono text-[#6b7280] hover:text-[#111827] hover:bg-white border border-dashed border-[#d1d5db] rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lang === 'es' ? 'Añadir Turno' : 'Add Shift'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* High-Density Coverage Analysis Bottom Bar */}
        <div className="hidden lg:grid lg:grid-cols-7 gap-3 w-full min-w-[1020px] mt-2.5">
          <div className="col-span-7 bg-[#111827] text-white rounded-lg p-2.5 border border-slate-800 shadow-xs">
            <div className="grid grid-cols-[140px_repeat(7,1fr)] items-center">
              <div className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-300 pl-2">
                Coverage Analysis
              </div>
              {DAYS_OF_WEEK.map(day => {
                const dayReqs = getDayRequirements(day);
                const reqTotal = dayReqs.reduce((acc, r) => acc + r.requiredEmployees, 0);
                const actTotal = dayReqs.reduce((acc, r) => {
                  const cov = coverageMap.get(r.id);
                  return acc + (cov?.assigned || 0);
                }, 0);
                const isMet = actTotal >= reqTotal;

                return (
                  <div key={day} className={`text-center py-1 px-1 rounded ${!isMet ? 'border border-red-500 bg-red-950/40' : ''}`}>
                    <div className="text-[9px] font-mono text-slate-400">REQ: {reqTotal}</div>
                    <div className={`text-[10px] font-bold font-mono ${isMet ? 'text-green-400' : 'text-red-400'}`}>
                      ACT: {actTotal}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile Single-Day View (visible < lg) */}
        <div className="lg:hidden space-y-2.5">
          {getDayRequirements(activeMobileDay).map(req => {
            const cov = coverageMap.get(req.id);
            const slotAssignments = assignments.filter(a => a.requirementId === req.id);
            const duration = calculateDurationHours(req.startTime, req.endTime);
            const isUnder = cov?.isUnderstaffed;

            return (
              <div
                key={req.id}
                onClick={() => onOpenSlotEditor(req.id)}
                className={`bg-white border rounded-lg p-3 shadow-xs cursor-pointer hover:border-[#111827] transition-all ${
                  isUnder ? 'border-amber-300 bg-amber-50/20' : 'border-[#e5e7eb]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-[#111827] font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#9ca3af] shrink-0" />
                      <span className="whitespace-nowrap">
                        {req.startTime}–{req.endTime}
                      </span>
                      <span className="text-xs text-[#6b7280] font-normal">({duration}h)</span>
                    </div>
                    {req.label && <div className="text-xs font-semibold text-slate-700 mt-0.5">{req.label}</div>}
                    {req.requiredRole && (
                      <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded mt-1 border border-slate-200 font-mono">
                        <Briefcase className="w-3 h-3 text-slate-500" />
                        <span>{req.requiredRole}</span>
                      </div>
                    )}
                  </div>

                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold font-mono shrink-0 whitespace-nowrap ${
                      isUnder
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {cov?.assigned}/{cov?.required}
                  </span>
                </div>

                {/* Assigned employees */}
                <div className="mt-2.5 space-y-1.5">
                  {slotAssignments.map(asg => {
                    const emp = employeesMap.get(asg.employeeId);
                    if (!emp) return null;
                    const hasConflict = employeeHasViolation(emp.id, req.id);

                    return (
                      <div
                        key={asg.id}
                        className={`flex items-center justify-between p-2 rounded text-xs border ${
                          hasConflict
                            ? 'bg-red-50/50 border-red-300 text-red-900 ring-1 ring-red-400'
                            : asg.isManualOverride
                            ? 'bg-slate-100 border-[#d1d5db] text-[#111827]'
                            : 'bg-blue-50/70 border-blue-200/80 text-blue-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: emp.color || '#111827' }}
                          />
                          <span className="font-semibold">{emp.name}</span>
                          <span className="text-[#6b7280] text-[11px]">({emp.role})</span>
                        </div>
                        {hasConflict && <AlertOctagon className="w-4 h-4 text-rose-600" />}
                      </div>
                    );
                  })}

                  {Array.from({
                    length: Math.max(0, req.requiredEmployees - slotAssignments.length),
                  }).map((_, idx) => (
                    <div
                      key={`empty-m-${idx}`}
                      className="flex items-center justify-between p-2 rounded text-xs border border-dashed border-amber-300 bg-amber-50/40 text-amber-800"
                    >
                      <span className="italic font-mono">{t(lang, 'unassignedSlot')}</span>
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#f3f4f6] flex justify-end">
                  <button
                    type="button"
                    onClick={() => onOpenSlotEditor(req.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111827] hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{lang === 'es' ? 'Modificar asignación' : 'Modify assignments'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
