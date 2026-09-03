import { CoverageRequirement, Employee, ScheduleScenario } from '../types';

/**
 * Standard Demo: Metro Retail & Cafe
 * 8 employees, mixed full-time (40h, 32h) and part-time (20h, 24h, 16h)
 * Diverse preferences (morning, afternoon, flexible)
 * Coverage requirements across Mon-Sun with morning rush and afternoon shifts
 * Demonstrates balanced trade-offs, preference satisfaction, and realistic constraints
 */
export const DEMO_RETAIL_SCENARIO: ScheduleScenario = {
  id: 'demo-retail',
  name: 'Standard Demo: Metro Retail & Cafe',
  description: 'Realistic retail & cafe operation with 8 staff members, mixed contract hours, availability windows, and peak rush requirements.',
  businessType: 'Retail & Food Service',
  employees: [
    {
      id: 'emp-1',
      name: 'Ana Morales',
      role: 'Shift Supervisor',
      maxWeeklyHours: 40,
      minWeeklyHours: 32,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '08:00', end: '15:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#3b82f6',
    },
    {
      id: 'emp-2',
      name: 'Carlos Mendez',
      role: 'Senior Barista',
      maxWeeklyHours: 32,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '12:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '12:00', end: '21:00' }] },
        wednesday: { isAvailable: false, intervals: [] }, // Attends university courses on Wed
        thursday: { isAvailable: true, intervals: [{ start: '12:00', end: '21:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '12:00', end: '21:00' }] },
        saturday: { isAvailable: true, intervals: [{ start: '10:00', end: '19:00' }] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#10b981',
    },
    {
      id: 'emp-3',
      name: 'Laura Gomez',
      role: 'Sales Associate',
      maxWeeklyHours: 24,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        friday: { isAvailable: false, intervals: [] },
        saturday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#f59e0b',
    },
    {
      id: 'emp-4',
      name: 'David Ortiz',
      role: 'Operations & Stock',
      maxWeeklyHours: 35,
      minWeeklyHours: 25,
      preference: 'any',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        saturday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#8b5cf6',
    },
    {
      id: 'emp-5',
      name: 'Elena Vega',
      role: 'Sales Associate',
      maxWeeklyHours: 20,
      preference: 'morning',
      availability: {
        monday: { isAvailable: false, intervals: [] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '08:00', end: '14:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#ec4899',
    },
    {
      id: 'emp-6',
      name: 'Javier Castillo',
      role: 'Barista',
      maxWeeklyHours: 30,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        thursday: { isAvailable: false, intervals: [] },
        friday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        saturday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        sunday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
      },
      color: '#06b6d4',
    },
    {
      id: 'emp-7',
      name: 'Sofia Ruiz',
      role: 'Customer Support',
      maxWeeklyHours: 25,
      preference: 'any',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        tuesday: { isAvailable: false, intervals: [] },
        wednesday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        saturday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#14b8a6',
    },
    {
      id: 'emp-8',
      name: 'Mateo Ramos',
      role: 'Weekend Support',
      maxWeeklyHours: 16,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: false, intervals: [] },
        tuesday: { isAvailable: false, intervals: [] },
        wednesday: { isAvailable: false, intervals: [] },
        thursday: { isAvailable: false, intervals: [] },
        friday: { isAvailable: true, intervals: [{ start: '14:00', end: '21:00' }] },
        saturday: { isAvailable: true, intervals: [{ start: '10:00', end: '20:00' }] },
        sunday: { isAvailable: true, intervals: [{ start: '10:00', end: '20:00' }] },
      },
      color: '#64748b',
    },
  ],
  requirements: [
    // Monday
    { id: 'req-mon-1', day: 'monday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Prep & Open' },
    { id: 'req-mon-2', day: 'monday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Floor' },
    { id: 'req-mon-3', day: 'monday', startTime: '17:00', endTime: '21:00', requiredEmployees: 1, label: 'Evening Close' },

    // Tuesday
    { id: 'req-tue-1', day: 'tuesday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Prep & Open' },
    { id: 'req-tue-2', day: 'tuesday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Floor' },
    { id: 'req-tue-3', day: 'tuesday', startTime: '17:00', endTime: '21:00', requiredEmployees: 1, label: 'Evening Close' },

    // Wednesday
    { id: 'req-wed-1', day: 'wednesday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Prep & Open' },
    { id: 'req-wed-2', day: 'wednesday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Floor' },
    { id: 'req-wed-3', day: 'wednesday', startTime: '17:00', endTime: '21:00', requiredEmployees: 1, label: 'Evening Close' },

    // Thursday
    { id: 'req-thu-1', day: 'thursday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Prep & Open' },
    { id: 'req-thu-2', day: 'thursday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Floor' },
    { id: 'req-thu-3', day: 'thursday', startTime: '17:00', endTime: '21:00', requiredEmployees: 1, label: 'Evening Close' },

    // Friday (Rush)
    { id: 'req-fri-1', day: 'friday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Rush' },
    { id: 'req-fri-2', day: 'friday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Rush' },
    { id: 'req-fri-3', day: 'friday', startTime: '17:00', endTime: '21:00', requiredEmployees: 2, label: 'Friday Night Rush' },

    // Saturday
    { id: 'req-sat-1', day: 'saturday', startTime: '10:00', endTime: '14:00', requiredEmployees: 2, label: 'Weekend Brunch' },
    { id: 'req-sat-2', day: 'saturday', startTime: '14:00', endTime: '19:00', requiredEmployees: 2, label: 'Weekend Peak' },

    // Sunday (Light)
    { id: 'req-sun-1', day: 'sunday', startTime: '13:00', endTime: '18:00', requiredEmployees: 1, label: 'Sunday Shift' },
  ],
};

/**
 * Scenario A: Perfectly Feasible (Tech Support Team)
 * 6 employees with ample availability and well-matched shift preferences
 */
export const FEASIBLE_SCENARIO: ScheduleScenario = {
  id: 'feasible-cafe',
  name: 'Scenario A: Perfectly Feasible (Tech Support Team)',
  description: 'A 6-person team with compatible morning/afternoon schedules and sufficient hours to cover 100% of tickets with 0 constraint violations.',
  businessType: 'Helpdesk & Support',
  employees: [
    {
      id: 'fs-1',
      name: 'Alice Cooper',
      role: 'Support Tier 2',
      maxWeeklyHours: 40,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#3b82f6',
    },
    {
      id: 'fs-2',
      name: 'Brian Lee',
      role: 'Support Tier 1',
      maxWeeklyHours: 40,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#10b981',
    },
    {
      id: 'fs-3',
      name: 'Chloe Zhang',
      role: 'Support Tier 1',
      maxWeeklyHours: 35,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#f59e0b',
    },
    {
      id: 'fs-4',
      name: 'Daniel Evans',
      role: 'Support Tier 2',
      maxWeeklyHours: 35,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#8b5cf6',
    },
    {
      id: 'fs-5',
      name: 'Emma Watson',
      role: 'Support Tier 1',
      maxWeeklyHours: 20,
      preference: 'any',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        wednesday: { isAvailable: false, intervals: [] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        friday: { isAvailable: false, intervals: [] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#ec4899',
    },
    {
      id: 'fs-6',
      name: 'Frank Miller',
      role: 'Support Tier 1',
      maxWeeklyHours: 20,
      preference: 'any',
      availability: {
        monday: { isAvailable: false, intervals: [] },
        tuesday: { isAvailable: false, intervals: [] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        thursday: { isAvailable: false, intervals: [] },
        friday: { isAvailable: true, intervals: [{ start: '08:00', end: '21:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#06b6d4',
    },
  ],
  requirements: [
    { id: 'fs-req-mon-1', day: 'monday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Dispatch' },
    { id: 'fs-req-mon-2', day: 'monday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Queue' },
    { id: 'fs-req-tue-1', day: 'tuesday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Dispatch' },
    { id: 'fs-req-tue-2', day: 'tuesday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Queue' },
    { id: 'fs-req-wed-1', day: 'wednesday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Dispatch' },
    { id: 'fs-req-wed-2', day: 'wednesday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Queue' },
    { id: 'fs-req-thu-1', day: 'thursday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Dispatch' },
    { id: 'fs-req-thu-2', day: 'thursday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Queue' },
    { id: 'fs-req-fri-1', day: 'friday', startTime: '09:00', endTime: '13:00', requiredEmployees: 2, label: 'Morning Dispatch' },
    { id: 'fs-req-fri-2', day: 'friday', startTime: '13:00', endTime: '17:00', requiredEmployees: 2, label: 'Afternoon Queue' },
  ],
};

/**
 * Scenario B: Insufficient Staffing (Clinic Front Desk)
 * 3 staff members trying to fulfill 50 hours of desk coverage.
 * Illustrates clear understaffing detection and why slots remain unfilled.
 */
export const UNDERSTAFFED_SCENARIO: ScheduleScenario = {
  id: 'understaffed-clinic',
  name: 'Scenario B: Insufficient Staffing (Clinic Front Desk)',
  description: 'Understaffed team of only 3 receptionists attempting to cover a double-staffed clinic desk. Demonstrates how ShiftFlow identifies bottlenecks.',
  businessType: 'Medical Clinic',
  employees: [
    {
      id: 'cl-1',
      name: 'Maria Santos',
      role: 'Medical Receptionist',
      maxWeeklyHours: 35,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#3b82f6',
    },
    {
      id: 'cl-2',
      name: 'Julian Vance',
      role: 'Medical Receptionist',
      maxWeeklyHours: 30,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '12:00', end: '20:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '12:00', end: '20:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '12:00', end: '20:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '12:00', end: '20:00' }] },
        friday: { isAvailable: false, intervals: [] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#10b981',
    },
    {
      id: 'cl-3',
      name: 'Paula Hernandez',
      role: 'Triage Assistant',
      maxWeeklyHours: 20,
      preference: 'any',
      availability: {
        monday: { isAvailable: false, intervals: [] },
        tuesday: { isAvailable: false, intervals: [] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '08:00', end: '17:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#f59e0b',
    },
  ],
  requirements: [
    { id: 'cl-req-1', day: 'monday', startTime: '08:00', endTime: '13:00', requiredEmployees: 2, label: 'Intake Desk' },
    { id: 'cl-req-2', day: 'monday', startTime: '13:00', endTime: '18:00', requiredEmployees: 2, label: 'Appointments Desk' },
    { id: 'cl-req-3', day: 'tuesday', startTime: '08:00', endTime: '13:00', requiredEmployees: 2, label: 'Intake Desk' },
    { id: 'cl-req-4', day: 'tuesday', startTime: '13:00', endTime: '18:00', requiredEmployees: 2, label: 'Appointments Desk' },
    { id: 'cl-req-5', day: 'wednesday', startTime: '08:00', endTime: '13:00', requiredEmployees: 2, label: 'Intake Desk' },
    { id: 'cl-req-6', day: 'wednesday', startTime: '13:00', endTime: '18:00', requiredEmployees: 2, label: 'Appointments Desk' },
    { id: 'cl-req-7', day: 'thursday', startTime: '08:00', endTime: '13:00', requiredEmployees: 2, label: 'Intake Desk' },
    { id: 'cl-req-8', day: 'thursday', startTime: '13:00', endTime: '18:00', requiredEmployees: 2, label: 'Appointments Desk' },
    { id: 'cl-req-9', day: 'friday', startTime: '08:00', endTime: '13:00', requiredEmployees: 2, label: 'Intake Desk' },
    { id: 'cl-req-10', day: 'friday', startTime: '13:00', endTime: '18:00', requiredEmployees: 2, label: 'Appointments Desk' },
  ],
};

/**
 * Scenario C: Availability Conflicts (Weekend Retail Crunch)
 * 5 employees available during the week, but unavailable on Saturday/Sunday
 */
export const AVAILABILITY_CRUNCH_SCENARIO: ScheduleScenario = {
  id: 'availability-crunch',
  name: 'Scenario C: Weekend Availability Crunch (Retail Store)',
  description: 'Employees have weekday availability, but students & parents have hard restrictions on weekends, creating visible Saturday/Sunday gaps.',
  businessType: 'Boutique Store',
  employees: [
    {
      id: 'ac-1',
      name: 'Gabriel Rios',
      role: 'Store Associate',
      maxWeeklyHours: 35,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '09:00', end: '18:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#3b82f6',
    },
    {
      id: 'ac-2',
      name: 'Camila Navarro',
      role: 'Store Associate',
      maxWeeklyHours: 30,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#10b981',
    },
    {
      id: 'ac-3',
      name: 'Lucia Flores',
      role: 'Store Associate',
      maxWeeklyHours: 24,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#f59e0b',
    },
    {
      id: 'ac-4',
      name: 'Nico Duarte',
      role: 'Weekend Associate',
      maxWeeklyHours: 16,
      preference: 'any',
      availability: {
        monday: { isAvailable: false, intervals: [] },
        tuesday: { isAvailable: false, intervals: [] },
        wednesday: { isAvailable: false, intervals: [] },
        thursday: { isAvailable: false, intervals: [] },
        friday: { isAvailable: false, intervals: [] },
        saturday: { isAvailable: true, intervals: [{ start: '10:00', end: '18:00' }] },
        sunday: { isAvailable: true, intervals: [{ start: '10:00', end: '18:00' }] },
      },
      color: '#8b5cf6',
    },
  ],
  requirements: [
    { id: 'ac-req-1', day: 'monday', startTime: '09:00', endTime: '14:00', requiredEmployees: 1, label: 'Weekday Morning' },
    { id: 'ac-req-2', day: 'wednesday', startTime: '14:00', endTime: '19:00', requiredEmployees: 1, label: 'Weekday Afternoon' },
    { id: 'ac-req-3', day: 'friday', startTime: '09:00', endTime: '14:00', requiredEmployees: 1, label: 'Friday Morning' },
    { id: 'ac-req-4', day: 'saturday', startTime: '10:00', endTime: '14:00', requiredEmployees: 2, label: 'Saturday Rush 1' },
    { id: 'ac-req-5', day: 'saturday', startTime: '14:00', endTime: '18:00', requiredEmployees: 2, label: 'Saturday Rush 2' },
    { id: 'ac-req-6', day: 'sunday', startTime: '11:00', endTime: '16:00', requiredEmployees: 2, label: 'Sunday Peak' },
  ],
};

/**
 * Scenario D: Maximum-Hours Crunch
 * Part-time workers with strict contractual hour limits (15h - 20h)
 */
export const OVERTIME_TRADEOFF_SCENARIO: ScheduleScenario = {
  id: 'overtime-tradeoff',
  name: 'Scenario D: Maximum-Hours Crunch (Part-Time Heavy)',
  description: 'Team of 4 part-time workers with low max hour caps (16h - 20h) trying to handle full store operating schedule without overtime.',
  businessType: 'Bookstore',
  employees: [
    {
      id: 'ot-1',
      name: 'Victoria Silva',
      role: 'Bookseller',
      maxWeeklyHours: 16,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '09:00', end: '17:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#3b82f6',
    },
    {
      id: 'ot-2',
      name: 'Leo Martin',
      role: 'Bookseller',
      maxWeeklyHours: 16,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '13:00', end: '21:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#10b981',
    },
    {
      id: 'ot-3',
      name: 'Rosa Delgado',
      role: 'Bookseller',
      maxWeeklyHours: 20,
      preference: 'any',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '09:00', end: '21:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '09:00', end: '21:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '09:00', end: '21:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '09:00', end: '21:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '09:00', end: '21:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#f59e0b',
    },
    {
      id: 'ot-4',
      name: 'Samuel Torres',
      role: 'Bookseller',
      maxWeeklyHours: 16,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        friday: { isAvailable: true, intervals: [{ start: '09:00', end: '15:00' }] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#8b5cf6',
    },
  ],
  requirements: [
    { id: 'ot-req-1', day: 'monday', startTime: '09:00', endTime: '15:00', requiredEmployees: 2, label: 'Mon Day Shift (6h x 2 = 12h)' },
    { id: 'ot-req-2', day: 'tuesday', startTime: '09:00', endTime: '15:00', requiredEmployees: 2, label: 'Tue Day Shift (12h)' },
    { id: 'ot-req-3', day: 'wednesday', startTime: '09:00', endTime: '15:00', requiredEmployees: 2, label: 'Wed Day Shift (12h)' },
    { id: 'ot-req-4', day: 'thursday', startTime: '09:00', endTime: '15:00', requiredEmployees: 2, label: 'Thu Day Shift (12h)' },
    { id: 'ot-req-5', day: 'friday', startTime: '09:00', endTime: '15:00', requiredEmployees: 2, label: 'Fri Day Shift (12h)' },
    { id: 'ot-req-6', day: 'friday', startTime: '15:00', endTime: '21:00', requiredEmployees: 2, label: 'Fri Evening Shift (12h)' },
  ],
};

/**
 * Scenario E: Mathematically Impossible (Deficit Proof)
 * Requirements demand 120 hours of labor, but entire team maximum is only 60 hours.
 * Proves that ShiftFlow does not pretend an impossible schedule succeeded.
 */
export const IMPOSSIBLE_DEFICIT_SCENARIO: ScheduleScenario = {
  id: 'impossible-deficit',
  name: 'Scenario E: Mathematically Impossible (Deficit Proof)',
  description: 'Requirements require 120 hours of work, while total workforce capacity is strictly 64 hours. Proves mathematical impossibility handling.',
  businessType: '24/7 Dispatch Center',
  employees: [
    {
      id: 'imp-1',
      name: 'Alex Rivera',
      role: 'Dispatcher',
      maxWeeklyHours: 32,
      preference: 'morning',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '08:00', end: '16:00' }] },
        friday: { isAvailable: false, intervals: [] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#3b82f6',
    },
    {
      id: 'imp-2',
      name: 'Beatriz Luna',
      role: 'Dispatcher',
      maxWeeklyHours: 32,
      preference: 'afternoon',
      availability: {
        monday: { isAvailable: true, intervals: [{ start: '14:00', end: '22:00' }] },
        tuesday: { isAvailable: true, intervals: [{ start: '14:00', end: '22:00' }] },
        wednesday: { isAvailable: true, intervals: [{ start: '14:00', end: '22:00' }] },
        thursday: { isAvailable: true, intervals: [{ start: '14:00', end: '22:00' }] },
        friday: { isAvailable: false, intervals: [] },
        saturday: { isAvailable: false, intervals: [] },
        sunday: { isAvailable: false, intervals: [] },
      },
      color: '#10b981',
    },
  ],
  requirements: [
    { id: 'imp-req-1', day: 'monday', startTime: '08:00', endTime: '16:00', requiredEmployees: 2, label: 'Mon Day Dispatch (16h)' },
    { id: 'imp-req-2', day: 'monday', startTime: '16:00', endTime: '22:00', requiredEmployees: 2, label: 'Mon Night Dispatch (12h)' },
    { id: 'imp-req-3', day: 'tuesday', startTime: '08:00', endTime: '16:00', requiredEmployees: 2, label: 'Tue Day Dispatch (16h)' },
    { id: 'imp-req-4', day: 'tuesday', startTime: '16:00', endTime: '22:00', requiredEmployees: 2, label: 'Tue Night Dispatch (12h)' },
    { id: 'imp-req-5', day: 'wednesday', startTime: '08:00', endTime: '16:00', requiredEmployees: 2, label: 'Wed Day Dispatch (16h)' },
    { id: 'imp-req-6', day: 'wednesday', startTime: '16:00', endTime: '22:00', requiredEmployees: 2, label: 'Wed Night Dispatch (12h)' },
    { id: 'imp-req-7', day: 'thursday', startTime: '08:00', endTime: '16:00', requiredEmployees: 2, label: 'Thu Day Dispatch (16h)' },
    { id: 'imp-req-8', day: 'friday', startTime: '08:00', endTime: '16:00', requiredEmployees: 2, label: 'Fri Day Dispatch (16h)' },
  ],
};

/**
 * Blank Scenario (Start from scratch)
 */
export const EMPTY_SCENARIO: ScheduleScenario = {
  id: 'empty',
  name: 'Blank Slate (Configure from Scratch)',
  description: 'Empty workforce and coverage requirements. Enter your own employees and shift requirements.',
  businessType: 'Custom Business',
  employees: [],
  requirements: [],
};

export const ALL_PRESET_SCENARIOS: ScheduleScenario[] = [
  DEMO_RETAIL_SCENARIO,
  FEASIBLE_SCENARIO,
  UNDERSTAFFED_SCENARIO,
  AVAILABILITY_CRUNCH_SCENARIO,
  OVERTIME_TRADEOFF_SCENARIO,
  IMPOSSIBLE_DEFICIT_SCENARIO,
  EMPTY_SCENARIO,
];
