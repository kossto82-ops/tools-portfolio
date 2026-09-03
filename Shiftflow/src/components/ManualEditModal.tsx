import React from 'react';
import {
  X,
  UserPlus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertOctagon,
} from 'lucide-react';
import {
  CoverageRequirement,
  Employee,
  Language,
  ShiftAssignment,
} from '../types';
import {
  checkEmployeeAvailability,
  checkRoleMatch,
  checkShiftOverlap,
  checkShiftPreference,
  calculateEmployeeAssignedHours,
} from '../engine/constraintEngine';
import { calculateDurationHours, DAY_LABELS } from '../utils/time';
import { t } from '../i18n/translations';

interface ManualEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: CoverageRequirement | null;
  employees: Employee[];
  assignments: ShiftAssignment[];
  lang: Language;
  onAssignEmployee: (requirementId: string, employeeId: string) => void;
  onRemoveAssignment: (assignmentId: string) => void;
  onUpdateRequirement?: (req: CoverageRequirement) => void;
  onDeleteRequirement?: (requirementId: string) => void;
}

export const ManualEditModal: React.FC<ManualEditModalProps> = ({
  isOpen,
  onClose,
  requirement,
  employees,
  assignments,
  lang,
  onAssignEmployee,
  onRemoveAssignment,
  onUpdateRequirement,
  onDeleteRequirement,
}) => {
  const [isEditingShift, setIsEditingShift] = React.useState(false);
  const [editStartTime, setEditStartTime] = React.useState('');
  const [editEndTime, setEditEndTime] = React.useState('');
  const [editHeadcount, setEditHeadcount] = React.useState(1);
  const [editLabel, setEditLabel] = React.useState('');
  const [editRole, setEditRole] = React.useState('');

  React.useEffect(() => {
    if (requirement) {
      setEditStartTime(requirement.startTime);
      setEditEndTime(requirement.endTime);
      setEditHeadcount(requirement.requiredEmployees);
      setEditLabel(requirement.label || '');
      setEditRole(requirement.requiredRole || '');
      setIsEditingShift(false);
    }
  }, [requirement]);
  if (!isOpen || !requirement) return null;

  const duration = calculateDurationHours(requirement.startTime, requirement.endTime);
  const slotAssignments = assignments.filter(a => a.requirementId === requirement.id);
  const assignedEmployeeIds = new Set(slotAssignments.map(a => a.employeeId));

  const employeesMap = new Map<string, Employee>(employees.map(e => [e.id, e]));

  // Candidates are all employees not currently assigned to this slot
  const candidateList = employees.map(emp => {
    const isAssigned = assignedEmployeeIds.has(emp.id);
    const currentHours = calculateEmployeeAssignedHours(emp.id, assignments);
    const wouldExceedHours = currentHours + duration > emp.maxWeeklyHours;
    const overHoursAmount = Number((currentHours + duration - emp.maxWeeklyHours).toFixed(1));

    const availCheck = checkEmployeeAvailability(
      emp,
      requirement.day,
      requirement.startTime,
      requirement.endTime
    );

    const overlapCheck = checkShiftOverlap(
      emp.id,
      requirement.day,
      requirement.startTime,
      requirement.endTime,
      assignments
    );

    const roleMatches = checkRoleMatch(emp, requirement.requiredRole);
    const prefCheck = checkShiftPreference(emp, requirement.startTime, requirement.endTime);

    // Potential conflicts if assigned
    const warnings: string[] = [];
    let isHardConflict = false;

    if (!availCheck.isAvailable) {
      warnings.push(availCheck.reason || t(lang, 'candidateUnavailableWarning'));
      isHardConflict = true;
    }

    if (overlapCheck.hasOverlap) {
      warnings.push(t(lang, 'candidateOverlapWarning'));
      isHardConflict = true;
    }

    if (!roleMatches) {
      warnings.push(
        lang === 'es'
          ? `Puesto no coincide (requiere '${requirement.requiredRole}')`
          : `Role mismatch (requires '${requirement.requiredRole}')`
      );
      isHardConflict = true;
    }

    if (wouldExceedHours) {
      warnings.push(
        lang === 'es'
          ? `Superaría el tope semanal (${currentHours}h + ${duration}h > ${emp.maxWeeklyHours}h)`
          : `Would exceed max hours (${currentHours}h + ${duration}h > ${emp.maxWeeklyHours}h)`
      );
      isHardConflict = true;
    }

    return {
      emp,
      isAssigned,
      currentHours,
      wouldExceedHours,
      overHoursAmount,
      warnings,
      isHardConflict,
      prefCheck,
    };
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl border border-[#e5e7eb] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb]">
                {DAY_LABELS[lang][requirement.day].full}
              </span>
              <h3 className="font-serif italic text-lg text-[#111827]">
                {t(lang, 'slotEditorTitle')}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 mt-1 text-xs text-[#6b7280] font-mono">
              <span className="flex items-center gap-1 font-semibold text-[#111827]">
                <Clock className="w-3.5 h-3.5 text-[#6b7280]" />
                {requirement.startTime}–{requirement.endTime} ({duration}h)
              </span>
              <span>•</span>
              <span>
                {lang === 'es' ? 'Necesarios:' : 'Required:'} {requirement.requiredEmployees}{' '}
                {requirement.requiredRole ? `(${requirement.requiredRole})` : ''}
              </span>
              {requirement.label && (
                <>
                  <span>•</span>
                  <span className="italic">{requirement.label}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onUpdateRequirement && (
              <button
                type="button"
                onClick={() => setIsEditingShift(!isEditingShift)}
                className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded border border-[#d1d5db] text-[#111827] bg-white hover:bg-slate-50 cursor-pointer shadow-xs transition-colors"
              >
                {isEditingShift
                  ? lang === 'es'
                    ? 'Cerrar Edición'
                    : 'Cancel Edit'
                  : lang === 'es'
                  ? 'Editar Turno'
                  : 'Edit Shift'}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-[#6b7280] hover:text-[#111827] p-1.5 rounded hover:bg-[#e5e7eb]/60 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Optional Shift Definition Editor */}
        {isEditingShift && onUpdateRequirement && (
          <div className="p-3.5 bg-[#f3f4f6] border-b border-[#e5e7eb] space-y-2.5 font-mono text-xs animate-in fade-in duration-100">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#111827] uppercase tracking-wider text-[11px]">
                {lang === 'es' ? 'Modificar Parámetros de Este Turno' : 'Modify Shift Parameters'}
              </span>
              {onDeleteRequirement && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        lang === 'es'
                          ? '¿Eliminar este turno y sus asignaciones del cuadrante?'
                          : 'Delete this shift and all its schedule assignments?'
                      )
                    ) {
                      onDeleteRequirement(requirement.id);
                      onClose();
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 hover:text-rose-900 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>{lang === 'es' ? 'Eliminar Turno' : 'Delete Shift'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[9px] text-[#6b7280] uppercase">
                  {lang === 'es' ? 'Inicio' : 'Start'}
                </label>
                <input
                  type="time"
                  value={editStartTime}
                  onChange={e => setEditStartTime(e.target.value)}
                  className="w-full py-1 px-1.5 bg-white border border-[#d1d5db] rounded text-[#111827] text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] text-[#6b7280] uppercase">
                  {lang === 'es' ? 'Fin' : 'End'}
                </label>
                <input
                  type="time"
                  value={editEndTime}
                  onChange={e => setEditEndTime(e.target.value)}
                  className="w-full py-1 px-1.5 bg-white border border-[#d1d5db] rounded text-[#111827] text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] text-[#6b7280] uppercase">
                  {lang === 'es' ? 'Plazas' : 'Staff Needed'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={editHeadcount}
                  onChange={e => setEditHeadcount(Math.max(1, Number(e.target.value)))}
                  className="w-full py-1 px-1.5 bg-white border border-[#d1d5db] rounded text-[#111827] text-xs"
                />
              </div>
              <div>
                <label className="block text-[9px] text-[#6b7280] uppercase">
                  {lang === 'es' ? 'Puesto' : 'Role Req.'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'es' ? 'Cualquiera' : 'Any'}
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  className="w-full py-1 px-1.5 bg-white border border-[#d1d5db] rounded text-[#111827] text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <input
                type="text"
                placeholder={lang === 'es' ? 'Etiqueta opcional (ej: Turno Tarde)' : 'Optional label (e.g. Afternoon Floor)'}
                value={editLabel}
                onChange={e => setEditLabel(e.target.value)}
                className="py-1 px-2 bg-white border border-[#d1d5db] rounded text-[#111827] text-xs font-sans max-w-xs w-full"
              />
              <button
                type="button"
                onClick={() => {
                  onUpdateRequirement({
                    ...requirement,
                    startTime: editStartTime,
                    endTime: editEndTime,
                    requiredEmployees: Number(editHeadcount),
                    label: editLabel.trim() || undefined,
                    requiredRole: editRole.trim() || undefined,
                  });
                  setIsEditingShift(false);
                }}
                className="px-3 py-1 bg-[#111827] text-white hover:bg-black rounded font-bold uppercase text-[10px] tracking-wider cursor-pointer shadow-xs"
              >
                {lang === 'es' ? 'Guardar Cambios' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-3.5 sm:p-4 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Currently Assigned Staff */}
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6b7280] mb-2 flex items-center justify-between">
              <span>{t(lang, 'currentlyAssigned')}</span>
              <span className="font-mono text-[#111827]">
                {slotAssignments.length} / {requirement.requiredEmployees}
              </span>
            </h4>

            {slotAssignments.length === 0 ? (
              <div className="p-3 border border-amber-300 rounded-lg bg-amber-50/40 text-amber-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {lang === 'es'
                    ? 'Este turno está completamente descubierto. Asigne candidatos a continuación.'
                    : 'This shift slot is completely unstaffed. Select eligible candidates below.'}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                {slotAssignments.map(asg => {
                  const emp = employeesMap.get(asg.employeeId);
                  if (!emp) return null;

                  const currentHours = calculateEmployeeAssignedHours(emp.id, assignments);
                  const isOver = currentHours > emp.maxWeeklyHours;
                  const avail = checkEmployeeAvailability(
                    emp,
                    requirement.day,
                    requirement.startTime,
                    requirement.endTime
                  );

                  return (
                    <div
                      key={asg.id}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-[#e5e7eb] bg-white shadow-xs hover:border-[#111827] transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full text-white font-bold font-mono flex items-center justify-center text-[10px] shadow-xs shrink-0"
                          style={{ backgroundColor: emp.color || '#111827' }}
                        >
                          {emp.name
                            .split(' ')
                            .map(n => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#111827]">
                              {emp.name}
                            </span>
                            <span className="text-[10px] text-[#6b7280] font-mono">
                              ({emp.role})
                            </span>
                            {asg.isManualOverride && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb]">
                                {t(lang, 'manualOverrideBadge')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#6b7280] font-mono mt-0.5">
                            <span>
                              {currentHours}h / {emp.maxWeeklyHours}h
                            </span>
                            {isOver && (
                              <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                                <AlertOctagon className="w-3 h-3" />
                                +{Number((currentHours - emp.maxWeeklyHours).toFixed(1))}h over
                              </span>
                            )}
                            {!avail.isAvailable && (
                              <span className="text-rose-600 font-semibold flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3" />
                                {avail.reason}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveAssignment(asg.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded border border-rose-200 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{t(lang, 'removeAssignment')}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Available Candidates */}
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6b7280] mb-2">
              {t(lang, 'availableCandidates')}
            </h4>

            <div className="space-y-2">
              {candidateList
                .filter(c => !c.isAssigned)
                .map(({ emp, currentHours, warnings, isHardConflict, prefCheck }) => {
                  return (
                    <div
                      key={emp.id}
                      className={`p-2.5 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 ${
                        isHardConflict
                          ? 'bg-[#f9fafb] border-[#e5e7eb]'
                          : 'bg-white border-[#e5e7eb] hover:border-[#111827] shadow-xs'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full text-white font-bold font-mono flex items-center justify-center text-[10px] shrink-0 mt-0.5"
                          style={{ backgroundColor: emp.color || '#111827' }}
                        >
                          {emp.name
                            .split(' ')
                            .map(n => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#111827]">
                              {emp.name}
                            </span>
                            <span className="text-[10px] text-[#6b7280] font-mono">
                              {emp.role}
                            </span>
                            <span className="text-[10px] text-[#6b7280] font-mono">
                              • {currentHours}/{emp.maxWeeklyHours}h
                            </span>
                          </div>

                          {/* Preference and warning messages */}
                          <div className="mt-1 space-y-0.5">
                            {warnings.length > 0 ? (
                              warnings.map((w, i) => (
                                <div
                                  key={i}
                                  className="text-[10px] font-mono font-semibold text-rose-700 flex items-center gap-1"
                                >
                                  <AlertOctagon className="w-3 h-3 shrink-0" />
                                  <span>{w}</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-[10px] font-mono font-medium text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-600" />
                                <span>{t(lang, 'candidateAvailable')}</span>
                              </div>
                            )}

                            {prefCheck.matches ? (
                              <div className="text-[10px] font-mono text-blue-700">
                                {t(lang, 'candidatePreferenceMatch', { pref: emp.preference })}
                              </div>
                            ) : emp.preference !== 'any' ? (
                              <div className="text-[10px] font-mono text-[#6b7280]">
                                {t(lang, 'candidatePreferenceMismatch', { pref: emp.preference })}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => onAssignEmployee(requirement.id, emp.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 self-start sm:self-center transition-colors cursor-pointer ${
                          isHardConflict
                            ? 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300'
                            : 'text-white bg-[#111827] hover:bg-black shadow-xs'
                        }`}
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>
                          {isHardConflict
                            ? lang === 'es'
                              ? 'Forzar asignación'
                              : 'Override & Assign'
                            : t(lang, 'assignCandidate')}
                        </span>
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#f9fafb] border-t border-[#e5e7eb] flex items-center justify-between">
          <p className="text-[10px] font-mono text-[#6b7280] max-w-sm hidden sm:block">
            {t(lang, 'overrideNotice')}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#111827] bg-white border border-[#e5e7eb] hover:bg-slate-100 rounded transition-colors ml-auto cursor-pointer"
          >
            {t(lang, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
};
