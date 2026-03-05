# Sprint Change Proposal — Challenge Page Guided Correction Update

Date: 2026-03-05
Project: grammar-paws-adventure
Workflow: correct-course
Mode: batch (auto-approved by user)

## 1) Issue Summary

### Problem Statement
Current challenge implementation and planning artifacts do not fully support the new guided-correction learning design for Screen 4 (`/challenge`). The current scope is missing a structured 2-attempt + assisted flow, quality-based performance indicators, and explicit XP logic that rewards learning quality rather than raw correctness.

### Trigger Context
The issue was discovered during active challenge-page implementation refinement. New design direction requires:
- Guided correction with finite attempts.
- Non-punitive feedback language and indicators.
- Stronger hint/explanation separation.
- XP and progression tied to attempt quality and streak behavior.

### Evidence
- Existing epic/story set covers challenge basics but not full attempt-state behavior.
- PRD FR-03/FR-04/FR-06 were too high-level for the required UX/state logic.
- UX Screen 4 spec still described placeholder/static behavior.
- Architecture lacked an explicit challenge state machine and scoring contract.

## 2) Impact Analysis

### Epic Impact
- Epic 2 remains valid but requires story-level expansion for performance indicators and interaction feedback.
- Epic 3 requires stronger scope around attempt-stage progression and XP-quality model.

### Story Impact
- Updated scope: 2.3, 3.1, 3.2, 3.3.
- Added stories: 2.5, 3.4.

### Artifact Conflicts / Updates Needed
- PRD: functional requirement detail expansion for guided retry, explanation timing, option limits, and XP rules.
- Epics: updated story intents and additions for missing behavior.
- UI/UX: Screen 4 behavior rewritten from placeholder to interaction-state design.
- Architecture: explicit runtime state model for challenge flow and scoring.
- Sprint status tracker: story registry update for new stories.

### Technical Impact
- Requires challenge state machine implementation across UI logic.
- Requires scoring engine updates (attempt-quality XP + streak/persistence bonuses).
- Requires test updates (unit/integration/acceptance) for state transitions and indicator rules.

## 3) Recommended Approach

### Selected Path
Hybrid approach:
1. Direct adjustment to existing epics/stories and docs.
2. PRD/Architecture/UX refinement to encode precise behavior contracts.
3. Backlog update to include missing stories before continuing implementation.

### Why This Path
- Preserves current sprint momentum.
- Avoids rollback churn.
- Makes implementation deterministic and testable.
- Aligns product behavior with child-friendly learning outcomes.

### Effort / Risk / Timeline
- Effort: Medium-High.
- Risk: Medium.
- Timeline impact: +1 planning/update cycle before full feature completion.

## 4) Detailed Change Proposals (Old -> New)

### A) Story and Epic Changes

#### Story: 2.3 (Epic 2)
Section: Story title and intent

OLD:
- Story 2.3: Immediate Correctness and Explanation Feedback
- "I want explanation after every answer"

NEW:
- Story 2.3: Guided Feedback and Explanation States
- "I want hints before answer and explanation after answer"

Rationale: Encodes hint-vs-explanation separation and anti-guessing behavior.

#### Story: 2.5 (Epic 2) [Added]
Section: New story

OLD:
- Not present

NEW:
- Story 2.5: Performance Indicators and Answer Micro-Interactions
- Tracks `⭐`, `☆`, `✓` and interaction feedback behavior.

Rationale: Missing story for quality indicators and interaction-state UX.

#### Story: 3.1 (Epic 3)
Section: Story title and intent

OLD:
- Story 3.1: Score Calculation and Pass Threshold

NEW:
- Story 3.1: XP and Pass Threshold Calculation

Rationale: Broadens scoring from pass/fail to quality-based XP.

#### Story: 3.2 (Epic 3)
Section: Story title and intent

OLD:
- Story 3.2: Fail Path Supportive Retry Experience

NEW:
- Story 3.2: Two-Attempt Guided Retry and Assisted Resolution

Rationale: Defines finite retry model and assisted stage.

#### Story: 3.3 (Epic 3)
Section: Story title and intent

OLD:
- Story 3.3: Pass Path Continue to Reward

NEW:
- Story 3.3: Continue Flow After Correct or Assisted Acknowledge

Rationale: Adds closure requirement via "I understand" in assisted state.

#### Story: 3.4 (Epic 3) [Added]
Section: New story

OLD:
- Not present

NEW:
- Story 3.4: Streak and Persistence Bonus Awards

Rationale: Covers explicit bonus mechanics from new design.

### B) PRD Changes

#### Artifact: PRD
Section: FR-02, FR-03, FR-04, FR-06, FR-07

OLD:
- FR-03 and FR-04 had generic feedback/retry language.
- FR-06 had progression but no XP formula specifics.
- FR-02 lacked explicit option-count constraints.

NEW:
- Added 2-attempt + assisted stage contract.
- Added hint-only pre-answer and explanation-style post-answer behavior.
- Added non-punitive UI language requirement.
- Added option cap (2 early, max 3 mid, MVP cap 3).
- Added base XP, streak bonus, and persistence bonus rules.
- Added indicator semantics (`⭐`, `☆`, `✓`).

Rationale: Makes challenge behavior measurable, testable, and implementation-ready.

### C) Architecture Changes

#### Artifact: Architecture
Section: New "Challenge Runtime State Model (Planned MVP)"

OLD:
- No explicit challenge state machine/scoring contract.

NEW:
- Added state lifecycle from loading -> attempts -> assisted -> award/update.
- Added attempt constraints and feedback contract.
- Added indicator mapping and XP model.
- Added persistence expectation for outcome/streak context.

Rationale: Prevents implementation ambiguity and test mismatch.

### D) UI/UX Spec Changes

#### Artifact: UI/UX Design
Section: Screen 4: Game Challenge

OLD:
- Placeholder/static behavior; no guided retry state details.

NEW:
- Structured layout: progress + indicators, question zone, coaching zone.
- Interaction rules for attempt progression and animation timing.
- CTA states (`Try Again` / `Continue`) by context.
- Explicit state handling: ready, wrong_first, correct_first, correct_second, assisted.

Rationale: Aligns screen behavior with pedagogical goals and UX consistency.

### E) Sprint Tracking Changes

#### Artifact: sprint-status.yaml
Section: Epic 2 and Epic 3 story registry

OLD:
- No entries for 2.5 and 3.4.

NEW:
- Added `2-5-performance-indicators-and-answer-micro-interactions: backlog`
- Added `3-4-streak-and-persistence-bonus-awards: backlog`

Rationale: Keeps tracker synchronized with approved scope.

## 5) Implementation Handoff

### Scope Classification
Moderate

### Handoff Recipients
- Product Owner / Scrum Master: backlog/story sequencing update and acceptance criteria alignment.
- Development Team: implement state machine, feedback timing, indicators, and XP engine.
- QA: add scenario coverage for attempt transitions, indicator outcomes, XP rules, and UI-state checks.

### Responsibilities
- PO/SM:
  - Confirm story order and dependencies for Epic 2 -> Epic 3.
  - Ensure newly added stories are planned before reward/evolution stories depending on XP quality.
- Dev:
  - Implement finite attempt flow and assisted acknowledgment gate.
  - Implement indicator rendering and interaction constraints.
  - Implement XP + streak + persistence bonus calculations.
- QA:
  - Validate no punitive labels/icons appear.
  - Validate 400-600ms explanation delay and state transitions.
  - Validate `9/9` => full progress bar and correct indicator progression.

### Success Criteria
- All challenge states follow approved state machine.
- Post-answer hero feedback always includes reasoning; wrong attempts include correct-answer explanation.
- Performance indicators and XP outcomes are deterministic and match acceptance criteria.
- Updated planning artifacts and sprint tracker remain consistent.

## Approval Note
User requested auto-approval and no step-by-step confirmation prompts for this run.
