# Story 3.1: XP and Pass Threshold Calculation

Status: done

## Story

As the system,
I want pass/fail and XP computed from attempt quality,
so that progression rewards learning effort and correctness.

## Acceptance Criteria

1. Base XP per question is computed exactly:
   - first-try correct = 10 XP
   - second-try correct = 6 XP
   - assisted resolution = 3 XP
   - skip = 0 XP
2. Challenge score tracks total correct outcomes and pass/fail remains `>=80%`.
3. Question outcome class is persisted for each answered question (`first_try_correct`, `second_try_correct`, `assisted`, `skipped`).
4. Per-question XP award is emitted once per question and cannot be double-awarded by repeated clicks.
5. XP award messaging is supportive and concise (e.g., `+10 XP! Amazing focus!`, `+6 XP! You fixed it!`, `+3 XP! Learning moment!`).
6. Level-complete summary includes total XP gained and pass/fail result derived from the same source-of-truth model.
7. Unit tests validate XP and pass-threshold calculations for mixed outcome sets.
8. Integration tests validate award-once behavior and summary values.

## Tasks / Subtasks

- [x] Implement XP calculation utility (AC: 1, 7)
  - [x] Add deterministic mapping from outcome class to base XP
  - [x] Add aggregate score + pass-threshold helper
- [x] Wire per-question award flow (AC: 3, 4, 5)
  - [x] Persist outcome class in challenge session state
  - [x] Guard against duplicate awards
  - [x] Render outcome-aligned XP message
- [x] Implement level-complete summary fields (AC: 2, 6)
  - [x] Show total XP and pass/fail from computed aggregates
- [x] Add automated validation coverage (AC: 7, 8)
  - [x] Unit tests for XP mapping and pass-threshold edge cases
  - [x] Integration tests for one-time award and summary correctness

## Dev Notes

### Scope Guardrails
- Streak and persistence bonuses are covered in Story 3.4.
- Guided retry transition rules remain in Story 3.2.

### Architecture and Coding Requirements
- Keep scoring logic in reusable `src/lib` utilities.
- Use one canonical challenge-session model for UI and persistence calculations.

### Source Intelligence
- Epic source: `_bmad-output/planning-artifacts/epics-mvp-grammar-paws-adventure.md` (Story 3.1).
- PRD source: `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md` (FR-04/FR-06).
- Architecture source: `docs/architecture.md` (Challenge runtime state model).

### References
- `docs/project-context.md`
- `docs/architecture.md`
- `docs/testing-strategy.md`
- `_bmad-output/planning-artifacts/prd-mvp-grammar-paws-adventure.md`

## Dev Agent Record

### Agent Model Used
GPT-5 Codex

### Debug Log References
- `npm run dev-story:validate`
- `npm run test:integration`
- `npm run test:acceptance`

### Completion Notes List
- Added XP and pass-threshold calculators in `src/lib/challengeScoring.js` with exact base mapping: first=10, second=6, assisted=3, skip=0, and pass threshold `>=80%`.
- Wired per-question outcome persistence and one-time XP messaging in `app/challenge/page.js` using canonical `questionOutcomes` model.
- Added level-complete summary with base XP, total XP, pass/fail, score percentage, and persisted `latestChallenge` snapshot in `gpa_player_progress_v1`.
- Manual Test Steps (executed): complete full challenge with correct answers, verify per-question XP messaging, verify summary total (`125`) and pass state, verify persisted `latestChallenge` contains 9 outcomes and consistent XP totals.
- Manual Validation Result: PASS.
- Automated Validation Result: PASS (`build`, unit, integration, acceptance).

### File List
- app/challenge/page.js
- src/lib/challengeScoring.js
- src/lib/challengeStateModel.js
- tests/unit/story-3-1-xp-and-pass-threshold-calculation.unit.test.js
- tests/integration/story-3-1-xp-and-pass-threshold-calculation.integration.test.jsx
- tests/acceptance/story-3-1-xp-and-pass-threshold-calculation.acceptance.spec.js
- _bmad-output/implementation-artifacts/3-1-xp-and-pass-threshold-calculation.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log
- 2026-03-05: Story created as implementation-ready (`ready-for-dev`).
- 2026-03-05: Implemented XP and pass-threshold runtime with persisted per-question outcomes and validation coverage; status moved to `review`.
- 2026-03-06: Hardened acceptance flow against topic-hydration race and added explicit sub-80% unit pass-threshold validation.
