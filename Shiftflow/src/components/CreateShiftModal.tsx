import React, { useState } from 'react';
import { X, Clock, Plus, Briefcase, Users } from 'lucide-react';
import { CoverageRequirement, DayOfWeek, DAYS_OF_WEEK, Employee, Language } from '../types';
import { calculateDurationHours, DAY_LABELS } from '../utils/time';
import { t } from '../i18n/translations';

interface CreateShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDay?: DayOfWeek;
  employees: Employee[];
  lang: Language;
  onAddRequirement: (req: CoverageRequirement) => void;
}

export const CreateShiftModal: React.FC<CreateShiftModalProps> = ({
  isOpen,
  onClose,
  defaultDay = 'monday',
  employees,
  lang,
  onAddRequirement,
}) => {
  const [day, setDay] = useState<DayOfWeek>(defaultDay);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [requiredCount, setRequiredCount] = useState(2);
  const [label, setLabel] = useState('');
  const [requiredRole, setRequiredRole] = useState('');

  // Keep day updated if defaultDay changes
  React.useEffect(() => {
    if (defaultDay) {
      setDay(defaultDay);
    }
  }, [defaultDay]);

  if (!isOpen) return null;

  const duration = calculateDurationHours(startTime, endTime);

  // Collect unique existing roles from employees for easy selection
  const uniqueRoles = Array.from(new Set(employees.map(e => e.role).filter(Boolean)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq: CoverageRequirement = {
      id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      day,
      startTime,
      endTime,
      requiredEmployees: Number(requiredCount),
      label: label.trim() || undefined,
      requiredRole: requiredRole.trim() || undefined,
    };
    onAddRequirement(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl border border-[#e5e7eb] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between">
          <div>
            <h3 className="font-serif italic text-lg text-[#111827]">
              {lang === 'es' ? 'Añadir Nuevo Turno / Horario' : 'Add New Shift Requirement'}
            </h3>
            <p className="text-[11px] font-mono text-[#6b7280] mt-0.5">
              {lang === 'es'
                ? 'Define el horario, día y número de empleados requeridos'
                : 'Define operating hours, target day, and headcount needed'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#6b7280] hover:text-[#111827] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs font-mono">
          {/* Day of Week */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
              {lang === 'es' ? 'Día de la semana' : 'Day of Week'}
            </label>
            <select
              value={day}
              onChange={e => setDay(e.target.value as DayOfWeek)}
              className="w-full py-1.5 px-2 bg-white border border-[#e5e7eb] rounded text-[#111827] font-medium"
            >
              {DAYS_OF_WEEK.map(d => (
                <option key={d} value={d}>
                  {DAY_LABELS[lang][d].full}
                </option>
              ))}
            </select>
          </div>

          {/* Time Window */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
                {lang === 'es' ? 'Hora de Inicio' : 'Start Time'}
              </label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                required
                className="w-full py-1.5 px-2 bg-white border border-[#e5e7eb] rounded text-[#111827] font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
                {lang === 'es' ? 'Hora de Fin' : 'End Time'}
              </label>
              <input
                type="time"
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                required
                className="w-full py-1.5 px-2 bg-white border border-[#e5e7eb] rounded text-[#111827] font-medium"
              />
            </div>
          </div>

          <div className="text-[11px] text-[#6b7280] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {lang === 'es' ? 'Duración del turno' : 'Shift duration'}: {duration}h (
              {(duration * requiredCount).toFixed(1)}h {lang === 'es' ? 'horas-persona' : 'staff-hours'})
            </span>
          </div>

          {/* Required Headcount & Label */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
                {lang === 'es' ? 'Empleados requeridos' : 'Required Headcount'}
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={requiredCount}
                onChange={e => setRequiredCount(Math.max(1, Number(e.target.value)))}
                className="w-full py-1.5 px-2 bg-white border border-[#e5e7eb] rounded text-[#111827] font-medium"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
                {lang === 'es' ? 'Etiqueta de Turno (Opcional)' : 'Shift Label (Optional)'}
              </label>
              <input
                type="text"
                placeholder={lang === 'es' ? 'Ej: Turno Mañana / Cierre' : 'e.g., Morning Rush / Closing'}
                value={label}
                onChange={e => setLabel(e.target.value)}
                className="w-full py-1.5 px-2 bg-white border border-[#e5e7eb] rounded text-[#111827] font-sans text-xs"
              />
            </div>
          </div>

          {/* Role constraint */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b7280] mb-1">
              {lang === 'es' ? 'Puesto Requerido (Opcional)' : 'Required Role (Optional)'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={lang === 'es' ? 'Cualquier puesto o específico' : 'Any role or specific'}
                value={requiredRole}
                onChange={e => setRequiredRole(e.target.value)}
                className="flex-1 py-1.5 px-2 bg-white border border-[#e5e7eb] rounded text-[#111827] font-sans text-xs"
              />
              {uniqueRoles.length > 0 && (
                <select
                  onChange={e => setRequiredRole(e.target.value)}
                  value=""
                  className="py-1.5 px-2 bg-[#f9fafb] border border-[#e5e7eb] rounded text-[#6b7280] text-xs font-sans cursor-pointer"
                >
                  <option value="" disabled>
                    {lang === 'es' ? 'Seleccionar puesto...' : 'Select role...'}
                  </option>
                  {uniqueRoles.map(r => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#e5e7eb] flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#6b7280] hover:text-[#111827] border border-[#e5e7eb] rounded cursor-pointer"
            >
              {t(lang, 'cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-white bg-[#111827] hover:bg-black rounded shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'es' ? 'Guardar Turno' : 'Create Shift'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
