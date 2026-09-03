import {
  CoverageRequirement,
  Employee,
  EmployeeScheduleSummary,
  ShiftAssignment,
} from '../types';
import { calculateDurationHours, DAY_LABELS } from './time';

/**
 * Generates an RFC-4180 compliant CSV string of the schedule and employee hours
 */
export function generateScheduleCsv(
  requirements: CoverageRequirement[],
  employees: Employee[],
  assignments: ShiftAssignment[],
  employeeSummaries: Record<string, EmployeeScheduleSummary>,
  lang: 'en' | 'es' = 'en'
): string {
  const employeesMap = new Map(employees.map(e => [e.id, e]));
  const lines: string[] = [];

  // Section 1: Shift Schedule
  lines.push('=== WEEKLY SHIFT ROSTER ===');
  lines.push('Day,Start Time,End Time,Duration (h),Shift Label,Required Role,Required Staff,Assigned Employees');

  const sortedReqs = [...requirements].sort((a, b) => {
    const dayOrder: Record<string, number> = {
      monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6, sunday: 7,
    };
    const dDiff = (dayOrder[a.day] || 0) - (dayOrder[b.day] || 0);
    if (dDiff !== 0) return dDiff;
    return a.startTime.localeCompare(b.startTime);
  });

  for (const req of sortedReqs) {
    const slotAssignments = assignments.filter(a => a.requirementId === req.id);
    const assignedNames = slotAssignments
      .map(a => employeesMap.get(a.employeeId)?.name || 'Unknown')
      .join('; ');
    const duration = calculateDurationHours(req.startTime, req.endTime);
    const dayName = DAY_LABELS[lang][req.day].full;

    const row = [
      `"${dayName}"`,
      `"${req.startTime}"`,
      `"${req.endTime}"`,
      duration,
      `"${req.label || ''}"`,
      `"${req.requiredRole || 'Any'}"`,
      req.requiredEmployees,
      `"${assignedNames || 'UNSTAFFED'}"`,
    ];
    lines.push(row.join(','));
  }

  lines.push('');
  lines.push('=== EMPLOYEE WORKLOAD & CAPACITY SUMMARY ===');
  lines.push('Employee,Role,Assigned Hours,Max Weekly Hours,Utilization %,Status');

  for (const emp of employees) {
    const summary = employeeSummaries[emp.id];
    const assignedHours = summary ? summary.assignedHours : 0;
    const maxHours = emp.maxWeeklyHours;
    const util = summary ? summary.percentage : 0;
    const status = summary?.isOverLimit ? `OVER LIMIT (+${summary.overHours}h)` : 'OK';

    const row = [
      `"${emp.name}"`,
      `"${emp.role}"`,
      assignedHours,
      maxHours,
      `"${util}%"`,
      `"${status}"`,
    ];
    lines.push(row.join(','));
  }

  return lines.join('\r\n');
}

/**
 * Triggers CSV file download in the browser
 */
export function downloadCsvFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
