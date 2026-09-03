import React, { useState, useMemo, useEffect } from 'react';
import {
  CoverageRequirement,
  DayOfWeek,
  Employee,
  Language,
  ScheduleScenario,
  ShiftAssignment,
  SlotAssignmentReasoning,
} from './types';
import {
  DEMO_RETAIL_SCENARIO,
  ALL_PRESET_SCENARIOS,
} from './data/presetScenarios';
import { generateScheduleHeuristic } from './engine/schedulingAlgorithm';
import { validateFullSchedule } from './engine/constraintEngine';
import { SidebarNav, NavigationSection } from './components/SidebarNav';
import { MobileNav } from './components/MobileNav';
import { ScheduleHeader, ScheduleViewMode } from './components/ScheduleHeader';
import { ScheduleQualityBanner } from './components/ScheduleQualityBanner';
import { WeeklyShiftGrid } from './components/WeeklyShiftGrid';
import { EmployeeWorkloadView } from './components/EmployeeWorkloadView';
import { StaffManagerView } from './components/StaffManagerView';
import { RequirementsManagerView } from './components/RequirementsManagerView';
import { AnalysisHubView } from './components/AnalysisHubView';
import { ManualEditModal } from './components/ManualEditModal';
import { CreateShiftModal } from './components/CreateShiftModal';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [lang, setLang] = useState<Language>('es');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(
    DEMO_RETAIL_SCENARIO.id
  );

  // Workforce & Requirements State
  const [employees, setEmployees] = useState<Employee[]>(
    DEMO_RETAIL_SCENARIO.employees
  );
  const [requirements, setRequirements] = useState<CoverageRequirement[]>(
    DEMO_RETAIL_SCENARIO.requirements
  );

  // Schedules State
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [algorithmicBaseline, setAlgorithmicBaseline] = useState<
    ShiftAssignment[]
  >([]);
  const [reasoningList, setReasoningList] = useState<SlotAssignmentReasoning[]>(
    []
  );

  // Navigation State
  const [currentSection, setCurrentSection] = useState<NavigationSection>('schedule');
  const [scheduleViewMode, setScheduleViewMode] = useState<ScheduleViewMode>('weekly-grid');

  // Modals & Action State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [slotEditorRequirementId, setSlotEditorRequirementId] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isCreateShiftOpen, setIsCreateShiftOpen] = useState<boolean>(false);
  const [createShiftDefaultDay, setCreateShiftDefaultDay] = useState<DayOfWeek>('monday');

  // Has manual overrides check
  const hasManualOverrides = useMemo(() => {
    return assignments.some(a => a.isManualOverride);
  }, [assignments]);

  // Real-time Schedule Validation (Source of Truth)
  const validationResult = useMemo(() => {
    return validateFullSchedule(requirements, employees, assignments);
  }, [requirements, employees, assignments]);

  // Initial generation on first mount
  useEffect(() => {
    runScheduler(DEMO_RETAIL_SCENARIO.requirements, DEMO_RETAIL_SCENARIO.employees);
  }, []);

  const runScheduler = (
    reqs: CoverageRequirement[],
    emps: Employee[]
  ) => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateScheduleHeuristic(reqs, emps);
      setAssignments(result.assignments);
      setAlgorithmicBaseline(result.assignments);
      setReasoningList(result.reasoning);
      setIsGenerating(false);
    }, 100);
  };

  const handleGenerate = () => {
    runScheduler(requirements, employees);
  };

  const handleToggleLang = () => {
    setLang(prev => (prev === 'en' ? 'es' : 'en'));
  };

  const handleSelectScenario = (scenario: ScheduleScenario) => {
    setSelectedScenarioId(scenario.id);
    setEmployees(scenario.employees);
    setRequirements(scenario.requirements);
    runScheduler(scenario.requirements, scenario.employees);
  };

  const handleLoadDemo = () => {
    handleSelectScenario(DEMO_RETAIL_SCENARIO);
  };

  const handleReset = () => {
    const sc =
      ALL_PRESET_SCENARIOS.find(s => s.id === selectedScenarioId) ||
      DEMO_RETAIL_SCENARIO;
    setEmployees(sc.employees);
    setRequirements(sc.requirements);
    runScheduler(sc.requirements, sc.employees);
  };

  const handleRevertToAlgorithmic = () => {
    setAssignments([...algorithmicBaseline]);
  };

  // Manual Assignment Handlers (What-If mode)
  const handleAssignEmployee = (
    requirementId: string,
    employeeId: string
  ) => {
    const targetReq = requirements.find(r => r.id === requirementId);
    if (!targetReq) return;

    const newAssignment: ShiftAssignment = {
      id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      requirementId,
      employeeId,
      day: targetReq.day,
      startTime: targetReq.startTime,
      endTime: targetReq.endTime,
      isManualOverride: true,
    };

    setAssignments(prev => [...prev, newAssignment]);
  };

  const handleRemoveAssignment = (assignmentId: string) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  // Employee management (Full CRUD)
  const handleAddEmployee = (emp: Employee) => {
    setEmployees(prev => [...prev, emp]);
  };

  const handleUpdateEmployee = (emp: Employee) => {
    setEmployees(prev => prev.map(e => (e.id === emp.id ? emp : e)));
  };

  const handleDeleteEmployee = (empId: string) => {
    setEmployees(prev => prev.filter(e => e.id !== empId));
    setAssignments(prev => prev.filter(a => a.employeeId !== empId));
  };

  // Requirements management (Full CRUD)
  const handleAddRequirement = (req: CoverageRequirement) => {
    setRequirements(prev => [...prev, req]);
  };

  const handleUpdateRequirement = (req: CoverageRequirement) => {
    setRequirements(prev => prev.map(r => (r.id === req.id ? req : r)));
  };

  const handleDeleteRequirement = (reqId: string) => {
    setRequirements(prev => prev.filter(r => r.id !== reqId));
    setAssignments(prev => prev.filter(a => a.requirementId !== reqId));
  };

  const handleInspectShift = (requirementId: string) => {
    setSlotEditorRequirementId(requirementId);
  };

  const handleOpenAddShift = (day?: DayOfWeek) => {
    setCreateShiftDefaultDay(day || 'monday');
    setIsCreateShiftOpen(true);
  };

  const activeRequirementForModal = useMemo(() => {
    if (!slotEditorRequirementId) return null;
    return requirements.find(r => r.id === slotEditorRequirementId) || null;
  }, [slotEditorRequirementId, requirements]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#111827] font-sans antialiased flex flex-col md:flex-row">
      {/* Desktop Vertical Restrained Sidebar */}
      <SidebarNav
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        lang={lang}
        onToggleLang={handleToggleLang}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        onReset={handleReset}
        onLoadDemo={handleLoadDemo}
        violationsCount={validationResult.violations.length}
      />

      {/* Mobile Top Header & Bottom Nav */}
      <MobileNav
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        lang={lang}
        onToggleLang={handleToggleLang}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        violationsCount={validationResult.violations.length}
      />

      {/* Primary Application Workspace - Full Width Responsive Grid */}
      <main className="flex-1 w-full px-3 sm:px-5 lg:px-6 xl:px-8 py-3.5 sm:py-4 space-y-3.5 pb-24 md:pb-8 min-w-0 overflow-x-hidden">
        {/* Section: SCHEDULE (Dominant Workspace) */}
        {currentSection === 'schedule' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Header with Title, Context & Primary Actions */}
            <ScheduleHeader
              viewMode={scheduleViewMode}
              onChangeViewMode={setScheduleViewMode}
              onOpenAddShift={() => handleOpenAddShift()}
              onOpenExport={() => setIsExportOpen(true)}
              hasManualOverrides={hasManualOverrides}
              onRevertToAlgorithmic={handleRevertToAlgorithmic}
              lang={lang}
            />

            {/* Quality & Constraint Health Overview */}
            <ScheduleQualityBanner
              quality={validationResult.quality}
              lang={lang}
              hasSchedule={assignments.length > 0}
            />

            {/* Schedule View Content */}
            {scheduleViewMode === 'weekly-grid' ? (
              <WeeklyShiftGrid
                requirements={requirements}
                employees={employees}
                assignments={assignments}
                coverage={validationResult.coverage}
                violations={validationResult.violations}
                lang={lang}
                onOpenSlotEditor={handleInspectShift}
                onOpenAddShift={handleOpenAddShift}
              />
            ) : (
              <EmployeeWorkloadView
                employees={employees}
                assignments={assignments}
                summaries={validationResult.employeeSummaries}
                lang={lang}
              />
            )}
          </div>
        )}

        {/* Section: TEAM (Staff Management & Workforce Rules) */}
        {currentSection === 'team' && (
          <div className="animate-in fade-in duration-150">
            <StaffManagerView
              employees={employees}
              lang={lang}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
              onDeleteEmployee={handleDeleteEmployee}
            />
          </div>
        )}

        {/* Section: REQUIREMENTS (Operational Demands & Operating Hours) */}
        {currentSection === 'requirements' && (
          <div className="animate-in fade-in duration-150">
            <RequirementsManagerView
              requirements={requirements}
              lang={lang}
              onAddRequirement={handleAddRequirement}
              onUpdateRequirement={handleUpdateRequirement}
              onDeleteRequirement={handleDeleteRequirement}
            />
          </div>
        )}

        {/* Section: ANALYSIS (Conflicts, Transparency & Quality Breakdown) */}
        {currentSection === 'analysis' && (
          <div className="animate-in fade-in duration-150">
            <AnalysisHubView
              violations={validationResult.violations}
              reasoningList={reasoningList}
              requirements={requirements}
              quality={validationResult.quality}
              lang={lang}
              onInspectShift={handleInspectShift}
            />
          </div>
        )}
      </main>

      {/* Interactive Slot Assignment & Shift Editor Modal */}
      <ManualEditModal
        isOpen={Boolean(slotEditorRequirementId)}
        onClose={() => setSlotEditorRequirementId(null)}
        requirement={activeRequirementForModal}
        employees={employees}
        assignments={assignments}
        lang={lang}
        onAssignEmployee={handleAssignEmployee}
        onRemoveAssignment={handleRemoveAssignment}
        onUpdateRequirement={handleUpdateRequirement}
        onDeleteRequirement={handleDeleteRequirement}
      />

      {/* Quick Add Shift Modal */}
      <CreateShiftModal
        isOpen={isCreateShiftOpen}
        onClose={() => setIsCreateShiftOpen(false)}
        defaultDay={createShiftDefaultDay}
        employees={employees}
        lang={lang}
        onAddRequirement={handleAddRequirement}
      />

      {/* Export / Print Schedule Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        requirements={requirements}
        employees={employees}
        assignments={assignments}
        employeeSummaries={validationResult.employeeSummaries}
        quality={validationResult.quality}
        lang={lang}
      />
    </div>
  );
}
