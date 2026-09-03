import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  CoverageRequirement,
  Language,
  SlotAssignmentReasoning,
} from '../types';
import { DAY_LABELS } from '../utils/time';
import { t } from '../i18n/translations';

interface AlgorithmTransparencyViewProps {
  reasoningList: SlotAssignmentReasoning[];
  requirements: CoverageRequirement[];
  lang: Language;
}

export const AlgorithmTransparencyView: React.FC<AlgorithmTransparencyViewProps> = ({
  reasoningList,
  requirements,
  lang,
}) => {
  const [selectedReqId, setSelectedReqId] = useState<string>(
    reasoningList[0]?.requirementId || requirements[0]?.id || ''
  );

  const selectedReasoning = reasoningList.find(r => r.requirementId === selectedReqId);
  const selectedRequirement = requirements.find(r => r.id === selectedReqId);

  return (
    <div className="space-y-3">
      {/* Overview Card */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg p-3.5 sm:p-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-[#f3f4f6] text-[#111827] shrink-0 border border-[#e5e7eb]">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif italic text-lg text-[#111827]">
              {t(lang, 'transparencyHeading')}
            </h3>
            <p className="text-xs text-[#6b7280] mt-1 leading-relaxed">
              {t(lang, 'transparencyIntro')}
            </p>
          </div>
        </div>

        {/* Priority Hierarchy and Formula */}
        <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#e5e7eb] text-xs">
          <div className="bg-[#f9fafb] p-3 rounded-lg border border-[#e5e7eb]">
            <h4 className="font-bold text-[#111827] flex items-center gap-1.5 mb-2 font-mono text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#111827]" />
              <span>{t(lang, 'priorityTitle')}</span>
            </h4>
            <ul className="space-y-1 text-[#374151] text-[11px] leading-snug">
              <li className="font-semibold text-[#111827]">{t(lang, 'p1')}</li>
              <li className="font-medium text-[#1f2937]">{t(lang, 'p2')}</li>
              <li className="font-medium text-[#1f2937]">{t(lang, 'p3')}</li>
              <li className="font-medium text-[#1f2937]">{t(lang, 'p4')}</li>
              <li className="text-[#6b7280]">{t(lang, 'p5')}</li>
              <li className="text-[#6b7280]">{t(lang, 'p6')}</li>
              <li className="text-[#6b7280]">{t(lang, 'p7')}</li>
            </ul>
          </div>

          <div className="bg-[#f9fafb] p-3 rounded-lg border border-[#e5e7eb]">
            <h4 className="font-bold text-[#111827] flex items-center gap-1.5 mb-2 font-mono text-[11px] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{t(lang, 'scoringFormulaTitle')}</span>
            </h4>
            <p className="font-mono text-[10px] text-[#111827] bg-white p-2 rounded border border-[#e5e7eb] leading-relaxed">
              Score = +100 (Coverage) + 35 (Shift Pref) + 0..30 (Available Hours Deficit) + 10 (Role Match) - 10 (Consecutive Shift Fatigue)
            </p>
            <p className="text-[11px] text-[#6b7280] mt-2 leading-snug">
              {t(lang, 'scoringFormulaDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Slot-by-Slot Audit Section */}
      <div className="bg-white border border-[#e5e7eb] rounded-lg shadow-xs overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-[#e5e7eb] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h4 className="font-serif italic text-base font-bold text-[#111827]">
              {t(lang, 'slotAuditHeading')}
            </h4>
            <p className="text-xs text-[#6b7280] mt-0.5">
              {lang === 'es'
                ? 'Inspeccione exactamente por qué el algoritmo asignó a un empleado y por qué otros fueron descartados.'
                : 'Inspect exactly why specific candidates were assigned and why others were disqualified or ranked lower.'}
            </p>
          </div>

          {/* Slot Selector */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6b7280]">
              {lang === 'es' ? 'Turno:' : 'Slot:'}
            </label>
            <select
              value={selectedReqId}
              onChange={e => setSelectedReqId(e.target.value)}
              className="text-xs px-2.5 py-1.5 border border-[#e5e7eb] rounded-md font-mono font-medium focus:border-[#111827] focus:outline-hidden max-w-[260px] text-[#111827]"
            >
              {requirements.map(req => (
                <option key={req.id} value={req.id}>
                  {DAY_LABELS[lang][req.day].short} {req.startTime}–{req.endTime}{' '}
                  {req.label ? `(${req.label})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedRequirement && selectedReasoning ? (
          <div className="p-3 sm:p-4 space-y-3.5">
            {/* Slot Banner */}
            <div className="bg-[#f9fafb] p-3 rounded-lg border border-[#e5e7eb] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded font-mono font-bold uppercase text-[10px] bg-[#f3f4f6] text-[#111827] border border-[#e5e7eb]">
                  {DAY_LABELS[lang][selectedRequirement.day].full}
                </span>
                <span className="font-mono font-bold text-[#111827] text-xs">
                  {selectedRequirement.startTime}–{selectedRequirement.endTime}
                </span>
                {selectedRequirement.label && (
                  <span className="text-[#6b7280] italic text-xs">
                    {selectedRequirement.label}
                  </span>
                )}
                {selectedRequirement.requiredRole && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-white text-[#111827] font-mono border border-[#e5e7eb]">
                    Role: {selectedRequirement.requiredRole}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#6b7280]">
                  {lang === 'es' ? 'Asignados:' : 'Assigned:'}{' '}
                  <span className="font-bold text-[#111827]">
                    {selectedReasoning.assignedEmployees.length} / {selectedReasoning.requiredCount}
                  </span>
                </span>
              </div>
            </div>

            {/* Why Assigned */}
            <div>
              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t(lang, 'whyAssigned')}</span>
              </h5>

              {selectedReasoning.assignedEmployees.length === 0 ? (
                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  {lang === 'es'
                    ? 'Ningún empleado pudo ser asignado automáticamente debido a restricciones de disponibilidad o horas máximas.'
                    : 'No candidate could be assigned automatically due to strict availability or maximum weekly hours.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedReasoning.assignedEmployees.map((asg, i) => (
                    <div
                      key={i}
                      className="p-3 bg-[#f0fdf4] border border-green-200 rounded-lg text-xs flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#111827]">{asg.name}</span>
                        <span className="font-mono font-bold text-emerald-800 text-[11px]">
                          Score: {asg.score}
                        </span>
                      </div>
                      <div className="mt-1 space-y-0.5">
                        {asg.reasons.map((r, ri) => (
                          <div key={ri} className="text-[11px] text-[#374151] flex items-center gap-1">
                            <span className="text-emerald-600">✓</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Why Disqualified / Lower Score */}
            <div>
              <h5 className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6b7280] mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#6b7280]" />
                <span>{t(lang, 'whyNotAssigned')}</span>
              </h5>

              <div className="space-y-1.5">
                {selectedReasoning.candidatesEvaluated
                  .filter(c => !selectedReasoning.assignedEmployees.some(a => a.employeeId === c.employeeId))
                  .map(candidate => {
                    const isDisqualified = !candidate.eligible;
                    return (
                      <div
                        key={candidate.employeeId}
                        className={`p-2 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                          isDisqualified
                            ? 'bg-[#f9fafb] border-[#e5e7eb] text-[#6b7280]'
                            : 'bg-white border-[#e5e7eb] text-[#111827]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isDisqualified ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span className="font-semibold text-[#111827]">
                            {candidate.employeeName}
                          </span>
                        </div>

                        <div className="text-[11px]">
                          {isDisqualified ? (
                            <span className="text-rose-700 font-medium font-mono text-[10px]">
                              {candidate.disqualificationReasons.join('; ')}
                            </span>
                          ) : (
                            <span className="text-[#6b7280] font-mono text-[10px]">
                              Eligible • Score: {candidate.score} (Ranked lower than assigned candidate)
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Bottleneck Reason if Understaffed */}
            {selectedReasoning.unfulfilledCount > 0 && selectedReasoning.bottleneckReason && (
              <div className="p-3 bg-red-50/25 border border-red-200 ring-1 ring-red-300 rounded-lg text-xs text-red-900 flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block font-mono uppercase tracking-wider text-[10px]">
                    {lang === 'es' ? 'Causa del déficit de personal:' : 'Staffing Bottleneck Cause:'}
                  </span>
                  <span className="text-[11px] text-rose-700">
                    {selectedReasoning.bottleneckReason}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-[#6b7280] font-mono">
            {lang === 'es' ? 'Seleccione un turno para auditar.' : 'Select a slot to audit.'}
          </div>
        )}
      </div>
    </div>
  );
};
