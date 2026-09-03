import React from 'react';
import {
  Clock,
  AlertTriangle,
  Sun,
  Sunset,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  DAYS_OF_WEEK,
  Employee,
  EmployeeScheduleSummary,
  Language,
  ShiftAssignment,
} from '../types';
import { DAY_LABELS } from '../utils/time';
import { t } from '../i18n/translations';

interface EmployeeWorkloadViewProps {
  employees: Employee[];
  assignments: ShiftAssignment[];
  summaries: Record<string, EmployeeScheduleSummary>;
  lang: Language;
}

export const EmployeeWorkloadView: React.FC<EmployeeWorkloadViewProps> = ({
  employees,
  assignments,
  summaries,
  lang,
}) => {
  return (
    <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-xs overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-serif italic text-lg text-[#111827]">
            {t(lang, 'tabEmployeeMatrix')}
          </h3>
          <p className="text-xs text-[#6b7280] mt-0.5">
            {lang === 'es'
              ? 'Distribución de carga semanal, límites de horas contratadas y satisfacción de preferencias.'
              : 'Weekly workload distribution, contract hour caps, and shift preference adherence.'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-[#6b7280]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>&lt; 95%</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>95–100%</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>&gt; 100% {lang === 'es' ? '(Exceso)' : '(Overtime)'}</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f9fafb] border-b border-[#e5e7eb] text-[#6b7280] font-mono font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-4 min-w-[170px]">{t(lang, 'employee')}</th>
              <th className="py-2.5 px-3 min-w-[140px]">{t(lang, 'weeklyHours')}</th>
              <th className="py-2.5 px-2 min-w-[85px]">{t(lang, 'preference')}</th>
              {DAYS_OF_WEEK.map(day => (
                <th key={day} className="py-2.5 px-2 text-center min-w-[80px]">
                  {DAY_LABELS[lang][day].short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {employees.map(emp => {
              const summary = summaries[emp.id];
              const assignedHours = summary ? summary.assignedHours : 0;
              const maxHours = emp.maxWeeklyHours;
              const percentage = summary ? summary.percentage : 0;
              const isOver = summary?.isOverLimit;
              const overHours = summary?.overHours || 0;

              // ProgressBar color
              const barColor = isOver
                ? 'bg-rose-500'
                : percentage >= 95
                ? 'bg-blue-600'
                : 'bg-emerald-500';

              const prefIcon =
                emp.preference === 'morning' ? (
                  <Sun className="w-3 h-3 text-amber-500" />
                ) : emp.preference === 'afternoon' ? (
                  <Sunset className="w-3 h-3 text-indigo-500" />
                ) : (
                  <Sparkles className="w-3 h-3 text-[#9ca3af]" />
                );

              return (
                <tr key={emp.id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Employee Identity */}
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-[10px] shadow-xs shrink-0 font-mono"
                        style={{ backgroundColor: emp.color || '#111827' }}
                      >
                        {emp.name
                          .split(' ')
                          .map(n => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-[#111827] truncate text-xs">{emp.name}</div>
                        <div className="text-[10px] text-[#6b7280] truncate font-mono">{emp.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Hours & Progress Bar */}
                  <td className="py-2.5 px-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="font-semibold text-[#111827]">
                          {assignedHours} / {maxHours}h
                        </span>
                        <span
                          className={`text-[10px] font-bold ${
                            isOver ? 'text-rose-600' : 'text-[#6b7280]'
                          }`}
                        >
                          {percentage}%
                        </span>
                      </div>

                      <div className="w-full bg-[#f3f4f6] h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${barColor}`}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>

                      {isOver ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 font-mono">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>{t(lang, 'overLimit', { count: overHours })}</span>
                        </div>
                      ) : percentage === 100 ? (
                        <div className="flex items-center gap-1 text-[10px] font-medium text-[#6b7280]">
                          <CheckCircle2 className="w-2.5 h-2.5 text-blue-500" />
                          <span>{t(lang, 'atCapacity')}</span>
                        </div>
                      ) : null}
                    </div>
                  </td>

                  {/* Shift Preference */}
                  <td className="py-2.5 px-2">
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                      {prefIcon}
                      <span className="capitalize text-[10px]">
                        {emp.preference === 'morning'
                          ? t(lang, 'prefMorning')
                          : emp.preference === 'afternoon'
                          ? t(lang, 'prefAfternoon')
                          : t(lang, 'prefAny')}
                      </span>
                    </div>
                  </td>

                  {/* Day-by-Day Grid Columns */}
                  {DAYS_OF_WEEK.map(day => {
                    const dayAssignments = assignments.filter(
                      a => a.employeeId === emp.id && a.day === day
                    );

                    return (
                      <td key={day} className="py-2 px-1.5 text-center align-middle">
                        {dayAssignments.length === 0 ? (
                          <span className="text-[#9ca3af] font-mono text-xs">—</span>
                        ) : (
                          <div className="space-y-1">
                            {dayAssignments.map(a => (
                              <div
                                key={a.id}
                                className="bg-blue-50 border border-blue-100 text-blue-800 rounded px-1 py-0.5 text-[10px] font-mono font-semibold text-center whitespace-nowrap"
                                title={`${DAY_LABELS[lang][day].full}: ${a.startTime}–${a.endTime}`}
                              >
                                {a.startTime}–{a.endTime}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
