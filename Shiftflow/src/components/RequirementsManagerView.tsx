import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Clock,
  Briefcase,
  Users,
  Check,
  X,
  Edit2,
} from 'lucide-react';
import { CoverageRequirement, DayOfWeek, DAYS_OF_WEEK, Language } from '../types';
import { calculateDurationHours, DAY_LABELS } from '../utils/time';
import { t } from '../i18n/translations';

interface RequirementsManagerViewProps {
  requirements: CoverageRequirement[];
  lang: Language;
  onAddRequirement: (req: CoverageRequirement) => void;
  onUpdateRequirement: (req: CoverageRequirement) => void;
  onDeleteRequirement: (requirementId: string) => void;
}

export const RequirementsManagerView: React.FC<RequirementsManagerViewProps> = ({
  requirements,
  lang,
  onAddRequirement,
  onUpdateRequirement,
  onDeleteRequirement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingReqId, setEditingReqId] = useState<string | null>(null);

  // Form states
  const [day, setDay] = useState<DayOfWeek>('monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [requiredCount, setRequiredCount] = useState(2);
  const [label, setLabel] = useState('');
  const [requiredRole, setRequiredRole] = useState('');

  const handleOpenAdd = () => {
    setEditingReqId(null);
    setDay('monday');
    setStartTime('09:00');
    setEndTime('13:00');
    setRequiredCount(2);
    setLabel('Morning Floor');
    setRequiredRole('');
    setIsEditing(true);
  };

  const handleOpenEdit = (req: CoverageRequirement) => {
    setEditingReqId(req.id);
    setDay(req.day);
    setStartTime(req.startTime);
    setEndTime(req.endTime);
    setRequiredCount(req.requiredEmployees);
    setLabel(req.label || '');
    setRequiredRole(req.requiredRole || '');
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReqId) {
      const updated: CoverageRequirement = {
        id: editingReqId,
        day,
        startTime,
        endTime,
        requiredEmployees: Number(requiredCount),
        label: label.trim() || undefined,
        requiredRole: requiredRole.trim() || undefined,
      };
      onUpdateRequirement(updated);
    } else {
      const created: CoverageRequirement = {
        id: `req-${Date.now()}`,
        day,
        startTime,
        endTime,
        requiredEmployees: Number(requiredCount),
        label: label.trim() || undefined,
        requiredRole: requiredRole.trim() || undefined,
      };
      onAddRequirement(created);
    }
    setIsEditing(false);
  };

  const totalShiftsCount = requirements.reduce((acc, r) => acc + r.requiredEmployees, 0);
  const totalHoursNeeded = requirements.reduce(
    (acc, r) => acc + calculateDurationHours(r.startTime, r.endTime) * r.requiredEmployees,
    0
  );

  return (
    <div className="space-y-3">
      {/* Header and Summary Bar */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-serif italic text-lg text-[#111827]">
            {t(lang, 'tabRequirements')} ({requirements.length} slots • {totalShiftsCount} shifts)
          </h3>
          <p className="text-xs text-[#6b7280] mt-0.5">
            {lang === 'es'
              ? `Demanda total de cobertura semanal: ${totalHoursNeeded.toFixed(1)} horas de personal.`
              : `Total weekly coverage demand: ${totalHoursNeeded.toFixed(1)} staffing hours required.`}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#111827] hover:bg-black shadow-xs cursor-pointer transition-colors shrink-0 uppercase tracking-wider font-mono text-[11px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t(lang, 'addRequirement')}</span>
        </button>
      </div>

      {/* Editing Drawer / Form */}
      {isEditing && (
        <div className="bg-white border-2 border-[#111827] rounded-lg p-4 sm:p-5 shadow-md">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e7eb]">
            <h4 className="font-serif italic text-base font-bold text-[#111827]">
              {editingReqId ? t(lang, 'editRequirement') : t(lang, 'addRequirement')}
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[#6b7280] hover:text-[#111827] p-1 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                  {t(lang, 'selectDay')}
                </label>
                <select
                  value={day}
                  onChange={e => setDay(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-md focus:border-[#111827] focus:outline-hidden text-xs text-[#111827]"
                >
                  {DAYS_OF_WEEK.map(d => (
                    <option key={d} value={d}>
                      {DAY_LABELS[lang][d].full}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                    {t(lang, 'startTime')}
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#e5e7eb] rounded-md font-mono text-xs text-[#111827] focus:border-[#111827] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                    {t(lang, 'endTime')}
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-2 py-1.5 border border-[#e5e7eb] rounded-md font-mono text-xs text-[#111827] focus:border-[#111827] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                  {t(lang, 'requiredHeadcount')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={requiredCount}
                  onChange={e => setRequiredCount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-md font-mono text-xs text-[#111827] focus:border-[#111827] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                  {t(lang, 'slotLabel')}
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. Morning Rush, Floor Closing"
                  className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-md text-xs text-[#111827] focus:border-[#111827] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                  {t(lang, 'requiredRoleFilter')}
                </label>
                <input
                  type="text"
                  value={requiredRole}
                  onChange={e => setRequiredRole(e.target.value)}
                  placeholder="e.g. Shift Supervisor, Barista"
                  className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-md text-xs text-[#111827] focus:border-[#111827] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e5e7eb]">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-semibold text-[#6b7280] hover:text-[#111827] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                {t(lang, 'cancel')}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-[#111827] hover:bg-black rounded-md shadow-xs transition-colors cursor-pointer font-mono uppercase tracking-wider"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{t(lang, 'saveRequirement')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requirements List Grouped by Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {DAYS_OF_WEEK.map(dayOfWeek => {
          const dayReqs = requirements
            .filter(r => r.day === dayOfWeek)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          if (dayReqs.length === 0) return null;

          return (
            <div
              key={dayOfWeek}
              className="bg-white border border-[#e5e7eb] rounded-lg p-3.5 shadow-xs flex flex-col justify-between hover:border-[#111827] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#e5e7eb]">
                  <span className="font-serif italic text-base font-bold text-[#111827]">
                    {DAY_LABELS[lang][dayOfWeek].full}
                  </span>
                  <span className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider font-bold">
                    {dayReqs.length} slots
                  </span>
                </div>

                <div className="mt-2.5 space-y-2">
                  {dayReqs.map(req => {
                    const dur = calculateDurationHours(req.startTime, req.endTime);
                    return (
                      <div
                        key={req.id}
                        className="p-2.5 rounded-md border border-[#e5e7eb] bg-[#f9fafb] hover:bg-white flex items-start justify-between gap-2 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#111827]">
                            <Clock className="w-3 h-3 text-[#6b7280]" />
                            <span>
                              {req.startTime}–{req.endTime}
                            </span>
                            <span className="text-[10px] text-[#6b7280] font-normal">
                              ({dur}h)
                            </span>
                          </div>

                          {req.label && (
                            <div className="text-[11px] font-medium text-[#111827] mt-0.5">
                              {req.label}
                            </div>
                          )}

                          <div className="flex items-center gap-2 mt-1 text-[11px] text-[#6b7280]">
                            <span className="flex items-center gap-0.5 font-semibold text-[#111827] font-mono text-[10px]">
                              <Users className="w-3 h-3 text-[#6b7280]" />
                              {req.requiredEmployees} staff
                            </span>
                            {req.requiredRole && (
                              <span className="inline-flex items-center gap-0.5 text-[#111827] bg-[#f3f4f6] px-1.5 py-0.2 rounded font-medium border border-[#e5e7eb] font-mono text-[9px]">
                                <Briefcase className="w-2.5 h-2.5 text-[#6b7280]" />
                                {req.requiredRole}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(req)}
                            className="p-1 text-[#6b7280] hover:text-[#111827] rounded hover:bg-slate-100 cursor-pointer"
                            title={t(lang, 'editRequirement')}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRequirement(req.id)}
                            className="p-1 text-[#6b7280] hover:text-rose-600 rounded hover:bg-slate-100 cursor-pointer"
                            title={t(lang, 'deleteRequirement')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
