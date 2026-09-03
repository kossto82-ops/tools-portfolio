import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import {
  CoverageRequirement,
  Employee,
  EmployeeScheduleSummary,
  Language,
  ScheduleQuality,
  ShiftAssignment,
} from '../types';
import { downloadCsvFile, generateScheduleCsv } from '../utils/export';
import { calculateDurationHours, DAY_LABELS } from '../utils/time';
import { t } from '../i18n/translations';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requirements: CoverageRequirement[];
  employees: Employee[];
  assignments: ShiftAssignment[];
  employeeSummaries: Record<string, EmployeeScheduleSummary>;
  quality: ScheduleQuality;
  lang: Language;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  requirements,
  employees,
  assignments,
  employeeSummaries,
  quality,
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const csvContent = generateScheduleCsv(
    requirements,
    employees,
    assignments,
    employeeSummaries,
    lang
  );

  const handleDownloadCsv = () => {
    const filename = `ShiftFlow_Roster_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsvFile(filename, csvContent);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCsv = () => {
    navigator.clipboard.writeText(csvContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl border border-[#e5e7eb] w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-4 border-b border-[#e5e7eb] bg-[#f9fafb] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#111827]" />
            <h3 className="font-serif italic text-lg text-[#111827]">
              {t(lang, 'exportSchedule')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6b7280] hover:text-[#111827] p-1.5 rounded hover:bg-[#e5e7eb]/60 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-3.5 sm:p-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
          {/* Quick Summary Stats */}
          <div className="grid grid-cols-3 gap-2.5 p-3 bg-[#f9fafb] border border-[#e5e7eb] rounded-lg text-xs font-mono text-center">
            <div>
              <span className="text-[#6b7280] text-[10px] block uppercase font-mono font-bold tracking-wider">
                {t(lang, 'coverageLabel')}
              </span>
              <span className="text-base font-bold text-[#111827]">
                {quality.coveragePercentage}%
              </span>
            </div>
            <div>
              <span className="text-[#6b7280] text-[10px] block uppercase font-mono font-bold tracking-wider">
                {t(lang, 'totalHoursLabel')}
              </span>
              <span className="text-base font-bold text-[#111827]">
                {quality.totalScheduledHours}h
              </span>
            </div>
            <div>
              <span className="text-[#6b7280] text-[10px] block uppercase font-mono font-bold tracking-wider">
                Hard Violations
              </span>
              <span
                className={`text-base font-bold ${
                  quality.hardViolationsCount === 0 ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {quality.hardViolationsCount}
              </span>
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-2.5">
            <div className="p-3 border border-[#e5e7eb] rounded-lg flex items-center justify-between gap-3 hover:border-[#111827] bg-white transition-colors">
              <div>
                <h4 className="text-xs font-bold text-[#111827]">
                  {lang === 'es' ? 'Exportar como CSV (Excel / Hojas de cálculo)' : 'Export as CSV (Excel / Google Sheets)'}
                </h4>
                <p className="text-[11px] text-[#6b7280] mt-0.5">
                  {lang === 'es'
                    ? 'Descarga un archivo .csv estándar con turnos, horarios y balance de horas de cada empleado.'
                    : 'Download a clean RFC-compliant CSV with shift schedules, headcount, and employee hours.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-[#111827] hover:bg-black shadow-xs cursor-pointer shrink-0 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t(lang, 'downloadCsvButton')}</span>
              </button>
            </div>

            <div className="p-3 border border-[#e5e7eb] rounded-lg flex items-center justify-between gap-3 hover:border-[#111827] bg-white transition-colors">
              <div>
                <h4 className="text-xs font-bold text-[#111827]">
                  {lang === 'es' ? 'Imprimir Cuadrante / Guardar PDF' : 'Printable Roster / Save to PDF'}
                </h4>
                <p className="text-[11px] text-[#6b7280] mt-0.5">
                  {lang === 'es'
                    ? 'Abre la vista de impresión optimizada del navegador para tableros de anuncios físicos.'
                    : 'Generates a high-contrast printable table optimized for bulletin boards or PDF archiving.'}
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider text-[#111827] bg-white hover:bg-slate-50 border border-[#e5e7eb] shadow-xs cursor-pointer shrink-0 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t(lang, 'printButton')}</span>
              </button>
            </div>
          </div>

          {/* CSV Preview */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-mono font-bold text-[#6b7280] uppercase tracking-wider">
                {lang === 'es' ? 'Vista previa CSV' : 'CSV Preview'}
              </span>
              <button
                type="button"
                onClick={handleCopyCsv}
                className="text-[11px] font-mono font-semibold text-[#111827] hover:underline cursor-pointer"
              >
                {copied ? '✓ Copied' : 'Copy raw text'}
              </button>
            </div>
            <pre className="p-3 bg-[#111827] text-slate-100 text-[10px] font-mono rounded-lg overflow-x-auto max-h-40 whitespace-pre border border-[#1f2937]">
              {csvContent}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#f9fafb] border-t border-[#e5e7eb] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#111827] bg-white border border-[#e5e7eb] hover:bg-slate-100 rounded cursor-pointer transition-colors"
          >
            {t(lang, 'close')}
          </button>
        </div>
      </div>
    </div>
  );
};
