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

## TL;DR

- **Generate** a full weekly roster from your team's availability, roles, and coverage needs.
- **Understand** why every decision was made — each slot shows the reasoning and the candidates that were rejected and why.
- **Intervene** with a What-If editor, then let the app re-validate the whole schedule in real time.
- **Run anywhere** — a static front-end with zero configuration. No database, no backend, no environment variables.

---

## Features

### Scheduling
- **Heuristic constraint-based generator** — builds a complete week of shifts in milliseconds.
- **Minimum Remaining Values (MRV)** ordering — the most constrained slots (fewest eligible staff, specialized roles) are filled first, so a rarely-available employee isn't "consumed" by an easy slot.
- **Scored candidate selection** — every eligible employee is ranked, and the best fit is chosen per slot.

### Hard constraints (always enforced)
| Constraint | What the engine guarantees |
| --- | --- |
| Availability | Staff are only assigned to days/times within their stated availability windows |
| No overlapping shifts | An employee is never on two simultaneous shifts |
| Role requirements | Slots that require a role (e.g. `manager`) are only filled by staff with that role |
| Weekly max hours | Nobody is assigned more hours than their contractual maximum |

### Soft constraints (used as tiebreakers)
- **Shift preferences** — if an employee prefers morning or afternoon shifts, the optimizer favors matching them.
- **Balanced workload** — employees with more remaining capacity are preferred, distributing hours fairly.
- **Weekly minimum hours** — staff below their minimum get prioritized so the team's commitment is met.

### Explanability
- **Transparency panel** — pick any slot to see which employees were considered, their scores, and exactly why each ineligible candidate was rejected (`unavailable`, `overlapping shift`, `role mismatch`, `would exceed weekly max hours`, etc.).
- **Bottleneck detection** — when a slot can't be filled, the app aggregates the reasons across all candidates (e.g. `"2 staff: Unavailable at this time"`).
- **Quality score (0–100)** — coverage %, hard/soft violations, preference satisfaction, and workload fairness are computed live after every change.

### Verification & What-If
- Every edit you make in the UI is **re-validated instantly** against the same constraint rules.
- **Manual overrides** are flagged, and you can **revert to the algorithmic baseline** at any time.
- Covered/understaffed/overstaffed status per slot, plus per-employee workload summaries.

### Export
- **CSV** download and a **printable** schedule view for the planning period.

---

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org/) 18+ (npm is bundled).

There is **no configuration step**. No `.env`, no API keys, no external services.

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server (http://localhost:3000)
npm run dev
```

Open <http://localhost:3000> and you're done. The app loads with a ready-to-use demo scenario so you can explore immediately.

> Trying it in another language? Use the language toggle in the sidebar (English / Español).

---

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the unit test suite (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Type-check the whole project with `tsc --noEmit` |
| `npm run clean` | Remove the `dist/` folder (cross-platform) |

---

## How the algorithm works

The scheduler is a **greedy constraint solver** with two phases:

1. **Order (MRV).** Requirements are sorted so that the ones with the smallest eligible candidate pool come first, with role-gated slots prioritized over unconstrained ones. This prevents early, easy assignments from starving later, harder ones.

2. **Assign.** For each slot, every employee is evaluated against the hard constraints. Ineligible candidates are rejected with a recorded reason. Eligible candidates are then scored:

   - **+100** base coverage contribution
   - **+35 / +15** if the shift matches their preference (`any` gets a small bonus)
   - **+0–30** proportional to **remaining capacity** (most-loaded staff score lower)
   - **+15** if the employee is below their weekly minimum hours
   - **+10** if the role matches an optional role preference
   - **−10** as a small fatigue penalty when an employee already works ≥5 days

   The highest-scoring eligible employee is assigned. If nobody is eligible, the slot is left unfilled — never compromised.

The same rules are encoded independently in [`src/engine/constraintEngine.ts`](src/engine/constraintEngine.ts), which **always** re-validates the complete schedule (including What-If edits) and reports violations and a quality score. The generator and the validator are kept separate on purpose: the validator is the source of truth.

### Where the code lives

```
src/
  engine/
    schedulingAlgorithm.ts   # the generator (heuristic + MRV + scoring)
    constraintEngine.ts      # the independent validator (hard/soft checks, quality score)
  components/
    AlgorithmTransparencyView.tsx  # per-slot reasoning & candidate breakdown
    AnalysisHubView.tsx            # conflicts + explainability hub
    ...
  data/presetScenarios.ts    # demo scenarios to explore the engine
  utils/time.ts              # time helpers (overlap, windows, shift types)
```

---

## Testing

The engine is covered by a deterministic test suite (Vitest) that verifies the contract: respecting hard constraints, order-independence via MRV, and the quality of the explanations.

```bash
npm test
```

Test files:

- [`tests/schedulingAlgorithm.test.ts`](tests/schedulingAlgorithm.test.ts) — the generator respects availability, overlaps, roles, and weekly max hours; produces explanations and bottleneck reasons; and is invariant to input order.
- [`tests/constraintEngine.test.ts`](tests/constraintEngine.test.ts) — the validator detects every violation type and computes coverage, fairness, and the quality score.

---

## Deployment

ShiftFlow is a **static front-end**. The build has no servers, no API calls, and uses relative asset paths (`base: './'`), so `dist/` works at the root of any host **and** in a subpath.

```bash
npm run build   # outputs to dist/
```

Then deploy `dist/` to any static host:

- **Vercel** → framework preset "Vite", build command `npm run build`, output `dist`
- **Netlify** → build command `npm run build`, publish directory `dist`
- **GitHub Pages** → publish the `dist/` folder
- **Any web server** (nginx, Apache, S3, Cloudflare Pages…) → serve `dist/`

Alternatively, verify the production bundle locally before deploying:

```bash
npm run preview
```

No runtime configuration, secrets, or environment variables are required in any environment.

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | [React 19](https://react.dev/) |
| Build tool | [Vite 6](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| Icons | [lucide-react](https://lucide.dev/) |
| Animations | [motion](https://motion.dev/) |
| Testing | [Vitest](https://vitest.dev/) |
| Language | TypeScript (`tsc --noEmit` type-checks cleanly) |

---

## Tech highlights

- **Dual-engine architecture** — a heuristic generator plus an independent validator keeps the source of truth separate and auditable.
- **Order-independent scheduling** — MRV ordering means results don't depend on how requirements are listed.
- **Explanations as data** — every decision (and every rejection) is part of the result object, ready to be rendered or exported.
- **Zero-dependency runtime** — everything runs in the browser; there is no backend to maintain.

---

## Roadmap ideas

- Persist scenarios (localStorage / file import-export of JSON).
- Multi-week planning and part-time/min-max hour reconciliation across weeks.
- Drag-and-drop roster editing with live constraint feedback.
- Hard constraint tuning (minimum rest between shifts, max consecutive days).

---

## License

[MIT](./LICENSE) — see the LICENSE file for details.

## Contributors

<a href="https://github.com/kossto82-ops">
  <img src="https://github.com/kossto82-ops.png" width="80" alt="Raúl Rodríguez Cruz" />
  <br />
  <b>Raúl Rodríguez Cruz</b>
  <br />
  <sub>@kossto82-ops</sub>
</a>