import {
  CandidateEvaluation,
  CoverageRequirement,
  Employee,
  ShiftAssignment,
  SlotAssignmentReasoning,
} from '../types';
import {
  calculateDurationHours,
  classifyShiftType,
  doIntervalsOverlap,
  isTimeSlotAvailable,
  DAY_LABELS,
} from '../utils/time';

export interface SchedulingResult {
  assignments: ShiftAssignment[];
  reasoning: SlotAssignmentReasoning[];
  totalSlotsRequested: number;
  totalSlotsFilled: number;
  unfilledSlotsCount: number;
  isFullyCovered: boolean;
  explanationSummary: string[];
}

/**
 * Heuristic Constraint-Based Scheduling Engine
 *
 * Implements a prioritized candidate scoring algorithm (MRV + Heuristic Evaluation)
 * respecting:
 * 1. Hard Constraints (Availability, Overlaps, Role Requirements, Max Weekly Hours)
 * 2. Soft Constraints (Preferences, Balanced Workload, Consecutive Days)
 */
export function generateScheduleHeuristic(
  requirements: CoverageRequirement[],
  employees: Employee[]
): SchedulingResult {
  const assignments: ShiftAssignment[] = [];
  const reasoningList: SlotAssignmentReasoning[] = [];

  // Track assigned hours and daily assignments per employee during the simulation
  const employeeHours = new Map<string, number>();
  const employeeDailyShifts = new Map<string, { day: string; start: string; end: string }[]>();
  const employeeDaysWorked = new Map<string, Set<string>>();

  for (const emp of employees) {
    employeeHours.set(emp.id, 0);
    employeeDailyShifts.set(emp.id, []);
    employeeDaysWorked.set(emp.id, new Set());
  }

  // Pre-calculate candidate availability count per requirement for Minimum Remaining Values (MRV) ordering
  const reqWithEligibility = requirements.map(req => {
    const shiftDuration = calculateDurationHours(req.startTime, req.endTime);
    let eligibleCount = 0;
    for (const emp of employees) {
      const dayAvail = emp.availability[req.day];
      if (
        dayAvail &&
        dayAvail.isAvailable &&
        isTimeSlotAvailable(req.startTime, req.endTime, dayAvail.intervals) &&
        (!req.requiredRole || emp.role.toLowerCase() === req.requiredRole.toLowerCase())
      ) {
        eligibleCount++;
      }
    }
    return { req, eligibleCount, shiftDuration };
  });

  // Sort requirements:
  // 1. Most constrained requirements first (lowest candidate availability)
  // 2. Specific role requirements first
  // 3. Chronological day order and start time
  const dayOrder: Record<string, number> = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };

  reqWithEligibility.sort((a, b) => {
    // Role requirements first
    const aHasRole = Boolean(a.req.requiredRole);
    const bHasRole = Boolean(b.req.requiredRole);
    if (aHasRole !== bHasRole) return aHasRole ? -1 : 1;

    // Minimum remaining eligible candidates
    if (a.eligibleCount !== b.eligibleCount) {
      return a.eligibleCount - b.eligibleCount;
    }

    // Chronological order
    const dayDiff = (dayOrder[a.req.day] || 0) - (dayOrder[b.req.day] || 0);
    if (dayDiff !== 0) return dayDiff;

    return a.req.startTime.localeCompare(b.req.startTime);
  });

  let totalSlotsRequested = 0;
  let totalSlotsFilled = 0;

  // Process each coverage requirement
  for (const item of reqWithEligibility) {
    const { req, shiftDuration } = item;
    totalSlotsRequested += req.requiredEmployees;

    const slotReasoning: SlotAssignmentReasoning = {
      requirementId: req.id,
      day: req.day,
      timeRange: `${req.startTime}–${req.endTime}`,
      requiredCount: req.requiredEmployees,
      assignedEmployees: [],
      candidatesEvaluated: [],
      unfulfilledCount: 0,
    };

    const assignedForThisSlot: {
      employeeId: string;
      name: string;
      score: number;
      reasons: string[];
    }[] = [];

    // We may need multiple employees for this slot
    for (let slotIndex = 0; slotIndex < req.requiredEmployees; slotIndex++) {
      const candidateEvaluations: CandidateEvaluation[] = [];

      for (const emp of employees) {
        // Skip if this employee is already assigned to this exact requirement slot
        if (assignedForThisSlot.some(a => a.employeeId === emp.id)) {
          continue;
        }

        const disqualificationReasons: string[] = [];

        // 1. Hard constraint: Check stated availability for day and time
        const dayAvail = emp.availability[req.day];
        if (!dayAvail || !dayAvail.isAvailable) {
          disqualificationReasons.push(`Marked unavailable on ${req.day}`);
        } else if (!isTimeSlotAvailable(req.startTime, req.endTime, dayAvail.intervals)) {
          disqualificationReasons.push(
            `Shift outside available hours (${dayAvail.intervals.map(i => `${i.start}-${i.end}`).join(', ')})`
          );
        }

        // 2. Hard constraint: Overlapping shifts on the same day
        const existingShifts = employeeDailyShifts.get(emp.id) || [];
        const hasOverlap = existingShifts.some(
          s => s.day === req.day && doIntervalsOverlap(req.startTime, req.endTime, s.start, s.end)
        );
        if (hasOverlap) {
          disqualificationReasons.push('Already scheduled on overlapping shift');
        }

        // 3. Hard constraint: Role requirement
        if (req.requiredRole && emp.role.toLowerCase() !== req.requiredRole.toLowerCase()) {
          disqualificationReasons.push(`Role mismatch (requires '${req.requiredRole}', employee is '${emp.role}')`);
        }

        // 4. Hard constraint: Weekly max hours protection
        const currentHours = employeeHours.get(emp.id) || 0;
        const wouldExceedMaxHours = currentHours + shiftDuration > emp.maxWeeklyHours;
        if (wouldExceedMaxHours) {
          disqualificationReasons.push(
            `Would exceed weekly max hours (${currentHours}h + ${shiftDuration}h > ${emp.maxWeeklyHours}h)`
          );
        }

        const isEligible = disqualificationReasons.length === 0;

        // Scoring Formula
        let score = 0;
        const scoreBreakdown = {
          coverageContribution: 0,
          preferenceMatch: 0,
          balancedWorkload: 0,
          minHoursIncentive: 0,
          roleMatchBonus: 0,
        };

        if (isEligible) {
          // Priority 2: Base coverage contribution
          scoreBreakdown.coverageContribution = 100;
          score += 100;

          // Priority 6: Preference matching
          const shiftType = classifyShiftType(req.startTime, req.endTime);
          if (emp.preference === shiftType) {
            scoreBreakdown.preferenceMatch = 35;
            score += 35;
          } else if (emp.preference === 'any') {
            scoreBreakdown.preferenceMatch = 15;
            score += 15;
          } else {
            // Opposite preference
            scoreBreakdown.preferenceMatch = 0;
          }

          // Priority 7: Balanced workload (prefer staff with lowest utilization percentage)
          const utilization = emp.maxWeeklyHours > 0 ? currentHours / emp.maxWeeklyHours : 1;
          const remainingCapacityRatio = Math.max(0, 1 - utilization);
          const workloadScore = Math.round(remainingCapacityRatio * 30);
          scoreBreakdown.balancedWorkload = workloadScore;
          score += workloadScore;

          // Target minimum hours incentive
          if (emp.minWeeklyHours && currentHours < emp.minWeeklyHours) {
            scoreBreakdown.minHoursIncentive = 15;
            score += 15;
          }

          // Bonus if role matches exactly (when role is optional or preferred)
          if (req.requiredRole && emp.role.toLowerCase() === req.requiredRole.toLowerCase()) {
            scoreBreakdown.roleMatchBonus = 10;
            score += 10;
          }

          // Consecutive days worked moderation
          const daysWorkedSet = employeeDaysWorked.get(emp.id);
          if (daysWorkedSet && daysWorkedSet.size >= 5 && !daysWorkedSet.has(req.day)) {
            score -= 10; // modest fatigue penalty
          }
        } else {
          score = -1000;
        }

        candidateEvaluations.push({
          employeeId: emp.id,
          employeeName: emp.name,
          eligible: isEligible,
          disqualificationReasons,
          score,
          scoreBreakdown,
        });
      }

      // Filter to eligible candidates and sort by highest score
      const eligibleCandidates = candidateEvaluations
        .filter(c => c.eligible)
        .sort((a, b) => b.score - a.score);

      // Save candidate evaluations for this slot step
      if (slotIndex === 0) {
        slotReasoning.candidatesEvaluated = candidateEvaluations;
      }

      if (eligibleCandidates.length > 0) {
        const winner = eligibleCandidates[0];
        const winnerEmp = employees.find(e => e.id === winner.employeeId)!;

        // Commit assignment
        const newAssignment: ShiftAssignment = {
          id: `asg-${req.id}-${winner.employeeId}-${slotIndex}`,
          requirementId: req.id,
          employeeId: winner.employeeId,
          day: req.day,
          startTime: req.startTime,
          endTime: req.endTime,
          isManualOverride: false,
        };

        assignments.push(newAssignment);

        // Update tracking state
        const currentHours = employeeHours.get(winner.employeeId) || 0;
        employeeHours.set(winner.employeeId, Number((currentHours + shiftDuration).toFixed(2)));

        const dayShifts = employeeDailyShifts.get(winner.employeeId) || [];
        dayShifts.push({ day: req.day, start: req.startTime, end: req.endTime });
        employeeDailyShifts.set(winner.employeeId, dayShifts);

        const daysWorked = employeeDaysWorked.get(winner.employeeId) || new Set();
        daysWorked.add(req.day);
        employeeDaysWorked.set(winner.employeeId, daysWorked);

        totalSlotsFilled++;

        // Determine explanation bullet
        const reasons: string[] = [];
        if (winner.scoreBreakdown.preferenceMatch === 35) {
          reasons.push(`Prefers ${winnerEmp.preference} shifts`);
        }
        if (winner.scoreBreakdown.minHoursIncentive > 0) {
          reasons.push(
            `Below weekly minimum (${(employeeHours.get(winner.employeeId) || 0)}h/${winnerEmp.minWeeklyHours}h)`
          );
        }
        reasons.push(
          `Available capacity (${(employeeHours.get(winner.employeeId) || 0)}h/${winnerEmp.maxWeeklyHours}h)`
        );

        assignedForThisSlot.push({
          employeeId: winner.employeeId,
          name: winner.employeeName,
          score: winner.score,
          reasons,
        });
      } else {
        // Understaffed: No eligible candidate found
        const reasonsCount: Record<string, number> = {};
        for (const evalItem of candidateEvaluations) {
          for (const reason of evalItem.disqualificationReasons) {
            const normalized = reason.includes('weekly max')
              ? 'At maximum weekly hours limit'
              : reason.includes('unavailable') || reason.includes('outside')
              ? 'Unavailable at this time'
              : reason.includes('overlapping')
              ? 'Already assigned to overlapping shift'
              : reason;
            reasonsCount[normalized] = (reasonsCount[normalized] || 0) + 1;
          }
        }

        const bottleneckDetails = Object.entries(reasonsCount)
          .map(([r, c]) => `${c} staff: ${r}`)
          .join('; ');

        slotReasoning.bottleneckReason = bottleneckDetails || 'Insufficient eligible staff';
        break; // Cannot fill any more slots for this requirement
      }
    }

    slotReasoning.assignedEmployees = assignedForThisSlot;
    slotReasoning.unfulfilledCount = Math.max(0, req.requiredEmployees - assignedForThisSlot.length);
    reasoningList.push(slotReasoning);
  }

  const unfilledSlotsCount = totalSlotsRequested - totalSlotsFilled;
  const isFullyCovered = unfilledSlotsCount === 0;

  // High-level explanation points
  const explanationSummary: string[] = [
    `1. Scanned ${requirements.length} coverage requirements across Monday to Sunday (${totalSlotsRequested} total staff shifts needed).`,
    `2. Prioritized heavily constrained slots and specialized roles first using Minimum Remaining Values (MRV).`,
    `3. Hard constraints enforced: only staff available at that day/time, no overlapping shifts, correct role, and no one exceeds their weekly max hours.`,
    `4. Balanced workload by favoring employees with the highest remaining capacity.`,
    `5. Soft constraints: shift preferences (morning/afternoon) and progress toward weekly minimum hours used as tiebreakers.`,
  ];

  if (!isFullyCovered) {
    explanationSummary.push(
      `⚠ Result: ${unfilledSlotsCount} slots could not be staffed due to availability or maximum hour limits.`
    );
  } else {
    explanationSummary.push(`✓ Result: 100% of required shifts were successfully staffed.`);
  }

  return {
    assignments,
    reasoning: reasoningList,
    totalSlotsRequested,
    totalSlotsFilled,
    unfilledSlotsCount,
    isFullyCovered,
    explanationSummary,
  };
}
