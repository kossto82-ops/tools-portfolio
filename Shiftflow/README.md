<div align="center">

# ShiftFlow

**Workforce Scheduling & Shift Planner**

Constraint-based weekly planning, automated heuristic scheduling, conflict detection, and coverage analysis. 100% on-device — no AI, no API keys, no servers.

![ShiftFlow Screenshot](docs/screenshot.png)

![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite)
![Tests](https://img.shields.io/badge/tests-21%20passing-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

</div>

---
# ShiftFlow — Workforce Scheduling & Operations

**Turn workforce planning from a manual process into a constraint-aware workflow.**

ShiftFlow is a workforce scheduling application designed to help teams create workable schedules while making **availability conflicts, coverage gaps and operational constraints** visible.

It was built around a real-world operations problem:

> **Creating a good schedule is not simply assigning people to shifts. It means balancing availability, coverage, rules and operational requirements at the same time.**

---

## 🎯 The Problem

Workforce scheduling can quickly become a manual optimisation problem.

A planner may need to consider:

* Employee availability
* Shift requirements
* Minimum coverage
* Maximum workload
* Existing assignments
* Conflicting shifts
* Operational rules
* Unresolved staffing gaps

When these constraints are handled manually, changing one assignment can create problems elsewhere.

The objective of ShiftFlow is to make those constraints explicit and help planners identify problems before a schedule is finalized.

---

# 💡 The Solution

ShiftFlow provides a workflow for:

```text
Define Workforce
       ↓
Configure Availability
       ↓
Define Shift Requirements
       ↓
Generate Schedule
       ↓
Validate Constraints
       ↓
Review Conflicts
       ↓
Analyse Coverage
       ↓
Finalize Schedule
```

The system is designed around the **planning workflow**, rather than simply providing a calendar UI.

---

# ✨ Core Capabilities

### Workforce Management

Manage the people involved in the scheduling process and their relevant availability.

### Shift Planning

Create and organize shifts according to operational requirements.

### Constraint Awareness

The scheduling process considers multiple constraints instead of treating every assignment independently.

### Conflict Detection

Identify scheduling problems such as incompatible assignments or availability conflicts.

### Coverage Analysis

Make staffing gaps visible so planners can identify where operational requirements are not being met.

### Schedule Review

Allow the planner to inspect and adjust the generated result rather than treating automation as a black box.

---

# 🧠 Scheduling Approach

ShiftFlow uses a **heuristic scheduling approach** rather than attempting to solve the entire scheduling problem through brute force.

The scheduler evaluates available assignments against operational constraints and attempts to produce a feasible schedule.

Conceptually:

```text
Employees
    +
Availability
    +
Shift Requirements
    +
Scheduling Constraints
          ↓
    Scheduling Engine
          ↓
    Candidate Schedule
          ↓
       Validation
          ↓
 ┌────────┴────────┐
 │                 │
 ▼                 ▼
Valid          Conflicts
Schedule       / Gaps
```

This approach keeps the system practical while making unresolved constraints visible to the user.

---

# 🔎 Constraints & Validation

A schedule is only useful if it works operationally.

ShiftFlow therefore separates:

**Schedule generation**

from

**Schedule validation**

This allows the system to distinguish between:

* assignments that can be made
* assignments that conflict
* coverage requirements that are not satisfied
* constraints that remain unresolved

The result is not simply:

> **"Here is a schedule."**

It is:

> **"Here is the best schedule the system could construct, and here are the problems you still need to address."**

That distinction is important in real operational workflows.

---

# 🖥️ Product Design

The interface is designed around the way an operations planner actually reviews a schedule.

The objective is to make important information visible without forcing the user to inspect every assignment manually.

Key principles include:

* Clear schedule visibility
* Fast identification of conflicts
* Coverage awareness
* Minimal unnecessary interaction
* Human review after automated planning
* Operational information prioritized over decorative UI

Automation assists the planner.

**The planner remains in control.**

---

# 🏗️ Architecture

At a high level:

```text
┌──────────────────────────┐
│        React UI          │
│ Workforce / Scheduling   │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Scheduling Workflow    │
│                          │
│ Requirements             │
│ Availability             │
│ Constraints              │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│   Scheduling Engine      │
│                          │
│ Assignment heuristics    │
│ Constraint evaluation    │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      Validation          │
│                          │
│ Conflicts                │
│ Coverage                 │
│ Unresolved constraints   │
└──────────────────────────┘
```

The separation between the user workflow, scheduling logic and validation makes the system easier to reason about and extend.

---

# 🧪 Validation & Testing

Scheduling systems are particularly sensitive to edge cases.

A small change in an assignment can affect multiple constraints.

For that reason, the project treats scheduling logic as business-critical application logic rather than simple UI behaviour.

Testing focuses on areas such as:

* Scheduling rules
* Constraint handling
* Conflict detection
* Coverage calculations
* Edge cases
* User workflow behaviour

---

# 🚀 Live Demo

**[Try ShiftFlow](https://tools-portfolio-z8f9.vercel.app/)**

The deployed application provides a browser-based demonstration of the scheduling workflow.

---

# 🛠️ Technology

**Frontend**

* React
* TypeScript
* Vite

**Application**

* Scheduling logic
* Constraint evaluation
* Conflict detection
* Coverage analysis

**Development**

* Modern JavaScript / TypeScript tooling
* Automated validation
* GitHub-based development workflow

---

# 📈 Business Value

ShiftFlow is designed around a simple operational objective:

### Reduce manual scheduling effort.

Instead of repeatedly checking every employee and every shift manually, the system helps surface:

* Where coverage is insufficient
* Where assignments conflict
* Which constraints remain unresolved
* Which parts of the schedule require human attention

The system therefore acts as a **planning assistant**, not an autonomous decision-maker.

---

# 🔄 Why Automation Instead of a Simple Calendar?

A conventional calendar can display assignments.

It does not necessarily understand whether those assignments make operational sense.

ShiftFlow treats scheduling as a **constraint problem**.

That means the system can reason about the relationship between:

```text
People
   ↕
Availability
   ↕
Shifts
   ↕
Coverage
   ↕
Constraints
```

This is the core difference between a scheduling interface and a scheduling system.

---

# 🧩 What This Project Demonstrates

### Business / Operations

* Workflow analysis
* Constraint modelling
* Workforce planning
* Operational problem solving
* Human-in-the-loop automation

### Product

* Workflow-oriented UX
* Information prioritization
* Exception handling
* Decision-support design

### Engineering

* React
* TypeScript
* Application architecture
* Scheduling algorithms
* Business logic
* Validation

---

# 🧠 Design Philosophy

ShiftFlow follows a simple principle:

> **Automate the repetitive work. Keep humans responsible for the decisions.**

Scheduling software should not hide uncertainty behind an apparently perfect result.

A useful system should show:

**What works.**

**What conflicts.**

**What is missing.**

**What requires human attention.**

---

# 👤 About the Project

ShiftFlow is part of my exploration of **business operations automation**.

My background is in Operations and Customer Experience, so the project starts from the operational problem rather than from a technical exercise.

The objective is to combine that domain understanding with software development to build tools that make real workflows easier, faster and more reliable.

---

## License

See the repository license for details.
