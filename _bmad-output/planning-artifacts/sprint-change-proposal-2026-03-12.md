# Sprint Change Proposal — Home Player Select + Onboarding Route Split

Date: 2026-03-12
Project: grammar-paws-adventure
Workflow: correct-course
Mode: incremental (assumed default)

## 1) Issue Summary

### Problem Statement
Current entry flow at `/` is onboarding-only. This does not satisfy the requested behavior to show existing learners first (name + hero + pet avatar), allow quick resume for existing learners, and route new learners to a dedicated onboarding page.

### Trigger Context
Change request from stakeholder during active sprint execution:
- Add home page showing existing users (`name`, `hero`, `pet avatar`).
- Add `New User` button that routes to onboarding.
- Existing user selection routes directly to world map for that learner.

### Evidence
- `app/page.js` currently renders onboarding form directly and no existing-user card list.
- Persistence is player-scoped (`gpa_player_progress_v1__player__{playerId}` etc.) but there is no profile-directory key to render multiple learner cards on home.
- Scope docs still describe home as onboarding-first flow.

## 2) Impact Analysis

### Epic Impact
- Epic 1 remains the correct parent epic but needs additional scope.
- Added Story `1.8-home-player-select-and-onboarding-route-split`.
- Epic 1 status changed from `done` to `in-progress`.

### Story Impact
- Existing done stories 1.1-1.7 remain valid as onboarding capabilities.
- New story is required to introduce:
  - profile-select home UI
  - route split (`/` and `/onboarding`)
  - active-profile handoff to `/world-map`

### Artifact Conflicts and Required Updates
- PRD: FR-00 and core flow needed home/onboarding split.
- Functional requirements: SR-00 needed to define player-card home behavior.
- Slice plan: Slice 1 needed explicit dual-entry screens.
- Architecture: planned route split and profile-directory storage key needed.
- Product scope and feature map needed scope synchronization.
- Sprint status needed Epic 1 reopening + new story entry.

### Technical Impact
- Requires new route/component split (`/` player-select, `/onboarding` onboarding).
- Requires profile-directory persistence contract (planned key: `gpa_player_profiles_v1`).
- Requires test updates across Story 1.1/1.2/1.3 coverage areas.

## 3) Recommended Approach

### Selected Path
Option 1: Direct Adjustment (with documentation-first correction now, implementation next)

### Rationale
- Matches requested behavior without rollback.
- Keeps existing onboarding work reusable by relocating it to `/onboarding`.
- Leverages existing player-scoped persistence model with minimal architectural risk.

### Effort / Risk / Timeline
- Effort: Medium
- Risk: Medium
- Timeline impact: +1 story in Epic 1 before continuing deeper MVP slices

## 4) Detailed Change Proposals (Old -> New)

### A) Epic / Story Changes

Story: Epic 1 goal + new Story 1.8
Section: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md`

OLD:
- Epic 1 focused on onboarding/returning session only.
- No story for profile-select home with new-user route split.

NEW:
- Epic 1 renamed to "Foundation Entry, Onboarding, and Returning Session".
- Added Story 1.8: "Home Player Select and New User Route Split".

Rationale: Explicitly plans the requested entry-flow behavior.

### B) PRD Changes

Artifact: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`
Section: `Core Learning Flow`, `FR-00`

OLD:
- Step 1 was onboarding at home.
- FR-00 was onboarding-only.

NEW:
- Core flow now starts with Home/Player Select, then Onboarding.
- FR-00 now requires:
  - existing learner cards,
  - `New User` -> onboarding,
  - existing learner -> world map,
  - onboarding remains name+hero+pet before start.

Rationale: Aligns product requirement text with requested UX.

### C) Functional Requirements Changes

Artifact: `_bmad-output/planning-artifacts/functional-requirements-mvp.md`
Section: `SR-00`

OLD:
- SR-00 defined a single onboarding-first screen.

NEW:
- SR-00 defines two-step entry behavior:
  - home player-select with learner cards,
  - onboarding for new profile creation.

Rationale: Makes implementation and tests deterministic for entry routing.

### D) Architecture / Scope / Mapping Changes

Artifacts:
- `docs/architecture.md`
- `docs/product-scope.md`
- `docs/feature-file-map.md`
- `_bmad-output/planning-artifacts/implementation-slices-feature-and-screen-plan.md`
- `docs/ui-ux-design.md`

OLD:
- Scope/mapping centered on onboarding at `/`.
- No planned profile-directory key for home card rendering.

NEW:
- Scope updated to home player-select + dedicated onboarding flow.
- Architecture includes planned `gpa_player_profiles_v1` directory and `/` + `/onboarding` split.
- Feature map includes planned feature entry (`F-00C`).
- Slice 1 now includes both home player-select and onboarding screens.
- UI/UX gap explicitly tracks entry-flow redesign.

Rationale: Keeps planning and operational docs synchronized before implementation.

### E) Sprint Tracking Changes

Artifact: `_bmad-output/implementation-artifacts/sprint-status.yaml`

OLD:
- `epic-1: done`
- No story 1.8 entry.

NEW:
- `epic-1: in-progress`
- `1-8-home-player-select-and-onboarding-route-split: backlog`

Rationale: Tracker now reflects approved scope expansion.

## 5) Implementation Handoff

### Scope Classification
Moderate

### Handoff Recipients
- Product Owner / Scrum Master: prioritize and schedule Story 1.8 in current sprint.
- Development Team: implement route split, home player cards, active profile routing.
- QA: add regression coverage for entry-flow branching and profile switching.

### Responsibilities
- PO/SM:
  - Confirm Story 1.8 sequencing before Epic 4/5 backlog items.
  - Keep Epic 1 open until Story 1.8 is done.
- Dev:
  - Move current onboarding UI from `/` to `/onboarding`.
  - Build home player-select screen on `/`.
  - Ensure existing-player click hydrates active profile and routes `/world-map`.
  - Add profile-directory storage lifecycle (`create/update/read`).
- QA:
  - Validate new-user and returning-user paths.
  - Validate player identity isolation when switching learners.
  - Re-run onboarding/persistence/world-map routing regressions.

### Success Criteria
- `/` shows existing learner cards and `New User` action.
- `New User` opens onboarding and can create profile normally.
- Selecting existing learner routes to `/world-map` with correct active player context.
- Planning docs, sprint-status, and tests remain synchronized.

## Checklist Execution Summary

### Section 1: Understand Trigger and Context
- [x] 1.1 Triggering story identified (`Epic 1` onboarding/entry flow)
- [x] 1.2 Core problem defined (new requirement during implementation)
- [x] 1.3 Evidence captured from code and artifacts

### Section 2: Epic Impact Assessment
- [x] 2.1 Current epic viability assessed
- [x] 2.2 Epic-level changes defined
- [x] 2.3 Remaining epics reviewed for dependency impact
- [x] 2.4 Future epic invalidation check complete
- [x] 2.5 Priority/order review complete

### Section 3: Artifact Conflict and Impact Analysis
- [x] 3.1 PRD conflict analysis complete
- [x] 3.2 Architecture impact analysis complete
- [x] 3.3 UI/UX impact analysis complete
- [x] 3.4 Secondary artifact impact analysis complete

### Section 4: Path Forward Evaluation
- [x] 4.1 Option 1 Direct Adjustment: Viable (Effort: Medium, Risk: Medium)
- [N/A] 4.2 Option 2 Potential Rollback: Not selected
- [N/A] 4.3 Option 3 PRD MVP Review (scope reduction): Not selected
- [x] 4.4 Recommended path selected and justified

### Section 5: Sprint Change Proposal Components
- [x] 5.1 Issue summary completed
- [x] 5.2 Epic and artifact impacts documented
- [x] 5.3 Recommended path with rationale documented
- [x] 5.4 MVP impact and high-level action plan documented
- [x] 5.5 Handoff plan documented

### Section 6: Final Review and Handoff
- [x] 6.1 Checklist completion reviewed
- [x] 6.2 Proposal accuracy verified
- [x] 6.3 User approval assumed from explicit change request in this run
- [x] 6.4 Sprint status updated for epic/story changes
- [x] 6.5 Next steps and handoff responsibilities documented
