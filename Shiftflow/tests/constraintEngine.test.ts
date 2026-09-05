import { describe, it, expect } from 'vitest';
import { validateFullSchedule } from '../src/engine/constraintEngine';
import {
  CoverageRequirement,
  Employee,
  ShiftAssignment,
  DayOfWeek,
} from '../src/types';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function employee(id: string, overrides: Partial<Employee> = {}): Employee {
  return {
    id,
    name: `Employee ${id}`,
    role: 'cashier',
    maxWeeklyHours: 40,
    minWeeklyHours: 20,
    preference: 'morning',
    availability: (() => {
      const avail: Partial<Employee['availability']> = {};
      (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as DayOfWeek[]).forEach(d => {
        avail[d] = { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] };
      });
      return avail as Employee['availability'];
    })(),
    ...overrides,
  };
}

const employees: Employee[] = [
  employee('emp1'),
  employee('emp2', { preference: 'afternoon' }),
];

const requirements: CoverageRequirement[] = [
  { id: 'req1', day: 'monday', startTime: '09:00', endTime: '13:00', requiredEmployees: 1 },
  { id: 'req2', day: 'tuesday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2 },
  { id: 'req3', day: 'wednesday', startTime: '09:00', endTime: '13:00', requiredEmployees: 1, requiredRole: 'manager' },
];

function assignment(
  id: string,
  requirementId: string,
  employeeId: string,
  day: DayOfWeek,
  startTime: string,
  endTime: string
): ShiftAssignment {
  return { id, requirementId, employeeId, day, startTime, endTime };
}

describe('validateFullSchedule — constraint detection', () => {
  it('flags an UNDERSTAFFED violation when coverage is missing', () => {
    const assignments: ShiftAssignment[] = [
      assignment('a1', 'req1', 'emp1', 'monday', '09:00', '13:00'),
    ];
    const { violations, quality } = validateFullSchedule(requirements, employees, assignments, 'en');

    const understaffed = violations.filter(v => v.type === 'UNDERSTAFFED');
    expect(understaffed.length).toBeGreaterThan(0);
    expect(understaffed.some(v => v.requirementId === 'req2')).toBe(true);
    expect(quality.understaffedSlotsCount).toBe(3); // req2 needs 2, req3 needs 1, none filled
  });

  it('flags an UNAVAILABLE violation for an out-of-window assignment', () => {
    const assignments: ShiftAssignment[] = [
      assignment('a-bad', 'req1', 'emp1', 'monday', '22:00', '23:59'),
    ];
    const { violations } = validateFullSchedule(requirements, employees, assignments, 'en');

    const bad = violations.find(v => v.type === 'UNAVAILABLE');
    expect(bad).toBeDefined();
    expect(bad!.employeeId).toBe('emp1');
    expect(bad!.severity).toBe('hard');
  });

  it('flags an OVERLAPPING_SHIFT violation for simultaneous shifts', () => {
    const assignments: ShiftAssignment[] = [
      assignment('a1', 'req1', 'emp1', 'monday', '09:00', '13:00'),
      assignment('a2', 'req2', 'emp1', 'monday', '10:00', '14:00'),
    ];
    const { violations } = validateFullSchedule(requirements, employees, assignments, 'en');

    const overlap = violations.find(v => v.type === 'OVERLAPPING_SHIFT');
    expect(overlap).toBeDefined();
    expect(overlap!.severity).toBe('hard');
    expect(overlap!.message).toContain('emp1');
  });

  it('flags a ROLE_MISMATCH violation for a role-gated slot', () => {
    const assignments: ShiftAssignment[] = [
      assignment('a1', 'req3', 'emp1', 'wednesday', '09:00', '13:00'),
    ];
    const { violations } = validateFullSchedule(requirements, employees, assignments, 'en');

    const role = violations.find(v => v.type === 'ROLE_MISMATCH');
    expect(role).toBeDefined();
    expect(role!.severity).toBe('hard');
    expect(role!.details).toContain('manager');
  });

  it('flags a MAX_HOURS_EXCEEDED violation when hours exceed the limit', () => {
    const lightEmployee: Employee = employee('emp-light', { maxWeeklyHours: 3 });
    const assignments: ShiftAssignment[] = [
      assignment('a1', 'req1', 'emp-light', 'monday', '09:00', '13:00'),
    ];
    const { violations } = validateFullSchedule(requirements, [lightEmployee], assignments, 'en');

    const overHours = violations.find(v => v.type === 'MAX_HOURS_EXCEEDED');
    expect(overHours).toBeDefined();
    expect(overHours!.severity).toBe('hard');
    expect(overHours!.message).toContain('4h / 3h');
  });

  it('flags a PREFERENCE_MISMATCH soft violation', () => {
    const assignments: ShiftAssignment[] = [
      assignment('a1', 'req2', 'emp1', 'tuesday', '13:00', '17:00'),
    ];
    const { violations } = validateFullSchedule(requirements, employees, assignments, 'en');

    const pref = violations.find(v => v.type === 'PREFERENCE_MISMATCH');
    expect(pref).toBeDefined();
    expect(pref!.severity).toBe('soft');
  });

  it('reports fairness and preference-satisfaction metrics', () => {
    const assignments: ShiftAssignment[] = [
      assignment('a1', 'req1', 'emp1', 'monday', '09:00', '13:00'),
      assignment('a2', 'req2', 'emp1', 'tuesday', '13:00', '17:00'),
      assignment('a3', 'req2', 'emp2', 'tuesday', '13:00', '17:00'),
    ];
    const { quality, employeeSummaries } = validateFullSchedule(requirements, employees, assignments, 'en');

    expect(quality.coveragePercentage).toBeGreaterThan(0);
    expect(quality.score).toBeGreaterThanOrEqual(0);
    expect(quality.score).toBeLessThanOrEqual(100);
    expect(employeeSummaries['emp1'].assignedHours).toBe(8);
    expect(employeeSummaries['emp1'].percentage).toBe(20);
    expect(['Excellent', 'Good', 'Fair', 'Poor']).toContain(quality.fairnessRating);
  });

  it('detects a mathematically impossible plan', () => {
    const tiny: Employee[] = [employee('tiny', { maxWeeklyHours: 2 })];
    const bigReqs: CoverageRequirement[] = [
      { id: 'big', day: 'monday', startTime: '09:00', endTime: '17:00', requiredEmployees: 3 },
    ];
    const { quality } = validateFullSchedule(bigReqs, tiny, [], 'en');
    expect(quality.isMathematicallyImpossible).toBe(true);
    expect(quality.impossibleReason).toMatch(/capacity/);
  });

  it('returns an empty violation list for a perfect schedule', () => {
    const anyEmployees = employees.map(e => ({ ...e, preference: 'any' as const }));
    const assignments: ShiftAssignment[] = [
      assignment('a1', 'req1', 'emp1', 'monday', '09:00', '13:00'),
      assignment('a2', 'req2', 'emp2', 'tuesday', '13:00', '17:00'),
      assignment('a3', 'req2', 'emp1', 'tuesday', '13:00', '17:00'),
    ];
    const noRoleReqs = requirements.filter(r => !r.requiredRole);
    const { violations, coverage } = validateFullSchedule(noRoleReqs, anyEmployees, assignments, 'en');

    // req3 removed (role-gated, no manager in roster) so the schedule is fully valid
    expect(violations).toHaveLength(0);
    expect(coverage.every(c => c.isFullyCovered)).toBe(true);
  });
});