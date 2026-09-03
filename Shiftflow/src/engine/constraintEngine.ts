import {
  ConstraintViolation,
  CoverageItemStatus,
  CoverageRequirement,
  Employee,
  EmployeeScheduleSummary,
  FairnessRating,
  Language,
  ScheduleQuality,
  ShiftAssignment,
} from '../types';
import {
  calculateDurationHours,
  classifyShiftType,
  doIntervalsOverlap,
  isTimeSlotAvailable,
  DAY_LABELS,
} from '../utils/time';
import { t } from '../i18n/translations';

/**
 * Checks if an employee is available for a given day and time slot
 */
export function checkEmployeeAvailability(
  employee: Employee,
  day: CoverageRequirement['day'],
  startTime: string,
  endTime: string
): { isAvailable: boolean; reason?: string } {
  const dayAvail = employee.availability[day];
  if (!dayAvail || !dayAvail.isAvailable) {
    return {
      isAvailable: false,
      reason: `Unavailable on ${day.toUpperCase()}`,
    };
  }

  const isCovered = isTimeSlotAvailable(startTime, endTime, dayAvail.intervals);
  if (!isCovered) {
    return {
      isAvailable: false,
      reason: `Outside stated working hours (${dayAvail.intervals.map(i => `${i.start}-${i.end}`).join(', ') || 'None'})`,
    };
  }

  return { isAvailable: true };
}

/**
 * Checks if assigning this employee to [day, startTime, endTime] overlaps with any other shift they have that day
 */
export function checkShiftOverlap(
  employeeId: string,
  day: CoverageRequirement['day'],
  startTime: string,
  endTime: string,
  assignments: ShiftAssignment[],
  excludeAssignmentId?: string
): { hasOverlap: boolean; overlappingAssignment?: ShiftAssignment } {
  for (const assignment of assignments) {
    if (assignment.id === excludeAssignmentId) continue;
    if (assignment.employeeId !== employeeId) continue;
    if (assignment.day !== day) continue;

    if (doIntervalsOverlap(startTime, endTime, assignment.startTime, assignment.endTime)) {
      return { hasOverlap: true, overlappingAssignment: assignment };
    }
  }

  return { hasOverlap: false };
}

/**
 * Computes total assigned hours for an employee
 */
export function calculateEmployeeAssignedHours(
  employeeId: string,
  assignments: ShiftAssignment[]
): number {
  let total = 0;
  for (const assignment of assignments) {
    if (assignment.employeeId === employeeId) {
      total += calculateDurationHours(assignment.startTime, assignment.endTime);
    }
  }
  return Number(total.toFixed(2));
}

/**
 * Checks if an employee meets the required role for a requirement (if specified)
 */
export function checkRoleMatch(employee: Employee, requiredRole?: string): boolean {
  if (!requiredRole || requiredRole.trim() === '') return true;
  return employee.role.toLowerCase() === requiredRole.toLowerCase();
}

/**
 * Checks if a shift time matches the employee's preferred shift type
 */
export function checkShiftPreference(
  employee: Employee,
  startTime: string,
  endTime: string
): { matches: boolean; actual: string } {
  if (employee.preference === 'any') {
    return { matches: true, actual: 'flexible' };
  }
  const shiftType = classifyShiftType(startTime, endTime);
  return {
    matches: shiftType === employee.preference,
    actual: shiftType,
  };
}

/**
 * Comprehensive schedule validator
 * Evaluates all Hard & Soft constraints, computes coverage states,
 * employee workload summaries, and overall schedule quality score.
 */
export function validateFullSchedule(
  requirements: CoverageRequirement[],
  employees: Employee[],
  assignments: ShiftAssignment[],
  lang: Language = 'en'
): {
  violations: ConstraintViolation[];
  coverage: CoverageItemStatus[];
  employeeSummaries: Record<string, EmployeeScheduleSummary>;
  quality: ScheduleQuality;
} {
  const violations: ConstraintViolation[] = [];
  const employeesMap = new Map(employees.map(e => [e.id, e]));
  const requirementsMap = new Map(requirements.map(r => [r.id, r]));

  // 1. Group assignments by requirementId
  const assignmentsByReq = new Map<string, ShiftAssignment[]>();
  for (const req of requirements) {
    assignmentsByReq.set(req.id, []);
  }
  for (const assignment of assignments) {
    const list = assignmentsByReq.get(assignment.requirementId);
    if (list) {
      list.push(assignment);
    }
  }

  // 2. Evaluate Coverage requirements
  const coverage: CoverageItemStatus[] = [];
  let totalRequiredSlots = 0;
  let coveredSlotsCount = 0;
  let understaffedSlotsCount = 0;
  let totalRequiredHours = 0;

  for (const req of requirements) {
    const slotAssignments = assignmentsByReq.get(req.id) || [];
    const assignedCount = slotAssignments.length;
    const duration = calculateDurationHours(req.startTime, req.endTime);
    totalRequiredHours += duration * req.requiredEmployees;
    totalRequiredSlots += req.requiredEmployees;

    const deficit = Math.max(0, req.requiredEmployees - assignedCount);
    const surplus = Math.max(0, assignedCount - req.requiredEmployees);
    const isFullyCovered = assignedCount >= req.requiredEmployees;
    const isUnderstaffed = assignedCount < req.requiredEmployees;
    const isOverstaffed = assignedCount > req.requiredEmployees;

    if (isFullyCovered) {
      coveredSlotsCount += req.requiredEmployees;
    } else {
      coveredSlotsCount += assignedCount;
      understaffedSlotsCount += deficit;

      // Hard constraint: Understaffed slot
      violations.push({
        id: `understaffed-${req.id}`,
        type: 'UNDERSTAFFED',
        severity: 'hard',
        requirementId: req.id,
        day: req.day,
        title: t(lang, 'conflictUnderstaffedTitle'),
        message: `${DAY_LABELS[lang][req.day].full} ${req.startTime}–${req.endTime}: ${assignedCount}/${req.requiredEmployees} ${t(lang, 'role').toLowerCase()}`,
        details: `Requires ${req.requiredEmployees} staff members, but only ${assignedCount} assigned. Deficit: ${deficit}.`,
      });
    }

    coverage.push({
      requirementId: req.id,
      day: req.day,
      startTime: req.startTime,
      endTime: req.endTime,
      label: req.label,
      requiredRole: req.requiredRole,
      required: req.requiredEmployees,
      assigned: assignedCount,
      assignedEmployeeIds: slotAssignments.map(a => a.employeeId),
      isFullyCovered,
      isUnderstaffed,
      isOverstaffed,
      deficit,
      surplus,
    });
  }

  // 3. Evaluate Employee assignments & Workload
  const employeeSummaries: Record<string, EmployeeScheduleSummary> = {};
  const employeeHoursMap = new Map<string, number>();
  const employeeShiftsMap = new Map<string, number>();
  const employeePrefSatisfiedMap = new Map<string, number>();
  const employeeTotalPrefShiftsMap = new Map<string, number>();

  for (const emp of employees) {
    employeeHoursMap.set(emp.id, 0);
    employeeShiftsMap.set(emp.id, 0);
    employeePrefSatisfiedMap.set(emp.id, 0);
    employeeTotalPrefShiftsMap.set(emp.id, 0);
  }

  let totalScheduledHours = 0;

  // Track assignments per employee for overlap detection
  const employeeAssignmentsList = new Map<string, ShiftAssignment[]>();

  for (const assignment of assignments) {
    const emp = employeesMap.get(assignment.employeeId);
    const req = requirementsMap.get(assignment.requirementId);
    if (!emp || !req) continue;

    const shiftDuration = calculateDurationHours(assignment.startTime, assignment.endTime);
    totalScheduledHours += shiftDuration;

    employeeHoursMap.set(emp.id, (employeeHoursMap.get(emp.id) || 0) + shiftDuration);
    employeeShiftsMap.set(emp.id, (employeeShiftsMap.get(emp.id) || 0) + 1);

    // Track employee assignments
    if (!employeeAssignmentsList.has(emp.id)) {
      employeeAssignmentsList.set(emp.id, []);
    }
    employeeAssignmentsList.get(emp.id)!.push(assignment);

    // Hard Constraint Check 1: Availability
    const availCheck = checkEmployeeAvailability(emp, assignment.day, assignment.startTime, assignment.endTime);
    if (!availCheck.isAvailable) {
      violations.push({
        id: `avail-${assignment.id}`,
        type: 'UNAVAILABLE',
        severity: 'hard',
        employeeId: emp.id,
        requirementId: assignment.requirementId,
        day: assignment.day,
        title: t(lang, 'conflictUnavailableTitle'),
        message: `${emp.name} — ${DAY_LABELS[lang][assignment.day].full} ${assignment.startTime}–${assignment.endTime}`,
        details: availCheck.reason || 'Employee is not available during this time slot.',
      });
    }

    // Hard Constraint Check 2: Role Mismatch
    if (req.requiredRole && !checkRoleMatch(emp, req.requiredRole)) {
      violations.push({
        id: `role-${assignment.id}`,
        type: 'ROLE_MISMATCH',
        severity: 'hard',
        employeeId: emp.id,
        requirementId: req.id,
        day: req.day,
        title: t(lang, 'conflictRoleMismatchTitle'),
        message: `${emp.name} (${emp.role}) ≠ ${req.requiredRole}`,
        details: `This shift requires role '${req.requiredRole}', but ${emp.name} is '${emp.role}'.`,
      });
    }

    // Soft Constraint Check 1: Shift Preferences
    if (emp.preference !== 'any') {
      employeeTotalPrefShiftsMap.set(emp.id, (employeeTotalPrefShiftsMap.get(emp.id) || 0) + 1);
      const prefCheck = checkShiftPreference(emp, assignment.startTime, assignment.endTime);
      if (prefCheck.matches) {
        employeePrefSatisfiedMap.set(emp.id, (employeePrefSatisfiedMap.get(emp.id) || 0) + 1);
      } else {
        violations.push({
          id: `pref-${assignment.id}`,
          type: 'PREFERENCE_MISMATCH',
          severity: 'soft',
          employeeId: emp.id,
          requirementId: req.id,
          day: req.day,
          title: t(lang, 'conflictPreferenceTitle'),
          message: `${emp.name} prefers ${emp.preference} shifts`,
          details: `Assigned to ${prefCheck.actual} shift on ${DAY_LABELS[lang][req.day].full} (${req.startTime}–${req.endTime}).`,
        });
      }
    }
  }

  // Hard Constraint Check 3: Overlapping Shifts
  for (const [empId, empAssignments] of employeeAssignmentsList.entries()) {
    const emp = employeesMap.get(empId);
    if (!emp) continue;

    for (let i = 0; i < empAssignments.length; i++) {
      for (let j = i + 1; j < empAssignments.length; j++) {
        const a1 = empAssignments[i];
        const a2 = empAssignments[j];
        if (a1.day === a2.day && doIntervalsOverlap(a1.startTime, a1.endTime, a2.startTime, a2.endTime)) {
          violations.push({
            id: `overlap-${a1.id}-${a2.id}`,
            type: 'OVERLAPPING_SHIFT',
            severity: 'hard',
            employeeId: empId,
            day: a1.day,
            title: t(lang, 'conflictOverlapTitle'),
            message: `${emp.name} on ${DAY_LABELS[lang][a1.day].full}: ${a1.startTime}–${a1.endTime} overlaps with ${a2.startTime}–${a2.endTime}`,
            details: 'An employee cannot be assigned to two simultaneous shifts.',
          });
        }
      }
    }
  }

  // Hard Constraint Check 4: Maximum Weekly Hours Exceeded
  for (const emp of employees) {
    const assignedHours = Number((employeeHoursMap.get(emp.id) || 0).toFixed(2));
    const isOverLimit = assignedHours > emp.maxWeeklyHours;
    const overHours = isOverLimit ? Number((assignedHours - emp.maxWeeklyHours).toFixed(2)) : 0;
    const percentage = emp.maxWeeklyHours > 0 ? Math.round((assignedHours / emp.maxWeeklyHours) * 100) : 0;
    const shiftCount = employeeShiftsMap.get(emp.id) || 0;
    const prefSatisfied = employeePrefSatisfiedMap.get(emp.id) || 0;
    const totalPrefShifts = employeeTotalPrefShiftsMap.get(emp.id) || 0;
    const prefRate = totalPrefShifts > 0 ? Math.round((prefSatisfied / totalPrefShifts) * 100) : 100;

    if (isOverLimit) {
      violations.push({
        id: `overtime-${emp.id}`,
        type: 'MAX_HOURS_EXCEEDED',
        severity: 'hard',
        employeeId: emp.id,
        title: t(lang, 'conflictMaxHoursTitle'),
        message: `${emp.name}: ${assignedHours}h / ${emp.maxWeeklyHours}h max (+${overHours}h)`,
        details: `Exceeds legal or contractual weekly maximum by ${overHours} hours.`,
      });
    }

    employeeSummaries[emp.id] = {
      employeeId: emp.id,
      name: emp.name,
      role: emp.role,
      assignedHours,
      maxHours: emp.maxWeeklyHours,
      minHours: emp.minWeeklyHours,
      percentage,
      isOverLimit,
      overHours,
      assignedShiftCount: shiftCount,
      preferencesSatisfied: prefSatisfied,
      totalAssignedPreferences: totalPrefShifts,
      preferenceSatisfactionRate: prefRate,
    };
  }

  // 4. Calculate Fairness & Workload Distribution
  const utilizations = Object.values(employeeSummaries)
    .filter(s => s.maxHours > 0)
    .map(s => s.percentage);

  let fairnessRating: FairnessRating = 'Good';
  let fairnessVariance = 0;
  if (utilizations.length > 1) {
    const avgUtil = utilizations.reduce((a, b) => a + b, 0) / utilizations.length;
    fairnessVariance = Math.round(
      Math.sqrt(utilizations.reduce((acc, u) => acc + Math.pow(u - avgUtil, 2), 0) / utilizations.length)
    );

    if (fairnessVariance <= 12) fairnessRating = 'Excellent';
    else if (fairnessVariance <= 22) fairnessRating = 'Good';
    else if (fairnessVariance <= 35) fairnessRating = 'Fair';
    else fairnessRating = 'Poor';
  }

  // Soft Constraint: Hours imbalance violation if fairness is Poor
  if (fairnessRating === 'Poor' && utilizations.length > 2) {
    violations.push({
      id: 'fairness-unbalanced',
      type: 'UNBALANCED_HOURS',
      severity: 'soft',
      title: t(lang, 'conflictUnbalancedTitle'),
      message: `Workload dispersion is high (standard deviation: ±${fairnessVariance}%)`,
      details: 'Some employees are near or above capacity while others have very few assigned shifts.',
    });
  }

  // 5. Total preference satisfaction
  const allPrefSatisfied = Object.values(employeeSummaries).reduce((acc, s) => acc + s.preferencesSatisfied, 0);
  const allPrefTotal = Object.values(employeeSummaries).reduce((acc, s) => acc + s.totalAssignedPreferences, 0);
  const preferenceSatisfactionPercentage = allPrefTotal > 0 ? Math.round((allPrefSatisfied / allPrefTotal) * 100) : 100;

  // 6. Coverage percentage
  const coveragePercentage = totalRequiredSlots > 0 ? Math.round((coveredSlotsCount / totalRequiredSlots) * 100) : 100;

  // 7. Check Mathematical Impossibility
  const totalWorkforceMaxHours = employees.reduce((acc, e) => acc + e.maxWeeklyHours, 0);
  const isMathematicallyImpossible = totalRequiredHours > totalWorkforceMaxHours;
  let impossibleReason: string | undefined;

  if (isMathematicallyImpossible) {
    const deficit = Number((totalRequiredHours - totalWorkforceMaxHours).toFixed(1));
    impossibleReason = `Requirements need ${totalRequiredHours}h of staffing, but total workforce capacity across all ${employees.length} employees is only ${totalWorkforceMaxHours}h (deficit of ${deficit}h).`;
  }

  // 8. Overall Quality Score (0 - 100)
  const hardViolationsCount = violations.filter(v => v.severity === 'hard').length;
  const softViolationsCount = violations.filter(v => v.severity === 'soft').length;

  let rawScore = 100;
  // Coverage penalty
  rawScore -= (100 - coveragePercentage) * 0.5;
  // Hard violation penalty (each hard violation costs 15 points)
  rawScore -= hardViolationsCount * 15;
  // Soft violation penalty (each soft violation costs 3 points)
  rawScore -= softViolationsCount * 3;
  // Impossibility penalty
  if (isMathematicallyImpossible) rawScore -= 20;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  const quality: ScheduleQuality = {
    score,
    coveragePercentage,
    totalRequiredSlots,
    coveredSlotsCount,
    understaffedSlotsCount,
    hardViolationsCount,
    softViolationsCount,
    preferenceSatisfactionPercentage,
    fairnessRating,
    fairnessVariance,
    totalRequiredHours: Number(totalRequiredHours.toFixed(1)),
    totalScheduledHours: Number(totalScheduledHours.toFixed(1)),
    isMathematicallyImpossible,
    impossibleReason,
  };

  return {
    violations,
    coverage,
    employeeSummaries,
    quality,
  };
}
