# Business Automation Tools

A collection of practical business automation tools built from real operational workflows.

These projects focus on a simple idea:

> **Identify repetitive operational work → design a better workflow → automate the execution → make the result easier to validate and use.**

The tools cover data processing, record matching, invoicing, employee directories, workforce scheduling, and operational reporting.

They are deliberately lightweight: several tools run entirely in the browser with no backend, database, or external service required.

---

## Why this repository exists

Many business processes still depend on spreadsheets, manual data preparation, repetitive checks, and people moving information between systems.

The problem is often not a lack of sophisticated technology.

It is that a relatively simple workflow is being performed manually hundreds of times.

This repository contains examples of how I approach those problems:

1. Understand the operational workflow.
2. Identify repetitive or error-prone steps.
3. Define the business rules.
4. Turn those rules into a usable workflow.
5. Automate the repetitive parts.
6. Keep validation and human decisions where they matter.
7. Make the output immediately useful to the person doing the work.

These are not built as isolated coding exercises. They are examples of **software applied to operational problems**.

---

## Tools

| Tool                               | Business problem             | What it does                                                                                                              |
| ---------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **ShiftFlow**                      | Workforce planning           | Generates and validates weekly schedules based on availability, roles, workload and coverage requirements.                |
| **Data Import & Cleanup Studio**   | Spreadsheet/data preparation | Guides users through importing, analysing, cleaning, mapping and validating CSV/Excel data.                               |
| **Hotel Mapping Tool**             | Record matching              | Matches child and master hotel records using multilingual name/address normalization and assisted mapping decisions.      |
| **Employee Directory Transformer** | HR data preparation          | Converts raw employee exports into structured, multilingual staff directories with automatic field mapping.               |
| **Invoicing Generator**            | Administrative processing    | Generates multilingual invoices and reports from multiple input files, including VAT handling and formatted Excel output. |
| **On-Call Roster Generator**       | Operational communication    | Converts shift/on-call spreadsheets into a mobile-friendly view of current and upcoming coverage.                         |
| **On-Call Scheduler FR**           | Operational communication    | French-language variant with search and filtering for easier access to on-call information.                               |

---

# Featured Projects

## ShiftFlow

### Workforce Scheduling & Operations

A constraint-aware workforce planning application designed to reduce the manual effort involved in building weekly schedules.

ShiftFlow considers:

* employee availability
* role requirements
* overlapping shifts
* contractual maximum hours
* minimum weekly hours
* shift preferences
* workload balance
* coverage requirements

The scheduling engine uses heuristic optimisation with **Minimum Remaining Values (MRV)** ordering, while an independent validation engine checks the resulting schedule.

The application also explains scheduling decisions and identifies why candidates were rejected.

**What it demonstrates:**

* operational problem modelling
* constraint-based reasoning
* algorithmic automation
* explainability
* human-in-the-loop workflows
* independent validation
* React / TypeScript application design

[Explore ShiftFlow](./Shiftflow)

---

## Data Import & Cleanup Studio

### From messy spreadsheets to validated data

A guided workflow for one of the most common operational problems: receiving a spreadsheet that is technically valid but not actually ready to use.

The tool takes the user through:

**Import → Analysis → Cleaning → Mapping → Preview → Validation → Export**

It identifies data-quality problems, helps map fields, provides a preview before export, and produces a validation report.

**What it demonstrates:**

* data-quality workflows
* business-rule validation
* spreadsheet automation
* progressive disclosure
* error prevention
* user-oriented tooling

[Explore Data Import & Cleanup Studio](./data-import-cleanup-studio)

---

## Hotel Mapping Tool

### Record matching across inconsistent data sources

Matching records across different datasets becomes difficult when names and addresses vary between languages, formats, and writing systems.

This tool helps match child records against master hotel records using normalization and assisted decision-making.

It supports multilingual normalization across:

* Korean
* CJK characters
* Arabic
* Cyrillic
* Devanagari

The workflow produces **Map / Investigate / No-Map** decisions while allowing human overrides when automated matching is not sufficiently reliable.

**What it demonstrates:**

* entity resolution
* multilingual data normalization
* confidence-aware workflows
* exception handling
* human verification
* structured exports

[Explore Hotel Mapping Tool](./hotel-mapping-tool)

---

## Employee Directory Transformer

### Turning raw HR exports into usable information

HR exports are often structured for systems rather than people.

This tool transforms raw employee data into structured, exportable staff directories, including automatic field mapping and multilingual output.

**What it demonstrates:**

* data transformation
* schema mapping
* document generation
* multilingual workflows
* spreadsheet automation

[Explore Employee Directory Transformer](./employee-directory-transformer)

---

## Invoicing Generator

### Automating repetitive administrative processing

A multilingual invoice and report generator designed to reduce repetitive manual preparation.

Features include:

* multiple input files
* VAT handling
* multilingual output
* Excel export
* formatted reports

Supported languages include:

**Spanish · English · French · German · Italian**

**What it demonstrates:**

* business-rule implementation
* document generation
* financial data handling
* structured exports
* administrative automation

[Explore Invoicing Generator](./invoicing-generator)

---

## On-Call Roster Generator

### Making operational schedules easier to consume

Operational teams often have the schedule in a spreadsheet but need the information in a much simpler format.

This tool converts an on-call or shift spreadsheet into an interactive, mobile-friendly view showing current and upcoming coverage by department.

The goal is not to replace the source system.

It is to remove unnecessary friction between the data and the person who needs the answer.

[Explore On-Call Roster Generator](./on-call-roster-generator)

---

## On-Call Scheduler FR

A French-language variant of the on-call scheduling workflow, adding search and filtering to make operational information easier to access.

[Explore On-Call Scheduler FR](./on-call-scheduler-fr)

---

# Design Principles

### Automate the repetitive work. Keep humans responsible for the decisions.

Automation is most useful when it removes mechanical work without hiding important decisions.

That means these tools deliberately use different levels of automation depending on the problem.

### Deterministic when rules are clear

Hard business rules should be enforced consistently.

Examples:

* an employee cannot be assigned outside their availability
* overlapping shifts should be rejected
* required roles must be respected
* invalid data should be surfaced before export

### Assistive when ambiguity exists

Some problems cannot be solved reliably with a single deterministic rule.

Record matching is a good example.

Instead of pretending the system is always correct, the workflow can surface uncertain cases for human review.

### Explainable when automation makes decisions

Where an algorithm makes a decision, understanding **why** matters.

This is particularly important for operational software, where users need to trust the result and be able to correct it.

---

# Technical Approach

The repository deliberately contains different levels of technical complexity.

Some tools are single-file browser applications because that is sufficient for the problem.

Others, such as ShiftFlow, use a full React/TypeScript architecture because the workflow requires a richer application model.

### Common characteristics

* Client-side processing where appropriate
* No unnecessary backend infrastructure
* Spreadsheet/CSV interoperability
* Explicit business rules
* Validation before output
* Human override where required
* Responsive interfaces
* Multilingual workflows where relevant

The architecture is chosen according to the **business problem**, rather than adding infrastructure simply to demonstrate technical complexity.

---

# Privacy by Design

Several tools process operational spreadsheets containing potentially sensitive business information.

For the browser-based tools in this repository:

**The processing happens locally in the browser.**

Files are uploaded into the application for processing but are not sent to a remote backend.

The public repository contains only sample or genericized data.

No real client, employee, or operational data is included.

---

# AI-Assisted Development

These projects were developed using AI-assisted coding workflows.

AI is used as a development force multiplier, but the responsibility for the solution remains human:

* defining the problem
* understanding the workflow
* deciding what should be automated
* defining business rules
* directing architecture
* reviewing generated code
* testing edge cases
* validating the output against the intended workflow

The objective is not simply to generate code faster.

It is to **turn operational knowledge into working software more efficiently**.

---

# What This Repository Demonstrates

This repository is intentionally different from a collection of generic CRUD applications or coding exercises.

It demonstrates the ability to move between several layers of a real business problem:

**Operational problem**

↓

**Workflow analysis**

↓

**Business rules**

↓

**Automation design**

↓

**Software implementation**

↓

**Validation**

↓

**Usable operational output**

That combination of operational understanding and technical execution is the main focus of this portfolio.

---

# Technology

Depending on the project, the repository uses:

* JavaScript
* TypeScript
* React
* Vite
* Tailwind CSS
* SheetJS
* PapaParse
* Vitest

The technology varies because the projects are designed around different operational requirements.

---

# Repository Structure

```text
tools-portfolio/
│
├── Shiftflow/
├── data-import-cleanup-studio/
├── employee-directory-transformer/
├── hotel-mapping-tool/
├── invoicing-generator/
├── on-call-roster-generator/
└── on-call-scheduler-fr/
```

Each project contains its own implementation and, where appropriate, its own documentation and instructions.

---

# Portfolio Context

These tools form one part of a broader portfolio focused on:

**Business Operations × Automation × AI × Software Systems**

Other projects explore different layers of the same problem space:

* **Enterprise Knowledge Platforms**
* **Workforce Operations**
* **AI Agent Orchestration**
* **Business Process Automation**

Together, they demonstrate a progression from automating individual workflows to designing larger software and AI systems.

---

# About

Built by **Raúl Rodríguez Cruz**.

Operations & CX professional turned AI-directed builder.

I combine operational experience with software development and AI-assisted engineering to build systems that solve practical business problems.

---

## License

Individual projects may have their own licensing terms. See the `LICENSE` file inside each project where applicable.
