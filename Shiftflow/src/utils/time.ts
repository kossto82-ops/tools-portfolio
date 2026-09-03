import { DayOfWeek, ShiftPreference, TimeSlot } from '../types';

/**
 * Converts "HH:mm" time string to minutes from midnight (0..1440)
 */
export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

/**
 * Converts minutes from midnight to "HH:mm"
 */
export function minutesToTime(minutes: number): string {
  const normalized = Math.max(0, Math.min(1440, minutes));
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Calculates duration in decimal hours between two "HH:mm" strings
 */
export function calculateDurationHours(startTime: string, endTime: string): number {
  const startMins = timeToMinutes(startTime);
  const endMins = timeToMinutes(endTime);
  if (endMins <= startMins) {
    return 0;
  }
  return Number(((endMins - startMins) / 60).toFixed(2));
}

/**
 * Checks if interval [start, end] is fully enclosed within an available window [windowStart, windowEnd]
 */
export function isWithinInterval(
  start: string,
  end: string,
  windowStart: string,
  windowEnd: string
): boolean {
  const s = timeToMinutes(start);
  const e = timeToMinutes(end);
  const ws = timeToMinutes(windowStart);
  const we = timeToMinutes(windowEnd);

  return s >= ws && e <= we;
}

/**
 * Checks if interval [start, end] is covered by any interval in the employee's available windows for that day
 */
export function isTimeSlotAvailable(
  startTime: string,
  endTime: string,
  availableIntervals: TimeSlot[]
): boolean {
  if (!availableIntervals || availableIntervals.length === 0) return false;
  return availableIntervals.some(interval =>
    isWithinInterval(startTime, endTime, interval.start, interval.end)
  );
}

/**
 * Checks if two time intervals overlap (strictly greater than 0 minute intersection)
 */
export function doIntervalsOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
): boolean {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);

  return s1 < e2 && e1 > s2;
}

/**
 * Classifies a shift as morning or afternoon based on start time
 */
export function classifyShiftType(startTime: string, _endTime: string): ShiftPreference {
  const startMins = timeToMinutes(startTime);
  // Before 13:00 is Morning, 13:00 and after is Afternoon
  return startMins < 13 * 60 ? 'morning' : 'afternoon';
}

/**
 * Day name formatters
 */
export const DAY_LABELS: Record<'en' | 'es', Record<DayOfWeek, { short: string; full: string }>> = {
  en: {
    monday: { short: 'Mon', full: 'Monday' },
    tuesday: { short: 'Tue', full: 'Tuesday' },
    wednesday: { short: 'Wed', full: 'Wednesday' },
    thursday: { short: 'Thu', full: 'Thursday' },
    friday: { short: 'Fri', full: 'Friday' },
    saturday: { short: 'Sat', full: 'Saturday' },
    sunday: { short: 'Sun', full: 'Sunday' },
  },
  es: {
    monday: { short: 'Lun', full: 'Lunes' },
    tuesday: { short: 'Mar', full: 'Martes' },
    wednesday: { short: 'Mié', full: 'Miércoles' },
    thursday: { short: 'Jue', full: 'Jueves' },
    friday: { short: 'Vie', full: 'Viernes' },
    saturday: { short: 'Sáb', full: 'Sábado' },
    sunday: { short: 'Dom', full: 'Domingo' },
  },
};
