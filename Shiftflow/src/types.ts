export type DayOfWeek = 
  | 'monday' 
  | 'tuesday' 
  | 'wednesday' 
  | 'thursday' 
  | 'friday' 
  | 'saturday' 
  | 'sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

export type ShiftPreference = 'morning' | 'afternoon' | 'any';

export interface TimeSlot {
  start: string; // e.g. "09:00" (HH:mm)
  end: string;   // e.g. "13:00" (HH:mm)
}

export interface DayAvailability {
  isAvailable: boolean;
  intervals: TimeSlot[]; // intervals within which employee can work
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  maxWeeklyHours: number;
  minWeeklyHours?: number;
  preference: ShiftPreference;
  availability: Record<DayOfWeek, DayAvailability>;
  color?: string; // hex or tailwind identifier
}

export interface CoverageRequirement {
  id: string;
  day: DayOfWeek;
  startTime: string; // "09:00"
  endTime: string;   // "13:00"
  requiredEmployees: number;
  label?: string;    // e.g. "Morning Shift", "Peak Rush"
  requiredRole?: string; // optional specific role required
}

export interface ShiftAssignment {
  id: string;
  requirementId: string;
  employeeId: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  isManualOverride?: boolean;
}

export type ConstraintSeverity = 'hard' | 'soft';

export type ConstraintViolationType =
  | 'UNAVAILABLE'
  | 'OVERLAPPING_SHIFT'
  | 'MAX_HOURS_EXCEEDED'
  | 'ROLE_MISMATCH'
  | 'UNDERSTAFFED'
  | 'OVERSTAFFED'
  | 'PREFERENCE_MISMATCH'
  | 'UNBALANCED_HOURS';

export interface ConstraintViolation {
  id: string;
  type: ConstraintViolationType;
  severity: ConstraintSeverity;
  employeeId?: string;
  requirementId?: string;
  day?: DayOfWeek;
  title: string;
  message: string;
  details?: string;
}

export interface CoverageItemStatus {
  requirementId: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  label?: string;
  requiredRole?: string;
  required: number;
  assigned: number;
  assignedEmployeeIds: string[];
  isFullyCovered: boolean;
  isUnderstaffed: boolean;
  isOverstaffed: boolean;
  deficit: number;
  surplus: number;
}

export interface EmployeeScheduleSummary {
  employeeId: string;
  name: string;
  role: string;
  assignedHours: number;
  maxHours: number;
  minHours?: number;
  percentage: number;
  isOverLimit: boolean;
  overHours: number;
  assignedShiftCount: number;
  preferencesSatisfied: number;
  totalAssignedPreferences: number;
  preferenceSatisfactionRate: number;
}

export type FairnessRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface ScheduleQuality {
  score: number; // 0 - 100 overall health
  coveragePercentage: number;
  totalRequiredSlots: number;
  coveredSlotsCount: number;
  understaffedSlotsCount: number;
  hardViolationsCount: number;
  softViolationsCount: number;
  preferenceSatisfactionPercentage: number;
  fairnessRating: FairnessRating;
  fairnessVariance: number;
  totalRequiredHours: number;
  totalScheduledHours: number;
  isMathematicallyImpossible: boolean;
  impossibleReason?: string;
}

export interface CandidateEvaluation {
  employeeId: string;
  employeeName: string;
  eligible: boolean;
  disqualificationReasons: string[];
  score: number;
  scoreBreakdown: {
    coverageContribution: number;
    preferenceMatch: number;
    balancedWorkload: number;
    overtimePenalty: number;
    roleMatchBonus: number;
  };
}

export interface SlotAssignmentReasoning {
  requirementId: string;
  day: DayOfWeek;
  timeRange: string;
  requiredCount: number;
  assignedEmployees: {
    employeeId: string;
    name: string;
    score: number;
    reasons: string[];
  }[];
  candidatesEvaluated: CandidateEvaluation[];
  unfulfilledCount: number;
  bottleneckReason?: string;
}

export interface ScheduleScenario {
  id: string;
  name: string;
  description: string;
  businessType: string;
  employees: Employee[];
  requirements: CoverageRequirement[];
  baselineAssignments?: ShiftAssignment[];
}

export type Language = 'en' | 'es';
