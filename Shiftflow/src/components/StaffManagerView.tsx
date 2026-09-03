import React, { useState } from 'react';
import {
  UserPlus,
  Trash2,
  Edit2,
  Check,
  X,
  Clock,
  Briefcase,
  Sun,
  Sunset,
  Sparkles,
} from 'lucide-react';
import { DayOfWeek, DAYS_OF_WEEK, Employee, Language, ShiftPreference } from '../types';
import { DAY_LABELS } from '../utils/time';
import { t } from '../i18n/translations';

interface StaffManagerViewProps {
  employees: Employee[];
  lang: Language;
  onAddEmployee: (emp: Employee) => void;
  onUpdateEmployee: (emp: Employee) => void;
  onDeleteEmployee: (employeeId: string) => void;
}

export const StaffManagerView: React.FC<StaffManagerViewProps> = ({
  employees,
  lang,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [maxHours, setMaxHours] = useState(40);
  const [minHours, setMinHours] = useState(0);
  const [preference, setPreference] = useState<ShiftPreference>('any');
  const [availability, setAvailability] = useState<Employee['availability']>({
    monday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
    tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
    wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
    thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
    friday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
    saturday: { isAvailable: false, intervals: [] },
    sunday: { isAvailable: false, intervals: [] },
  });

  const handleOpenAdd = () => {
    setEditingEmpId(null);
    setName('');
    setRole('Staff Associate');
    setMaxHours(35);
    setMinHours(0);
    setPreference('morning');
    setAvailability({
      monday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
      tuesday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
      wednesday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
      thursday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
      friday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
      saturday: { isAvailable: false, intervals: [] },
      sunday: { isAvailable: false, intervals: [] },
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmpId(emp.id);
    setName(emp.name);
    setRole(emp.role);
    setMaxHours(emp.maxWeeklyHours);
    setMinHours(emp.minWeeklyHours || 0);
    setPreference(emp.preference);
    setAvailability(JSON.parse(JSON.stringify(emp.availability)));
    setIsEditing(true);
  };

  const handleToggleDay = (day: DayOfWeek) => {
    setAvailability(prev => {
      const current = prev[day];
      const isNowAvailable = !current?.isAvailable;
      return {
        ...prev,
        [day]: {
          isAvailable: isNowAvailable,
          intervals: isNowAvailable ? [{ start: '09:00', end: '17:00' }] : [],
        },
      };
    });
  };

  const handleTimeChange = (day: DayOfWeek, field: 'start' | 'end', val: string) => {
    setAvailability(prev => {
      const current = prev[day];
      const intervals = [...(current?.intervals || [])];
      if (intervals.length === 0) {
        intervals.push({ start: '09:00', end: '17:00' });
      }
      intervals[0] = {
        ...intervals[0],
        [field]: val,
      };
      return {
        ...prev,
        [day]: {
          isAvailable: true,
          intervals,
        },
      };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6', '#f97316'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    if (editingEmpId) {
      const existing = employees.find(e => e.id === editingEmpId);
      const updated: Employee = {
        id: editingEmpId,
        name: name.trim(),
        role: role.trim() || 'Staff',
        maxWeeklyHours: Number(maxHours),
        minWeeklyHours: minHours > 0 ? Number(minHours) : undefined,
        preference,
        availability,
        color: existing?.color || randomColor,
      };
      onUpdateEmployee(updated);
    } else {
      const created: Employee = {
        id: `emp-${Date.now()}`,
        name: name.trim(),
        role: role.trim() || 'Staff',
        maxWeeklyHours: Number(maxHours),
        minWeeklyHours: minHours > 0 ? Number(minHours) : undefined,
        preference,
        availability,
        color: randomColor,
      };
      onAddEmployee(created);
    }

    setIsEditing(false);
  };

  return (
    <div className="space-y-3">
      {/* Header and Add button */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="font-serif italic text-lg text-[#111827]">
            {t(lang, 'tabEmployees')} ({employees.length})
          </h3>
          <p className="text-xs text-[#6b7280] mt-0.5">
            {lang === 'es'
              ? 'Configuración de disponibilidad diaria, límite legal de horas y preferencias de turno.'
              : 'Configure contract hours, day-by-day availability intervals, and shift preferences.'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#111827] hover:bg-black shadow-xs cursor-pointer transition-colors shrink-0 uppercase tracking-wider font-mono text-[11px]"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>{t(lang, 'addEmployee')}</span>
        </button>
      </div>

      {/* Editor Drawer / Form */}
      {isEditing && (
        <div className="bg-white border-2 border-[#111827] rounded-lg p-4 sm:p-5 shadow-md">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e5e7eb]">
            <h4 className="font-serif italic text-base font-bold text-[#111827]">
              {editingEmpId ? t(lang, 'editEmployee') : t(lang, 'addEmployee')}
            </h4>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[#6b7280] hover:text-[#111827] p-1 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                  {t(lang, 'nameField')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Ana Morales"
                  className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-md focus:border-[#111827] focus:outline-hidden text-xs text-[#111827]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                  {t(lang, 'roleField')} *
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g. Shift Supervisor, Barista, Sales"
                  className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-md focus:border-[#111827] focus:outline-hidden text-xs text-[#111827]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                  {t(lang, 'maxHoursField')}
                </label>
                <input
                  type="number"
                  min="4"
                  max="60"
                  required
                  value={maxHours}
                  onChange={e => setMaxHours(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-md focus:border-[#111827] focus:outline-hidden font-mono text-xs text-[#111827]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111827] uppercase tracking-wider text-[10px] font-mono mb-1">
                  {t(lang, 'preference')}
                </label>
                <select
                  value={preference}
                  onChange={e => setPreference(e.target.value as ShiftPreference)}
                  className="w-full px-3 py-1.5 border border-[#e5e7eb] rounded-md focus:border-[#111827] focus:outline-hidden text-xs text-[#111827]"
                >
                  <option value="morning">{t(lang, 'prefMorning')}</option>
                  <option value="afternoon">{t(lang, 'prefAfternoon')}</option>
                  <option value="any">{t(lang, 'prefAny')}</option>
                </select>
              </div>
            </div>

            {/* Day Availability Grid */}
            <div className="pt-3 border-t border-[#e5e7eb]">
              <label className="block font-bold text-[10px] font-mono uppercase tracking-wider text-[#6b7280] mb-2">
                {t(lang, 'availabilityConfig')}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2">
                {DAYS_OF_WEEK.map(day => {
                  const dayAvail = availability[day] || { isAvailable: false, intervals: [] };
                  const interval = dayAvail.intervals[0] || { start: '09:00', end: '17:00' };

                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-lg border text-xs ${
                        dayAvail.isAvailable
                          ? 'bg-[#eff6ff]/60 border-blue-200'
                          : 'bg-[#f8f9fa] border-[#e5e7eb] opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-[#111827] font-mono text-[11px]">
                          {DAY_LABELS[lang][day].short}
                        </span>
                        <input
                          type="checkbox"
                          checked={dayAvail.isAvailable}
                          onChange={() => handleToggleDay(day)}
                          className="rounded text-[#111827] focus:ring-[#111827] cursor-pointer"
                        />
                      </div>

                      {dayAvail.isAvailable ? (
                        <div className="space-y-1 font-mono text-[10px]">
                          <div>
                            <span className="text-[9px] text-[#6b7280] block font-mono">{t(lang, 'from')}</span>
                            <input
                              type="time"
                              value={interval.start}
                              onChange={e => handleTimeChange(day, 'start', e.target.value)}
                              className="w-full px-1.5 py-0.5 border border-[#e5e7eb] rounded bg-white text-[10px]"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-[#6b7280] block font-mono">{t(lang, 'to')}</span>
                            <input
                              type="time"
                              value={interval.end}
                              onChange={e => handleTimeChange(day, 'end', e.target.value)}
                              className="w-full px-1.5 py-0.5 border border-[#e5e7eb] rounded bg-white text-[10px]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#9ca3af] italic py-2 text-center font-mono">
                          {t(lang, 'unavailable')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
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
                <span>{t(lang, 'saveStaff')}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employees Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {employees.map(emp => {
          return (
            <div
              key={emp.id}
              className="bg-white border border-[#e5e7eb] rounded-lg p-3.5 shadow-xs flex flex-col justify-between hover:border-[#111827] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-[10px] shadow-xs shrink-0 font-mono"
                      style={{ backgroundColor: emp.color || '#111827' }}
                    >
                      {emp.name
                        .split(' ')
                        .map(n => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#111827]">{emp.name}</h4>
                      <p className="text-[10px] text-[#6b7280] font-mono">{emp.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(emp)}
                      className="p-1 text-[#6b7280] hover:text-[#111827] rounded hover:bg-slate-50 cursor-pointer"
                      title={t(lang, 'editEmployee')}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteEmployee(emp.id)}
                      className="p-1 text-[#6b7280] hover:text-rose-600 rounded hover:bg-slate-50 cursor-pointer"
                      title={t(lang, 'deleteStaff')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#f9fafb] p-2 rounded border border-[#e5e7eb]">
                    <span className="text-[9px] text-[#6b7280] block uppercase font-bold font-mono">
                      {t(lang, 'maxHoursField')}
                    </span>
                    <span className="font-bold text-[#111827] font-mono text-xs">
                      {emp.maxWeeklyHours}h
                    </span>
                  </div>

                  <div className="bg-[#f9fafb] p-2 rounded border border-[#e5e7eb]">
                    <span className="text-[9px] text-[#6b7280] block uppercase font-bold font-mono">
                      {t(lang, 'preference')}
                    </span>
                    <span className="font-semibold text-[#111827] capitalize flex items-center gap-1 text-[11px] mt-0.5">
                      {emp.preference === 'morning' ? (
                        <Sun className="w-3 h-3 text-amber-500" />
                      ) : emp.preference === 'afternoon' ? (
                        <Sunset className="w-3 h-3 text-indigo-500" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-[#9ca3af]" />
                      )}
                      <span>
                        {emp.preference === 'morning'
                          ? t(lang, 'prefMorning')
                          : emp.preference === 'afternoon'
                          ? t(lang, 'prefAfternoon')
                          : t(lang, 'prefAny')}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Day-by-Day Availability summary pills */}
                <div className="mt-2.5">
                  <span className="text-[9px] font-bold font-mono uppercase tracking-wider text-[#6b7280] block mb-1">
                    {t(lang, 'available')}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {DAYS_OF_WEEK.map(d => {
                      const avail = emp.availability[d]?.isAvailable;
                      const interval = emp.availability[d]?.intervals[0];
                      return (
                        <span
                          key={d}
                          title={
                            avail && interval
                              ? `${DAY_LABELS[lang][d].full}: ${interval.start}-${interval.end}`
                              : `${DAY_LABELS[lang][d].full}: Unavailable`
                          }
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                            avail
                              ? 'bg-[#f0fdf4] text-[#166534] border border-green-200'
                              : 'bg-slate-100 text-[#9ca3af] border border-slate-200 line-through'
                          }`}
                        >
                          {DAY_LABELS[lang][d].short}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
