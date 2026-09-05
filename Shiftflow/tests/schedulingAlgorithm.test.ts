import { describe, it, expect } from 'vitest';
import { generateScheduleHeuristic } from '../src/engine/schedulingAlgorithm';
import { checkEmployeeAvailability, calculateEmployeeAssignedHours } from '../src/engine/constraintEngine';
import {
  CoverageRequirement,
  Employee,
  DayOfWeek,
} from '../src/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function availability(
  days: DayOfWeek[],
  start: string,
  end: string
): Employee['availability'] {
  const avail: Partial<Employee['availability']> = {};
  (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as DayOfWeek[]).forEach(d => {
    avail[d] = { isAvailable: false, intervals: [] };
  });
  days.forEach(d => {
    avail[d] = { isAvailable: true, intervals: [{ start, end }] };
  });
  return avail as Employee['availability'];
}

const ALL_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as DayOfWeek[];

const baseStaff = (): Employee[] => [
  {
    id: 'e-cash-1',
    name: 'Ana Cashier',
    role: 'cashier',
    maxWeeklyHours: 40,
    minWeeklyHours: 20,
    preference: 'morning',
    availability: availability(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], '09:00', '17:00'),
  },
  {
    id: 'e-cash-2',
    name: 'Bruno Cashier',
    role: 'cashier',
    maxWeeklyHours: 40,
    minWeeklyHours: 20,
    preference: 'afternoon',
    availability: availability(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], '09:00', '17:00'),
  },
  {
    id: 'e-mgr',
    name: 'Carla Manager',
    role: 'manager',
    maxWeeklyHours: 40,
    preference: 'any',
    availability: availability(ALL_DAYS, '08:00', '22:00'),
  },
  {
    id: 'e-stock',
    name: 'David Stock',
    role: 'stock',
    maxWeeklyHours: 40,
    preference: 'any',
    availability: availability(ALL_DAYS, '08:00', '22:00'),
  },
];

const baseReqs = (): CoverageRequirement[] => [
  { id: 'r1', day: 'monday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, requiredRole: 'cashier' },
  { id: 'r2', day: 'monday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, requiredRole: 'cashier' },
  { id: 'r3', day: 'monday', startTime: '09:00', endTime: '17:00', requiredEmployees: 1, requiredRole: 'manager' },
  { id: 'r4', day: 'monday', startTime: '18:00', endTime: '21:00', requiredEmployees: 1, requiredRole: 'stock' },
  { id: 'r5', day: 'saturday', startTime: '10:00', endTime: '14:00', requiredEmployees: 3 },
];

describe('generateScheduleHeuristic — hard constraint compliance', () => {
  const employees = baseStaff();
  const requirements = baseReqs();
  const result = generateScheduleHeuristic(requirements, employees);

  it('reports the correct request/fill counts', () => {
    expect(result.totalSlotsRequested).toBe(9);
    expect(result.totalSlotsFilled).toBe(8);
    expect(result.unfilledSlotsCount).toBe(1);
    expect(result.isFullyCovered).toBe(false);
  });

  it('only assigns employees who are available at the assigned day & time', () => {
    for (const a of result.assignments) {
      const emp = employees.find(e => e.id === a.employeeId);
      expect(emp, `unknown employee ${a.employeeId}`).toBeDefined();
      const check = checkEmployeeAvailability(emp!, a.day, a.startTime, a.endTime);
      expect(check.isAvailable, `${emp!.name} assigned to ${a.day} ${a.startTime}-${a.endTime}`).toBe(true);
    }
  });

  it('never assigns a single employee to overlapping shifts on the same day', () => {
    const byEmployee = new Map<string, typeof result.assignments>();
    for (const a of result.assignments) {
      byEmployee.set(a.employeeId, [...(byEmployee.get(a.employeeId) || []), a]);
    }
    for (const [empId, list] of byEmployee) {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          if (a.day !== b.day) continue;
          expect(
            timeToMins(a.startTime) < timeToMins(b.endTime) &&
            timeToMins(a.endTime) > timeToMins(b.startTime),
            `${empId} has overlapping shifts on ${a.day}`
          ).toBe(false);
        }
      }
    }
  });

  it('respects required roles: cashier slots only cashiers, manager slot only managers', () => {
    const byReq = new Map(result.assignments.map(a => [a.requirementId, a.employeeId]));
    const cashierSlot = byReq.get('r1')!;
    const cashierSlot2 = byReq.get('r2')!;
    const managerSlot = byReq.get('r3')!;
    const stockSlot = byReq.get('r4')!;

    expect(cashierSlot).toBeDefined();
    expect(cashierSlot2).toBeDefined();
    for (const emp of employees) {
      if (emp.id === cashierSlot || emp.id === cashierSlot2) {
        expect(emp.role).toBe('cashier');
      }
    }
    const managerEmp = employees.find(e => e.id === managerSlot)!;
    expect(managerEmp.role).toBe('manager');
    const stockEmp = employees.find(e => e.id === stockSlot)!;
    expect(stockEmp.role).toBe('stock');
  });

  it('assigns distinct employees to the same requirement (no double-assignment)', () => {
    const byReq = new Map<string, string[]>();
    for (const a of result.assignments) {
      byReq.set(a.requirementId, [...(byReq.get(a.requirementId) || []), a.employeeId]);
    }
    for (const [reqId, empIds] of byReq) {
      expect(new Set(empIds).size, `duplicate employee in ${reqId}`).toBe(empIds.length);
    }
    // r1 and r2 both need 2 cashiers (total 4 slots) but only 2 cashiers exist in weekdays.
    // The two cashiers must be split across r1 and r2 without overlap.
    const r1 = byReq.get('r1')!;
    const r2 = byReq.get('r2')!;
    expect(r1).toHaveLength(2);
    expect(r2).toHaveLength(2);
    expect(r1.join(',')).not.toBe(r2.join(','));
  });

  it('respects weekly maximum hours for every employee', () => {
    for (const emp of employees) {
      const hours = calculateEmployeeAssignedHours(emp.id, result.assignments);
      expect(hours, `${emp.name} exceeded max`).toBeLessThanOrEqual(emp.maxWeeklyHours);
    }
  });

  it('leaves the unstaffable slot unfilled and explains the bottleneck', () => {
    const slot = result.reasoning.find(r => r.requirementId === 'r5')!;
    expect(slot.requiredCount).toBe(3);
    expect(slot.assignedEmployees).toHaveLength(2);
    expect(slot.unfulfilledCount).toBe(1);
    expect(slot.bottleneckReason).toBeDefined();
    expect(slot.bottleneckReason).toMatch(/unavailable|Unavailable/i);
  });
});

describe('generateScheduleHeuristic — MRV ordering is order-independent', () => {
  const employees: Employee[] = [
    {
      id: 'x',
      name: 'X Manager',
      role: 'manager',
      maxWeeklyHours: 40,
      preference: 'any',
      availability: availability(['monday'], '09:00', '13:00'),
    },
    {
      id: 'y',
      name: 'Y Flex',
      role: 'flex',
      maxWeeklyHours: 40,
      preference: 'any',
      availability: availability(['monday'], '09:00', '11:00'),
    },
  ];

  // rB (any role, 2 candidates) is listed BEFORE rA (manager role, 1 candidate).
  // Without MRV ordering, rB would claim X first and starve the unique-candidate slot.
  const requirements: CoverageRequirement[] = [
    { id: 'rB', day: 'monday', startTime: '09:00', endTime: '11:00', requiredEmployees: 1 },
    { id: 'rA', day: 'monday', startTime: '09:00', endTime: '13:00', requiredEmployees: 1, requiredRole: 'manager' },
  ];

  const result = generateScheduleHeuristic(requirements, employees);

  it('fills the most-constrained slot even though it is listed second', () => {
    expect(result.isFullyCovered).toBe(true);
    const rA = result.assignments.find(a => a.requirementId === 'rA');
    const rB = result.assignments.find(a => a.requirementId === 'rB');
    expect(rA?.employeeId).toBe('x');
    expect(rB?.employeeId).toBe('y');
  });
});

describe('generateScheduleHeuristic — explanations', () => {
  const employees = baseStaff();
  const requirements = baseReqs();
  const result = generateScheduleHeuristic(requirements, employees);

  it('evaluates every employee as a candidate for each requirement', () => {
    for (const slot of result.reasoning) {
      const empIds = slot.candidatesEvaluated.map(c => c.employeeId);
      expect(empIds.length, `${slot.requirementId} should evaluate all employees`).toBe(employees.length);
    }
  });

  it('provides non-empty reasons for every assignment', () => {
    for (const slot of result.reasoning) {
      for (const assigned of slot.assignedEmployees) {
        expect(assigned.reasons.length, `${assigned.name} lacks an explanation`).toBeGreaterThan(0);
        for (const reason of assigned.reasons) {
          expect(reason.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('lists disqualification reasons for ineligible candidates', () => {
    const slot = result.reasoning.find(r => r.requirementId === 'r5')!;
    const ineligible = slot.candidatesEvaluated.filter(c => !c.eligible);
    expect(ineligible.length).toBeGreaterThan(0);
    for (const c of ineligible) {
      expect(c.disqualificationReasons.length).toBeGreaterThan(0);
    }
  });

  it('produces a summary that references coverage counts', () => {
    expect(result.explanationSummary.length).toBeGreaterThan(0);
    expect(result.explanationSummary[0]).toContain('9');
    expect(result.explanationSummary[0]).toContain('Monday');
  });
});

function timeToMins(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}